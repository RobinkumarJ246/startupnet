import { NextResponse } from 'next/server';
import clientPromise, { connectDB } from '@/lib/mongodb';
import { ObjectId, GridFSBucket } from 'mongodb';

/**
 * GET handler to retrieve a user's profile image
 * Uses the user ID to fetch the image from GridFS
 */
export async function GET(request, context) {
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

    const client = await clientPromise;
    
    // Try both database names
    const databases = ['users', 'just-ants'];
    let files = [];
    let bucket;
    let db;
    
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
    
    for (const dbName of databases) {
      try {
        const testDb = client.db(dbName);
        for (const collectionName of collections) {
          try {
            const collection = testDb.collection(collectionName);
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
                console.log(`Found user in ${dbName}.${collectionName}, type: ${userType}`);
                // Add userType to search criteria
                searchCriteria.push({ 'metadata.userType': userType });
                break;
              }
            }
            if (foundUser) break;
          } catch (err) {
            console.warn(`Error checking collection ${collectionName} in ${dbName}:`, err.message);
          }
        }
        if (foundUser) break;
      } catch (err) {
        console.warn(`Error accessing database ${dbName}:`, err.message);
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
    
    for (const dbName of databases) {
      try {
        console.log(`Checking database ${dbName} for user image`);
        db = client.db(dbName);
        
        // Fix: Use GridFSBucket directly
        bucket = new GridFSBucket(db, {
          bucketName: 'profileImages'
        });

        // Try all search criteria
        for (const criteria of searchCriteria) {
          // Check if image exists
          const foundFiles = await bucket.find(criteria).toArray();
          
          console.log(`Found ${foundFiles.length} files in ${dbName} with criteria:`, JSON.stringify(criteria, null, 2));
          
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
        }
        
        if (files.length > 0) break;
      } catch (err) {
        console.error(`Error checking ${dbName} for images:`, err);
      }
    }
    
    // Check other buckets if needed for student and club accounts
    if (files.length === 0 && (userType === 'student' || userType === 'club')) {
      const alternateBuckets = ['images', 'uploads', 'fs', 'avatars'];
      
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
      
      // Return default image for student and club accounts
      if (userType === 'student' || userType === 'club') {
        console.log(`Returning default image for ${userType}`);
        
        // Return a default image for these account types
        // Updated path to the defaults directory we created
        const defaultPath = `public/defaults/default-${userType}.png`;
        
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
            ctx.fillStyle = userType === 'student' ? '#4B5563' : '#3B82F6';
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
          const bgColor = userType === 'student' ? '4B5563' : '3B82F6';
          
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
      
      return NextResponse.json(
        { error: 'Image not found' },
        { status: 404 }
      );
    }

    // Sort files by uploadDate to get the most recent one
    const sortedFiles = files.sort((a, b) => b.uploadDate - a.uploadDate);
    const latestFile = sortedFiles[0];
    
    console.log('Found image:', {
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
  }
}