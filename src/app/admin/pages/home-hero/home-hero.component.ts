import { Component, inject, signal, OnInit } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, ApiHeroSlide, ApiHomeConfig, ApiProduct } from '../../../shared/services/api.service';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
  selector: 'app-admin-home-hero',
  standalone: true,
  imports: [FormsModule, NgTemplateOutlet],
  templateUrl: './home-hero.component.html',
  styleUrl: './home-hero.component.scss'
})
export class AdminHomeHeroComponent implements OnInit {
  private api = inject(ApiService);
  private toast = inject(ToastService);

  // Page state
  loading = signal(true);
  saving = signal(false);
  error = signal(false);
  uploadingImage = signal(false);

  // Hero data
  heroMode = signal<'single' | 'carousel'>('single'); // what's in production
  viewingMode = signal<'single' | 'carousel'>('single'); // what's being viewed/edited
  slides = signal<ApiHeroSlide[]>([]);

  // UI state
  activeLang = signal<'es' | 'en'>('es');
  activeSlideIndex = signal(0);
  expandedSlides = signal<Set<number>>(new Set([0]));

  // Product modal
  showProductModal = signal(false);
  productSearchTerm = signal('');
  productSearchResults = signal<ApiProduct[]>([]);
  selectedProductForSlide = signal<number>(-1);
  loadingProducts = signal(false);

  private allProducts: ApiProduct[] = [];

  async ngOnInit(): Promise<void> {
    await this.loadConfig();
  }

  async loadConfig(): Promise<void> {
    this.loading.set(true);
    this.error.set(false);
    try {
      const config = await this.api.adminGetHomeConfig();
      this.heroMode.set(config.hero.mode || 'single');
      this.viewingMode.set(config.hero.mode || 'single');
      const loadedSlides = config.hero.slides && config.hero.slides.length > 0
        ? config.hero.slides
        : [this.createEmptySlide()];
      this.slides.set(loadedSlides);
      this.activeSlideIndex.set(0);
      this.expandedSlides.set(new Set([0]));
    } catch {
      this.error.set(true);
    }
    this.loading.set(false);
  }

  createEmptySlide(): ApiHeroSlide {
    return {
      tag: { es: '', en: '' },
      headline: { es: '', en: '' },
      subtitle: { es: '', en: '' },
      ctaText: { es: '', en: '' },
      ctaLink: '',
      product: null,
      tagsEs: [],
      tagsEn: [],
      imageDesktop: '',
      imageMobile: '',
    };
  }

  /** Navigate to view/edit a mode's form (does NOT save) */
  viewMode(mode: 'single' | 'carousel'): void {
    this.viewingMode.set(mode);
  }

  /** Activate a mode via toggle — saves mode to production */
  async activateMode(mode: 'single' | 'carousel'): Promise<void> {
    this.heroMode.set(mode);
    this.viewingMode.set(mode);
    // Save only the mode change with current slides (don't delete any)
    this.saving.set(true);
    try {
      const slidesData = this.slides().map(slide => ({
        ...slide,
        product: slide.product && typeof slide.product === 'object' && '_id' in slide.product
          ? (slide.product as ApiProduct)._id
          : slide.product,
      }));
      await this.api.adminUpdateHero({
        mode,
        slides: slidesData,
      });
      this.toast.success(mode === 'single' ? 'Portada simple activada' : 'Carrusel activado');
    } catch {
      this.toast.error('Error al activar el modo');
    }
    this.saving.set(false);
  }

  addSlide(): void {
    const current = this.slides();
    if (current.length >= 4) return;
    const newIndex = current.length;
    this.slides.set([...current, this.createEmptySlide()]);
    this.expandedSlides.update(set => {
      const next = new Set(set);
      next.add(newIndex);
      return next;
    });
  }

  removeSlide(index: number): void {
    const current = this.slides();
    if (current.length <= 1) return;
    const updated = current.filter((_, i) => i !== index);
    this.slides.set(updated);
    // Update expanded slides
    this.expandedSlides.set(new Set([0]));
    if (this.activeSlideIndex() >= updated.length) {
      this.activeSlideIndex.set(updated.length - 1);
    }
  }

