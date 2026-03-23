/**
 * Seed script: Populate hero with 3 mock carousel slides.
 * Run: npx ts-node src/utils/seed-hero.ts
 */
import dotenv from 'dotenv';
dotenv.config({ path: require('path').resolve(__dirname, '../../.env') });

import mongoose from 'mongoose';
import { HomeConfig } from '../models/home-config.model';

const COSMOS_URI = process.env.COSMOS_CONNECTION_STRING || '';
const DB_NAME = process.env.COSMOS_DB_NAME || 'hesa';

async function seedHero() {
  if (!COSMOS_URI) {
    console.error('No COSMOS_CONNECTION_STRING found in .env');
    process.exit(1);
  }

  await mongoose.connect(COSMOS_URI, { dbName: DB_NAME });
  console.log('Connected to DB');

  const config = await HomeConfig.findOne();
  if (!config) {
    console.error('No home_config document found');
    process.exit(1);
  }

  const mockSlides = [
    {
      tag: { es: 'Desde 1987', en: 'Since 1987' },
      headline: { es: 'Donde la salud animal encuentra su mejor aliado', en: 'Where animal health finds its best ally' },
      subtitle: { es: 'Distribución de fármacos, alimentos y equipos veterinarios en Costa Rica', en: 'Distribution of pharmaceuticals, food and veterinary equipment in Costa Rica' },
      ctaText: { es: 'Ver catálogo', en: 'View catalog' },
      ctaLink: '/es/catalogo',
      tagsEs: ['Fármacos', 'Alimentos', 'Equipos'],
      tagsEn: ['Pharmaceuticals', 'Food', 'Equipment'],
      imageDesktop: 'https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?w=1600&q=80',
      imageMobile: 'https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?w=800&q=80',
    },
    {
      tag: { es: 'Cobertura Nacional', en: 'National Coverage' },
      headline: { es: 'Llegamos a todo Costa Rica', en: 'We reach all of Costa Rica' },
      subtitle: { es: 'Flotilla propia con cadena de frío y visitas quincenales', en: 'Own fleet with cold chain and biweekly visits' },
      ctaText: { es: 'Conocer más', en: 'Learn more' },
      ctaLink: '/es/nosotros',
      tagsEs: ['100% Cobertura', 'Flotilla propia', 'Cadena de frío'],
      tagsEn: ['100% Coverage', 'Own fleet', 'Cold chain'],
      imageDesktop: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=1600&q=80',
      imageMobile: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&q=80',
    },
    {
      tag: { es: 'Marcas Premium', en: 'Premium Brands' },
      headline: { es: 'Las mejores marcas del mundo en tus manos', en: 'The best brands in the world in your hands' },
      subtitle: { es: 'Representamos marcas exclusivas de Europa, Asia y América', en: 'We represent exclusive brands from Europe, Asia and America' },
      ctaText: { es: 'Ver marcas', en: 'View brands' },
      ctaLink: '/es/marcas',
      tagsEs: ['Exclusivas', 'Internacionales', '+18 Marcas'],
      tagsEn: ['Exclusive', 'International', '+18 Brands'],
      imageDesktop: 'https://images.unsplash.com/photo-1606567595334-d39972c85dbe?w=1600&q=80',
      imageMobile: 'https://images.unsplash.com/photo-1606567595334-d39972c85dbe?w=800&q=80',
    },
  ];

  await HomeConfig.findByIdAndUpdate(config._id, {
    $set: {
      'hero.mode': 'carousel',
      'hero.slides': mockSlides,
    },
  });

  console.log('Hero seeded with 3 carousel slides');
  await mongoose.disconnect();
  process.exit(0);
}

seedHero().catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});
