import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { jwksClient, authConfig } from '../config/auth';

export interface AuthRequest extends Request {
  user?: {
    oid: string;
    name: string;
    email: string;
  };
}

function getSigningKey(header: jwt.JwtHeader): Promise<string> {
  return new Promise((resolve, reject) => {
    jwksClient.getSigningKey(header.kid, (err, key) => {
      if (err) {
        reject(err);
        return;
      }
      const signingKey = key?.getPublicKey();
      if (!signingKey) {
        reject(new Error('No signing key found'));
        return;
      }
      resolve(signingKey);
    });
  });
}

export async function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'No authorization token provided' });
    return;
  }

  const token = authHeader.substring(7);

  try {
    // Decode header to get kid
    const decoded = jwt.decode(token, { complete: true });
    if (!decoded || !decoded.header) {
      res.status(401).json({ error: 'Invalid token format' });
      return;
    }

    const signingKey = await getSigningKey(decoded.header);

    const payload = jwt.verify(token, signingKey, {
      audience: [authConfig.audience, `api://${authConfig.audience}`],
      issuer: authConfig.issuer,
      algorithms: ['RS256'],
    }) as jwt.JwtPayload;

    req.user = {
      oid: payload.oid || '',
      name: payload.name || '',
      email: payload.preferred_username || payload.email || '',
    };

    next();
  } catch (error: any) {
    const decoded = jwt.decode(token, { complete: true });
    const payload = decoded?.payload as any;
    console.error('Auth middleware error:', {
      message: error.message,
      tokenAud: payload?.aud,
      tokenIss: payload?.iss,
      expectedAud: [authConfig.audience, `api://${authConfig.audience}`],
      expectedIss: authConfig.issuer,
      clientId: authConfig.clientId,
      tenantId: authConfig.tenantId,
    });
    res.status(401).json({
      error: 'Invalid or expired token',
      debug: {
        tokenAud: payload?.aud,
        tokenIss: payload?.iss,
        expectedAud: [authConfig.audience, `api://${authConfig.audience}`],
        expectedIss: authConfig.issuer,
      }
    });
  }
}
