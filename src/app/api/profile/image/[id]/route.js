import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/app/lib/db';
import { ObjectId, GridFSBucket } from 'mongodb';

/**
 * GET handler to retrieve a user's profile image
 * Uses the user ID to fetch the image from GridFS
 */
export async function GET(request, context) {
  let client = null;
  
  try {
    // Extract the id parameter correctly from context
    const userId = context.params.id;
    
    console.log('Fetching profile image for user:', userId);
    
    if (!userId) {
      console.error('Missing user ID in request');
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Connect to MongoDB using the app-wide connection function
    const { client: dbClient, db } = await connectToDatabase();
    client = dbClient;
    
    if (!client || !db) {
      console.error('Failed to connect to database');
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      );
    }
    
    console.log('Connected to database:', db.databaseName);
    
    // Enhanced MongoDB ID checking for different formats
    const searchCriteria = [];
    
    // Try as string ID
    searchCriteria.push({ 'metadata.userId': userId });
    
    // Try as ObjectId when possible
    try {
      if (ObjectId.isValid(userId)) {
        searchCriteria.push({ 'metadata.userId': new ObjectId(userId) });
      }
    } catch (err) {
      console.warn('Error converting to ObjectId:', err.message);
    }
    
    // Add lookup by filename pattern which often includes the user ID
    searchCriteria.push({ filename: new RegExp(`^${userId}`, 'i') });
    searchCriteria.push({ filename: new RegExp(`profile.*${userId}`, 'i') });
    searchCriteria.push({ filename: new RegExp(`${userId}.*profile`, 'i') });
    
    console.log('Using search criteria:', JSON.stringify(searchCriteria, null, 2));
    
    // Try to fetch user from different collections to determine type (student, startup, club)
    const collections = ['students', 'startups', 'clubs'];
    let userType = null;
    let foundUser = null;
    
    for (const collectionName of collections) {
      try {
        const collection = db.collection(collectionName);
        
        // Try different ID formats
        const possibleIds = [userId];
        if (ObjectId.isValid(userId)) {
          possibleIds.push(new ObjectId(userId));
        }
        
        for (const id of possibleIds) {
          const user = await collection.findOne({ _id: id });
          if (user) {
            foundUser = user;
            userType = collectionName === 'students' ? 'student' 
                      : collectionName === 'startups' ? 'startup' 
                      : 'club';
            console.log(`Found user in ${db.databaseName}.${collectionName}, type: ${userType}`);
            // Add userType to search criteria
            searchCriteria.push({ 'metadata.userType': userType });
            break;
          }
        }
        if (foundUser) break;
      } catch (err) {
        console.warn(`Error checking collection ${collectionName}:`, err.message);
      }
    }
    
    // If user not found in primary collections, try looking in the user collection
    if (!foundUser) {
      try {
        const usersCollection = db.collection('users');
        const possibleIds = [userId];
        if (ObjectId.isValid(userId)) {
          possibleIds.push(new ObjectId(userId));
        }
        
        for (const id of possibleIds) {
          const user = await usersCollection.findOne({ _id: id });
          if (user) {
            foundUser = user;
            userType = user.type || 'unknown';
            console.log(`Found user in users collection, type: ${userType}`);
            if (user.type) {
              searchCriteria.push({ 'metadata.userType': user.type });
            }
            break;
          }
        }
      } catch (err) {
        console.warn('Error checking users collection:', err.message);
      }
    }
    
    // Special handling for student and club accounts - they always have a default image
    if (userType === 'student' || userType === 'club') {
      console.log(`Special handling for ${userType} account`);
      // Add additional search criteria for these types
      if (foundUser) {
        if (foundUser.email) {
          searchCriteria.push({ 'metadata.email': foundUser.email });
        }
        if (foundUser.name) {
          searchCriteria.push({ 'metadata.name': foundUser.name });
        }
      }
    }
    
    // Initialize GridFS bucket
    const bucket = new GridFSBucket(db, {
      bucketName: 'profileImages'
    });
    
    // Try all search criteria
    let files = [];
    for (const criteria of searchCriteria) {
      try {
        // Check if image exists
        const foundFiles = await bucket.find(criteria).toArray();
        
        console.log(`Found ${foundFiles.length} files with criteria:`, JSON.stringify(criteria, null, 2));
        
        if (foundFiles.length > 0) {
          console.log('File details:', foundFiles.map(f => ({
            _id: f._id.toString(),
            filename: f.filename,
            metadata: f.metadata,
            uploadDate: f.uploadDate
          })));
          files = foundFiles;
          break;
        }
      } catch (err) {
        console.warn(`Error checking criteria ${JSON.stringify(criteria)}:`, err.message);
      }
    }
    
    // Check other buckets if needed
    const alternateBuckets = ['images', 'uploads', 'fs', 'avatars'];
    
    if (files.length === 0) {
      for (const bucketName of alternateBuckets) {
        try {
          console.log(`Checking alternate bucket: ${bucketName}`);
          const altBucket = new GridFSBucket(db, { bucketName });
          
          for (const criteria of searchCriteria) {
            const foundFiles = await altBucket.find(criteria).toArray();
            if (foundFiles.length > 0) {
              console.log(`Found ${foundFiles.length} files in bucket ${bucketName}`);
              files = foundFiles;
              bucket = altBucket;
              break;
            }
          }
          
          if (files.length > 0) break;
        } catch (err) {
          console.warn(`Error checking bucket ${bucketName}:`, err.message);
        }
      }
    }
    
    if (files.length === 0) {
      console.log('No image found for user:', userId, 'type:', userType);
      
      // Return default image for all account types
      console.log(`Returning default image for ${userType || 'unknown'} type`);
      
      // Return a default image based on type
      const defaultPath = `public/defaults/default-${userType || 'user'}.png`;
      
      try {
        // Try to read the default image from filesystem
        const fs = require('fs');
        const path = require('path');
        const defaultImagePath = path.join(process.cwd(), defaultPath);
        
        if (fs.existsSync(defaultImagePath)) {
          const buffer = fs.readFileSync(defaultImagePath);
          return new NextResponse(buffer, {
            headers: {
              'Content-Type': 'image/png',
              'Cache-Control': 'public, max-age=3600'
            }
          });
        } else {
          console.log(`Default image not found at ${defaultImagePath}, creating placeholder`);
          
          // Creating placeholder image data - a simple colored square with text
          const { createCanvas } = require('canvas');
          const canvas = createCanvas(200, 200);
          const ctx = canvas.getContext('2d');
          
          // Fill background based on user type
          ctx.fillStyle = userType === 'student' ? '#4B5563' : 
                        userType === 'startup' ? '#047857' :
                        userType === 'club' ? '#3B82F6' : '#6B7280';
          ctx.fillRect(0, 0, 200, 200);
          
          // Add text
          ctx.font = 'bold 24px Arial';
          ctx.fillStyle = 'white';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          
          // Get first letter of name or email if available
          let initial = '?';
          if (foundUser) {
            if (foundUser.name) initial = foundUser.name.charAt(0).toUpperCase();
            else if (foundUser.email) initial = foundUser.email.charAt(0).toUpperCase();
          }
          
          ctx.fillText(initial, 100, 100);
          
          // Save the generated image for future use
          try {
            // Ensure directory exists
            if (!fs.existsSync(path.dirname(defaultImagePath))) {
              fs.mkdirSync(path.dirname(defaultImagePath), { recursive: true });
            }
            fs.writeFileSync(defaultImagePath, canvas.toBuffer());
          } catch (saveErr) {
            console.warn('Could not save generated image:', saveErr.message);
          }
          
          // Return the generated image
          const buffer = canvas.toBuffer();
          return new NextResponse(buffer, {
            headers: {
              'Content-Type': 'image/png',
              'Cache-Control': 'public, max-age=3600'
            }
          });
        }
      } catch (err) {
        console.warn('Could not create default image:', err.message);
        
        // Simple fallback - return a basic SVG as default image
        const initialLetter = foundUser && foundUser.name ? foundUser.name.charAt(0).toUpperCase() : '?';
        
        // Color based on user type
        const bgColor = userType === 'student' ? '4B5563' : 
                      userType === 'startup' ? '047857' :
                      userType === 'club' ? '3B82F6' : '6B7280';
        
        // Create a simple SVG with the initial letter
        const svgContent = `
          <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
            <rect width="200" height="200" fill="#${bgColor}"/>
            <text x="100" y="115" font-family="Arial" font-size="90" font-weight="bold" fill="white" text-anchor="middle">${initialLetter}</text>
          </svg>
        `;
        
        return new NextResponse(svgContent, {
          headers: {
            'Content-Type': 'image/svg+xml',
            'Cache-Control': 'public, max-age=3600'
          }
        });
      }
    }

    // Sort files by uploadDate to get the most recent one
    const sortedFiles = files.sort((a, b) => b.uploadDate - a.uploadDate);
    const latestFile = sortedFiles[0];
    
    console.log('Using image:', {
      id: latestFile._id.toString(),
      filename: latestFile.filename,
      uploadDate: latestFile.uploadDate
    });
    
    // Set up a download stream
    const downloadStream = bucket.openDownloadStream(latestFile._id);
    
    // Buffer to store file chunks
    const chunks = [];
    
    // Wait for the file to download completely
    return new Promise((resolve) => {
      downloadStream.on('data', (chunk) => {
        chunks.push(chunk);
      });
      
      downloadStream.on('end', () => {
        const buffer = Buffer.concat(chunks);
        
        // Determine content type from filename or default to jpeg
        let contentType = 'image/jpeg';
        const filename = latestFile.filename.toLowerCase();
        if (filename.endsWith('.png')) contentType = 'image/png';
        if (filename.endsWith('.gif')) contentType = 'image/gif';
        if (filename.endsWith('.webp')) contentType = 'image/webp';
        
        console.log(`Returning image with content type: ${contentType}`);
        
        const response = new NextResponse(buffer, {
          headers: {
            'Content-Type': contentType,
            'Cache-Control': 'public, max-age=3600'
          }
        });
        
        resolve(response);
      });
      
      downloadStream.on('error', (err) => {
        console.error('Error downloading image:', err);
        resolve(NextResponse.json(
          { error: 'Error retrieving image: ' + err.message },
          { status: 500 }
        ));
      });
    });
    
  } catch (error) {
    console.error('Profile image retrieval error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve profile image: ' + error.message },
      { status: 500 }
    );
  } finally {
    // No need to close client as it's managed by connectToDatabase
  }
}