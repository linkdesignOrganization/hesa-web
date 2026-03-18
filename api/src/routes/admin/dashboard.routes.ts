import { Router, Request, Response } from 'express';
import { getDashboardData } from '../../services/dashboard.service';
import { adminSearch } from '../../services/search.service';

const router = Router();

/**
 * GET /api/admin/dashboard
 * REQ-206 to REQ-211: Dashboard with real data
 */
router.get('/', async (_req: Request, res: Response) => {
  try {
    const data = await getDashboardData();
    res.json(data);
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ error: 'Failed to load dashboard data' });
  }
});

/**
 * GET /api/admin/dashboard/search?q=term
 * REQ-220, REQ-221: Admin global search across products, brands, messages
 */
router.get('/search', async (req: Request, res: Response) => {
  try {
    const term = String(req.query.q || '').substring(0, 100);
    const results = await adminSearch(term);
    res.json(results);
  } catch (error) {
    console.error('Error in admin search:', error);
    res.status(500).json({ error: 'Search failed' });
  }
});

export default router;
