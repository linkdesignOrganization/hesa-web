import mongoose, { Schema, Document } from 'mongoose';
import { bilingualField } from './shared-schema';

export interface ITeamMember extends Document {
  name: { es: string; en: string };
  title: { es: string; en: string };
  photo?: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const teamMemberSchema = new Schema<ITeamMember>(
  {
    name: { type: bilingualField, required: true },
    title: { type: bilingualField, required: true },
    photo: { type: String },
    order: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    collection: 'team_members',
  }
);

teamMemberSchema.index({ order: 1 });

export const TeamMember = mongoose.model<ITeamMember>('TeamMember', teamMemberSchema);
