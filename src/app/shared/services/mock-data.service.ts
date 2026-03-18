import { Injectable } from '@angular/core';

export interface Product {
  id: string;
  slug: { es: string; en: string };
  name: { es: string; en: string };
  brand: string;
  brandSlug: string;
  category: 'farmacos' | 'alimentos' | 'equipos';
  species: string[];
  family?: string;
  lifeStage?: string;
  equipmentType?: string;
  presentations: string[];
  description: { es: string; en: string };
  composition?: { es: string; en: string };
  sanitaryRegistry?: string;
  indications?: { es: string; en: string };
  images: string[];
  hasPdf: boolean;
  isActive: boolean;
  isFeatured: boolean;
  storytelling?: StorytellingBlock[];
  hasEnTranslation: boolean;
}

export interface StorytellingBlock {
  image?: string;
  text: { es: string; en: string };
}

export interface Brand {
  id: string;
  slug: string;
  name: string;
  country: string;
  categories: string[];
  description: { es: string; en: string };
  logoPlaceholder: string;
  isFeatured: boolean;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: 'Informacion' | 'Comercial' | 'Soporte' | 'Fabricante' | 'Otro';
  productOfInterest?: string;
  message: string;
  status: 'nuevo' | 'en-proceso' | 'atendido';
  date: string;
  relativeDate: string;
  notes?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  title: { es: string; en: string };
  order: number;
}

export interface CategoryData {
  id: string;
  name: { es: string; en: string };
  slug: { es: string; en: string };
  subcategories: SubcategoryGroup[];
}

export interface SubcategoryGroup {
  label: { es: string; en: string };
  key: string;
  values: { es: string; en: string }[];
}

export interface HeroData {
  tag: { es: string; en: string };
  headline: { es: string; en: string };
  subtitle: { es: string; en: string };
  ctaPrimary: { es: string; en: string };
  ctaSecondary: { es: string; en: string };
  image: string;
}

export interface SiteConfig {
  logo: string;
  name: string;
  slogan: { es: string; en: string };
  phone: string;
  email: string;
  address: { es: string; en: string };
  whatsapp: string;
  facebook: string;
  instagram: string;
  metaTitle: { es: string; en: string };
  metaDescription: { es: string; en: string };
}

@Injectable({ providedIn: 'root' })
export class MockDataService {

  private readonly brands: Brand[] = [
    { id: 'b1', slug: 'zoetis', name: 'Zoetis', country: 'Estados Unidos', categories: ['Farmacos'], description: { es: 'Lider global en salud animal con mas de 70 anos de experiencia. Zoetis desarrolla, manufactura y comercializa medicamentos, vacunas y diagnosticos veterinarios.', en: 'Global leader in animal health with over 70 years of experience. Zoetis develops, manufactures and markets veterinary medicines, vaccines and diagnostics.' }, logoPlaceholder: 'Z', isFeatured: true },
    { id: 'b2', slug: 'royal-canin', name: 'Royal Canin', country: 'Francia', categories: ['Alimentos'], description: { es: 'Nutricion de precision para gatos y perros. Formulas adaptadas a cada raza, tamano, edad y estilo de vida.', en: 'Precise nutrition for cats and dogs. Formulas tailored to each breed, size, age and lifestyle.' }, logoPlaceholder: 'R', isFeatured: true },
    { id: 'b3', slug: 'msd-animal-health', name: 'MSD Animal Health', country: 'Estados Unidos', categories: ['Farmacos'], description: { es: 'Division de salud animal de Merck. Ofrece una amplia gama de productos farmaceuticos, vacunas y soluciones de manejo animal.', en: 'Animal health division of Merck. Offers a wide range of pharmaceuticals, vaccines and animal management solutions.' }, logoPlaceholder: 'M', isFeatured: true },
    { id: 'b4', slug: 'purina-pro-plan', name: 'Purina Pro Plan', country: 'Suiza', categories: ['Alimentos'], description: { es: 'Nutricion avanzada respaldada por mas de 500 cientificos, nutriologos y veterinarios de Nestle Purina.', en: 'Advanced nutrition backed by over 500 Nestle Purina scientists, nutritionists and veterinarians.' }, logoPlaceholder: 'P', isFeatured: true },
    { id: 'b5', slug: 'boehringer-ingelheim', name: 'Boehringer Ingelheim', country: 'Alemania', categories: ['Farmacos'], description: { es: 'Una de las principales companias farmaceuticas del mundo, con fuerte presencia en salud animal.', en: 'One of the world\'s leading pharmaceutical companies, with a strong presence in animal health.' }, logoPlaceholder: 'B', isFeatured: true },
    { id: 'b6', slug: 'hills-pet-nutrition', name: 'Hills Pet Nutrition', country: 'Estados Unidos', categories: ['Alimentos'], description: { es: 'Nutricion basada en ciencia para mejorar y alargar la vida de las mascotas. Recetada por veterinarios en todo el mundo.', en: 'Science-based nutrition to improve and extend the lives of pets. Prescribed by veterinarians worldwide.' }, logoPlaceholder: 'H', isFeatured: true },
    { id: 'b7', slug: 'bayer-animal-health', name: 'Bayer Animal Health', country: 'Alemania', categories: ['Farmacos'], description: { es: 'Soluciones innovadoras para el cuidado de la salud animal con mas de 150 anos de trayectoria cientifica.', en: 'Innovative solutions for animal health care with over 150 years of scientific track record.' }, logoPlaceholder: 'B', isFeatured: true },
    { id: 'b8', slug: 'virbac', name: 'Virbac', country: 'Francia', categories: ['Farmacos', 'Alimentos'], description: { es: 'Laboratorio farmaceutico veterinario con presencia en mas de 100 paises, dedicado exclusivamente a la salud animal.', en: 'Veterinary pharmaceutical laboratory with presence in over 100 countries, exclusively dedicated to animal health.' }, logoPlaceholder: 'V', isFeatured: true },
    { id: 'b9', slug: 'welch-allyn', name: 'Welch Allyn', country: 'Estados Unidos', categories: ['Equipos'], description: { es: 'Fabricante lider de equipos de diagnostico y monitoreo para profesionales de la salud animal.', en: 'Leading manufacturer of diagnostic and monitoring equipment for animal health professionals.' }, logoPlaceholder: 'W', isFeatured: false },
    { id: 'b10', slug: 'heine', name: 'Heine', country: 'Alemania', categories: ['Equipos'], description: { es: 'Instrumentos opticos de diagnostico de alta precision, fabricados en Alemania desde 1946.', en: 'High-precision optical diagnostic instruments, manufactured in Germany since 1946.' }, logoPlaceholder: 'H', isFeatured: false },
    { id: 'b11', slug: 'imv-technologies', name: 'IMV Technologies', country: 'Francia', categories: ['Equipos'], description: { es: 'Especialista mundial en tecnologias de reproduccion animal y equipos de inseminacion artificial.', en: 'World specialist in animal reproduction technologies and artificial insemination equipment.' }, logoPlaceholder: 'I', isFeatured: false },
    { id: 'b12', slug: 'nutrisource', name: 'NutriSource', country: 'Estados Unidos', categories: ['Alimentos'], description: { es: 'Alimentos naturales premium con probioticos patentados para una nutricion optima de mascotas.', en: 'Premium natural foods with patented probiotics for optimal pet nutrition.' }, logoPlaceholder: 'N', isFeatured: false },
  ];

