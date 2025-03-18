import { NextResponse } from 'next/server';
import clientPromise from '../../../../../../lib/mongodb';
import { ObjectId } from 'mongodb';

/**
 * GET handler to retrieve a user's profile image
 * Uses the user ID to fetch the image from GridFS
 */
export async function GET(request, { params }) {
  try {
    const userId = params.id;
    
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
    
    for (const dbName of databases) {
      try {
        console.log(`Checking database ${dbName} for user image`);
        db = client.db(dbName);
        bucket = new ObjectId.GridFSBucket(db, {
          bucketName: 'profileImages'
        });

        // Check if image exists
        const foundFiles = await bucket.find({ 
          'metadata.userId': userId 
        }).toArray();
        
        console.log(`Found ${foundFiles.length} files in ${dbName}`);
        
        if (foundFiles.length > 0) {
          files = foundFiles;
          break;
        }
      } catch (err) {
        console.error(`Error checking ${dbName} for images:`, err);
      }
    }
    
    if (files.length === 0) {
      console.log('No image found for user:', userId);
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