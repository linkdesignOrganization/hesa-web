import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';
import {
  getMessages,
  getAllMessages,
  getMessageById,
  updateMessageStatus,
  updateMessageNotes,
  deleteMessage,
  getNewMessagesCount,
} from '../../services/message.service';
import { logActivity } from '../../services/activity-log.service';
import { AuthRequest } from '../../middleware/auth.middleware';
import { sanitizeBody } from '../../middleware/validate.middleware';

const router = Router();

const VALID_TYPES = ['info', 'comercial', 'soporte', 'fabricante', 'otro'];
const VALID_STATUSES = ['nuevo', 'en-proceso', 'atendido'];

function isValidObjectId(id: string): boolean {
  return mongoose.Types.ObjectId.isValid(id);
}

/**
 * GET /api/admin/messages
 * REQ-289 to REQ-296: List messages with filters
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const { type, status, search, page, limit } = req.query;

    // Validate enum values to prevent NoSQL injection via query params
    const safeType = typeof type === 'string' && VALID_TYPES.includes(type) ? type : undefined;
    const safeStatus = typeof status === 'string' && VALID_STATUSES.includes(status) ? status : undefined;
    const safeSearch = typeof search === 'string' ? search.substring(0, 100) : undefined;

    const result = await getMessages({
      type: safeType,
      status: safeStatus,
      search: safeSearch,
      page: page ? parseInt(page as string, 10) : undefined,
      limit: limit ? parseInt(limit as string, 10) : undefined,
    });
    res.json(result);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

/**
 * GET /api/admin/messages/count-new
 * Returns count of new (unread) messages for badge
 */
router.get('/count-new', async (_req: Request, res: Response) => {
  try {
    const count = await getNewMessagesCount();
    res.json({ count });
  } catch (error) {
    console.error('Error counting messages:', error);
    res.status(500).json({ error: 'Failed to count messages' });
  }
});

/**
 * GET /api/admin/messages/export
 * REQ-295: Export all messages as CSV
 */
router.get('/export', async (req: Request, res: Response) => {
  try {
    const { type, status, search } = req.query;

    // Validate enum values
    const safeType = typeof type === 'string' && VALID_TYPES.includes(type) ? type : undefined;
    const safeStatus = typeof status === 'string' && VALID_STATUSES.includes(status) ? status : undefined;
    const safeSearch = typeof search === 'string' ? search.substring(0, 100) : undefined;

    const messages = await getAllMessages({
      type: safeType,
      status: safeStatus,
      search: safeSearch,
    });

    // Build CSV
    const headers = [
      'ID', 'Nombre', 'Email', 'Teléfono', 'Tipo', 'Estado',
      'Producto', 'Mensaje', 'Empresa', 'País', 'Fuente',
      'Notas', 'Fecha',
    ];
    const rows = messages.map(m => [
      (m as unknown as Record<string, unknown>)._id,
      csvEscape(m.name),
      csvEscape(m.email),
      csvEscape(m.phone || ''),
      m.type,
      m.status,
      csvEscape(m.productOfInterest || ''),
      csvEscape(m.message),
      csvEscape(m.companyName || ''),
      csvEscape(m.country || ''),
      m.source,
      csvEscape(m.notes || ''),
      m.createdAt?.toISOString() || '',
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(',')),
    ].join('\n');

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="mensajes-hesa-${new Date().toISOString().split('T')[0]}.csv"`);
    // UTF-8 BOM for Excel compatibility
    res.send('\ufeff' + csvContent);
  } catch (error) {
    console.error('Error exporting messages:', error);
    res.status(500).json({ error: 'Failed to export messages' });
  }
});

/**
 * GET /api/admin/messages/:id
 * REQ-297: Get message detail
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      res.status(400).json({ error: 'Invalid message ID' });
      return;
    }
    const message = await getMessageById(req.params.id);
    if (!message) {
      res.status(404).json({ error: 'Message not found' });
      return;
    }
    res.json(message);
  } catch (error) {
    console.error('Error fetching message:', error);
    res.status(500).json({ error: 'Failed to fetch message' });
  }
});

/**
 * PATCH /api/admin/messages/:id/status
 * REQ-292, REQ-298, REQ-300: Update message status
 */
router.patch('/:id/status', sanitizeBody, async (req: Request, res: Response) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      res.status(400).json({ error: 'Invalid message ID' });
      return;
    }
    const { status } = req.body;
    if (!['nuevo', 'en-proceso', 'atendido'].includes(status)) {
      res.status(400).json({ error: 'Invalid status. Must be: nuevo, en-proceso, or atendido' });
      return;
    }

    const updated = await updateMessageStatus(req.params.id, status);
    if (!updated) {
      res.status(404).json({ error: 'Message not found' });
      return;
    }

    const authReq = req as AuthRequest;
    logActivity({
      action: 'update',
      entity: 'message',
      entityId: req.params.id,
      entityName: updated.name,
      user: authReq.user?.email,
      details: `Status changed to ${status}`,
    }).catch(() => {});

    res.json(updated);
  } catch (error) {
    console.error('Error updating message status:', error);
    res.status(500).json({ error: 'Failed to update message status' });
  }
});

/**
 * PATCH /api/admin/messages/:id/notes
 * REQ-299: Update internal notes
 */
router.patch('/:id/notes', sanitizeBody, async (req: Request, res: Response) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      res.status(400).json({ error: 'Invalid message ID' });
      return;
    }
    const { notes } = req.body;
    if (typeof notes !== 'string' || notes.length > 2000) {
      res.status(400).json({ error: 'Notes must be a string (max 2000 chars)' });
      return;
    }

    const updated = await updateMessageNotes(req.params.id, notes);
    if (!updated) {
      res.status(404).json({ error: 'Message not found' });
      return;
    }
    res.json(updated);
  } catch (error) {
    console.error('Error updating message notes:', error);
    res.status(500).json({ error: 'Failed to update notes' });
  }
});

/**
 * DELETE /api/admin/messages/:id
 * REQ-302: Delete message with confirmation
 */
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      res.status(400).json({ error: 'Invalid message ID' });
      return;
    }

    // Get message name before deleting for activity log
    const message = await getMessageById(req.params.id);
    const deleted = await deleteMessage(req.params.id);
    if (!deleted) {
      res.status(404).json({ error: 'Message not found' });
      return;
    }

    const authReq = req as AuthRequest;
    logActivity({
      action: 'delete',
      entity: 'message',
      entityId: req.params.id,
      entityName: message?.name || 'Unknown',
      user: authReq.user?.email,
    }).catch(() => {});

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({ error: 'Failed to delete message' });
  }
});

function csvEscape(str: string): string {
  // Prevent CSV formula injection: prefix dangerous chars with a single quote
  let safe = str;
  if (/^[=+\-@\t\r]/.test(safe)) {
    safe = "'" + safe;
  }
  if (safe.includes(',') || safe.includes('"') || safe.includes('\n') || safe.includes('\r')) {
    return '"' + safe.replace(/"/g, '""') + '"';
  }
  return safe;
}

export default router;
