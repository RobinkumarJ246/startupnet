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
    // Don't use both tlsInsecure and tlsAllowInvalidCertificates together
    tls: true,
    tlsAllowInvalidCertificates: process.env.NODE_ENV === 'development', // Allow invalid certs only in development
    retryWrites: true,
    connectTimeoutMS: 30000, // Increase timeout to 30 seconds
    socketTimeoutMS: 45000,  // Increase socket timeout
    maxIdleTimeMS: 120000,   // Connection pool idle time
    maxPoolSize: 10,         // Limit connection pool size
    minPoolSize: 5,          // Minimum connections to keep open
  };

  try {
    // Connect to the server
    const client = await MongoClient.connect(MONGODB_URI, opts);
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

// For backward compatibility with code that uses clientPromise
const clientPromiseOpts = {
  useUnifiedTopology: true,
  tls: true,
  tlsAllowInvalidCertificates: process.env.NODE_ENV === 'development',
  retryWrites: true,
  connectTimeoutMS: 30000,
  socketTimeoutMS: 45000,
  maxPoolSize: 10,
  minPoolSize: 5,
};

// Export clientPromise as default for backward compatibility
const clientPromise = MongoClient.connect(MONGODB_URI, clientPromiseOpts)
  .catch(err => {
    console.error('Error in clientPromise:', err);
    throw err;
  });

export default clientPromise; 