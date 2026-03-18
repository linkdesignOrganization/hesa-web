import { EmailClient, KnownEmailSendStatus } from '@azure/communication-email';

let emailClient: EmailClient | null = null;

function getEmailClient(): EmailClient | null {
  if (emailClient) return emailClient;
  const connectionString = process.env.EMAIL_CONNECTION_STRING;
  if (!connectionString) {
    console.warn('EMAIL_CONNECTION_STRING not set — email sending disabled');
    return null;
  }
  emailClient = new EmailClient(connectionString);
  return emailClient;
}

interface ContactEmailData {
  source: 'general' | 'manufacturer';
  name: string;
  email: string;
  phone?: string;
  type: string;
  message: string;
  productOfInterest?: string;
  // Manufacturer-specific
  companyName?: string;
  country?: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  productTypes?: string;
}

function buildGeneralEmailHtml(data: ContactEmailData): string {
  const typeLabels: Record<string, string> = {
    info: 'Informacion de productos',
    comercial: 'Condiciones comerciales',
    soporte: 'Soporte',
    otro: 'Otro',
  };

  return `
    <div style="font-family: Inter, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
      <div style="background: #008DC9; color: white; padding: 20px 24px; border-radius: 12px 12px 0 0;">
        <h1 style="margin: 0; font-size: 20px;">Nuevo Mensaje de Contacto</h1>
      </div>
      <div style="background: white; border: 1px solid #E5E7EB; border-top: none; padding: 24px; border-radius: 0 0 12px 12px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px 0; color: #6B7280; font-size: 14px; width: 140px;">Nombre:</td><td style="padding: 8px 0; font-size: 14px; font-weight: 500;">${escapeHtml(data.name)}</td></tr>
          <tr><td style="padding: 8px 0; color: #6B7280; font-size: 14px;">Email:</td><td style="padding: 8px 0; font-size: 14px;"><a href="mailto:${escapeHtml(data.email)}" style="color: #008DC9;">${escapeHtml(data.email)}</a></td></tr>
          ${data.phone ? `<tr><td style="padding: 8px 0; color: #6B7280; font-size: 14px;">Telefono:</td><td style="padding: 8px 0; font-size: 14px;">${escapeHtml(data.phone)}</td></tr>` : ''}
          <tr><td style="padding: 8px 0; color: #6B7280; font-size: 14px;">Tipo:</td><td style="padding: 8px 0; font-size: 14px;"><span style="background: #EBF5FF; color: #008DC9; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600;">${typeLabels[data.type] || data.type}</span></td></tr>
          ${data.productOfInterest ? `<tr><td style="padding: 8px 0; color: #6B7280; font-size: 14px;">Producto:</td><td style="padding: 8px 0; font-size: 14px;">${escapeHtml(data.productOfInterest)}</td></tr>` : ''}
        </table>
        <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 16px 0;">
        <h3 style="font-size: 14px; color: #6B7280; margin: 0 0 8px;">Mensaje:</h3>
        <p style="font-size: 15px; line-height: 1.6; color: #1F2937; margin: 0; white-space: pre-wrap;">${escapeHtml(data.message)}</p>
      </div>
      <p style="font-size: 12px; color: #6B7280; text-align: center; margin-top: 16px;">Este mensaje fue enviado desde el formulario de contacto de hesa.co.cr</p>
    </div>
  `;
}

function buildManufacturerEmailHtml(data: ContactEmailData): string {
  return `
    <div style="font-family: Inter, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
      <div style="background: #7C3AED; color: white; padding: 20px 24px; border-radius: 12px 12px 0 0;">
        <h1 style="margin: 0; font-size: 20px;">Nuevo Mensaje de Fabricante</h1>
      </div>
      <div style="background: white; border: 1px solid #E5E7EB; border-top: none; padding: 24px; border-radius: 0 0 12px 12px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px 0; color: #6B7280; font-size: 14px; width: 140px;">Empresa:</td><td style="padding: 8px 0; font-size: 14px; font-weight: 500;">${escapeHtml(data.companyName || '')}</td></tr>
          <tr><td style="padding: 8px 0; color: #6B7280; font-size: 14px;">Pais:</td><td style="padding: 8px 0; font-size: 14px;">${escapeHtml(data.country || '')}</td></tr>
          <tr><td style="padding: 8px 0; color: #6B7280; font-size: 14px;">Contacto:</td><td style="padding: 8px 0; font-size: 14px;">${escapeHtml(data.contactName || data.name)}</td></tr>
          <tr><td style="padding: 8px 0; color: #6B7280; font-size: 14px;">Email:</td><td style="padding: 8px 0; font-size: 14px;"><a href="mailto:${escapeHtml(data.contactEmail || data.email)}" style="color: #008DC9;">${escapeHtml(data.contactEmail || data.email)}</a></td></tr>
          ${data.contactPhone ? `<tr><td style="padding: 8px 0; color: #6B7280; font-size: 14px;">Telefono:</td><td style="padding: 8px 0; font-size: 14px;">${escapeHtml(data.contactPhone)}</td></tr>` : ''}
          ${data.productTypes ? `<tr><td style="padding: 8px 0; color: #6B7280; font-size: 14px;">Productos:</td><td style="padding: 8px 0; font-size: 14px;">${escapeHtml(data.productTypes)}</td></tr>` : ''}
        </table>
        <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 16px 0;">
        <h3 style="font-size: 14px; color: #6B7280; margin: 0 0 8px;">Mensaje:</h3>
        <p style="font-size: 15px; line-height: 1.6; color: #1F2937; margin: 0; white-space: pre-wrap;">${escapeHtml(data.message)}</p>
      </div>
      <p style="font-size: 12px; color: #6B7280; text-align: center; margin-top: 16px;">Este mensaje fue enviado desde el formulario de distribuidores de hesa.co.cr</p>
    </div>
  `;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export async function sendContactNotification(data: ContactEmailData): Promise<boolean> {
  const client = getEmailClient();
  if (!client) {
    console.log('Email client not configured, skipping email notification');
    return false;
  }

  const sender = process.env.EMAIL_SENDER || '';
  const recipient = process.env.EMAIL_NOTIFICATION_TO || 'hola@linkdesign.cr';

  if (!sender) {
    console.warn('EMAIL_SENDER not configured');
    return false;
  }

  const subject = data.source === 'manufacturer'
    ? `[HESA] Nuevo mensaje de fabricante: ${data.companyName || data.name}`
    : `[HESA] Nuevo mensaje de contacto: ${data.name}`;

  const htmlContent = data.source === 'manufacturer'
    ? buildManufacturerEmailHtml(data)
    : buildGeneralEmailHtml(data);

  try {
    const poller = await client.beginSend({
      senderAddress: sender,
      content: {
        subject,
        html: htmlContent,
      },
      recipients: {
        to: [{ address: recipient }],
      },
    });

    const result = await poller.pollUntilDone();
    if (result.status === KnownEmailSendStatus.Succeeded) {
      console.log(`Email notification sent successfully for ${data.source} contact`);
      return true;
    }
    console.warn('Email send status:', result.status);
    return false;
  } catch (error) {
    console.error('Failed to send email notification:', error);
    return false;
  }
}
