import { Component, signal, inject, OnDestroy, OnInit, HostListener, ElementRef } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LanguageSelectorComponent } from '../language-selector/language-selector.component';
import { SearchOverlayComponent } from '../search-overlay/search-overlay.component';
import { ApiProduct, ApiService, FilterValues } from '../../services/api.service';
import { I18nService } from '../../services/i18n.service';
import { buildProductUrl, getBrandsSegment, getClientsSegment, getPartnersSegment } from '../../utils/route-helpers';

interface LocalizedText {
  es: string;
  en: string;
}

type MegaCategory = 'farmacos' | 'alimentos' | 'equipos';

interface MegaFeaturedCard {
  name: LocalizedText;
  brand: string;
  image: string;
  brandLogo?: string;
  category: MegaCategory;
  meta: LocalizedText[];
  href: string;
}

interface MegaBrandLink {
  name: string;
  slug: string;
}

interface MegaFilterOption {
  label: LocalizedText;
  value: string;
}

interface MegaFilterGroup {
  title: LocalizedText;
  queryParam: 'species' | 'family' | 'lifeStage' | 'equipmentType';
  options: MegaFilterOption[];
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, LanguageSelectorComponent, SearchOverlayComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit, OnDestroy {
  private elementRef = inject(ElementRef<HTMLElement>);
  private api = inject(ApiService);
  i18n = inject(I18nService);
  isScrolled = signal(false);
  isMobileMenuOpen = signal(false);
  isSubmenuOpen = signal(false);
  isSearchOpen = signal(false);
  isAboutMenuOpen = signal(false);

  /** Which mega menu is currently open (null = none) */
  activeMega = signal<MegaCategory | null>(null);

  readonly megaCategories: MegaCategory[] = ['farmacos', 'alimentos', 'equipos'];

  private readonly emptyFilters: FilterValues = {
    brands: [],
    species: [],
    families: [],
    lifeStages: [],
    equipmentTypes: [],
  };

  readonly categoryIcons: Record<MegaCategory, string> = {
    farmacos: 'pill',
    alimentos: 'pets',
    equipos: 'biotech'
  };
  readonly megaFilterValues = signal<Record<MegaCategory, FilterValues>>({
    farmacos: this.emptyFilters,
    alimentos: this.emptyFilters,
    equipos: this.emptyFilters,
  });
  readonly megaFeaturedProducts = signal<Record<MegaCategory, MegaFeaturedCard[]>>({
    farmacos: [],
    alimentos: [],
    equipos: [],
  });

  private onScroll = (): void => {
    this.isScrolled.set(window.scrollY > 50);
  };

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', this.onScroll, { passive: true });
    }
  }

  async ngOnInit(): Promise<void> {
    await Promise.all([this.loadMegaFilters(), this.loadMegaFeaturedProducts()]);
  }

  ngOnDestroy(): void {
    if (typeof window !== 'undefined') {
      window.removeEventListener('scroll', this.onScroll);
    }
  }

  toggleMega(category: MegaCategory): void {
    this.isAboutMenuOpen.set(false);
    this.activeMega.update(current => current === category ? null : category);
  }

  closeMega(): void {
    this.activeMega.set(null);
  }

  toggleAboutMenu(): void {
    this.closeMega();
    this.isAboutMenuOpen.update(value => !value);
  }

  closeAboutMenu(): void {
    this.isAboutMenuOpen.set(false);
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen.update(v => !v);
    if (this.isMobileMenuOpen()) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen.set(false);
    document.body.style.overflow = '';
  }

  toggleSubmenu(): void {
    this.isSubmenuOpen.update(v => !v);
  }

  openSearch(): void {
    this.isSearchOpen.set(true);
  }

  closeSearch(): void {
    this.isSearchOpen.set(false);
  }

  t(text: LocalizedText): string {
    return this.i18n.t(text);
  }

  getCategoryRoute(category: MegaCategory): string {
    const routeMap: Record<MegaCategory, LocalizedText> = {
      farmacos: { es: '/es/catalogo/farmacos', en: '/en/catalog/pharmaceuticals' },
      alimentos: { es: '/es/catalogo/alimentos', en: '/en/catalog/food' },
      equipos: { es: '/es/catalogo/equipos', en: '/en/catalog/equipment' }
    };

    return this.i18n.t(routeMap[category]);
  }

  getCategoryLabel(category: MegaCategory): string {
    const labels: Record<MegaCategory, LocalizedText> = {
      farmacos: { es: 'Farmacos', en: 'Pharmaceuticals' },
      alimentos: { es: 'Alimentos', en: 'Food' },
      equipos: { es: 'Equipos', en: 'Equipment' }
    };

    return this.i18n.t(labels[category]);
  }

  getBrandRoute(slug: string): string {
    const lang = this.i18n.currentLang();
    return `/${lang}/${getBrandsSegment(lang)}/${slug}`;
  }

  getAboutRoute(): string {
    const lang = this.i18n.currentLang();
    return `${this.i18n.getLangPrefix()}/${lang === 'es' ? 'nosotros' : 'about'}`;
  }

  getPartnersRoute(): string {
    const lang = this.i18n.currentLang();
    return `/${lang}/${getPartnersSegment(lang)}`;
  }

  getClientsRoute(): string {
    const lang = this.i18n.currentLang();
    return `/${lang}/${getClientsSegment(lang)}`;
  }

  getAboutMenuItems(): Array<{ label: string; route: string }> {
    const lang = this.i18n.currentLang();
    return [
      { label: lang === 'es' ? 'Sobre HESA' : 'About HESA', route: this.getAboutRoute() },
      { label: 'Partners', route: this.getPartnersRoute() },
      { label: lang === 'es' ? 'Clientes' : 'Clients', route: this.getClientsRoute() },
      { label: lang === 'es' ? 'Marcas' : 'Brands', route: `/${lang}/${getBrandsSegment(lang)}` },
    ];
  }

  onSubmenuKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.isSubmenuOpen.update(v => !v);
    } else if (event.key === 'Escape') {
      this.isSubmenuOpen.set(false);
    }
  }

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    if (this.isMobileMenuOpen()) {
      this.closeMobileMenu();
    }
    if (this.isSearchOpen()) {
      this.closeSearch();
    }
    if (this.activeMega()) {
      this.activeMega.set(null);
    }
    if (this.isAboutMenuOpen()) {
      this.isAboutMenuOpen.set(false);
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target;
    if (!(target instanceof Node)) return;

    if (!this.elementRef.nativeElement.contains(target)) {
      this.closeMega();
      this.closeAboutMenu();
    }
  }

  getMegaFilterGroups(category: MegaCategory): MegaFilterGroup[] {
    const values = this.megaFilterValues()[category] || this.emptyFilters;

    const toOptions = (items: Array<{ es: string; en: string }> = []): MegaFilterOption[] =>
      items.map(item => ({
        label: { es: item.es, en: item.en },
        value: item.es,
      }));

    if (category === 'farmacos') {
      return [
        {
          title: { es: 'Por especie', en: 'By species' },
          queryParam: 'species' as const,
          options: toOptions(values.species),
        },
        {
          title: { es: 'Por tipo', en: 'By type' },
          queryParam: 'family' as const,
          options: toOptions(values.families),
        },
      ].filter(group => group.options.length > 0);
    }

    if (category === 'alimentos') {
      return [
        {
          title: { es: 'Por especie', en: 'By species' },
          queryParam: 'species' as const,
          options: toOptions(values.species),
        },
        {
          title: { es: 'Por tipo', en: 'By type' },
          queryParam: 'lifeStage' as const,
          options: toOptions(values.lifeStages),
        },
      ].filter(group => group.options.length > 0);
    }

    return [
      {
        title: { es: 'Por tipo', en: 'By type' },
        queryParam: 'equipmentType' as const,
        options: toOptions(values.equipmentTypes),
      },
    ].filter(group => group.options.length > 0);
  }

  getMegaBrandColumns(category: MegaCategory): MegaBrandLink[][] {
    const links = (this.megaFilterValues()[category]?.brands || []).map(brand => ({
      name: brand.name,
      slug: brand.slug,
    }));

    return this.chunkArray(links, 6);
  }

  getMegaFeaturedCards(category: MegaCategory): MegaFeaturedCard[] {
    return this.megaFeaturedProducts()[category] || [];
  }

  getMegaFilterRoute(category: MegaCategory): string {
    return this.getCategoryRoute(category);
  }

  getMegaFilterQuery(queryParam: MegaFilterGroup['queryParam'], value: string): Record<string, string> {
    return { [queryParam]: value };
  }

  closeHeaderMenus(): void {
    this.closeMega();
    this.closeAboutMenu();
  }

  private async loadMegaFilters(): Promise<void> {
    try {
      const results = await Promise.all(
        this.megaCategories.map(async category => [category, await this.api.getFilterValues(category)] as const)
      );

      const nextState = { ...this.megaFilterValues() };
      for (const [category, values] of results) {
        nextState[category] = values;
      }
      this.megaFilterValues.set(nextState);
    } catch {
      // Keep header functional even if dynamic menu data fails to load.
    }
  }

  private async loadMegaFeaturedProducts(): Promise<void> {
    try {
      const homeData = await this.api.getHomeData();
      const nextState: Record<MegaCategory, MegaFeaturedCard[]> = {
        farmacos: [],
        alimentos: [],
        equipos: [],
      };

      for (const category of this.megaCategories) {
        const pool = homeData.featuredProducts.filter(product => product.category === category);
        nextState[category] = this.shuffle(pool)
          .slice(0, 2)
          .map(product => this.toMegaFeaturedCard(product));
      }

      this.megaFeaturedProducts.set(nextState);
    } catch {
      // Keep header functional if featured products cannot be loaded.
    }
  }

  private toMegaFeaturedCard(product: ApiProduct): MegaFeaturedCard {
    return {
      name: product.name,
      brand: product.brand?.name || '',
      image: product.images?.[0] || '',
      brandLogo: product.brand?.logo,
      category: product.category,
      meta: this.getProductMeta(product),
      href: buildProductUrl(product.category, product.slug[this.i18n.currentLang()], this.i18n.currentLang()),
    };
  }

  private getProductMeta(product: ApiProduct): LocalizedText[] {
    const same = (value: string): LocalizedText => ({ es: value, en: value });
    const species = product.species?.length ? same(product.species.slice(0, 2).join(' · ')) : null;
    const family = product.family ? same(product.family) : null;
    const lifeStage = product.lifeStage ? same(product.lifeStage) : null;
    const equipmentType = product.equipmentType ? same(product.equipmentType) : null;
    const presentation = product.presentations?.length ? same(product.presentations[0]) : null;

    const metaByCategory: Record<MegaCategory, Array<LocalizedText | null>> = {
      farmacos: [species, family, presentation],
      alimentos: [species, lifeStage, presentation],
      equipos: [equipmentType, presentation, species],
    };

    return metaByCategory[product.category].filter(Boolean).slice(0, 2) as LocalizedText[];
  }

  private chunkArray<T>(items: T[], size: number): T[][] {
    if (items.length === 0) return [];
    const chunks: T[][] = [];
    for (let index = 0; index < items.length; index += size) {
      chunks.push(items.slice(index, index + size));
    }
    return chunks;
  }

  private shuffle<T>(items: T[]): T[] {
    const next = [...items];
    for (let index = next.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
    }
    return next;
  }
}
