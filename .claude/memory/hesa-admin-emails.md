---
name: hesa-admin-emails
description: Correos con acceso (o invitados) al panel admin de HESA
metadata: 
  node_type: memory
  type: project
  originSessionId: 90e4a8a7-e900-400d-9a99-64a2679a4651
---

Cuentas con acceso al panel `/admin` (todas son Guests B2B en el tenant `CEFSA-prod`):

- `hola@linkdesign.cr` — admin inicial / Global Administrator (Link Design, el dev). UPN `hola_linkdesign.cr#EXT#@cloud.cefsa.cr`.
- `info@hesa.co.cr` — invitado el 2026-06-02 a pedido del cliente. userId `fc284f98-d537-4596-a2d1-c9463199e05f`.
- `lherrera@hesa.co.cr` — invitado el 2026-06-02 (probablemente de la familia Herrera, dueños). userId `91608545-9e9b-48f7-804b-6d0721826fb6`.

Los dos de `@hesa.co.cr` quedaron en `PendingAcceptance`: deben aceptar el correo de invitación de Microsoft antes de poder entrar. Mecanismo y comandos en [[admin-access-entra-b2b]].
