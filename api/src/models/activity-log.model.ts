import mongoose, { Schema, Document } from 'mongoose';

export interface IActivityLog extends Document {
  action: 'create' | 'update' | 'delete' | 'activate' | 'deactivate';
  entity: 'product' | 'brand' | 'category' | 'message' | 'team_member' | 'content' | 'settings';
  entityId?: string;
  entityName?: string;
  user?: string;
  details?: string;
  createdAt: Date;
}

const activityLogSchema = new Schema<IActivityLog>(
  {
    action: {
      type: String,
      enum: ['create', 'update', 'delete', 'activate', 'deactivate'],
      required: true,
    },
    entity: {
      type: String,
      enum: ['product', 'brand', 'category', 'message', 'team_member', 'content', 'settings'],
      required: true,
    },
    entityId: { type: String },
    entityName: { type: String },
    user: { type: String },
    details: { type: String },
  },
  {
    timestamps: true,
    collection: 'activity_logs',
  }
);

activityLogSchema.index({ createdAt: -1 });

export const ActivityLog = mongoose.model<IActivityLog>('ActivityLog', activityLogSchema);
