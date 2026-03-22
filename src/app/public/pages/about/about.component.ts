import { Component, inject, signal, OnInit, AfterViewInit, OnDestroy, ElementRef, HostListener } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ValueStatComponent } from '../../components/value-stat/value-stat.component';
import { TeamMemberCardComponent } from '../../components/team-member-card/team-member-card.component';
import { ApiService, ApiTeamMember, ApiPageContent, ApiBrand } from '../../../shared/services/api.service';
import { I18nService } from '../../../shared/services/i18n.service';
import { SeoService } from '../../../shared/services/seo.service';
import { getBrandsSegment } from '../../../shared/utils/route-helpers';
import { initFadeInObserver } from '../../../shared/utils/fade-in-observer';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [ValueStatComponent, TeamMemberCardComponent, RouterLink],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent implements OnInit, AfterViewInit, OnDestroy {
  private api = inject(ApiService);
  private seo = inject(SeoService);
  i18n = inject(I18nService);
  private el = inject(ElementRef);
  private fadeObserver: IntersectionObserver | null = null;

  team = signal<ApiTeamMember[]>([]);
  brands = signal<ApiBrand[]>([]);
  loading = signal(true);
  content = signal<ApiPageContent | null>(null);
  policiesContent = signal<ApiPageContent | null>(null);
  activeMobileMarqueeBrand = signal<string | null>(null);
  readonly marqueeGroups = [0, 1] as const;
  readonly familyCompanyLogos = [
    { src: '/logo.svg', alt: 'HESA' },
    { src: '/logozoofarma.svg', alt: 'ZooFarma' },
    { src: '/logosemilla.jpeg', alt: 'Semilla' },
    { src: '/logoimv.svg', alt: 'IMV' }
  ] as const;
  readonly familyCompaniesTitle = {
    es: 'Una familia de empresas',
    en: 'A family of companies'
  } as const;
  readonly familyCompaniesCopy = {
    es: 'Desde 1988, cuatro empresas han crecido juntas bajo la misma visión: ser el proveedor veterinario más confiable del país. Hoy operamos como un solo grupo con cobertura nacional.',
    en: 'Since 1988, four companies have grown together under the same vision: to be the country’s most trusted veterinary supplier. Today we operate as one group with nationwide coverage.'
  } as const;

  stats = [
    { number: '37', suffix: '+', label: { es: 'Anos de trayectoria', en: 'Years of experience' } },
    { number: '50', suffix: '+', label: { es: 'Colaboradores', en: 'Collaborators' } },
    { number: '100', suffix: '%', label: { es: 'Cobertura nacional', en: 'National coverage' } },
    { number: '4', suffix: '', label: { es: 'Empresas del grupo', en: 'Group companies' } }
  ];

  async ngOnInit(): Promise<void> {
    // BUG-005/NFR-006: SEO meta tags and hreflang for about page
    const lang = this.i18n.currentLang();
    this.seo.setMetaTags({
      title: lang === 'es' ? 'Nosotros' : 'About Us',
      description: lang === 'es'
        ? 'HESA - Empresa familiar costarricense con mas de 37 anos de experiencia en la distribucion de productos veterinarios.'
        : 'HESA - Costa Rican family business with over 37 years of experience in veterinary product distribution.',
      url: `/${lang}/${lang === 'es' ? 'nosotros' : 'about'}`,
    });
    this.seo.setHreflang('/es/nosotros', '/en/about');

    // Load data from API (including politicas content for REQ-162 to REQ-166)
    try {
      const [teamData, contentData, policiesData, brandsData] = await Promise.all([
        this.api.getTeamMembers(),
        this.api.getPageContent('nosotros'),
        this.api.getPageContent('politicas'),
        this.api.getBrands(),
      ]);
      this.team.set(teamData);
      this.content.set(contentData);
      this.policiesContent.set(policiesData);
      this.brands.set(brandsData);
    } catch {
      // Graceful fallback — page still shows with hardcoded defaults
    }
    this.loading.set(false);
  }

  buildBrandRoute(slug: string): string {
    const lang = this.i18n.currentLang();
    return `/${lang}/${getBrandsSegment(lang)}/${slug}`;
  }

  getFamilyCompaniesTitle(): string {
    return this.i18n.currentLang() === 'es' ? this.familyCompaniesTitle.es : this.familyCompaniesTitle.en;
  }

  getFamilyCompaniesCopy(): string {
    return this.i18n.currentLang() === 'es' ? this.familyCompaniesCopy.es : this.familyCompaniesCopy.en;
  }

  onMarqueeBrandClick(event: MouseEvent, slug: string): void {
    if (!this.isTouchInteractionMode()) return;

    if (this.activeMobileMarqueeBrand() !== slug) {
      event.preventDefault();
      event.stopPropagation();
      this.activeMobileMarqueeBrand.set(slug);
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.activeMobileMarqueeBrand()) return;
    const target = event.target;
    if (!(target instanceof Node)) return;

    const marquee = this.el.nativeElement.querySelector('.about-brand-marquee');
    if (marquee?.contains(target)) return;

    this.activeMobileMarqueeBrand.set(null);
  }

  private isTouchInteractionMode(): boolean {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(hover: none), (pointer: coarse)').matches;
  }

  /** Helper to get section value from loaded content */
  getSectionValue(key: string): { es: string; en: string } {
    const section = this.content()?.sections?.find(s => s.key === key);
    return section?.value || { es: '', en: '' };
  }

  /** Get localized section value */
  getSection(key: string): string {
    const val = this.getSectionValue(key);
    return this.i18n.t(val) || '';
  }

  /** Get localized section value from politicas content (REQ-162 to REQ-166) */
  getPolicySection(key: string): string {
    const section = this.policiesContent()?.sections?.find(s => s.key === key);
    if (!section) return '';
    return this.i18n.t(section.value) || '';
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
