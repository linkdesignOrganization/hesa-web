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
          <span class="not-found-page__code">404</span>
          <h1 class="not-found-page__title">{{ i18n.currentLang() === 'es' ? 'Página no encontrada' : 'Page not found' }}</h1>
          <p class="not-found-page__desc">{{ i18n.currentLang() === 'es' ? 'La página que buscas no existe o ha sido movida.' : 'The page you are looking for does not exist or has been moved.' }}</p>
          <div class="not-found-page__actions">
            <a [routerLink]="i18n.getLangPrefix()" class="btn btn-primary btn-lg">{{ i18n.currentLang() === 'es' ? 'Volver al inicio' : 'Back to home' }}</a>
            <a [routerLink]="i18n.getLangPrefix() + '/' + (i18n.currentLang() === 'es' ? 'catalogo' : 'catalog')" class="btn btn-outline btn-lg">{{ i18n.currentLang() === 'es' ? 'Explorar catálogo' : 'Explore catalog' }}</a>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .not-found-page {
      min-height: 80vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: var(--section-gap-mobile) 0;
    }
    .not-found-page__content {
      text-align: center;
      max-width: 520px;
      margin: 0 auto;
    }
    .not-found-page__code {
      display: block;
      font-size: clamp(80px, 15vw, 160px);
      font-weight: var(--weight-extrabold);
      letter-spacing: var(--tracking-tighter);
      line-height: 1;
      color: var(--neutral-200);
      margin-bottom: var(--space-6);
    }
    .not-found-page__title {
      font-size: clamp(24px, 3vw, var(--text-h3));
      font-weight: var(--weight-bold);
      color: var(--neutral-900);
      margin-bottom: var(--space-3);
      letter-spacing: var(--tracking-tight);
    }
    .not-found-page__desc {
      font-size: var(--text-body-lg);
      color: var(--neutral-400);
      margin-bottom: var(--space-10);
      line-height: var(--leading-relaxed);
    }
    .not-found-page__actions {
      display: flex;
      gap: var(--space-4);
      justify-content: center;
      flex-wrap: wrap;
    }
    @media (max-width: 767px) {
      .not-found-page {
        min-height: 72vh;
        padding: 40px 0;
      }
      .not-found-page__content {
        max-width: 100%;
      }
      .not-found-page__desc {
        font-size: 14px;
        margin-bottom: 24px;
      }
      .not-found-page__actions {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 10px;
      }
      .not-found-page__actions .btn {
        width: 100%;
        min-height: 44px;
        padding: 0 12px;
        font-size: 13px;
      }
    }
  `]
})
export class NotFoundComponent {
  i18n = inject(I18nService);
}
