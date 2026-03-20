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
  singleSlide = signal<ApiHeroSlide>(this.createEmptySlide()); // portada simple data
  slides = signal<ApiHeroSlide[]>([]); // carousel slides data

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
      // Load single slide data
      this.singleSlide.set(config.hero.single || this.createEmptySlide());
      // Load carousel slides
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

  /** Activate a mode via toggle — only changes which mode is active */
  async activateMode(mode: 'single' | 'carousel'): Promise<void> {
    this.heroMode.set(mode);
    this.viewingMode.set(mode);
    this.saving.set(true);
    try {
      // Send mode change with the target's own data
      const payload: any = { mode, target: mode };
      if (mode === 'single') {
        const s = this.singleSlide();
        payload.single = { ...s, product: this.serializeProduct(s.product) };
      } else {
        payload.slides = this.slides().map(slide => ({
          ...slide,
          product: this.serializeProduct(slide.product),
        }));
      }
      await this.api.adminUpdateHero(payload);
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

  private serializeProduct(product: any): string | null {
    if (!product) return null;
    if (typeof product === 'object' && '_id' in product) return product._id;
    if (typeof product === 'string') return product;
    return null;
  }

  async save(): Promise<void> {
    this.saving.set(true);
    try {
      const target = this.viewingMode();
      const payload: any = { mode: this.heroMode(), target };

      if (target === 'single') {
        const s = this.singleSlide();
        payload.single = { ...s, product: this.serializeProduct(s.product) };
      } else {
        payload.slides = this.slides().map(slide => ({
          ...slide,
          product: this.serializeProduct(slide.product),
        }));
      }

      const config = await this.api.adminUpdateHero(payload);
      // Reload from server
      if (config.hero.single) this.singleSlide.set(config.hero.single);
      if (config.hero.slides?.length) this.slides.set(config.hero.slides);
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
      const target = this.viewingMode();
      const config = await this.api.adminUploadHeroSlideImage(file, slideIndex, imageType, target);
      // Update local data with new image
      if (target === 'single' && config.hero.single) {
        this.singleSlide.set(config.hero.single);
      } else if (config.hero.slides[slideIndex]) {
        const updated = [...this.slides()];
        if (imageType === 'desktop') {
          updated[slideIndex] = { ...updated[slideIndex], imageDesktop: config.hero.slides[slideIndex].imageDesktop };
        } else {
          updated[slideIndex] = { ...updated[slideIndex], imageMobile: config.hero.slides[slideIndex].imageMobile };
        }
        this.slides.set(updated);
      }
      this.toast.success(`Imagen ${imageType} actualizada`);
    } catch (error: any) {
      const message = error?.error?.error || 'Error al subir la imagen';
      this.toast.error(message);
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
    const slide = this.getSlide(slideIndex);
    this.setSlide(slideIndex, { ...slide, product });
    this.showProductModal.set(false);
  }

  removeProduct(slideIndex: number): void {
    const slide = this.getSlide(slideIndex);
    this.setSlide(slideIndex, { ...slide, product: null });
  }

  // ── Tags (ES and EN independent) ──

  private getSlide(index: number): ApiHeroSlide {
    return this.viewingMode() === 'single' ? this.singleSlide() : this.slides()[index];
  }

  private setSlide(index: number, slide: ApiHeroSlide): void {
    if (this.viewingMode() === 'single') {
      this.singleSlide.set(slide);
    } else {
      const updated = [...this.slides()];
      updated[index] = slide;
      this.slides.set(updated);
    }
  }

  addTagEs(slideIndex: number): void {
    const slide = this.getSlide(slideIndex);
    const current = slide.tagsEs || [];
    if (current.length >= 6) return;
    this.setSlide(slideIndex, { ...slide, tagsEs: [...current, ''] });
  }

  removeTagEs(slideIndex: number, tagIndex: number): void {
    const slide = this.getSlide(slideIndex);
    const current = [...(slide.tagsEs || [])];
    current.splice(tagIndex, 1);
    this.setSlide(slideIndex, { ...slide, tagsEs: current });
  }

  addTagEn(slideIndex: number): void {
    const slide = this.getSlide(slideIndex);
    const current = slide.tagsEn || [];
    if (current.length >= 6) return;
    this.setSlide(slideIndex, { ...slide, tagsEn: [...current, ''] });
  }

  removeTagEn(slideIndex: number, tagIndex: number): void {
    const slide = this.getSlide(slideIndex);
    const current = [...(slide.tagsEn || [])];
    current.splice(tagIndex, 1);
    this.setSlide(slideIndex, { ...slide, tagsEn: current });
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
