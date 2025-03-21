import { MongoClient } from 'mongodb';

// Global variable to cache the database connection
let cachedClient = null;
let connectInProgress = false;

// Function to connect to MongoDB and handle connection errors gracefully
export async function connectToDatabase() {
  // If we already have a connection, return it
  if (cachedClient) {
    console.log('Using cached MongoDB connection');
    return { client: cachedClient };
  }

  // If connection is in progress, wait for it
  if (connectInProgress) {
    console.log('MongoDB connection is in progress, waiting...');
    for (let i = 0; i < 10; i++) {
      await new Promise(resolve => setTimeout(resolve, 500));
      if (cachedClient) {
        console.log('Cached connection became available');
        return { client: cachedClient };
      }
    }
    throw new Error('Timeout waiting for MongoDB connection');
  }

  // Start a new connection
  connectInProgress = true;
  try {
    console.log('Connecting to MongoDB...');
    const uri = process.env.MONGODB_URI;
    
    if (!uri) {
      throw new Error('MONGODB_URI not defined in environment variables');
    }

    // Configure MongoDB client with SSL/TLS options
    const options = {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      // Use these TLS/SSL options conditionally
      ...(process.env.NODE_ENV === 'production' ? {
        ssl: true,
        tls: true,
        tlsCAFile: process.env.MONGODB_CA_FILE,
        tlsAllowInvalidCertificates: false,
        tlsAllowInvalidHostnames: false,
      } : {
        // Development settings
        ssl: false,
        tls: false,
        directConnection: true,
      })
    };

    const client = new MongoClient(uri, options);
    await client.connect();
    
    // Test the connection
    await client.db().command({ ping: 1 });
    
    console.log('Connected to MongoDB successfully');
    
    // Cache the client connection
    cachedClient = client;
    
    return { client };
  } catch (error) {
    console.error('MongoDB connection error:', error);
    
    // Handle different types of errors
    if (error.name === 'MongoNetworkError') {
      console.log('Network error connecting to MongoDB');
    } else if (error.name === 'MongoServerSelectionError') {
      console.log('Could not select a MongoDB server');
    } else if (error.message && error.message.includes('SSL')) {
      console.log('SSL/TLS connection error to MongoDB');
    }
    
    // Propagate the error to be handled by the caller
    throw error;
  } finally {
    connectInProgress = false;
  }
}

// Close the MongoDB connection
export async function closeDatabase() {
  if (cachedClient) {
    await cachedClient.close();
    cachedClient = null;
    console.log('MongoDB connection closed');
  }
}

// Reset the cached connection (useful for testing)
export function resetCachedConnection() {
  cachedClient = null;
  connectInProgress = false;
} 