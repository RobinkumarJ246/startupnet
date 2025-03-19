import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB || 'events';

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

  // Set the connection options
  const opts = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

  // Connect to the server
  const client = await MongoClient.connect(MONGODB_URI, opts);
  const db = client.db(MONGODB_DB);

  // Cache the client and db connections
  cachedClient = client;
  cachedDb = db;

  return { client, db };
}

// Simplified function that just returns the db object
export async function connectDB() {
  const { db } = await connectToDatabase();
  return db;
} 