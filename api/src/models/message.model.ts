import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
  name: string;
  email: string;
  phone?: string;
  type: 'info' | 'comercial' | 'soporte' | 'fabricante' | 'otro';
  productOfInterest?: string;
  message: string;
  status: 'nuevo' | 'en-proceso' | 'atendido';
  notes?: string;
  // Manufacturer-specific fields
  companyName?: string;
  country?: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  productTypes?: string;
  source: 'general' | 'manufacturer';
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new Schema<IMessage>(
  {
    name: { type: String, required: true, maxlength: 100 },
    email: { type: String, required: true, maxlength: 254 },
    phone: { type: String, maxlength: 20 },
    type: {
      type: String,
      enum: ['info', 'comercial', 'soporte', 'fabricante', 'otro'],
      required: true,
    },
    productOfInterest: { type: String, maxlength: 200 },
    message: { type: String, required: true, maxlength: 2000 },
    status: {
      type: String,
      enum: ['nuevo', 'en-proceso', 'atendido'],
      default: 'nuevo',
    },
    notes: { type: String, maxlength: 2000 },
    companyName: { type: String, maxlength: 200 },
    country: { type: String, maxlength: 100 },
    contactName: { type: String, maxlength: 100 },
    contactEmail: { type: String, maxlength: 254 },
    contactPhone: { type: String, maxlength: 20 },
    productTypes: { type: String, maxlength: 200 },
    source: {
      type: String,
      enum: ['general', 'manufacturer'],
      default: 'general',
    },
  },
  {
    timestamps: true,
    collection: 'messages',
  }
);

messageSchema.index({ status: 1 });
messageSchema.index({ type: 1 });
messageSchema.index({ createdAt: -1 });
messageSchema.index({ name: 1, email: 1 });

export const Message = mongoose.model<IMessage>('Message', messageSchema);
