import { MongoClient } from 'mongodb';

// Add SSL/TLS options for more reliable connections and better error handling

// Existing imports and code...

export async function connectDB() {
  try {
    // Check if we already have a connection
    if (global.mongodb && global.mongodb.db) {
      console.log('Using existing MongoDB connection');
      return global.mongodb;
    }

    console.log('Creating new MongoDB connection');
    
    // Get the MongoDB URI from environment variables
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/startupsnet';
    
    // Add connection options to handle SSL/TLS issues
    const options = {
      useNewUrlParser: true,
      // Remove deprecated option
      // useUnifiedTopology: true, 
      // Add SSL/TLS options to handle connection issues
      ssl: true,
      tlsAllowInvalidCertificates: process.env.NODE_ENV !== 'production',
      tlsAllowInvalidHostnames: process.env.NODE_ENV !== 'production',
      // Add retryWrites for better reliability
      retryWrites: true,
      // Add connection timeout
      connectTimeoutMS: 10000,
      // Add socket timeout
      socketTimeoutMS: 45000,
      // Add server selection timeout
      serverSelectionTimeoutMS: 15000,
      // Add retry options
      maxPoolSize: 10,
      minPoolSize: 5,
    };
    
    // Log the connection attempt
    console.log('Connecting to MongoDB...');
    
    // Connect to MongoDB
    const client = new MongoClient(uri, options);
    await client.connect();
    
    // Get the database
    const db = client.db();
    
    // Store the connection in the global object
    global.mongodb = { client, db };
    
    console.log('MongoDB connection successful');
    
    return global.mongodb;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    
    // Return an object that allows the application to continue with fallback data
    // This prevents the application from crashing completely
    return {
      error: error,
      isConnectionError: true,
      db: {
        collection: () => ({
          // Return mock collection methods that will gracefully fail
          findOne: async () => null,
          find: async () => ({ toArray: async () => [] }),
          insertOne: async () => ({ acknowledged: false, insertedId: null }),
          updateOne: async () => ({ acknowledged: false, modifiedCount: 0 }),
          deleteOne: async () => ({ acknowledged: false, deletedCount: 0 }),
        })
      }
    };
  }
} 