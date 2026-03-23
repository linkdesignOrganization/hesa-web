import { Routes } from '@angular/router';
import { authGuard } from './shared/guards/auth.guard';
import { unsavedChangesGuard } from './shared/guards/unsaved-changes.guard';

/**
 * BUG-V07: Route-level titles ensure unique <title> tags per page.
 * These are set by Angular's TitleStrategy before the component loads,
 * providing the fastest possible title update for crawlers that execute JS.
 * Components may further customize titles via SeoService.setMetaTags().
 */
export const routes: Routes = [
  // Root redirect to /es/ (default site language)
  { path: '', redirectTo: 'es', pathMatch: 'full' },

  // Spanish public routes
  { path: 'es', title: 'Inicio | HESA - Herrera y Elizondo S.A.', loadComponent: () => import('./public/pages/home/home.component').then(m => m.HomeComponent) },
  { path: 'es/catalogo', title: 'Catálogo de Productos | HESA - Herrera y Elizondo S.A.', loadComponent: () => import('./public/pages/catalog/catalog.component').then(m => m.CatalogComponent) },
  { path: 'es/catalogo/farmacos', title: 'Fármacos Veterinarios | HESA - Herrera y Elizondo S.A.', loadComponent: () => import('./public/pages/catalog-category/catalog-category.component').then(m => m.CatalogCategoryComponent) },
  { path: 'es/catalogo/alimentos', title: 'Alimentos para Animales | HESA - Herrera y Elizondo S.A.', loadComponent: () => import('./public/pages/catalog-category/catalog-category.component').then(m => m.CatalogCategoryComponent) },
  { path: 'es/catalogo/equipos', title: 'Equipos Veterinarios | HESA - Herrera y Elizondo S.A.', loadComponent: () => import('./public/pages/catalog-category/catalog-category.component').then(m => m.CatalogCategoryComponent) },
  { path: 'es/catalogo/:category/:slug', title: 'Producto | HESA - Herrera y Elizondo S.A.', loadComponent: () => import('./public/pages/product-detail/product-detail.component').then(m => m.ProductDetailComponent) },
  { path: 'es/marcas', title: 'Marcas | HESA - Herrera y Elizondo S.A.', loadComponent: () => import('./public/pages/brands/brands.component').then(m => m.BrandsComponent) },
  { path: 'es/marcas/:slug', title: 'Marca | HESA - Herrera y Elizondo S.A.', loadComponent: () => import('./public/pages/brand-detail/brand-detail.component').then(m => m.BrandDetailComponent) },
  { path: 'es/nosotros', title: 'Nosotros | HESA - Herrera y Elizondo S.A.', loadComponent: () => import('./public/pages/about/about.component').then(m => m.AboutComponent) },
  { path: 'es/distribuidores', title: 'Socios | HESA - Herrera y Elizondo S.A.', loadComponent: () => import('./public/pages/distributors/distributors.component').then(m => m.DistributorsComponent) },
  { path: 'es/socios', redirectTo: 'es/distribuidores', pathMatch: 'full' },
  { path: 'es/por-que-hesa', title: 'Por qué HESA | HESA - Herrera y Elizondo S.A.', loadComponent: () => import('./public/pages/why-hesa/why-hesa.component').then(m => m.WhyHesaComponent) },
  { path: 'es/clientes', title: 'Clientes | HESA - Herrera y Elizondo S.A.', loadComponent: () => import('./public/pages/clients/clients.component').then(m => m.ClientsComponent) },
  { path: 'es/contacto', title: 'Contacto | HESA - Herrera y Elizondo S.A.', loadComponent: () => import('./public/pages/contact/contact.component').then(m => m.ContactComponent) },
  { path: 'es/busqueda', title: 'Búsqueda | HESA - Herrera y Elizondo S.A.', loadComponent: () => import('./public/pages/search-results/search-results.component').then(m => m.SearchResultsComponent) },

  // English public routes
  { path: 'en', title: 'Home | HESA - Herrera y Elizondo S.A.', loadComponent: () => import('./public/pages/home/home.component').then(m => m.HomeComponent) },
  { path: 'en/catalog', title: 'Product Catalog | HESA - Herrera y Elizondo S.A.', loadComponent: () => import('./public/pages/catalog/catalog.component').then(m => m.CatalogComponent) },
  { path: 'en/catalog/pharmaceuticals', title: 'Veterinary Pharmaceuticals | HESA - Herrera y Elizondo S.A.', loadComponent: () => import('./public/pages/catalog-category/catalog-category.component').then(m => m.CatalogCategoryComponent) },
  { path: 'en/catalog/food', title: 'Animal Food | HESA - Herrera y Elizondo S.A.', loadComponent: () => import('./public/pages/catalog-category/catalog-category.component').then(m => m.CatalogCategoryComponent) },
  { path: 'en/catalog/equipment', title: 'Veterinary Equipment | HESA - Herrera y Elizondo S.A.', loadComponent: () => import('./public/pages/catalog-category/catalog-category.component').then(m => m.CatalogCategoryComponent) },
  { path: 'en/catalog/:category/:slug', title: 'Product | HESA - Herrera y Elizondo S.A.', loadComponent: () => import('./public/pages/product-detail/product-detail.component').then(m => m.ProductDetailComponent) },
  { path: 'en/brands', title: 'Brands | HESA - Herrera y Elizondo S.A.', loadComponent: () => import('./public/pages/brands/brands.component').then(m => m.BrandsComponent) },
  { path: 'en/brands/:slug', title: 'Brand | HESA - Herrera y Elizondo S.A.', loadComponent: () => import('./public/pages/brand-detail/brand-detail.component').then(m => m.BrandDetailComponent) },
  { path: 'en/about', title: 'About | HESA - Herrera y Elizondo S.A.', loadComponent: () => import('./public/pages/about/about.component').then(m => m.AboutComponent) },
  { path: 'en/distributors', title: 'Partners | HESA - Herrera y Elizondo S.A.', loadComponent: () => import('./public/pages/distributors/distributors.component').then(m => m.DistributorsComponent) },
  { path: 'en/partners', redirectTo: 'en/distributors', pathMatch: 'full' },
  { path: 'en/why-hesa', title: 'Why HESA | HESA - Herrera y Elizondo S.A.', loadComponent: () => import('./public/pages/why-hesa/why-hesa.component').then(m => m.WhyHesaComponent) },
  { path: 'en/clients', title: 'Clients | HESA - Herrera y Elizondo S.A.', loadComponent: () => import('./public/pages/clients/clients.component').then(m => m.ClientsComponent) },
  { path: 'en/contact', title: 'Contact | HESA - Herrera y Elizondo S.A.', loadComponent: () => import('./public/pages/contact/contact.component').then(m => m.ContactComponent) },
  { path: 'en/search', title: 'Search | HESA - Herrera y Elizondo S.A.', loadComponent: () => import('./public/pages/search-results/search-results.component').then(m => m.SearchResultsComponent) },

  // Admin routes
  { path: 'admin/login', title: 'Admin Login | HESA', loadComponent: () => import('./admin/pages/login/login.component').then(m => m.AdminLoginComponent) },
  {
    path: 'admin',
    title: 'Panel Admin | HESA',
    loadComponent: () => import('./admin/layout/admin-layout.component').then(m => m.AdminLayoutComponent),
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', title: 'Dashboard | HESA Admin', loadComponent: () => import('./admin/pages/dashboard/dashboard.component').then(m => m.AdminDashboardComponent) },
      { path: 'productos', title: 'Productos | HESA Admin', loadComponent: () => import('./admin/pages/products-list/products-list.component').then(m => m.AdminProductsListComponent) },
      { path: 'productos/crear', title: 'Crear Producto | HESA Admin', loadComponent: () => import('./admin/pages/product-form/product-form.component').then(m => m.AdminProductFormComponent), canDeactivate: [unsavedChangesGuard] },
      { path: 'productos/:id', title: 'Detalle Producto | HESA Admin', loadComponent: () => import('./admin/pages/product-detail/product-detail.component').then(m => m.AdminProductDetailComponent) },
      { path: 'productos/:id/editar', title: 'Editar Producto | HESA Admin', loadComponent: () => import('./admin/pages/product-form/product-form.component').then(m => m.AdminProductFormComponent), canDeactivate: [unsavedChangesGuard] },
      { path: 'marcas', title: 'Marcas | HESA Admin', loadComponent: () => import('./admin/pages/brands-list/brands-list.component').then(m => m.AdminBrandsListComponent) },
      { path: 'marcas/crear', title: 'Crear Marca | HESA Admin', loadComponent: () => import('./admin/pages/brand-form/brand-form.component').then(m => m.AdminBrandFormComponent), canDeactivate: [unsavedChangesGuard] },
      { path: 'marcas/:id/editar', title: 'Editar Marca | HESA Admin', loadComponent: () => import('./admin/pages/brand-form/brand-form.component').then(m => m.AdminBrandFormComponent), canDeactivate: [unsavedChangesGuard] },
      { path: 'categorias', title: 'Categorías | HESA Admin', loadComponent: () => import('./admin/pages/categories/categories.component').then(m => m.AdminCategoriesComponent) },
      { path: 'home/hero', loadComponent: () => import('./admin/pages/home-hero/home-hero.component').then(m => m.AdminHomeHeroComponent) },
      { path: 'home/productos-destacados', loadComponent: () => import('./admin/pages/featured-products/featured-products.component').then(m => m.AdminFeaturedProductsComponent) },
      { path: 'home/marcas-destacadas', loadComponent: () => import('./admin/pages/featured-brands/featured-brands.component').then(m => m.AdminFeaturedBrandsComponent) },
      { path: 'contenido/distribuidores', loadComponent: () => import('./admin/pages/content-editor/content-editor.component').then(m => m.AdminContentEditorComponent) },
      { path: 'mensajes', title: 'Mensajes | HESA Admin', loadComponent: () => import('./admin/pages/messages/messages.component').then(m => m.AdminMessagesComponent) },
      { path: 'mensajes/:id', loadComponent: () => import('./admin/pages/message-detail/message-detail.component').then(m => m.AdminMessageDetailComponent) },
      { path: 'actividad', title: 'Actividad | HESA Admin', loadComponent: () => import('./admin/pages/activity-log/activity-log.component').then(m => m.AdminActivityLogComponent) },
      { path: 'configuracion/general', title: 'Configuración | HESA Admin', loadComponent: () => import('./admin/pages/settings/settings.component').then(m => m.AdminSettingsComponent) },
      { path: 'configuracion/contacto', loadComponent: () => import('./admin/pages/settings/settings.component').then(m => m.AdminSettingsComponent) },
      { path: 'configuracion/redes', loadComponent: () => import('./admin/pages/settings/settings.component').then(m => m.AdminSettingsComponent) },
      { path: 'configuracion/seo', loadComponent: () => import('./admin/pages/settings/settings.component').then(m => m.AdminSettingsComponent) },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  // 404 page
  { path: '**', title: 'Página no encontrada | HESA', loadComponent: () => import('./public/pages/not-found/not-found.component').then(m => m.NotFoundComponent) }
];
