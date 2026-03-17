import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MockDataService, Message } from '../../../shared/services/mock-data.service';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
  selector: 'app-admin-message-detail',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div>
      <a routerLink="/admin/mensajes" style="color: var(--neutral-500); text-decoration: none; font-size: 14px; display: inline-block; margin-bottom: 24px;">&larr; Volver a mensajes</a>
      @if (loading()) {
        <div class="skeleton-block" style="height: 300px; border-radius: 12px;"></div>
      } @else if (message()) {
        <div class="message-detail__layout">
          <div class="message-detail__sidebar">
            <div class="message-detail__contact-card">
              <h3>Datos de Contacto</h3>
              <p><strong>Nombre:</strong> {{ message()!.name }}</p>
              <p><strong>Email:</strong> {{ message()!.email }}</p>
              <p><strong>Telefono:</strong> {{ message()!.phone }}</p>
              @if (message()!.productOfInterest) {
                <p><strong>Producto:</strong> {{ message()!.productOfInterest }}</p>
              }
              <div style="margin-top: 12px;">
                <span class="badge" [class.badge-general]="message()!.type === 'Informacion'" [class.badge-commercial]="message()!.type === 'Comercial'" [class.badge-manufacturer]="message()!.type === 'Fabricante'" [class.badge-support]="message()!.type === 'Soporte'">{{ message()!.type }}</span>
              </div>
            </div>
            <div class="message-detail__status">
              <label class="form-label">Estado</label>
              <select class="form-select" [value]="message()!.status" (change)="changeStatus($event)">
                <option value="nuevo">Nuevo</option>
                <option value="en-proceso">En Proceso</option>
                <option value="atendido">Atendido</option>
              </select>
            </div>
          </div>
          <div class="message-detail__content">
            <div class="message-detail__message-card">
              <div class="message-detail__message-header">
                <span class="message-detail__date">{{ message()!.relativeDate }}</span>
              </div>
              <p class="message-detail__message-text">{{ message()!.message }}</p>
            </div>
            <div class="message-detail__notes">
              <h3>Notas internas</h3>
              <textarea class="form-control" rows="3" placeholder="Agrega notas de seguimiento..." [value]="message()!.notes || ''"></textarea>
              <button class="btn btn-outline btn-sm" style="margin-top: 8px;" (click)="toast.success('Nota guardada')">Guardar nota</button>
            </div>
            <div class="message-detail__actions">
              <button class="btn btn-primary" (click)="markAsAttended()">Marcar como atendido</button>
              <button class="btn btn-outline-gray btn-danger-text" (click)="toast.warning('Confirmar eliminacion')">Eliminar mensaje</button>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .message-detail__layout { display: grid; grid-template-columns: 320px 1fr; gap: 24px; }
    .message-detail__contact-card, .message-detail__message-card, .message-detail__notes { background: white; border: 1px solid var(--neutral-200); border-radius: 12px; padding: 20px; margin-bottom: 16px; }
    .message-detail__contact-card h3, .message-detail__notes h3 { font-size: 14px; font-weight: 600; margin-bottom: 12px; }
    .message-detail__contact-card p { font-size: 14px; margin-bottom: 6px; color: var(--neutral-600); }
    .message-detail__status { margin-top: 16px; }
    .message-detail__message-text { font-size: 15px; line-height: 1.6; color: var(--neutral-700); }
    .message-detail__date { font-size: 13px; color: var(--neutral-400); }
    .message-detail__actions { display: flex; gap: 12px; margin-top: 16px; }
    .btn-danger-text { color: var(--semantic-danger) !important; }
    .skeleton-block { background: linear-gradient(90deg, var(--neutral-100) 25%, var(--neutral-50) 50%, var(--neutral-100) 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; }
    @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
    @media (max-width: 768px) { .message-detail__layout { grid-template-columns: 1fr; } }
  `]
})
export class AdminMessageDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private mockData = inject(MockDataService);
  toast = inject(ToastService);
  message = signal<Message | null>(null);
  loading = signal(true);

  async ngOnInit(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const m = await this.mockData.getMessageById(id);
      this.message.set(m || null);
    }
    this.loading.set(false);
  }

  changeStatus(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.toast.success('Estado actualizado a ' + select.options[select.selectedIndex].text);
  }

  markAsAttended(): void {
    this.toast.success('Mensaje marcado como atendido');
    this.router.navigate(['/admin/mensajes']);
  }
}
