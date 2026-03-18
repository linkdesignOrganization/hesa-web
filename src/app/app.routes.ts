import { Routes } from '@angular/router';
import { authGuard } from './shared/guards/auth.guard';
import { unsavedChangesGuard } from './shared/guards/unsaved-changes.guard';

export const routes: Routes = [
  // Root redirect to /es/ (default) — actual language detection happens in AppComponent
  { path: '', redirectTo: 'es', pathMatch: 'full' },

  // Spanish public routes
  { path: 'es', loadComponent: () => import('./public/pages/home/home.component').then(m => m.HomeComponent) },
  { path: 'es/catalogo', loadComponent: () => import('./public/pages/catalog/catalog.component').then(m => m.CatalogComponent) },
  { path: 'es/catalogo/farmacos', loadComponent: () => import('./public/pages/catalog-category/catalog-category.component').then(m => m.CatalogCategoryComponent) },
  { path: 'es/catalogo/alimentos', loadComponent: () => import('./public/pages/catalog-category/catalog-category.component').then(m => m.CatalogCategoryComponent) },
  { path: 'es/catalogo/equipos', loadComponent: () => import('./public/pages/catalog-category/catalog-category.component').then(m => m.CatalogCategoryComponent) },
  { path: 'es/catalogo/:category/:slug', loadComponent: () => import('./public/pages/product-detail/product-detail.component').then(m => m.ProductDetailComponent) },
  { path: 'es/marcas', loadComponent: () => import('./public/pages/brands/brands.component').then(m => m.BrandsComponent) },
  { path: 'es/marcas/:slug', loadComponent: () => import('./public/pages/brand-detail/brand-detail.component').then(m => m.BrandDetailComponent) },
  { path: 'es/nosotros', loadComponent: () => import('./public/pages/about/about.component').then(m => m.AboutComponent) },
  { path: 'es/distribuidores', loadComponent: () => import('./public/pages/distributors/distributors.component').then(m => m.DistributorsComponent) },
  { path: 'es/contacto', loadComponent: () => import('./public/pages/contact/contact.component').then(m => m.ContactComponent) },
  { path: 'es/busqueda', loadComponent: () => import('./public/pages/search-results/search-results.component').then(m => m.SearchResultsComponent) },

  // English public routes
  { path: 'en', loadComponent: () => import('./public/pages/home/home.component').then(m => m.HomeComponent) },
  { path: 'en/catalog', loadComponent: () => import('./public/pages/catalog/catalog.component').then(m => m.CatalogComponent) },
  { path: 'en/catalog/pharmaceuticals', loadComponent: () => import('./public/pages/catalog-category/catalog-category.component').then(m => m.CatalogCategoryComponent) },
  { path: 'en/catalog/food', loadComponent: () => import('./public/pages/catalog-category/catalog-category.component').then(m => m.CatalogCategoryComponent) },
  { path: 'en/catalog/equipment', loadComponent: () => import('./public/pages/catalog-category/catalog-category.component').then(m => m.CatalogCategoryComponent) },
  { path: 'en/catalog/:category/:slug', loadComponent: () => import('./public/pages/product-detail/product-detail.component').then(m => m.ProductDetailComponent) },
  { path: 'en/brands', loadComponent: () => import('./public/pages/brands/brands.component').then(m => m.BrandsComponent) },
  { path: 'en/brands/:slug', loadComponent: () => import('./public/pages/brand-detail/brand-detail.component').then(m => m.BrandDetailComponent) },
  { path: 'en/about', loadComponent: () => import('./public/pages/about/about.component').then(m => m.AboutComponent) },
  { path: 'en/distributors', loadComponent: () => import('./public/pages/distributors/distributors.component').then(m => m.DistributorsComponent) },
  { path: 'en/contact', loadComponent: () => import('./public/pages/contact/contact.component').then(m => m.ContactComponent) },
  { path: 'en/search', loadComponent: () => import('./public/pages/search-results/search-results.component').then(m => m.SearchResultsComponent) },

  // Admin routes
  { path: 'admin/login', loadComponent: () => import('./admin/pages/login/login.component').then(m => m.AdminLoginComponent) },
  {
    path: 'admin',
    loadComponent: () => import('./admin/layout/admin-layout.component').then(m => m.AdminLayoutComponent),
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', loadComponent: () => import('./admin/pages/dashboard/dashboard.component').then(m => m.AdminDashboardComponent) },
      { path: 'productos', loadComponent: () => import('./admin/pages/products-list/products-list.component').then(m => m.AdminProductsListComponent) },
      { path: 'productos/crear', loadComponent: () => import('./admin/pages/product-form/product-form.component').then(m => m.AdminProductFormComponent), canDeactivate: [unsavedChangesGuard] },
      { path: 'productos/:id', loadComponent: () => import('./admin/pages/product-detail/product-detail.component').then(m => m.AdminProductDetailComponent) },
      { path: 'productos/:id/editar', loadComponent: () => import('./admin/pages/product-form/product-form.component').then(m => m.AdminProductFormComponent), canDeactivate: [unsavedChangesGuard] },
      { path: 'marcas', loadComponent: () => import('./admin/pages/brands-list/brands-list.component').then(m => m.AdminBrandsListComponent) },
      { path: 'marcas/crear', loadComponent: () => import('./admin/pages/brand-form/brand-form.component').then(m => m.AdminBrandFormComponent), canDeactivate: [unsavedChangesGuard] },
      { path: 'marcas/:id/editar', loadComponent: () => import('./admin/pages/brand-form/brand-form.component').then(m => m.AdminBrandFormComponent), canDeactivate: [unsavedChangesGuard] },
      { path: 'categorias', loadComponent: () => import('./admin/pages/categories/categories.component').then(m => m.AdminCategoriesComponent) },
      { path: 'home/hero', loadComponent: () => import('./admin/pages/home-hero/home-hero.component').then(m => m.AdminHomeHeroComponent) },
      { path: 'home/productos-destacados', loadComponent: () => import('./admin/pages/featured-products/featured-products.component').then(m => m.AdminFeaturedProductsComponent) },
      { path: 'home/marcas-destacadas', loadComponent: () => import('./admin/pages/featured-brands/featured-brands.component').then(m => m.AdminFeaturedBrandsComponent) },
      { path: 'contenido/nosotros', loadComponent: () => import('./admin/pages/content-editor/content-editor.component').then(m => m.AdminContentEditorComponent) },
      { path: 'contenido/equipo', loadComponent: () => import('./admin/pages/team-editor/team-editor.component').then(m => m.AdminTeamEditorComponent) },
      { path: 'contenido/distribuidores', loadComponent: () => import('./admin/pages/content-editor/content-editor.component').then(m => m.AdminContentEditorComponent) },
      { path: 'contenido/contacto', loadComponent: () => import('./admin/pages/content-editor/content-editor.component').then(m => m.AdminContentEditorComponent) },
      { path: 'contenido/politicas', loadComponent: () => import('./admin/pages/content-editor/content-editor.component').then(m => m.AdminContentEditorComponent) },
      { path: 'mensajes', loadComponent: () => import('./admin/pages/messages/messages.component').then(m => m.AdminMessagesComponent) },
      { path: 'mensajes/:id', loadComponent: () => import('./admin/pages/message-detail/message-detail.component').then(m => m.AdminMessageDetailComponent) },
      { path: 'configuracion/general', loadComponent: () => import('./admin/pages/settings/settings.component').then(m => m.AdminSettingsComponent) },
      { path: 'configuracion/contacto', loadComponent: () => import('./admin/pages/settings/settings.component').then(m => m.AdminSettingsComponent) },
      { path: 'configuracion/redes', loadComponent: () => import('./admin/pages/settings/settings.component').then(m => m.AdminSettingsComponent) },
      { path: 'configuracion/seo', loadComponent: () => import('./admin/pages/settings/settings.component').then(m => m.AdminSettingsComponent) },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  // 404 page
  { path: '**', loadComponent: () => import('./public/pages/not-found/not-found.component').then(m => m.NotFoundComponent) }
];
