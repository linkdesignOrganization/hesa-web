import sharp from 'sharp';

export interface ProcessedImage {
  buffer: Buffer;
  contentType: string;
  width: number;
}

/**
 * Process a single image to a specific width.
 * Converts to WebP format for optimal size.
 */
export async function processImageSingle(
  inputBuffer: Buffer,
  width: number = 800
): Promise<ProcessedImage> {
  const buffer = await sharp(inputBuffer)
    .resize(width, width, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 80 })
    .toBuffer();

  return { buffer, contentType: 'image/webp', width };
}
