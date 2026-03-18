import { Router, Request, Response } from 'express';
import * as searchService from '../../services/search.service';
import { rateLimit } from '../../middleware/rate-limit.middleware';

const router = Router();

// Rate limit search: 30 requests per minute per IP
const searchRateLimit = rateLimit(30, 60000);

/**
 * GET /api/public/search
 * Global search with autocomplete.
 * REQ-035 to REQ-041
 */
router.get('/', searchRateLimit, async (req: Request, res: Response) => {
  try {
    const rawTerm = req.query.q as string;
    const lang = (req.query.lang as string) === 'en' ? 'en' : 'es';
    const limit = Math.min(parseInt(req.query.limit as string) || 5, 20);

    if (!rawTerm || rawTerm.length < 2) {
      res.json({ products: [], brands: [] });
      return;
    }

    // Truncate and sanitize search term — strip control characters
    // eslint-disable-next-line no-control-regex
    const term = rawTerm.substring(0, 100).replace(/[\x00-\x1f\x7f]/g, '').trim();

    const results = await searchService.globalSearch(term, lang, limit);
    res.json(results);
  } catch (error) {
    console.error('Error in search:', error);
    res.status(500).json({ error: 'Search failed' });
  }
});

export default router;
