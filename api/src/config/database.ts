import mongoose from 'mongoose';

export async function connectDatabase(): Promise<void> {
  const connectionString = process.env.COSMOS_CONNECTION_STRING;
  const dbName = process.env.COSMOS_DB_NAME || 'hesa';

  if (!connectionString) {
    throw new Error('COSMOS_CONNECTION_STRING environment variable is not set');
  }

  try {
    await mongoose.connect(connectionString, {
      dbName,
      retryWrites: false,
      maxIdleTimeMS: 120000,
    });
    console.log(`Connected to database: ${dbName}`);
  } catch (error) {
    console.error('Database connection failed:', error);
    throw error;
  }
}
