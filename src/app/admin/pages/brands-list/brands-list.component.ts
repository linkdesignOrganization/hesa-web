import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MockDataService, Brand } from '../../../shared/services/mock-data.service';

@Component({
  selector: 'app-admin-brands-list',
  standalone: true,
  imports: [RouterLink],
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
            <a [routerLink]="'/admin/marcas/' + brand.id + '/editar'" class="admin-brand-card">
              <div class="admin-brand-card__logo">{{ brand.logoPlaceholder }}</div>
              <h3 class="admin-brand-card__name">{{ brand.name }}</h3>
              <p class="admin-brand-card__country">{{ brand.country }}</p>
              <div class="admin-brand-card__badges">
                @for (cat of brand.categories; track cat) {
                  <span class="badge" [class.badge-pharma]="cat === 'Farmacos'" [class.badge-food]="cat === 'Alimentos'" [class.badge-equipment]="cat === 'Equipos'">{{ cat }}</span>
                }
              </div>
            </a>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .brands-list__toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; h1 { font-size: 24px; font-weight: 700; } }
    .brands-list__grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 20px; }
    .admin-brand-card { display: block; padding: 24px; background: white; border: 1px solid var(--neutral-200); border-radius: 12px; text-decoration: none; color: inherit; transition: box-shadow 0.2s; &:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.08); } }
    .admin-brand-card__logo { width: 56px; height: 56px; border-radius: 50%; background: var(--neutral-100); display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: 700; color: var(--brand-primary); margin-bottom: 12px; }
    .admin-brand-card__name { font-size: 16px; font-weight: 600; margin-bottom: 4px; }
    .admin-brand-card__country { font-size: 13px; color: var(--neutral-500); margin-bottom: 12px; }
    .admin-brand-card__badges { display: flex; gap: 6px; flex-wrap: wrap; }
    .brands-list__empty { text-align: center; padding: 80px 0; h2 { margin-bottom: 16px; color: var(--neutral-400); } }
    .skeleton-card { padding: 24px; background: white; border: 1px solid var(--neutral-200); border-radius: 12px; }
    .skeleton-circle { width: 56px; height: 56px; border-radius: 50%; background: var(--neutral-100); margin-bottom: 12px; }
    .skeleton-line { height: 14px; background: var(--neutral-100); border-radius: 4px; margin-bottom: 8px; }
    .skeleton-line--short { width: 60%; }
  `]
})
export class AdminBrandsListComponent implements OnInit {
  private mockData = inject(MockDataService);
  brands = signal<Brand[]>([]);
  loading = signal(true);

  async ngOnInit(): Promise<void> {
    const data = await this.mockData.getBrands();
    this.brands.set(data);
    this.loading.set(false);
  }
}
