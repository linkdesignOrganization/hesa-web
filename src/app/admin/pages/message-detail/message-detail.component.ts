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
  templateUrl: './message-detail.component.html',
  styleUrl: './message-detail.component.scss'
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
