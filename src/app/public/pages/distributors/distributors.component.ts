import { Component, inject, signal, AfterViewInit, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TimelineComponent } from '../../components/timeline/timeline.component';
import { ContactFormComponent } from '../../components/contact-form/contact-form.component';
import { ApiService, ApiBrand, ApiPageContent } from '../../../shared/services/api.service';
import { I18nService } from '../../../shared/services/i18n.service';
import { SeoService } from '../../../shared/services/seo.service';
import { getBrandsSegment } from '../../../shared/utils/route-helpers';
import { initFadeInObserver } from '../../../shared/utils/fade-in-observer';

@Component({
  selector: 'app-distributors',
  standalone: true,
  imports: [RouterLink, TimelineComponent, ContactFormComponent],
  templateUrl: './distributors.component.html',
  styleUrl: './distributors.component.scss'
})
export class DistributorsComponent implements OnInit, AfterViewInit, OnDestroy {
  private el = inject(ElementRef);
  private seo = inject(SeoService);
  private api = inject(ApiService);
  i18n = inject(I18nService);
  private fadeObserver: IntersectionObserver | null = null;
  private timelineObserver: IntersectionObserver | null = null;

  content = signal<ApiPageContent | null>(null);
  brands = signal<ApiBrand[]>([]);
  readonly marqueeGroups = [0, 1] as const;

  readonly headerCards = [
    {
      icon: 'public',
      title: {
        es: 'Alcance regional',
        en: 'Regional reach'
      },
      body: {
        es: 'Presencia en Costa Rica con planes de expansion a Centroamerica. Su marca entra a un mercado en crecimiento.',
        en: 'Presence in Costa Rica with expansion plans into Central America. Your brand enters a growing market.'
      }
    },
    {
      icon: 'storefront',
      title: {
        es: 'Red comercial activa',
        en: 'Active commercial network'
      },
      body: {
        es: 'Mas de 500 veterinarias, agroservicios y comercios atendidos por nuestro equipo de ventas propio.',
        en: 'More than 500 veterinary clinics, agro-services, and retail accounts served by our in-house sales team.'
      }
    },
    {
      icon: 'handshake',
      title: {
        es: 'Representacion exclusiva',
        en: 'Exclusive representation'
      },
      body: {
        es: 'Trabajamos con marcas que distribuimos de forma exclusiva. Eso significa foco, compromiso y resultados.',
        en: 'We work with brands we distribute exclusively. That means focus, commitment, and measurable results.'
      }
    },
    {
      icon: 'inventory_2',
      title: {
        es: 'Inventario y logistica',
        en: 'Inventory and logistics'
      },
      body: {
        es: 'Mantenemos stock local y despachamos a todo el pais. Su producto siempre disponible para el cliente final.',
        en: 'We maintain local stock and dispatch nationwide, keeping your product consistently available to the end customer.'
      }
    }
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

    const [pageContentResult, brandsResult] = await Promise.allSettled([
      this.api.getPageContent('distribuidores'),
      this.api.getBrands()
    ]);

    if (pageContentResult.status === 'fulfilled') {
      this.content.set(pageContentResult.value);
    }

    if (brandsResult.status === 'fulfilled') {
      this.brands.set(brandsResult.value.filter(brand => !!brand.logo));
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

  buildBrandRoute(slug: string): string {
    return this.i18n.getLangPrefix() + '/' + getBrandsSegment(this.i18n.currentLang()) + '/' + slug;
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
