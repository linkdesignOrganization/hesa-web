import { Component, inject } from '@angular/core';
import { I18nService } from '../../../shared/services/i18n.service';

@Component({
  selector: 'app-timeline',
  standalone: true,
  templateUrl: './timeline.component.html',
  styleUrl: './timeline.component.scss'
})
export class TimelineComponent {
  i18n = inject(I18nService);

  steps = [
    { number: 1, title: { es: 'Contacto inicial', en: 'Initial Contact' }, description: { es: 'Conozca nuestra propuesta y capacidades de distribución', en: 'Learn about our proposal and distribution capabilities' } },
    { number: 2, title: { es: 'Evaluación', en: 'Evaluation' }, description: { es: 'Analizamos su catálogo y definimos la estrategia', en: 'We analyze your catalog and define the strategy' } },
    { number: 3, title: { es: 'Acuerdo comercial', en: 'Commercial Agreement' }, description: { es: 'Formalizamos los términos de la distribución', en: 'We formalize the distribution terms' } },
    { number: 4, title: { es: 'Distribucion Activa', en: 'Active Distribution' }, description: { es: 'Cobertura nacional con nuestra flotilla propia', en: 'National coverage with our own fleet' } }
  ];
}
