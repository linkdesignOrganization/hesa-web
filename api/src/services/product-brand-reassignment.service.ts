import mongoose from 'mongoose';
import { Brand } from '../models/brand.model';
import { Product } from '../models/product.model';

type CategoryKey = 'farmacos' | 'alimentos' | 'equipos';

const CATEGORY_ORDER: CategoryKey[] = ['farmacos', 'alimentos', 'equipos'];

export interface ProductBrandReassignmentSummary {
  brandsUsed: number;
  productsUpdated: number;
  productsWithoutBrandBefore: number;
  productsWithoutBrandAfter: number;
  byCategory: Record<CategoryKey, number>;
  assignedBrandNames: string[];
}

export async function reassignProductsToActiveBrands(): Promise<ProductBrandReassignmentSummary> {
  const brandDocs = await Brand.find({
    logo: { $exists: true, $ne: '' },
  })
    .lean();

  brandDocs.sort((a, b) => a.name.localeCompare(b.name));

  if (brandDocs.length === 0) {
    throw new Error('No active brands with logos are available for reassignment');
  }

  const products = await Product.find({})
    .select('_id category brand createdAt')
    .lean();

  products.sort((a, b) => {
    const createdAtA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const createdAtB = b.createdAt ? new Date(b.createdAt).getTime() : 0;

    if (createdAtA !== createdAtB) {
      return createdAtA - createdAtB;
    }

    return String(a._id).localeCompare(String(b._id));
  });

  const productsWithoutBrandBefore = products.filter(product => !product.brand).length;

  const byCategory: Record<CategoryKey, number> = {
    farmacos: 0,
    alimentos: 0,
    equipos: 0,
  };

  const bulkOperations: Record<string, unknown>[] = [];
  const assignedCategoriesByBrand = new Map<string, Set<CategoryKey>>();

  for (const category of CATEGORY_ORDER) {
    const categoryProducts = products.filter(product => product.category === category);
    const categoryBrands = brandDocs.filter(brand => brand.categories?.includes(category));
    const assignmentPool = (categoryBrands.length > 0 ? categoryBrands : brandDocs).sort((a, b) => a.name.localeCompare(b.name));

    categoryProducts.forEach((product, index) => {
      const brand = assignmentPool[index % assignmentPool.length];
      if (!brand) return;

      bulkOperations.push({
        updateOne: {
          filter: { _id: new mongoose.Types.ObjectId(String(product._id)) },
          update: { $set: { brand: new mongoose.Types.ObjectId(String(brand._id)) } },
        },
      });

      const brandKey = String(brand._id);
      const assignedCategories = assignedCategoriesByBrand.get(brandKey) ?? new Set<CategoryKey>();
      assignedCategories.add(category);
      assignedCategoriesByBrand.set(brandKey, assignedCategories);
      byCategory[category] += 1;
    });
  }

  if (bulkOperations.length > 0) {
    await Product.bulkWrite(bulkOperations as never, { ordered: false });
  }

  const brandCategoryUpdates = brandDocs.map(brand => {
    const assignedCategories = Array.from(assignedCategoriesByBrand.get(String(brand._id)) ?? []);
    const categories = assignedCategories.length > 0
      ? Array.from(new Set([...(brand.categories ?? []), ...assignedCategories]))
      : brand.categories;

    return {
      updateOne: {
        filter: { _id: new mongoose.Types.ObjectId(String(brand._id)) },
        update: {
          $set: {
            categories,
          },
        },
      },
    };
  });

  if (brandCategoryUpdates.length > 0) {
    await Brand.bulkWrite(brandCategoryUpdates as never, { ordered: false });
  }

  return {
    brandsUsed: brandDocs.length,
    productsUpdated: bulkOperations.length,
    productsWithoutBrandBefore,
    productsWithoutBrandAfter: 0,
    byCategory,
    assignedBrandNames: brandDocs.map(brand => brand.name),
  };
}
