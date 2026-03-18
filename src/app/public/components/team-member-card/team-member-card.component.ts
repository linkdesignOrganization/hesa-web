import { Component, input, computed } from '@angular/core';

@Component({
  selector: 'app-team-member-card',
  standalone: true,
  templateUrl: './team-member-card.component.html',
  styleUrl: './team-member-card.component.scss'
})
export class TeamMemberCardComponent {
  name = input('');
  title = input('');
  photo = input('');

  /** NFR-002: WebP variant for <picture> <source> */
  photoWebP = computed(() => {
    const url = this.photo();
    return url ? url.replace(/\.(jpe?g|png)$/i, '.webp') : '';
  });
}
