import { Component, inject, signal, OnInit, AfterViewInit, OnDestroy, ElementRef, HostListener } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService, ApiBrand, ApiProduct } from '../../../shared/services/api.service';
import { I18nService } from '../../../shared/services/i18n.service';
import { SeoService } from '../../../shared/services/seo.service';
import { getBrandsSegment, getContactSegment } from '../../../shared/utils/route-helpers';
import { initFadeInObserver } from '../../../shared/utils/fade-in-observer';

type AboutHorizontalAccordionTabId = 'exclusive-brands' | 'inventory-available' | 'national-coverage';

interface AboutHorizontalAccordionItem {
  id: AboutHorizontalAccordionTabId;
  label: { es: string; en: string };
  color: string;
  title: { es: string; en: string };
  body: { es: string; en: string };
  mediaType: 'brands' | 'products' | 'image';
}

interface AboutBrandSlide {
  id: string;
  name: string;
  logo: string;
}

interface AboutProductSlide {
  id: string;
  name: { es: string; en: string };
  brandName: string;
  image: string;
}

interface AboutClosingAllianceSection {
  headlineLead: { es: string; en: string };
  headlineAccent: { es: string; en: string };
  imageDesktop: string;
  imageMobile: string;
  tags: readonly { es: string; en: string }[];
  card: {
    label: { es: string; en: string };
    ctaText: { es: string; en: string };
    title: { es: string; en: string };
    body: { es: string; en: string };
    statValue: string;
    statLabel: { es: string; en: string };
  };
}

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent implements OnInit, AfterViewInit, OnDestroy {
  private api = inject(ApiService);
  private seo = inject(SeoService);
  i18n = inject(I18nService);
  private el = inject(ElementRef);
  private fadeObserver: IntersectionObserver | null = null;
  private presenceParallaxFrame: number | null = null;
  private advantageBrandInterval: number | null = null;
  private advantageProductInterval: number | null = null;

  brands = signal<ApiBrand[]>([]);
  activeMobileMarqueeBrand = signal<string | null>(null);
  presenceParallaxOffset = signal(0);
  closingAllianceParallaxOffset = signal(0);
  activeAdvantageTab = signal<AboutHorizontalAccordionTabId>('exclusive-brands');
  advantageBrandSlides = signal<AboutBrandSlide[]>([]);
  advantageProductSlides = signal<AboutProductSlide[]>([]);
  advantageBrandIndex = signal(0);
  advantageProductIndex = signal(0);
  advantageBrandSlideToken = signal(0);
  advantageProductSlideToken = signal(0);
  readonly marqueeGroups = [0, 1] as const;
  readonly teamShowcaseMarqueeGroups = [0, 1, 2, 3] as const;
  readonly familyCompanyPrimaryLogo = { src: '/logo.svg', alt: 'HESA' } as const;
  readonly familyCompanySecondaryLogos = [
    { src: '/logozoofarma.svg', alt: 'ZooFarma' },
    { src: '/logosemilla.webp', alt: 'Semilla' },
    { src: '/logoimv.svg', alt: 'IMV' }
  ] as const;
  readonly familyCompaniesTitle = {
    es: 'Una red de confianza que comenzó en 1988 y sigue hoy',
    en: 'A trusted network that began in 1988 and continues today'
  } as const;
  readonly familyCompaniesCopy = {
    es: 'Lo que empezó como un negocio familiar hoy es un grupo de cuatro empresas respaldado por alianzas con los mejores fabricantes del sector. Juntos, atendemos a todo el mercado veterinario costarricense.',
    en: 'What started as a family business is now a four-company group backed by partnerships with the best manufacturers in the sector. Together, we serve the entire Costa Rican veterinary market.'
  } as const;
  readonly marketPresenceTags = {
    es: ['37 años', '18 agentes en ruta', '+500 clientes', 'Marcas exclusivas'],
    en: ['37 years', '18 field agents', '500+ clients', 'Exclusive brands']
  } as const;
  readonly marketPresenceTitle = {
    es: 'Presencia real en todo el país',
    en: 'Real presence across the country'
  } as const;
  readonly marketPresenceCopy = {
    es: 'No tercerizamos la relación comercial. Nuestros agentes visitan cada zona del país, conocen a sus clientes por nombre y entienden sus necesidades. Esa cercanía, combinada con alianzas sólidas con fabricantes internacionales, nos ha permitido crecer junto al sector veterinario costarricense durante más de tres décadas.',
    en: 'We do not outsource the commercial relationship. Our agents visit every region in the country, know their clients by name, and understand their needs. That closeness, combined with strong partnerships with international manufacturers, has allowed us to grow alongside Costa Rica’s veterinary sector for more than three decades.'
  } as const;
  readonly marketPresenceBadge = 'Herrera & Elizondo S.A.';
  readonly teamShowcaseEyebrow = {
    es: 'Nuestro equipo',
    en: 'Our team'
  } as const;
  readonly teamShowcaseTitle = {
    es: 'Conozca al equipo',
    en: 'Meet the team'
  } as const;
  readonly teamShowcaseImages = [
    { src: '/team/1.webp', alt: 'Equipo HESA 1', name: 'Adriana Herrera' },
    { src: '/team/2.webp', alt: 'Equipo HESA 2', name: 'Mauricio Elizondo' },
    { src: '/team/3.webp', alt: 'Equipo HESA 3', name: 'Daniela Chaves' },
    { src: '/team/4.webp', alt: 'Equipo HESA 4', name: 'Gabriel Mora' },
    { src: '/team/5.webp', alt: 'Equipo HESA 5', name: 'Valeria Solano' },
    { src: '/team/6.webp', alt: 'Equipo HESA 6', name: 'Fernando Quesada' },
    { src: '/team/7.webp', alt: 'Equipo HESA 7', name: 'Carolina Rojas' },
    { src: '/team/8.webp', alt: 'Equipo HESA 8', name: 'Esteban Vargas' },
    { src: '/team/9.webp', alt: 'Equipo HESA 9', name: 'Mariana Brenes' },
    { src: '/team/10.webp', alt: 'Equipo HESA 10', name: 'Sofía Araya' },
    { src: '/team/11.webp', alt: 'Equipo HESA 11', name: 'Andrés Villalobos' }
  ] as const;
  readonly aboutClosingAlliance: AboutClosingAllianceSection = {
    headlineLead: {
      es: 'Buscamos fabricantes que quieran crecer en Centroamérica',
      en: 'We are looking for manufacturers ready to grow across Central America'
    },
    headlineAccent: {
      es: 'con un socio que cumple',
      en: 'with a partner that delivers'
    },
    imageDesktop: '/closen.webp',
    imageMobile: '/closen.webp',
    tags: [
      { es: 'Representación exclusiva', en: 'Exclusive representation' },
      { es: 'Cobertura nacional', en: 'National coverage' },
      { es: 'Equipo propio', en: 'In-house team' },
      { es: 'Trayectoria', en: 'Track record' }
    ],
    card: {
      label: {
        es: 'Nuevas alianzas',
        en: 'New partnerships'
      },
      ctaText: {
        es: 'Contáctenos',
        en: 'Contact us'
      },
      title: {
        es: 'Abra la puerta al mercado costarricense',
        en: 'Open the door to the Costa Rican market'
      },
      body: {
        es: 'Más de tres décadas conectando fabricantes internacionales con veterinarias, agroservicios y comercios en todo el territorio.',
        en: 'More than three decades connecting international manufacturers with clinics, agri-stores, and retailers across the entire territory.'
      },
      statValue: '500+',
      statLabel: {
        es: 'puntos de venta atendidos',
        en: 'points of sale served'
      }
    }
  };
  readonly aboutAdvantageItems: readonly AboutHorizontalAccordionItem[] = [
    {
      id: 'exclusive-brands',
      label: {
        es: 'Marcas exclusivas',
        en: 'Exclusive brands'
      },
      color: '#008DC9',
      title: {
        es: 'Representamos marcas que no encuentra en otro lado',
        en: 'We represent brands you will not find anywhere else'
      },
      body: {
        es: 'Trabajamos con fabricantes internacionales que confían en nosotros como su único canal en Costa Rica. Eso significa disponibilidad garantizada, soporte técnico directo y condiciones comerciales que solo un representante exclusivo puede ofrecer.',
        en: 'We work with international manufacturers who trust us as their sole channel in Costa Rica. That means guaranteed availability, direct technical support, and commercial conditions that only an exclusive representative can offer.'
      },
      mediaType: 'brands'
    },
    {
      id: 'inventory-available',
      label: {
        es: 'Inventario disponible',
        en: 'Available inventory'
      },
      color: '#50B92A',
      title: {
        es: 'Producto en bodega, listo para despachar',
        en: 'Product in stock, ready to ship'
      },
      body: {
        es: 'No tiene que esperar semanas por una importación. Mantenemos inventario constante de las líneas que distribuimos para que su pedido salga cuando lo necesita. Esa es la ventaja de trabajar con un proveedor que planifica.',
        en: 'You do not have to wait weeks for an import. We keep steady inventory of the lines we distribute so your order ships when you need it. That is the advantage of working with a supplier that plans ahead.'
      },
      mediaType: 'products'
    },
    {
      id: 'national-coverage',
      label: {
        es: 'Cobertura nacional',
        en: 'Nationwide coverage'
      },
      color: '#1C9598',
      title: {
        es: 'Llegamos a donde está su negocio',
        en: 'We reach where your business is'
      },
      body: {
        es: 'Nuestros 18 agentes comerciales recorren el país con rutas programadas. No importa si está en el Valle Central o en la zona más alejada: su pedido llega sin intermediarios y con seguimiento directo.',
        en: 'Our 18 field agents travel the country on scheduled routes. Whether you are in the Central Valley or the most remote area, your order arrives without intermediaries and with direct follow-up.'
      },
      mediaType: 'image'
    }
  ] as const;

  async ngOnInit(): Promise<void> {
    const lang = this.i18n.currentLang();
    this.seo.setMetaTags({
      title: lang === 'es' ? 'Nosotros' : 'About Us',
      description: lang === 'es'
        ? 'HESA - Empresa familiar costarricense con más de 37 años de experiencia en la distribución de productos veterinarios.'
        : 'HESA - Costa Rican family business with over 37 years of experience in veterinary product distribution.',
      url: `/${lang}/${lang === 'es' ? 'nosotros' : 'about'}`,
    });
    this.seo.setHreflang('/es/nosotros', '/en/about');

    const [brandsResult, productsResult] = await Promise.allSettled([
      this.api.getBrands(),
      this.loadAllAdvantageProducts(),
    ]);

    if (brandsResult.status === 'fulfilled') {
      this.brands.set(brandsResult.value);
      this.advantageBrandSlides.set(this.toAdvantageBrandSlides(brandsResult.value));
    }

    if (productsResult.status === 'fulfilled') {
      this.advantageProductSlides.set(this.toAdvantageProductSlides(productsResult.value));
    }

    this.syncAdvantageAutoplay();
  }

  buildBrandRoute(slug: string): string {
    const lang = this.i18n.currentLang();
    return `/${lang}/${getBrandsSegment(lang)}/${slug}`;
  }

  getFamilyCompaniesTitle(): string {
    return this.i18n.currentLang() === 'es' ? this.familyCompaniesTitle.es : this.familyCompaniesTitle.en;
  }

  getFamilyCompaniesCopy(): string {
    return this.i18n.currentLang() === 'es' ? this.familyCompaniesCopy.es : this.familyCompaniesCopy.en;
  }

  getMarketPresenceTags(): readonly string[] {
    return this.i18n.currentLang() === 'es' ? this.marketPresenceTags.es : this.marketPresenceTags.en;
  }

  getMarketPresenceTitle(): string {
    return this.i18n.currentLang() === 'es' ? this.marketPresenceTitle.es : this.marketPresenceTitle.en;
  }

  getMarketPresenceCopy(): string {
    return this.i18n.currentLang() === 'es' ? this.marketPresenceCopy.es : this.marketPresenceCopy.en;
  }

  getTeamShowcaseEyebrow(): string {
    return this.i18n.currentLang() === 'es' ? this.teamShowcaseEyebrow.es : this.teamShowcaseEyebrow.en;
  }

  getTeamShowcaseTitle(): string {
    return this.i18n.currentLang() === 'es' ? this.teamShowcaseTitle.es : this.teamShowcaseTitle.en;
  }

  getAboutCatalogRoute(): string {
    return this.i18n.currentLang() === 'es' ? '/es/catalogo' : '/en/catalog';
  }

  getAboutContactRoute(): string {
    const lang = this.i18n.currentLang();
    return `/${lang}/${getContactSegment(lang)}`;
  }

  setActiveAdvantageTab(tabId: AboutHorizontalAccordionTabId): void {
    if (this.activeAdvantageTab() === tabId) return;
    this.activeAdvantageTab.set(tabId);

    if (tabId === 'exclusive-brands') {
      this.advantageBrandIndex.set(0);
      this.advantageBrandSlideToken.update(token => token + 1);
    }

    if (tabId === 'inventory-available') {
      this.advantageProductIndex.set(0);
      this.advantageProductSlideToken.update(token => token + 1);
    }

    this.syncAdvantageAutoplay();
  }

  currentAdvantageBrandSlide(): AboutBrandSlide | null {
    const slides = this.advantageBrandSlides();
    if (!slides.length) return null;
    return slides[this.advantageBrandIndex() % slides.length] ?? slides[0];
  }

  currentAdvantageProductSlide(): AboutProductSlide | null {
    const slides = this.advantageProductSlides();
    if (!slides.length) return null;
    return slides[this.advantageProductIndex() % slides.length] ?? slides[0];
  }

  onMarqueeBrandClick(event: MouseEvent, slug: string): void {
    if (!this.isTouchInteractionMode()) return;

    if (this.activeMobileMarqueeBrand() !== slug) {
      event.preventDefault();
      event.stopPropagation();
      this.activeMobileMarqueeBrand.set(slug);
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.activeMobileMarqueeBrand()) return;
    const target = event.target;
    if (!(target instanceof Node)) return;

    const marquee = this.el.nativeElement.querySelector('.about-brand-marquee');
    if (marquee?.contains(target)) return;

    this.activeMobileMarqueeBrand.set(null);
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.schedulePresenceParallaxUpdate();
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    this.schedulePresenceParallaxUpdate();
  }

  private isTouchInteractionMode(): boolean {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(hover: none), (pointer: coarse)').matches;
  }

  ngAfterViewInit(): void {
    if (typeof window === 'undefined') return;
    setTimeout(() => {
      this.fadeObserver = initFadeInObserver(this.el);
      this.schedulePresenceParallaxUpdate();
    }, 500);
  }

  ngOnDestroy(): void {
    this.fadeObserver?.disconnect();
    if (typeof window !== 'undefined' && this.presenceParallaxFrame !== null) {
      window.cancelAnimationFrame(this.presenceParallaxFrame);
    }
    this.clearAdvantageIntervals();
    this.seo.clearDynamicTags();
  }

  private schedulePresenceParallaxUpdate(): void {
    if (typeof window === 'undefined') return;
    if (this.presenceParallaxFrame !== null) return;

    this.presenceParallaxFrame = window.requestAnimationFrame(() => {
      this.presenceParallaxFrame = null;
      this.updatePresenceParallax();
    });
  }

  private updatePresenceParallax(): void {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.presenceParallaxOffset.set(0);
      this.closingAllianceParallaxOffset.set(0);
      return;
    }

    const mediaShell = this.el.nativeElement.querySelector('.about-market-presence__media-shell');
    const closingVisual = this.el.nativeElement.querySelector('.alliances-insight-section__visual');

    this.presenceParallaxOffset.set(
      this.calculateParallaxOffset(mediaShell, 42)
    );
    this.closingAllianceParallaxOffset.set(
      this.calculateParallaxOffset(closingVisual, 34)
    );
  }

  private calculateParallaxOffset(target: Element | null, intensity: number): number {
    if (!(target instanceof HTMLElement) || typeof window === 'undefined') {
      return 0;
    }

    const rect = target.getBoundingClientRect();
    const viewportCenter = window.innerHeight / 2;
    const elementCenter = rect.top + rect.height / 2;
    const normalizedDistance = Math.max(-1, Math.min(1, (elementCenter - viewportCenter) / window.innerHeight));

    return Math.round(normalizedDistance * -intensity);
  }

  private async loadAllAdvantageProducts(): Promise<ApiProduct[]> {
    const firstPage = await this.api.getProducts({ page: 1, limit: 100 });

    if (firstPage.totalPages <= 1) {
      return firstPage.data;
    }

    const remainingPages = await Promise.all(
      Array.from({ length: firstPage.totalPages - 1 }, (_, index) =>
        this.api.getProducts({ page: index + 2, limit: firstPage.limit })
      )
    );

    return [firstPage, ...remainingPages].flatMap(page => page.data);
  }

  private toAdvantageBrandSlides(brands: ApiBrand[]): AboutBrandSlide[] {
    const seen = new Set<string>();

    return brands
      .filter(brand => !!brand.logo)
      .filter(brand => {
        if (seen.has(brand.slug)) return false;
        seen.add(brand.slug);
        return true;
      })
      .map(brand => ({
        id: brand._id,
        name: brand.name,
        logo: brand.logo!,
      }));
  }

  private toAdvantageProductSlides(products: ApiProduct[]): AboutProductSlide[] {
    const filtered = products.filter(product => product.isActive && !!product.images?.[0]);
    return this.shuffle(filtered).map(product => ({
      id: product._id,
      name: product.name,
      brandName: product.brand?.name || '',
      image: product.images[0],
    }));
  }

  private syncAdvantageAutoplay(): void {
    this.clearAdvantageIntervals();

    if (typeof window === 'undefined') return;

    if (this.activeAdvantageTab() === 'exclusive-brands' && this.advantageBrandSlides().length > 1) {
      this.advantageBrandInterval = window.setInterval(() => {
        this.advantageBrandIndex.update(index => (index + 1) % this.advantageBrandSlides().length);
        this.advantageBrandSlideToken.update(token => token + 1);
      }, 2600);
    }

    if (this.activeAdvantageTab() === 'inventory-available' && this.advantageProductSlides().length > 1) {
      this.advantageProductInterval = window.setInterval(() => {
        this.advantageProductIndex.update(index => (index + 1) % this.advantageProductSlides().length);
        this.advantageProductSlideToken.update(token => token + 1);
      }, 2900);
    }
  }

  private clearAdvantageIntervals(): void {
    if (typeof window === 'undefined') return;

    if (this.advantageBrandInterval !== null) {
      window.clearInterval(this.advantageBrandInterval);
      this.advantageBrandInterval = null;
    }

    if (this.advantageProductInterval !== null) {
      window.clearInterval(this.advantageProductInterval);
      this.advantageProductInterval = null;
    }
  }

  private shuffle<T>(items: T[]): T[] {
    const next = [...items];
    for (let index = next.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
    }
    return next;
  }
}
