import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB || 'users'; // Default to 'users' database

// Check the MongoDB URI
if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

// Connection object
let cachedClient = null;
let cachedDb = null;
let lastConnectionTime = 0;
const CONNECTION_FRESHNESS_THRESHOLD = 30000; // 30 seconds - only reuse connection if fresh

export async function connectToDatabase() {
  try {
    // Check if we have a fresh cached connection
    const now = Date.now();
    const connectionIsFresh = (now - lastConnectionTime) < CONNECTION_FRESHNESS_THRESHOLD;
    
    // If connection exists, is open, and is fresh - reuse it
    if (cachedClient && cachedDb && connectionIsFresh && cachedClient.topology?.isConnected?.()) {
      console.log('Reusing existing MongoDB connection');
      return { client: cachedClient, db: cachedDb };
    }
    
    // If we have a stale connection, try to close it gracefully
    if (cachedClient) {
      try {
        console.log('Closing stale MongoDB connection');
        await cachedClient.close(true);
      } catch (err) {
        console.warn('Error closing stale connection:', err.message);
      }
      cachedClient = null;
      cachedDb = null;
    }

    // Set the connection options with improved settings for serverless
    const opts = {
      useUnifiedTopology: true,
      tls: true,
      tlsAllowInvalidCertificates: process.env.NODE_ENV === 'development',
      retryWrites: true,
      connectTimeoutMS: 5000,      // Reduced from 60000 to 5000 for faster failures
      socketTimeoutMS: 10000,      // Reduced from 90000 to 10000
      maxIdleTimeMS: 15000,        // Reduced from 120000 to 15000
      maxPoolSize: 1,              // Reduced to 1 for more predictable behavior in serverless
      minPoolSize: 0,              // No minimum
      serverSelectionTimeoutMS: 5000, // Reduced from 60000 to 5000
      heartbeatFrequencyMS: 10000, // Keep connection alive with heartbeats
      compressors: 'zlib',         // Enable compression
    };

    // Connect with explicit timeout to prevent hanging
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('MongoDB connection timeout')), 5000);
    });
    
    // Connect to the server with retry logic and timeout
    const connectionPromise = tryConnect(MONGODB_URI, opts);
    const client = await Promise.race([connectionPromise, timeoutPromise]);
    const db = client.db(MONGODB_DB);

    // Update cache and timestamp
    cachedClient = client;
    cachedDb = db;
    lastConnectionTime = Date.now();

    console.log('Successfully connected to MongoDB');
    return { client, db };
  } catch (error) {
    // Clear cached values on connection failure
    cachedClient = null;
    cachedDb = null;
    
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

// Simplified function that returns the database and client in a format that API routes expect
export async function connectDB() {
  try {
    const { client, db } = await connectToDatabase();
    return { client, db }; // Return both client and db to match expected format
  } catch (error) {
    console.error('Failed to connect to database:', error);
    
    // Add more helpful error info
    if (error.name === 'MongoServerSelectionError') {
      console.error('Could not select MongoDB server. Check network and MongoDB Atlas status.');
    }
    if (error.message.includes('timeout')) {
      console.error('MongoDB connection timed out. This could indicate network issues or MongoDB service unavailability.');
    }
    
    throw error;
  }
}

// Helper function to retry connection with exponential backoff
async function tryConnect(uri, options, retries = 1, backoff = 500) {
  try {
    console.log(`Attempting MongoDB connection (retries left: ${retries})`);
    return await MongoClient.connect(uri, options);
  } catch (err) {
    if (retries <= 0) {
      console.error('MongoDB connection failed after multiple attempts:', err.message);
      throw err;
    }
    
    console.log(`Connection attempt failed (${err.message}), retrying in ${backoff}ms...`);
    await new Promise(resolve => setTimeout(resolve, backoff));
    
    return tryConnect(uri, options, retries - 1, Math.min(backoff * 2, 2000)); // Cap max backoff at 2 seconds
  }
}

// Single connection instance for clientPromise
const clientPromiseOpts = {
  useUnifiedTopology: true,
  tls: true,
  tlsAllowInvalidCertificates: process.env.NODE_ENV === 'development',
  retryWrites: true,
  connectTimeoutMS: 5000,
  socketTimeoutMS: 10000,
  maxPoolSize: 1,
  minPoolSize: 0,
  serverSelectionTimeoutMS: 5000,
  heartbeatFrequencyMS: 10000,
  compressors: 'zlib',
};

// For backward compatibility with code that uses clientPromise,
// but with more explicit error handling
let clientPromiseInstance = null;

const clientPromise = (() => {
  if (clientPromiseInstance) {
    return clientPromiseInstance;
  }
  
  clientPromiseInstance = MongoClient.connect(MONGODB_URI, clientPromiseOpts)
    .catch(err => {
      console.error('Error in clientPromise:', err);
      clientPromiseInstance = null; // Reset on error
      throw err;
    });
    
  return clientPromiseInstance;
})();

export default clientPromise; 