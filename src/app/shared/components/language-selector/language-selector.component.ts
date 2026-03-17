import { Component, input, signal, inject } from '@angular/core';
import { I18nService } from '../../services/i18n.service';

@Component({
  selector: 'app-language-selector',
  standalone: true,
  templateUrl: './language-selector.component.html',
  styleUrl: './language-selector.component.scss'
})
export class LanguageSelectorComponent {
  variant = input<'header' | 'footer'>('header');
  isOpen = signal(false);
  i18n = inject(I18nService);

  toggleDropdown(): void {
    this.isOpen.update(v => !v);
  }

  selectLanguage(lang: 'es' | 'en'): void {
    this.i18n.switchLanguage(lang);
    this.isOpen.set(false);
  }
}
