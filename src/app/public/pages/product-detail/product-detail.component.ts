import { Component, HostListener, OnDestroy, OnInit, PLATFORM_ID, computed, effect, inject, signal } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { BreadcrumbComponent } from '../../../shared/components/breadcrumb/breadcrumb.component';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { ApiProduct, ApiService } from '../../../shared/services/api.service';
import { I18nService } from '../../../shared/services/i18n.service';
import { SeoService } from '../../../shared/services/seo.service';
import { getCatalogSegment, getCategoryLabel, getCategorySlug, getContactSegment, getHomeLabel } from '../../../shared/utils/route-helpers';

interface ProductFactCard {
  icon: string;
  label: string;
  value: string;
}

interface ProductTextSection {
  title: string;
  value: string;
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
  private platformId = inject(PLATFORM_ID);
  private document = inject(DOCUMENT);
  i18n = inject(I18nService);

  product = signal<ApiProduct | null>(null);
  relatedProducts = signal<ApiProduct[]>([]);
  loading = signal(true);
  notFound = signal(false);
  error = signal(false);
  selectedImage = signal(0);
  stickyVisible = signal(false);
  lightboxOpen = signal(false);
  private currentSlug = '';
  private stickyObserver: IntersectionObserver | null = null;

  private stickyBodyClassEffect = isPlatformBrowser(this.platformId)
    ? effect(() => {
        if (this.stickyVisible()) {
          this.document.body.classList.add('has-sticky-bottom-bar');
        } else {
          this.document.body.classList.remove('has-sticky-bottom-bar');
        }
      })
    : null;

  summaryFacts = computed<ProductFactCard[]>(() => {
    const product = this.product();
    if (!product) return [];

    const lang = this.i18n.currentLang();
    const facts: ProductFactCard[] = [];
    const species = product.species?.slice(0, 2).join(', ');
    const firstPresentation = product.presentations?.[0];

    if (species) {
      facts.push({
        icon: 'pets',
        label: lang === 'es' ? 'Especies' : 'Species',
        value: species,
      });
    }

    if (product.category === 'farmacos' && product.family) {
      facts.push({
        icon: 'category',
        label: lang === 'es' ? 'Familia' : 'Family',
        value: product.family,
      });
    }

    if (product.category === 'alimentos' && product.lifeStage) {
      facts.push({
        icon: 'footprint',
        label: lang === 'es' ? 'Etapa' : 'Life stage',
        value: product.lifeStage,
      });
    }

    if (product.category === 'equipos' && product.equipmentType) {
      facts.push({
        icon: 'biotech',
        label: lang === 'es' ? 'Tipo' : 'Type',
        value: product.equipmentType,
      });
    }

    if (firstPresentation) {
      facts.push({
        icon: 'inventory_2',
        label: lang === 'es' ? 'Presentacion' : 'Presentation',
        value: firstPresentation,
      });
    }

    return facts.slice(0, 3);
  });

  detailFacts = computed<ProductFactCard[]>(() => {
    const product = this.product();
    if (!product) return [];

    const lang = this.i18n.currentLang();
    const facts: ProductFactCard[] = [];
    const species = product.species?.join(', ');

    if (this.brandName) {
      facts.push({
        icon: 'verified',
        label: lang === 'es' ? 'Marca' : 'Brand',
        value: this.brandName,
      });
    }

    if (species) {
      facts.push({
        icon: 'pets',
        label: lang === 'es' ? 'Cobertura' : 'Coverage',
        value: species,
      });
    }

    if (product.category === 'farmacos') {
      if (product.family) {
        facts.push({
          icon: 'medication',
          label: lang === 'es' ? 'Familia terapeutica' : 'Therapeutic family',
          value: product.family,
        });
      }
      if (product.sanitaryRegistry) {
        facts.push({
          icon: 'badge',
          label: lang === 'es' ? 'Registro sanitario' : 'Sanitary registry',
          value: product.sanitaryRegistry,
        });
      }
    }

    if (product.category === 'alimentos' && product.lifeStage) {
      facts.push({
        icon: 'nutrition',
        label: lang === 'es' ? 'Etapa de vida' : 'Life stage',
        value: product.lifeStage,
      });
    }

    if (product.category === 'equipos') {
      if (product.equipmentType) {
        facts.push({
          icon: 'precision_manufacturing',
          label: lang === 'es' ? 'Tipo de equipo' : 'Equipment type',
          value: product.equipmentType,
        });
      }
      if (product.warranty) {
        facts.push({
          icon: 'shield',
          label: lang === 'es' ? 'Garantia' : 'Warranty',
          value: this.i18n.t(product.warranty),
        });
      }
    }

    return facts;
  });

