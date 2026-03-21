import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Component, HostListener, OnDestroy, OnInit, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BreadcrumbComponent } from '../../../shared/components/breadcrumb/breadcrumb.component';
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
  label: string;
  value?: string;
  items?: string[];
}

interface ProductDetailTab {
  id: string;
  label: string;
  title: string;
  intro?: string;
  rows: ProductTechnicalCard[];
  notes?: string[];
  image?: string;
}

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [RouterLink, BreadcrumbComponent],
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
  loading = signal(true);
  notFound = signal(false);
  error = signal(false);
  selectedImage = signal(0);
  lightboxOpen = signal(false);
  activeDetailTabId = signal('');
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

  detailTabs = computed<ProductDetailTab[]>(() => {
    const product = this.product();
    if (!product) return [];

    const lang = this.i18n.currentLang();
    const storytelling = (product.storytelling || [])
      .map(block => ({
        image: block.image,
        text: this.localized(block.text),
      }))
      .filter(block => !!block.text);
    const tabs: ProductDetailTab[] = [];
    const addTab = (
      id: string,
      labelEs: string,
      labelEn: string,
      titleEs: string,
      titleEn: string,
      rows: ProductTechnicalCard[],
      intro?: string,
      notes?: string[],
      image?: string,
    ) => {
      if (!rows.length && !intro && !notes?.length) return;
      tabs.push({
        id,
        label: lang === 'es' ? labelEs : labelEn,
        title: lang === 'es' ? titleEs : titleEn,
        intro,
        rows,
        notes,
        image,
      });
    };
    const rowText = (labelEs: string, labelEn: string, value?: string): ProductTechnicalCard | null => {
      if (!value) return null;
      return {
        label: lang === 'es' ? labelEs : labelEn,
        value,
      };
    };
    const rowList = (labelEs: string, labelEn: string, items?: string[]): ProductTechnicalCard | null => {
      if (!items?.length) return null;
      return {
        label: lang === 'es' ? labelEs : labelEn,
        items,
      };
    };
    const compact = <T>(items: Array<T | null | undefined>): T[] => items.filter(Boolean) as T[];

    if (product.category === 'farmacos') {
      addTab(
        'formula',
        'Fórmula',
        'Formula',
        'Composición y respaldo regulatorio',
        'Composition and regulatory support',
        compact([
          rowText('Composición', 'Composition', this.localized(product.composition)),
          rowText('Familia', 'Family', product.family),
          rowText('Registro', 'Registry', product.sanitaryRegistry),
        ]),
      );

      addTab(
        'uso',
        'Uso',
        'Use',
        'Uso recomendado y presentaciones',
        'Recommended use and presentations',
        compact([
          rowList('Especies', 'Species', product.species),
          rowText('Indicaciones', 'Indications', this.localized(product.indications)),
          rowList('Presentaciones', 'Presentations', product.presentations),
        ]),
      );
    }

    if (product.category === 'alimentos') {
      addTab(
        'nutricion',
        'Nutrición',
        'Nutrition',
        'Perfil nutricional del producto',
        'Nutritional profile of the product',
        compact([
          rowText('Ingredientes', 'Ingredients', this.localized(product.ingredients)),
          rowText('Información nutricional', 'Nutritional information', this.localized(product.nutritionalInfo)),
        ]),
      );

      addTab(
        'perfil',
        'Perfil',
        'Profile',
        'Especies, etapa y formatos',
        'Species, life stage, and formats',
        compact([
          rowList('Especies', 'Species', product.species),
          rowText('Etapa de vida', 'Life stage', product.lifeStage),
          rowList('Presentaciones', 'Presentations', product.presentations),
        ]),
      );
    }

    if (product.category === 'equipos') {
      addTab(
        'especificaciones',
        'Especificaciones',
        'Specifications',
        'Información técnica clave',
        'Key technical information',
        compact([
          rowText('Tipo de equipo', 'Equipment type', product.equipmentType),
          rowText('Especificaciones', 'Specifications', this.localized(product.specifications)),
          rowText('Garantía', 'Warranty', this.localized(product.warranty)),
        ]),
      );

      addTab(
        'aplicaciones',
        'Aplicaciones',
        'Applications',
        'Uso y formatos disponibles',
        'Use and available formats',
        compact([
          rowText('Aplicaciones', 'Applications', this.localized(product.recommendedUses)),
          rowList('Presentaciones', 'Presentations', product.presentations),
        ]),
      );
    }

    addTab(
      'contexto',
      'Contexto',
      'Context',
      lang === 'es' ? 'Resumen comercial del producto' : 'Commercial overview of the product',
      lang === 'es' ? 'Resumen comercial del producto' : 'Commercial overview of the product',
      [],
      this.localized(product.description),
      storytelling.map(block => block.text),
      storytelling.find(block => block.image)?.image,
    );

    return tabs;
  });

  activeDetailTab = computed<ProductDetailTab | null>(() => {
    const tabs = this.detailTabs();
    if (!tabs.length) return null;
    return tabs.find(tab => tab.id === this.activeDetailTabId()) || tabs[0];
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

  get brandInitials(): string {
    return this.brandName
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map(token => token[0]?.toUpperCase() ?? '')
      .join('') || 'H';
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
      this.activeDetailTabId.set('');

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

      await this.loadBrandDetail(product);
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

  selectDetailTab(id: string): void {
    this.activeDetailTabId.set(id);
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

  private localizeCountry(value: string): string {
    if (!value) return '';

    const lang = this.i18n.currentLang();
    const normalized = value
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .toLowerCase()
      .trim();
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
