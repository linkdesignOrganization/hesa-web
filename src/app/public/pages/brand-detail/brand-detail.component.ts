import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { BreadcrumbComponent } from '../../../shared/components/breadcrumb/breadcrumb.component';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { ApiService, ApiBrand, ApiProduct } from '../../../shared/services/api.service';
import { I18nService } from '../../../shared/services/i18n.service';
import { SeoService } from '../../../shared/services/seo.service';
import { getCategoryLabel, getHomeLabel, getBrandsSegment } from '../../../shared/utils/route-helpers';

type ProductCategoryKey = 'farmacos' | 'alimentos' | 'equipos';

@Component({
  selector: 'app-brand-detail',
  standalone: true,
  imports: [RouterLink, BreadcrumbComponent, ProductCardComponent],
  templateUrl: './brand-detail.component.html',
  styleUrl: './brand-detail.component.scss'
})
export class BrandDetailComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private api = inject(ApiService);
  private seo = inject(SeoService);
  i18n = inject(I18nService);

  brand = signal<ApiBrand | null>(null);
  products = signal<ApiProduct[]>([]);
  loading = signal(true);
  notFound = signal(false);
  error = signal(false); // BUG-013: Separate error state from notFound

  private brandSlug = '';

  get breadcrumbs() {
    const b = this.brand();
    const lang = this.i18n.currentLang();
    return [
      { label: getHomeLabel(lang), url: this.i18n.getLangPrefix() },
      { label: lang === 'es' ? 'Marcas' : 'Brands', url: this.i18n.getLangPrefix() + '/' + getBrandsSegment(lang) },
      { label: b?.name || '' }
    ];
  }

  async ngOnInit(): Promise<void> {
    const slug = this.route.snapshot.paramMap.get('slug');
    if (slug) {
      this.brandSlug = slug;

      // BUG-013: Set hreflang BEFORE API call to preserve language context
      this.seo.setHreflang(`/es/marcas/${slug}`, `/en/brands/${slug}`);

      try {
        const brand = await this.api.getBrandBySlug(slug);
        this.brand.set(brand);
        await this.loadProducts();

        // SEO meta tags
        const lang = this.i18n.currentLang();
        this.seo.setMetaTags({
          title: brand.name,
          description: this.i18n.t(brand.description) || `${brand.name} - ${lang === 'es' ? 'Productos distribuidos por HESA' : 'Products distributed by HESA'}`,
          url: `/${lang}/${getBrandsSegment(lang)}/${slug}`,
          image: brand.logo,
        });
      } catch (err) {
        // BUG-013: Differentiate between 404 (not found) and other errors (API down)
        if (err instanceof HttpErrorResponse && err.status === 404) {
          this.notFound.set(true);
        } else {
          this.error.set(true);
        }
      }
    }
    this.loading.set(false);
  }

  ngOnDestroy(): void {
    this.seo.clearDynamicTags();
  }

  private async loadProducts(): Promise<void> {
    try {
      const params: Record<string, string | number | undefined> = {
        limit: 100,
      };

      const firstPage = await this.api.getBrandProducts(this.brandSlug, params);

      if (firstPage.totalPages <= 1) {
        this.products.set(firstPage.data);
        return;
      }

      const remainingPages = await Promise.all(
        Array.from({ length: firstPage.totalPages - 1 }, (_, index) =>
          this.api.getBrandProducts(this.brandSlug, {
            ...params,
            page: index + 2,
          })
        )
      );

      this.products.set([firstPage, ...remainingPages].flatMap(page => page.data));
    } catch {
      // Non-critical
    }
  }

  async retryLoad(): Promise<void> {
    if (this.brandSlug) {
      this.loading.set(true);
      this.error.set(false);
      this.notFound.set(false);
      try {
        const brand = await this.api.getBrandBySlug(this.brandSlug);
        this.brand.set(brand);
        await this.loadProducts();

        const lang = this.i18n.currentLang();
        this.seo.setMetaTags({
          title: brand.name,
          description: this.i18n.t(brand.description) || `${brand.name} - ${lang === 'es' ? 'Productos distribuidos por HESA' : 'Products distributed by HESA'}`,
          url: `/${lang}/${getBrandsSegment(lang)}/${this.brandSlug}`,
          image: brand.logo,
        });
      } catch (err) {
        if (err instanceof HttpErrorResponse && err.status === 404) {
          this.notFound.set(true);
        } else {
          this.error.set(true);
        }
      }
      this.loading.set(false);
    }
  }

  get brandCategoryLabels(): string[] {
    const categories = this.brand()?.categories ?? [];
    return categories
      .map(category => this.normalizeCategory(category))
      .filter((category): category is ProductCategoryKey => !!category)
      .map(category => getCategoryLabel(category, this.i18n.currentLang()));
  }

  get brandThemeClass(): string {
    const brand = this.brand();
    const categories = brand?.categories ?? [];

    if (categories.some(category => this.normalizeCategory(category) === 'farmacos')) {
      return 'brand-catalog--pharma';
    }

    if (categories.some(category => this.normalizeCategory(category) === 'alimentos')) {
      return 'brand-catalog--food';
    }

    if (categories.some(category => this.normalizeCategory(category) === 'equipos')) {
      return 'brand-catalog--equipment';
    }

    return '';
  }

  private normalizeCategory(category: string): ProductCategoryKey | null {
    const normalized = category.trim().toLowerCase();
    if (['farmacos', 'pharmaceuticals'].includes(normalized)) return 'farmacos';
    if (['alimentos', 'food'].includes(normalized)) return 'alimentos';
    if (['equipos', 'equipment'].includes(normalized)) return 'equipos';
    return null;
  }
}
