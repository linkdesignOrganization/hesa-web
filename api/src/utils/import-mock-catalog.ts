import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

import mongoose from 'mongoose';
import { connectDatabase } from '../config/database';
import { importMockCatalog } from '../services/mock-catalog-import.service';

async function run(): Promise<void> {
  await connectDatabase();
  const summary = await importMockCatalog();
  console.log('Mock catalog imported successfully');
  console.log(JSON.stringify(summary, null, 2));
  await mongoose.disconnect();
}

run().catch(async error => {
  console.error('Mock catalog import failed:', error);
  try {
    await mongoose.disconnect();
  } catch {
    // ignore disconnect errors
  }
  process.exit(1);
});
