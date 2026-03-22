import { Component, inject, signal, AfterViewInit, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { TimelineComponent } from '../../components/timeline/timeline.component';
import { ContactFormComponent } from '../../components/contact-form/contact-form.component';
import { BrandLogosRowComponent } from '../../components/brand-logos-row/brand-logos-row.component';
import { ApiService, ApiPageContent } from '../../../shared/services/api.service';
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
  readonly defaultHeroImage = 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1600&q=80&auto=format&fit=crop';
  private el = inject(ElementRef);
  private seo = inject(SeoService);
  private api = inject(ApiService);
  i18n = inject(I18nService);
  private fadeObserver: IntersectionObserver | null = null;
  private timelineObserver: IntersectionObserver | null = null;

  content = signal<ApiPageContent | null>(null);

  benefits = [
    { icon: 'globe', title: { es: 'Cobertura Nacional', en: 'National Coverage' }, desc: { es: 'Red de distribucion propia en todo Costa Rica', en: 'Own distribution network throughout Costa Rica' } },
    { icon: 'truck', title: { es: 'Flotilla Propia', en: 'Own Fleet' }, desc: { es: '18-20 agentes de ventas con visitas quincenales', en: '18-20 sales agents with biweekly visits' } },
    { icon: 'shield', title: { es: 'Cadena de Frio', en: 'Cold Chain' }, desc: { es: 'Almacenamiento y transporte con control de temperatura', en: 'Storage and transport with temperature control' } },
    { icon: 'users', title: { es: 'Equipo Comercial', en: 'Commercial Team' }, desc: { es: '50+ colaboradores especializados en salud animal', en: '50+ collaborators specialized in animal health' } },
    { icon: 'award', title: { es: '37 Anos de Experiencia', en: '37 Years of Experience' }, desc: { es: 'Empresa familiar con trayectoria comprobada', en: 'Family business with a proven track record' } },
    { icon: 'trending-up', title: { es: 'Mercado en Crecimiento', en: 'Growing Market' }, desc: { es: 'Sector veterinario en expansion con alta demanda de productos de calidad', en: 'Expanding veterinary sector with high demand for quality products' } }
  ];

  async ngOnInit(): Promise<void> {
    // REQ-181: SEO meta tags for distributors page
    const lang = this.i18n.currentLang();
    this.seo.setMetaTags({
      title: lang === 'es' ? 'Distribuidores' : 'Become a Distributor',
      description: lang === 'es'
        ? 'HESA es su socio estrategico para la distribucion de productos veterinarios en Costa Rica. 37+ anos distribuyendo farmacos, alimentos y equipos veterinarios.'
        : 'Partner with HESA, a leading veterinary distributor in Costa Rica. 37+ years distributing pharmaceuticals, animal food, and veterinary equipment nationwide.',
      url: `/${lang}/${lang === 'es' ? 'distribuidores' : 'distributors'}`,
    });
    this.seo.setHreflang('/es/distribuidores', '/en/distributors');

    // Load page content from API
    try {
      const pageContent = await this.api.getPageContent('distribuidores');
      this.content.set(pageContent);
    } catch {
      // Silent fallback — use hardcoded defaults in template
    }
  }

  /**
   * BUG-007 FIX: Scroll to the contact form without using href="#",
   * which Angular's router can intercept and cause unwanted navigation.
   */
  scrollToContactForm(): void {
    const el = this.el.nativeElement.querySelector('#contact-form');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  /** Helper to get section value from loaded content */
  getSection(key: string): string {
    const section = this.content()?.sections?.find(s => s.key === key);
    if (!section) return '';
    return this.i18n.t(section.value) || '';
  }

  getHeroImage(): string {
    return this.content()?.heroImage || this.defaultHeroImage;
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
