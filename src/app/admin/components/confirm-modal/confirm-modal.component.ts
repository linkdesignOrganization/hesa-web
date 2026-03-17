import { Component, input, signal } from '@angular/core';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  templateUrl: './confirm-modal.component.html',
  styleUrl: './confirm-modal.component.scss'
})
export class ConfirmModalComponent {
  variant = input<'danger' | 'warning'>('danger');
  isOpen = signal(false);
}
