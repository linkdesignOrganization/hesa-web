export const environment = {
  production: true,
  apiUrl: 'https://hesa-api.azurewebsites.net/api',
  entra: {
    clientId: 'b18eec6f-d578-4525-bcdb-9dd6f33c0527',
    tenantId: '566e7def-c2ee-49b7-91e5-b045805f416a',
    redirectUri: 'https://gray-field-02ba8410f.2.azurestaticapps.net',
    authority: 'https://login.microsoftonline.com/566e7def-c2ee-49b7-91e5-b045805f416a',
    scopes: ['User.Read']
  },
  blobStorageUrl: 'https://hesastorage.blob.core.windows.net',
  blobContainerImages: 'images',
  blobContainerDocuments: 'documents'
};
