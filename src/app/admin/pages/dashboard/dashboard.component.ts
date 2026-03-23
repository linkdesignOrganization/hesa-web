import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SlicePipe } from '@angular/common';
import { ApiService, ApiDashboardData } from '../../../shared/services/api.service';
import { getTypeLabel, getRelativeDate } from '../../../shared/utils/message-helpers';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [RouterLink, SlicePipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class AdminDashboardComponent implements OnInit {
  private api = inject(ApiService);
  data = signal<ApiDashboardData | null>(null);
  loading = signal(true);
  error = signal(false);

  async ngOnInit(): Promise<void> {
    await this.loadDashboard();
  }

  async loadDashboard(): Promise<void> {
    this.loading.set(true);
    this.error.set(false);
    try {
      const dashData = await this.api.adminGetDashboard();
      this.data.set(dashData);
    } catch {
      this.error.set(true);
    }
    this.loading.set(false);
  }

  /** Map type keys to display labels (REQ-296) */
  getTypeLabel = getTypeLabel;

  /** Map action to human-readable text */
  getActivityText(activity: ApiDashboardData['recentActivity'][0]): string {
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
      category: 'Categoría',
      message: 'Mensaje',
      team_member: 'Miembro de equipo',
      content: 'Contenido',
      settings: 'Configuración',
    };
    const action = actions[activity.action] || activity.action;
    const entity = entities[activity.entity] || activity.entity;
    const name = activity.entityName ? ` "${activity.entityName}"` : '';
    return `${entity}${name} ${action}`;
  }

  /** Calculate relative date from ISO string */
  getRelativeDate = getRelativeDate;
}
