import { Component, inject } from '@angular/core';
import { MockDataService } from '../../../shared/services/mock-data.service';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
  selector: 'app-admin-home-hero',
  standalone: true,
  template: `
    <div class="hero-editor">
      <h1 style="font-size: 24px; font-weight: 700; margin-bottom: 24px;">Editor del Hero</h1>
      <div class="hero-editor__layout">
        <div class="hero-editor__preview">
          <div class="hero-editor__preview-placeholder">
            <p style="color: var(--neutral-400);">Preview del hero</p>
            <button class="btn btn-outline btn-sm" style="margin-top: 12px;">Cambiar imagen</button>
          </div>
        </div>
        <div class="hero-editor__form">
          <div class="tabs-pill" style="margin-bottom: 16px;"><button class="tabs-pill__btn tabs-pill__btn--active">Espanol</button><button class="tabs-pill__btn">English</button></div>
          <div class="form-group"><label class="form-label">Tag superior</label><input type="text" class="form-control" [value]="hero.tag.es"></div>
          <div class="form-group"><label class="form-label">Headline</label><textarea class="form-control" rows="2">{{ hero.headline.es }}</textarea></div>
          <div class="form-group"><label class="form-label">Subtitulo</label><textarea class="form-control" rows="2">{{ hero.subtitle.es }}</textarea></div>
          <div class="form-group"><label class="form-label">CTA Primario</label><input type="text" class="form-control" [value]="hero.ctaPrimary.es"></div>
          <div class="form-group"><label class="form-label">CTA Secundario</label><input type="text" class="form-control" [value]="hero.ctaSecondary.es"></div>
          <button class="btn btn-primary" (click)="save()">Guardar cambios</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .hero-editor__layout { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; }
    .hero-editor__preview-placeholder { aspect-ratio: 16/9; background: var(--neutral-100); border-radius: 12px; display: flex; flex-direction: column; align-items: center; justify-content: center; }
    .form-group { margin-bottom: 16px; }
    @media (max-width: 768px) { .hero-editor__layout { grid-template-columns: 1fr; } }
  `]
})
export class AdminHomeHeroComponent {
  private mockData = inject(MockDataService);
  private toastService = inject(ToastService);
  hero = this.mockData.getHero();

  save(): void {
    this.toastService.success('Hero actualizado correctamente');
  }
}
