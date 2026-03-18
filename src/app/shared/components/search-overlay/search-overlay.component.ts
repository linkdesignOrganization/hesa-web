import { Component, input, output, signal, inject, ElementRef, ViewChild, effect } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService, SearchResults } from '../../services/api.service';
import { I18nService } from '../../services/i18n.service';
import { getCategorySlug, getCatalogSegment, getBrandsSegment, getSearchSegment } from '../../utils/route-helpers';

interface SearchProduct {
  id: string;
  name: { es: string; en: string };
  slug: { es: string; en: string };
  brand: string;
  category: string;
  image?: string;
}

interface SearchBrand {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  country: string;
}

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
  productResults = signal<SearchProduct[]>([]);
  brandResults = signal<SearchBrand[]>([]);
  selectedIndex = signal(-1);
  isSearching = signal(false);

  private router = inject(Router);
  private api = inject(ApiService);
  i18n = inject(I18nService);

  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  constructor() {
    effect(() => {
      if (this.isOpen() && this.searchInput) {
        setTimeout(() => this.searchInput?.nativeElement?.focus(), 100);
      }
    });
  }

  private searchDebounceTimer: ReturnType<typeof setTimeout> | null = null;

  onInput(event: Event): void {
    const rawValue = (event.target as HTMLInputElement).value;
    // eslint-disable-next-line no-control-regex
    const value = rawValue.substring(0, 100).replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
    this.searchTerm.set(value);
    this.selectedIndex.set(-1);

    if (this.searchDebounceTimer) {
      clearTimeout(this.searchDebounceTimer);
    }

    if (value.length >= 3) {
      this.isSearching.set(true);
      this.productResults.set([]);
      this.brandResults.set([]);
      this.searchDebounceTimer = setTimeout(async () => {
        try {
          const results = await this.api.search(value, this.i18n.currentLang());
          this.productResults.set(results.products);
          this.brandResults.set(results.brands);
        } catch {
          console.error('Search failed');
        } finally {
          this.isSearching.set(false);
        }
      }, 300);
    } else {
      this.isSearching.set(false);
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

  navigateToProduct(product: SearchProduct): void {
    const lang = this.i18n.currentLang();
    this.router.navigate(['/' + lang, getCatalogSegment(lang), getCategorySlug(product.category, lang), product.slug[lang]]);
    this.close();
  }

  navigateToBrand(brand: SearchBrand): void {
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
    if (this.searchDebounceTimer) {
      clearTimeout(this.searchDebounceTimer);
      this.searchDebounceTimer = null;
    }
    this.searchTerm.set('');
    this.productResults.set([]);
    this.brandResults.set([]);
    this.selectedIndex.set(-1);
    this.isSearching.set(false);
    this.closeOverlay.emit();
  }

  getProductName(product: SearchProduct): string {
    return this.i18n.t(product.name);
  }

  get hasResults(): boolean {
    return this.productResults().length > 0 || this.brandResults().length > 0;
  }

  get showNoResults(): boolean {
    return this.searchTerm().length >= 3 && !this.hasResults && !this.isSearching();
  }

  get showHint(): boolean {
    return this.searchTerm().length < 3;
  }

  /** NFR-002: Convert image URL to WebP variant for <picture> <source> */
  toWebP(url: string): string {
    return url.replace(/\.(jpe?g|png)$/i, '.webp');
  }
}
