import { Component, inject, AfterViewInit, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { TimelineComponent } from '../../components/timeline/timeline.component';
import { ContactFormComponent } from '../../components/contact-form/contact-form.component';
import { BrandLogosRowComponent } from '../../components/brand-logos-row/brand-logos-row.component';
import { I18nService } from '../../../shared/services/i18n.service';
import { SeoService } from '../../../shared/services/seo.service';
import { initFadeInObserver } from '../../../shared/utils/fade-in-observer';

@Component({
  selector: 'app-distributors',
  standalone: true,
  imports: [TimelineComponent, ContactFormComponent, BrandLogosRowComponent],
  templateUrl: './distributors.component.html',
  styleUrl: './distributors.component.scss'
})
export class DistributorsComponent implements OnInit, AfterViewInit, OnDestroy {
  private el = inject(ElementRef);
  private seo = inject(SeoService);
  i18n = inject(I18nService);
  private fadeObserver: IntersectionObserver | null = null;
  private timelineObserver: IntersectionObserver | null = null;

  benefits = [
    { icon: 'globe', title: { es: 'Cobertura Nacional', en: 'National Coverage' }, desc: { es: 'Red de distribucion propia en todo Costa Rica', en: 'Own distribution network throughout Costa Rica' } },
    { icon: 'truck', title: { es: 'Flotilla Propia', en: 'Own Fleet' }, desc: { es: '18-20 agentes de ventas con visitas quincenales', en: '18-20 sales agents with biweekly visits' } },
    { icon: 'shield', title: { es: 'Cadena de Frio', en: 'Cold Chain' }, desc: { es: 'Almacenamiento y transporte con control de temperatura', en: 'Storage and transport with temperature control' } },
    { icon: 'users', title: { es: 'Equipo Comercial', en: 'Commercial Team' }, desc: { es: '50+ colaboradores especializados en salud animal', en: '50+ collaborators specialized in animal health' } },
    { icon: 'award', title: { es: '37 Anos de Experiencia', en: '37 Years of Experience' }, desc: { es: 'Empresa familiar con trayectoria comprobada', en: 'Family business with a proven track record' } },
    { icon: 'trending-up', title: { es: 'Mercado en Crecimiento', en: 'Growing Market' }, desc: { es: 'Costa Rica, puerta de entrada a Centroamerica', en: 'Costa Rica, gateway to Central America' } }
  ];

  ngOnInit(): void {
    // REQ-181: SEO meta tags for distributors page
    const lang = this.i18n.currentLang();
    this.seo.setMetaTags({
      title: lang === 'es' ? 'Distribuidores' : 'Distributors',
      description: lang === 'es'
        ? 'HESA es su socio estrategico para la distribucion de productos veterinarios en Costa Rica y Centroamerica.'
        : 'HESA is your strategic partner for the distribution of veterinary products in Costa Rica and Central America.',
      url: `/${lang}/${lang === 'es' ? 'distribuidores' : 'distributors'}`,
    });
    this.seo.setHreflang('/es/distribuidores', '/en/distributors');
  }

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
    this.seo.clearDynamicTags();
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