  private readonly products: Product[] = [
    // FARMACOS (28 products)
    { id: 'p1', slug: { es: 'amoxicilina-250ml', en: 'amoxicillin-250ml' }, name: { es: 'Amoxicilina 250ml', en: 'Amoxicillin 250ml' }, brand: 'Zoetis', brandSlug: 'zoetis', category: 'farmacos', species: ['Caninos', 'Felinos', 'Bovinos'], family: 'Antibioticos', presentations: ['100ml', '250ml', '500ml'], description: { es: 'Antibiotico de amplio espectro para uso veterinario. Indicado para el tratamiento de infecciones bacterianas en multiples especies.', en: 'Broad-spectrum antibiotic for veterinary use. Indicated for the treatment of bacterial infections in multiple species.' }, composition: { es: 'Amoxicilina trihidratada equivalente a 150mg de amoxicilina por ml', en: 'Amoxicillin trihydrate equivalent to 150mg amoxicillin per ml' }, sanitaryRegistry: 'MAG-VET-2023-001', indications: { es: 'Infecciones respiratorias, urinarias, gastrointestinales y de piel causadas por bacterias sensibles a la amoxicilina.', en: 'Respiratory, urinary, gastrointestinal and skin infections caused by amoxicillin-sensitive bacteria.' }, images: ['placeholder-1', 'placeholder-2', 'placeholder-3'], hasPdf: true, isActive: true, isFeatured: true, hasEnTranslation: true, storytelling: [{ image: 'story-placeholder-1', text: { es: 'La amoxicilina es uno de los antibioticos mas prescritos en medicina veterinaria. Su amplio espectro de accion la convierte en una herramienta indispensable.', en: 'Amoxicillin is one of the most prescribed antibiotics in veterinary medicine. Its broad spectrum of action makes it an indispensable tool.' } }, { text: { es: 'En HESA, trabajamos directamente con Zoetis para garantizar la cadena de frio y la calidad de cada lote.', en: 'At HESA, we work directly with Zoetis to guarantee the cold chain and quality of each batch.' } }] },
    { id: 'p2', slug: { es: 'meloxicam-inyectable-20ml', en: 'meloxicam-injectable-20ml' }, name: { es: 'Meloxicam Inyectable 20ml', en: 'Meloxicam Injectable 20ml' }, brand: 'Boehringer Ingelheim', brandSlug: 'boehringer-ingelheim', category: 'farmacos', species: ['Caninos', 'Felinos'], family: 'Antiinflamatorios', presentations: ['10ml', '20ml'], description: { es: 'Antiinflamatorio no esteroideo de accion prolongada para el control del dolor y la inflamacion.', en: 'Long-acting non-steroidal anti-inflammatory for pain and inflammation control.' }, sanitaryRegistry: 'MAG-VET-2023-002', images: ['placeholder-1', 'placeholder-2'], hasPdf: true, isActive: true, isFeatured: true, hasEnTranslation: true },
    { id: 'p3', slug: { es: 'ivermectina-pour-on-1l', en: 'ivermectin-pour-on-1l' }, name: { es: 'Ivermectina Pour-On 1L', en: 'Ivermectin Pour-On 1L' }, brand: 'MSD Animal Health', brandSlug: 'msd-animal-health', category: 'farmacos', species: ['Bovinos', 'Porcinos'], family: 'Desparasitantes', presentations: ['500ml', '1L', '2.5L'], description: { es: 'Endectocida de amplio espectro para el control de parasitos internos y externos en bovinos.', en: 'Broad-spectrum endectocide for the control of internal and external parasites in cattle.' }, images: ['placeholder-1'], hasPdf: true, isActive: true, isFeatured: false, hasEnTranslation: true },
    { id: 'p4', slug: { es: 'fipronil-topico-antipulgas', en: 'fipronil-topical-flea-treatment' }, name: { es: 'Fipronil Topico Antipulgas', en: 'Fipronil Topical Flea Treatment' }, brand: 'MSD Animal Health', brandSlug: 'msd-animal-health', category: 'farmacos', species: ['Caninos', 'Felinos'], family: 'Desparasitantes', presentations: ['Pipeta 0.67ml', 'Pipeta 1.34ml', 'Pipeta 2.68ml'], description: { es: 'Tratamiento topico para el control de pulgas y garrapatas. Proteccion de hasta 30 dias.', en: 'Topical treatment for flea and tick control. Protection for up to 30 days.' }, images: ['placeholder-1', 'placeholder-2'], hasPdf: false, isActive: true, isFeatured: true, hasEnTranslation: true },
    { id: 'p5', slug: { es: 'enrofloxacina-10-solucion', en: 'enrofloxacin-10-solution' }, name: { es: 'Enrofloxacina 10% Solucion', en: 'Enrofloxacin 10% Solution' }, brand: 'Bayer Animal Health', brandSlug: 'bayer-animal-health', category: 'farmacos', species: ['Caninos', 'Felinos', 'Aves'], family: 'Antibioticos', presentations: ['50ml', '100ml'], description: { es: 'Fluoroquinolona de amplio espectro para el tratamiento de infecciones bacterianas graves.', en: 'Broad-spectrum fluoroquinolone for the treatment of severe bacterial infections.' }, images: ['placeholder-1'], hasPdf: true, isActive: true, isFeatured: false, hasEnTranslation: true },
    { id: 'p6', slug: { es: 'dexametasona-inyectable', en: 'dexamethasone-injectable' }, name: { es: 'Dexametasona Inyectable', en: 'Dexamethasone Injectable' }, brand: 'Zoetis', brandSlug: 'zoetis', category: 'farmacos', species: ['Caninos', 'Felinos', 'Equinos', 'Bovinos'], family: 'Antiinflamatorios', presentations: ['10ml', '50ml'], description: { es: 'Corticosteroide sintetico de alta potencia para estados inflamatorios y alergicos severos.', en: 'High-potency synthetic corticosteroid for severe inflammatory and allergic conditions.' }, images: ['placeholder-1', 'placeholder-2'], hasPdf: true, isActive: true, isFeatured: false, hasEnTranslation: true },
    { id: 'p7', slug: { es: 'ceftiofur-cristalino', en: 'ceftiofur-crystalline' }, name: { es: 'Ceftiofur Cristalino', en: 'Ceftiofur Crystalline' }, brand: 'Zoetis', brandSlug: 'zoetis', category: 'farmacos', species: ['Bovinos', 'Porcinos'], family: 'Antibioticos', presentations: ['Frasco 100ml'], description: { es: 'Cefalosporina de tercera generacion de larga accion para infecciones respiratorias bovinas.', en: 'Third-generation long-acting cephalosporin for bovine respiratory infections.' }, images: ['placeholder-1'], hasPdf: true, isActive: true, isFeatured: false, hasEnTranslation: true },
    { id: 'p8', slug: { es: 'albendazol-suspension-oral', en: 'albendazole-oral-suspension' }, name: { es: 'Albendazol Suspension Oral', en: 'Albendazole Oral Suspension' }, brand: 'Virbac', brandSlug: 'virbac', category: 'farmacos', species: ['Bovinos', 'Equinos', 'Porcinos'], family: 'Desparasitantes', presentations: ['250ml', '500ml', '1L'], description: { es: 'Antihelmintico de amplio espectro para el control de nematodos, cestodos y trematodos.', en: 'Broad-spectrum anthelmintic for the control of nematodes, cestodes and trematodes.' }, images: ['placeholder-1'], hasPdf: false, isActive: true, isFeatured: false, hasEnTranslation: true },
    { id: 'p9', slug: { es: 'ketoprofeno-inyectable', en: 'ketoprofen-injectable' }, name: { es: 'Ketoprofeno Inyectable', en: 'Ketoprofen Injectable' }, brand: 'Boehringer Ingelheim', brandSlug: 'boehringer-ingelheim', category: 'farmacos', species: ['Caninos', 'Equinos', 'Bovinos'], family: 'Analgosicos', presentations: ['20ml', '50ml'], description: { es: 'AINE con potente efecto analgesico y antiinflamatorio para el manejo del dolor agudo.', en: 'NSAID with potent analgesic and anti-inflammatory effect for acute pain management.' }, images: ['placeholder-1', 'placeholder-2'], hasPdf: true, isActive: true, isFeatured: false, hasEnTranslation: true },
    { id: 'p10', slug: { es: 'vitamina-b12-inyectable', en: 'vitamin-b12-injectable' }, name: { es: 'Vitamina B12 Inyectable', en: 'Vitamin B12 Injectable' }, brand: 'Zoetis', brandSlug: 'zoetis', category: 'farmacos', species: ['Caninos', 'Felinos', 'Bovinos', 'Equinos'], family: 'Vitaminas', presentations: ['10ml', '50ml', '100ml'], description: { es: 'Suplemento vitaminico inyectable para estados carenciales y estimulacion del apetito.', en: 'Injectable vitamin supplement for deficiency states and appetite stimulation.' }, images: ['placeholder-1'], hasPdf: false, isActive: true, isFeatured: false, hasEnTranslation: false },
    { id: 'p11', slug: { es: 'amoxicilina-clavulanico', en: 'amoxicillin-clavulanate' }, name: { es: 'Amoxicilina + Clavulanico', en: 'Amoxicillin + Clavulanate' }, brand: 'MSD Animal Health', brandSlug: 'msd-animal-health', category: 'farmacos', species: ['Caninos', 'Felinos'], family: 'Antibioticos', presentations: ['Tabletas x 10', 'Tabletas x 20'], description: { es: 'Combinacion sinergica de amoxicilina con acido clavulanico para infecciones resistentes.', en: 'Synergistic combination of amoxicillin with clavulanic acid for resistant infections.' }, images: ['placeholder-1'], hasPdf: true, isActive: true, isFeatured: false, hasEnTranslation: true },
    { id: 'p12', slug: { es: 'oxitetraciclina-la', en: 'oxytetracycline-la' }, name: { es: 'Oxitetraciclina LA', en: 'Oxytetracycline LA' }, brand: 'Bayer Animal Health', brandSlug: 'bayer-animal-health', category: 'farmacos', species: ['Bovinos', 'Porcinos', 'Aves'], family: 'Antibioticos', presentations: ['50ml', '100ml', '250ml'], description: { es: 'Antibiotico de larga accion para infecciones respiratorias y podales en ganado.', en: 'Long-acting antibiotic for respiratory and foot infections in cattle.' }, images: ['placeholder-1'], hasPdf: true, isActive: true, isFeatured: false, hasEnTranslation: true },
    { id: 'p13', slug: { es: 'tramadol-gotas-orales', en: 'tramadol-oral-drops' }, name: { es: 'Tramadol Gotas Orales', en: 'Tramadol Oral Drops' }, brand: 'Virbac', brandSlug: 'virbac', category: 'farmacos', species: ['Caninos', 'Felinos'], family: 'Analgosicos', presentations: ['Frasco 20ml'], description: { es: 'Analgesico opioide para el manejo del dolor moderado a severo en pequenas especies.', en: 'Opioid analgesic for the management of moderate to severe pain in small species.' }, images: ['placeholder-1'], hasPdf: false, isActive: true, isFeatured: false, hasEnTranslation: true },
    { id: 'p14', slug: { es: 'complejo-b-inyectable', en: 'b-complex-injectable' }, name: { es: 'Complejo B Inyectable', en: 'B-Complex Injectable' }, brand: 'Zoetis', brandSlug: 'zoetis', category: 'farmacos', species: ['Caninos', 'Felinos', 'Bovinos', 'Equinos', 'Porcinos'], family: 'Vitaminas', presentations: ['10ml', '50ml', '100ml', '250ml'], description: { es: 'Suplemento vitaminico del complejo B para estados carenciales y soporte metabolico.', en: 'B-complex vitamin supplement for deficiency states and metabolic support.' }, images: ['placeholder-1'], hasPdf: false, isActive: true, isFeatured: false, hasEnTranslation: true },
    { id: 'p15', slug: { es: 'praziquantel-tabletas', en: 'praziquantel-tablets' }, name: { es: 'Praziquantel Tabletas', en: 'Praziquantel Tablets' }, brand: 'Bayer Animal Health', brandSlug: 'bayer-animal-health', category: 'farmacos', species: ['Caninos', 'Felinos'], family: 'Desparasitantes', presentations: ['Tabletas x 4', 'Tabletas x 10'], description: { es: 'Antiparasitario oral para el control de cestodos en perros y gatos.', en: 'Oral antiparasitic for the control of cestodes in dogs and cats.' }, images: ['placeholder-1', 'placeholder-2'], hasPdf: true, isActive: true, isFeatured: false, hasEnTranslation: true },
    { id: 'p16', slug: { es: 'carprofeno-masticable', en: 'carprofen-chewable' }, name: { es: 'Carprofeno Masticable', en: 'Carprofen Chewable' }, brand: 'Zoetis', brandSlug: 'zoetis', category: 'farmacos', species: ['Caninos'], family: 'Antiinflamatorios', presentations: ['25mg x 14', '75mg x 14', '100mg x 14'], description: { es: 'AINE masticable para el manejo del dolor y la inflamacion asociada a osteoartritis canina.', en: 'Chewable NSAID for the management of pain and inflammation associated with canine osteoarthritis.' }, images: ['placeholder-1'], hasPdf: true, isActive: true, isFeatured: false, hasEnTranslation: true },
    { id: 'p17', slug: { es: 'gentamicina-oftalmica', en: 'gentamicin-ophthalmic' }, name: { es: 'Gentamicina Oftalmica', en: 'Gentamicin Ophthalmic' }, brand: 'Virbac', brandSlug: 'virbac', category: 'farmacos', species: ['Caninos', 'Felinos', 'Equinos'], family: 'Antibioticos', presentations: ['Frasco 5ml'], description: { es: 'Solucion oftalmica antibiotica para el tratamiento de conjuntivitis bacteriana.', en: 'Antibiotic ophthalmic solution for the treatment of bacterial conjunctivitis.' }, images: ['placeholder-1'], hasPdf: false, isActive: true, isFeatured: false, hasEnTranslation: true },
    { id: 'p18', slug: { es: 'fenilbutazona-pasta-oral', en: 'phenylbutazone-oral-paste' }, name: { es: 'Fenilbutazona Pasta Oral', en: 'Phenylbutazone Oral Paste' }, brand: 'Boehringer Ingelheim', brandSlug: 'boehringer-ingelheim', category: 'farmacos', species: ['Equinos'], family: 'Analgosicos', presentations: ['Jeringa 30g'], description: { es: 'Analgesico y antiinflamatorio en pasta oral para equinos con problemas musculoesqueleticos.', en: 'Analgesic and anti-inflammatory oral paste for equines with musculoskeletal problems.' }, images: ['placeholder-1'], hasPdf: false, isActive: true, isFeatured: false, hasEnTranslation: true },
    { id: 'p19', slug: { es: 'clortetraciclina-premezcla', en: 'chlortetracycline-premix' }, name: { es: 'Clortetraciclina Premezcla', en: 'Chlortetracycline Premix' }, brand: 'Bayer Animal Health', brandSlug: 'bayer-animal-health', category: 'farmacos', species: ['Aves', 'Porcinos'], family: 'Antibioticos', presentations: ['Saco 25kg'], description: { es: 'Antibiotico en premezcla para uso en alimento de aves y cerdos.', en: 'Antibiotic premix for use in poultry and swine feed.' }, images: ['placeholder-1'], hasPdf: true, isActive: true, isFeatured: false, hasEnTranslation: false },
    { id: 'p20', slug: { es: 'levamisol-inyectable', en: 'levamisole-injectable' }, name: { es: 'Levamisol Inyectable', en: 'Levamisole Injectable' }, brand: 'MSD Animal Health', brandSlug: 'msd-animal-health', category: 'farmacos', species: ['Bovinos', 'Porcinos'], family: 'Desparasitantes', presentations: ['50ml', '100ml'], description: { es: 'Antihelmintico de amplio espectro con propiedades inmunoestimulantes.', en: 'Broad-spectrum anthelmintic with immunostimulant properties.' }, images: ['placeholder-1'], hasPdf: false, isActive: true, isFeatured: false, hasEnTranslation: true },
    { id: 'p21', slug: { es: 'prednisolona-tabletas', en: 'prednisolone-tablets' }, name: { es: 'Prednisolona Tabletas', en: 'Prednisolone Tablets' }, brand: 'Virbac', brandSlug: 'virbac', category: 'farmacos', species: ['Caninos', 'Felinos'], family: 'Antiinflamatorios', presentations: ['5mg x 30', '20mg x 20'], description: { es: 'Corticosteroide oral para el tratamiento de condiciones inflamatorias y alergicas.', en: 'Oral corticosteroid for the treatment of inflammatory and allergic conditions.' }, images: ['placeholder-1'], hasPdf: false, isActive: true, isFeatured: false, hasEnTranslation: true },
    { id: 'p22', slug: { es: 'acepromazina-inyectable', en: 'acepromazine-injectable' }, name: { es: 'Acepromazina Inyectable', en: 'Acepromazine Injectable' }, brand: 'Boehringer Ingelheim', brandSlug: 'boehringer-ingelheim', category: 'farmacos', species: ['Caninos', 'Felinos', 'Equinos'], family: 'Analgosicos', presentations: ['10ml'], description: { es: 'Tranquilizante fenotiazinico para sedacion y premedicacion anestesica.', en: 'Phenothiazine tranquilizer for sedation and anesthetic premedication.' }, images: ['placeholder-1'], hasPdf: true, isActive: true, isFeatured: false, hasEnTranslation: true },
    { id: 'p23', slug: { es: 'hierro-dextrano-inyectable', en: 'iron-dextran-injectable' }, name: { es: 'Hierro Dextrano Inyectable', en: 'Iron Dextran Injectable' }, brand: 'Zoetis', brandSlug: 'zoetis', category: 'farmacos', species: ['Porcinos'], family: 'Vitaminas', presentations: ['100ml', '250ml'], description: { es: 'Suplemento de hierro inyectable para la prevencion de anemia neonatal en lechones.', en: 'Injectable iron supplement for the prevention of neonatal anemia in piglets.' }, images: ['placeholder-1'], hasPdf: false, isActive: true, isFeatured: false, hasEnTranslation: true },
    { id: 'p24', slug: { es: 'cipermetrina-pour-on', en: 'cypermethrin-pour-on' }, name: { es: 'Cipermetrina Pour-On', en: 'Cypermethrin Pour-On' }, brand: 'MSD Animal Health', brandSlug: 'msd-animal-health', category: 'farmacos', species: ['Bovinos'], family: 'Desparasitantes', presentations: ['1L', '5L'], description: { es: 'Ectoparasiticida pour-on para el control de moscas, garrapatas y acaros en bovinos.', en: 'Pour-on ectoparasiticide for the control of flies, ticks and mites in cattle.' }, images: ['placeholder-1'], hasPdf: true, isActive: true, isFeatured: false, hasEnTranslation: true },
    { id: 'p25', slug: { es: 'closantel-inyectable', en: 'closantel-injectable' }, name: { es: 'Closantel Inyectable', en: 'Closantel Injectable' }, brand: 'Bayer Animal Health', brandSlug: 'bayer-animal-health', category: 'farmacos', species: ['Bovinos', 'Equinos'], family: 'Desparasitantes', presentations: ['50ml', '250ml'], description: { es: 'Fasciolicida y nematicida inyectable de amplio espectro para bovinos y ovinos.', en: 'Broad-spectrum injectable fasciolicide and nematicide for cattle and sheep.' }, images: ['placeholder-1'], hasPdf: false, isActive: true, isFeatured: false, hasEnTranslation: true },
    { id: 'p26', slug: { es: 'vitamina-ad3e-inyectable', en: 'vitamin-ad3e-injectable' }, name: { es: 'Vitamina AD3E Inyectable', en: 'Vitamin AD3E Injectable' }, brand: 'Boehringer Ingelheim', brandSlug: 'boehringer-ingelheim', category: 'farmacos', species: ['Bovinos', 'Equinos', 'Porcinos'], family: 'Vitaminas', presentations: ['50ml', '100ml', '250ml'], description: { es: 'Complejo vitaminico liposoluble para la prevencion de deficiencias en ganado.', en: 'Fat-soluble vitamin complex for the prevention of deficiencies in livestock.' }, images: ['placeholder-1'], hasPdf: false, isActive: true, isFeatured: false, hasEnTranslation: true },
    { id: 'p27', slug: { es: 'metronidazol-suspension', en: 'metronidazole-suspension' }, name: { es: 'Metronidazol Suspension', en: 'Metronidazole Suspension' }, brand: 'Virbac', brandSlug: 'virbac', category: 'farmacos', species: ['Caninos', 'Felinos'], family: 'Antibioticos', presentations: ['60ml', '120ml'], description: { es: 'Antiprotozoario y antibacteriano para el tratamiento de giardiasis y infecciones anaerobias.', en: 'Antiprotozoal and antibacterial for the treatment of giardiasis and anaerobic infections.' }, images: ['placeholder-1'], hasPdf: false, isActive: true, isFeatured: false, hasEnTranslation: true },
    { id: 'p28', slug: { es: 'flunixin-meglumine', en: 'flunixin-meglumine' }, name: { es: 'Flunixin Meglumine', en: 'Flunixin Meglumine' }, brand: 'MSD Animal Health', brandSlug: 'msd-animal-health', category: 'farmacos', species: ['Bovinos', 'Equinos', 'Porcinos'], family: 'Analgosicos', presentations: ['50ml', '100ml'], description: { es: 'AINE potente para el manejo del dolor visceral y fiebre en especies mayores.', en: 'Potent NSAID for the management of visceral pain and fever in large species.' }, images: ['placeholder-1'], hasPdf: true, isActive: false, isFeatured: false, hasEnTranslation: true },

    // ALIMENTOS (14 products)
    { id: 'p29', slug: { es: 'pro-plan-adulto-raza-mediana', en: 'pro-plan-adult-medium-breed' }, name: { es: 'Pro Plan Adulto Raza Mediana', en: 'Pro Plan Adult Medium Breed' }, brand: 'Purina Pro Plan', brandSlug: 'purina-pro-plan', category: 'alimentos', species: ['Caninos'], lifeStage: 'Adulto', presentations: ['3kg', '7.5kg', '15kg'], description: { es: 'Alimento premium para perros adultos de raza mediana con proteina de pollo como ingrediente principal.', en: 'Premium food for medium breed adult dogs with chicken protein as the main ingredient.' }, images: ['placeholder-1', 'placeholder-2', 'placeholder-3'], hasPdf: false, isActive: true, isFeatured: true, hasEnTranslation: true, storytelling: [{ image: 'story-placeholder-2', text: { es: 'Pro Plan combina la ciencia de Purina con ingredientes de la mas alta calidad para ofrecer una nutricion de precision.', en: 'Pro Plan combines Purina science with the highest quality ingredients to deliver precision nutrition.' } }, { image: 'story-placeholder-3', text: { es: 'Cada formula esta disenada para apoyar la salud digestiva, la piel y el pelaje, y la vitalidad de tu mascota.', en: 'Each formula is designed to support digestive health, skin and coat, and your pet\'s vitality.' } }, { text: { es: 'Disponible en multiples formulas especializadas segun tamano de raza y necesidad nutricional.', en: 'Available in multiple specialized formulas based on breed size and nutritional need.' } }] },
    { id: 'p30', slug: { es: 'royal-canin-renal-support', en: 'royal-canin-renal-support' }, name: { es: 'Royal Canin Renal Support', en: 'Royal Canin Renal Support' }, brand: 'Royal Canin', brandSlug: 'royal-canin', category: 'alimentos', species: ['Caninos'], lifeStage: 'Adulto', presentations: ['2kg', '7kg', '14kg'], description: { es: 'Dieta veterinaria formulada para el soporte de la funcion renal en perros con enfermedad renal cronica.', en: 'Veterinary diet formulated to support renal function in dogs with chronic kidney disease.' }, images: ['placeholder-1', 'placeholder-2'], hasPdf: true, isActive: true, isFeatured: true, hasEnTranslation: true },
    { id: 'p31', slug: { es: 'hills-science-diet-puppy', en: 'hills-science-diet-puppy' }, name: { es: 'Hills Science Diet Puppy', en: 'Hills Science Diet Puppy' }, brand: 'Hills Pet Nutrition', brandSlug: 'hills-pet-nutrition', category: 'alimentos', species: ['Caninos'], lifeStage: 'Cachorro/Kitten', presentations: ['2.04kg', '6.8kg', '13.6kg'], description: { es: 'Alimento cientificamente formulado para cachorros en crecimiento con DHA para el desarrollo cerebral.', en: 'Scientifically formulated food for growing puppies with DHA for brain development.' }, images: ['placeholder-1'], hasPdf: false, isActive: true, isFeatured: false, hasEnTranslation: true },
    { id: 'p32', slug: { es: 'nutrisource-grain-free-adulto', en: 'nutrisource-grain-free-adult' }, name: { es: 'NutriSource Grain Free Adulto', en: 'NutriSource Grain Free Adult' }, brand: 'NutriSource', brandSlug: 'nutrisource', category: 'alimentos', species: ['Caninos'], lifeStage: 'Adulto', presentations: ['2.27kg', '6.8kg', '13.6kg'], description: { es: 'Alimento sin granos con probioticos patentados Good 4 Life para una nutricion optima.', en: 'Grain-free food with patented Good 4 Life probiotics for optimal nutrition.' }, images: ['placeholder-1', 'placeholder-2'], hasPdf: false, isActive: true, isFeatured: false, hasEnTranslation: true },
    { id: 'p33', slug: { es: 'royal-canin-kitten', en: 'royal-canin-kitten' }, name: { es: 'Royal Canin Kitten', en: 'Royal Canin Kitten' }, brand: 'Royal Canin', brandSlug: 'royal-canin', category: 'alimentos', species: ['Felinos'], lifeStage: 'Cachorro/Kitten', presentations: ['1.5kg', '4kg', '10kg'], description: { es: 'Alimento completo para gatitos de hasta 12 meses. Apoya el sistema inmunitario en desarrollo.', en: 'Complete food for kittens up to 12 months. Supports the developing immune system.' }, images: ['placeholder-1'], hasPdf: false, isActive: true, isFeatured: false, hasEnTranslation: true },
    { id: 'p34', slug: { es: 'pro-plan-senior-7plus', en: 'pro-plan-senior-7plus' }, name: { es: 'Pro Plan Senior 7+', en: 'Pro Plan Senior 7+' }, brand: 'Purina Pro Plan', brandSlug: 'purina-pro-plan', category: 'alimentos', species: ['Caninos'], lifeStage: 'Senior', presentations: ['3kg', '7.5kg', '13kg'], description: { es: 'Formula especializada para perros senior con antioxidantes que apoyan la vitalidad.', en: 'Specialized formula for senior dogs with antioxidants that support vitality.' }, images: ['placeholder-1'], hasPdf: false, isActive: true, isFeatured: false, hasEnTranslation: true },
    { id: 'p35', slug: { es: 'hills-urinary-care', en: 'hills-urinary-care' }, name: { es: 'Hills Urinary Care', en: 'Hills Urinary Care' }, brand: 'Hills Pet Nutrition', brandSlug: 'hills-pet-nutrition', category: 'alimentos', species: ['Felinos'], lifeStage: 'Adulto', presentations: ['1.58kg', '7.03kg'], description: { es: 'Dieta clinica para el manejo de problemas urinarios en gatos adultos.', en: 'Clinical diet for the management of urinary problems in adult cats.' }, images: ['placeholder-1'], hasPdf: true, isActive: true, isFeatured: false, hasEnTranslation: true },
    { id: 'p36', slug: { es: 'royal-canin-gastrointestinal', en: 'royal-canin-gastrointestinal' }, name: { es: 'Royal Canin Gastrointestinal', en: 'Royal Canin Gastrointestinal' }, brand: 'Royal Canin', brandSlug: 'royal-canin', category: 'alimentos', species: ['Caninos'], lifeStage: 'Adulto', presentations: ['2kg', '7.5kg', '15kg'], description: { es: 'Dieta veterinaria de alta digestibilidad para trastornos gastrointestinales agudos y cronicos.', en: 'Highly digestible veterinary diet for acute and chronic gastrointestinal disorders.' }, images: ['placeholder-1'], hasPdf: true, isActive: true, isFeatured: false, hasEnTranslation: true },
    { id: 'p37', slug: { es: 'nutrisource-puppy', en: 'nutrisource-puppy' }, name: { es: 'NutriSource Puppy', en: 'NutriSource Puppy' }, brand: 'NutriSource', brandSlug: 'nutrisource', category: 'alimentos', species: ['Caninos'], lifeStage: 'Cachorro/Kitten', presentations: ['2.27kg', '6.8kg', '13.6kg'], description: { es: 'Alimento para cachorros con proteina de pollo y arroz integral para un crecimiento saludable.', en: 'Puppy food with chicken protein and brown rice for healthy growth.' }, images: ['placeholder-1'], hasPdf: false, isActive: true, isFeatured: false, hasEnTranslation: true },
    { id: 'p38', slug: { es: 'virbac-veterinary-hpm-adulto', en: 'virbac-veterinary-hpm-adult' }, name: { es: 'Virbac Veterinary HPM Adulto', en: 'Virbac Veterinary HPM Adult' }, brand: 'Virbac', brandSlug: 'virbac', category: 'alimentos', species: ['Caninos'], lifeStage: 'Adulto', presentations: ['3kg', '7kg', '12kg'], description: { es: 'Alimento de alta proteina y bajo carbohidrato que respeta la naturaleza carnivora del perro.', en: 'High-protein, low-carbohydrate food that respects the carnivorous nature of dogs.' }, images: ['placeholder-1'], hasPdf: false, isActive: true, isFeatured: false, hasEnTranslation: false },
    { id: 'p39', slug: { es: 'pro-plan-veterinary-ha', en: 'pro-plan-veterinary-ha' }, name: { es: 'Pro Plan Veterinary HA', en: 'Pro Plan Veterinary HA' }, brand: 'Purina Pro Plan', brandSlug: 'purina-pro-plan', category: 'alimentos', species: ['Caninos'], lifeStage: 'Todas las etapas', presentations: ['2.72kg', '7.48kg'], description: { es: 'Dieta hipoalergenica con proteina hidrolizada para manejo de alergias alimentarias caninas.', en: 'Hypoallergenic diet with hydrolyzed protein for management of canine food allergies.' }, images: ['placeholder-1'], hasPdf: true, isActive: true, isFeatured: false, hasEnTranslation: true },
    { id: 'p40', slug: { es: 'hills-metabolic-felino', en: 'hills-metabolic-feline' }, name: { es: 'Hills Metabolic Felino', en: 'Hills Metabolic Feline' }, brand: 'Hills Pet Nutrition', brandSlug: 'hills-pet-nutrition', category: 'alimentos', species: ['Felinos'], lifeStage: 'Adulto', presentations: ['1.81kg', '5.44kg'], description: { es: 'Nutricion clinica para el manejo del peso corporal en gatos con sobrepeso.', en: 'Clinical nutrition for body weight management in overweight cats.' }, images: ['placeholder-1'], hasPdf: false, isActive: true, isFeatured: false, hasEnTranslation: true },
    { id: 'p41', slug: { es: 'royal-canin-maine-coon', en: 'royal-canin-maine-coon' }, name: { es: 'Royal Canin Maine Coon', en: 'Royal Canin Maine Coon' }, brand: 'Royal Canin', brandSlug: 'royal-canin', category: 'alimentos', species: ['Felinos'], lifeStage: 'Adulto', presentations: ['2kg', '4kg', '10kg'], description: { es: 'Alimento especifico para gatos Maine Coon adultos con croquetas adaptadas a su mandibula.', en: 'Specific food for adult Maine Coon cats with kibble adapted to their jaw.' }, images: ['placeholder-1'], hasPdf: false, isActive: true, isFeatured: false, hasEnTranslation: true },
    { id: 'p42', slug: { es: 'nutrisource-senior', en: 'nutrisource-senior' }, name: { es: 'NutriSource Senior', en: 'NutriSource Senior' }, brand: 'NutriSource', brandSlug: 'nutrisource', category: 'alimentos', species: ['Caninos'], lifeStage: 'Senior', presentations: ['2.27kg', '6.8kg', '13.6kg'], description: { es: 'Formula para perros senior con glucosamina y condroitina para la salud articular.', en: 'Formula for senior dogs with glucosamine and chondroitin for joint health.' }, images: ['placeholder-1'], hasPdf: false, isActive: true, isFeatured: false, hasEnTranslation: true },

    // EQUIPOS (6 products)
    { id: 'p43', slug: { es: 'otoscopio-veterinario-digital', en: 'digital-veterinary-otoscope' }, name: { es: 'Otoscopio Veterinario Digital', en: 'Digital Veterinary Otoscope' }, brand: 'Welch Allyn', brandSlug: 'welch-allyn', category: 'equipos', species: [], equipmentType: 'Diagnostico', presentations: ['Kit completo'], description: { es: 'Otoscopio digital de alta definicion con iluminacion LED para examen auricular veterinario.', en: 'High-definition digital otoscope with LED illumination for veterinary ear examination.' }, images: ['placeholder-1', 'placeholder-2'], hasPdf: true, isActive: true, isFeatured: true, hasEnTranslation: true },
    { id: 'p44', slug: { es: 'dermatoscopio-led', en: 'led-dermatoscope' }, name: { es: 'Dermatoscopio LED', en: 'LED Dermatoscope' }, brand: 'Heine', brandSlug: 'heine', category: 'equipos', species: [], equipmentType: 'Diagnostico', presentations: ['Unidad'], description: { es: 'Dermatoscopio con iluminacion LED polarizada para diagnostico dermatologico veterinario.', en: 'Dermatoscope with polarized LED illumination for veterinary dermatological diagnosis.' }, images: ['placeholder-1'], hasPdf: true, isActive: true, isFeatured: false, hasEnTranslation: true },
    { id: 'p45', slug: { es: 'estetoscopio-veterinario-pro', en: 'professional-veterinary-stethoscope' }, name: { es: 'Estetoscopio Veterinario Pro', en: 'Professional Veterinary Stethoscope' }, brand: 'Welch Allyn', brandSlug: 'welch-allyn', category: 'equipos', species: [], equipmentType: 'Diagnostico', presentations: ['Adulto', 'Pediatrico'], description: { es: 'Estetoscopio de doble campana disenado especificamente para uso veterinario profesional.', en: 'Dual-bell stethoscope designed specifically for professional veterinary use.' }, images: ['placeholder-1'], hasPdf: false, isActive: true, isFeatured: false, hasEnTranslation: true },
    { id: 'p46', slug: { es: 'kit-cirugia-general-veterinaria', en: 'general-veterinary-surgery-kit' }, name: { es: 'Kit Cirugia General Veterinaria', en: 'General Veterinary Surgery Kit' }, brand: 'IMV Technologies', brandSlug: 'imv-technologies', category: 'equipos', species: [], equipmentType: 'Quirurgico', presentations: ['Kit 15 piezas', 'Kit 25 piezas'], description: { es: 'Set completo de instrumentos quirurgicos de acero inoxidable para cirugia general veterinaria.', en: 'Complete set of stainless steel surgical instruments for general veterinary surgery.' }, images: ['placeholder-1', 'placeholder-2'], hasPdf: true, isActive: true, isFeatured: false, hasEnTranslation: true },
    { id: 'p47', slug: { es: 'microscopio-binocular-laboratorio', en: 'binocular-laboratory-microscope' }, name: { es: 'Microscopio Binocular Laboratorio', en: 'Binocular Laboratory Microscope' }, brand: 'Heine', brandSlug: 'heine', category: 'equipos', species: [], equipmentType: 'Laboratorio', presentations: ['Unidad'], description: { es: 'Microscopio binocular con 4 objetivos para analisis clinicos veterinarios en laboratorio.', en: 'Binocular microscope with 4 objectives for veterinary clinical analysis in the laboratory.' }, images: ['placeholder-1'], hasPdf: true, isActive: true, isFeatured: false, hasEnTranslation: true },
    { id: 'p48', slug: { es: 'pinza-hemostatica-kelly', en: 'kelly-hemostatic-forceps' }, name: { es: 'Pinza Hemostatica Kelly', en: 'Kelly Hemostatic Forceps' }, brand: 'IMV Technologies', brandSlug: 'imv-technologies', category: 'equipos', species: [], equipmentType: 'Instrumental', presentations: ['14cm', '16cm', '18cm'], description: { es: 'Pinza hemostatica Kelly curva de acero inoxidable quirurgico para clampar vasos sanguineos.', en: 'Kelly curved hemostatic forceps in surgical stainless steel for clamping blood vessels.' }, images: ['placeholder-1'], hasPdf: false, isActive: true, isFeatured: false, hasEnTranslation: true },
  ];

