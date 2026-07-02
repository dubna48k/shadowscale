-- Subscriptions: crear tabla + RLS admin
-- Se puede correr múltiples veces (idempotente)

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  user_email text,
  plan_name text not null,
  plan_price numeric not null default 0,
  status text not null default 'pending' check (status in ('pending', 'active', 'expired', 'cancelled')),
  efipay_reference text,
  ref_code text,
  starts_at timestamptz,
  expires_at timestamptz,
  updated_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists idx_subs_user      on public.subscriptions(user_id);
create index if not exists idx_subs_reference on public.subscriptions(efipay_reference);
create index if not exists idx_subs_status    on public.subscriptions(status);

-- RLS
alter table public.subscriptions enable row level security;

drop policy if exists "subs_user_read_own" on public.subscriptions;
create policy "subs_user_read_own" on public.subscriptions
  for select using (auth.uid() = user_id or public.is_admin());

drop policy if exists "subs_admin_all" on public.subscriptions;
create policy "subs_admin_all" on public.subscriptions
  for all using (public.is_admin()) with check (public.is_admin());
