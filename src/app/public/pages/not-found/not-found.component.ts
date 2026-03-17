import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { I18nService } from '../../../shared/services/i18n.service';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="not-found-page">
      <div class="container">
        <div class="not-found-page__content">
          <div class="not-found-page__illustration" aria-hidden="true">
            <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="100" cy="100" r="80" fill="var(--neutral-50)" stroke="var(--neutral-200)" stroke-width="2"/>
              <text x="100" y="110" text-anchor="middle" font-size="48" font-weight="800" fill="var(--neutral-300)">404</text>
            </svg>
          </div>
          <h1 class="not-found-page__title">{{ i18n.currentLang() === 'es' ? 'Pagina no encontrada' : 'Page not found' }}</h1>
          <p class="not-found-page__desc">{{ i18n.currentLang() === 'es' ? 'La pagina que buscas no existe o ha sido movida.' : 'The page you are looking for does not exist or has been moved.' }}</p>
          <div class="not-found-page__actions">
            <a [routerLink]="i18n.getLangPrefix()" class="btn btn-primary btn-lg">{{ i18n.currentLang() === 'es' ? 'Volver al inicio' : 'Back to home' }}</a>
            <a [routerLink]="i18n.getLangPrefix() + '/' + (i18n.currentLang() === 'es' ? 'catalogo' : 'catalog')" class="btn btn-outline btn-lg">{{ i18n.currentLang() === 'es' ? 'Explorar catalogo' : 'Explore catalog' }}</a>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .not-found-page { min-height: 70vh; display: flex; align-items: center; justify-content: center; padding: 80px 0; }
    .not-found-page__content { text-align: center; max-width: 480px; margin: 0 auto; }
    .not-found-page__illustration { margin-bottom: 32px; }
    .not-found-page__title { font-size: 32px; font-weight: 700; color: var(--neutral-900); margin-bottom: 12px; }
    .not-found-page__desc { font-size: 16px; color: var(--neutral-500); margin-bottom: 32px; }
    .not-found-page__actions { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; }
  `]
})
export class NotFoundComponent {
  i18n = inject(I18nService);
}
