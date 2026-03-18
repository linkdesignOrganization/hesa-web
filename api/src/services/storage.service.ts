import { getImagesContainer, getDocumentsContainer, getCdnUrl } from '../config/storage';
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 8);
}

/**
 * Upload an image to Blob Storage.
 * @returns The public URL of the uploaded image.
 */
export async function uploadImage(
  buffer: Buffer,
  contentType: string,
  folder: string = 'products'
): Promise<string> {
  const container = getImagesContainer();
  const ext = contentType === 'image/webp' ? 'webp' : contentType === 'image/png' ? 'png' : 'jpg';
  const blobName = `${folder}/${generateId()}.${ext}`;

  const blockBlobClient = container.getBlockBlobClient(blobName);
  await blockBlobClient.upload(buffer, buffer.length, {
    blobHTTPHeaders: { blobContentType: contentType },
  });

  return `${getCdnUrl()}/images/${blobName}`;
}

/**
 * Upload a PDF document to Blob Storage.
 * @returns The URL for the uploaded PDF.
 */
export async function uploadDocument(
  buffer: Buffer,
  originalName: string
): Promise<string> {
  const container = getDocumentsContainer();
  const safeName = originalName.replace(/[^a-zA-Z0-9.-]/g, '_');
  const blobName = `pdfs/${generateId()}_${safeName}`;

  const blockBlobClient = container.getBlockBlobClient(blobName);
  await blockBlobClient.upload(buffer, buffer.length, {
    blobHTTPHeaders: { blobContentType: 'application/pdf' },
  });

  return `${getCdnUrl()}/documents/${blobName}`;
}

/**
 * Delete a blob by its full URL.
 */
export async function deleteBlob(url: string): Promise<void> {
  try {
    const cdnUrl = getCdnUrl();
    if (!url.startsWith(cdnUrl)) return;

    const path = url.replace(cdnUrl + '/', '');
    const isDocument = path.startsWith('documents/');
    const container = isDocument ? getDocumentsContainer() : getImagesContainer();
    const blobName = path.replace(/^(images|documents)\//, '');

    const blockBlobClient = container.getBlockBlobClient(blobName);
    await blockBlobClient.deleteIfExists();
  } catch (error) {
    console.error('Error deleting blob:', error);
  }
}
