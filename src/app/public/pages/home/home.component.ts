import { Component, inject, signal, computed, OnInit, AfterViewInit, OnDestroy, ElementRef, ViewChild, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CategoryBlockComponent } from '../../components/category-block/category-block.component';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { ValueStatComponent } from '../../components/value-stat/value-stat.component';
import { BrandLogosRowComponent } from '../../components/brand-logos-row/brand-logos-row.component';
import { ManufacturerCtaComponent } from '../../components/manufacturer-cta/manufacturer-cta.component';
import { ApiService, ApiProduct, ApiBrand, ApiHomePublic, ApiHeroSlide } from '../../../shared/services/api.service';
import { I18nService } from '../../../shared/services/i18n.service';
import { SeoService } from '../../../shared/services/seo.service';
import { initFadeInObserver } from '../../../shared/utils/fade-in-observer';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterLink,
    CategoryBlockComponent,
    ProductCardComponent,
    ValueStatComponent,
    BrandLogosRowComponent,
    ManufacturerCtaComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  private api = inject(ApiService);
  i18n = inject(I18nService);
  private seo = inject(SeoService);
  private el = inject(ElementRef);
  private fadeObserver: IntersectionObserver | null = null;
  private platformId = inject(PLATFORM_ID);

  // Video auto-cycle for feature card
  @ViewChild('featureVideo') featureVideoRef!: ElementRef<HTMLVideoElement>;
  private videoSources = [
    '0_Cat_Turkish_1080x1920.mp4',
    '0_Portrait_Face_2160x3840.mp4',
    '1517679_Hamster_Tiny_1080x1920.mp4',
  ];
  private currentVideoIndex = 0;

  featuredProducts = signal<ApiProduct[]>([]);
  featuredBrands = signal<ApiBrand[]>([]);
  heroLoading = signal(true);
  productsLoading = signal(true);
  brandsLoading = signal(true);
  heroError = signal(false);
  productsError = signal(false);
  brandsError = signal(false);

  hero = signal<{ mode: 'single' | 'carousel'; slides: ApiHeroSlide[] }>({
    mode: 'single' as const,
    slides: []
  });

  activeSlide = signal(0);

  heroMode = computed(() => this.hero().mode);

  currentSlideData = computed(() => {
    const slides = this.hero().slides;
    if (!slides || slides.length === 0) return null;
    const idx = this.activeSlide();
    return slides[idx] ?? slides[0];
  });

  stats = [
    { number: '37', suffix: '+', label: { es: 'Anos de experiencia en el sector veterinario', en: 'Years of experience in the veterinary sector' } },
    { number: '100', suffix: '%', label: { es: 'Cobertura nacional con agentes propios', en: 'National coverage with own agents' } },
    { number: '50', suffix: '+', label: { es: 'Colaboradores dedicados al sector veterinario', en: 'Collaborators dedicated to the veterinary sector' } },
    { number: '20', suffix: '+', label: { es: 'Marcas internacionales de primer nivel', en: 'Top international brands' } }
  ];

  currentSlide = signal(0);

  async ngOnInit(): Promise<void> {
    // NFR-006/NFR-008: Home page SEO
    const lang = this.i18n.currentLang();
    this.seo.setMetaTags({
      title: lang === 'es' ? 'Inicio' : 'Home',
      description: lang === 'es'
        ? 'HESA - Importacion y distribucion de farmacos veterinarios, alimentos para animales y equipos veterinarios en Costa Rica.'
        : 'HESA - Leading veterinary distributor in Costa Rica. Import and distribution of veterinary pharmaceuticals, animal food, and veterinary equipment. 37+ years of experience.',
      url: `/${lang}`,
    });
    this.seo.setHreflang('/es', '/en');
    this.seo.setOrganizationSchema();

    // Load all home data from API
    try {
      const homeData = await this.api.getHomeData();

      // Hero
      this.hero.set(homeData.hero);
      this.heroLoading.set(false);

      // Featured products
      this.featuredProducts.set(homeData.featuredProducts);
      this.productsLoading.set(false);

      // Featured brands
      this.featuredBrands.set(homeData.featuredBrands);
      this.brandsLoading.set(false);
    } catch {
      this.heroLoading.set(false);
      this.heroError.set(true);
      this.productsLoading.set(false);
      this.productsError.set(true);
      this.brandsLoading.set(false);
      this.brandsError.set(true);
    }
  }

  isExternalLink(link: string): boolean {
    return link?.startsWith('http://') || link?.startsWith('https://') || link?.startsWith('tel:') || link?.startsWith('mailto:');
  }

  // ---- Hero slide navigation ----

  nextHeroSlide(): void {
    const total = this.hero().slides.length;
    this.activeSlide.update(i => (i + 1) % total);
  }

  prevHeroSlide(): void {
    const total = this.hero().slides.length;
    this.activeSlide.update(i => (i - 1 + total) % total);
  }

  // ---- Featured products carousel ----

  private readonly PRODUCTS_PER_SLIDE = 6;

  nextSlide(): void {
    const maxSlides = Math.ceil(this.featuredProducts().length / this.PRODUCTS_PER_SLIDE);
    this.currentSlide.update(c => Math.min(c + 1, maxSlides - 1));
  }

  prevSlide(): void {
    this.currentSlide.update(c => Math.max(c - 1, 0));
  }

  get carouselDots(): number[] {
    const maxSlides = Math.ceil(this.featuredProducts().length / this.PRODUCTS_PER_SLIDE);
    return Array.from({ length: maxSlides }, (_, i) => i);
  }

  /** Type-guard: returns the product object only if it is a populated ApiProduct (not a string/null) */
  isProductObject(product: ApiProduct | string | null | undefined): product is ApiProduct {
    return !!product && typeof product === 'object' && 'name' in product;
  }

  ngAfterViewInit(): void {
    if (typeof window === 'undefined') return;
    setTimeout(() => {
      this.fadeObserver = initFadeInObserver(this.el);
      this.setupVideoCycle();
    }, 500);
  }

  private setupVideoCycle(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    // Wait for video element to be available
    setTimeout(() => {
      const video = this.featureVideoRef?.nativeElement;
      if (!video) return;
      video.addEventListener('ended', () => {
        this.currentVideoIndex = (this.currentVideoIndex + 1) % this.videoSources.length;
        video.src = this.videoSources[this.currentVideoIndex];
        video.play().catch(() => {});
      });
    }, 1000);
  }

  ngOnDestroy(): void {
    this.fadeObserver?.disconnect();
    this.seo.clearDynamicTags();
  }
}
