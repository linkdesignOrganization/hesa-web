import jwksRsa from 'jwks-rsa';

const tenantId = process.env.ENTRA_TENANT_ID || '';
const clientId = process.env.ENTRA_CLIENT_ID || '';

export const authConfig = {
  tenantId,
  clientId,
  authority: `https://login.microsoftonline.com/${tenantId}`,
  jwksUri: `https://login.microsoftonline.com/${tenantId}/discovery/v2.0/keys`,
  issuer: `https://login.microsoftonline.com/${tenantId}/v2.0`,
  audience: clientId,
};

export const jwksClient = jwksRsa({
  jwksUri: authConfig.jwksUri,
  cache: true,
  cacheMaxAge: 86400000, // 24 hours
  rateLimit: true,
  jwksRequestsPerMinute: 10,
});
