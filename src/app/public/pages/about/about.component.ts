import { Component, inject, signal, OnInit, AfterViewInit, OnDestroy, ElementRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ValueStatComponent } from '../../components/value-stat/value-stat.component';
import { TeamMemberCardComponent } from '../../components/team-member-card/team-member-card.component';
import { ApiService, ApiTeamMember, ApiPageContent } from '../../../shared/services/api.service';
import { I18nService } from '../../../shared/services/i18n.service';
import { SeoService } from '../../../shared/services/seo.service';
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
  loading = signal(true);
  content = signal<ApiPageContent | null>(null);
  policiesContent = signal<ApiPageContent | null>(null);

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
      const [teamData, contentData, policiesData] = await Promise.all([
        this.api.getTeamMembers(),
        this.api.getPageContent('nosotros'),
        this.api.getPageContent('politicas'),
      ]);
      this.team.set(teamData);
      this.content.set(contentData);
      this.policiesContent.set(policiesData);
    } catch {
      // Graceful fallback — page still shows with hardcoded defaults
    }
    this.loading.set(false);
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
