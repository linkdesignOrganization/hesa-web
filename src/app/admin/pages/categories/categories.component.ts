import { Component, inject } from '@angular/core';
import { MockDataService } from '../../../shared/services/mock-data.service';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
  selector: 'app-admin-categories',
  standalone: true,
  template: `
    <div class="categories-page">
      <h1 style="font-size: 24px; font-weight: 700; margin-bottom: 24px;">Categorias y Filtros</h1>
      @for (cat of categories; track cat.id) {
        <div class="category-editor-card">
          <div class="category-editor-card__header">
            <h2>{{ cat.name.es }}</h2>
          </div>
          @for (group of cat.subcategories; track group.key) {
            <div class="category-editor-card__group">
              <h3>{{ group.label.es }}</h3>
              <div class="category-editor-card__tags">
                @for (val of group.values; track val.es) {
                  <span class="category-editor-card__tag">
                    {{ val.es }}
                    <button class="category-editor-card__tag-remove" aria-label="Remover">&times;</button>
                  </span>
                }
                <button class="category-editor-card__add" (click)="toast.info('Agregar nuevo valor')">+</button>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .category-editor-card { background: white; border: 1px solid var(--neutral-200); border-radius: 12px; padding: 24px; margin-bottom: 20px; }
    .category-editor-card__header h2 { font-size: 18px; font-weight: 600; margin-bottom: 16px; }
    .category-editor-card__group { margin-bottom: 16px; h3 { font-size: 13px; font-weight: 600; text-transform: uppercase; color: var(--neutral-400); margin-bottom: 8px; } }
    .category-editor-card__tags { display: flex; flex-wrap: wrap; gap: 8px; }
    .category-editor-card__tag { display: inline-flex; align-items: center; gap: 6px; padding: 4px 12px; background: var(--neutral-50); border: 1px solid var(--neutral-200); border-radius: 20px; font-size: 13px; }
    .category-editor-card__tag-remove { background: none; border: none; cursor: pointer; color: var(--neutral-400); font-size: 16px; &:hover { color: var(--semantic-danger); } }
    .category-editor-card__add { width: 28px; height: 28px; border-radius: 50%; border: 1px dashed var(--neutral-300); background: none; cursor: pointer; font-size: 16px; color: var(--neutral-400); &:hover { border-color: var(--brand-primary); color: var(--brand-primary); } }
  `]
})
export class AdminCategoriesComponent {
  private mockData = inject(MockDataService);
  toast = inject(ToastService);
  categories = this.mockData.getCategories();
}
