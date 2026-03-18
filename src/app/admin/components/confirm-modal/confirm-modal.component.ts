import { Component, input, signal, output, OnInit } from '@angular/core';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  templateUrl: './confirm-modal.component.html',
  styleUrl: './confirm-modal.component.scss'
})
export class ConfirmModalComponent implements OnInit {
  variant = input<'danger' | 'warning'>('danger');
  title = input<string>('Estas seguro?');
  description = input<string>('Esta accion no se puede deshacer.');
  message = input<string>(''); // Alias for description, used by messages component
  confirmLabel = input<string>('Eliminar');
  confirmText = input<string>(''); // Alias for confirmLabel
  cancelLabel = input<string>('Cancelar');
  isOpen = signal(false);

  confirmed = output<void>();
  cancelled = output<void>();

  ngOnInit(): void {
    // Auto-open when rendered (for conditional rendering pattern)
    this.isOpen.set(true);
  }

  /** Get the description text, preferring message over description */
  getDescription(): string {
    return this.message() || this.description();
  }

  /** Get the confirm button text, preferring confirmText over confirmLabel */
  getConfirmText(): string {
    return this.confirmText() || this.confirmLabel();
  }

  open(): void {
    this.isOpen.set(true);
  }

  close(): void {
    this.isOpen.set(false);
    this.cancelled.emit();
  }

  confirm(): void {
    this.isOpen.set(false);
    this.confirmed.emit();
  }
}
