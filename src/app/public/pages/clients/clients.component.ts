import { Component, inject, OnInit, AfterViewInit, OnDestroy, ElementRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { I18nService } from '../../../shared/services/i18n.service';
import { SeoService } from '../../../shared/services/seo.service';
import { initFadeInObserver } from '../../../shared/utils/fade-in-observer';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.scss'
})
export class ClientsComponent implements OnInit, AfterViewInit, OnDestroy {
  i18n = inject(I18nService);
  private seo = inject(SeoService);
  private el = inject(ElementRef);
  private fadeObserver: IntersectionObserver | null = null;

  clientTypes = [
    {
      icon: 'hospital',
      title: { es: 'Clínicas y Hospitales Veterinarios', en: 'Veterinary Clinics & Hospitals' },
      description: {
        es: 'Atendemos clínicas y hospitales veterinarios de todo el país con fármacos, insumos y equipos de la más alta calidad.',
        en: 'We serve veterinary clinics and hospitals across the country with pharmaceuticals, supplies, and top-quality equipment.'
      }
    },
    {
      icon: 'pet',
      title: { es: 'Pet Shops y Grooming', en: 'Pet Shops & Grooming' },
      description: {
        es: 'Suplimos tiendas de mascotas y salones de grooming con alimentos premium, accesorios y productos de cuidado.',
        en: 'We supply pet stores and grooming salons with premium food, accessories, and care products.'
      }
    },
    {
      icon: 'store',
      title: { es: 'Agroservicios', en: 'Agricultural Supply Stores' },
      description: {
        es: 'Proveemos agroservicios en todo el territorio nacional con productos para la salud animal y nutrición.',
        en: 'We supply agricultural stores across the national territory with animal health and nutrition products.'
      }
    },
    {
      icon: 'pharmacy',
      title: { es: 'Farmacias Veterinarias', en: 'Veterinary Pharmacies' },
      description: {
        es: 'Distribuimos a farmacias veterinarias una amplia gama de fármacos y productos especializados de marcas exclusivas.',
        en: 'We distribute a wide range of pharmaceuticals and specialized products from exclusive brands to veterinary pharmacies.'
      }
    }
  ];

  benefits = [
    {
      icon: 'globe',
      title: { es: 'Suministro directo de marcas internacionales', en: 'Direct supply from international brands' },
      description: {
        es: 'Acceso a productos de los fabricantes más reconocidos del mundo, importados directamente por HESA.',
        en: 'Access to products from the world\'s most recognized manufacturers, imported directly by HESA.'
      }
    },
    {
      icon: 'tag',
      title: { es: 'Precios competitivos', en: 'Competitive pricing' },
      description: {
        es: 'Al ser distribuidor exclusivo, ofrecemos las mejores condiciones comerciales del mercado.',
        en: 'As an exclusive distributor, we offer the best commercial conditions in the market.'
      }
    },
    {
      icon: 'calendar',
      title: { es: 'Entrega quincenal a su puerta', en: 'Biweekly delivery to your door' },
      description: {
        es: 'Nuestros agentes de ventas visitan su negocio cada dos semanas con entregas puntuales y confiables.',
        en: 'Our sales agents visit your business every two weeks with timely and reliable deliveries.'
      }
    },
    {
      icon: 'headset',
      title: { es: 'Representantes de ventas capacitados', en: 'Trained sales representatives' },
      description: {
        es: 'Agentes comerciales con conocimiento técnico para asesorarle en la selección de los mejores productos.',
        en: 'Commercial agents with technical knowledge to advise you on selecting the best products.'
      }
    },
    {
      icon: 'book',
      title: { es: 'Capacitación y soporte técnico', en: 'Product training and technical support' },
      description: {
        es: 'Programas de capacitación sobre productos y soporte técnico permanente para su equipo.',
        en: 'Product training programs and ongoing technical support for your team.'
      }
    }
  ];

  steps = [
    {
      number: '1',
      title: { es: 'Contacte a nuestro equipo de ventas', en: 'Contact our sales team' },
      description: {
        es: 'Comuníquese con nosotros por teléfono, WhatsApp o formulario de contacto.',
        en: 'Reach out to us by phone, WhatsApp, or contact form.'
      }
    },
    {
      number: '2',
      title: { es: 'Reciba atencion personalizada', en: 'Receive personalized attention' },
      description: {
        es: 'Un agente de ventas le visitará para conocer las necesidades de su negocio.',
        en: 'A sales agent will visit you to understand your business needs.'
      }
    },
    {
      number: '3',
      title: { es: 'Disfrute de entregas regulares', en: 'Enjoy regular deliveries' },
      description: {
        es: 'Reciba sus productos de forma quincenal con nuestra flotilla propia de entrega.',
        en: 'Receive your products biweekly with our own delivery fleet.'
      }
    }
  ];

  ngOnInit(): void {
    const lang = this.i18n.currentLang();
    this.seo.setMetaTags({
      title: lang === 'es' ? 'Nuestros Clientes' : 'Our Clients',
      description: lang === 'es'
        ? 'HESA atiende clínicas veterinarias, pet shops, agroservicios y farmacias veterinarias en toda Costa Rica con productos de calidad.'
        : 'HESA serves veterinary clinics, pet shops, agricultural stores, and veterinary pharmacies across Costa Rica with quality products.',
      url: `/${lang}/${lang === 'es' ? 'clientes' : 'clients'}`,
    });
    this.seo.setHreflang('/es/clientes', '/en/clients');
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
