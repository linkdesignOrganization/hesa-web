import { Router, Response } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
import { sanitizeBody } from '../../middleware/validate.middleware';
import { adminUploadSingleImage } from '../../middleware/admin-upload.middleware';
import * as galleryService from '../../services/gallery.service';
import * as storageService from '../../services/storage.service';
import { logActivity } from '../../services/activity-log.service';
import { optimizeImageForProfile } from '../../utils/image-processor';

const router = Router();

/**
 * GET /api/admin/gallery
 * List all gallery items, newest first.
 */
router.get('/', async (_req: AuthRequest, res: Response) => {
  try {
    const items = await galleryService.getGalleryItems();
    res.json(items);
  } catch (error) {
    console.error('Error fetching gallery:', error);
    res.status(500).json({ error: 'Failed to fetch gallery items' });
  }
});

/**
 * POST /api/admin/gallery
 * Create a gallery item. Photo is required and uploaded together with the
 * data in a single multipart request (fields are flat: eventEs, eventEn,
 * date, descriptionEs, descriptionEn).
 */
router.post('/', adminUploadSingleImage.single('image'), sanitizeBody, async (req: AuthRequest, res: Response) => {
  try {
    const file = req.file;
    if (!file) {
      res.status(400).json({ error: 'La foto es obligatoria' });
      return;
    }

    const { eventEs, eventEn, date, descriptionEs, descriptionEn } = req.body;
    if (!eventEs || !eventEn || !descriptionEs || !descriptionEn) {
      res.status(400).json({ error: 'event (es/en) and description (es/en) are required' });
      return;
    }

    const processed = await optimizeImageForProfile(file.buffer, 'gallery');
    const imageUrl = await storageService.uploadImage(processed.buffer, processed.contentType, 'gallery');

    const item = await galleryService.createGalleryItem({
      image: imageUrl,
      event: { es: eventEs, en: eventEn },
      date: date || '',
      description: { es: descriptionEs, en: descriptionEn },
    });

    await logActivity({
      action: 'create',
      entity: 'gallery_item',
      entityId: String(item._id),
      entityName: eventEs,
      user: req.user?.email,
    });

    res.status(201).json(item);
  } catch (error) {
    console.error('Error creating gallery item:', error);
    res.status(500).json({ error: 'Failed to create gallery item' });
  }
});

/**
 * PUT /api/admin/gallery/:id
 * Update a gallery item. The photo is optional on update: if a new file is
 * provided it replaces the existing one (and the old blob is deleted).
 */
router.put('/:id', adminUploadSingleImage.single('image'), sanitizeBody, async (req: AuthRequest, res: Response) => {
  try {
    const existing = await galleryService.getGalleryItemById(req.params.id);
    if (!existing) {
      res.status(404).json({ error: 'Gallery item not found' });
      return;
    }

    const { eventEs, eventEn, date, descriptionEs, descriptionEn } = req.body;
    if (!eventEs || !eventEn || !descriptionEs || !descriptionEn) {
      res.status(400).json({ error: 'event (es/en) and description (es/en) are required' });
      return;
    }

    const update: Partial<galleryService.GalleryItemInput> = {
      event: { es: eventEs, en: eventEn },
      date: date || '',
      description: { es: descriptionEs, en: descriptionEn },
    };

    if (req.file) {
      const processed = await optimizeImageForProfile(req.file.buffer, 'gallery');
      update.image = await storageService.uploadImage(processed.buffer, processed.contentType, 'gallery');
    }

    const item = await galleryService.updateGalleryItem(req.params.id, update);

    // Remove the previous photo only after a successful replacement.
    if (req.file && existing.image && item?.image && existing.image !== item.image) {
      await storageService.deleteBlob(existing.image).catch(() => {});
    }

    await logActivity({
      action: 'update',
      entity: 'gallery_item',
      entityId: req.params.id,
      entityName: eventEs,
      user: req.user?.email,
    });

    res.json(item);
  } catch (error) {
    console.error('Error updating gallery item:', error);
    res.status(500).json({ error: 'Failed to update gallery item' });
  }
});

/**
 * DELETE /api/admin/gallery/:id
 * Delete a gallery item and its photo.
 */
router.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const item = await galleryService.getGalleryItemById(req.params.id);
    if (!item) {
      res.status(404).json({ error: 'Gallery item not found' });
      return;
    }

    if (item.image) {
      await storageService.deleteBlob(item.image);
    }

    await galleryService.deleteGalleryItem(req.params.id);

    await logActivity({
      action: 'delete',
      entity: 'gallery_item',
      entityId: req.params.id,
      entityName: item.event?.es || '',
      user: req.user?.email,
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting gallery item:', error);
    res.status(500).json({ error: 'Failed to delete gallery item' });
  }
});

export default router;
