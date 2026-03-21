import { Component, inject, signal, computed, OnInit, AfterViewInit, OnDestroy, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService, ApiProduct, ApiHeroSlide } from '../../../shared/services/api.service';
import { I18nService } from '../../../shared/services/i18n.service';
import { SeoService } from '../../../shared/services/seo.service';
import { initFadeInObserver } from '../../../shared/utils/fade-in-observer';

interface LocalizedText {
  es: string;
  en: string;
}

type FeaturedShowcaseCategoryId = 'farmacos' | 'alimentos' | 'equipos';

interface FeaturedShowcaseItem {
  name: LocalizedText;
  brand: string;
  category: FeaturedShowcaseCategoryId;
  image: string;
  brandLogo?: string;
  href: LocalizedText;
  species?: LocalizedText;
  family?: LocalizedText;
  lifeStage?: LocalizedText;
  equipmentType?: LocalizedText;
  presentations?: LocalizedText[];
}

interface FeaturedShowcaseTab {
  id: FeaturedShowcaseCategoryId;
  label: LocalizedText;
  icon: string;
  link: LocalizedText;
  description: LocalizedText;
  items: FeaturedShowcaseItem[];
}

interface FeaturedShowcaseBrandLogo {
  name: string;
  src: string;
}

interface AlliancesInsightCard {
  label: LocalizedText;
  ctaText: LocalizedText;
  ctaLink: LocalizedText;
  title: LocalizedText;
  body: LocalizedText;
  statValue: string;
  statLabel: LocalizedText;
}

interface AlliancesInsightSection {
  headlineLead: LocalizedText;
  headlineAccent: LocalizedText;
  imageDesktop: string;
  imageMobile: string;
  tags: LocalizedText[];
  card: AlliancesInsightCard;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly FEATURE_VIDEO_FADE_MS = 700;
  private readonly FEATURE_VIDEO_SWITCH_THRESHOLD_SECONDS = 0.55;
  private readonly SHOWCASE_TAB_FADE_MS = 180;
  private readonly featureVideoSources = [
    '/cat.mp4',
    '/dog.mp4',
    '/horse.mp4',
    '/cow.mov'
  ];

  private api = inject(ApiService);
  i18n = inject(I18nService);
  private seo = inject(SeoService);
  private el = inject(ElementRef);
  private fadeObserver: IntersectionObserver | null = null;
  private featureVideoListeners: Array<() => void> = [];
  private featureVideoTransitioning = false;
  private currentFeatureVideoIndex = 0;
  private nextFeatureVideoIndex = 1;
  private featureVideoFadeTimeout: ReturnType<typeof setTimeout> | null = null;
  private showcaseTransitionTimeout: ReturnType<typeof setTimeout> | null = null;
  private parallaxCleanup: Array<() => void> = [];
  private parallaxAnimationFrame: number | null = null;

  @ViewChildren('featureVideoLayer') featureVideoRefs?: QueryList<ElementRef<HTMLVideoElement>>;
  @ViewChildren('parallaxLayer') parallaxLayerRefs?: QueryList<ElementRef<HTMLElement>>;

  heroLoading = signal(true);
  heroError = signal(false);

  hero = signal<{ mode: 'single' | 'carousel'; slides: ApiHeroSlide[] }>({
    mode: 'single' as const,
    slides: []
  });

  activeSlide = signal(0);

  heroMode = computed(() => this.hero().mode);
  activeFeatureVideoLayer = signal<0 | 1>(0);

  private readonly showcaseCategoryLabels: Record<FeaturedShowcaseCategoryId, LocalizedText> = {
    farmacos: { es: 'Farmacos', en: 'Pharmaceuticals' },
    alimentos: { es: 'Alimentos', en: 'Food' },
    equipos: { es: 'Equipos', en: 'Equipment' }
  };

  private readonly showcaseCategoryLinks: Record<FeaturedShowcaseCategoryId, LocalizedText> = {
    farmacos: { es: '/es/catalogo/farmacos', en: '/en/catalog/pharmaceuticals' },
    alimentos: { es: '/es/catalogo/alimentos', en: '/en/catalog/food' },
    equipos: { es: '/es/catalogo/equipos', en: '/en/catalog/equipment' }
  };