  private readonly messages: Message[] = [
    { id: 'm1', name: 'Dr. Roberto Campos', email: 'rcampos@veterinariacentral.cr', phone: '+506 8845-1200', type: 'Informacion', productOfInterest: 'Amoxicilina 250ml', message: 'Buenas tardes, me gustaria conocer las presentaciones disponibles de Amoxicilina y si manejan precios especiales para veterinarias con alto volumen de compra. Atendemos aproximadamente 200 consultas mensuales.', status: 'nuevo', date: '2026-03-17T10:30:00', relativeDate: 'Hace 2 horas' },
    { id: 'm2', name: 'John Mitchell', email: 'j.mitchell@pharmavet-usa.com', phone: '+1 555-0142', type: 'Fabricante', message: 'We are PharmaVet USA, a manufacturer of veterinary biologicals based in Texas. We are looking for distribution partners in Costa Rica and would like to explore a partnership with HESA for the local market.', status: 'nuevo', date: '2026-03-17T07:15:00', relativeDate: 'Hace 5 horas' },
    { id: 'm3', name: 'Cadena VetCR', email: 'compras@vetcr.com', phone: '+506 2222-3344', type: 'Comercial', productOfInterest: 'Pro Plan Adulto Raza Mediana', message: 'Somos una cadena de 8 veterinarias y nos gustaria conocer las condiciones comerciales para compras mayoristas de alimentos Purina Pro Plan. Actualmente compramos a otro distribuidor pero queremos evaluar opciones.', status: 'nuevo', date: '2026-03-16T14:00:00', relativeDate: 'Ayer' },
    { id: 'm4', name: 'Dra. Carolina Mendez', email: 'cmendez@clinicaveterinaria.cr', phone: '+506 7012-5589', type: 'Soporte', productOfInterest: 'Royal Canin Renal Support', message: 'Recibi un pedido con un producto danado (Royal Canin Renal Support 14kg, lote #RC2026-044). Necesito que me indiquen el procedimiento para el reclamo y si pueden enviar un reemplazo lo antes posible.', status: 'en-proceso', date: '2026-03-16T09:30:00', relativeDate: 'Hace 1 dia', notes: 'Contactada por telefono. Se coordino reemplazo para el viernes.' },
    { id: 'm5', name: 'Agroveterinaria El Campo', email: 'info@agro-elcampo.cr', phone: '+506 2460-1122', type: 'Informacion', productOfInterest: 'Ivermectina Pour-On 1L', message: 'Necesitamos la ficha tecnica actualizada del producto Ivermectina Pour-On para bovinos. Tambien queremos saber si tienen la presentacion de 2.5 litros disponible.', status: 'atendido', date: '2026-03-15T16:45:00', relativeDate: 'Hace 2 dias', notes: 'Ficha tecnica enviada por correo.' },
    { id: 'm6', name: 'Pet Shop Amigos', email: 'pedidos@petshopamigos.cr', phone: '+506 2233-4455', type: 'Comercial', message: 'Queremos abrir una cuenta comercial con HESA para surtir nuestra tienda de mascotas. Nos interesa principalmente la linea de alimentos Hills y Royal Canin.', status: 'atendido', date: '2026-03-14T11:20:00', relativeDate: 'Hace 3 dias', notes: 'Se envio catalogo digital y condiciones comerciales. Agente asignado: Mario.' },
    { id: 'm7', name: 'Dr. Luis Vargas', email: 'lvargas@equinovets.cr', phone: '+506 8899-0011', type: 'Informacion', message: 'Estoy buscando un proveedor de equipos de diagnostico para mi clinica equina. Me interesa conocer las marcas y modelos de otoscopios y estetoscopios que distribuyen.', status: 'atendido', date: '2026-03-14T08:00:00', relativeDate: 'Hace 3 dias' },
    { id: 'm8', name: 'Akiko Tanaka', email: 'a.tanaka@nipponvet.co.jp', phone: '+81 3-5555-0198', type: 'Fabricante', message: 'We are Nippon Veterinary Pharmaceuticals from Japan. We produce a line of ophthalmic solutions for veterinary use and are interested in entering the Costa Rican market through an established distributor.', status: 'atendido', date: '2026-03-13T15:30:00', relativeDate: 'Hace 4 dias', notes: 'Respondido en ingles. Solicitamos catalogo de productos y registro sanitario.' },
    { id: 'm9', name: 'Cooperativa Agrovia', email: 'proveedores@agrovia.cr', phone: '+506 2555-6677', type: 'Comercial', productOfInterest: 'Albendazol Suspension Oral', message: 'Representamos a una cooperativa de ganaderos en Guanacaste. Necesitamos cotizacion para un pedido grande de desparasitantes para bovinos.', status: 'atendido', date: '2026-03-13T10:00:00', relativeDate: 'Hace 4 dias' },
    { id: 'm10', name: 'Clinica Felina CatCare', email: 'recepcion@catcare.cr', phone: '+506 2288-9900', type: 'Otro', message: 'Nos gustaria saber si HESA patrocina eventos veterinarios. Estamos organizando un congreso de medicina felina para octubre y buscamos sponsors.', status: 'atendido', date: '2026-03-12T14:00:00', relativeDate: 'Hace 5 dias' },
    { id: 'm11', name: 'Dr. Fernando Salas', email: 'fsalas@vetclinic.cr', phone: '+506 7788-1122', type: 'Informacion', productOfInterest: 'Meloxicam Inyectable 20ml', message: 'Necesito informacion sobre el Meloxicam Inyectable de Boehringer. Quiero comparar con el producto que uso actualmente.', status: 'atendido', date: '2026-03-12T09:15:00', relativeDate: 'Hace 5 dias' },
    { id: 'm12', name: 'Agroservicio Los Alpes', email: 'ventas@losalpes.cr', phone: '+506 2442-3355', type: 'Soporte', message: 'Tengo un problema con la factura del ultimo pedido. Me cobraron doble un producto y necesito la nota de credito correspondiente.', status: 'atendido', date: '2026-03-11T11:30:00', relativeDate: 'Hace 6 dias', notes: 'Nota de credito emitida NC-2026-0147. Confirmado por email.' },
  ];

