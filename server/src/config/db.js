import mongoose from 'mongoose';
import { env } from './env.js';

mongoose.set('strictQuery', true);

let isConnected = false;

export async function connectDB() {
  if (isConnected) return mongoose.connection;

  mongoose.connection.on('connected', () => {
    isConnected = true;
    // eslint-disable-next-line no-console
    console.log('[db] MongoDB connected');
  });

  mongoose.connection.on('error', (err) => {
    // eslint-disable-next-line no-console
    console.error('[db] MongoDB connection error:', err.message);
  });

  mongoose.connection.on('disconnected', () => {
    isConnected = false;
    // eslint-disable-next-line no-console
    console.warn('[db] MongoDB disconnected');
  });

  try {
    await mongoose.connect(env.mongoUri, {
      // Free tier friendly: small pool, fail fast instead of hanging Render's boot check
      maxPoolSize: 5,
      serverSelectionTimeoutMS: 8000,
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[db] Initial MongoDB connection failed:', err.message);
    // Do not crash the process — allow the HTTP server to still boot so
    // Render's health check passes and logs are visible; requests that need
    // the DB will fail with a clear 503 until MONGODB_URI is fixed.
  }

  return mongoose.connection;
}

export function isDbConnected() {
  return mongoose.connection.readyState === 1;
}
