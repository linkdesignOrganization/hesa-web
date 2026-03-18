import { Component, input, signal, inject, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { I18nService } from '../../../shared/services/i18n.service';
import { ApiService } from '../../../shared/services/api.service';

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './contact-form.component.html',
  styleUrl: './contact-form.component.scss'
})
export class ContactFormComponent {
  variant = input<'general' | 'manufacturer'>('general');
  prefilledProduct = input('');

  i18n = inject(I18nService);
  private api = inject(ApiService);
  private el = inject(ElementRef);

  private static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  private static readonly PHONE_REGEX = /^[+]?[\d\s\-()]{7,20}$/;
  private static readonly MAX_NAME_LENGTH = 100;
  private static readonly MAX_EMAIL_LENGTH = 254;
  private static readonly MAX_PHONE_LENGTH = 20;
  private static readonly MAX_MESSAGE_LENGTH = 2000;
  private static readonly MAX_PRODUCT_LENGTH = 200;
  private static readonly MAX_COMPANY_LENGTH = 200;
  private static readonly RATE_LIMIT_MS = 30000; // 30 seconds between submissions
  private lastSubmitTime = 0;

  formState = signal<'idle' | 'submitting' | 'success' | 'error'>('idle');

  // General form fields
  name = '';
  email = '';
  phone = '';
  consultationType = '';
  productOfInterest = '';
  message = '';

  // Manufacturer form fields
  companyName = '';
  country = '';
  contactName = '';
  contactEmail = '';
  contactPhone = '';
  productTypes = '';
  mfrMessage = '';
  termsAccepted = false;

  // Honeypot
  honeypot = '';

  // Validation errors
  errors = signal<Record<string, string>>({});

  ngOnInit(): void {
    if (this.prefilledProduct()) {
      this.productOfInterest = this.prefilledProduct();
    }
  }

  private getRequiredMsg(): string {
    return this.i18n.currentLang() === 'es' ? 'Este campo es obligatorio' : 'This field is required';
  }

  private getInvalidEmailMsg(): string {
    return this.i18n.currentLang() === 'es' ? 'Formato de email invalido' : 'Invalid email format';
  }

  private getTooLongMsg(max: number): string {
    return this.i18n.currentLang() === 'es' ? `Maximo ${max} caracteres` : `Maximum ${max} characters`;
  }

  private getInvalidPhoneMsg(): string {
    return this.i18n.currentLang() === 'es' ? 'Formato de telefono invalido' : 'Invalid phone format';
  }

  private getRateLimitMsg(): string {
    return this.i18n.currentLang() === 'es' ? 'Por favor espera antes de enviar otro mensaje' : 'Please wait before sending another message';
  }

  private isValidEmail(value: string): boolean {
    return ContactFormComponent.EMAIL_REGEX.test(value);
  }

  private isValidPhone(value: string): boolean {
    return !value.trim() || ContactFormComponent.PHONE_REGEX.test(value.trim());
  }

