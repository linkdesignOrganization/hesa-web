import { BlobServiceClient } from '@azure/storage-blob';

let blobServiceClient: BlobServiceClient | null = null;

export function getBlobServiceClient(): BlobServiceClient {
  if (!blobServiceClient) {
    const connectionString = process.env.BLOB_CONNECTION_STRING;
    if (!connectionString) {
      throw new Error('BLOB_CONNECTION_STRING environment variable is not set');
    }
    blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
  }
  return blobServiceClient;
}

export function getImagesContainer() {
  const containerName = process.env.BLOB_CONTAINER_IMAGES || 'images';
  return getBlobServiceClient().getContainerClient(containerName);
}

export function getDocumentsContainer() {
  const containerName = process.env.BLOB_CONTAINER_DOCUMENTS || 'documents';
  return getBlobServiceClient().getContainerClient(containerName);
}

export function getCdnUrl(): string {
  return process.env.BLOB_CDN_URL || 'https://hesastorage.blob.core.windows.net';
}
