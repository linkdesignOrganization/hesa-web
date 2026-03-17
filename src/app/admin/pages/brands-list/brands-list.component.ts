import { Component, inject, signal, OnInit, HostListener, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MockDataService, Brand } from '../../../shared/services/mock-data.service';
import { ConfirmModalComponent } from '../../components/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-admin-brands-list',
  standalone: true,
  imports: [RouterLink, ConfirmModalComponent],
  template: `
    <div class="brands-list">
      <div class="brands-list__toolbar">
        <h1>Marcas</h1>
        <a routerLink="/admin/marcas/crear" class="btn btn-primary">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Crear marca
        </a>
      </div>
      @if (loading()) {
        <div class="brands-list__grid">
          @for (i of [1,2,3,4,5,6]; track i) {
            <div class="skeleton-card"><div class="skeleton-circle"></div><div class="skeleton-line"></div><div class="skeleton-line skeleton-line--short"></div></div>
          }
        </div>
      } @else if (brands().length === 0) {
        <div class="brands-list__empty">
          <h2>No hay marcas registradas</h2>
          <a routerLink="/admin/marcas/crear" class="btn btn-primary">+ Crear marca</a>
        </div>
      } @else {
        <div class="brands-list__grid">
          @for (brand of brands(); track brand.id) {
            <div class="admin-brand-card">
              <div class="admin-brand-card__header">
                <div class="admin-brand-card__logo">{{ brand.logoPlaceholder }}</div>
                <div class="admin-brand-card__menu-wrapper">
                  <button class="admin-brand-card__menu-btn" (click)="toggleMenu(brand.id, $event)" [attr.aria-label]="'Opciones para ' + brand.name" aria-haspopup="true" [attr.aria-expanded]="openMenuId() === brand.id">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/></svg>
                  </button>
                  @if (openMenuId() === brand.id) {
                    <div class="admin-brand-card__dropdown" role="menu">
                      <a [routerLink]="'/admin/marcas/' + brand.id + '/editar'" class="admin-brand-card__dropdown-item" role="menuitem" (click)="closeMenu()">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
                        Editar
                      </a>
                      <a [routerLink]="'/admin/productos'" [queryParams]="{ marca: brand.name }" class="admin-brand-card__dropdown-item" role="menuitem" (click)="closeMenu()">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
                        Ver productos
                      </a>
                      <button class="admin-brand-card__dropdown-item admin-brand-card__dropdown-item--danger" role="menuitem" (click)="requestDelete(brand)">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                        Eliminar
                      </button>
                    </div>
                  }
                </div>
              </div>
              <h3 class="admin-brand-card__name">{{ brand.name }}</h3>
              <p class="admin-brand-card__country">{{ brand.country }}</p>
              <div class="admin-brand-card__badges">
                @for (cat of brand.categories; track cat) {
                  <span class="badge" [class.badge-pharma]="cat === 'Farmacos'" [class.badge-food]="cat === 'Alimentos'" [class.badge-equipment]="cat === 'Equipos'">{{ cat }}</span>
                }
              </div>
            </div>
          }
        </div>
      }
    </div>

    <app-confirm-modal
      #deleteModal
      variant="danger"
      title="Eliminar marca"
      [description]="deleteModalDescription()"
      confirmLabel="Eliminar"
      cancelLabel="Cancelar"
      (confirmed)="onDeleteConfirmed()"
      (cancelled)="brandToDelete.set(null)"
    />
  `,
  styles: [`
    .brands-list__toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; h1 { font-size: 24px; font-weight: 700; } }
    .brands-list__grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 20px; }
    .admin-brand-card { display: block; padding: 24px; background: white; border: 1px solid var(--neutral-200); border-radius: 12px; color: inherit; transition: box-shadow 0.2s; &:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.08); } }
    .admin-brand-card__header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 12px; }
    .admin-brand-card__logo { width: 56px; height: 56px; border-radius: 50%; background: var(--neutral-100); display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: 700; color: var(--brand-primary); }
    .admin-brand-card__menu-wrapper { position: relative; }
    .admin-brand-card__menu-btn {
      display: flex; align-items: center; justify-content: center;
      width: 36px; height: 36px; border-radius: 8px;
      color: var(--neutral-400); background: none; border: none; cursor: pointer;
      transition: background-color 0.15s ease-out, color 0.15s ease-out;
      &:hover { background-color: var(--neutral-100); color: var(--neutral-900); }
      @media (max-width: 767px) { width: 44px; height: 44px; }
    }
    .admin-brand-card__dropdown {
      position: absolute; top: 100%; right: 0; margin-top: 4px;
      min-width: 180px; background-color: var(--neutral-white);
      border: 1px solid var(--neutral-200); border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1); z-index: var(--z-dropdown);
      overflow: hidden; animation: dropdownFadeIn 0.15s ease-out;
    }
    .admin-brand-card__dropdown-item {
      display: flex; align-items: center; gap: 10px;
      padding: 10px 16px; font-size: 14px; font-weight: 500;
      color: var(--neutral-900); text-decoration: none;
      background: none; border: none; width: 100%; cursor: pointer;
      transition: background-color 0.15s ease-out; text-align: left;
      @media (max-width: 767px) { min-height: 44px; }
      &:hover { background-color: var(--neutral-50); }
      &--danger {
        color: var(--semantic-danger);
        border-top: 1px solid var(--neutral-200);
        &:hover { background-color: rgba(239, 68, 68, 0.05); }
      }
    }
    .admin-brand-card__name { font-size: 16px; font-weight: 600; margin-bottom: 4px; }
    .admin-brand-card__country { font-size: 13px; color: var(--neutral-500); margin-bottom: 12px; }
    .admin-brand-card__badges { display: flex; gap: 6px; flex-wrap: wrap; }
    .brands-list__empty { text-align: center; padding: 80px 0; h2 { margin-bottom: 16px; color: var(--neutral-400); } }
    .skeleton-card { padding: 24px; background: white; border: 1px solid var(--neutral-200); border-radius: 12px; }
    .skeleton-circle { width: 56px; height: 56px; border-radius: 50%; background: var(--neutral-100); margin-bottom: 12px; }
    .skeleton-line { height: 14px; background: var(--neutral-100); border-radius: 4px; margin-bottom: 8px; }
    .skeleton-line--short { width: 60%; }

    @keyframes dropdownFadeIn {
      from { opacity: 0; transform: translateY(-4px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class AdminBrandsListComponent implements OnInit {
  @ViewChild('deleteModal') deleteModal!: ConfirmModalComponent;

  private mockData = inject(MockDataService);
  private router = inject(Router);
  brands = signal<Brand[]>([]);
  loading = signal(true);
  openMenuId = signal<string | null>(null);
  brandToDelete = signal<Brand | null>(null);

  deleteModalDescription(): string {
    const brand = this.brandToDelete();
    return brand
      ? `Se eliminara la marca "${brand.name}" y no se podra recuperar.`
      : 'Esta accion no se puede deshacer.';
  }

  async ngOnInit(): Promise<void> {
    const data = await this.mockData.getBrands();
    this.brands.set(data);
    this.loading.set(false);
  }

  toggleMenu(brandId: string, event: Event): void {
    event.stopPropagation();
    this.openMenuId.update(current => current === brandId ? null : brandId);
  }

  closeMenu(): void {
    this.openMenuId.set(null);
  }

  requestDelete(brand: Brand): void {
    this.closeMenu();
    this.brandToDelete.set(brand);
    this.deleteModal.open();
  }

  onDeleteConfirmed(): void {
    const brand = this.brandToDelete();
    if (brand) {
      this.brands.update(list => list.filter(b => b.id !== brand.id));
      this.brandToDelete.set(null);
    }
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.closeMenu();
  }
}
