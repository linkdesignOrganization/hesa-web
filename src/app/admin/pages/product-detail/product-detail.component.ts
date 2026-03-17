import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MockDataService, Product } from '../../../shared/services/mock-data.service';

@Component({
  selector: 'app-admin-product-detail',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="admin-detail">
      <div class="admin-detail__header">
        <a routerLink="/admin/productos" class="admin-detail__back">&larr; Volver a productos</a>
        @if (product()) {
          <a [routerLink]="'/admin/productos/' + product()!.id + '/editar'" class="btn btn-primary">Editar producto</a>
        }
      </div>
      @if (loading()) {
        <div class="skeleton-block" style="height: 400px; border-radius: 12px;"></div>
      } @else if (product()) {
        <div class="admin-detail__layout">
          <div class="admin-detail__image">
            <div class="admin-detail__image-placeholder">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--neutral-200)" stroke-width="1"><rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
            </div>
          </div>
          <div class="admin-detail__info">
            <h1>{{ product()!.name.es }}</h1>
            <p class="admin-detail__brand">{{ product()!.brand }}</p>
            <div class="admin-detail__badges">
              <span class="badge badge-pharma">{{ product()!.category }}</span>
              <span class="badge" [class.badge-active]="product()!.isActive" [class.badge-inactive]="!product()!.isActive">{{ product()!.isActive ? 'Activo' : 'Inactivo' }}</span>
            </div>
            <div class="admin-detail__section">
              <h3>Descripcion</h3>
              <p>{{ product()!.description.es }}</p>
            </div>
            <div class="admin-detail__section">
              <h3>Presentaciones</h3>
              <div class="admin-detail__pills">
                @for (pres of product()!.presentations; track pres) {
                  <span class="admin-detail__pill">{{ pres }}</span>
                }
              </div>
            </div>
            <div class="admin-detail__section">
              <h3>Especies</h3>
              <div class="admin-detail__pills">
                @for (sp of product()!.species; track sp) {
                  <span class="admin-detail__pill">{{ sp }}</span>
                }
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .admin-detail__header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    .admin-detail__back { color: var(--neutral-500); text-decoration: none; font-size: 14px; &:hover { color: var(--brand-primary); } }
    .admin-detail__layout { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; }
    .admin-detail__image-placeholder { aspect-ratio: 1; background: var(--neutral-50); border-radius: 12px; display: flex; align-items: center; justify-content: center; }
    .admin-detail__info h1 { font-size: 28px; font-weight: 700; margin-bottom: 8px; }
    .admin-detail__brand { color: var(--neutral-500); margin-bottom: 16px; }
    .admin-detail__badges { display: flex; gap: 8px; margin-bottom: 24px; }
    .admin-detail__section { margin-bottom: 24px; h3 { font-size: 14px; font-weight: 600; text-transform: uppercase; color: var(--neutral-400); margin-bottom: 8px; } }
    .admin-detail__pills { display: flex; flex-wrap: wrap; gap: 8px; }
    .admin-detail__pill { padding: 4px 12px; background: var(--neutral-50); border: 1px solid var(--neutral-200); border-radius: 20px; font-size: 13px; }
    .skeleton-block { background: linear-gradient(90deg, var(--neutral-100) 25%, var(--neutral-50) 50%, var(--neutral-100) 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; }
    @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
    @media (max-width: 768px) { .admin-detail__layout { grid-template-columns: 1fr; } }
  `]
})
export class AdminProductDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private mockData = inject(MockDataService);
  product = signal<Product | null>(null);
  loading = signal(true);

  async ngOnInit(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const p = await this.mockData.getProductById(id);
      this.product.set(p || null);
    }
    this.loading.set(false);
  }
}
