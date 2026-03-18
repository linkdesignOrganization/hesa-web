import { Router, Request, Response } from 'express';
import { getDashboardData } from '../../services/dashboard.service';

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

export default router;
