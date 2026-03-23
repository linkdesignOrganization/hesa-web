import { Component, inject, signal, AfterViewInit, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContactFormComponent } from '../../components/contact-form/contact-form.component';
import { ApiService, ApiBrand, ApiPageContent } from '../../../shared/services/api.service';
import { I18nService } from '../../../shared/services/i18n.service';
import { SeoService } from '../../../shared/services/seo.service';
import { getBrandsSegment } from '../../../shared/utils/route-helpers';
import { initFadeInObserver } from '../../../shared/utils/fade-in-observer';

@Component({
  selector: 'app-distributors',
  standalone: true,
  imports: [RouterLink, ContactFormComponent],
  templateUrl: './distributors.component.html',
  styleUrl: './distributors.component.scss'
})
export class DistributorsComponent implements OnInit, AfterViewInit, OnDestroy {
  private el = inject(ElementRef);
  private seo = inject(SeoService);
  private api = inject(ApiService);
  i18n = inject(I18nService);
  private fadeObserver: IntersectionObserver | null = null;
  private parallaxAnimationFrame: number | null = null;
  private parallaxCleanup: Array<() => void> = [];

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
        es: 'Inventario y logística',
        en: 'Inventory and logistics'
      },
      body: {
        es: 'Mantenemos stock local y despachamos a todo el país. Su producto siempre disponible para el cliente final.',
        en: 'We maintain local stock and dispatch nationwide, keeping your product consistently available to the end customer.'
      }
    }
  ];

  readonly operationalCards = {
    card1: {
      icon: 'local_shipping',
      title: {
        es: 'Operación propia',
        en: 'In-house operation'
      },
      subtitle: {
        es: 'Logística y distribución',
        en: 'Logistics and distribution'
      },
      body: {
        es: 'No subcontratamos. Nuestro equipo comercial visita clientes en todo el país con rutas programadas. Su marca llega directamente al punto de venta.',
        en: 'We do not outsource. Our commercial team visits clients nationwide on scheduled routes, so your brand reaches the point of sale directly.'
      },
      email: 'ventas@hesa.co.cr'
    },
    card2: {
      title: {
        es: 'Comunicación directa y constante',
        en: 'Direct and consistent communication'
      },
      body: {
        es: 'Reportes de ventas, retroalimentación del mercado y coordinación cercana. Trabajamos como una extensión de su equipo comercial.',
        en: 'Sales reporting, market feedback, and close coordination. We work as an extension of your commercial team.'
      },
      cta: {
        es: 'Contactar',
        en: 'Contact'
      }
    }
  } as const;

  async ngOnInit(): Promise<void> {
    // REQ-181: SEO meta tags for distributors page
    const lang = this.i18n.currentLang();
    this.seo.setMetaTags({
      title: lang === 'es' ? 'Distribuidores' : 'Become a Distributor',
      description: lang === 'es'
        ? 'HESA es su socio estratégico para la distribución de productos veterinarios en Costa Rica. 37+ años distribuyendo fármacos, alimentos y equipos veterinarios.'
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
      this.setupParallax();
    }, 300);
  }

  ngOnDestroy(): void {
    this.fadeObserver?.disconnect();
    this.parallaxCleanup.forEach(cleanup => cleanup());
    this.parallaxCleanup = [];
    if (this.parallaxAnimationFrame !== null) {
      window.cancelAnimationFrame(this.parallaxAnimationFrame);
      this.parallaxAnimationFrame = null;
    }
    this.seo.clearDynamicTags();
  }

  private setupParallax(): void {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const host = this.el.nativeElement as HTMLElement;
    const layers = Array.from(host.querySelectorAll('[data-parallax-layer]')) as HTMLElement[];
    if (!layers.length) return;

    const updateParallax = () => {
      this.parallaxAnimationFrame = null;
      const viewportHeight = window.innerHeight || 1;

      layers.forEach(layer => {
        const section = layer.closest<HTMLElement>('[data-parallax-section]');
        if (!section) return;

        const rect = section.getBoundingClientRect();
        const distanceFromCenter = rect.top + rect.height / 2 - viewportHeight / 2;
        const normalizedDistance = distanceFromCenter / viewportHeight;
        const speed = Number(layer.dataset['parallaxSpeed'] ?? '0.1');
        const offset = Math.max(Math.min(normalizedDistance * speed * -viewportHeight, 78), -78);

        layer.style.setProperty('--parallax-offset', `${offset.toFixed(2)}px`);
      });
    };

    const requestParallaxUpdate = () => {
      if (this.parallaxAnimationFrame !== null) return;
      this.parallaxAnimationFrame = window.requestAnimationFrame(updateParallax);
    };

    requestParallaxUpdate();
    window.addEventListener('scroll', requestParallaxUpdate, { passive: true });
    window.addEventListener('resize', requestParallaxUpdate);

    this.parallaxCleanup.push(() => window.removeEventListener('scroll', requestParallaxUpdate));
    this.parallaxCleanup.push(() => window.removeEventListener('resize', requestParallaxUpdate));
  }
}
