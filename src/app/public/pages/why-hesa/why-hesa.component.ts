import { Component, inject, OnInit, AfterViewInit, OnDestroy, ElementRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { I18nService } from '../../../shared/services/i18n.service';
import { SeoService } from '../../../shared/services/seo.service';
import { ValueStatComponent } from '../../components/value-stat/value-stat.component';
import { initFadeInObserver } from '../../../shared/utils/fade-in-observer';

@Component({
  selector: 'app-why-hesa',
  standalone: true,
  imports: [RouterLink, ValueStatComponent],
  templateUrl: './why-hesa.component.html',
  styleUrl: './why-hesa.component.scss'
})
export class WhyHesaComponent implements OnInit, AfterViewInit, OnDestroy {
  i18n = inject(I18nService);
  private seo = inject(SeoService);
  private el = inject(ElementRef);
  private fadeObserver: IntersectionObserver | null = null;

  differentiators = [
    {
      icon: 'map',
      title: { es: 'Cobertura Nacional', en: 'National Coverage' },
      description: {
        es: 'Visitas quincenales a cada cantón del país. Nuestros agentes de ventas recorren todo el territorio nacional para atender a cada cliente.',
        en: 'Biweekly visits to every canton in the country. Our sales agents travel the entire national territory to serve every client.'
      }
    },
    {
      icon: 'truck',
      title: { es: 'Flotilla Propia', en: 'Own Fleet' },
      description: {
        es: '18-20 vehículos de entrega propios con capacidad de cadena de frío para productos que requieren refrigeración.',
        en: '18-20 own delivery vehicles with cold chain capability for products requiring refrigeration.'
      }
    },
    {
      icon: 'shield',
      title: { es: '37+ Años de Experiencia', en: '37+ Years of Experience' },
      description: {
        es: 'Empresa familiar de segunda generación, de confianza desde 1987. Relaciones sólidas con fabricantes y clientes por igual.',
        en: 'Second-generation family business, trusted since 1987. Solid relationships with manufacturers and clients alike.'
      }
    },
    {
      icon: 'award',
      title: { es: 'Marcas Exclusivas', en: 'Exclusive Brands' },
      description: {
        es: 'Distribuidor exclusivo de marcas internacionales de primer nivel en fármacos veterinarios, alimentos y equipos.',
        en: 'Sole distributor for top-tier international brands in veterinary pharmaceuticals, food, and equipment.'
      }
    },
    {
      icon: 'users',
      title: { es: 'Equipo Experto', en: 'Expert Team' },
      description: {
        es: 'Más de 50 profesionales, incluyendo agentes comerciales capacitados que brindan asesoría técnica personalizada.',
        en: 'Over 50 professionals, including trained commercial agents who provide personalized technical advice.'
      }
    },
    {
      icon: 'clipboard',
      title: { es: 'Conocimiento Regulatorio', en: 'Regulatory Knowledge' },
      description: {
        es: 'Profundo entendimiento de las regulaciones locales de Costa Rica para la importación y distribución de productos veterinarios.',
        en: 'Deep understanding of Costa Rica\'s local regulations for the import and distribution of veterinary products.'
      }
    }
  ];

  stats = [
    { number: '37', suffix: '+', label: { es: 'Años de trayectoria', en: 'Years of experience' } },
    { number: '50', suffix: '+', label: { es: 'Profesionales', en: 'Team members' } },
    { number: '100', suffix: '%', label: { es: 'Cobertura nacional', en: 'National coverage' } },
    { number: '18', suffix: '+', label: { es: 'Vehículos de entrega', en: 'Delivery vehicles' } }
  ];

  ngOnInit(): void {
    const lang = this.i18n.currentLang();
    this.seo.setMetaTags({
      title: lang === 'es' ? 'Por qué HESA' : 'Why HESA',
      description: lang === 'es'
        ? 'Descubra por qué HESA es el distribuidor veterinario líder de Costa Rica. 37+ años de experiencia, cobertura nacional y marcas exclusivas.'
        : 'Discover why HESA is Costa Rica\'s leading veterinary distributor. 37+ years of experience, national coverage, and exclusive brands.',
      url: `/${lang}/${lang === 'es' ? 'por-que-hesa' : 'why-hesa'}`,
    });
    this.seo.setHreflang('/es/por-que-hesa', '/en/why-hesa');
  }

  ngAfterViewInit(): void {
    if (typeof window === 'undefined') return;
    setTimeout(() => {
      this.fadeObserver = initFadeInObserver(this.el);
    }, 500);
  }

  ngOnDestroy(): void {
    this.fadeObserver?.disconnect();
    this.seo.clearDynamicTags();
  }
}
