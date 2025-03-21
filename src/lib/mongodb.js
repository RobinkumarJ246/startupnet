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

export async function connectToDatabase() {
  // If the connection is already established, return the cached connection
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  // Set the connection options with improved SSL settings
  const opts = {
    useUnifiedTopology: true,
    tls: true,
    tlsAllowInvalidCertificates: process.env.NODE_ENV === 'development', // Allow invalid certs only in development
    retryWrites: true,
    connectTimeoutMS: 60000, // Increased from 30000 to 60000
    socketTimeoutMS: 90000,  // Increased from 45000 to 90000
    maxIdleTimeMS: 120000,   // Connection pool idle time
    maxPoolSize: 5,          // Reduced from 10 to 5 for better stability
    minPoolSize: 1,          // Reduced from 5 to 1
    serverSelectionTimeoutMS: 60000, // Added explicit server selection timeout
  };

  try {
    // Connect to the server with retry logic
    const client = await tryConnect(MONGODB_URI, opts);
    const db = client.db(MONGODB_DB);

    // Cache the client and db connections
    cachedClient = client;
    cachedDb = db;

    console.log('Successfully connected to MongoDB');
    return { client, db };
  } catch (error) {
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
    throw error;
  }
}

// Helper function to retry connection with exponential backoff
async function tryConnect(uri, options, retries = 3, backoff = 1000) {
  try {
    return await MongoClient.connect(uri, options);
  } catch (err) {
    if (retries <= 0) {
      console.error('MongoDB connection failed after multiple attempts');
      throw err;
    }
    
    console.log(`Connection attempt failed, retrying in ${backoff}ms...`);
    await new Promise(resolve => setTimeout(resolve, backoff));
    
    return tryConnect(uri, options, retries - 1, backoff * 2);
  }
}

// For backward compatibility with code that uses clientPromise
const clientPromiseOpts = {
  useUnifiedTopology: true,
  tls: true,
  tlsAllowInvalidCertificates: process.env.NODE_ENV === 'development',
  retryWrites: true,
  connectTimeoutMS: 60000, // Increased from 30000 to 60000
  socketTimeoutMS: 90000,  // Increased from 45000 to 90000
  maxPoolSize: 5,          // Reduced from 10 to 5
  minPoolSize: 1,          // Reduced minimum pool size
  serverSelectionTimeoutMS: 60000, // Added explicit server selection timeout
};

// Export clientPromise as default for backward compatibility
const clientPromise = MongoClient.connect(MONGODB_URI, clientPromiseOpts)
  .catch(err => {
    console.error('Error in clientPromise:', err);
    throw err;
  });

export default clientPromise; 