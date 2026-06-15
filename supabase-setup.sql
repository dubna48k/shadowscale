-- ============================================
-- ShadowScale CMS — Schema
-- Pega esto en Supabase > SQL Editor > Run
-- ============================================

-- Categorías
create table if not exists categories (
  id text primary key,
  label text not null,
  sort_order int default 0
);

-- Herramientas
create table if not exists tools (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category_id text references categories(id),
  color text default '#6366f1',
  initial text default '',
  domain text,
  badge text check (badge in ('nuevo', 'prueba')),
  note text,
  individual_price numeric default 0,
  status text default 'active' check (status in ('active', 'inactive', 'sold_out', 'coming_soon')),
  sort_order int default 99,
  created_at timestamptz default now()
);

-- Planes
create table if not exists plans (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  price numeric not null,
  status text default 'active' check (status in ('active', 'inactive', 'sold_out')),
  features text[] default '{}',
  highlight boolean default false,
  cta_text text default 'Comenzar ahora',
  cta_link text default 'https://app.shadowscale.pro/register',
  sort_order int default 99
);

-- Configuración del sitio
create table if not exists site_settings (
  id uuid primary key default gen_random_uuid(),
  key text unique not null,
  value text
);

-- RLS: acceso público de lectura (la web pública lo necesita)
alter table categories enable row level security;
alter table tools enable row level security;
alter table plans enable row level security;
alter table site_settings enable row level security;

create policy "public read categories" on categories for select using (true);
create policy "public read tools" on tools for select using (true);
create policy "public read plans" on plans for select using (true);
create policy "public read settings" on site_settings for select using (true);

-- Escritura pública también (el admin usa la anon key — para producción cambiar a service role)
create policy "public write categories" on categories for all using (true);
create policy "public write tools" on tools for all using (true);
create policy "public write plans" on plans for all using (true);
create policy "public write settings" on site_settings for all using (true);

-- ============================================
-- Datos iniciales
-- ============================================

insert into categories (id, label, sort_order) values
  ('all', 'Todo', 0),
  ('ia', 'IA', 1),
  ('design', 'Diseño', 2),
  ('video', 'Video y Edición', 3),
  ('spy', 'Espionaje', 4),
  ('ecommerce', 'Ecommerce', 5)
on conflict do nothing;

insert into tools (name, category_id, color, initial, domain, badge, note, individual_price, status, sort_order) values
  ('ChatGPT Plus', 'ia', '#10b981', 'G', 'openai.com', null, null, 22, 'active', 1),
  ('Claude Pro', 'ia', '#f97316', 'C', 'anthropic.com', 'nuevo', null, 20, 'active', 2),
  ('Perplexity Pro', 'ia', '#14b8a6', 'P', 'perplexity.ai', null, null, 20, 'active', 3),
  ('Gemini Advanced', 'ia', '#0ea5e9', 'G', 'google.com', 'nuevo', null, 20, 'active', 4),
  ('Grok Premium', 'ia', '#737373', 'G', 'x.ai', null, null, 16, 'active', 5),
  ('ElevenLabs Creator', 'ia', '#6b7280', 'E', 'elevenlabs.io', null, null, 22, 'active', 6),
  ('Higgsfield Plus', 'ia', '#ec4899', 'H', 'higgsfield.ai', null, 'Solo modelos ILIMITADOS · Sin límite de renders', 39, 'active', 7),
  ('Leonardo AI Pro', 'ia', '#a855f7', 'L', 'leonardo.ai', null, null, 60, 'active', 8),
  ('Hailuo AI', 'ia', '#d97706', 'H', null, 'nuevo', 'Acceso compartido · Créditos rotativos', 199, 'active', 9),
  ('Canva Pro', 'design', '#06b6d4', 'C', 'canva.com', null, null, 13, 'active', 10),
  ('Freepik Premium', 'design', '#1d4ed8', 'F', 'freepik.com', null, null, 12, 'active', 11),
  ('Envato Elements', 'design', '#65a30d', 'E', 'elements.envato.com', null, null, 17, 'active', 12),
  ('Midjourney', 'design', '#6366f1', 'M', 'midjourney.com', null, null, 30, 'active', 13),
  ('CapCut Pro', 'video', '#8b5cf6', 'C', 'capcut.com', null, null, 10, 'active', 14),
  ('Runway Pro', 'video', '#f43f5e', 'R', 'runwayml.com', null, '500 créditos/mes · Se renuevan el día 1', 100, 'active', 15),
  ('Seedance Pro', 'video', '#f59e0b', 'S', null, null, null, 16, 'active', 16),
  ('AdSpy', 'spy', '#dc2626', 'A', 'adspy.com', null, null, 149, 'active', 17),
  ('Minea', 'spy', '#c026d3', 'M', 'minea.com', null, null, 99, 'active', 18),
  ('SimilarWeb', 'spy', '#0891b2', 'S', 'similarweb.com', null, null, 125, 'active', 19),
  ('Kalodata', 'ecommerce', '#7c3aed', 'K', 'kalodata.com', null, null, 99, 'active', 20),
  ('Dropkiller', 'ecommerce', '#16a34a', 'D', null, 'nuevo', null, 49, 'active', 21),
  ('FastMoss', 'ecommerce', '#059669', 'F', 'fastmoss.com', null, null, 49, 'active', 22)
on conflict do nothing;

insert into plans (name, price, status, features, highlight, cta_text, cta_link, sort_order) values
  ('Starter', 14.9, 'active', ARRAY['4 herramientas incluidas', 'Acceso instantáneo', 'Soporte por WhatsApp', '3 días gratis'], false, 'Comenzar gratis', 'https://app.shadowscale.pro/register', 1),
  ('Pro', 24.9, 'active', ARRAY['7 herramientas incluidas', 'Acceso instantáneo', 'Soporte prioritario', '3 días gratis', 'Sin límite de uso'], true, 'Comenzar gratis', 'https://app.shadowscale.pro/register', 2),
  ('Elite', 39.9, 'active', ARRAY['10+ herramientas incluidas', 'Acceso instantáneo', 'Soporte VIP 24/7', '3 días gratis', 'Herramientas exclusivas'], false, 'Comenzar gratis', 'https://app.shadowscale.pro/register', 3)
on conflict do nothing;

insert into site_settings (key, value) values
  ('banner_text', '🎉 Prueba 3 días gratis — Sin tarjeta de crédito'),
  ('banner_link', 'https://app.shadowscale.pro/register'),
  ('banner_visible', 'true'),
  ('cta_text', 'Comenzar gratis — 3 días'),
  ('cta_link', 'https://app.shadowscale.pro/register'),
  ('price_card_total', '$1,453'),
  ('price_card_monthly', '$14.9'),
  ('footer_copyright', '© 2025 ShadowScale · Todos los derechos reservados')
on conflict (key) do nothing;
