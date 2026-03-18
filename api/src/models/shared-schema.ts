/**
 * Shared Mongoose schema fragments used across multiple models.
 * Eliminates duplication of `bilingualField` in product, category,
 * home-config, page-content, and team-member models.
 */
export const bilingualField = {
  es: { type: String, default: '' },
  en: { type: String, default: '' },
};
