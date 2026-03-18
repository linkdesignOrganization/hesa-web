import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../../shared/services/api.service';
import { ToastService } from '../../../shared/services/toast.service';
import { getRelativeDate } from '../../../shared/utils/message-helpers';

interface ActivityItem {
  _id: string;
  action: string;
  entity: string;
  entityName?: string;
  user?: string;
  details?: string;
  createdAt: string;
}

interface PaginatedActivity {
  items: ActivityItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Component({
  selector: 'app-admin-activity-log',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="activity-page">
      <div class="activity-page__header">
        <div>
          <h1 class="activity-page__title">Historial de Actividad</h1>
          <p class="activity-page__desc">Registro completo de acciones realizadas en el panel</p>
        </div>
        <a routerLink="/admin/dashboard" class="btn btn-outline-gray btn-sm">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
          Volver al dashboard
        </a>
      </div>

      @if (loading()) {
        <div class="activity-page__card">
          @for (i of [1,2,3,4,5,6,7]; track i) {
            <div class="activity-page__item-skeleton">
              <div class="skeleton-block" style="width: 8px; height: 8px; border-radius: 50%;"></div>
              <div class="skeleton-block" style="flex: 1; height: 14px;"></div>
              <div class="skeleton-block" style="width: 80px; height: 12px;"></div>
            </div>
          }
        </div>
      } @else if (error()) {
        <div class="activity-page__error" role="alert">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--semantic-danger)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <p>Error al cargar el historial</p>
          <button class="btn btn-outline" (click)="loadActivity()">Reintentar</button>
        </div>
      } @else if (activities().length === 0) {
        <div class="activity-page__empty">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--neutral-200)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          <p>No hay actividad registrada</p>
        </div>
      } @else {
        <div class="activity-page__card">
          @for (activity of activities(); track activity._id) {
            <div class="activity-page__item">
              <div class="activity-page__dot" [class.activity-page__dot--create]="activity.action === 'create'" [class.activity-page__dot--delete]="activity.action === 'delete'" [class.activity-page__dot--update]="activity.action === 'update'"></div>
              <div class="activity-page__item-content">
                <p class="activity-page__item-text">{{ getActivityText(activity) }}</p>
                @if (activity.user) {
                  <span class="activity-page__item-user">por {{ activity.user }}</span>
                }
              </div>
              <span class="activity-page__item-date">{{ getRelativeDate(activity.createdAt) }}</span>
            </div>
          }
        </div>

        <!-- Pagination -->
        @if (totalPages() > 1) {
          <div class="activity-page__pagination">
            <button class="btn btn-outline-gray btn-sm" [disabled]="currentPage() <= 1" (click)="goToPage(currentPage() - 1)">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
              Anterior
            </button>
            <span class="activity-page__page-info">Pagina {{ currentPage() }} de {{ totalPages() }}</span>
            <button class="btn btn-outline-gray btn-sm" [disabled]="currentPage() >= totalPages()" (click)="goToPage(currentPage() + 1)">
              Siguiente
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          </div>
        }
      }
    </div>
  `,
  styles: [`
    .activity-page {
      &__header {
        display: flex; justify-content: space-between; align-items: flex-start;
        margin-bottom: 24px; flex-wrap: wrap; gap: 12px;
      }
      &__title { font-size: 24px; font-weight: 700; }
      &__desc { font-size: 14px; color: var(--neutral-400); margin-top: 4px; }
      &__card {
        background: var(--neutral-white); border-radius: 12px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.06); overflow: hidden;
      }
      &__item {
        display: flex; align-items: center; gap: 12px;
        padding: 14px 20px; border-bottom: 1px solid var(--neutral-200);
        &:last-child { border-bottom: none; }
      }
      &__item-skeleton {
        display: flex; align-items: center; gap: 12px;
        padding: 14px 20px; border-bottom: 1px solid var(--neutral-200);
        &:last-child { border-bottom: none; }
      }
      &__item-content { flex: 1; min-width: 0; }
      &__item-text { font-size: 14px; color: var(--neutral-900); }
      &__item-user { font-size: 12px; color: var(--neutral-400); }
      &__item-date { font-size: 12px; color: var(--neutral-400); white-space: nowrap; }
      &__dot {
        width: 8px; height: 8px; border-radius: 50%;
        background-color: var(--brand-primary); flex-shrink: 0;
        &--create { background-color: var(--semantic-success); }
        &--delete { background-color: var(--semantic-danger); }
        &--update { background-color: var(--brand-primary); }
      }
      &__pagination {
        display: flex; justify-content: center; align-items: center;
        gap: 16px; margin-top: 24px; padding-bottom: 8px;
      }
      &__page-info { font-size: 14px; color: var(--neutral-500); }
      &__error, &__empty {
        display: flex; flex-direction: column; align-items: center;
        text-align: center; gap: 16px; padding: 80px 20px;
        background: var(--neutral-white); border-radius: 12px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.06);
        p { font-size: 16px; color: var(--neutral-400); }
      }
    }
    .skeleton-block { background: var(--neutral-100); border-radius: 4px; }
  `]
})
export class AdminActivityLogComponent implements OnInit {
  private api = inject(ApiService);
  private toast = inject(ToastService);

  activities = signal<ActivityItem[]>([]);
  loading = signal(true);
  error = signal(false);
  currentPage = signal(1);
  totalPages = signal(1);
  private readonly pageSize = 20;

  getRelativeDate = getRelativeDate;

  async ngOnInit(): Promise<void> {
    await this.loadActivity();
  }

  async loadActivity(): Promise<void> {
    this.loading.set(true);
    this.error.set(false);
    try {
      const result = await this.api.adminGetActivityLog(this.currentPage(), this.pageSize);
      this.activities.set(result.items);
      this.totalPages.set(result.totalPages);
    } catch {
      this.error.set(true);
    }
    this.loading.set(false);
  }

  async goToPage(page: number): Promise<void> {
    if (page < 1 || page > this.totalPages()) return;
    this.currentPage.set(page);
    await this.loadActivity();
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  getActivityText(activity: ActivityItem): string {
    const actions: Record<string, string> = {
      create: 'creado',
      update: 'actualizado',
      delete: 'eliminado',
      activate: 'activado',
      deactivate: 'desactivado',
    };
    const entities: Record<string, string> = {
      product: 'Producto',
      brand: 'Marca',
      category: 'Categoria',
      message: 'Mensaje',
      team_member: 'Miembro de equipo',
      content: 'Contenido',
      settings: 'Configuracion',
    };
    const action = actions[activity.action] || activity.action;
    const entity = entities[activity.entity] || activity.entity;
    const name = activity.entityName ? ` "${activity.entityName}"` : '';
    return `${entity}${name} ${action}`;
  }
}
