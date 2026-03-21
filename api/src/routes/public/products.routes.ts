import { Router, Request, Response } from 'express';
import * as productService from '../../services/product.service';
import * as categoryService from '../../services/category.service';

const router = Router();

/** Safely extract a string query param, truncated to maxLen. */
function safeQueryString(value: unknown, maxLen = 100): string | undefined {
  if (typeof value !== 'string' || !value.trim()) return undefined;
  return value.substring(0, maxLen).trim();
}

/** Normalize a public query param into a sanitized string array. */
function safeQueryArray(value: unknown, maxLen = 100): string[] | undefined {
  const rawValues = Array.isArray(value)
    ? value.flatMap(item => (typeof item === 'string' ? item.split(',') : []))
    : typeof value === 'string'
      ? value.split(',')
      : [];

  const sanitized = rawValues
    .map(item => item.trim().substring(0, maxLen))
    .filter(Boolean);

  return sanitized.length > 0 ? sanitized : undefined;
}

/**
 * GET /api/public/products
 * Public catalog listing with filters and pagination.
 * Covers: REQ-078 to REQ-105, REQ-264a to REQ-264j
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(Math.max(1, parseInt(req.query.limit as string) || 24), 100);

    const result = await productService.getProducts({
      category: safeQueryString(req.query.category),
      brand: safeQueryArray(req.query.brand),
      species: safeQueryArray(req.query.species),
      family: safeQueryArray(req.query.family),
      lifeStage: safeQueryArray(req.query.lifeStage),
      equipmentType: safeQueryArray(req.query.equipmentType),
      search: safeQueryString(req.query.search),
      isActive: true,
      page,
      limit,
    });

    // NFR-001/ADR-11: Cache public catalog for 5 minutes
    res.setHeader('Cache-Control', 'public, max-age=300, stale-while-revalidate=60');
    res.json(result);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

/**
 * GET /api/public/products/filters
 * Dynamic filter values based on current products.
 * REQ-100: Filter values generated from existing data.
 */
router.get('/filters', async (req: Request, res: Response) => {
  try {
    const category = req.query.category as string | undefined;
    const filters = await categoryService.getDynamicFilterValues(category);
    // NFR-001/ADR-11: Cache filter values for 10 minutes
    res.setHeader('Cache-Control', 'public, max-age=600, stale-while-revalidate=60');
    res.json(filters);
  } catch (error) {
    console.error('Error fetching filters:', error);
    res.status(500).json({ error: 'Failed to fetch filter values' });
  }
});

/**
 * GET /api/public/products/featured
 * Featured products for home page carousel.
 * REQ-066 to REQ-073
 */
router.get('/featured', async (_req: Request, res: Response) => {
  try {
    const products = await productService.getFeaturedProducts();
    // NFR-001/ADR-11: Cache featured products for 10 minutes
    res.setHeader('Cache-Control', 'public, max-age=600, stale-while-revalidate=60');
    res.json(products);
  } catch (error) {
    console.error('Error fetching featured products:', error);
    res.status(500).json({ error: 'Failed to fetch featured products' });
  }
});

/**
 * GET /api/public/products/by-slug/:slug
 * Get product by slug (bilingual).
 * REQ-106 to REQ-129
 */
router.get('/by-slug/:slug', async (req: Request, res: Response) => {
  try {
    const lang: 'es' | 'en' = (req.query.lang as string) === 'en' ? 'en' : 'es';
    const slug = req.params.slug.substring(0, 200);
    const product = await productService.getProductBySlug(slug, lang);

    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    // NFR-001/ADR-11: Cache product detail for 5 minutes
    res.setHeader('Cache-Control', 'public, max-age=300, stale-while-revalidate=60');
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

/**
 * GET /api/public/products/:id/related
 * Related products for the product detail page.
 * REQ-138 to REQ-142
 */
router.get('/:id/related', async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    if (!id || id.length > 30) {
      res.status(400).json({ error: 'Invalid product ID' });
      return;
    }

    const product = await productService.getProductById(id);
    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    const related = await productService.getRelatedProducts(
      id,
      product.category,
      String(product.brand),
      product.species || [],
      4
    );

    res.json(related);
  } catch (error) {
    console.error('Error fetching related products:', error);
    res.status(500).json({ error: 'Failed to fetch related products' });
  }
});

export default router;
