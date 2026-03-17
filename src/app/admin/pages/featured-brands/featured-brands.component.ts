import { Component, inject, signal, OnInit } from '@angular/core';
import { MockDataService, Brand } from '../../../shared/services/mock-data.service';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
  selector: 'app-admin-featured-brands',
  standalone: true,
  template: `
    <div>
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
        <h1 style="font-size: 24px; font-weight: 700;">Marcas Destacadas</h1>
        <button class="btn btn-primary" (click)="toast.info('Modal de seleccion de marcas')">+ Agregar marca</button>
      </div>
      @if (loading()) {
        <div style="display: flex; flex-direction: column; gap: 12px;">
          @for (i of [1,2,3,4]; track i) { <div class="skeleton-block" style="height: 64px; border-radius: 8px;"></div> }
        </div>
      } @else {
        <div style="display: flex; flex-direction: column; gap: 12px;">
          @for (brand of brands(); track brand.id) {
            <div class="featured-item">
              <span class="featured-item__drag">&#x2630;</span>
              <div class="featured-item__logo">{{ brand.logoPlaceholder }}</div>
              <div class="featured-item__info"><span class="featured-item__name">{{ brand.name }}</span><span class="featured-item__brand">{{ brand.country }}</span></div>
              <button class="featured-item__remove" aria-label="Remover">&times;</button>
            </div>
          }
        </div>
        <button class="btn btn-primary" style="margin-top: 20px;" (click)="toast.success('Marcas destacadas actualizadas')">Guardar orden</button>
      }
    </div>
  `,
  styles: [`
    .featured-item { display: flex; align-items: center; gap: 12px; padding: 12px 16px; background: white; border: 1px solid var(--neutral-200); border-radius: 8px; }
    .featured-item__drag { color: var(--neutral-300); cursor: grab; font-size: 18px; }
    .featured-item__logo { width: 40px; height: 40px; background: var(--neutral-100); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; color: var(--brand-primary); font-size: 16px; flex-shrink: 0; }
    .featured-item__info { flex: 1; }
    .featured-item__name { font-weight: 600; font-size: 14px; display: block; }
    .featured-item__brand { font-size: 12px; color: var(--neutral-500); }
    .featured-item__remove { background: none; border: none; font-size: 20px; color: var(--neutral-400); cursor: pointer; &:hover { color: var(--semantic-danger); } }
    .skeleton-block { background: linear-gradient(90deg, var(--neutral-100) 25%, var(--neutral-50) 50%, var(--neutral-100) 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; }
    @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
  `]
})
export class AdminFeaturedBrandsComponent implements OnInit {
  private mockData = inject(MockDataService);
  toast = inject(ToastService);
  brands = signal<Brand[]>([]);
  loading = signal(true);

  async ngOnInit(): Promise<void> {
    const data = await this.mockData.getFeaturedBrands();
    this.brands.set(data);
    this.loading.set(false);
  }
}