  private readonly team: TeamMember[] = [
    { id: 't1', name: 'Carlos Herrera M.', title: { es: 'Director General', en: 'General Director' }, order: 1 },
    { id: 't2', name: 'Ana Elizondo R.', title: { es: 'Directora Comercial', en: 'Commercial Director' }, order: 2 },
    { id: 't3', name: 'Juan Herrera E.', title: { es: 'Gerente de Operaciones', en: 'Operations Manager' }, order: 3 },
    { id: 't4', name: 'Laura Villalobos S.', title: { es: 'Gerente de Ventas', en: 'Sales Manager' }, order: 4 },
    { id: 't5', name: 'Roberto Mora C.', title: { es: 'Director Financiero', en: 'Finance Director' }, order: 5 },
    { id: 't6', name: 'Patricia Chaves L.', title: { es: 'Gerente de Logistica', en: 'Logistics Manager' }, order: 6 },
  ];

  private readonly heroData: HeroData = {
    tag: { es: 'DESDE 1989', en: 'SINCE 1989' },
    headline: { es: 'Tu aliado veterinario de confianza en Costa Rica', en: 'Your Trusted Veterinary Partner in Costa Rica' },
    subtitle: { es: 'Distribuimos farmacos, alimentos y equipos veterinarios para profesionales que exigen calidad', en: 'We distribute pharmaceuticals, food and veterinary equipment for professionals who demand quality' },
    ctaPrimary: { es: 'Explorar catalogo', en: 'Explore Catalog' },
    ctaSecondary: { es: 'Distribuya con nosotros', en: 'Partner with us' },
    image: 'hero-placeholder'
  };

