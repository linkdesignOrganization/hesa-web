import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiService, ApiMessage } from '../../../shared/services/api.service';
import { ToastService } from '../../../shared/services/toast.service';
import { ConfirmModalComponent } from '../../components/confirm-modal/confirm-modal.component';
import { getTypeLabel } from '../../../shared/utils/message-helpers';

@Component({
  selector: 'app-admin-message-detail',
  standalone: true,
  imports: [RouterLink, ConfirmModalComponent],
  template: `
    <div>
      <a routerLink="/admin/mensajes" class="back-link">&larr; Volver a mensajes</a>
      @if (loading()) {
        <div class="skeleton-block" style="height: 300px; border-radius: 12px;"></div>
      } @else if (!message()) {
        <div class="message-detail__not-found">
          <p>Mensaje no encontrado</p>
          <a routerLink="/admin/mensajes" class="btn btn-primary">Volver a mensajes</a>
        </div>
      } @else {
        <div class="message-detail__layout">
          <div class="message-detail__sidebar">
            <div class="message-detail__contact-card">
              <h3>Datos de Contacto</h3>
              <p><strong>Nombre:</strong> {{ message()!.name }}</p>
              <p><strong>Email:</strong> <a [href]="'mailto:' + message()!.email" class="message-detail__email-link">{{ message()!.email }}</a></p>
              @if (message()!.phone) {
                <p><strong>Telefono:</strong> {{ message()!.phone }}</p>
              }
              @if (message()!.companyName) {
                <p><strong>Empresa:</strong> {{ message()!.companyName }}</p>
              }
              @if (message()!.country) {
                <p><strong>Pais:</strong> {{ message()!.country }}</p>
              }
              @if (message()!.productTypes) {
                <p><strong>Tipos de producto:</strong> {{ message()!.productTypes }}</p>
              }
              @if (message()!.productOfInterest) {
                <p><strong>Producto:</strong> {{ message()!.productOfInterest }}</p>
              }
              <div class="message-detail__badges">
                <span class="badge"
                  [class.badge-general]="message()!.type === 'info'"
                  [class.badge-commercial]="message()!.type === 'comercial'"
                  [class.badge-manufacturer]="message()!.type === 'fabricante'"
                  [class.badge-support]="message()!.type === 'soporte'"
                  [class.badge-other]="message()!.type === 'otro'">{{ getTypeLabel(message()!.type) }}</span>
                <span class="badge badge-source">{{ message()!.source === 'manufacturer' ? 'Formulario Fabricantes' : 'Formulario General' }}</span>
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
                <span class="message-detail__date">{{ getFormattedDate(message()!.createdAt) }}</span>
              </div>
              <p class="message-detail__message-text">{{ message()!.message }}</p>
            </div>
            <div class="message-detail__notes">
              <h3>Notas internas</h3>
              <textarea class="form-control" rows="3" placeholder="Agrega notas de seguimiento..." [value]="notes" (input)="onNotesInput($event)"></textarea>
              <button class="btn btn-outline btn-sm" style="margin-top: 8px;" (click)="saveNotes()" [disabled]="savingNotes()">
                @if (savingNotes()) {
                  <span class="spinner-sm"></span> Guardando...
                } @else {
                  Guardar nota
                }
              </button>
            </div>
            <div class="message-detail__actions">
              @if (message()!.status !== 'atendido') {
                <button class="btn btn-primary" (click)="markAsAttended()" [disabled]="updatingStatus()">
                  @if (updatingStatus()) {
                    <span class="spinner-sm"></span> Actualizando...
                  } @else {
                    Marcar como atendido
                  }
                </button>
              }
              <button class="btn btn-outline-gray btn-danger-text" (click)="showDeleteModal.set(true)">Eliminar mensaje</button>
            </div>
          </div>
        </div>
      }
    </div>

    @if (showDeleteModal()) {
      <app-confirm-modal
        title="Eliminar mensaje"
        [message]="'Estas seguro de eliminar este mensaje? Esta accion no se puede deshacer.'"
        confirmText="Eliminar"
        variant="danger"
        (confirmed)="deleteMessage()"
        (cancelled)="showDeleteModal.set(false)" />
    }
  `,
  styles: [`
    .back-link { color: var(--neutral-500); text-decoration: none; font-size: 14px; display: inline-block; margin-bottom: 24px; }
    .back-link:hover { color: var(--brand-primary); }
    .message-detail__layout { display: grid; grid-template-columns: 320px 1fr; gap: 24px; }
    .message-detail__contact-card, .message-detail__message-card, .message-detail__notes { background: white; border: 1px solid var(--neutral-200); border-radius: 12px; padding: 20px; margin-bottom: 16px; }
    .message-detail__contact-card h3, .message-detail__notes h3 { font-size: 14px; font-weight: 600; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.05em; color: var(--neutral-400); }
    .message-detail__contact-card p { font-size: 14px; margin-bottom: 6px; color: var(--neutral-600); }
    .message-detail__email-link { color: var(--brand-primary); text-decoration: none; }
    .message-detail__email-link:hover { text-decoration: underline; }
    .message-detail__badges { margin-top: 12px; display: flex; gap: 8px; flex-wrap: wrap; }
    .badge-source { background: var(--neutral-100); color: var(--neutral-600); font-size: 11px; }
    .message-detail__status { margin-top: 16px; }
    .message-detail__message-text { font-size: 15px; line-height: 1.6; color: var(--neutral-700); white-space: pre-wrap; }
    .message-detail__date { font-size: 13px; color: var(--neutral-400); }
    .message-detail__actions { display: flex; gap: 12px; margin-top: 16px; }
    .message-detail__not-found { text-align: center; padding: 48px; }
    .btn-danger-text { color: var(--semantic-danger) !important; }
    .skeleton-block { background: linear-gradient(90deg, var(--neutral-100) 25%, var(--neutral-50) 50%, var(--neutral-100) 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; }
    @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
    @media (max-width: 768px) { .message-detail__layout { grid-template-columns: 1fr; } }
  `]
})
export class AdminMessageDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private api = inject(ApiService);
  toast = inject(ToastService);
  message = signal<ApiMessage | null>(null);
  loading = signal(true);
  notes = '';
  savingNotes = signal(false);
  updatingStatus = signal(false);
  showDeleteModal = signal(false);

  async ngOnInit(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      try {
        const m = await this.api.adminGetMessage(id);
        this.message.set(m);
        this.notes = m.notes || '';
      } catch {
        this.message.set(null);
      }
    }
    this.loading.set(false);
  }

  getTypeLabel = getTypeLabel;

  getFormattedDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-CR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  async changeStatus(event: Event): Promise<void> {
    const select = event.target as HTMLSelectElement;
    const newStatus = select.value as 'nuevo' | 'en-proceso' | 'atendido';
    try {
      const updated = await this.api.adminUpdateMessageStatus(this.message()!._id, newStatus);
      this.message.set(updated);
      this.toast.success('Estado actualizado a ' + select.options[select.selectedIndex].text);
    } catch {
      this.toast.error('Error al actualizar el estado');
    }
  }

  onNotesInput(event: Event): void {
    this.notes = (event.target as HTMLTextAreaElement).value;
  }

  async saveNotes(): Promise<void> {
    this.savingNotes.set(true);
    try {
      const updated = await this.api.adminUpdateMessageNotes(this.message()!._id, this.notes);
      this.message.set(updated);
      this.toast.success('Nota guardada');
    } catch {
      this.toast.error('Error al guardar la nota');
    }
    this.savingNotes.set(false);
  }

  async markAsAttended(): Promise<void> {
    this.updatingStatus.set(true);
    try {
      await this.api.adminUpdateMessageStatus(this.message()!._id, 'atendido');
      this.toast.success('Mensaje marcado como atendido');
      this.router.navigate(['/admin/mensajes']);
    } catch {
      this.toast.error('Error al actualizar el estado');
    }
    this.updatingStatus.set(false);
  }

  async deleteMessage(): Promise<void> {
    try {
      await this.api.adminDeleteMessage(this.message()!._id);
      this.toast.success('Mensaje eliminado');
      this.router.navigate(['/admin/mensajes']);
    } catch {
      this.toast.error('Error al eliminar el mensaje');
    }
    this.showDeleteModal.set(false);
  }
}
