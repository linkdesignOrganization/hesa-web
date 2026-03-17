import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BreadcrumbComponent } from '../../../shared/components/breadcrumb/breadcrumb.component';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { MockDataService, Product } from '../../../shared/services/mock-data.service';
import { I18nService } from '../../../shared/services/i18n.service';
import { CrmTrackingService } from '../../../shared/services/crm-tracking.service';
import { getCategorySlug, getCategoryLabel, getCatalogSegment, getHomeLabel, getContactSegment } from '../../../shared/utils/route-helpers';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [RouterLink, BreadcrumbComponent, ProductCardComponent],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss'
})
export class ProductDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private mockData = inject(MockDataService);
  i18n = inject(I18nService);
  private crmTracking = inject(CrmTrackingService);

  product = signal<Product | null>(null);
  relatedProducts = signal<Product[]>([]);
  loading = signal(true);
  notFound = signal(false);
  selectedImage = signal(0);
  stickyVisible = signal(false);

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

  get whatsappLink(): string {
    const p = this.product();
    if (!p) return '#';
    const lang = this.i18n.currentLang();
    const msg = lang === 'es'
      ? `Hola, me interesa el producto ${p.name.es} de ${p.brand}. Me gustaria recibir informacion.`
      : `Hello, I am interested in the product ${p.name.en} by ${p.brand}. I would like to receive information.`;
    return `https://wa.me/50622609020?text=${encodeURIComponent(msg)}`;
  }

  async ngOnInit(): Promise<void> {
    const slug = this.route.snapshot.paramMap.get('slug');
    if (slug) {
      const product = await this.mockData.getProductBySlug(slug);
      if (product) {
        this.product.set(product);
        const related = this.mockData.getRelatedProducts(product);
        this.relatedProducts.set(related);
      } else {
        this.notFound.set(true);
      }
    }
    this.loading.set(false);

    // Sticky bar via Intersection Observer
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

  trackCTA(label: string): void {
    this.crmTracking.trackCTA(label);
  }
}
