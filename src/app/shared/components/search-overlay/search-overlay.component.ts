import { Component, input, output, signal, inject, ElementRef, ViewChild, effect } from '@angular/core';
import { Router } from '@angular/router';
import { MockDataService, Product, Brand } from '../../services/mock-data.service';
import { I18nService } from '../../services/i18n.service';
import { getCategorySlug, getCatalogSegment, getBrandsSegment, getSearchSegment } from '../../utils/route-helpers';

@Component({
  selector: 'app-search-overlay',
  standalone: true,
  templateUrl: './search-overlay.component.html',
  styleUrl: './search-overlay.component.scss'
})
export class SearchOverlayComponent {
  isOpen = input(false);
  closeOverlay = output<void>();

  searchTerm = signal('');
  productResults = signal<Product[]>([]);
  brandResults = signal<Brand[]>([]);
  selectedIndex = signal(-1);

  private router = inject(Router);
  private mockData = inject(MockDataService);
  i18n = inject(I18nService);

  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  constructor() {
    effect(() => {
      if (this.isOpen() && this.searchInput) {
        setTimeout(() => this.searchInput?.nativeElement?.focus(), 100);
      }
    });
  }

  onInput(event: Event): void {
    const rawValue = (event.target as HTMLInputElement).value;
    // Sanitize: limit length, strip control characters
    // eslint-disable-next-line no-control-regex
    const value = rawValue.substring(0, 100).replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
    this.searchTerm.set(value);
    this.selectedIndex.set(-1);

    if (value.length >= 3) {
      this.productResults.set(this.mockData.searchProducts(value));
      this.brandResults.set(this.mockData.searchBrands(value));
    } else {
      this.productResults.set([]);
      this.brandResults.set([]);
    }
  }

  onKeydown(event: KeyboardEvent): void {
    const totalResults = this.productResults().length + this.brandResults().length;

    if (event.key === 'Escape') {
      this.close();
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.selectedIndex.update(i => Math.min(i + 1, totalResults - 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.selectedIndex.update(i => Math.max(i - 1, -1));
    } else if (event.key === 'Enter') {
      const idx = this.selectedIndex();
      if (idx >= 0) {
        if (idx < this.productResults().length) {
          this.navigateToProduct(this.productResults()[idx]);
        } else {
          this.navigateToBrand(this.brandResults()[idx - this.productResults().length]);
        }
      } else if (this.searchTerm().length >= 3) {
        this.navigateToSearchResults();
      }
    }
  }

  navigateToProduct(product: Product): void {
    const lang = this.i18n.currentLang();
    this.router.navigate(['/' + lang, getCatalogSegment(lang), getCategorySlug(product.category, lang), product.slug[lang]]);
    this.close();
  }

  navigateToBrand(brand: Brand): void {
    const lang = this.i18n.currentLang();
    this.router.navigate(['/' + lang, getBrandsSegment(lang), brand.slug]);
    this.close();
  }

  navigateToSearchResults(): void {
    const lang = this.i18n.currentLang();
    this.router.navigate(['/' + lang, getSearchSegment(lang)], { queryParams: { q: this.searchTerm() } });
    this.close();
  }

  navigateToCatalog(): void {
    const lang = this.i18n.currentLang();
    this.router.navigate(['/' + lang, getCatalogSegment(lang)]);
    this.close();
  }

  close(): void {
    this.searchTerm.set('');
    this.productResults.set([]);
    this.brandResults.set([]);
    this.selectedIndex.set(-1);
    this.closeOverlay.emit();
  }

  getProductName(product: Product): string {
    return this.i18n.t(product.name);
  }

  get hasResults(): boolean {
    return this.productResults().length > 0 || this.brandResults().length > 0;
  }

  get showNoResults(): boolean {
    return this.searchTerm().length >= 3 && !this.hasResults;
  }

  get showHint(): boolean {
    return this.searchTerm().length < 3;
  }
}
