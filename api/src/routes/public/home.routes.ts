import { Router, Request, Response } from 'express';
import * as homeService from '../../services/home.service';

const router = Router();

/**
 * GET /api/public/home
 * Public home configuration: hero (mode + slides with product populated),
 * featured products, featured brands.
 */
router.get('/', async (_req: Request, res: Response) => {
  try {
    await homeService.ensureFeaturedItemsPopulated();

    const [heroData, featuredProducts, featuredBrands] = await Promise.all([
      homeService.getHeroSlidesPopulated(),
      homeService.getFeaturedProductsPopulated(),
      homeService.getFeaturedBrandsPopulated(),
    ]);

    res.setHeader('Cache-Control', 'public, max-age=600, stale-while-revalidate=60');
    res.json({
      hero: heroData,
      featuredProducts,
      featuredBrands,
    });
  } catch (error) {
    console.error('Error fetching home config:', error);
    res.status(500).json({ error: 'Failed to fetch home configuration' });
  }
});

export default router;
