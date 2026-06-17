-- ════════════════════════════════════════════════════════════════════════════
-- ShadowScale — Esquema completo (afiliados, auth, geo, seguridad RLS)
-- Ejecutar en Supabase → SQL Editor. Es idempotente: se puede correr varias veces.
-- ════════════════════════════════════════════════════════════════════════════

-- ─── 1. PERFILES Y ROLES ─────────────────────────────────────────────────────
-- Cada usuario de Supabase Auth tiene un perfil con un rol.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  role text not null default 'user' check (role in ('user', 'affiliate', 'admin')),
  created_at timestamptz not null default now()
);

-- Crear perfil automáticamente cuando se registra un usuario nuevo.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Helper: ¿el usuario actual es admin? (security definer evita recursión en RLS)
create or replace function public.is_admin()
returns boolean
language sql
security definer set search_path = public
stable
as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

-- ─── 2. COLUMNAS GEO EN ANALYTICS ────────────────────────────────────────────
alter table public.analytics_visits add column if not exists ip text;
alter table public.analytics_visits add column if not exists country text;
alter table public.analytics_visits add column if not exists country_code text;
alter table public.analytics_visits add column if not exists city text;
alter table public.analytics_visits add column if not exists region text;

-- ─── 3. COLUMNAS DE PRESENTACIÓN EN PLANS ────────────────────────────────────
alter table public.plans add column if not exists subtitle text;
alter table public.plans add column if not exists old_price text;
alter table public.plans add column if not exists discount text;
alter table public.plans add column if not exists top_badge text;

-- ─── 4. AFILIADOS ────────────────────────────────────────────────────────────
create table if not exists public.affiliates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  code text not null unique,
  name text not null,
  email text not null,
  status text not null default 'pending' check (status in ('pending','approved','rejected','suspended')),
  commission_rate numeric not null default 30,
  payout_method text,
  payout_details text,
  created_at timestamptz not null default now(),
  unique (user_id)
);

create index if not exists idx_affiliates_code on public.affiliates(code);
create index if not exists idx_affiliates_user on public.affiliates(user_id);

-- ─── 5. REFERIDOS / TRACKING ─────────────────────────────────────────────────
create table if not exists public.referrals (
  id uuid primary key default gen_random_uuid(),
  affiliate_id uuid not null references public.affiliates(id) on delete cascade,
  visitor_ip text,
  country text,
  status text not null default 'click' check (status in ('click','signup','converted')),
  amount numeric,
  created_at timestamptz not null default now()
);

create index if not exists idx_referrals_affiliate on public.referrals(affiliate_id);

-- ════════════════════════════════════════════════════════════════════════════
-- 6. SEGURIDAD — RLS (Row Level Security)
-- ════════════════════════════════════════════════════════════════════════════

-- ─── Contenido público: lectura para todos, escritura solo admin ─────────────
do $$
declare t text;
begin
  foreach t in array array['tools','categories','plans','site_settings'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('drop policy if exists "%s_public_read" on public.%I', t, t);
    execute format('create policy "%s_public_read" on public.%I for select using (true)', t, t);
    execute format('drop policy if exists "%s_admin_write" on public.%I', t, t);
    execute format('create policy "%s_admin_write" on public.%I for all using (public.is_admin()) with check (public.is_admin())', t, t);
  end loop;
end $$;

-- ─── Analytics: inserción anónima (tracking), lectura solo admin ─────────────
alter table public.analytics_visits enable row level security;
drop policy if exists "visits_insert_any" on public.analytics_visits;
create policy "visits_insert_any" on public.analytics_visits for insert with check (true);
drop policy if exists "visits_admin_read" on public.analytics_visits;
create policy "visits_admin_read" on public.analytics_visits for select using (public.is_admin());

alter table public.analytics_events enable row level security;
drop policy if exists "events_insert_any" on public.analytics_events;
create policy "events_insert_any" on public.analytics_events for insert with check (true);
drop policy if exists "events_admin_read" on public.analytics_events;
create policy "events_admin_read" on public.analytics_events for select using (public.is_admin());

-- ─── Profiles ────────────────────────────────────────────────────────────────
alter table public.profiles enable row level security;
drop policy if exists "profiles_read_own" on public.profiles;
create policy "profiles_read_own" on public.profiles for select using (auth.uid() = id or public.is_admin());
drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);
drop policy if exists "profiles_admin_all" on public.profiles;
create policy "profiles_admin_all" on public.profiles for all using (public.is_admin()) with check (public.is_admin());

-- ─── Affiliates ──────────────────────────────────────────────────────────────
alter table public.affiliates enable row level security;
-- El afiliado ve y crea su propia fila; el admin ve/gestiona todas.
drop policy if exists "aff_read_own" on public.affiliates;
create policy "aff_read_own" on public.affiliates for select using (auth.uid() = user_id or public.is_admin());
drop policy if exists "aff_insert_own" on public.affiliates;
create policy "aff_insert_own" on public.affiliates for insert with check (auth.uid() = user_id and status = 'pending');
drop policy if exists "aff_update_own" on public.affiliates;
create policy "aff_update_own" on public.affiliates for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "aff_admin_all" on public.affiliates;
create policy "aff_admin_all" on public.affiliates for all using (public.is_admin()) with check (public.is_admin());

-- Evita que un afiliado se auto-apruebe o se suba la comisión.
create or replace function public.protect_affiliate_fields()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if not public.is_admin() then
    new.status := old.status;
    new.commission_rate := old.commission_rate;
    new.code := old.code;
  end if;
  return new;
end;
$$;
drop trigger if exists trg_protect_affiliate on public.affiliates;
create trigger trg_protect_affiliate before update on public.affiliates
  for each row execute function public.protect_affiliate_fields();

-- ─── Referrals ───────────────────────────────────────────────────────────────
alter table public.referrals enable row level security;
-- Inserción anónima para registrar clicks (?ref=). Lectura: dueño del afiliado o admin.
drop policy if exists "ref_insert_any" on public.referrals;
create policy "ref_insert_any" on public.referrals for insert with check (status = 'click');
drop policy if exists "ref_read_own" on public.referrals;
create policy "ref_read_own" on public.referrals for select using (
  public.is_admin() or exists (
    select 1 from public.affiliates a where a.id = referrals.affiliate_id and a.user_id = auth.uid()
  )
);
drop policy if exists "ref_admin_all" on public.referrals;
create policy "ref_admin_all" on public.referrals for all using (public.is_admin()) with check (public.is_admin());

-- RPC seguro para registrar un click de referido por código (sin exponer la tabla).
create or replace function public.track_referral_click(ref_code text, ip text default null, geo_country text default null)
returns void language plpgsql security definer set search_path = public as $$
declare aff_id uuid;
begin
  select id into aff_id from public.affiliates where code = ref_code and status = 'approved' limit 1;
  if aff_id is not null then
    insert into public.referrals (affiliate_id, visitor_ip, country, status)
    values (aff_id, ip, geo_country, 'click');
  end if;
end;
$$;
grant execute on function public.track_referral_click(text, text, text) to anon, authenticated;

-- ════════════════════════════════════════════════════════════════════════════
-- 7. CREAR TU USUARIO ADMIN
-- Después de registrarte en /admin (o crear el usuario en Authentication → Users),
-- corre esto reemplazando el email para darte rol admin:
--
--   update public.profiles set role = 'admin' where email = 'robles9301@gmail.com';
-- ════════════════════════════════════════════════════════════════════════════
