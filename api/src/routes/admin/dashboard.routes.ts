import { Router, Request, Response } from 'express';
import { getDashboardData } from '../../services/dashboard.service';
import { adminSearch } from '../../services/search.service';
import { getPaginatedActivity } from '../../services/activity-log.service';

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

/**
 * GET /api/admin/dashboard/activity?page=1&limit=20
 * Paginated activity log for the full activity history page
 */
router.get('/activity', async (req: Request, res: Response) => {
  try {
    const page = Math.max(1, parseInt(String(req.query.page || '1'), 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(String(req.query.limit || '20'), 10) || 20));
    const result = await getPaginatedActivity(page, limit);
    res.json(result);
  } catch (error) {
    console.error('Error fetching activity log:', error);
    res.status(500).json({ error: 'Failed to load activity log' });
  }
});

export default router;
