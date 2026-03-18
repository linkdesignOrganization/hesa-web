import { PageContent, IPageContent, IPageSection } from '../models/page-content.model';

/**
 * BUG-004 FIX: Default hero images for pages that need them.
 * Uses professional Unsplash photos for a premium look.
 */
const defaultHeroImages: Record<string, string> = {
  nosotros: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=1920&q=80&auto=format&fit=crop',
  distribuidores: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1920&q=80&auto=format&fit=crop',
};

/**
 * Default page content seed data for all static pages.
 * Used when a page doesn't exist yet in the database.
 */
const defaultPageSections: Record<string, IPageSection[]> = {
  nosotros: [
    { key: 'heroTitle', label: { es: 'Titulo del Hero', en: 'Hero Title' }, value: { es: 'Herrera y Elizondo S.A.', en: 'Herrera y Elizondo S.A.' }, type: 'text' },
    { key: 'heroSubtitle', label: { es: 'Subtitulo del Hero', en: 'Hero Subtitle' }, value: { es: 'Desde 1989, conectando la industria veterinaria costarricense con las mejores marcas del mundo', en: 'Since 1989, connecting the Costa Rican veterinary industry with the world\'s best brands' }, type: 'text' },
    { key: 'historyTitle', label: { es: 'Titulo Historia', en: 'History Title' }, value: { es: 'Nuestra Historia', en: 'Our History' }, type: 'text' },
    { key: 'historyContent', label: { es: 'Contenido Historia', en: 'History Content' }, value: { es: 'HESA nacio en 1989 como una empresa familiar costarricense dedicada a la importacion y distribucion de productos para la salud animal. Fundada por la familia Herrera y Elizondo, la empresa ha crecido durante dos generaciones hasta convertirse en uno de los distribuidores mas importantes del sector veterinario en Costa Rica.', en: 'HESA was born in 1989 as a Costa Rican family business dedicated to the import and distribution of animal health products. Founded by the Herrera and Elizondo family, the company has grown over two generations to become one of the most important distributors in the veterinary sector in Costa Rica.' }, type: 'textarea' },
    { key: 'missionTitle', label: { es: 'Titulo Mision', en: 'Mission Title' }, value: { es: 'Nuestra Mision', en: 'Our Mission' }, type: 'text' },
    { key: 'missionContent', label: { es: 'Contenido Mision', en: 'Mission Content' }, value: { es: 'Distribuir productos veterinarios de la mas alta calidad, garantizando disponibilidad, servicio tecnico y cobertura nacional. Somos el puente entre los fabricantes internacionales y los profesionales veterinarios costarricenses.', en: 'To distribute veterinary products of the highest quality, guaranteeing availability, technical service and national coverage. We are the bridge between international manufacturers and Costa Rican veterinary professionals.' }, type: 'textarea' },
    { key: 'coverageTitle', label: { es: 'Titulo Cobertura', en: 'Coverage Title' }, value: { es: 'Cobertura Nacional', en: 'National Coverage' }, type: 'text' },
    { key: 'coverageSubtitle', label: { es: 'Subtitulo Cobertura', en: 'Coverage Subtitle' }, value: { es: 'Llegamos a todo Costa Rica con visitas quincenales y flotilla propia de entrega', en: 'We reach all of Costa Rica with biweekly visits and our own delivery fleet' }, type: 'text' },
  ],
  distribuidores: [
    { key: 'heroTitle', label: { es: 'Titulo del Hero', en: 'Hero Title' }, value: { es: 'Conviertase en Nuestro Socio de Distribucion en Costa Rica', en: 'Become Our Distribution Partner in Costa Rica' }, type: 'text' },
    { key: 'heroSubtitle', label: { es: 'Subtitulo del Hero', en: 'Hero Subtitle' }, value: { es: '37 anos de trayectoria comprobada en distribucion de productos veterinarios. Cobertura nacional, flotilla propia y equipo de ventas especializado.', en: '37 years of proven track record in veterinary product distribution. Nationwide coverage, own fleet, and specialized sales team.' }, type: 'textarea' },
    { key: 'whyTitle', label: { es: 'Titulo Por que HESA', en: 'Why HESA Title' }, value: { es: 'Por que Elegir HESA', en: 'Why Choose HESA' }, type: 'text' },
    { key: 'timelineTitle', label: { es: 'Titulo Timeline', en: 'Timeline Title' }, value: { es: 'Como Funciona', en: 'How It Works' }, type: 'text' },
    { key: 'formTitle', label: { es: 'Titulo Formulario', en: 'Form Title' }, value: { es: 'Inicie su Alianza', en: 'Start Your Partnership' }, type: 'text' },
    { key: 'formDescription', label: { es: 'Descripcion Formulario', en: 'Form Description' }, value: { es: 'Complete el formulario y nuestro equipo comercial se comunicara con usted en un plazo de 48 horas para discutir oportunidades de distribucion.', en: 'Fill out the form and our commercial team will get in touch within 48 hours to discuss distribution opportunities.' }, type: 'textarea' },
  ],
  contacto: [
    { key: 'pageTitle', label: { es: 'Titulo de Pagina', en: 'Page Title' }, value: { es: 'Contactenos', en: 'Contact Us' }, type: 'text' },
    { key: 'phone', label: { es: 'Telefono', en: 'Phone' }, value: { es: '+506 2260-9020', en: '+506 2260-9020' }, type: 'text' },
    { key: 'email', label: { es: 'Correo', en: 'Email' }, value: { es: 'info@hesa.co.cr', en: 'info@hesa.co.cr' }, type: 'text' },
    { key: 'address', label: { es: 'Direccion', en: 'Address' }, value: { es: 'Calle 2, av 12. Heredia, Costa Rica', en: 'Calle 2, av 12. Heredia, Costa Rica' }, type: 'text' },
    { key: 'hours', label: { es: 'Horario', en: 'Hours' }, value: { es: 'Lunes a Viernes: 8:00 - 17:00', en: 'Monday to Friday: 8:00 - 17:00' }, type: 'text' },
  ],
  politicas: [
    { key: 'creditTitle', label: { es: 'Titulo Credito', en: 'Credit Title' }, value: { es: 'Politicas de Credito', en: 'Credit Policies' }, type: 'text' },
    { key: 'creditContent', label: { es: 'Contenido Credito', en: 'Credit Content' }, value: { es: 'Ofrecemos condiciones de credito flexibles para nuestros clientes. Los plazos de pago se definen segun el historial comercial y el volumen de compra. Consulte con su agente de ventas para conocer las condiciones personalizadas.', en: 'We offer flexible credit conditions for our clients. Payment terms are defined based on commercial history and purchase volume. Consult with your sales agent for personalized conditions.' }, type: 'textarea' },
    { key: 'deliveryTitle', label: { es: 'Titulo Entrega', en: 'Delivery Title' }, value: { es: 'Tiempos de Entrega', en: 'Delivery Times' }, type: 'text' },
    { key: 'deliveryContent', label: { es: 'Contenido Entrega', en: 'Delivery Content' }, value: { es: 'Gran Area Metropolitana: 24-48 horas. Zonas rurales: 2-3 dias habiles. Zonas muy alejadas: servicio de encomienda disponible. Nuestros agentes de ventas realizan visitas quincenales a todos los clientes.', en: 'Greater Metropolitan Area: 24-48 hours. Rural areas: 2-3 business days. Remote areas: package delivery service available. Our sales agents make biweekly visits to all clients.' }, type: 'textarea' },
    { key: 'coverageTitle', label: { es: 'Titulo Cobertura', en: 'Coverage Title' }, value: { es: 'Cobertura de Entrega', en: 'Delivery Coverage' }, type: 'text' },
    { key: 'coverageContent', label: { es: 'Contenido Cobertura', en: 'Coverage Content' }, value: { es: 'Contamos con flotilla propia de entrega, agentes en todas las zonas del pais y servicio de encomienda para zonas muy alejadas. Nuestros 18-20 agentes de ventas propios cubren todo el territorio nacional con visitas quincenales.', en: 'We have our own delivery fleet, agents in all areas of the country and package delivery service for very remote areas. Our 18-20 own sales agents cover the entire national territory with biweekly visits.' }, type: 'textarea' },
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
  for (const pageKey of ['nosotros', 'distribuidores', 'contacto', 'politicas']) {
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
