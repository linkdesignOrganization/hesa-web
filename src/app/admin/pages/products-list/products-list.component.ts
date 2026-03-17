import { Component, signal, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MockDataService, Product } from '../../../shared/services/mock-data.service';
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
  private mockData = inject(MockDataService);
  private toast = inject(ToastService);
  viewMode = signal<'card' | 'table'>('card');
  products = signal<Product[]>([]);
  loading = signal(true);
  openMenuId = signal<string | null>(null);

  // Delete confirmation state (UX-046)
  showDeleteModal = signal(false);
  productToDelete = signal<Product | null>(null);

  async ngOnInit(): Promise<void> {
    const data = await this.mockData.getProducts();
    this.products.set(data);
    this.loading.set(false);
  }

  getCategoryLabel(cat: string): string {
    return getCategoryLabel(cat, 'es');
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

  duplicateProduct(product: Product, event: Event): void {
    this.stopEvent(event);
    this.closeMenu();
    this.toast.success('Producto duplicado (mock)');
  }

  toggleActive(product: Product, event: Event): void {
    this.stopEvent(event);
    this.closeMenu();
    const action = product.isActive ? 'desactivado' : 'activado';
    this.toast.success(`Producto ${action} (mock)`);
  }

  deleteProduct(product: Product, event: Event): void {
    this.stopEvent(event);
    this.closeMenu();
    this.productToDelete.set(product);
    this.showDeleteModal.set(true);
  }

  confirmDelete(): void {
    const product = this.productToDelete();
    if (product) {
      this.products.update(list => list.filter(p => p.id !== product.id));
      this.toast.success(`"${product.name.es}" eliminado (mock)`);
    }
    this.showDeleteModal.set(false);
    this.productToDelete.set(null);
  }

  cancelDelete(): void {
    this.showDeleteModal.set(false);
    this.productToDelete.set(null);
  }
}
