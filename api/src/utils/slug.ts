import slugify from 'slugify';

/**
 * Generate a URL-friendly slug from a string.
 * Normalizes accents and special characters.
 */
export function generateSlug(text: string): string {
  return slugify(text, {
    lower: true,
    strict: true,
    locale: 'es',
    remove: /[*+~.()'"!:@]/g,
  });
}

/**
 * Generate bilingual slugs for a product.
 */
export function generateProductSlugs(nameEs: string, nameEn: string): { es: string; en: string } {
  return {
    es: generateSlug(nameEs),
    en: generateSlug(nameEn || nameEs),
  };
}
