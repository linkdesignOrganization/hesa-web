import { Component, signal, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService, ApiProduct, ApiBrand } from '../../../shared/services/api.service';
import { ToastService } from '../../../shared/services/toast.service';
import { getCategoryLabel } from '../../../shared/utils/route-helpers';

@Component({
  selector: 'app-admin-products-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './products-list.component.html',
  styleUrl: './products-list.component.scss'
})
export class AdminProductsListComponent implements OnInit {
  private api = inject(ApiService);
  private toast = inject(ToastService);

  viewMode = signal<'card' | 'table'>('card');
  products = signal<ApiProduct[]>([]);
  brands = signal<ApiBrand[]>([]);
  loading = signal(true);
  openMenuId = signal<string | null>(null);

  // Filter state
  searchQuery = signal('');
  selectedCategory = signal('');
  selectedBrand = signal('');
  selectedStatus = signal('');

  // Pagination
  currentPage = signal(1);
  totalProducts = signal(0);
  totalPages = signal(0);
  pageSize = 24;

  // Delete confirmation state
  showDeleteModal = signal(false);
  productToDelete = signal<ApiProduct | null>(null);

  async ngOnInit(): Promise<void> {
    await Promise.all([this.loadProducts(), this.loadBrands()]);
  }

  private async loadProducts(): Promise<void> {
    this.loading.set(true);
    try {
      const result = await this.api.adminGetProducts({
        category: this.selectedCategory() || undefined,
        brand: this.selectedBrand() || undefined,
        search: this.searchQuery() || undefined,
        status: this.selectedStatus() || undefined,
        page: this.currentPage(),
        limit: this.pageSize,
      });
      this.products.set(result.data);
      this.totalProducts.set(result.total);
      this.totalPages.set(result.totalPages);
    } catch {
      this.toast.error('Error al cargar los productos');
    } finally {
      this.loading.set(false);
    }
  }

  private async loadBrands(): Promise<void> {
    try {
      this.brands.set(await this.api.adminGetBrands());
    } catch {
      // Non-critical
    }
  }

  getCategoryLabel(cat: string): string {
    return getCategoryLabel(cat, 'es');
  }

  getBrandName(product: ApiProduct): string {
    if (typeof product.brand === 'object' && product.brand) {
      return product.brand.name;
    }
    return '';
  }

  // Filter handlers
  async onSearchChange(event: Event): Promise<void> {
    this.searchQuery.set((event.target as HTMLInputElement).value);
    this.currentPage.set(1);
    await this.loadProducts();
  }

  async onCategoryChange(event: Event): Promise<void> {
    this.selectedCategory.set((event.target as HTMLSelectElement).value);
    this.currentPage.set(1);
    await this.loadProducts();
  }

  async onBrandChange(event: Event): Promise<void> {
    this.selectedBrand.set((event.target as HTMLSelectElement).value);
    this.currentPage.set(1);
    await this.loadProducts();
  }

  async onStatusChange(event: Event): Promise<void> {
    this.selectedStatus.set((event.target as HTMLSelectElement).value);
    this.currentPage.set(1);
    await this.loadProducts();
  }

  async goToPage(page: number): Promise<void> {
    this.currentPage.set(page);
    await this.loadProducts();
  }

  get pagesArray(): number[] {
    return Array.from({ length: this.totalPages() }, (_, i) => i + 1);
  }

  private stopEvent(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
  }

  toggleMenu(productId: string, event: Event): void {
    this.stopEvent(event);
    this.openMenuId.update(current => current === productId ? null : productId);
  }

  closeMenu(): void {
    this.openMenuId.set(null);
  }

  async duplicateProduct(product: ApiProduct, event: Event): Promise<void> {
    this.stopEvent(event);
    this.closeMenu();
    try {
      await this.api.adminDuplicateProduct(product._id);
      this.toast.success('Producto duplicado correctamente');
      await this.loadProducts();
    } catch {
      this.toast.error('Error al duplicar el producto');
    }
  }

  async toggleActive(product: ApiProduct, event: Event): Promise<void> {
    this.stopEvent(event);
    this.closeMenu();
    try {
      const updated = await this.api.adminToggleProductActive(product._id);
      const action = updated.isActive ? 'activado' : 'desactivado';
      this.toast.success(`Producto ${action} correctamente`);
      await this.loadProducts();
    } catch {
      this.toast.error('Error al cambiar el estado del producto');
    }
  }

  deleteProduct(product: ApiProduct, event: Event): void {
    this.stopEvent(event);
    this.closeMenu();
    this.productToDelete.set(product);
    this.showDeleteModal.set(true);
  }

  async confirmDelete(): Promise<void> {
    const product = this.productToDelete();
    if (product) {
      try {
        await this.api.adminDeleteProduct(product._id);
        this.toast.success(`"${product.name.es}" eliminado correctamente`);
        await this.loadProducts();
      } catch {
        this.toast.error('Error al eliminar el producto');
      }
    }
    this.showDeleteModal.set(false);
    this.productToDelete.set(null);
  }

  cancelDelete(): void {
    this.showDeleteModal.set(false);
    this.productToDelete.set(null);
  }
}