  /** Sanitize input by trimming and removing control characters */
  private sanitize(value: string): string {
    // eslint-disable-next-line no-control-regex
    return value.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '').trim();
  }

  validateField(field: string, value: string): void {
    // REQ-204: Reset error state when user interacts, allowing retry without losing data
    if (this.formState() === 'error') {
      this.formState.set('idle');
    }
    const errs = { ...this.errors() };
    const maxLengthMap: Record<string, number> = {
      name: ContactFormComponent.MAX_NAME_LENGTH,
      contactName: ContactFormComponent.MAX_NAME_LENGTH,
      email: ContactFormComponent.MAX_EMAIL_LENGTH,
      contactEmail: ContactFormComponent.MAX_EMAIL_LENGTH,
      phone: ContactFormComponent.MAX_PHONE_LENGTH,
      contactPhone: ContactFormComponent.MAX_PHONE_LENGTH,
      message: ContactFormComponent.MAX_MESSAGE_LENGTH,
      mfrMessage: ContactFormComponent.MAX_MESSAGE_LENGTH,
      company: ContactFormComponent.MAX_COMPANY_LENGTH,
      productOfInterest: ContactFormComponent.MAX_PRODUCT_LENGTH,
      productTypes: ContactFormComponent.MAX_PRODUCT_LENGTH,
    };

    if (!value.trim()) {
      errs[field] = this.getRequiredMsg();
    } else if (field.includes('email') && !this.isValidEmail(value)) {
      errs[field] = this.getInvalidEmailMsg();
    } else if ((field === 'phone' || field === 'contactPhone') && !this.isValidPhone(value)) {
      errs[field] = this.getInvalidPhoneMsg();
    } else if (maxLengthMap[field] && value.length > maxLengthMap[field]) {
      errs[field] = this.getTooLongMsg(maxLengthMap[field]);
    } else {
      delete errs[field];
    }
    this.errors.set(errs);
  }

  private validateRequired(errs: Record<string, string>, field: string, value: string, maxLen?: number): void {
    const cleaned = this.sanitize(value);
    if (!cleaned) {
      errs[field] = this.getRequiredMsg();
    } else if (maxLen && cleaned.length > maxLen) {
      errs[field] = this.getTooLongMsg(maxLen);
    }
  }

  private validateEmailField(errs: Record<string, string>, field: string, value: string): void {
    const cleaned = this.sanitize(value);
    if (!cleaned) {
      errs[field] = this.getRequiredMsg();
    } else if (cleaned.length > ContactFormComponent.MAX_EMAIL_LENGTH) {
      errs[field] = this.getTooLongMsg(ContactFormComponent.MAX_EMAIL_LENGTH);
    } else if (!this.isValidEmail(cleaned)) {
      errs[field] = this.getInvalidEmailMsg();
    }
  }

  /** Scroll to the first error field */
  private scrollToFirstError(): void {
    setTimeout(() => {
      const firstError = this.el.nativeElement.querySelector('.form-control--error');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstError.focus();
      }
    }, 100);
  }

  async submit(): Promise<void> {
    // Anti-bot: honeypot check
    if (this.honeypot) return;

    // Rate limiting: prevent spam submissions
    const now = Date.now();
    if (now - this.lastSubmitTime < ContactFormComponent.RATE_LIMIT_MS) {
      this.errors.set({ _form: this.getRateLimitMsg() });
      return;
    }

    // Sanitize all inputs before validation
    this.name = this.sanitize(this.name);
    this.email = this.sanitize(this.email);
    this.phone = this.sanitize(this.phone);
    this.message = this.sanitize(this.message);
    this.productOfInterest = this.sanitize(this.productOfInterest);
    this.companyName = this.sanitize(this.companyName);
    this.contactName = this.sanitize(this.contactName);
    this.contactEmail = this.sanitize(this.contactEmail);
    this.contactPhone = this.sanitize(this.contactPhone);
    this.productTypes = this.sanitize(this.productTypes);
    this.mfrMessage = this.sanitize(this.mfrMessage);

    const errs: Record<string, string> = {};

    if (this.variant() === 'general') {
      this.validateRequired(errs, 'name', this.name, ContactFormComponent.MAX_NAME_LENGTH);
      this.validateEmailField(errs, 'email', this.email);
      if (!this.consultationType) errs['type'] = this.getRequiredMsg();
      this.validateRequired(errs, 'message', this.message, ContactFormComponent.MAX_MESSAGE_LENGTH);
      if (this.phone && !this.isValidPhone(this.phone)) errs['phone'] = this.getInvalidPhoneMsg();
    } else {
      this.validateRequired(errs, 'company', this.companyName, ContactFormComponent.MAX_COMPANY_LENGTH);
      if (!this.country) errs['country'] = this.getRequiredMsg();
      this.validateRequired(errs, 'contactName', this.contactName, ContactFormComponent.MAX_NAME_LENGTH);
      this.validateEmailField(errs, 'contactEmail', this.contactEmail);
      this.validateRequired(errs, 'mfrMessage', this.mfrMessage, ContactFormComponent.MAX_MESSAGE_LENGTH);
      if (this.contactPhone && !this.isValidPhone(this.contactPhone)) errs['contactPhone'] = this.getInvalidPhoneMsg();
    }

    this.errors.set(errs);
    if (Object.keys(errs).length > 0) {
      this.scrollToFirstError();
      return;
    }

    this.formState.set('submitting');
    this.lastSubmitTime = Date.now();

    try {
      if (this.variant() === 'general') {
        await this.api.submitContactGeneral({
          name: this.name,
          email: this.email,
          phone: this.phone || undefined,
          consultationType: this.consultationType,
          productOfInterest: this.productOfInterest || undefined,
          message: this.message,
          website: this.honeypot, // honeypot field sent to backend
        });
      } else {
        await this.api.submitContactManufacturer({
          companyName: this.companyName,
          country: this.country,
          contactName: this.contactName,
          contactEmail: this.contactEmail,
          contactPhone: this.contactPhone || undefined,
          productTypes: this.productTypes || undefined,
          message: this.mfrMessage,
          website: this.honeypot,
        });
      }
      this.formState.set('success');
    } catch (error: unknown) {
      console.error('Contact form submission failed:', error);
      this.formState.set('error');
    }
  }
}
