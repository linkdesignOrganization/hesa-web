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

export async function getPaginatedActivity(
  page: number = 1,
  limit: number = 20
): Promise<{
  items: IActivityLog[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}> {
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    ActivityLog.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean() as unknown as Promise<IActivityLog[]>,
    ActivityLog.countDocuments(),
  ]);

  return {
    items,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}
