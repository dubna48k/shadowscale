# ShadowScale — Guía de activación

Pasos para dejar todo funcional. Sigue el orden.

---

## 1. Base de datos (Supabase → SQL Editor)
Pega y ejecuta el contenido de [`db/schema.sql`](db/schema.sql). Crea afiliados, perfiles/roles, columnas geo, columnas de planes y la seguridad RLS. Es seguro correrlo varias veces.

---

## 2. Crear tu usuario admin
1. Entra a `https://shadowscale.pro/admin` → regístrate NO existe; primero crea el usuario:
   - Supabase → **Authentication → Users → Add user** → tu email + contraseña.
2. Hazte admin (Supabase → SQL Editor):
   ```sql
   update public.profiles set role = 'admin' where email = 'robles9301@gmail.com';
   ```
3. Entra a `/admin` con ese email y contraseña. (Ver credenciales abajo.)

---

## 3. Login con Google (Supabase Auth)
1. **Google Cloud Console** → crea un proyecto → **APIs y servicios → Pantalla de consentimiento OAuth** (External, modo prueba o producción).
2. **Credenciales → Crear credenciales → ID de cliente OAuth → Aplicación web**.
   - Orígenes autorizados: `https://shadowscale.pro`
   - URI de redirección autorizada:
     `https://xqeqjutulgxiwfkuflla.supabase.co/auth/v1/callback`
3. Copia **Client ID** y **Client Secret**.
4. Supabase → **Authentication → Providers → Google** → pega Client ID y Secret → Enable.
5. Supabase → **Authentication → URL Configuration**:
   - Site URL: `https://shadowscale.pro`
   - Redirect URLs: `https://shadowscale.pro/afiliados/dashboard`, `https://shadowscale.pro/admin`

---

## 4. Correos con Resend (sin caer en spam)
1. Crea cuenta en **resend.com** → **API Keys → Create** → copia `re_...`.
2. **Domains → Add Domain → shadowscale.pro**. Resend te dará 3 registros DNS. Pégalos donde administras el dominio (Vercel/Cloudflare/GoDaddy):

   | Tipo | Nombre | Valor |
   |------|--------|-------|
   | TXT  | `send` (o el que indique) | `v=spf1 include:amazonses.com ~all` |
   | CNAME / TXT (DKIM) | `resend._domainkey` | (el valor exacto que te da Resend) |
   | TXT (DMARC) | `_dmarc` | `v=DMARC1; p=quarantine; rua=mailto:dmarc@shadowscale.pro` |

   > Los valores exactos los genera Resend — usa los suyos. SPF + DKIM + DMARC son los 3 que evitan el spam.
3. Espera a que Resend marque el dominio como **Verified** (minutos a horas).
4. Despliega la Edge Function y carga los secrets:
   ```bash
   supabase functions deploy send-email
   supabase secrets set RESEND_API_KEY=re_tuclave
   supabase secrets set EMAIL_FROM="ShadowScale <no-reply@shadowscale.pro>"
   ```
   Correos automáticos: bienvenida al registrarse afiliado, aprobación al aprobarlo en el admin.

---

## 5. Soporte por Discord
Admin → **Páginas → Soporte** → pega la invitación de Discord (ej: `https://discord.gg/tucanal`). Aparece como canal recomendado en `/soporte`.

---

## 6. Variables en Vercel
Settings → Environment Variables:
```
VITE_SUPABASE_URL=https://xqeqjutulgxiwfkuflla.supabase.co
VITE_SUPABASE_ANON_KEY=tu_anon_public_key
```
(El `service_role` NUNCA va en Vercel ni en el repo.)

---

## Flujo de afiliados (ya funcional)
- `/afiliados` — landing pública
- `/afiliados/registro` — registro con Google o email
- `/afiliados/dashboard` — panel del afiliado: link único, clicks, referidos, comisión
- `/?ref=CODIGO` — registra el click automáticamente
- Admin → **Afiliados** — aprobar / rechazar / suspender + métricas
