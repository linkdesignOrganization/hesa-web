import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiProduct {
  _id: string;
  slug: { es: string; en: string };
  name: { es: string; en: string };
  brand: {
    _id: string;
    name: string;
    slug: string;
    logo?: string;
    country?: string;
    categories?: string[];
  };
  category: 'farmacos' | 'alimentos' | 'equipos';
  species: string[];
  family?: string;
  lifeStage?: string;
  equipmentType?: string;
  presentations: string[];
  description: { es: string; en: string };
  composition?: { es: string; en: string };
  sanitaryRegistry?: string;
  indications?: { es: string; en: string };
  ingredients?: { es: string; en: string };
  nutritionalInfo?: { es: string; en: string };
  specifications?: { es: string; en: string };
  recommendedUses?: { es: string; en: string };
  warranty?: { es: string; en: string };
  images: string[];
  pdfUrl?: string;
  isActive: boolean;
  isFeatured: boolean;
  featuredOrder?: number;
  storytelling?: {
    image?: string;
    text: { es: string; en: string };
  }[];
  metaTitle?: { es: string; en: string };
  metaDescription?: { es: string; en: string };
  hasEnTranslation: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApiBrand {
  _id: string;
  slug: string;
  name: string;
  country: string;
  categories: string[];
  description: { es: string; en: string };
  logo?: string;
  isFeatured: boolean;
  featuredOrder?: number;
  productCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ApiCategory {
  _id: string;
  key: string;
  name: { es: string; en: string };
  description: { es: string; en: string };
  families?: { es: string; en: string }[];
  species?: { es: string; en: string }[];
  lifeStages?: { es: string; en: string }[];
  equipmentTypes?: { es: string; en: string }[];
  activeCount?: number;
  totalCount?: number;
}

export interface ApiHomeConfig {
  _id: string;
  hero: {
    image?: string;
    tag: { es: string; en: string };
    headline: { es: string; en: string };
    subtitle: { es: string; en: string };
    ctaPrimary: { es: string; en: string };
    ctaSecondary: { es: string; en: string };
  };
  featuredProducts: string[];
  featuredBrands: string[];
}

export interface ApiHomePublic {
  hero: ApiHomeConfig['hero'];
  featuredProducts: ApiProduct[];
  featuredBrands: ApiBrand[];
}

export interface ApiPageSection {
  key: string;
  label: { es: string; en: string };
  value: { es: string; en: string };
  type: 'text' | 'textarea' | 'image';
}

export interface ApiPageContent {
  _id: string;
  pageKey: string;
  sections: ApiPageSection[];
  heroImage?: string;
}

export interface ApiTeamMember {
  _id: string;
  name: { es: string; en: string };
  title: { es: string; en: string };
  photo?: string;
  order: number;
}

export interface FilterValues {
  brands: { id: string; name: string; slug: string }[];
  species: string[];
  families: string[];
  lifeStages: string[];
  equipmentTypes: string[];
}

export interface SearchResults {
  products: {
    id: string;
    name: { es: string; en: string };
    slug: { es: string; en: string };
    brand: string;
    category: string;
    image?: string;
  }[];
  brands: {
    id: string;
    name: string;
    slug: string;
    logo?: string;
    country: string;
  }[];
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  // ==================== PUBLIC ENDPOINTS ====================

  async getProducts(params: Record<string, string | number | undefined> = {}): Promise<PaginatedResponse<ApiProduct>> {
    const httpParams = this.buildParams(params);
    return firstValueFrom(
      this.http.get<PaginatedResponse<ApiProduct>>(`${this.baseUrl}/public/products`, { params: httpParams })
    );
  }

  async getProductBySlug(slug: string, lang: string = 'es'): Promise<ApiProduct> {
    return firstValueFrom(
      this.http.get<ApiProduct>(`${this.baseUrl}/public/products/by-slug/${slug}`, {
        params: { lang },
      })
    );
  }

  async getRelatedProducts(productId: string): Promise<ApiProduct[]> {
    return firstValueFrom(
      this.http.get<ApiProduct[]>(`${this.baseUrl}/public/products/${productId}/related`)
    );
  }

  async getFeaturedProducts(): Promise<ApiProduct[]> {
    return firstValueFrom(
      this.http.get<ApiProduct[]>(`${this.baseUrl}/public/products/featured`)
    );
  }

  async getFilterValues(category?: string): Promise<FilterValues> {
    const params: Record<string, string> = {};
    if (category) params['category'] = category;
    return firstValueFrom(
      this.http.get<FilterValues>(`${this.baseUrl}/public/products/filters`, { params })
    );
  }

  async getBrands(): Promise<ApiBrand[]> {
    return firstValueFrom(
      this.http.get<ApiBrand[]>(`${this.baseUrl}/public/brands`)
    );
  }

  async getBrandBySlug(slug: string): Promise<ApiBrand> {
    return firstValueFrom(
      this.http.get<ApiBrand>(`${this.baseUrl}/public/brands/${slug}`)
    );
  }

  async getBrandProducts(slug: string, params: Record<string, string | number | undefined> = {}): Promise<PaginatedResponse<ApiProduct>> {
    const httpParams = this.buildParams(params);
    return firstValueFrom(
      this.http.get<PaginatedResponse<ApiProduct>>(`${this.baseUrl}/public/brands/${slug}/products`, { params: httpParams })
    );
  }

  async getFeaturedBrands(): Promise<ApiBrand[]> {
    return firstValueFrom(
      this.http.get<ApiBrand[]>(`${this.baseUrl}/public/brands/featured`)
    );
  }

  async getCategories(): Promise<ApiCategory[]> {
    return firstValueFrom(
      this.http.get<ApiCategory[]>(`${this.baseUrl}/public/categories`)
    );
  }

  async search(term: string, lang: string = 'es'): Promise<SearchResults> {
    return firstValueFrom(
      this.http.get<SearchResults>(`${this.baseUrl}/public/search`, {
        params: { q: term, lang, limit: '5' },
      })
    );
  }

  // ==================== ADMIN ENDPOINTS ====================

  async adminGetProducts(params: Record<string, string | number | undefined> = {}): Promise<PaginatedResponse<ApiProduct>> {
    const httpParams = this.buildParams(params);
    return firstValueFrom(
      this.http.get<PaginatedResponse<ApiProduct>>(`${this.baseUrl}/admin/products`, { params: httpParams })
    );
  }

  async adminGetProduct(id: string): Promise<ApiProduct> {
    return firstValueFrom(
      this.http.get<ApiProduct>(`${this.baseUrl}/admin/products/${id}`)
    );
  }

  async adminCreateProduct(data: Record<string, unknown>): Promise<ApiProduct> {
    return firstValueFrom(
      this.http.post<ApiProduct>(`${this.baseUrl}/admin/products`, data)
    );
  }

  async adminUpdateProduct(id: string, data: Record<string, unknown>): Promise<ApiProduct> {
    return firstValueFrom(
      this.http.put<ApiProduct>(`${this.baseUrl}/admin/products/${id}`, data)
    );
  }

  async adminDeleteProduct(id: string): Promise<void> {
    await firstValueFrom(
      this.http.delete(`${this.baseUrl}/admin/products/${id}`)
    );
  }

  async adminToggleProductActive(id: string): Promise<ApiProduct> {
    return firstValueFrom(
      this.http.patch<ApiProduct>(`${this.baseUrl}/admin/products/${id}/toggle-active`, {})
    );
  }

  async adminDuplicateProduct(id: string): Promise<ApiProduct> {
    return firstValueFrom(
      this.http.post<ApiProduct>(`${this.baseUrl}/admin/products/${id}/duplicate`, {})
    );
  }

  async adminUploadProductImages(id: string, files: File[]): Promise<ApiProduct> {
    const formData = new FormData();
    for (const file of files) {
      formData.append('images', file);
    }
    return firstValueFrom(
      this.http.post<ApiProduct>(`${this.baseUrl}/admin/products/${id}/images`, formData)
    );
  }

  async adminDeleteProductImage(id: string, imageIndex: number): Promise<ApiProduct> {
    return firstValueFrom(
      this.http.delete<ApiProduct>(`${this.baseUrl}/admin/products/${id}/images/${imageIndex}`)
    );
  }

  async adminUploadProductPdf(id: string, file: File): Promise<ApiProduct> {
    const formData = new FormData();
    formData.append('pdf', file);
    return firstValueFrom(
      this.http.post<ApiProduct>(`${this.baseUrl}/admin/products/${id}/pdf`, formData)
    );
  }

  async adminDeleteProductPdf(id: string): Promise<ApiProduct> {
    return firstValueFrom(
      this.http.delete<ApiProduct>(`${this.baseUrl}/admin/products/${id}/pdf`)
    );
  }

  // Admin Brands
  async adminGetBrands(): Promise<ApiBrand[]> {
    return firstValueFrom(
      this.http.get<ApiBrand[]>(`${this.baseUrl}/admin/brands`)
    );
  }

  async adminGetBrand(id: string): Promise<ApiBrand> {
    return firstValueFrom(
      this.http.get<ApiBrand>(`${this.baseUrl}/admin/brands/${id}`)
    );
  }

  async adminCreateBrand(data: Record<string, unknown>): Promise<ApiBrand> {
    return firstValueFrom(
      this.http.post<ApiBrand>(`${this.baseUrl}/admin/brands`, data)
    );
  }

  async adminUpdateBrand(id: string, data: Record<string, unknown>): Promise<ApiBrand> {
    return firstValueFrom(
      this.http.put<ApiBrand>(`${this.baseUrl}/admin/brands/${id}`, data)
    );
  }

  async adminDeleteBrand(id: string): Promise<{ success: boolean; hadProducts: number }> {
    return firstValueFrom(
      this.http.delete<{ success: boolean; hadProducts: number }>(`${this.baseUrl}/admin/brands/${id}`)
    );
  }

  async adminUploadBrandLogo(id: string, file: File): Promise<ApiBrand> {
    const formData = new FormData();
    formData.append('image', file);
    return firstValueFrom(
      this.http.post<ApiBrand>(`${this.baseUrl}/admin/brands/${id}/logo`, formData)
    );
  }

  // Admin Categories
  async adminGetCategories(): Promise<ApiCategory[]> {
    return firstValueFrom(
      this.http.get<ApiCategory[]>(`${this.baseUrl}/admin/categories`)
    );
  }

  async adminUpdateCategory(key: string, data: Record<string, unknown>): Promise<ApiCategory> {
    return firstValueFrom(
      this.http.put<ApiCategory>(`${this.baseUrl}/admin/categories/${key}`, data)
    );
  }

  // ==================== PUBLIC HOME/CONTENT/TEAM ====================

  async getHomeData(): Promise<ApiHomePublic> {
    return firstValueFrom(
      this.http.get<ApiHomePublic>(`${this.baseUrl}/public/home`)
    );
  }

  async getPageContent(pageKey: string): Promise<ApiPageContent> {
    return firstValueFrom(
      this.http.get<ApiPageContent>(`${this.baseUrl}/public/content/${pageKey}`)
    );
  }

  async getTeamMembers(): Promise<ApiTeamMember[]> {
    return firstValueFrom(
      this.http.get<ApiTeamMember[]>(`${this.baseUrl}/public/team`)
    );
  }

  // ==================== ADMIN HOME ====================

  async adminGetHomeConfig(): Promise<ApiHomeConfig> {
    return firstValueFrom(
      this.http.get<ApiHomeConfig>(`${this.baseUrl}/admin/home`)
    );
  }

  async adminUpdateHero(data: Record<string, unknown>): Promise<ApiHomeConfig> {
    return firstValueFrom(
      this.http.put<ApiHomeConfig>(`${this.baseUrl}/admin/home/hero`, data)
    );
  }

  async adminUploadHeroImage(file: File): Promise<ApiHomeConfig> {
    const formData = new FormData();
    formData.append('image', file);
    return firstValueFrom(
      this.http.post<ApiHomeConfig>(`${this.baseUrl}/admin/home/hero/image`, formData)
    );
  }

  async adminUpdateFeaturedProducts(productIds: string[]): Promise<ApiHomeConfig> {
    return firstValueFrom(
      this.http.put<ApiHomeConfig>(`${this.baseUrl}/admin/home/featured-products`, { productIds })
    );
  }

  async adminUpdateFeaturedBrands(brandIds: string[]): Promise<ApiHomeConfig> {
    return firstValueFrom(
      this.http.put<ApiHomeConfig>(`${this.baseUrl}/admin/home/featured-brands`, { brandIds })
    );
  }

  // ==================== ADMIN CONTENT ====================

  async adminGetAllContent(): Promise<ApiPageContent[]> {
    return firstValueFrom(
      this.http.get<ApiPageContent[]>(`${this.baseUrl}/admin/content`)
    );
  }

  async adminGetPageContent(pageKey: string): Promise<ApiPageContent> {
    return firstValueFrom(
      this.http.get<ApiPageContent>(`${this.baseUrl}/admin/content/${pageKey}`)
    );
  }

  async adminUpdatePageContent(pageKey: string, data: Record<string, unknown>): Promise<ApiPageContent> {
    return firstValueFrom(
      this.http.put<ApiPageContent>(`${this.baseUrl}/admin/content/${pageKey}`, data)
    );
  }

  async adminUploadContentImage(pageKey: string, file: File): Promise<ApiPageContent> {
    const formData = new FormData();
    formData.append('image', file);
    return firstValueFrom(
      this.http.post<ApiPageContent>(`${this.baseUrl}/admin/content/${pageKey}/image`, formData)
    );
  }

  // ==================== ADMIN TEAM ====================

  async adminGetTeam(): Promise<ApiTeamMember[]> {
    return firstValueFrom(
      this.http.get<ApiTeamMember[]>(`${this.baseUrl}/admin/team`)
    );
  }

  async adminCreateTeamMember(data: Record<string, unknown>): Promise<ApiTeamMember> {
    return firstValueFrom(
      this.http.post<ApiTeamMember>(`${this.baseUrl}/admin/team`, data)
    );
  }

  async adminUpdateTeamMember(id: string, data: Record<string, unknown>): Promise<ApiTeamMember> {
    return firstValueFrom(
      this.http.put<ApiTeamMember>(`${this.baseUrl}/admin/team/${id}`, data)
    );
  }

  async adminDeleteTeamMember(id: string): Promise<void> {
    await firstValueFrom(
      this.http.delete(`${this.baseUrl}/admin/team/${id}`)
    );
  }

  async adminUploadTeamPhoto(id: string, file: File): Promise<ApiTeamMember> {
    const formData = new FormData();
    formData.append('image', file);
    return firstValueFrom(
      this.http.post<ApiTeamMember>(`${this.baseUrl}/admin/team/${id}/photo`, formData)
    );
  }

  async adminReorderTeam(orderedIds: string[]): Promise<ApiTeamMember[]> {
    return firstValueFrom(
      this.http.put<ApiTeamMember[]>(`${this.baseUrl}/admin/team/reorder`, { orderedIds })
    );
  }

  // ==================== HELPERS ====================

  private buildParams(params: Record<string, string | number | undefined | null>): HttpParams {
    let httpParams = new HttpParams();
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null && value !== '') {
        httpParams = httpParams.set(key, String(value));
      }
    }
    return httpParams;
  }
}
