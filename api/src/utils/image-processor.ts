import sharp, { FitEnum } from 'sharp';

export interface ProcessedImage {
  buffer: Buffer;
  contentType: string;
  width: number;
  height?: number;
}

export type ImageOptimizationProfile =
  | 'product'
  | 'brand-logo'
  | 'home-hero-desktop'
  | 'home-hero-mobile'
  | 'content-hero'
  | 'team-photo'
  | 'site-logo'
  | 'og-image';

interface ImageProfileConfig {
  width: number;
  height?: number;
  fit?: keyof FitEnum;
  format: 'webp' | 'jpeg';
  quality: number;
}

const IMAGE_PROFILES: Record<ImageOptimizationProfile, ImageProfileConfig> = {
  product: {
    width: 1600,
    fit: 'inside',
    format: 'webp',
    quality: 84,
  },
  'brand-logo': {
    width: 800,
    fit: 'inside',
    format: 'webp',
    quality: 92,
  },
  'home-hero-desktop': {
    width: 2400,
    fit: 'inside',
    format: 'webp',
    quality: 84,
  },
  'home-hero-mobile': {
    width: 1440,
    fit: 'inside',
    format: 'webp',
    quality: 84,
  },
  'content-hero': {
    width: 2200,
    fit: 'inside',
    format: 'webp',
    quality: 84,
  },
  'team-photo': {
    width: 800,
    fit: 'inside',
    format: 'webp',
    quality: 86,
  },
  'site-logo': {
    width: 800,
    fit: 'inside',
    format: 'webp',
    quality: 92,
  },
  'og-image': {
    width: 1200,
    height: 630,
    fit: 'cover',
    format: 'jpeg',
    quality: 84,
  },
};

/**
 * Optimize an image for a specific admin upload use-case.
 * - Auto-rotates from EXIF orientation
 * - Strips metadata by default
 * - Resizes without enlarging
 * - Outputs a web-optimized format
 */
export async function optimizeImageForProfile(
  inputBuffer: Buffer,
  profile: ImageOptimizationProfile
): Promise<ProcessedImage> {
  const config = IMAGE_PROFILES[profile];

  let pipeline = sharp(inputBuffer, { failOn: 'none' })
    .rotate()
    .resize({
      width: config.width,
      height: config.height,
      fit: config.fit ?? 'inside',
      withoutEnlargement: true,
      position: 'attention',
    });

  pipeline = config.format === 'jpeg'
    ? pipeline.jpeg({ quality: config.quality, mozjpeg: true })
    : pipeline.webp({
        quality: config.quality,
        alphaQuality: 100,
        effort: 4,
        smartSubsample: true,
      });

  const buffer = await pipeline.toBuffer();
  const metadata = await sharp(buffer).metadata();

  return {
    buffer,
    contentType: config.format === 'jpeg' ? 'image/jpeg' : 'image/webp',
    width: metadata.width ?? config.width,
    height: metadata.height ?? config.height,
  };
}

/**
 * Backward-compatible helper for legacy call-sites that only need
 * "resize to width and emit WebP".
 */
export async function processImageSingle(
  inputBuffer: Buffer,
  width: number = 800
): Promise<ProcessedImage> {
  const buffer = await sharp(inputBuffer, { failOn: 'none' })
    .rotate()
    .resize({
      width,
      fit: 'inside',
      withoutEnlargement: true,
    })
    .webp({
      quality: 80,
      alphaQuality: 100,
      effort: 4,
      smartSubsample: true,
    })
    .toBuffer();

  const metadata = await sharp(buffer).metadata();

  return {
    buffer,
    contentType: 'image/webp',
    width: metadata.width ?? width,
    height: metadata.height,
  };
}
