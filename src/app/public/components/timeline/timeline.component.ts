import { Component } from '@angular/core';

@Component({
  selector: 'app-timeline',
  standalone: true,
  templateUrl: './timeline.component.html',
  styleUrl: './timeline.component.scss'
})
export class TimelineComponent {
  steps = [
    { number: 1, title: 'Contacto Inicial', description: 'Conozca nuestra propuesta y capacidades de distribucion' },
    { number: 2, title: 'Evaluacion', description: 'Analizamos su catalogo y definimos la estrategia' },
    { number: 3, title: 'Acuerdo Comercial', description: 'Formalizamos los terminos de la distribucion' },
    { number: 4, title: 'Distribucion Activa', description: 'Cobertura nacional con nuestra flotilla propia' }
  ];
}
