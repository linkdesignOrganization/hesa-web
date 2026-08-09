---
name: admin-access-entra-b2b
description: "Cómo se otorga acceso al panel /admin — invitación B2B en Entra ID, no hay allowlist en el código"
metadata: 
  node_type: memory
  type: project
  originSessionId: 90e4a8a7-e900-400d-9a99-64a2679a4651
---

El acceso al panel `/admin` NO se controla en el código (no hay allowlist de correos). El backend (`api/src/middleware/auth.middleware.ts`) solo valida que el token JWT esté firmado por el tenant correcto y tenga el audience de la app — no verifica email, rol ni grupo.

Tenant: `CEFSA-prod` (`566e7def-c2ee-49b7-91e5-b045805f416a`). App "HESA Admin Panel" (clientId `b18eec6f-d578-4525-bcdb-9dd6f33c0527`, SP objectId `f1f66645-72b6-42e4-870b-b1b828f51567`).

**Implicación de seguridad:** la Enterprise App tiene `appRoleAssignmentRequired = false` y no define app roles. Por tanto **cualquier usuario que exista en el tenant (incluidos todos los invitados) puede entrar al panel admin**. El control de acceso real = "quién existe en el tenant".

**Para agregar un admin** (dominio externo como `hesa.co.cr` no está en el tenant → se invita como Guest B2B):
```
az rest --method post --url "https://graph.microsoft.com/v1.0/invitations" \
  --headers "Content-Type=application/json" \
  --body '{"invitedUserEmailAddress":"correo@dominio","inviteRedirectUrl":"https://hesa-web.azurewebsites.net/admin","sendInvitationMessage":true}'
```
El invitado queda en `PendingAcceptance` hasta que acepta el correo de Microsoft; recién ahí puede iniciar sesión. `hola@linkdesign.cr` (yo, vía `az`) es Global Administrator pero internamente es Guest: UPN real `hola_linkdesign.cr#EXT#@cloud.cefsa.cr`.

**Para endurecer** (si se pide restringir): poner `appRoleAssignmentRequired = true` en el SP y asignar usuarios explícitamente, o validar email/oid en el middleware. Ver [[hesa-admin-emails]].
