import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Component, HostListener, OnDestroy, OnInit, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BreadcrumbComponent } from '../../../shared/components/breadcrumb/breadcrumb.component';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { ApiBrand, ApiProduct, ApiService } from '../../../shared/services/api.service';
import { I18nService } from '../../../shared/services/i18n.service';
import { SeoService } from '../../../shared/services/seo.service';
import { ToastService } from '../../../shared/services/toast.service';
import { buildProductUrl, getBrandsSegment, getCatalogSegment, getCategoryLabel, getCategorySlug, getContactSegment, getHomeLabel } from '../../../shared/utils/route-helpers';

interface ProductSummaryRow {
  icon: string;
  label: string;
  items: string[];
}

interface ProductTrustItem {
  icon: string;
  text: string;
}

interface ProductTechnicalCard {
  icon: string;
  title: string;
  value?: string;
  items?: string[];
}

interface ProductFaqItem {
  question: string;
  answer: string;
}

interface ProductQuickLink {
  icon: string;
  label: string;
  routerLink: string[];
  queryParams?: Record<string, string>;
  fragment?: string;
}

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [RouterLink, BreadcrumbComponent, ProductCardComponent],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss'
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private api = inject(ApiService);
  private seo = inject(SeoService);
  private toast = inject(ToastService);
  private platformId = inject(PLATFORM_ID);
  private document = inject(DOCUMENT);
  i18n = inject(I18nService);

  product = signal<ApiProduct | null>(null);
  brandDetail = signal<ApiBrand | null>(null);
  relatedProducts = signal<ApiProduct[]>([]);
  loading = signal(true);
  notFound = signal(false);
  error = signal(false);
  selectedImage = signal(0);
  lightboxOpen = signal(false);
  openFaqIndex = signal<number | null>(0);
  private currentSlug = '';

  summaryRows = computed<ProductSummaryRow[]>(() => {
    const product = this.product();
    if (!product) return [];

    const lang = this.i18n.currentLang();
    const rows: ProductSummaryRow[] = [];
    const addRow = (icon: string, labelEs: string, labelEn: string, items?: string[]) => {
      if (!items?.length) return;
      rows.push({
        icon,
        label: lang === 'es' ? labelEs : labelEn,
        items,
      });
    };

    addRow('pets', 'Especies', 'Species', product.species);

    if (product.category === 'farmacos' && product.family) {
      rows.push({
        icon: 'local_pharmacy',
        label: lang === 'es' ? 'Familia' : 'Family',
        items: [product.family],
      });
    }

    if (product.category === 'alimentos' && product.lifeStage) {
      rows.push({
        icon: 'pets',
        label: lang === 'es' ? 'Etapa de vida' : 'Life stage',
        items: [product.lifeStage],
      });
    }

    if (product.category === 'equipos' && product.equipmentType) {
      rows.push({
        icon: 'precision_manufacturing',
        label: lang === 'es' ? 'Tipo de equipo' : 'Equipment type',
        items: [product.equipmentType],
      });
    }

    if (product.presentations?.length) {
      rows.push({
        icon: 'inventory_2',
        label: lang === 'es' ? 'Presentaciones' : 'Presentations',
        items: product.presentations,
      });
    }

    return rows.slice(0, 3);
  });

  trustItems = computed<ProductTrustItem[]>(() => {
    const lang = this.i18n.currentLang();
    const product = this.product();
    const supportText = product?.category === 'equipos'
      ? (lang === 'es' ? 'Soporte y respaldo técnico' : 'Technical support and backup')
      : (lang === 'es' ? 'Productos con registro sanitario' : 'Products with sanitary registration');

    return [
      { icon: 'local_shipping', text: lang === 'es' ? 'Entrega en todo el país' : 'Nationwide delivery' },
      { icon: 'support_agent', text: lang === 'es' ? 'Asesoría técnica incluida' : 'Technical guidance included' },
      { icon: 'verified_user', text: supportText },
      { icon: 'handshake', text: lang === 'es' ? '37 años de respaldo' : '37 years of trust' },
    ];
  });

  technicalCards = computed<ProductTechnicalCard[]>(() => {
    const product = this.product();
    if (!product) return [];

    const lang = this.i18n.currentLang();
    const cards: ProductTechnicalCard[] = [];
    const addTextCard = (icon: string, titleEs: string, titleEn: string, value?: string) => {
      if (!value) return;
      cards.push({
        icon,
        title: lang === 'es' ? titleEs : titleEn,
        value,
      });
    };
    const addListCard = (icon: string, titleEs: string, titleEn: string, items?: string[]) => {
      if (!items?.length) return;
      cards.push({
        icon,
        title: lang === 'es' ? titleEs : titleEn,
        items,
      });
    };

    if (product.category === 'farmacos') {
      addTextCard('science', 'Composición / fórmula', 'Composition / formula', this.localized(product.composition));
      addListCard('pets', 'Especies de destino', 'Target species', product.species);
      addTextCard('medication', 'Indicaciones', 'Indications', this.localized(product.indications));
      addListCard('straighten', 'Presentaciones', 'Presentations', product.presentations);
      addTextCard('assignment', 'Número de registro', 'Registry number', product.sanitaryRegistry);
    }

    if (product.category === 'alimentos') {
      addTextCard('nutrition', 'Ingredientes principales', 'Main ingredients', this.localized(product.ingredients));
      addTextCard('schedule', 'Etapa de vida', 'Life stage', product.lifeStage);
      addListCard('pets', 'Especies de destino', 'Target species', product.species);
      addListCard('straighten', 'Presentaciones', 'Presentations', product.presentations);
      addTextCard('monitor_heart', 'Información nutricional', 'Nutritional information', this.localized(product.nutritionalInfo));
    }

    if (product.category === 'equipos') {
      addTextCard('memory', 'Especificaciones técnicas', 'Technical specifications', this.localized(product.specifications));
      addTextCard('biotech', 'Tipo de equipo', 'Equipment type', product.equipmentType);
      addTextCard('construction', 'Aplicaciones', 'Applications', this.localized(product.recommendedUses));
      addListCard('straighten', 'Presentaciones', 'Presentations', product.presentations);
      addTextCard('verified_user', 'Garantía', 'Warranty', this.localized(product.warranty));
    }

    return cards;
  });

  storytellingBlocks = computed(() =>
    (this.product()?.storytelling || [])
      .map(block => ({
        image: block.image,
        text: this.localized(block.text),
      }))
      .filter(block => !!block.text)
  );

  faqItems = computed<ProductFaqItem[]>(() => {
    const product = this.product();
    if (!product) return [];

    const lang = this.i18n.currentLang();
    const presentations = product.presentations?.join(', ');
    const registry = product.sanitaryRegistry;
    const warranty = this.localized(product.warranty);

    if (product.category === 'farmacos') {
      return [
        {
          question: lang === 'es' ? '¿Cómo puedo verificar el registro sanitario?' : 'How can I verify the sanitary registration?',
          answer: registry
            ? (lang === 'es'
                ? `Puede consultar el número ${registry} en la ficha técnica del producto o solicitar a nuestro equipo comercial la documentación complementaria.`
                : `You can check registry number ${registry} in the product technical sheet or ask our commercial team for supporting documentation.`)
            : (lang === 'es'
                ? 'Nuestro equipo puede compartir la documentación técnica y regulatoria disponible para este producto.'
                : 'Our team can share the available technical and regulatory documentation for this product.'),
        },
        {
          question: lang === 'es' ? '¿Cuál es la vida útil del producto?' : 'What is the product shelf life?',
          answer: lang === 'es'
            ? 'La vida útil exacta depende del lote y de las condiciones de almacenamiento. Podemos enviarle la ficha técnica completa para confirmar ese dato.'
            : 'Shelf life depends on the batch and storage conditions. We can send the full technical sheet to confirm that information.',
        },
        {
          question: lang === 'es' ? '¿Requiere cadena de frío?' : 'Does it require a cold chain?',
          answer: lang === 'es'
            ? 'Las condiciones de conservación pueden variar según la formulación. Le recomendamos solicitar la ficha técnica o consultar a un asesor antes de programar su compra.'
            : 'Storage requirements may vary by formulation. We recommend requesting the technical sheet or consulting an advisor before planning your purchase.',
        },
      ];
    }

    if (product.category === 'alimentos') {
      return [
        {
          question: lang === 'es' ? '¿Cuál es la ración recomendada?' : 'What is the recommended feeding amount?',
          answer: presentations
            ? (lang === 'es'
                ? `La ración depende de la especie, etapa y presentación disponible (${presentations}). Nuestro equipo puede orientarle con una recomendación comercial y técnica.`
                : `Feeding guidance depends on species, life stage, and available presentation (${presentations}). Our team can help you with a commercial and technical recommendation.`)
            : (lang === 'es'
                ? 'La ración debe ajustarse según especie, etapa de vida y objetivo nutricional.'
                : 'Feeding amounts should be adjusted according to species, life stage, and nutritional goal.'),
        },
        {
          question: lang === 'es' ? '¿Cómo debo almacenarlo?' : 'How should it be stored?',
          answer: lang === 'es'
            ? 'Se recomienda mantenerlo en un lugar fresco, seco y protegido de la humedad. Si lo desea, podemos enviarle la ficha técnica para revisar condiciones específicas.'
            : 'We recommend storing it in a cool, dry place protected from moisture. If needed, we can send the technical sheet with specific storage guidance.',
        },
        {
          question: lang === 'es' ? '¿Qué presentaciones manejan?' : 'Which presentations are available?',
          answer: presentations
            ? (lang === 'es'
                ? `Actualmente este producto se trabaja en estas presentaciones: ${presentations}.`
                : `This product is currently available in the following presentations: ${presentations}.`)
            : (lang === 'es'
                ? 'Podemos confirmarle las presentaciones activas según disponibilidad.'
                : 'We can confirm active presentations according to availability.'),
        },
      ];
    }

    return [
      {
        question: lang === 'es' ? '¿Incluye garantía?' : 'Does it include warranty?',
        answer: warranty
          ? (lang === 'es'
              ? `Sí. El producto cuenta con esta cobertura de garantía: ${warranty}`
              : `Yes. This product includes the following warranty coverage: ${warranty}`)
          : (lang === 'es'
              ? 'Sí, podemos indicarle la cobertura disponible según modelo y condiciones comerciales.'
              : 'Yes, we can share the available coverage according to the model and commercial terms.'),
      },
      {
        question: lang === 'es' ? '¿Ofrecen capacitación para uso?' : 'Do you offer usage training?',
        answer: lang === 'es'
          ? 'Sí. Nuestro equipo puede coordinar acompañamiento técnico y resolver dudas sobre instalación, operación o arranque.'
          : 'Yes. Our team can coordinate technical support and answer questions about setup, operation, or startup.',
      },
      {
        question: lang === 'es' ? '¿Tienen repuestos disponibles?' : 'Are spare parts available?',
        answer: lang === 'es'
          ? 'La disponibilidad de repuestos y accesorios depende de la línea del equipo. Podemos confirmarlo rápidamente con nuestro equipo comercial.'
          : 'Spare part and accessory availability depends on the equipment line. We can confirm it quickly through our commercial team.',
      },
    ];
  });

  quickLinks = computed<ProductQuickLink[]>(() => {
    const lang = this.i18n.currentLang();
    const productName = this.productDisplayName;

    return [
      {
        icon: 'grid_view',
        label: lang === 'es' ? 'Ver catálogo completo' : 'View full catalog',
        routerLink: ['/' + lang, getCatalogSegment(lang)],
      },
      {
        icon: 'storefront',
        label: lang === 'es' ? 'Ver todas las marcas' : 'View all brands',
        routerLink: ['/' + lang, getBrandsSegment(lang)],
      },
      {
        icon: 'description',
        label: lang === 'es' ? 'Políticas comerciales' : 'Commercial policies',
        routerLink: ['/' + lang, lang === 'es' ? 'nosotros' : 'about'],
        fragment: 'commercial-policies',
      },
      {
        icon: 'support_agent',
        label: lang === 'es' ? 'Contactar a un asesor' : 'Contact an advisor',
        routerLink: ['/' + lang, getContactSegment(lang)],
        queryParams: {
          producto: productName,
          type: 'comercial',
        },
      },
    ];
  });

  get breadcrumbs() {
    const product = this.product();
    const lang = this.i18n.currentLang();
    if (!product) return [];

    const catalogSegment = getCatalogSegment(lang);
    const categorySlug = getCategorySlug(product.category, lang);

    return [
      { label: getHomeLabel(lang), url: this.i18n.getLangPrefix() },
      { label: lang === 'es' ? 'Catalogo' : 'Catalog', url: `${this.i18n.getLangPrefix()}/${catalogSegment}` },
      { label: getCategoryLabel(product.category, lang), url: `${this.i18n.getLangPrefix()}/${catalogSegment}/${categorySlug}` },
      { label: this.i18n.t(product.name) }
    ];
  }

  get productDisplayName(): string {
    const product = this.product();
    return product ? this.i18n.t(product.name) : '';
  }

  get productLead(): string {
    const product = this.product();
    return product ? this.localized(product.description) : '';
  }

  get categoryLabel(): string {
    const product = this.product();
    return product ? getCategoryLabel(product.category, this.i18n.currentLang()) : '';
  }

  get categoryIcon(): string {
    const category = this.product()?.category;
    if (category === 'farmacos') return 'local_pharmacy';
    if (category === 'alimentos') return 'pets';
    return 'precision_manufacturing';
  }

  get brandName(): string {
    return this.brandDetail()?.name || this.product()?.brand?.name || '';
  }

  get brandSlug(): string {
    return this.brandDetail()?.slug || this.product()?.brand?.slug || '';
  }

  get brandLogo(): string | undefined {
    return this.brandDetail()?.logo || this.product()?.brand?.logo;
  }

  get brandDescription(): string {
    const detail = this.brandDetail();
    if (detail?.description) {
      return this.localized(detail.description);
    }

    const lang = this.i18n.currentLang();
    const brandName = this.brandName;
    if (!brandName) return '';

    return lang === 'es'
      ? `${brandName} forma parte del portafolio distribuido por HESA y cuenta con respaldo comercial para atender diferentes necesidades del sector veterinario.`
      : `${brandName} is part of the portfolio distributed by HESA and comes with commercial support to serve different needs across the veterinary sector.`;
  }

  get brandCountry(): string {
    const detail = this.brandDetail();
    return this.localizeCountry(detail?.country || this.product()?.brand?.country || '');
  }

  get brandCountryFlag(): string {
    const normalized = this.normalizeCountry(this.brandDetail()?.country || this.product()?.brand?.country || '');
    const flags: Record<string, string> = {
      'costa rica': '🇨🇷',
      'estados unidos': '🇺🇸',
      'united states': '🇺🇸',
      'francia': '🇫🇷',
      'france': '🇫🇷',
      'noruega': '🇳🇴',
      'norway': '🇳🇴',
      'mexico': '🇲🇽',
      'brasil': '🇧🇷',
      'brazil': '🇧🇷',
      'alemania': '🇩🇪',
      'germany': '🇩🇪',
      'china': '🇨🇳',
      'japon': '🇯🇵',
      'japan': '🇯🇵',
      'india': '🇮🇳',
      'espana': '🇪🇸',
      'spain': '🇪🇸',
      'italia': '🇮🇹',
      'italy': '🇮🇹',
      'paises bajos': '🇳🇱',
      'netherlands': '🇳🇱',
      'suiza': '🇨🇭',
      'switzerland': '🇨🇭',
    };
    return flags[normalized] || '';
  }

  get brandInitials(): string {
    return this.brandName
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map(token => token[0]?.toUpperCase() ?? '')
      .join('') || 'H';
  }

  get whatsappLink(): string {
    const product = this.product();
    if (!product) return '#';
    const lang = this.i18n.currentLang();
    const brandPart = this.brandName ? (lang === 'es' ? ` de ${this.brandName}` : ` by ${this.brandName}`) : '';
    const message = lang === 'es'
      ? `Hola, me interesa el producto ${product.name.es}${brandPart}. Me gustaria consultar disponibilidad e informacion comercial.`
      : `Hello, I am interested in the product ${product.name.en}${brandPart}. I would like to check availability and commercial information.`;
    return `https://wa.me/50622609020?text=${encodeURIComponent(message)}`;
  }

  get callLink(): string {
    return 'tel:+50622609020';
  }

  get contactRoute(): string[] {
    const lang = this.i18n.currentLang();
    return ['/' + lang, getContactSegment(lang)];
  }

  get infoContactParams(): Record<string, string> {
    return {
      producto: this.productDisplayName,
      type: 'info',
    };
  }

  get availabilityContactParams(): Record<string, string> {
    return {
      producto: this.productDisplayName,
      type: 'comercial',
    };
  }

  get brandRoute(): string[] {
    const lang = this.i18n.currentLang();
    return ['/' + lang, getBrandsSegment(lang), this.brandSlug];
  }

  get downloadCtaLabel(): string {
    const lang = this.i18n.currentLang();
    return lang === 'es' ? 'Ficha técnica' : 'Technical sheet';
  }

  async ngOnInit(): Promise<void> {
    const slug = this.route.snapshot.paramMap.get('slug');
    this.currentSlug = slug || '';

    if (slug) {
      await this.loadProduct(slug);
    }

    this.loading.set(false);

  }

  private async loadProduct(slug: string): Promise<void> {
    this.loading.set(true);
    this.notFound.set(false);
    this.error.set(false);
    this.brandDetail.set(null);

    try {
      const lang = this.i18n.currentLang();
      const product = await this.api.getProductBySlug(slug, lang);
      this.product.set(product);
      this.selectedImage.set(0);
      this.openFaqIndex.set(0);

      const productName = this.i18n.t(product.name);
      const brandName = product.brand?.name || '';
      const metaTitle = product.metaTitle ? this.i18n.t(product.metaTitle) : (brandName ? `${productName} - ${brandName}` : productName);
      const metaDescription = product.metaDescription ? this.i18n.t(product.metaDescription) : this.i18n.t(product.description).slice(0, 160);
      const productUrl = `/${lang}/${getCatalogSegment(lang)}/${getCategorySlug(product.category, lang)}/${product.slug[lang]}`;

      this.seo.setMetaTags({
        title: metaTitle,
        description: metaDescription,
        url: productUrl,
        image: product.images?.[0],
        type: 'product',
      });

      this.seo.setHreflang(
        `/es/catalogo/${getCategorySlug(product.category, 'es')}/${product.slug.es}`,
        `/en/catalog/${getCategorySlug(product.category, 'en')}/${product.slug.en}`
      );

      this.seo.setProductSchema({
        name: productName,
        description: metaDescription,
        brand: brandName,
        category: getCategoryLabel(product.category, lang),
        image: product.images?.[0],
        url: productUrl,
      });

      await Promise.allSettled([
        this.loadBrandDetail(product),
        this.loadRelatedProducts(product._id),
      ]);
    } catch (error) {
      if (error instanceof HttpErrorResponse && error.status === 404) {
        this.notFound.set(true);
      } else {
        this.error.set(true);
      }
    } finally {
      this.loading.set(false);
    }
  }

  private async loadBrandDetail(product: ApiProduct): Promise<void> {
    const slug = product.brand?.slug;
    if (!slug) {
      this.brandDetail.set(null);
      return;
    }

    try {
      const brand = await this.api.getBrandBySlug(slug);
      this.brandDetail.set(brand);
    } catch {
      this.brandDetail.set(null);
    }
  }

  private async loadRelatedProducts(productId: string): Promise<void> {
    try {
      const related = await this.api.getRelatedProducts(productId);
      this.relatedProducts.set(related);
    } catch {
      this.relatedProducts.set([]);
    }
  }

  async retry(): Promise<void> {
    if (this.currentSlug) {
      await this.loadProduct(this.currentSlug);
    }
  }

  async shareProduct(): Promise<void> {
    const product = this.product();
    if (!product || !isPlatformBrowser(this.platformId)) return;

    const title = this.productDisplayName;
    const url = this.document.location?.href || buildProductUrl(product.category, product.slug[this.i18n.currentLang()], this.i18n.currentLang());

    if (typeof navigator !== 'undefined' && 'share' in navigator) {
      try {
        await navigator.share({
          title,
          text: this.productLead,
          url,
        });
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return;
        }
      }
    }

    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
        this.toast.success(this.i18n.currentLang() === 'es' ? 'Enlace copiado al portapapeles' : 'Link copied to clipboard');
      } else {
        this.toast.info(this.i18n.currentLang() === 'es' ? 'Copie el enlace desde la barra del navegador' : 'Copy the link from your browser address bar');
      }
    } catch {
      this.toast.info(this.i18n.currentLang() === 'es' ? 'No pudimos copiar el enlace automáticamente' : 'We could not copy the link automatically');
    }
  }

  toggleFaq(index: number): void {
    this.openFaqIndex.update(current => current === index ? null : index);
  }

  @HostListener('document:keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if (!this.lightboxOpen()) return;

    const product = this.product();
    if (!product?.images?.length) return;

    if (event.key === 'Escape') {
      this.lightboxOpen.set(false);
    }

    if (event.key === 'ArrowLeft') {
      this.selectedImage.set((this.selectedImage() - 1 + product.images.length) % product.images.length);
    }

    if (event.key === 'ArrowRight') {
      this.selectedImage.set((this.selectedImage() + 1) % product.images.length);
    }
  }

  ngOnDestroy(): void {
    this.seo.clearDynamicTags();
  }

  private localized(value?: { es: string; en: string } | string | null): string {
    if (!value) return '';
    if (typeof value === 'string') return value;
    return this.i18n.t(value);
  }

  private normalizeCountry(value: string): string {
    return value
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .toLowerCase()
      .trim();
  }

  private localizeCountry(value: string): string {
    if (!value) return '';

    const lang = this.i18n.currentLang();
    const normalized = this.normalizeCountry(value);
    const countryMap: Record<string, { es: string; en: string }> = {
      'costa rica': { es: 'Costa Rica', en: 'Costa Rica' },
      'estados unidos': { es: 'Estados Unidos', en: 'United States' },
      'united states': { es: 'Estados Unidos', en: 'United States' },
      'francia': { es: 'Francia', en: 'France' },
      'france': { es: 'Francia', en: 'France' },
      'noruega': { es: 'Noruega', en: 'Norway' },
      'norway': { es: 'Noruega', en: 'Norway' },
      'mexico': { es: 'México', en: 'Mexico' },
      'brasil': { es: 'Brasil', en: 'Brazil' },
      'brazil': { es: 'Brasil', en: 'Brazil' },
      'alemania': { es: 'Alemania', en: 'Germany' },
      'germany': { es: 'Alemania', en: 'Germany' },
      'china': { es: 'China', en: 'China' },
      'japon': { es: 'Japón', en: 'Japan' },
      'japan': { es: 'Japón', en: 'Japan' },
      'india': { es: 'India', en: 'India' },
      'espana': { es: 'España', en: 'Spain' },
      'spain': { es: 'España', en: 'Spain' },
      'italia': { es: 'Italia', en: 'Italy' },
      'italy': { es: 'Italia', en: 'Italy' },
      'paises bajos': { es: 'Países Bajos', en: 'Netherlands' },
      'netherlands': { es: 'Países Bajos', en: 'Netherlands' },
      'suiza': { es: 'Suiza', en: 'Switzerland' },
      'switzerland': { es: 'Suiza', en: 'Switzerland' },
    };

    return countryMap[normalized]?.[lang] || value;
  }
}
