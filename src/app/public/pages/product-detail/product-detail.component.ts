import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { BreadcrumbComponent } from '../../../shared/components/breadcrumb/breadcrumb.component';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { ApiService, ApiProduct } from '../../../shared/services/api.service';
import { I18nService } from '../../../shared/services/i18n.service';
import { SeoService } from '../../../shared/services/seo.service';
import { getCategorySlug, getCategoryLabel, getCatalogSegment, getHomeLabel, getContactSegment } from '../../../shared/utils/route-helpers';

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
  i18n = inject(I18nService);

  product = signal<ApiProduct | null>(null);
  relatedProducts = signal<ApiProduct[]>([]);
  loading = signal(true);
  notFound = signal(false);
  error = signal(false); // BUG-012: Separate error state from notFound
  selectedImage = signal(0);
  stickyVisible = signal(false);
  lightboxOpen = signal(false);
  private currentSlug = '';

  get breadcrumbs() {
    const p = this.product();
    const lang = this.i18n.currentLang();
    if (!p) return [];
    const catalog = getCatalogSegment(lang);
    const catSlug = getCategorySlug(p.category, lang);
    return [
      { label: getHomeLabel(lang), url: this.i18n.getLangPrefix() },
      { label: lang === 'es' ? 'Catalogo' : 'Catalog', url: this.i18n.getLangPrefix() + '/' + catalog },
      { label: getCategoryLabel(p.category, lang), url: this.i18n.getLangPrefix() + '/' + catalog + '/' + catSlug },
      { label: this.i18n.t(p.name) }
    ];
  }

  get contactLink(): string {
    const lang = this.i18n.currentLang();
    const p = this.product();
    const slug = p ? p.slug[lang] : '';
    return '/' + lang + '/' + getContactSegment(lang) + '?producto=' + slug;
  }

  get brandName(): string {
    const p = this.product();
    if (!p) return '';
    if (typeof p.brand === 'object' && p.brand) return p.brand.name;
    return '';
  }

  get brandSlug(): string {
    const p = this.product();
    if (!p) return '';
    if (typeof p.brand === 'object' && p.brand) return p.brand.slug;
    return '';
  }

  get whatsappLink(): string {
    const p = this.product();
    if (!p) return '#';
    const lang = this.i18n.currentLang();
    const msg = lang === 'es'
      ? `Hola, me interesa el producto ${p.name.es} de ${this.brandName}. Me gustaria recibir informacion.`
      : `Hello, I am interested in the product ${p.name.en} by ${this.brandName}. I would like to receive information.`;
    return `https://wa.me/50622609020?text=${encodeURIComponent(msg)}`;
  }

  async ngOnInit(): Promise<void> {
    const slug = this.route.snapshot.paramMap.get('slug');
    this.currentSlug = slug || '';
    if (slug) {
      await this.loadProduct(slug);
    }
    this.loading.set(false);

    // Sticky bar via IntersectionObserver
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        const infoSection = document.querySelector('.product-detail__info');
        if (infoSection) {
          const observer = new IntersectionObserver(
            ([entry]) => this.stickyVisible.set(!entry.isIntersecting),
            { threshold: 0 }
          );
          observer.observe(infoSection);
        }
      }, 1000);
    }
  }

  /**
   * BUG-012: Load product with proper error differentiation.
   * 404 = product not found (show not found page)
   * Other errors = API error (show error state with retry)
   */
  private async loadProduct(slug: string): Promise<void> {
    this.loading.set(true);
    this.notFound.set(false);
    this.error.set(false);
    try {
      const lang = this.i18n.currentLang();
      const product = await this.api.getProductBySlug(slug, lang);
      this.product.set(product);

      // REQ-125: Dynamic meta tags
      const productName = this.i18n.t(product.name);
      const productDesc = this.i18n.t(product.description) || '';
      const brandName = typeof product.brand === 'object' ? product.brand.name : '';
      const metaTitle = product.metaTitle ? this.i18n.t(product.metaTitle) : `${productName} - ${brandName}`;
      const metaDesc = product.metaDescription ? this.i18n.t(product.metaDescription) : productDesc.substring(0, 160);

      const catSlugEs = getCategorySlug(product.category, 'es');
      const catSlugEn = getCategorySlug(product.category, 'en');
      const productUrl = `/${lang}/${getCatalogSegment(lang)}/${getCategorySlug(product.category, lang)}/${product.slug[lang]}`;

      this.seo.setMetaTags({
        title: metaTitle,
        description: metaDesc,
        url: productUrl,
        image: product.images?.[0],
        type: 'product',
      });

      // NFR-011: hreflang
      this.seo.setHreflang(
        `/es/catalogo/${catSlugEs}/${product.slug.es}`,
        `/en/catalog/${catSlugEn}/${product.slug.en}`
      );

      // REQ-126: Product JSON-LD schema
      this.seo.setProductSchema({
        name: productName,
        description: metaDesc,
        brand: brandName,
        category: getCategoryLabel(product.category, lang),
        image: product.images?.[0],
        url: productUrl,
      });

      // Load related products
      try {
        const related = await this.api.getRelatedProducts(product._id);
        this.relatedProducts.set(related);
      } catch {
        // Non-critical
      }
    } catch (err) {
      // BUG-012: Differentiate between 404 (not found) and other errors (API down)
      if (err instanceof HttpErrorResponse && err.status === 404) {
        this.notFound.set(true);
      } else {
        this.error.set(true);
      }
    }
    this.loading.set(false);
  }

  async retry(): Promise<void> {
    if (this.currentSlug) {
      await this.loadProduct(this.currentSlug);
    }
  }

  ngOnDestroy(): void {
    this.seo.clearDynamicTags();
  }
}
