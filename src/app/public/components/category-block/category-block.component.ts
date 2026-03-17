import { Component, input, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CrmTrackingService } from '../../../shared/services/crm-tracking.service';

@Component({
  selector: 'app-category-block',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './category-block.component.html',
  styleUrl: './category-block.component.scss'
})
export class CategoryBlockComponent {
  category = input<'pharma' | 'food' | 'equipment'>('pharma');
  imagePosition = input<'left' | 'right'>('right');
  title = input('');
  description = input('');
  benefits = input<string[]>([]);
  ctaText = input('');
  ctaLink = input('');

  private crmTracking = inject(CrmTrackingService);

  trackCTA(): void {
    this.crmTracking.trackCTA(this.ctaText());
  }
}
