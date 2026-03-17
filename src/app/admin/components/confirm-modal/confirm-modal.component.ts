import { Component, input, signal, output } from '@angular/core';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  templateUrl: './confirm-modal.component.html',
  styleUrl: './confirm-modal.component.scss'
})
export class ConfirmModalComponent {
  variant = input<'danger' | 'warning'>('danger');
  title = input<string>('Estas seguro?');
  description = input<string>('Esta accion no se puede deshacer.');
  confirmLabel = input<string>('Eliminar');
  cancelLabel = input<string>('Cancelar');
  isOpen = signal(false);

  confirmed = output<void>();
  cancelled = output<void>();

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
