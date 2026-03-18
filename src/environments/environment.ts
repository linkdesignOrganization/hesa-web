export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  entra: {
    clientId: 'b18eec6f-d578-4525-bcdb-9dd6f33c0527',
    tenantId: '566e7def-c2ee-49b7-91e5-b045805f416a',
    redirectUri: 'http://localhost:4200/admin/login',
    authority: 'https://login.microsoftonline.com/566e7def-c2ee-49b7-91e5-b045805f416a',
    scopes: ['User.Read']
  },
  blobStorageUrl: 'https://hesastorage.blob.core.windows.net',
  blobContainerImages: 'images',
  blobContainerDocuments: 'documents'
};
