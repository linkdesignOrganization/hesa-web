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
    { number: 1, title: { es: 'Contacto Inicial', en: 'Initial Contact' }, description: { es: 'Conozca nuestra propuesta y capacidades de distribucion', en: 'Learn about our proposal and distribution capabilities' } },
    { number: 2, title: { es: 'Evaluacion', en: 'Evaluation' }, description: { es: 'Analizamos su catalogo y definimos la estrategia', en: 'We analyze your catalog and define the strategy' } },
    { number: 3, title: { es: 'Acuerdo Comercial', en: 'Commercial Agreement' }, description: { es: 'Formalizamos los terminos de la distribucion', en: 'We formalize the distribution terms' } },
    { number: 4, title: { es: 'Distribucion Activa', en: 'Active Distribution' }, description: { es: 'Cobertura nacional con nuestra flotilla propia', en: 'National coverage with our own fleet' } }
  ];
}
