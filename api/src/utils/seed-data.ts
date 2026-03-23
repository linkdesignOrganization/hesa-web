/**
 * Seed script to populate the database with initial brands and products.
 * BUG-DB-EMPTY: The DB has 0 products and 0 brands.
 *
 * Usage: npx ts-node src/utils/seed-data.ts
 *
 * Creates:
 *   - 3 brands (Zoetis, Royal Canin, Mindray)
 *   - 5 products (2 fármacos, 2 alimentos, 1 equipo)
 *   - Covers all QA edge cases: multiple images, single image, no image,
 *     with/without PDF, with/without storytelling
 */
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

import mongoose from 'mongoose';
import { connectDatabase } from '../config/database';
import { Brand } from '../models/brand.model';
import { Product } from '../models/product.model';
import { Category } from '../models/category.model';

async function seedData(): Promise<void> {
  await connectDatabase();

  // Check current state
  const brandCount = await Brand.countDocuments();
  const productCount = await Product.countDocuments();
  console.log(`Current state: ${brandCount} brands, ${productCount} products`);

  if (brandCount > 0 && productCount > 0) {
    console.log('Database already has brands and products. Skipping seed.');
    await mongoose.disconnect();
    return;
  }

  // Ensure categories exist
  const catCount = await Category.countDocuments();
  if (catCount === 0) {
    console.log('No categories found. They should have been seeded by the app startup.');
    await mongoose.disconnect();
    return;
  }

  // ======================== BRANDS ========================
  console.log('Seeding brands...');

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
      isFeatured: true,
      featuredOrder: 3,
    },
  ]);

  console.log(`Created ${brands.length} brands`);

  const zoetis = brands[0];
  const royalCanin = brands[1];
  const mindray = brands[2];

  // ======================== PRODUCTS ========================
  console.log('Seeding products...');

  const products = await Product.insertMany([
    // --- FARMACO 1: Multiple images, with PDF, with storytelling ---
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

    // --- FARMACO 2: Single image, no PDF, no storytelling ---
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

    // --- ALIMENTO 1: Multiple images, no PDF, with storytelling ---
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

    // --- ALIMENTO 2: No images (placeholder test), no storytelling ---
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

    // --- EQUIPO 1: Single image, with PDF, no storytelling ---
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

  console.log(`Created ${products.length} products`);

  // Verify
  const finalBrands = await Brand.countDocuments();
  const finalProducts = await Product.countDocuments();
  console.log(`Final state: ${finalBrands} brands, ${finalProducts} products`);
  console.log('Seed completed successfully!');

  await mongoose.disconnect();
}

seedData().catch((error) => {
  console.error('Seed failed:', error);
  process.exit(1);
});