  technicalSections = computed<ProductTextSection[]>(() => {
    const product = this.product();
    if (!product) return [];

    const lang = this.i18n.currentLang();
    const sections: ProductTextSection[] = [];

    const pushSection = (titleEs: string, titleEn: string, value?: { es: string; en: string } | string | null) => {
      if (!value) return;
      const resolvedValue = typeof value === 'string' ? value : this.i18n.t(value);
      if (!resolvedValue) return;
      sections.push({
        title: lang === 'es' ? titleEs : titleEn,
        value: resolvedValue,
      });
    };

    pushSection('Descripcion', 'Description', product.description);

    if (product.category === 'farmacos') {
      pushSection('Composicion', 'Composition', product.composition);
      pushSection('Indicaciones', 'Indications', product.indications);
    }

    if (product.category === 'alimentos') {
      pushSection('Ingredientes principales', 'Main ingredients', product.ingredients);
      pushSection('Informacion nutricional', 'Nutritional information', product.nutritionalInfo);
    }

    if (product.category === 'equipos') {
      pushSection('Especificaciones tecnicas', 'Technical specifications', product.specifications);
      pushSection('Usos recomendados', 'Recommended uses', product.recommendedUses);
      pushSection('Garantia', 'Warranty', product.warranty);
    }

    return sections;
  });

  storytellingBlocks = computed(() => this.product()?.storytelling ?? []);

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

  get contactLink(): string {
    const product = this.product();
    const lang = this.i18n.currentLang();
    const slug = product ? product.slug[lang] : '';
    return `/${lang}/${getContactSegment(lang)}?producto=${slug}`;
  }

  get categoryLabel(): string {
    const product = this.product();
    return product ? getCategoryLabel(product.category, this.i18n.currentLang()) : '';
  }

  get categoryIcon(): string {
    const category = this.product()?.category;
    if (category === 'farmacos') return 'pill';
    if (category === 'alimentos') return 'pets';
    return 'biotech';
  }

  get brandName(): string {
    const product = this.product();
    return product?.brand?.name || '';
  }

  get brandSlug(): string {
    const product = this.product();
    return product?.brand?.slug || '';
  }

  get brandLogo(): string | undefined {
    return this.product()?.brand?.logo;
  }

  get brandInitials(): string {
    return this.brandName
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map(token => token[0]?.toUpperCase() ?? '')
      .join('') || 'H';
  }

  get categoryLink(): string {
    const product = this.product();
    const lang = this.i18n.currentLang();
    if (!product) return '#';
    return `/${lang}/${getCatalogSegment(lang)}/${getCategorySlug(product.category, lang)}`;
  }

  get whatsappLink(): string {
    const product = this.product();
    if (!product) return '#';
    const lang = this.i18n.currentLang();
    const brandPart = this.brandName ? (lang === 'es' ? ` de ${this.brandName}` : ` by ${this.brandName}`) : '';
    const message = lang === 'es'
      ? `Hola, me interesa el producto ${product.name.es}${brandPart}. Me gustaria recibir informacion.`
      : `Hello, I am interested in the product ${product.name.en}${brandPart}. I would like to receive information.`;
    return `https://wa.me/50622609020?text=${encodeURIComponent(message)}`;
  }

  async ngOnInit(): Promise<void> {
    const slug = this.route.snapshot.paramMap.get('slug');
    this.currentSlug = slug || '';

    if (slug) {
      await this.loadProduct(slug);
    }

    this.loading.set(false);

    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => this.observeStickySummary(), 100);
    }
  }

  private observeStickySummary(): void {
    this.stickyObserver?.disconnect();
    const summaryCard = this.document.querySelector('.product-detail__summary-card');
    if (!summaryCard) return;

    this.stickyObserver = new IntersectionObserver(
      ([entry]) => this.stickyVisible.set(!entry.isIntersecting),
      { threshold: 0.2 }
    );

    this.stickyObserver.observe(summaryCard);
  }

  private async loadProduct(slug: string): Promise<void> {
    this.loading.set(true);
    this.notFound.set(false);
    this.error.set(false);

    try {
      const lang = this.i18n.currentLang();
      const product = await this.api.getProductBySlug(slug, lang);
      this.product.set(product);
      this.selectedImage.set(0);

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

      try {
        const related = await this.api.getRelatedProducts(product._id);
        this.relatedProducts.set(related);
      } catch {
        this.relatedProducts.set([]);
      }

      if (isPlatformBrowser(this.platformId)) {
        setTimeout(() => this.observeStickySummary(), 100);
      }
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

  async retry(): Promise<void> {
    if (this.currentSlug) {
      await this.loadProduct(this.currentSlug);
    }
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

  toWebP(url: string): string {
    return url.replace(/\.(jpe?g|png)$/i, '.webp');
  }

  ngOnDestroy(): void {
    this.seo.clearDynamicTags();
    this.stickyObserver?.disconnect();
    if (isPlatformBrowser(this.platformId)) {
      this.document.body.classList.remove('has-sticky-bottom-bar');
    }
  }
}
