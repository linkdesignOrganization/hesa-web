import dotenv from 'dotenv';
import path from 'path';

// Load .env from project root (one level up from api/)
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import multer from 'multer';
import { connectDatabase } from './config/database';
import { securityHeaders } from './middleware/security-headers.middleware';
import { authMiddleware } from './middleware/auth.middleware';
import { seedCategories } from './services/category.service';
import { seedSiteConfig } from './services/site-config.service';

// Public routes
import publicProductsRoutes from './routes/public/products.routes';
import publicBrandsRoutes from './routes/public/brands.routes';
import publicSearchRoutes from './routes/public/search.routes';
import publicCategoriesRoutes from './routes/public/categories.routes';
import publicSitemapRoutes from './routes/public/sitemap.routes';
import publicHomeRoutes from './routes/public/home.routes';
import publicContentRoutes from './routes/public/content.routes';
import publicTeamRoutes from './routes/public/team.routes';
import publicContactRoutes from './routes/public/contact.routes';
import publicSiteConfigRoutes from './routes/public/site-config.routes';

// Admin routes
import adminProductsRoutes from './routes/admin/products.routes';
import adminBrandsRoutes from './routes/admin/brands.routes';
import adminCategoriesRoutes from './routes/admin/categories.routes';
import adminHomeRoutes from './routes/admin/home.routes';
import adminContentRoutes from './routes/admin/content.routes';
import adminTeamRoutes from './routes/admin/team.routes';
import adminMessagesRoutes from './routes/admin/messages.routes';
import adminSettingsRoutes from './routes/admin/settings.routes';
import adminDashboardRoutes from './routes/admin/dashboard.routes';

const app = express();
const PORT = process.env.PORT || 3000;

// CORS configuration
const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:4200').split(',').map(s => s.trim());
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Security — NFR-020: Remove X-Powered-By header (BUG-008)
app.disable('x-powered-by');
app.use(helmet({ contentSecurityPolicy: false })); // CSP managed by SWA; helmet also disables X-Powered-By
app.use(securityHeaders);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Public API routes (no auth required)
app.use('/api/public/products', publicProductsRoutes);
app.use('/api/public/brands', publicBrandsRoutes);
app.use('/api/public/search', publicSearchRoutes);
app.use('/api/public/categories', publicCategoriesRoutes);
app.use('/api/public/sitemap.xml', publicSitemapRoutes);
app.use('/api/public/home', publicHomeRoutes);
app.use('/api/public/content', publicContentRoutes);
app.use('/api/public/team', publicTeamRoutes);
app.use('/api/public/contact', publicContactRoutes);
app.use('/api/public/config', publicSiteConfigRoutes);

// Admin API routes (auth required)
app.use('/api/admin/products', authMiddleware, adminProductsRoutes);
app.use('/api/admin/brands', authMiddleware, adminBrandsRoutes);
app.use('/api/admin/categories', authMiddleware, adminCategoriesRoutes);
app.use('/api/admin/home', authMiddleware, adminHomeRoutes);
app.use('/api/admin/content', authMiddleware, adminContentRoutes);
app.use('/api/admin/team', authMiddleware, adminTeamRoutes);
app.use('/api/admin/messages', authMiddleware, adminMessagesRoutes);
app.use('/api/admin/settings', authMiddleware, adminSettingsRoutes);
app.use('/api/admin/dashboard', authMiddleware, adminDashboardRoutes);

// Error handling middleware
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled error:', err);

  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      const message = err.field === 'pdf'
        ? 'El archivo PDF excede el limite de 10 MB'
        : 'La imagen excede el limite de 25 MB';
      res.status(413).json({ error: message });
      return;
    }
    res.status(400).json({ error: err.message });
    return;
  }

  if (err.message?.startsWith('Invalid file type:')) {
    res.status(400).json({ error: err.message });
    return;
  }

  res.status(500).json({ error: 'Internal server error' });
});

// Start server
async function start(): Promise<void> {
  // Always start listening — even if DB connection fails, health check and static routes should work
  app.listen(PORT, () => {
    console.log(`HESA API running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
  });

  try {
    await connectDatabase();
    console.log('Database connected successfully');
    await seedCategories();
    console.log('Categories seeded successfully');
    await seedSiteConfig();
    console.log('Site config seeded successfully');
  } catch (error) {
    console.error('Database initialization failed (API will run with degraded functionality):', error);
    // Don't exit — let the API serve what it can. Individual route handlers will return
    // appropriate errors when they can't reach the database.
  }
}

start();

export default app;
