import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BreadcrumbComponent } from '../../../shared/components/breadcrumb/breadcrumb.component';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { ApiService, ApiBrand, ApiProduct, FilterValues } from '../../../shared/services/api.service';
import { I18nService } from '../../../shared/services/i18n.service';
import { SeoService } from '../../../shared/services/seo.service';
import { getHomeLabel, getBrandsSegment } from '../../../shared/utils/route-helpers';

@Component({
  selector: 'app-brand-detail',
  standalone: true,
  imports: [RouterLink, BreadcrumbComponent, ProductCardComponent],
  templateUrl: './brand-detail.component.html',
  styleUrl: './brand-detail.component.scss'
})
export class BrandDetailComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private api = inject(ApiService);
  private seo = inject(SeoService);
  i18n = inject(I18nService);

  brand = signal<ApiBrand | null>(null);
  products = signal<ApiProduct[]>([]);
  loading = signal(true);
  notFound = signal(false);

  // REQ-152: Filters for brand products
  selectedCategory = signal('');
  selectedSpecies = signal('');
  filterValues = signal<FilterValues>({ brands: [], species: [], families: [], lifeStages: [], equipmentTypes: [] });
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
        this.seo.setHreflang(`/es/marcas/${slug}`, `/en/brands/${slug}`);
      } catch {
        this.notFound.set(true);
      }
    }
    this.loading.set(false);
  }

  ngOnDestroy(): void {
    this.seo.clearDynamicTags();
  }

  // REQ-152: Load brand products with filters
  private async loadProducts(): Promise<void> {
    try {
      const params: Record<string, string | number | undefined> = {};
      if (this.selectedCategory()) params['category'] = this.selectedCategory();
      if (this.selectedSpecies()) params['species'] = this.selectedSpecies();
      const productResult = await this.api.getBrandProducts(this.brandSlug, params);
      this.products.set(productResult.data);
    } catch {
      // Non-critical
    }
  }

  async applyFilter(key: string, value: string): Promise<void> {
    if (key === 'category') this.selectedCategory.set(value);
    if (key === 'species') this.selectedSpecies.set(value);
    await this.loadProducts();
  }

  async clearFilters(): Promise<void> {
    this.selectedCategory.set('');
    this.selectedSpecies.set('');
    await this.loadProducts();
  }

  get activeFilters(): { key: string; label: string }[] {
    const filters: { key: string; label: string }[] = [];
    if (this.selectedCategory()) filters.push({ key: 'category', label: this.selectedCategory() });
    if (this.selectedSpecies()) filters.push({ key: 'species', label: this.selectedSpecies() });
    return filters;
  }
}