  toggleSlideExpand(index: number): void {
    this.expandedSlides.update(set => {
      const next = new Set(set);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  }

  isSlideExpanded(index: number): boolean {
    return this.expandedSlides().has(index);
  }

  async save(): Promise<void> {
    this.saving.set(true);
    try {
      const slidesData = this.slides().map(slide => ({
        ...slide,
        product: slide.product && typeof slide.product === 'object' && '_id' in slide.product
          ? (slide.product as ApiProduct)._id
          : slide.product,
      }));
      // Save with the MODE that corresponds to the form being edited
      const config = await this.api.adminUpdateHero({
        mode: this.viewingMode(),
        slides: slidesData,
      });
      // Sync heroMode to what was just saved
      this.heroMode.set(this.viewingMode());
      // Reload slides from server response to stay in sync
      if (config.hero.slides && config.hero.slides.length > 0) {
        this.slides.set(config.hero.slides);
      }
      this.toast.success('Hero actualizado correctamente');
    } catch {
      this.toast.error('Error al guardar los cambios');
    }
    this.saving.set(false);
  }

  async uploadImage(slideIndex: number, imageType: 'desktop' | 'mobile', event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.uploadingImage.set(true);
    try {
      const config = await this.api.adminUploadHeroSlideImage(file, slideIndex, imageType);
      // Update the local slides with the new image
      if (config.hero.slides[slideIndex]) {
        const updated = [...this.slides()];
        if (imageType === 'desktop') {
          updated[slideIndex] = { ...updated[slideIndex], imageDesktop: config.hero.slides[slideIndex].imageDesktop };
        } else {
          updated[slideIndex] = { ...updated[slideIndex], imageMobile: config.hero.slides[slideIndex].imageMobile };
        }
        this.slides.set(updated);
      }
      this.toast.success(`Imagen ${imageType} actualizada`);
    } catch {
      this.toast.error('Error al subir la imagen');
    }
    this.uploadingImage.set(false);
    input.value = '';
  }

  // ── Product modal ──

  async openProductModal(slideIndex: number): Promise<void> {
    this.selectedProductForSlide.set(slideIndex);
    this.productSearchTerm.set('');
    this.productSearchResults.set([]);
    this.showProductModal.set(true);

    // Pre-load products if not cached
    if (this.allProducts.length === 0) {
      await this.loadAllProducts();
    }
    this.productSearchResults.set(this.allProducts.slice(0, 20));
  }

  private async loadAllProducts(): Promise<void> {
    this.loadingProducts.set(true);
    try {
      const result = await this.api.adminGetProducts({ limit: 200 });
      this.allProducts = result.data.filter(p => p.isActive);
    } catch {
      this.toast.error('Error al cargar productos');
    }
    this.loadingProducts.set(false);
  }

  searchProducts(term: string): void {
    this.productSearchTerm.set(term);
    if (!term.trim()) {
      this.productSearchResults.set(this.allProducts.slice(0, 20));
      return;
    }
    const lower = term.toLowerCase().trim();
    const filtered = this.allProducts.filter(p =>
      p.name.es.toLowerCase().includes(lower) ||
      p.name.en.toLowerCase().includes(lower)
    );
    this.productSearchResults.set(filtered);
  }

  selectProduct(product: ApiProduct): void {
    const slideIndex = this.selectedProductForSlide();
    if (slideIndex < 0) return;
    const updated = [...this.slides()];
    updated[slideIndex] = { ...updated[slideIndex], product };
    this.slides.set(updated);
    this.showProductModal.set(false);
  }

  removeProduct(slideIndex: number): void {
    const updated = [...this.slides()];
    updated[slideIndex] = { ...updated[slideIndex], product: null };
    this.slides.set(updated);
  }

  // ── Tags (ES and EN independent) ──

  addTagEs(slideIndex: number): void {
    const updated = [...this.slides()];
    const slide = updated[slideIndex];
    const current = slide.tagsEs || [];
    if (current.length >= 6) return;
    updated[slideIndex] = { ...slide, tagsEs: [...current, ''] };
    this.slides.set(updated);
  }

  removeTagEs(slideIndex: number, tagIndex: number): void {
    const updated = [...this.slides()];
    const slide = updated[slideIndex];
    const current = [...(slide.tagsEs || [])];
    current.splice(tagIndex, 1);
    updated[slideIndex] = { ...slide, tagsEs: current };
    this.slides.set(updated);
  }

  addTagEn(slideIndex: number): void {
    const updated = [...this.slides()];
    const slide = updated[slideIndex];
    const current = slide.tagsEn || [];
    if (current.length >= 6) return;
    updated[slideIndex] = { ...slide, tagsEn: [...current, ''] };
    this.slides.set(updated);
  }

  removeTagEn(slideIndex: number, tagIndex: number): void {
    const updated = [...this.slides()];
    const slide = updated[slideIndex];
    const current = [...(slide.tagsEn || [])];
    current.splice(tagIndex, 1);
    updated[slideIndex] = { ...slide, tagsEn: current };
    this.slides.set(updated);
  }

  // ── Helpers ──

  getProductName(product: ApiProduct | string | null | undefined): string {
    if (!product) return '';
    if (typeof product === 'string') return product;
    return product.name?.es || '';
  }

  getProductImage(product: ApiProduct | string | null | undefined): string {
    if (!product || typeof product === 'string') return '';
    return product.images?.[0] || '';
  }

  getProductBrand(product: ApiProduct | string | null | undefined): string {
    if (!product || typeof product === 'string') return '';
    return product.brand?.name || '';
  }

  isProductObject(product: ApiProduct | string | null | undefined): boolean {
    return !!product && typeof product === 'object';
  }
}
