import dotenv from 'dotenv';
import path from 'path';

// Load .env from project root (one level up from api/)
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { connectDatabase } from './config/database';
import { securityHeaders } from './middleware/security-headers.middleware';
import { authMiddleware } from './middleware/auth.middleware';
import { seedCategories } from './services/category.service';

// Public routes
import publicProductsRoutes from './routes/public/products.routes';
import publicBrandsRoutes from './routes/public/brands.routes';
import publicSearchRoutes from './routes/public/search.routes';
import publicCategoriesRoutes from './routes/public/categories.routes';
import publicSitemapRoutes from './routes/public/sitemap.routes';

// Admin routes
import adminProductsRoutes from './routes/admin/products.routes';
import adminBrandsRoutes from './routes/admin/brands.routes';
import adminCategoriesRoutes from './routes/admin/categories.routes';

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

// Admin API routes (auth required)
app.use('/api/admin/products', authMiddleware, adminProductsRoutes);
app.use('/api/admin/brands', authMiddleware, adminBrandsRoutes);
app.use('/api/admin/categories', authMiddleware, adminCategoriesRoutes);

// Error handling middleware
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled error:', err);
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
  } catch (error) {
    console.error('Database initialization failed (API will run with degraded functionality):', error);
    // Don't exit — let the API serve what it can. Individual route handlers will return
    // appropriate errors when they can't reach the database.
  }
}

start();

export default app;