  readonly featuredShowcaseBrandLogos: FeaturedShowcaseBrandLogo[] = [
    { name: 'Orion Pharma', src: '/brands/orion-pharma/logo.svg' },
    { name: 'Trisal', src: '/brands/trisal/logo.png' },
    { name: 'Kruuse', src: '/brands/kruuse/logo.svg' },
    { name: 'Europlex', src: '/brands/europlex/logo.png' },
    { name: 'Biozoo', src: '/brands/biozoo/logo.svg' },
    { name: 'Mitzi', src: '/brands/mitzi/mitzi-logo.webp' },
    { name: 'Unimedical', src: '/brands/unimedical/logo.png' }
  ];

  readonly showcaseMarqueeGroups = [0, 1] as const;

  readonly featuredShowcaseTabs: FeaturedShowcaseTab[] = [
    {
      id: 'farmacos',
      label: this.showcaseCategoryLabels.farmacos,
      icon: 'pill',
      link: this.showcaseCategoryLinks.farmacos,
      description: {
        es: 'Productos que nuestros clientes prefieren por su calidad, disponibilidad y resultados consistentes.',
        en: 'Products our clients prefer for their quality, availability, and consistent results.'
      },
      items: [
        {
          name: { es: 'Clamovet 250 mg Caja x40 Tabletas', en: 'Clamovet 250 mg 40-Tablet Box' },
          brand: 'Orion Pharma',
          category: 'farmacos',
          image: '/Clamovet 250 mg Caja x40 Tabletas.jpg',
          brandLogo: '/brands/orion-pharma/logo.svg',
          href: this.showcaseCategoryLinks.farmacos,
          species: { es: 'Perros y gatos', en: 'Dogs and cats' },
          family: { es: 'Antibiotico', en: 'Antibiotic' },
          lifeStage: { es: 'Uso clinico', en: 'Clinical use' },
          presentations: [{ es: 'Caja x40 tabletas', en: '40-tablet box' }]
        },
        {
          name: { es: 'Toltravet Plus Caja x32 Tab', en: 'Toltravet Plus 32-Tablet Box' },
          brand: 'Trisal',
          category: 'farmacos',
          image: '/Toltravet Plus Caja x32 Tab Antiparasitario Interno.jpg',
          brandLogo: '/brands/trisal/logo.png',
          href: this.showcaseCategoryLinks.farmacos,
          species: { es: 'Perros y gatos', en: 'Dogs and cats' },
          family: { es: 'Antiparasitario', en: 'Antiparasitic' },
          lifeStage: { es: 'Control rutinario', en: 'Routine control' },
          presentations: [{ es: 'Caja x32 tabletas', en: '32-tablet box' }]
        },
        {
          name: { es: 'Tobramax 5 ml', en: 'Tobramax 5 ml' },
          brand: 'Unimedical',
          category: 'farmacos',
          image: '/Tobramax 5ml.jpg',
          brandLogo: '/brands/unimedical/logo.png',
          href: this.showcaseCategoryLinks.farmacos,
          species: { es: 'Perros y gatos', en: 'Dogs and cats' },
          family: { es: 'Oftalmologico', en: 'Ophthalmic' },
          lifeStage: { es: 'Consulta diaria', en: 'Daily consult' },
          presentations: [{ es: 'Frasco 5 ml', en: '5 ml bottle' }]
        }
      ]
    },
    {
      id: 'alimentos',
      label: this.showcaseCategoryLabels.alimentos,
      icon: 'pets',
      link: this.showcaseCategoryLinks.alimentos,
      description: {
        es: 'Productos que nuestros clientes prefieren por su calidad, disponibilidad y resultados consistentes.',
        en: 'Products our clients prefer for their quality, availability, and consistent results.'
      },
      items: [
        {
          name: { es: 'SUSTILE Leche Maternizada para Cachorros 400 gr', en: 'SUSTILE Puppy Milk Replacer 400 g' },
          brand: 'New Born',
          category: 'alimentos',
          image: '/SUSTILE Leche Maternizada para Cachorros 400 gr.jpg',
          brandLogo: '/brands/new-born/logo.png',
          href: this.showcaseCategoryLinks.alimentos,
          species: { es: 'Caninos', en: 'Dogs' },
          family: { es: 'Nutricion inicial', en: 'Starter nutrition' },
          lifeStage: { es: 'Cachorros', en: 'Puppies' },
          presentations: [{ es: 'Bolsa 400 gr', en: '400 g bag' }]
        },
        {
          name: { es: 'Felovite II con Taurina 2.5 oz', en: 'Felovite II with Taurine 2.5 oz' },
          brand: 'Mitzi',
          category: 'alimentos',
          image: '/Felovite II con Taurina 2.5 oz Suplemento para gatos.jpg',
          brandLogo: '/brands/mitzi/mitzi-logo.webp',
          href: this.showcaseCategoryLinks.alimentos,
          species: { es: 'Felinos', en: 'Cats' },
          family: { es: 'Suplemento diario', en: 'Daily supplement' },
          lifeStage: { es: 'Mantenimiento', en: 'Maintenance' },
          presentations: [{ es: 'Tubo 2.5 oz', en: '2.5 oz tube' }]
        },
        {
          name: { es: 'Apeticat Jarabe 100 ml', en: 'Apeticat Syrup 100 ml' },
          brand: 'Biozoo',
          category: 'alimentos',
          image: '/Apeticat Jarabe 100 ml.jpg',
          brandLogo: '/brands/biozoo/logo.svg',
          href: this.showcaseCategoryLinks.alimentos,
          species: { es: 'Gatos', en: 'Cats' },
          family: { es: 'Soporte nutricional', en: 'Nutritional support' },
          lifeStage: { es: 'Apoyo diario', en: 'Daily support' },
          presentations: [{ es: 'Frasco 100 ml', en: '100 ml bottle' }]
        }
      ]
    },
    {
      id: 'equipos',
      label: this.showcaseCategoryLabels.equipos,
      icon: 'biotech',
      link: this.showcaseCategoryLinks.equipos,
      description: {
        es: 'Productos que nuestros clientes prefieren por su calidad, disponibilidad y resultados consistentes.',
        en: 'Products our clients prefer for their quality, availability, and consistent results.'
      },
      items: [
        {
          name: { es: 'Meloxivet 4 mg Blister x10 tabletas', en: 'Meloxivet 4 mg 10-Tablet Blister' },
          brand: 'Kruuse',
          category: 'equipos',
          image: '/Meloxivet 4 mg Blister x10 tabletas.jpg',
          brandLogo: '/brands/kruuse/logo.svg',
          href: this.showcaseCategoryLinks.equipos,
          species: { es: 'Perros y gatos', en: 'Dogs and cats' },
          equipmentType: { es: 'Procedimientos', en: 'Procedures' },
          presentations: [{ es: 'Blister x10', en: '10-tablet blister' }]
        },
        {
          name: { es: 'Ciprovet 5 ml Colirio', en: 'Ciprovet 5 ml Eye Drops' },
          brand: 'Europlex',
          category: 'equipos',
          image: '/Ciprovet 5 ml Colirio Cicatrizante y Antibacteriano.jpg',
          brandLogo: '/brands/europlex/logo.png',
          href: this.showcaseCategoryLinks.equipos,
          species: { es: 'Perros y gatos', en: 'Dogs and cats' },
          equipmentType: { es: 'Diagnostico', en: 'Diagnostics' },
          presentations: [{ es: 'Frasco 5 ml', en: '5 ml bottle' }]
        },
        {
          name: { es: 'Bactrina Blister x8', en: 'Bactrina 8-Tablet Blister' },
          brand: 'Unimedical',
          category: 'equipos',
          image: '/Bactrina Blister x8.jpg',
          brandLogo: '/brands/unimedical/logo.png',
          href: this.showcaseCategoryLinks.equipos,
          species: { es: 'Perros y gatos', en: 'Dogs and cats' },
          equipmentType: { es: 'Consulta clinica', en: 'Clinical consult' },
          presentations: [{ es: 'Blister x8', en: '8-tablet blister' }]
        }
      ]
    }
  ];