  private readonly siteConfig: SiteConfig = {
    logo: 'HESA',
    name: 'HESA — Herrera y Elizondo S.A.',
    slogan: { es: 'Distribucion de salud animal en Costa Rica', en: 'Animal health distribution in Costa Rica' },
    phone: '+506 2260-9020',
    email: 'info@hesa.co.cr',
    address: { es: 'Calle 2, av 12. Heredia, Costa Rica', en: 'Calle 2, av 12. Heredia, Costa Rica' },
    whatsapp: '50622609020',
    facebook: 'https://facebook.com/hesacr',
    instagram: 'https://instagram.com/hesacr',
    metaTitle: { es: 'HESA — Distribucion Veterinaria en Costa Rica', en: 'HESA — Veterinary Distribution in Costa Rica' },
    metaDescription: { es: 'Distribuimos farmacos, alimentos y equipos veterinarios de las mejores marcas internacionales en Costa Rica desde 1989.', en: 'We distribute pharmaceuticals, food and veterinary equipment from the best international brands in Costa Rica since 1989.' }
  };

  private readonly categories: CategoryData[] = [
    {
      id: 'c1',
      name: { es: 'Farmacos Veterinarios', en: 'Veterinary Pharmaceuticals' },
      slug: { es: 'farmacos', en: 'pharmaceuticals' },
      subcategories: [
        { label: { es: 'Familia Farmaceutica', en: 'Pharmaceutical Family' }, key: 'family', values: [{ es: 'Antibioticos', en: 'Antibiotics' }, { es: 'Desparasitantes', en: 'Dewormers' }, { es: 'Vitaminas', en: 'Vitamins' }, { es: 'Analgosicos', en: 'Analgesics' }, { es: 'Antiinflamatorios', en: 'Anti-inflammatories' }] },
        { label: { es: 'Especie', en: 'Species' }, key: 'species', values: [{ es: 'Caninos', en: 'Canine' }, { es: 'Felinos', en: 'Feline' }, { es: 'Bovinos', en: 'Bovine' }, { es: 'Equinos', en: 'Equine' }, { es: 'Porcinos', en: 'Porcine' }, { es: 'Aves', en: 'Poultry' }] }
      ]
    },
    {
      id: 'c2',
      name: { es: 'Alimentos para Animales', en: 'Animal Food' },
      slug: { es: 'alimentos', en: 'food' },
      subcategories: [
        { label: { es: 'Etapa de Vida', en: 'Life Stage' }, key: 'lifeStage', values: [{ es: 'Cachorro/Kitten', en: 'Puppy/Kitten' }, { es: 'Adulto', en: 'Adult' }, { es: 'Senior', en: 'Senior' }, { es: 'Todas las etapas', en: 'All life stages' }] },
        { label: { es: 'Especie', en: 'Species' }, key: 'species', values: [{ es: 'Caninos', en: 'Canine' }, { es: 'Felinos', en: 'Feline' }] }
      ]
    },
    {
      id: 'c3',
      name: { es: 'Equipos Veterinarios', en: 'Veterinary Equipment' },
      slug: { es: 'equipos', en: 'equipment' },
      subcategories: [
        { label: { es: 'Tipo de Equipo', en: 'Equipment Type' }, key: 'equipmentType', values: [{ es: 'Diagnostico', en: 'Diagnostic' }, { es: 'Quirurgico', en: 'Surgical' }, { es: 'Laboratorio', en: 'Laboratory' }, { es: 'Instrumental', en: 'Instruments' }] }
      ]
    }
  ];

