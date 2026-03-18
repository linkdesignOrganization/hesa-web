import { Product } from '../models/product.model';
import { Brand } from '../models/brand.model';
import { Message } from '../models/message.model';
import { getRecentActivity } from './activity-log.service';
import { getRecentMessages } from './message.service';

export interface DashboardData {
  totalProducts: number;
  activeProducts: number;
  newMessages: number;
  totalBrands: number;
  featuredProducts: number;
  pharmaCount: number;
  pharmaActive: number;
  foodCount: number;
  foodActive: number;
  equipmentCount: number;
  equipmentActive: number;
  recentMessages: Array<{
    _id: string;
    name: string;
    email: string;
    type: string;
    status: string;
    message: string;
    productOfInterest?: string;
    createdAt: Date;
  }>;
  recentActivity: Array<{
    _id: string;
    action: string;
    entity: string;
    entityName?: string;
    user?: string;
    details?: string;
    createdAt: Date;
  }>;
}

export async function getDashboardData(): Promise<DashboardData> {
  // Run all queries in parallel for performance
  const [
    totalProducts,
    activeProducts,
    newMessages,
    totalBrands,
    pharmaCount,
    pharmaActive,
    foodCount,
    foodActive,
    equipmentCount,
    equipmentActive,
    featuredProducts,
    recentMsgs,
    recentAct,
  ] = await Promise.all([
    Product.countDocuments(),
    Product.countDocuments({ isActive: true }),
    Message.countDocuments({ status: 'nuevo' }),
    Brand.countDocuments(),
    Product.countDocuments({ category: 'farmacos' }),
    Product.countDocuments({ category: 'farmacos', isActive: true }),
    Product.countDocuments({ category: 'alimentos' }),
    Product.countDocuments({ category: 'alimentos', isActive: true }),
    Product.countDocuments({ category: 'equipos' }),
    Product.countDocuments({ category: 'equipos', isActive: true }),
    Product.countDocuments({ isFeatured: true }),
    getRecentMessages(5),
    getRecentActivity(10),
  ]);

  return {
    totalProducts,
    activeProducts,
    newMessages,
    totalBrands,
    featuredProducts,
    pharmaCount,
    pharmaActive,
    foodCount,
    foodActive,
    equipmentCount,
    equipmentActive,
    recentMessages: recentMsgs.map(m => ({
      _id: (m as unknown as Record<string, unknown>)._id as string,
      name: m.name,
      email: m.email,
      type: m.type,
      status: m.status,
      message: m.message,
      productOfInterest: m.productOfInterest,
      createdAt: m.createdAt,
    })),
    recentActivity: recentAct.map(a => ({
      _id: (a as unknown as Record<string, unknown>)._id as string,
      action: a.action,
      entity: a.entity,
      entityName: a.entityName,
      user: a.user,
      details: a.details,
      createdAt: a.createdAt,
    })),
  };
}
