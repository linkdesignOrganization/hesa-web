import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { I18nService } from '../../../shared/services/i18n.service';

@Component({
  selector: 'app-manufacturer-cta',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './manufacturer-cta.component.html',
  styleUrl: './manufacturer-cta.component.scss'
})
export class ManufacturerCtaComponent {
  i18n = inject(I18nService);
}