  // Simulate loading delay
  private delay(ms: number = 800): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getProducts(): Promise<Product[]> {
    await this.delay();
    return [...this.products];
  }

  async getProductsByCategory(categorySlug: string): Promise<Product[]> {
    await this.delay();
    const cat = categorySlug === 'pharmaceuticals' ? 'farmacos'
      : categorySlug === 'food' ? 'alimentos'
      : categorySlug === 'equipment' ? 'equipos'
      : categorySlug;
    return this.products.filter(p => p.category === cat);
  }

  async getProductBySlug(slug: string): Promise<Product | undefined> {
    await this.delay();
    return this.products.find(p => p.slug.es === slug || p.slug.en === slug);
  }

  async getProductById(id: string): Promise<Product | undefined> {
    await this.delay();
    return this.products.find(p => p.id === id);
  }

  async getFeaturedProducts(): Promise<Product[]> {
    await this.delay(600);
    return this.products.filter(p => p.isFeatured);
  }

  async getBrands(): Promise<Brand[]> {
    await this.delay();
    return [...this.brands];
  }

  async getBrandBySlug(slug: string): Promise<Brand | undefined> {
    await this.delay();
    return this.brands.find(b => b.slug === slug);
  }

  async getFeaturedBrands(): Promise<Brand[]> {
    await this.delay(600);
    return this.brands.filter(b => b.isFeatured);
  }

