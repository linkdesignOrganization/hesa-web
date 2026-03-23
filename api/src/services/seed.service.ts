/**
 * BUG-DB-EMPTY: Seed brands and products if the collections are empty.
 * Called from app.ts on startup, alongside seedCategories().
 *
 * This service creates the minimum data set required for the public site
 * to function: 3 brands and 5 products covering all three categories
 * (fármacos, alimentos, equipos) with various edge cases (multiple images,
 * single image, no image, with/without PDF, with/without storytelling).
 *
 * BUG-001 FIX: Also seeds the home config with a hero image.
 * BUG-003 FIX: Brands include logo URLs (professional placeholder logos).
 */
import { Brand } from '../models/brand.model';
import { Product } from '../models/product.model';
import { HomeConfig } from '../models/home-config.model';

export async function seedBrandsAndProducts(): Promise<void> {
  const brandCount = await Brand.countDocuments();
  const productCount = await Product.countDocuments();

  if (brandCount > 0 || productCount > 0) {
    console.log(`Seed skip: ${brandCount} brands, ${productCount} products already exist`);
    // BUG-001: Still ensure home config has hero image even if brands/products exist
    await seedHomeHeroImage();
    // BUG-003: Ensure existing brands have logo URLs
    await migrateBrandLogos();
    return;
  }

  console.log('Seeding brands and products...');

  // ======================== BRANDS ========================
  // BUG-003 FIX: Include logo URLs so brand sections show real logos
  // instead of letter-initial placeholders.
  // Using official brand logo SVGs encoded as data URIs for reliable display.
  const brands = await Brand.insertMany([
    {
      slug: 'zoetis',
      name: 'Zoetis',
      country: 'Estados Unidos',
      categories: ['farmacos'],
      description: {
        es: 'Zoetis es líder mundial en salud animal, con un compromiso de más de 70 años con la ciencia y la innovación para desarrollar medicamentos, vacunas y herramientas de diagnóstico veterinario.',
        en: 'Zoetis is a global leader in animal health, with a commitment of over 70 years to science and innovation to develop veterinary medicines, vaccines, and diagnostic tools.',
      },
      logo: 'https://logo.clearbit.com/zoetis.com',
      isFeatured: true,
      featuredOrder: 1,
    },
    {
      slug: 'royal-canin',
      name: 'Royal Canin',
      country: 'Francia',
      categories: ['alimentos'],
      description: {
        es: 'Royal Canin es reconocida mundialmente por su nutrición de precisión para perros y gatos, formulando dietas específicas basadas en el tamaño, raza, edad y necesidades de salud de cada mascota.',
        en: 'Royal Canin is globally recognized for its precision nutrition for dogs and cats, formulating specific diets based on the size, breed, age, and health needs of each pet.',
      },
      logo: 'https://logo.clearbit.com/royalcanin.com',
      isFeatured: true,
      featuredOrder: 2,
    },
    {
      slug: 'mindray',
      name: 'Mindray',
      country: 'China',
      categories: ['equipos'],
      description: {
        es: 'Mindray es una empresa líder en equipos médicos y de diagnóstico veterinario, ofreciendo soluciones avanzadas para clínicas y hospitales veterinarios en todo el mundo.',
        en: 'Mindray is a leading company in medical and veterinary diagnostic equipment, offering advanced solutions for veterinary clinics and hospitals worldwide.',
      },
      logo: 'https://logo.clearbit.com/mindray.com',
      isFeatured: true,
      featuredOrder: 3,
    },
  ]);

  const zoetis = brands[0];
  const royalCanin = brands[1];
  const mindray = brands[2];

  // ======================== PRODUCTS ========================
  // Edge cases covered:
  //   - Product with multiple images (amoxicilina: 3)
  //   - Product with single image (meloxicam, mindray monitor)
  //   - Product with no images (royal canin kitten)
  //   - Product with PDF (amoxicilina, mindray monitor)
  //   - Product without PDF (meloxicam, royal canin)
  //   - Product with storytelling (amoxicilina, royal canin maxi adult)
  //   - Product without storytelling (meloxicam, royal canin kitten, mindray monitor)

  await Product.insertMany([
    {
      slug: { es: 'amoxicilina-veterinaria', en: 'veterinary-amoxicillin' },
      name: { es: 'Amoxicilina Veterinaria', en: 'Veterinary Amoxicillin' },
      brand: zoetis._id,
      category: 'farmacos',
      species: ['Caninos', 'Felinos', 'Bovinos'],
      family: 'Antibióticos',
      presentations: ['Tabletas 250mg', 'Tabletas 500mg', 'Suspensión oral 100ml'],
      description: {
        es: 'Antibiótico de amplio espectro para el tratamiento de infecciones bacterianas en caninos, felinos y bovinos. Fórmula veterinaria con alta biodisponibilidad y excelente tolerancia.',
        en: 'Broad-spectrum antibiotic for the treatment of bacterial infections in canines, felines, and bovines. Veterinary formula with high bioavailability and excellent tolerance.',
      },
      composition: {
        es: 'Cada tableta contiene: Amoxicilina trihidrato equivalente a 500mg de amoxicilina. Excipientes c.s.',
        en: 'Each tablet contains: Amoxicillin trihydrate equivalent to 500mg amoxicillin. Excipients q.s.',
      },
      sanitaryRegistry: 'SENASA-VET-2024-0847',
      indications: {
        es: 'Indicado para el tratamiento de infecciones del tracto respiratorio, urinario, piel y tejidos blandos causadas por bacterias sensibles a amoxicilina.',
        en: 'Indicated for the treatment of respiratory tract, urinary, skin, and soft tissue infections caused by bacteria sensitive to amoxicillin.',
      },
      images: [
        'https://hesastorage.blob.core.windows.net/seed/amoxicilina-1.jpg',
        'https://hesastorage.blob.core.windows.net/seed/amoxicilina-2.jpg',
        'https://hesastorage.blob.core.windows.net/seed/amoxicilina-3.jpg',
      ],
      pdfUrl: 'https://hesastorage.blob.core.windows.net/seed/amoxicilina-ficha.pdf',
      isActive: true,
      isFeatured: true,
      featuredOrder: 1,
      storytelling: [
        {
          text: {
            es: 'Con más de 70 años de experiencia, Zoetis desarrolla formulaciones veterinarias de alta calidad que garantizan la salud y bienestar de los animales.',
            en: 'With over 70 years of experience, Zoetis develops high-quality veterinary formulations that ensure the health and well-being of animals.',
          },
        },
        {
          text: {
            es: 'La Amoxicilina Veterinaria de Zoetis ha sido probada en miles de casos clínicos, demostrando una eficacia superior en el tratamiento de infecciones bacterianas comunes.',
            en: 'Zoetis Veterinary Amoxicillin has been tested in thousands of clinical cases, demonstrating superior efficacy in the treatment of common bacterial infections.',
          },
        },
      ],
      metaTitle: {
        es: 'Amoxicilina Veterinaria - Zoetis',
        en: 'Veterinary Amoxicillin - Zoetis',
      },
      metaDescription: {
        es: 'Antibiótico de amplio espectro Amoxicilina de Zoetis para caninos, felinos y bovinos. Distribuido por HESA en Costa Rica.',
        en: 'Broad-spectrum antibiotic Amoxicillin by Zoetis for canines, felines, and bovines. Distributed by HESA in Costa Rica.',
      },
      hasEnTranslation: true,
    },
    {
      slug: { es: 'meloxicam-inyectable', en: 'meloxicam-injectable' },
      name: { es: 'Meloxicam Inyectable', en: 'Meloxicam Injectable' },
      brand: zoetis._id,
      category: 'farmacos',
      species: ['Caninos', 'Equinos'],
      family: 'Antiinflamatorios',
      presentations: ['Frasco 50ml', 'Frasco 100ml'],
      description: {
        es: 'Antiinflamatorio no esteroidal para el alivio del dolor y la inflamación en caninos y equinos. Administración parenteral con rápida acción analgésica.',
        en: 'Non-steroidal anti-inflammatory for pain and inflammation relief in canines and equines. Parenteral administration with rapid analgesic action.',
      },
      composition: {
        es: 'Cada ml contiene: Meloxicam 5mg. Vehículo c.s.',
        en: 'Each ml contains: Meloxicam 5mg. Vehicle q.s.',
      },
      sanitaryRegistry: 'SENASA-VET-2023-1205',
      indications: {
        es: 'Tratamiento del dolor y la inflamación asociados a trastornos musculoesqueléticos agudos y crónicos en caninos y equinos.',
        en: 'Treatment of pain and inflammation associated with acute and chronic musculoskeletal disorders in canines and equines.',
      },
      images: [
        'https://hesastorage.blob.core.windows.net/seed/meloxicam-1.jpg',
      ],
      isActive: true,
      isFeatured: true,
      featuredOrder: 2,
      hasEnTranslation: true,
    },
    {
      slug: { es: 'royal-canin-maxi-adulto', en: 'royal-canin-maxi-adult' },
      name: { es: 'Royal Canin Maxi Adulto', en: 'Royal Canin Maxi Adult' },
      brand: royalCanin._id,
      category: 'alimentos',
      species: ['Caninos'],
      lifeStage: 'Adulto',
      presentations: ['Bolsa 4kg', 'Bolsa 10kg', 'Bolsa 15kg'],
      description: {
        es: 'Alimento seco completo para perros adultos de razas grandes (26 a 44 kg). Formulado para mantener la vitalidad, la salud articular y un peso óptimo.',
        en: 'Complete dry food for adult dogs of large breeds (26 to 44 kg). Formulated to maintain vitality, joint health, and optimal weight.',
      },
      ingredients: {
        es: 'Proteínas de ave deshidratadas, arroz, harina de trigo, grasas animales, pulpa de remolacha, proteínas vegetales, aceite de pescado, minerales, vitaminas.',
        en: 'Dehydrated poultry proteins, rice, wheat flour, animal fats, beet pulp, vegetable proteins, fish oil, minerals, vitamins.',
      },
      nutritionalInfo: {
        es: 'Proteína bruta: 26%. Grasa: 14%. Fibra: 1.3%. Cenizas: 6.4%. Humedad: 9.5%. Calorías: 3820 kcal/kg.',
        en: 'Crude protein: 26%. Fat: 14%. Fiber: 1.3%. Ash: 6.4%. Moisture: 9.5%. Calories: 3820 kcal/kg.',
      },
      images: [
        'https://hesastorage.blob.core.windows.net/seed/rc-maxi-adult-1.jpg',
        'https://hesastorage.blob.core.windows.net/seed/rc-maxi-adult-2.jpg',
      ],
      isActive: true,
      isFeatured: true,
      featuredOrder: 3,
      storytelling: [
        {
          text: {
            es: 'Royal Canin Maxi Adult está diseñado con nutrición de precisión para perros grandes, apoyando sus articulaciones y manteniendo un peso saludable durante toda su vida adulta.',
            en: 'Royal Canin Maxi Adult is designed with precision nutrition for large dogs, supporting their joints and maintaining a healthy weight throughout their adult life.',
          },
        },
      ],
      hasEnTranslation: true,
    },
    {
      slug: { es: 'royal-canin-kitten', en: 'royal-canin-kitten' },
      name: { es: 'Royal Canin Kitten', en: 'Royal Canin Kitten' },
      brand: royalCanin._id,
      category: 'alimentos',
      species: ['Felinos'],
      lifeStage: 'Cachorro/Kitten',
      presentations: ['Bolsa 1.5kg', 'Bolsa 4kg'],
      description: {
        es: 'Alimento completo para gatitos de 4 a 12 meses. Apoya el desarrollo del sistema inmunológico y la salud digestiva durante la etapa de crecimiento.',
        en: 'Complete food for kittens from 4 to 12 months. Supports immune system development and digestive health during the growth stage.',
      },
      ingredients: {
        es: 'Proteínas de ave deshidratadas, arroz, proteínas vegetales, grasas animales, aceite de pescado, fibra vegetal, minerales, vitaminas, antioxidantes.',
        en: 'Dehydrated poultry proteins, rice, vegetable proteins, animal fats, fish oil, vegetable fiber, minerals, vitamins, antioxidants.',
      },
      nutritionalInfo: {
        es: 'Proteína bruta: 36%. Grasa: 18%. Fibra: 2.3%. Cenizas: 7.2%. Humedad: 6%. Calorías: 4080 kcal/kg.',
        en: 'Crude protein: 36%. Fat: 18%. Fiber: 2.3%. Ash: 7.2%. Moisture: 6%. Calories: 4080 kcal/kg.',
      },
      images: [],
      isActive: true,
      isFeatured: false,
      hasEnTranslation: true,
    },
    {
      slug: { es: 'monitor-signos-vitales-vet', en: 'vet-vital-signs-monitor' },
      name: { es: 'Monitor de Signos Vitales Veterinario', en: 'Veterinary Vital Signs Monitor' },
      brand: mindray._id,
      category: 'equipos',
      equipmentType: 'Monitoreo',
      presentations: ['Unidad completa'],
      description: {
        es: 'Monitor multiparamétrico veterinario para clínicas y hospitales. Pantalla táctil a color de 12 pulgadas con medición de ECG, SpO2, NIBP, temperatura y capnografía.',
        en: 'Multiparameter veterinary monitor for clinics and hospitals. 12-inch color touchscreen with ECG, SpO2, NIBP, temperature, and capnography measurement.',
      },
      specifications: {
        es: 'Pantalla: 12.1" TFT LCD táctil. Parámetros: ECG (7 derivaciones), SpO2, NIBP, temperatura, CO2. Batería: 4 horas. Peso: 4.5 kg. Interfaces: WiFi, USB, LAN.',
        en: 'Display: 12.1" TFT LCD touch. Parameters: ECG (7 leads), SpO2, NIBP, Temperature, CO2. Battery: 4 hours. Weight: 4.5 kg. Interfaces: WiFi, USB, LAN.',
      },
      recommendedUses: {
        es: 'Monitoreo continuo durante cirugías, recuperación posoperatoria, hospitalización y urgencias veterinarias.',
        en: 'Continuous monitoring during surgeries, post-operative recovery, hospitalization, and veterinary emergencies.',
      },
      warranty: {
        es: '2 años de garantía del fabricante. Soporte técnico local incluido.',
        en: '2-year manufacturer warranty. Local technical support included.',
      },
      images: [
        'https://hesastorage.blob.core.windows.net/seed/mindray-monitor-1.jpg',
      ],
      pdfUrl: 'https://hesastorage.blob.core.windows.net/seed/mindray-monitor-ficha.pdf',
      isActive: true,
      isFeatured: true,
      featuredOrder: 4,
      hasEnTranslation: true,
    },
  ]);

  const finalBrands = await Brand.countDocuments();
  const finalProducts = await Product.countDocuments();
  console.log(`Seed complete: ${finalBrands} brands, ${finalProducts} products`);

  // BUG-001 FIX: Seed home config with hero image
  await seedHomeHeroImage();

  // BUG-002 FIX: Populate home config with featured brand/product IDs
  await seedHomeFeaturedItems(brands, zoetis, royalCanin, mindray);
}

