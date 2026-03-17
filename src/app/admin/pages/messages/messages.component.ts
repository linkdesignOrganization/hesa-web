import { Component, signal, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SlicePipe } from '@angular/common';
import { MockDataService, Message } from '../../../shared/services/mock-data.service';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
  selector: 'app-admin-messages',
  standalone: true,
  imports: [RouterLink, SlicePipe],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.scss'
})
export class AdminMessagesComponent implements OnInit {
  private mockData = inject(MockDataService);
  private toast = inject(ToastService);

  viewMode = signal<'kanban' | 'table'>('kanban');
  messages = signal<Message[]>([]);
  loading = signal(true);
  draggedMessageId = signal<string | null>(null);
  dropTargetCol = signal<string | null>(null);

  get newMessages(): Message[] { return this.messages().filter(m => m.status === 'nuevo'); }
  get inProgressMessages(): Message[] { return this.messages().filter(m => m.status === 'en-proceso'); }
  get attendedMessages(): Message[] { return this.messages().filter(m => m.status === 'atendido'); }

  async ngOnInit(): Promise<void> {
    const data = await this.mockData.getMessages();
    this.messages.set(data);
    this.loading.set(false);
  }

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

  onDrop(event: DragEvent, targetStatus: 'nuevo' | 'en-proceso' | 'atendido'): void {
    event.preventDefault();
    const messageId = this.draggedMessageId();
    if (!messageId) return;

    const updatedMessages = this.messages().map(m => {
      if (m.id === messageId && m.status !== targetStatus) {
        const statusLabel = targetStatus === 'nuevo' ? 'Nuevos' : targetStatus === 'en-proceso' ? 'En Proceso' : 'Atendidos';
        this.toast.success(`Mensaje de ${m.name} movido a ${statusLabel}`);
        return { ...m, status: targetStatus };
      }
      return m;
    });

    this.messages.set(updatedMessages);
    this.draggedMessageId.set(null);
    this.dropTargetCol.set(null);
  }
}