  async getProductsByBrand(brandSlug: string): Promise<Product[]> {
    await this.delay();
    return this.products.filter(p => p.brandSlug === brandSlug);
  }

  async getMessages(): Promise<Message[]> {
    await this.delay();
    return [...this.messages];
  }

  async getMessageById(id: string): Promise<Message | undefined> {
    await this.delay();
    return this.messages.find(m => m.id === id);
  }

  async getTeam(): Promise<TeamMember[]> {
    await this.delay();
    return [...this.team].sort((a, b) => a.order - b.order);
  }

  getHero(): HeroData {
    return this.heroData;
  }

  getSiteConfig(): SiteConfig {
    return this.siteConfig;
  }

  getCategories(): CategoryData[] {
    return [...this.categories];
  }

  searchProducts(term: string): Product[] {
    const lower = term.toLowerCase();
    return this.products.filter(p =>
      p.name.es.toLowerCase().includes(lower) ||
      p.name.en.toLowerCase().includes(lower) ||
      p.brand.toLowerCase().includes(lower)
    ).slice(0, 5);
  }

  searchBrands(term: string): Brand[] {
    const lower = term.toLowerCase();
    return this.brands.filter(b =>
      b.name.toLowerCase().includes(lower)
    ).slice(0, 5);
  }

  getRelatedProducts(product: Product): Product[] {
    return this.products
      .filter(p => p.id !== product.id && (p.category === product.category || p.brandSlug === product.brandSlug))
      .slice(0, 4);
  }

  getDashboardData() {
    let featuredProducts = 0;
    let pharmaCount = 0, foodCount = 0, equipmentCount = 0;
    let pharmaActive = 0, foodActive = 0, equipmentActive = 0;

    for (const p of this.products) {
      if (p.isFeatured) featuredProducts++;
      if (p.category === 'farmacos') {
        pharmaCount++;
        if (p.isActive) pharmaActive++;
      } else if (p.category === 'alimentos') {
        foodCount++;
        if (p.isActive) foodActive++;
      } else if (p.category === 'equipos') {
        equipmentCount++;
        if (p.isActive) equipmentActive++;
      }
    }

    let newMessages = 0;
    for (const m of this.messages) {
      if (m.status === 'nuevo') newMessages++;
    }

    return {
      totalProducts: this.products.length,
      newMessages,
      totalBrands: this.brands.length,
      featuredProducts,
      pharmaCount, foodCount, equipmentCount,
      pharmaActive, foodActive, equipmentActive,
      recentMessages: this.messages.slice(0, 5)
    };
  }
}
