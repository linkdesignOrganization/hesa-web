import { Component, signal, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LanguageSelectorComponent } from '../language-selector/language-selector.component';
import { I18nService } from '../../services/i18n.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink, LanguageSelectorComponent],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  i18n = inject(I18nService);
  currentYear = new Date().getFullYear();
  openSection = signal<string | null>(null);

  toggleSection(section: string): void {
    this.openSection.update(current =>
      current === section ? null : section
    );
  }
}
