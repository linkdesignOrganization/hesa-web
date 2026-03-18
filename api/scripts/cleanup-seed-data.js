/**
 * Cleanup Seed Data Script
 *
 * Removes all seed/placeholder data from the HESA production database.
 * Keeps: Categories, Site Config (structural data needed for the app to function)
 * Removes: Products, Brands, Team Members, Activity Logs, Home Config featured items, Messages
 *
 * Usage: node api/scripts/cleanup-seed-data.js
 * Requires: COSMOS_CONNECTION_STRING and COSMOS_DB_NAME env vars (from .env)
 */

const { MongoClient } = require('mongodb');
const path = require('path');

// Load .env from project root
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const connectionString = process.env.COSMOS_CONNECTION_STRING;
const dbName = process.env.COSMOS_DB_NAME || 'hesa';

if (!connectionString) {
  console.error('ERROR: COSMOS_CONNECTION_STRING not set. Ensure .env exists at project root.');
  process.exit(1);
}

async function cleanup() {
  console.log('=== HESA Database Seed Data Cleanup ===\n');
  console.log(`Database: ${dbName}`);

  const client = new MongoClient(connectionString);

  try {
    await client.connect();
    console.log('Connected to Cosmos DB.\n');

    const db = client.db(dbName);

    // 1. Delete all products
    const productResult = await db.collection('products').deleteMany({});
    console.log(`[1/7] Products deleted: ${productResult.deletedCount}`);

    // 2. Delete all brands
    const brandResult = await db.collection('brands').deleteMany({});
    console.log(`[2/7] Brands deleted: ${brandResult.deletedCount}`);

    // 3. Delete all team members
    const teamResult = await db.collection('team_members').deleteMany({});
    console.log(`[3/7] Team members deleted: ${teamResult.deletedCount}`);

    // 4. Delete all messages
    const messageResult = await db.collection('messages').deleteMany({});
    console.log(`[4/7] Messages deleted: ${messageResult.deletedCount}`);

    // 5. Delete all activity logs
    const logResult = await db.collection('activity_logs').deleteMany({});
    console.log(`[5/7] Activity logs deleted: ${logResult.deletedCount}`);

    // 6. Delete all page contents (they auto-seed with defaults on first access)
    const pageResult = await db.collection('page_contents').deleteMany({});
    console.log(`[6/7] Page contents deleted: ${pageResult.deletedCount}`);

    // 7. Reset home config — keep the hero but clear featured products/brands
    const homeConfig = await db.collection('home_configs').findOne({});
    if (homeConfig) {
      await db.collection('home_configs').updateOne(
        { _id: homeConfig._id },
        {
          $set: {
            featuredProducts: [],
            featuredBrands: [],
          }
        }
      );
      console.log(`[7/7] Home config: cleared featured products and brands (kept hero)`);
    } else {
      console.log(`[7/7] Home config: not found (nothing to clear)`);
    }

    // Verify categories are preserved
    const categoryCount = await db.collection('categories').countDocuments();
    console.log(`\n--- Verification ---`);
    console.log(`Categories preserved: ${categoryCount}`);
    console.log(`Products remaining: ${await db.collection('products').countDocuments()}`);
    console.log(`Brands remaining: ${await db.collection('brands').countDocuments()}`);
    console.log(`Team members remaining: ${await db.collection('team_members').countDocuments()}`);
    console.log(`Messages remaining: ${await db.collection('messages').countDocuments()}`);
    console.log(`Activity logs remaining: ${await db.collection('activity_logs').countDocuments()}`);

    // Verify site config is preserved
    const siteConfig = await db.collection('site_configs').findOne({});
    console.log(`Site config preserved: ${siteConfig ? 'Yes' : 'No'}`);

    console.log('\n=== Cleanup complete. Panel is now empty except Categories and Filters. ===');

  } catch (error) {
    console.error('Cleanup failed:', error);
    process.exit(1);
  } finally {
    await client.close();
    console.log('Database connection closed.');
  }
}

cleanup();
