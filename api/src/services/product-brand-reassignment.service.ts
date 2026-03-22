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
      byCategory[category] += 1;
    });
  }

  if (bulkOperations.length > 0) {
    await Product.bulkWrite(bulkOperations as never, { ordered: false });
  }

  const productCategoryAgg = await Product.aggregate<{
    _id: unknown;
    categories: CategoryKey[];
  }>([
    { $match: { brand: { $ne: null } } },
    {
      $group: {
        _id: '$brand',
        categories: { $addToSet: '$category' },
      },
    },
  ]);

  const categoryMap = new Map(
    productCategoryAgg.map(entry => [
      String(entry._id),
      entry.categories.filter((category): category is CategoryKey => CATEGORY_ORDER.includes(category as CategoryKey)),
    ])
  );

  const brandCategoryUpdates = brandDocs.map(brand => {
    const categories = categoryMap.get(String(brand._id));
    return {
      updateOne: {
        filter: { _id: new mongoose.Types.ObjectId(String(brand._id)) },
        update: {
          $set: {
            categories: categories && categories.length > 0 ? categories : brand.categories,
          },
        },
      },
    };
  });

  if (brandCategoryUpdates.length > 0) {
    await Brand.bulkWrite(brandCategoryUpdates as never, { ordered: false });
  }

  const productsWithoutBrandAfter = await Product.countDocuments({ brand: null });

  return {
    brandsUsed: brandDocs.length,
    productsUpdated: bulkOperations.length,
    productsWithoutBrandBefore,
    productsWithoutBrandAfter,
    byCategory,
    assignedBrandNames: brandDocs.map(brand => brand.name),
  };
}
