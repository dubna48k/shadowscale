-- Políticas RLS para que admin pueda actualizar referrals y affiliates

-- referrals: admin puede hacer todo
drop policy if exists "referrals_admin_all" on public.referrals;
create policy "referrals_admin_all" on public.referrals
  for all using (public.is_admin()) with check (public.is_admin());

-- referrals: lectura pública para que el tracking funcione
drop policy if exists "referrals_read_own" on public.referrals;
create policy "referrals_read_own" on public.referrals
  for select using (true);

-- affiliates: admin puede hacer todo (si no existe ya)
drop policy if exists "affiliates_admin_all" on public.affiliates;
create policy "affiliates_admin_all" on public.affiliates
  for all using (public.is_admin()) with check (public.is_admin());

-- affiliates: el propio afiliado puede leer su fila
drop policy if exists "affiliates_read_own" on public.affiliates;
create policy "affiliates_read_own" on public.affiliates
  for select using (auth.uid() = user_id or public.is_admin());
