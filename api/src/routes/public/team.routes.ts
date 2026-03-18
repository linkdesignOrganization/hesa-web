import { Router, Request, Response } from 'express';
import * as teamService from '../../services/team.service';

const router = Router();

/**
 * GET /api/public/team
 * Public team members listing.
 * REQ-172 to REQ-173c
 */
router.get('/', async (_req: Request, res: Response) => {
  try {
    const members = await teamService.getTeamMembers();
    res.json(members);
  } catch (error) {
    console.error('Error fetching team:', error);
    res.status(500).json({ error: 'Failed to fetch team members' });
  }
});

export default router;
