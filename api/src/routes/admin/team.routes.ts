import { Router, Response } from 'express';
import mongoose from 'mongoose';
import { AuthRequest } from '../../middleware/auth.middleware';
import { sanitizeBody } from '../../middleware/validate.middleware';
import { adminUploadSingleImage } from '../../middleware/admin-upload.middleware';
import * as teamService from '../../services/team.service';
import * as storageService from '../../services/storage.service';
import { logActivity } from '../../services/activity-log.service';
import { optimizeImageForProfile } from '../../utils/image-processor';

const router = Router();

/**
 * GET /api/admin/team
 * List all team members.
 * REQ-318, REQ-319
 */
router.get('/', async (_req: AuthRequest, res: Response) => {
  try {
    const members = await teamService.getTeamMembers();
    res.json(members);
  } catch (error) {
    console.error('Error fetching team:', error);
    res.status(500).json({ error: 'Failed to fetch team members' });
  }
});

/**
 * POST /api/admin/team
 * Create a new team member.
 * REQ-320
 */
router.post('/', sanitizeBody, async (req: AuthRequest, res: Response) => {
  try {
    const { name, title } = req.body;
    if (!name?.es || !title?.es) {
      res.status(400).json({ error: 'name.es and title.es are required' });
      return;
    }

    const member = await teamService.createTeamMember({ name, title });

    await logActivity({
      action: 'create',
      entity: 'team_member',
      entityId: String(member._id),
      entityName: name.es,
      user: req.user?.email,
    });

    res.status(201).json(member);
  } catch (error) {
    console.error('Error creating team member:', error);
    res.status(500).json({ error: 'Failed to create team member' });
  }
});

/**
 * PUT /api/admin/team/reorder
 * Reorder team members.
 * REQ-321b — Must be before /:id to avoid matching "reorder" as an ID
 */
router.put('/reorder', sanitizeBody, async (req: AuthRequest, res: Response) => {
  try {
    const { orderedIds } = req.body;
    if (!Array.isArray(orderedIds) || !orderedIds.every((id: unknown) => typeof id === 'string' && mongoose.isValidObjectId(id))) {
      res.status(400).json({ error: 'orderedIds must be an array of valid IDs' });
      return;
    }

    await teamService.reorderTeamMembers(orderedIds);

    await logActivity({
      action: 'update',
      entity: 'team_member',
      entityName: 'Reorden del equipo',
      user: req.user?.email,
    });

    const members = await teamService.getTeamMembers();
    res.json(members);
  } catch (error) {
    console.error('Error reordering team:', error);
    res.status(500).json({ error: 'Failed to reorder team' });
  }
});

/**
 * PUT /api/admin/team/:id
 * Update a team member.
 * REQ-321
 */
router.put('/:id', sanitizeBody, async (req: AuthRequest, res: Response) => {
  try {
    const member = await teamService.updateTeamMember(req.params.id, req.body);
    if (!member) {
      res.status(404).json({ error: 'Team member not found' });
      return;
    }

    await logActivity({
      action: 'update',
      entity: 'team_member',
      entityId: req.params.id,
      entityName: member.name?.es || '',
      user: req.user?.email,
    });

    res.json(member);
  } catch (error) {
    console.error('Error updating team member:', error);
    res.status(500).json({ error: 'Failed to update team member' });
  }
});

/**
 * DELETE /api/admin/team/:id
 * Delete a team member.
 * REQ-321a
 */
router.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const member = await teamService.getTeamMemberById(req.params.id);
    if (!member) {
      res.status(404).json({ error: 'Team member not found' });
      return;
    }

    // Delete photo from storage
    if (member.photo) {
      await storageService.deleteBlob(member.photo);
    }

    await teamService.deleteTeamMember(req.params.id);

    await logActivity({
      action: 'delete',
      entity: 'team_member',
      entityId: req.params.id,
      entityName: member.name?.es || '',
      user: req.user?.email,
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting team member:', error);
    res.status(500).json({ error: 'Failed to delete team member' });
  }
});

/**
 * POST /api/admin/team/:id/photo
 * Upload photo for a team member.
 */
router.post('/:id/photo', adminUploadSingleImage.single('image'), async (req: AuthRequest, res: Response) => {
  try {
    const member = await teamService.getTeamMemberById(req.params.id);
    if (!member) {
      res.status(404).json({ error: 'Team member not found' });
      return;
    }

    const file = req.file;
    if (!file) {
      res.status(400).json({ error: 'No image provided' });
      return;
    }

    const previousPhoto = member.photo;
    const processed = await optimizeImageForProfile(file.buffer, 'team-photo');
    const photoUrl = await storageService.uploadImage(processed.buffer, processed.contentType, 'team');

    const updated = await teamService.updateTeamMember(req.params.id, { photo: photoUrl });
    if (previousPhoto && previousPhoto !== photoUrl) {
      await storageService.deleteBlob(previousPhoto).catch(() => {});
    }
    res.json(updated);
  } catch (error) {
    console.error('Error uploading team photo:', error);
    res.status(500).json({ error: 'Failed to upload photo' });
  }
});

export default router;
