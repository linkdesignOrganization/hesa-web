import { Component, inject, signal, OnInit, AfterViewInit, OnDestroy, ElementRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CategoryBlockComponent } from '../../components/category-block/category-block.component';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { ValueStatComponent } from '../../components/value-stat/value-stat.component';
import { BrandLogosRowComponent } from '../../components/brand-logos-row/brand-logos-row.component';
import { ManufacturerCtaComponent } from '../../components/manufacturer-cta/manufacturer-cta.component';
import { MockDataService, Product, Brand } from '../../../shared/services/mock-data.service';
import { I18nService } from '../../../shared/services/i18n.service';
import { SeoService } from '../../../shared/services/seo.service';
import { initFadeInObserver } from '../../../shared/utils/fade-in-observer';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterLink,
    CategoryBlockComponent,
    ProductCardComponent,
    ValueStatComponent,
    BrandLogosRowComponent,
    ManufacturerCtaComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  private mockData = inject(MockDataService);
  i18n = inject(I18nService);
  private seo = inject(SeoService);
  private el = inject(ElementRef);
  private fadeObserver: IntersectionObserver | null = null;

  featuredProducts = signal<Product[]>([]);
  featuredBrands = signal<Brand[]>([]);
  heroLoading = signal(true);
  productsLoading = signal(true);
  brandsLoading = signal(true);
  heroError = signal(false);
  productsError = signal(false);
  brandsError = signal(false);

  hero = this.mockData.getHero();

  stats = [
    { number: '37', suffix: '+', label: { es: 'Anos de experiencia en el sector veterinario', en: 'Years of experience in the veterinary sector' } },
    { number: '100', suffix: '%', label: { es: 'Cobertura nacional con agentes propios', en: 'National coverage with own agents' } },
    { number: '50', suffix: '+', label: { es: 'Colaboradores dedicados al sector veterinario', en: 'Collaborators dedicated to the veterinary sector' } },
    { number: '20', suffix: '+', label: { es: 'Marcas internacionales de primer nivel', en: 'Top international brands' } }
  ];

  currentSlide = signal(0);

  async ngOnInit(): Promise<void> {
    // NFR-006/NFR-008: Home page SEO
    const lang = this.i18n.currentLang();
    this.seo.setMetaTags({
      title: lang === 'es' ? 'Inicio' : 'Home',
      description: lang === 'es'
        ? 'HESA - Importacion y distribucion de farmacos veterinarios, alimentos para animales y equipos veterinarios en Costa Rica.'
        : 'HESA - Import and distribution of veterinary pharmaceuticals, animal food, and veterinary equipment in Costa Rica.',
      url: `/${lang}`,
    });
    this.seo.setHreflang('/es', '/en');
    this.seo.setOrganizationSchema();

    // Simulate independent section loading
    setTimeout(() => this.heroLoading.set(false), 600);

    try {
      const products = await this.mockData.getFeaturedProducts();
      this.featuredProducts.set(products);
    } catch {
      this.productsError.set(true);
    }
    this.productsLoading.set(false);

    try {
      const brands = await this.mockData.getFeaturedBrands();
      this.featuredBrands.set(brands);
    } catch {
      this.brandsError.set(true);
    }
    this.brandsLoading.set(false);
  }

  private readonly PRODUCTS_PER_SLIDE = 6;

  nextSlide(): void {
    const maxSlides = Math.ceil(this.featuredProducts().length / this.PRODUCTS_PER_SLIDE);
    this.currentSlide.update(c => Math.min(c + 1, maxSlides - 1));
  }

  prevSlide(): void {
    this.currentSlide.update(c => Math.max(c - 1, 0));
  }

  get carouselDots(): number[] {
    const maxSlides = Math.ceil(this.featuredProducts().length / this.PRODUCTS_PER_SLIDE);
    return Array.from({ length: maxSlides }, (_, i) => i);
  }

  ngAfterViewInit(): void {
    if (typeof window === 'undefined') return;
    setTimeout(() => {
      this.fadeObserver = initFadeInObserver(this.el);
    }, 500);
  }

  ngOnDestroy(): void {
    this.fadeObserver?.disconnect();
  }
}
