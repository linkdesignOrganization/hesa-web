import { Router, Request, Response } from 'express';
import * as homeService from '../../services/home.service';

const router = Router();

/**
 * GET /api/public/home
 * Public home configuration: hero data, featured products, featured brands.
 * REQ-042 to REQ-077
 */
router.get('/', async (_req: Request, res: Response) => {
  try {
    const [config, featuredProducts, featuredBrands] = await Promise.all([
      homeService.getHomeConfig(),
      homeService.getFeaturedProductsPopulated(),
      homeService.getFeaturedBrandsPopulated(),
    ]);

    res.json({
      hero: config.hero,
      featuredProducts,
      featuredBrands,
    });
  } catch (error) {
    console.error('Error fetching home config:', error);
    res.status(500).json({ error: 'Failed to fetch home configuration' });
  }
});

export default router;
