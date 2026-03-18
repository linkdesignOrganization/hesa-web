import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService, ApiProduct } from '../../../shared/services/api.service';
import { ToastService } from '../../../shared/services/toast.service';
import { getCategorySlug } from '../../../shared/utils/route-helpers';

@Component({
  selector: 'app-admin-product-detail',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss'
})
export class AdminProductDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private api = inject(ApiService);
  private toast = inject(ToastService);
  product = signal<ApiProduct | null>(null);
  loading = signal(true);

  brandName(): string {
    const p = this.product();
    if (!p) return '';
    if (typeof p.brand === 'object' && p.brand) return p.brand.name;
    return '';
  }

  publicProductUrl(): string {
    const p = this.product();
    if (!p) return '#';
    const catSlug = getCategorySlug(p.category, 'es');
    const slug = p.slug?.es || '';
    return `/es/catalogo/${catSlug}/${slug}`;
  }

  async ngOnInit(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      try {
        const p = await this.api.adminGetProduct(id);
        this.product.set(p);
      } catch {
        this.toast.error('Error al cargar el producto');
      }
    }
    this.loading.set(false);
  }
}
