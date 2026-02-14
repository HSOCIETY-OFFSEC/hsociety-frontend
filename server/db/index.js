/**
 * MongoDB connection via Mongoose
 * Usage: await connectDB() before starting the server
 */
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hsociety';

/**
 * Connect to MongoDB. Call once at server startup.
 * @returns {Promise<void>}
 */
export async function connectDB() {
  if (mongoose.connection.readyState === 1) {
    console.log('[DB] Already connected');
    return;
  }
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('[DB] Connected to MongoDB');
  } catch (err) {
    console.error('[DB] Connection error:', err.message);
    throw err;
  }
}

/**
 * Disconnect from MongoDB. Use for graceful shutdown.
 * @returns {Promise<void>}
 */
export async function disconnectDB() {
  if (mongoose.connection.readyState === 0) return;
  await mongoose.disconnect();
  console.log('[DB] Disconnected');
}

export default { connectDB, disconnectDB };
