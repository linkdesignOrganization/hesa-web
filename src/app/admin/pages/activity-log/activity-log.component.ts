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
  templateUrl: './activity-log.component.html',
  styleUrl: './activity-log.component.scss'
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
