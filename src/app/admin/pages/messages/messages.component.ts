import { Component, signal, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SlicePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, ApiMessage } from '../../../shared/services/api.service';
import { ToastService } from '../../../shared/services/toast.service';
import { ConfirmModalComponent } from '../../components/confirm-modal/confirm-modal.component';
import { getTypeLabel, getRelativeDate } from '../../../shared/utils/message-helpers';

@Component({
  selector: 'app-admin-messages',
  standalone: true,
  imports: [RouterLink, SlicePipe, FormsModule, ConfirmModalComponent],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.scss'
})
export class AdminMessagesComponent implements OnInit {
  private api = inject(ApiService);
  private toast = inject(ToastService);

  viewMode = signal<'kanban' | 'table'>('kanban');
  messages = signal<ApiMessage[]>([]);
  loading = signal(true);
  draggedMessageId = signal<string | null>(null);
  dropTargetCol = signal<string | null>(null);

  // Filters (REQ-294)
  filterType = '';
  filterStatus = '';
  filterSearch = '';

  // Delete confirmation
  showDeleteModal = signal(false);
  deleteTarget = signal<ApiMessage | null>(null);

  /** Apply type/search filters (not status, since kanban columns ARE the status) */
  private get baseFilteredMessages(): ApiMessage[] {
    let msgs = this.messages();
    if (this.filterType) msgs = msgs.filter(m => m.type === this.filterType);
    if (this.filterSearch) {
      const s = this.filterSearch.toLowerCase();
      msgs = msgs.filter(m => m.name.toLowerCase().includes(s) || m.email.toLowerCase().includes(s));
    }
    return msgs;
  }

  get newMessages(): ApiMessage[] { return this.baseFilteredMessages.filter(m => m.status === 'nuevo'); }
  get inProgressMessages(): ApiMessage[] { return this.baseFilteredMessages.filter(m => m.status === 'en-proceso'); }
  get attendedMessages(): ApiMessage[] { return this.baseFilteredMessages.filter(m => m.status === 'atendido'); }

  get filteredMessages(): ApiMessage[] {
    let msgs = this.baseFilteredMessages;
    if (this.filterStatus) msgs = msgs.filter(m => m.status === this.filterStatus);
    return msgs;
  }

  async ngOnInit(): Promise<void> {
    await this.loadMessages();
  }

  async loadMessages(): Promise<void> {
    this.loading.set(true);
    try {
      const result = await this.api.adminGetMessages({ limit: 200 });
      this.messages.set(result.data);
    } catch {
      this.toast.error('Error al cargar los mensajes');
    }
    this.loading.set(false);
  }

  /** Map type key to display label (REQ-296) */
  getTypeLabel = getTypeLabel;

  /** Calculate relative date from ISO string */
  getRelativeDate = getRelativeDate;

  getStatusLabel(status: string): string {
    return status === 'nuevo' ? 'Nuevo' : status === 'en-proceso' ? 'En Proceso' : 'Atendido';
  }

  // Drag & drop (REQ-292)
  onDragStart(messageId: string): void {
    this.draggedMessageId.set(messageId);
  }

  onDragEnd(): void {
    this.draggedMessageId.set(null);
    this.dropTargetCol.set(null);
  }

  onDragOver(event: DragEvent, colStatus: string): void {
    event.preventDefault();
    this.dropTargetCol.set(colStatus);
  }

  onDragLeave(colStatus: string): void {
    if (this.dropTargetCol() === colStatus) {
      this.dropTargetCol.set(null);
    }
  }

  async onDrop(event: DragEvent, targetStatus: 'nuevo' | 'en-proceso' | 'atendido'): Promise<void> {
    event.preventDefault();
    const messageId = this.draggedMessageId();
    if (!messageId) return;

    const msg = this.messages().find(m => m._id === messageId);
    if (!msg || msg.status === targetStatus) {
      this.draggedMessageId.set(null);
      this.dropTargetCol.set(null);
      return;
    }

    // Optimistic update
    const updatedMessages = this.messages().map(m =>
      m._id === messageId ? { ...m, status: targetStatus } : m
    );
    this.messages.set(updatedMessages);

    try {
      await this.api.adminUpdateMessageStatus(messageId, targetStatus);
      const statusLabel = this.getStatusLabel(targetStatus);
      this.toast.success(`Mensaje de ${msg.name} movido a ${statusLabel}`);
    } catch {
      // Revert on error
      const revertedMessages = this.messages().map(m =>
        m._id === messageId ? { ...m, status: msg.status } : m
      );
      this.messages.set(revertedMessages);
      this.toast.error('Error al actualizar el estado del mensaje');
    }

    this.draggedMessageId.set(null);
    this.dropTargetCol.set(null);
  }

  // CSV Export (REQ-295)
  async exportCsv(): Promise<void> {
    try {
      const params: Record<string, string> = {};
      if (this.filterType) params['type'] = this.filterType;
      if (this.filterStatus) params['status'] = this.filterStatus;
      if (this.filterSearch) params['search'] = this.filterSearch;

      const url = this.api.getExportMessagesUrl(params);
      // Open in new tab — the auth interceptor will add the token for admin requests
      window.open(url, '_blank');
    } catch {
      this.toast.error('Error al exportar los mensajes');
    }
  }

  // Delete with confirmation (REQ-302)
  confirmDelete(msg: ApiMessage): void {
    this.deleteTarget.set(msg);
    this.showDeleteModal.set(true);
  }

  async onDeleteConfirmed(): Promise<void> {
    const target = this.deleteTarget();
    if (!target) return;

    try {
      await this.api.adminDeleteMessage(target._id);
      this.messages.update(msgs => msgs.filter(m => m._id !== target._id));
      this.toast.success('Mensaje eliminado correctamente');
    } catch {
      this.toast.error('Error al eliminar el mensaje');
    }
    this.showDeleteModal.set(false);
    this.deleteTarget.set(null);
  }

  onDeleteCancelled(): void {
    this.showDeleteModal.set(false);
    this.deleteTarget.set(null);
  }

  clearFilters(): void {
    this.filterType = '';
    this.filterStatus = '';
    this.filterSearch = '';
  }
}
