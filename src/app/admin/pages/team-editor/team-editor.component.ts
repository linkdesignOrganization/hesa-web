import { Component, inject, signal, OnInit } from '@angular/core';
import { MockDataService, TeamMember } from '../../../shared/services/mock-data.service';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
  selector: 'app-admin-team-editor',
  standalone: true,
  template: `
    <div>
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
        <h1 style="font-size: 24px; font-weight: 700;">Equipo de Liderazgo</h1>
        <button class="btn btn-primary" (click)="toast.info('Formulario de nuevo miembro')">+ Agregar miembro</button>
      </div>
      @if (loading()) {
        <div class="team-grid">
          @for (i of [1,2,3,4,5,6]; track i) { <div class="skeleton-card" style="height: 120px;"></div> }
        </div>
      } @else {
        <div class="team-grid">
          @for (member of team(); track member.id) {
            <div class="team-card">
              <span class="team-card__drag">&#x2630;</span>
              <div class="team-card__avatar">{{ member.name.charAt(0) }}</div>
              <div class="team-card__info"><span class="team-card__name">{{ member.name }}</span><span class="team-card__title">{{ member.title.es }}</span></div>
              <button class="team-card__delete" aria-label="Eliminar">&times;</button>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .team-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; }
    .team-card { display: flex; align-items: center; gap: 12px; padding: 16px; background: white; border: 1px solid var(--neutral-200); border-radius: 10px; }
    .team-card__drag { color: var(--neutral-300); cursor: grab; }
    .team-card__avatar { width: 48px; height: 48px; border-radius: 50%; background: var(--neutral-100); display: flex; align-items: center; justify-content: center; font-weight: 700; color: var(--brand-primary); flex-shrink: 0; }
    .team-card__info { flex: 1; }
    .team-card__name { font-weight: 600; font-size: 14px; display: block; }
    .team-card__title { font-size: 12px; color: var(--neutral-500); }
    .team-card__delete { background: none; border: none; font-size: 20px; color: var(--neutral-400); cursor: pointer; &:hover { color: var(--semantic-danger); } }
    .skeleton-card { background: var(--neutral-100); border-radius: 10px; }
  `]
})
export class AdminTeamEditorComponent implements OnInit {
  private mockData = inject(MockDataService);
  toast = inject(ToastService);
  team = signal<TeamMember[]>([]);
  loading = signal(true);

  async ngOnInit(): Promise<void> {
    const data = await this.mockData.getTeam();
    this.team.set(data);
    this.loading.set(false);
  }
}
