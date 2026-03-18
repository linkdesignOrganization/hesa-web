import { Router, Response } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
import { sanitizeBody } from '../../middleware/validate.middleware';
import * as categoryService from '../../services/category.service';
import { logActivity } from '../../services/activity-log.service';

const router = Router();

/**
 * GET /api/admin/categories
 * Admin categories with product counts.
 * REQ-268 to REQ-274
 */
router.get('/', async (_req: AuthRequest, res: Response) => {
  try {
    const categories = await categoryService.getCategoriesWithCounts();
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

/**
 * PUT /api/admin/categories/:key
 * Update category filter values (families, species, lifeStages, equipmentTypes).
 */
router.put('/:key', sanitizeBody, async (req: AuthRequest, res: Response) => {
  try {
    const validKeys = ['farmacos', 'alimentos', 'equipos'];
    if (!validKeys.includes(req.params.key)) {
      res.status(400).json({ error: 'Invalid category key' });
      return;
    }

    const updated = await categoryService.updateCategory(req.params.key, req.body);
    if (!updated) {
      res.status(404).json({ error: 'Category not found' });
      return;
    }

    await logActivity({
      action: 'update',
      entity: 'category',
      entityName: req.params.key,
      user: req.user?.email,
    });

    res.json(updated);
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ error: 'Failed to update category' });
  }
});

export default router;
