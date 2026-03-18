import { Component, inject, signal, OnInit, HostListener, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ApiService, ApiBrand } from '../../../shared/services/api.service';
import { ToastService } from '../../../shared/services/toast.service';
import { ConfirmModalComponent } from '../../components/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-admin-brands-list',
  standalone: true,
  imports: [RouterLink, ConfirmModalComponent],
  templateUrl: './brands-list.component.html',
  styleUrl: './brands-list.component.scss'
})
export class AdminBrandsListComponent implements OnInit {
  @ViewChild('deleteModal') deleteModal!: ConfirmModalComponent;

  private api = inject(ApiService);
  private toast = inject(ToastService);
  private router = inject(Router);
  brands = signal<ApiBrand[]>([]);
  loading = signal(true);
  openMenuId = signal<string | null>(null);
  brandToDelete = signal<ApiBrand | null>(null);
  viewMode = signal<'card' | 'table'>('card');

  deleteModalDescription(): string {
    const brand = this.brandToDelete();
    if (!brand) return 'Esta accion no se puede deshacer.';
    const count = brand.productCount ?? 0;
    if (count > 0) {
      return `La marca "${brand.name}" tiene ${count} producto(s) asociado(s). Al eliminarla, estos productos quedaran sin marca. Esta accion no se puede deshacer.`;
    }
    return `Se eliminara la marca "${brand.name}" y no se podra recuperar.`;
  }

  async ngOnInit(): Promise<void> {
    await this.loadBrands();
  }

  private async loadBrands(): Promise<void> {
    this.loading.set(true);
    try {
      const data = await this.api.adminGetBrands();
      this.brands.set(data);
    } catch {
      this.toast.error('Error al cargar las marcas');
    }
    this.loading.set(false);
  }

  toggleMenu(brandId: string, event: Event): void {
    event.stopPropagation();
    this.openMenuId.update(current => current === brandId ? null : brandId);
  }

  closeMenu(): void {
    this.openMenuId.set(null);
  }

  requestDelete(brand: ApiBrand): void {
    this.closeMenu();
    this.brandToDelete.set(brand);
    this.deleteModal.open();
  }

  async onDeleteConfirmed(): Promise<void> {
    const brand = this.brandToDelete();
    if (brand) {
      try {
        const result = await this.api.adminDeleteBrand(brand._id);
        if (result.hadProducts > 0) {
          this.toast.warning(`Marca "${brand.name}" eliminada. Tenia ${result.hadProducts} productos asociados.`);
        } else {
          this.toast.success(`Marca "${brand.name}" eliminada correctamente.`);
        }
        await this.loadBrands();
      } catch {
        this.toast.error('Error al eliminar la marca');
      }
      this.brandToDelete.set(null);
    }
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.closeMenu();
  }
}
