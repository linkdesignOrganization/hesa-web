import { Component, input } from '@angular/core';

@Component({
  selector: 'app-team-member-card',
  standalone: true,
  templateUrl: './team-member-card.component.html',
  styleUrl: './team-member-card.component.scss'
})
export class TeamMemberCardComponent {
  name = input('');
  title = input('');
}
