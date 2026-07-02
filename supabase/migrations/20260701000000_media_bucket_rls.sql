-- El bucket "media" (logos de tools, video/imagen de la sección browser) nunca
-- tuvo policies propias en storage.objects, por eso cualquier upload() desde el
-- admin CMS (cliente, anon key) choca con "new row violates row-level security
-- policy" — sin policy explícita, RLS deniega todo salvo al service_role.
-- Lectura pública (son assets públicos de la landing); escritura solo admin,
-- mismo patrón public.is_admin() que ya usa el resto del esquema.

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do update set public = true;

drop policy if exists "media_public_read" on storage.objects;
create policy "media_public_read"
on storage.objects for select
using (bucket_id = 'media');

drop policy if exists "media_admin_write" on storage.objects;
create policy "media_admin_write"
on storage.objects for insert
with check (bucket_id = 'media' and public.is_admin());

drop policy if exists "media_admin_update" on storage.objects;
create policy "media_admin_update"
on storage.objects for update
using (bucket_id = 'media' and public.is_admin())
with check (bucket_id = 'media' and public.is_admin());

drop policy if exists "media_admin_delete" on storage.objects;
create policy "media_admin_delete"
on storage.objects for delete
using (bucket_id = 'media' and public.is_admin());