  readonly alliancesInsight: AlliancesInsightSection = {
    headlineLead: {
      es: 'Representamos marcas que confían en nosotros y atendemos',
      en: 'We represent brands that trust us and support'
    },
    headlineAccent: {
      es: 'clientes que cuentan con nosotros',
      en: 'clients who count on us'
    },
    imageDesktop: '/ds.jpg',
    imageMobile: '/ms.jpg',
    tags: [
      { es: 'Cobertura nacional', en: 'National coverage' },
      { es: '37 años', en: '37 years' },
      { es: 'Exclusividad', en: 'Exclusivity' },
      { es: 'Soporte técnico', en: 'Technical support' },
      { es: 'Confianza', en: 'Trust' }
    ],
    card: {
      label: { es: 'Alianzas', en: 'Alliances' },
      ctaText: { es: 'Conozca más', en: 'Learn more' },
      ctaLink: { es: '/es/distribuidores', en: '/en/distributors' },
      title: { es: 'Un socio que cumple', en: 'A partner that delivers' },
      body: {
        es: 'Más de tres décadas construyendo relaciones comerciales sólidas con clientes y fabricantes del sector veterinario.',
        en: 'More than three decades building strong commercial relationships with clients and manufacturers across the veterinary industry.'
      },
      statValue: '37',
      statLabel: { es: 'años en el mercado', en: 'years in the market' }
    }
  };

