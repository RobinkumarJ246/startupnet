// This file is maintained for backward compatibility
// It re-exports everything from src/lib/mongodb.js

export * from '../src/lib/mongodb';
export { default } from '../src/lib/mongodb';

// Add legacy getDb function for backward compatibility if needed
export async function getDb() {
  const { connectDB } = await import('../src/lib/mongodb');
  return connectDB();
} 