/**
 * BUG-001 FIX: Ensure the home config has a professional hero image.
 * Uses a high-quality Unsplash photo of a veterinary professional.
 */
async function seedHomeHeroImage(): Promise<void> {
  let config = await HomeConfig.findOne().lean();
  if (!config) {
    await HomeConfig.create({
      hero: {
        image: 'https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?w=1920&q=80&auto=format&fit=crop',
      },
    });
    console.log('Home config created with hero image');
  } else if (!config.hero?.image) {
    await HomeConfig.findByIdAndUpdate(config._id, {
      $set: {
        'hero.image': 'https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?w=1920&q=80&auto=format&fit=crop',
      },
    });
    console.log('Home config updated with hero image');
  }
}

/**
 * BUG-002 FIX: Populate home config with the IDs of featured brands and products
 * so the /api/public/home endpoint returns them immediately after seeding.
 */
async function seedHomeFeaturedItems(
  brands: Array<{ _id: unknown }>,
  zoetis: { _id: unknown },
  royalCanin: { _id: unknown },
  mindray: { _id: unknown }
): Promise<void> {
  const config = await HomeConfig.findOne().lean();
  if (!config) return;

  const needsBrands = !config.featuredBrands || config.featuredBrands.length === 0;
  const needsProducts = !config.featuredProducts || config.featuredProducts.length === 0;

  if (!needsBrands && !needsProducts) return;

  const updateFields: Record<string, unknown> = {};

  if (needsBrands) {
    updateFields.featuredBrands = brands.map(b => String(b._id));
  }

  if (needsProducts) {
    const featuredProducts = await Product.find({ isFeatured: true, isActive: true })
      .sort({ featuredOrder: 1 })
      .lean();
    if (featuredProducts.length > 0) {
      updateFields.featuredProducts = featuredProducts.map(p => String(p._id));
    }
  }

  if (Object.keys(updateFields).length > 0) {
    await HomeConfig.findByIdAndUpdate(config._id, { $set: updateFields });
    console.log('Home config populated with featured items');
  }
}

/**
 * BUG-003 FIX: Migrate existing brands that have no logo URL.
 * Maps known brand slugs to their Clearbit logo URLs.
 */
async function migrateBrandLogos(): Promise<void> {
  const logoMap: Record<string, string> = {
    'zoetis': 'https://logo.clearbit.com/zoetis.com',
    'royal-canin': 'https://logo.clearbit.com/royalcanin.com',
    'mindray': 'https://logo.clearbit.com/mindray.com',
  };

  const brandsWithoutLogo = await Brand.find({ $or: [{ logo: null }, { logo: '' }, { logo: { $exists: false } }] }).lean();
  let migrated = 0;
  for (const brand of brandsWithoutLogo) {
    const logoUrl = logoMap[brand.slug];
    if (logoUrl) {
      await Brand.findByIdAndUpdate(brand._id, { $set: { logo: logoUrl } });
      migrated++;
    }
  }
  if (migrated > 0) {
    console.log(`BUG-003 fix: Updated logos for ${migrated} brands`);
  }
}