  activeShowcaseTab = signal<FeaturedShowcaseCategoryId>('farmacos');
  showcaseTransitioning = signal(false);

  activeShowcaseTabData = computed(() =>
    this.featuredShowcaseTabs.find(tab => tab.id === this.activeShowcaseTab()) ?? this.featuredShowcaseTabs[0]
  );

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
      this.hero.set(homeData.hero);
      this.heroLoading.set(false);
    } catch {
      this.heroLoading.set(false);
      this.heroError.set(true);
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
  selectShowcaseTab(tabId: FeaturedShowcaseCategoryId): void {
    if (tabId === this.activeShowcaseTab() || this.showcaseTransitioning()) return;

    this.showcaseTransitioning.set(true);

    if (this.showcaseTransitionTimeout) clearTimeout(this.showcaseTransitionTimeout);
    this.showcaseTransitionTimeout = setTimeout(() => {
      this.activeShowcaseTab.set(tabId);
      this.showcaseTransitioning.set(false);
      this.showcaseTransitionTimeout = null;
    }, this.SHOWCASE_TAB_FADE_MS);
  }

  getLocalizedText(text: LocalizedText): string {
    return this.i18n.t(text);
  }

  getShowcaseCategoryLabel(category: FeaturedShowcaseCategoryId): string {
    return this.i18n.t(this.showcaseCategoryLabels[category]);
  }

  getHeroCategoryLabel(category: ApiProduct['category']): string {
    return this.i18n.t(this.showcaseCategoryLabels[category]);
  }

  getHeroProductRoute(product: ApiProduct): string {
    const lang = this.i18n.currentLang();
    return `${this.i18n.t(this.showcaseCategoryLinks[product.category])}/${product.slug[lang]}`;
  }

  getHeroProductMeta(product: ApiProduct): string[] {
    const meta = new Set<string>();

    if (product.species?.length) {
      meta.add(product.species[0]);
    }

    if (product.family) {
      meta.add(product.family);
    } else if (product.lifeStage) {
      meta.add(product.lifeStage);
    } else if (product.equipmentType) {
      meta.add(product.equipmentType);
    }

    if (product.presentations?.length) {
      meta.add(product.presentations[0]);
    }

    return Array.from(meta).filter(Boolean).slice(0, 3);
  }

  getShowcaseMeta(item: FeaturedShowcaseItem): LocalizedText[] {
    const meta: LocalizedText[] = [];

    if (item.species || item.family) {
      if (item.species && item.family) {
        meta.push({
          es: `${item.species.es} · ${item.family.es}`,
          en: `${item.species.en} · ${item.family.en}`
        });
      } else {
        meta.push(item.species ?? item.family!);
      }
    }

    if (item.lifeStage || item.equipmentType) {
      meta.push(item.lifeStage ?? item.equipmentType!);
    }

    if (item.presentations?.length) {
      meta.push(item.presentations[0]);
    }

    return meta.slice(0, 3);
  }

  /** Type-guard: returns the product object only if it is a populated ApiProduct (not a string/null) */
  isProductObject(product: ApiProduct | string | null | undefined): product is ApiProduct {
    return !!product && typeof product === 'object' && 'name' in product;
  }

  ngAfterViewInit(): void {
    if (typeof window === 'undefined') return;
    setTimeout(() => {
      this.fadeObserver = initFadeInObserver(this.el);
      this.setupFeatureVideo();
      this.setupParallax();
    }, 500);
  }

  private setupParallax(): void {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const layers = this.parallaxLayerRefs?.toArray().map(ref => ref.nativeElement) ?? [];
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
        const offset = Math.max(Math.min(normalizedDistance * speed * -viewportHeight, 46), -46);

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

  private setupFeatureVideo(): void {
    const videos = this.featureVideoRefs?.toArray().map(ref => ref.nativeElement) ?? [];
    if (videos.length < 2 || this.featureVideoSources.length === 0) return;

    videos.forEach(video => {
      video.defaultMuted = true;
      video.muted = true;
      video.playsInline = true;
      video.preload = 'auto';
      video.loop = false;
    });

    this.currentFeatureVideoIndex = 0;
    this.nextFeatureVideoIndex = this.featureVideoSources.length > 1 ? 1 : 0;
    this.activeFeatureVideoLayer.set(0);

    this.setVideoSource(videos[0], this.featureVideoSources[this.currentFeatureVideoIndex]);
    this.setVideoSource(videos[1], this.featureVideoSources[this.nextFeatureVideoIndex]);

    this.playVideo(videos[0]);
    videos[1].pause();

    videos.forEach((video, layerIndex) => {
      const handleTimeUpdate = () => {
        if (this.activeFeatureVideoLayer() !== layerIndex || this.featureVideoTransitioning) return;
        if (!Number.isFinite(video.duration) || video.duration <= 0) return;

        const remaining = video.duration - video.currentTime;
        if (remaining <= this.FEATURE_VIDEO_SWITCH_THRESHOLD_SECONDS) {
          this.transitionToNextFeatureVideo(videos, layerIndex as 0 | 1);
        }
      };

      const handleEnded = () => {
        if (this.activeFeatureVideoLayer() === layerIndex) {
          this.transitionToNextFeatureVideo(videos, layerIndex as 0 | 1);
        }
      };

      video.addEventListener('timeupdate', handleTimeUpdate);
      video.addEventListener('ended', handleEnded);
      this.featureVideoListeners.push(() => video.removeEventListener('timeupdate', handleTimeUpdate));
      this.featureVideoListeners.push(() => video.removeEventListener('ended', handleEnded));
    });

    const replayActiveVideo = () => {
      const activeVideo = videos[this.activeFeatureVideoLayer()];
      this.playVideo(activeVideo);
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') replayActiveVideo();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    this.featureVideoListeners.push(() => document.removeEventListener('visibilitychange', handleVisibilityChange));
  }

  private transitionToNextFeatureVideo(videos: HTMLVideoElement[], activeLayer: 0 | 1): void {
    if (this.featureVideoTransitioning || this.featureVideoSources.length <= 1) return;
    this.featureVideoTransitioning = true;

    const nextLayer = activeLayer === 0 ? 1 : 0;
    const currentVideo = videos[activeLayer];
    const incomingVideo = videos[nextLayer];
    const incomingSource = this.featureVideoSources[this.nextFeatureVideoIndex];

    this.setVideoSource(incomingVideo, incomingSource);
    incomingVideo.currentTime = 0;

    const finalizeTransition = () => {
      this.activeFeatureVideoLayer.set(nextLayer);

      if (this.featureVideoFadeTimeout) clearTimeout(this.featureVideoFadeTimeout);
      this.featureVideoFadeTimeout = setTimeout(() => {
        currentVideo.pause();
        currentVideo.currentTime = 0;

        this.currentFeatureVideoIndex = this.nextFeatureVideoIndex;
        this.nextFeatureVideoIndex = (this.currentFeatureVideoIndex + 1) % this.featureVideoSources.length;
        this.setVideoSource(currentVideo, this.featureVideoSources[this.nextFeatureVideoIndex]);
        this.featureVideoTransitioning = false;
      }, this.FEATURE_VIDEO_FADE_MS);
    };

    const startIncomingPlayback = () => {
      incomingVideo.removeEventListener('canplay', startIncomingPlayback);
      const playAttempt = incomingVideo.play();
      if (playAttempt instanceof Promise) {
        playAttempt.then(finalizeTransition).catch(finalizeTransition);
      } else {
        finalizeTransition();
      }
    };

    incomingVideo.addEventListener('canplay', startIncomingPlayback, { once: true });
    incomingVideo.load();
  }

  private setVideoSource(video: HTMLVideoElement, source: string): void {
    if (video.getAttribute('src') === source) return;
    video.setAttribute('src', source);
    video.load();
  }

  private playVideo(video: HTMLVideoElement): void {
    const playAttempt = video.play();
    if (playAttempt instanceof Promise) {
      playAttempt.catch(() => {});
    }
  }

  ngOnDestroy(): void {
    this.fadeObserver?.disconnect();
    if (this.featureVideoFadeTimeout) clearTimeout(this.featureVideoFadeTimeout);
    if (this.showcaseTransitionTimeout) clearTimeout(this.showcaseTransitionTimeout);
    if (this.parallaxAnimationFrame !== null && typeof window !== 'undefined') {
      window.cancelAnimationFrame(this.parallaxAnimationFrame);
      this.parallaxAnimationFrame = null;
    }
    this.parallaxCleanup.forEach(cleanup => cleanup());
    this.parallaxCleanup = [];
    this.featureVideoListeners.forEach(removeListener => removeListener());
    this.featureVideoListeners = [];
    this.seo.clearDynamicTags();
  }
}
