import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/app/lib/db';
import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';
import { Grid } from 'gridfs-stream';
import { Readable } from 'stream';

/**
 * GET handler to retrieve a user's profile image
 * Uses the user ID to fetch the image from GridFS
 */
export async function GET(request, { params }) {
  const userId = params?.id;
  console.log(`Fetching image for user ID: ${userId}`);

  if (!userId) {
    console.error('No user ID provided');
    return new NextResponse('No user ID provided', { status: 400 });
  }

  // Validate ObjectId format
  if (!ObjectId.isValid(userId)) {
    console.error(`Invalid ObjectId format: ${userId}`);
    return new NextResponse('Invalid user ID format', { status: 400 });
  }

  try {
    const { client, db } = await connectToDatabase();
    
    // Find user in any collection to determine type
    let user = null;
    let userType = null;
    
    // Try to find in students collection
    user = await db.collection('students').findOne({ _id: new ObjectId(userId) });
    if (user) {
      userType = 'student';
      console.log(`Found user in students collection: ${user.fullName || user.email}`);
    }
    
    // If not found, try startups collection
    if (!user) {
      user = await db.collection('startups').findOne({ _id: new ObjectId(userId) });
      if (user) {
        userType = 'startup';
        console.log(`Found user in startups collection: ${user.companyName || user.email}`);
      }
    }
    
    // If not found, try clubs collection
    if (!user) {
      user = await db.collection('clubs').findOne({ _id: new ObjectId(userId) });
      if (user) {
        userType = 'club';
        console.log(`Found user in clubs collection: ${user.clubName || user.email}`);
      }
    }
    
    if (!user) {
      console.error(`User not found for ID: ${userId}`);
      // Return a generic profile picture
      return generateDefaultImage(userType || 'generic');
    }

    // Initialize GridFS
    const conn = mongoose.connection;
    const gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('images');

    // Find profile picture in GridFS
    let file = await new Promise((resolve) => {
      gfs.files.findOne(
        { 
          // Use different metadata based on user type
          $or: [
            { 'metadata.userId': userId },
            { 'metadata.userId': userId.toString() },
            { 'metadata.email': user.email },
            ...(userType === 'student' ? [
              { 'metadata.fullName': user.fullName },
              { 'metadata.username': user.username }
            ] : []),
            ...(userType === 'startup' ? [
              { 'metadata.companyName': user.companyName },
              { 'metadata.industry': user.industry }
            ] : []),
            ...(userType === 'club' ? [
              { 'metadata.clubName': user.clubName },
              { 'metadata.university': user.university }
            ] : [])
          ]
        },
        (err, file) => {
          if (err) {
            console.error('Error finding image file:', err);
            resolve(null);
          } else {
            resolve(file);
          }
        }
      );
    });

    if (!file) {
      console.log(`No profile image found for user ID: ${userId}, generating default`);
      return generateDefaultImage(userType);
    }

    // Create a readable stream from the file
    const readStream = gfs.createReadStream({ _id: file._id });
    
    // Convert the stream to a response
    const chunks = [];
    for await (const chunk of readStream) {
      chunks.push(chunk);
    }
    
    const buffer = Buffer.concat(chunks);
    
    // Return the image with appropriate content type
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': file.contentType,
        'Cache-Control': 'public, max-age=86400'
      }
    });

  } catch (error) {
    console.error('Error retrieving image:', error);
    // Generate fallback image
    return generateDefaultImage('generic');
  }
}

// Generate a default image based on user type
function generateDefaultImage(userType) {
  const bgColor = userType === 'student' ? '#4F46E5' : 
                 userType === 'startup' ? '#16A34A' : 
                 userType === 'club' ? '#EA580C' : '#6B7280';
  
  const initial = userType === 'student' ? 'S' : 
                 userType === 'startup' ? 'C' : 
                 userType === 'club' ? 'C' : 'U';
  
  // Create an SVG with the initial
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
      <rect width="200" height="200" fill="${bgColor}" />
      <text x="100" y="120" font-family="Arial" font-size="100" font-weight="bold" fill="white" text-anchor="middle">${initial}</text>
    </svg>
  `;
  
  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=86400'
    }
  });
}