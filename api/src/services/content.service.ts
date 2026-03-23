import { PageContent, IPageContent, IPageSection } from '../models/page-content.model';

/**
 * BUG-004 FIX: Default hero images for pages that need them.
 * Uses professional Unsplash photos for a premium look.
 */
const defaultHeroImages: Record<string, string> = {
  distribuidores: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1920&q=80&auto=format&fit=crop',
};

/**
 * Default page content seed data for all static pages.
 * Used when a page doesn't exist yet in the database.
 */
const defaultPageSections: Record<string, IPageSection[]> = {
  distribuidores: [
    { key: 'heroTitle', label: { es: 'Título del hero', en: 'Hero Title' }, value: { es: 'Conviértase en nuestro socio de distribución en Costa Rica', en: 'Become Our Distribution Partner in Costa Rica' }, type: 'text' },
    { key: 'heroSubtitle', label: { es: 'Subtítulo del hero', en: 'Hero Subtitle' }, value: { es: '37 años de trayectoria comprobada en distribución de productos veterinarios. Cobertura nacional, flotilla propia y equipo de ventas especializado.', en: '37 years of proven track record in veterinary product distribution. Nationwide coverage, own fleet, and specialized sales team.' }, type: 'textarea' },
    { key: 'whyTitle', label: { es: 'Título Por qué HESA', en: 'Why HESA Title' }, value: { es: 'Por qué elegir HESA', en: 'Why Choose HESA' }, type: 'text' },
    { key: 'timelineTitle', label: { es: 'Título timeline', en: 'Timeline Title' }, value: { es: 'Cómo funciona', en: 'How It Works' }, type: 'text' },
    { key: 'formTitle', label: { es: 'Título formulario', en: 'Form Title' }, value: { es: 'Inicie su alianza', en: 'Start Your Partnership' }, type: 'text' },
    { key: 'formDescription', label: { es: 'Descripción formulario', en: 'Form Description' }, value: { es: 'Complete el formulario y nuestro equipo comercial se comunicará con usted en un plazo de 48 horas para discutir oportunidades de distribución.', en: 'Fill out the form and our commercial team will get in touch within 48 hours to discuss distribution opportunities.' }, type: 'textarea' },
  ],
  contacto: [
    { key: 'pageTitle', label: { es: 'Título de página', en: 'Page Title' }, value: { es: 'Contáctenos', en: 'Contact Us' }, type: 'text' },
    { key: 'phone', label: { es: 'Teléfono', en: 'Phone' }, value: { es: '+506 2260-9020', en: '+506 2260-9020' }, type: 'text' },
    { key: 'email', label: { es: 'Correo', en: 'Email' }, value: { es: 'info@hesa.co.cr', en: 'info@hesa.co.cr' }, type: 'text' },
    { key: 'address', label: { es: 'Dirección', en: 'Address' }, value: { es: 'Calle 2, av. 12. Heredia, Costa Rica', en: 'Calle 2, av. 12. Heredia, Costa Rica' }, type: 'text' },
    { key: 'hours', label: { es: 'Horario', en: 'Hours' }, value: { es: 'Lunes a Viernes: 8:00 - 17:00', en: 'Monday to Friday: 8:00 - 17:00' }, type: 'text' },
  ],
};

/**
 * Get content for a specific page. Seeds defaults if not found.
 * BUG-004 FIX: Also seeds default hero images for pages that need them.
 */
export async function getPageContent(pageKey: string): Promise<IPageContent> {
  let content = await PageContent.findOne({ pageKey }).lean() as unknown as IPageContent | null;
  if (!content) {
    const sections = defaultPageSections[pageKey] || [];
    const heroImage = defaultHeroImages[pageKey];
    const createData: Record<string, unknown> = { pageKey, sections };
    if (heroImage) createData.heroImage = heroImage;
    const created = await PageContent.create(createData);
    content = created.toObject() as unknown as IPageContent;
  } else if (!content.heroImage && defaultHeroImages[pageKey]) {
    // BUG-004 FIX: If page exists but has no hero image, set the default
    await PageContent.findByIdAndUpdate(content._id, {
      $set: { heroImage: defaultHeroImages[pageKey] },
    });
    content.heroImage = defaultHeroImages[pageKey];
  }
  return content;
}

/**
 * Get all page contents.
 */
export async function getAllPageContents(): Promise<IPageContent[]> {
  // Ensure all pages exist
  for (const pageKey of ['distribuidores', 'contacto']) {
    await getPageContent(pageKey);
  }
  return PageContent.find().sort({ pageKey: 1 }).lean() as unknown as Promise<IPageContent[]>;
}

/**
 * Update sections of a page.
 */
export async function updatePageContent(
  pageKey: string,
  sections: IPageSection[],
  heroImage?: string
): Promise<IPageContent | null> {
  const update: Record<string, unknown> = { sections };
  if (heroImage !== undefined) {
    update.heroImage = heroImage;
  }

  return PageContent.findOneAndUpdate(
    { pageKey },
    { $set: update },
    { new: true, upsert: true }
  ).lean() as unknown as Promise<IPageContent | null>;
}

/**
 * Update only the hero image of a page.
 */
export async function updatePageHeroImage(pageKey: string, heroImage: string): Promise<IPageContent | null> {
  return PageContent.findOneAndUpdate(
    { pageKey },
    { $set: { heroImage } },
    { new: true }
  ).lean() as unknown as Promise<IPageContent | null>;
}
