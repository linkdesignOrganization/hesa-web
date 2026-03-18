import { Router, Request, Response } from 'express';
import * as categoryService from '../../services/category.service';

const router = Router();

/**
 * GET /api/public/categories
 * Public categories with product counts.
 */
router.get('/', async (_req: Request, res: Response) => {
  try {
    const categories = await categoryService.getCategoriesWithCounts();
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

/**
 * GET /api/public/categories/:key
 * Single category by key.
 */
router.get('/:key', async (req: Request, res: Response) => {
  try {
    const key = req.params.key;
    const validKeys = ['farmacos', 'alimentos', 'equipos'];
    if (!validKeys.includes(key)) {
      res.status(400).json({ error: 'Invalid category key' });
      return;
    }
    const category = await categoryService.getCategoryByKey(key);
    if (!category) {
      res.status(404).json({ error: 'Category not found' });
      return;
    }
    res.json(category);
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({ error: 'Failed to fetch category' });
  }
});

export default router;
