import { ActivityLog, IActivityLog } from '../models/activity-log.model';

export async function logActivity(data: {
  action: IActivityLog['action'];
  entity: IActivityLog['entity'];
  entityId?: string;
  entityName?: string;
  user?: string;
  details?: string;
}): Promise<void> {
  try {
    await ActivityLog.create(data);
  } catch (error) {
    console.error('Failed to log activity:', error);
  }
}

export async function getRecentActivity(limit: number = 10): Promise<IActivityLog[]> {
  return ActivityLog.find()
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean() as unknown as Promise<IActivityLog[]>;
}
