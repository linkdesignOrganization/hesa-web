import { Component, inject, signal, OnInit, AfterViewInit, OnDestroy, ElementRef } from '@angular/core';
import { ValueStatComponent } from '../../components/value-stat/value-stat.component';
import { TeamMemberCardComponent } from '../../components/team-member-card/team-member-card.component';
import { MockDataService, TeamMember } from '../../../shared/services/mock-data.service';
import { I18nService } from '../../../shared/services/i18n.service';
import { initFadeInObserver } from '../../../shared/utils/fade-in-observer';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [ValueStatComponent, TeamMemberCardComponent],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent implements OnInit, AfterViewInit, OnDestroy {
  private mockData = inject(MockDataService);
  i18n = inject(I18nService);
  private el = inject(ElementRef);
  private fadeObserver: IntersectionObserver | null = null;

  team = signal<TeamMember[]>([]);
  loading = signal(true);

  stats = [
    { number: '37', suffix: '+', label: { es: 'Anos de trayectoria', en: 'Years of experience' } },
    { number: '50', suffix: '+', label: { es: 'Colaboradores', en: 'Collaborators' } },
    { number: '100', suffix: '%', label: { es: 'Cobertura nacional', en: 'National coverage' } },
    { number: '4', suffix: '', label: { es: 'Empresas del grupo', en: 'Group companies' } }
  ];

  async ngOnInit(): Promise<void> {
    const data = await this.mockData.getTeam();
    this.team.set(data);
    this.loading.set(false);
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
