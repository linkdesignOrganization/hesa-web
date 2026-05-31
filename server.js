'use strict';

/**
 * hesa-web — servidor estatico zero-dependencia para Azure App Service (Linux, Node 22).
 *
 * Replica el comportamiento de staticwebapp.config.json del SWA que se migra:
 *   - SPA fallback amplio: cualquier ruta que no sea un archivo real -> index.html 200
 *     (equivale a responseOverrides 404 -> /index.html statusCode 200).
 *   - Redirect 301 /sitemap.xml -> backend hesa-api (replica el route del SWA).
 *   - globalHeaders, incluido el CSP completo, copiados literalmente.
 *   - Cache-Control: hashed JS/CSS/fonts immutable 1 ano; index.html no-cache; resto razonable.
 *   - mimeTypes correctos.
 * NO hay proxy /api: el frontend llama a la API por URL absoluta (hesa-api.azurewebsites.net).
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const PORT = process.env.PORT || 8080;

// Raiz estatica: ./browser (artefacto desplegado) o dist/hesa-web/browser (local).
const CANDIDATE_ROOTS = [
  path.join(__dirname, 'browser'),
  path.join(__dirname, 'dist', 'hesa-web', 'browser'),
];
const ROOT =
  CANDIDATE_ROOTS.find((p) => {
    try {
      return fs.statSync(path.join(p, 'index.html')).isFile();
    } catch (_) {
      return false;
    }
  }) || CANDIDATE_ROOTS[0];

const INDEX_HTML = path.join(ROOT, 'index.html');

// Redirect del sitemap al backend (replica el route 301 del SWA).
const SITEMAP_REDIRECT = 'https://hesa-api.azurewebsites.net/api/public/sitemap.xml';

// Cabeceras de seguridad: copia LITERAL de globalHeaders de staticwebapp.config.json.
const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  'Content-Security-Policy':
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https: blob:; connect-src 'self' https://hesa-api.azurewebsites.net https://*.blob.core.windows.net https://login.microsoftonline.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self'",
};

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.xml': 'application/xml',
  '.txt': 'text/plain; charset=utf-8',
  '.map': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.otf': 'font/otf',
  '.webmanifest': 'application/manifest+json',
};

// Extensiones con contenido inmutable (hasheado por Angular o fonts estables).
const IMMUTABLE_EXT = new Set(['.js', '.mjs', '.css', '.woff', '.woff2', '.ttf', '.eot', '.otf']);

// Tipos que vale la pena comprimir con gzip.
const COMPRESSIBLE = new Set([
  '.html', '.js', '.mjs', '.css', '.json', '.xml', '.txt', '.map', '.svg', '.webmanifest',
]);

function contentType(ext) {
  return MIME_TYPES[ext] || 'application/octet-stream';
}

function cacheControl(ext) {
  if (ext === '.html') return 'no-cache';
  if (IMMUTABLE_EXT.has(ext)) return 'public, max-age=31536000, immutable';
  return 'public, max-age=86400'; // imagenes/media/datos: cache razonable con revalidacion
}

function setCommonHeaders(res) {
  for (const k in SECURITY_HEADERS) res.setHeader(k, SECURITY_HEADERS[k]);
}

// Resuelve la ruta dentro de ROOT evitando path traversal. Devuelve null si escapa.
function safeJoin(root, urlPath) {
  let decoded;
  try {
    decoded = decodeURIComponent(urlPath);
  } catch (_) {
    decoded = urlPath;
  }
  const resolved = path.normalize(path.join(root, decoded));
  if (resolved !== root && !resolved.startsWith(root + path.sep)) return null;
  return resolved;
}

// index.html cacheado en memoria (ruta caliente del SPA fallback). Se recarga al reiniciar
// el proceso, lo que ocurre en cada deploy por RUN_FROM_PACKAGE.
let INDEX_BUF = null;
let INDEX_GZ = null;
function loadIndex() {
  try {
    INDEX_BUF = fs.readFileSync(INDEX_HTML);
    INDEX_GZ = zlib.gzipSync(INDEX_BUF);
  } catch (_) {
    INDEX_BUF = null;
    INDEX_GZ = null;
  }
}
loadIndex();

function acceptsGzip(req) {
  return /\bgzip\b/.test(req.headers['accept-encoding'] || '');
}

// SPA fallback: index.html con 200 (replica responseOverrides 404 -> index 200).
function serveIndexFallback(req, res, statusCode) {
  setCommonHeaders(res);
  if (!INDEX_BUF) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.end('500 Internal Server Error');
    return;
  }
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Vary', 'Accept-Encoding');
  res.statusCode = statusCode || 200;
  if (acceptsGzip(req)) {
    res.setHeader('Content-Encoding', 'gzip');
    res.setHeader('Content-Length', INDEX_GZ.length);
    res.end(req.method === 'HEAD' ? undefined : INDEX_GZ);
  } else {
    res.setHeader('Content-Length', INDEX_BUF.length);
    res.end(req.method === 'HEAD' ? undefined : INDEX_BUF);
  }
}

function sendBuffer(req, res, buf, ext, statusCode, lastModified, etag) {
  setCommonHeaders(res);
  res.setHeader('Content-Type', contentType(ext));
  res.setHeader('Cache-Control', cacheControl(ext));
  if (lastModified) res.setHeader('Last-Modified', lastModified);
  if (etag) res.setHeader('ETag', etag);
  const compressible = COMPRESSIBLE.has(ext);
  if (compressible) res.setHeader('Vary', 'Accept-Encoding');
  res.statusCode = statusCode;
  if (acceptsGzip(req) && compressible && buf.length > 256) {
    const gz = zlib.gzipSync(buf);
    res.setHeader('Content-Encoding', 'gzip');
    res.setHeader('Content-Length', gz.length);
    res.end(req.method === 'HEAD' ? undefined : gz);
  } else {
    res.setHeader('Content-Length', buf.length);
    res.end(req.method === 'HEAD' ? undefined : buf);
  }
}

const server = http.createServer((req, res) => {
  try {
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      setCommonHeaders(res);
      res.statusCode = 405;
      res.setHeader('Allow', 'GET, HEAD');
      res.end('405 Method Not Allowed');
      return;
    }

    const urlPath = (req.url || '/').split('?')[0].split('#')[0];

    // Redirect 301 del sitemap al backend (igual que el route del SWA).
    if (urlPath === '/sitemap.xml') {
      setCommonHeaders(res);
      res.statusCode = 301;
      res.setHeader('Location', SITEMAP_REDIRECT);
      res.end();
      return;
    }

    const filePath = safeJoin(ROOT, urlPath === '/' ? '/index.html' : urlPath);
    if (!filePath) {
      serveIndexFallback(req, res, 200);
      return;
    }

    fs.stat(filePath, (err, stat) => {
      if (err || !stat.isFile()) {
        // No existe o es directorio -> SPA fallback (index.html 200).
        serveIndexFallback(req, res, 200);
        return;
      }

      const ext = path.extname(filePath).toLowerCase();
      const lastModified = stat.mtime.toUTCString();
      const etag = 'W/"' + stat.size + '-' + Math.floor(stat.mtimeMs) + '"';

      // Revalidacion condicional por ETag -> 304.
      if (req.headers['if-none-match'] === etag) {
        setCommonHeaders(res);
        res.setHeader('Cache-Control', cacheControl(ext));
        res.setHeader('ETag', etag);
        res.setHeader('Last-Modified', lastModified);
        res.statusCode = 304;
        res.end();
        return;
      }

      fs.readFile(filePath, (rerr, buf) => {
        if (rerr) {
          serveIndexFallback(req, res, 200);
          return;
        }
        sendBuffer(req, res, buf, ext, 200, lastModified, etag);
      });
    });
  } catch (e) {
    try {
      setCommonHeaders(res);
      res.statusCode = 500;
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.end('500 Internal Server Error');
    } catch (_) {
      /* respuesta ya enviada */
    }
  }
});

server.on('error', (err) => {
  console.error('server error:', err);
  process.exit(1);
});

server.listen(PORT, () => {
  console.log(
    'hesa-web static server listening on :' + PORT + ' (root: ' + ROOT + ', index: ' +
      (INDEX_BUF ? 'loaded' : 'MISSING') + ')'
  );
});
