import { Component, inject, AfterViewInit, OnDestroy, ElementRef } from '@angular/core';
import { TimelineComponent } from '../../components/timeline/timeline.component';
import { ContactFormComponent } from '../../components/contact-form/contact-form.component';
import { BrandLogosRowComponent } from '../../components/brand-logos-row/brand-logos-row.component';
import { initFadeInObserver } from '../../../shared/utils/fade-in-observer';

@Component({
  selector: 'app-distributors',
  standalone: true,
  imports: [TimelineComponent, ContactFormComponent, BrandLogosRowComponent],
  templateUrl: './distributors.component.html',
  styleUrl: './distributors.component.scss'
})
export class DistributorsComponent implements AfterViewInit, OnDestroy {
  private el = inject(ElementRef);
  private fadeObserver: IntersectionObserver | null = null;
  private timelineObserver: IntersectionObserver | null = null;

  benefits = [
    { icon: 'globe', title: 'Cobertura Nacional', desc: 'Red de distribucion propia en todo Costa Rica' },
    { icon: 'truck', title: 'Flotilla Propia', desc: '18-20 agentes de ventas con visitas quincenales' },
    { icon: 'shield', title: 'Cadena de Frio', desc: 'Almacenamiento y transporte con control de temperatura' },
    { icon: 'users', title: 'Equipo Comercial', desc: '50+ colaboradores especializados en salud animal' },
    { icon: 'award', title: '37 Anos de Experiencia', desc: 'Empresa familiar con trayectoria comprobada' },
    { icon: 'trending-up', title: 'Mercado en Crecimiento', desc: 'Costa Rica, puerta de entrada a Centroamerica' }
  ];

  ngAfterViewInit(): void {
    if (typeof window === 'undefined') return;
    setTimeout(() => {
      this.fadeObserver = initFadeInObserver(this.el);
      this.initTimelineObserver();
    }, 300);
  }

  ngOnDestroy(): void {
    this.fadeObserver?.disconnect();
    this.timelineObserver?.disconnect();
  }

  private initTimelineObserver(): void {
    const timeline = this.el.nativeElement.querySelector('.timeline--pre-animation');
    if (!timeline) return;

    this.timelineObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          timeline.classList.add('timeline--animated');
          this.timelineObserver?.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    this.timelineObserver.observe(timeline);
  }
}
