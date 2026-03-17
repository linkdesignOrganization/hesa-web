import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ContactFormComponent } from '../../components/contact-form/contact-form.component';
import { I18nService } from '../../../shared/services/i18n.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ContactFormComponent],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent implements OnInit {
  i18n = inject(I18nService);
  private route = inject(ActivatedRoute);
  prefilledProduct = '';

  ngOnInit(): void {
    const producto = this.route.snapshot.queryParamMap.get('producto');
    if (producto) {
      this.prefilledProduct = producto.replace(/-/g, ' ');
    }
  }
}
