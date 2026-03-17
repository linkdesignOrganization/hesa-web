import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

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
}
