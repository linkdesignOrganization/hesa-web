import { SiteConfig, ISiteConfig } from '../models/site-config.model';

const CONFIG_KEYS = ['general', 'contacto', 'redes', 'seo'] as const;

/**
 * Initialize site config documents if they don't exist.
 * Called at startup to ensure all config keys exist.
 */
export async function seedSiteConfig(): Promise<void> {
  for (const key of CONFIG_KEYS) {
    const existing = await SiteConfig.findOne({ key });
    if (!existing) {
      await SiteConfig.create({ key });
      console.log(`Created default site_config for key: ${key}`);
    }
  }
}

/**
 * Get all site config as a single merged object.
 */
export async function getAllConfig(): Promise<Record<string, unknown>> {
  const configs = await SiteConfig.find().lean();
  const merged: Record<string, unknown> = {};
  for (const config of configs) {
    const obj = config as Record<string, unknown>;
    for (const [k, v] of Object.entries(obj)) {
      if (k !== '_id' && k !== '__v' && k !== 'key' && k !== 'createdAt' && k !== 'updatedAt') {
        merged[k] = v;
      }
    }
  }
  // Include updatedAt from the most recently updated config
  const latest = configs.reduce<Record<string, unknown> | null>((acc, c) => {
    const cObj = c as Record<string, unknown>;
    const accObj = acc as Record<string, unknown> | null;
    if (!accObj || (cObj.updatedAt as Date) > (accObj.updatedAt as Date)) return cObj;
    return accObj;
  }, null);
  if (latest) merged.updatedAt = latest.updatedAt;
  return merged;
}

/**
 * Get config by key (general | contacto | redes | seo).
 */
export async function getConfigByKey(key: string): Promise<ISiteConfig | null> {
  return SiteConfig.findOne({ key }).lean() as unknown as Promise<ISiteConfig | null>;
}

/**
 * Update config by key.
 */
export async function updateConfig(
  key: string,
  data: Record<string, unknown>
): Promise<ISiteConfig | null> {
  // Remove fields that should not be updated directly
  delete data._id;
  delete data.__v;
  delete data.key;
  delete data.createdAt;
  delete data.updatedAt;
  // Prototype pollution protection
  delete (data as Record<string, unknown>)['__proto__'];
  delete (data as Record<string, unknown>)['constructor'];
  delete (data as Record<string, unknown>)['prototype'];

  return SiteConfig.findOneAndUpdate(
    { key },
    { $set: data },
    { new: true, upsert: true }
  ).lean() as unknown as Promise<ISiteConfig | null>;
}

/**
 * Get public site config (merged data needed by the public site).
 */
export async function getPublicConfig(): Promise<Record<string, unknown>> {
  const configs = await SiteConfig.find().lean();
  const result: Record<string, unknown> = {};
  for (const config of configs) {
    const obj = config as Record<string, unknown>;
    for (const [k, v] of Object.entries(obj)) {
      if (k !== '_id' && k !== '__v' && k !== 'key' && k !== 'createdAt' && k !== 'updatedAt') {
        result[k] = v;
      }
    }
  }
  return result;
}

/**
 * Get dashboard stats from config.
 */
export async function getDashboardConfig(): Promise<Record<string, unknown>> {
  return getAllConfig();
}
