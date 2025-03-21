import { NextResponse } from 'next/server';
import clientPromise, { connectDB } from '@/lib/mongodb';
import { ObjectId, GridFSBucket } from 'mongodb';

/**
 * POST handler to upload a user's profile image to GridFS
 */
export async function POST(request) {
  try {
    // Check if the request is multipart/form-data
    const contentType = request.headers.get('content-type') || '';
    if (!contentType.includes('multipart/form-data')) {
      console.log('Invalid content type:', contentType);
      return NextResponse.json(
        { error: 'Request must be multipart/form-data' },
        { status: 400 }
      );
    }

    // Parse the form data
    const formData = await request.formData();
    let userId = formData.get('userId');
    const userType = formData.get('userType') || 'student'; // Default to student
    const file = formData.get('file');

    console.log('Image upload request:', { userId, userType, fileName: file?.name });

    // If userId is undefined or 'undefined', try to get it from the token
    if (!userId || userId === 'undefined') {
      console.log('UserID not provided in form, attempting to get from token');
      
      // Get JWT token from cookie
      const token = request.cookies.get('token')?.value;
      
      if (token) {
        try {
          // Verify JWT token
          const JWT_SECRET = process.env.JWT_SECRET || 'startupsnet-secure-jwt-secret-key-2024';
          const secret = new TextEncoder().encode(JWT_SECRET);
          
          const jose = await import('jose');
          const { payload } = await jose.jwtVerify(token, secret);
          
          if (payload.userId) {
            userId = payload.userId;
            console.log('Retrieved userId from token:', userId);
          }
        } catch (tokenError) {
          console.error('Error getting userId from token:', tokenError);
        }
      }
    }

    if (!userId || userId === 'undefined') {
      console.log('Missing or invalid userId in request');
      return NextResponse.json(
        { error: 'Valid user ID is required' },
        { status: 400 }
      );
    }

    if (!file) {
      console.log('Missing file in request');
      return NextResponse.json(
        { error: 'Image file is required' },
        { status: 400 }
      );
    }

    // Validate the file is an image
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      console.log('Invalid file type:', file.type);
      return NextResponse.json(
        { error: 'File must be an image (JPEG, PNG, GIF, or WEBP)' },
        { status: 400 }
      );
    }

    // Set maximum file size (5MB)
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      console.log('File too large:', file.size);
      return NextResponse.json(
        { error: 'File size must be less than 5MB' },
        { status: 400 }
      );
    }

    // Get the file buffer
    const buffer = await file.arrayBuffer();

    // Connect to MongoDB
    const client = await clientPromise;
    
    // Try to use both databases
    const databases = ['users', 'just-ants'];
    let user = null;
    let userCollection = null;
    let db = null;
    
    // Determine the collection name based on user type
    const collectionName = userType === 'student' ? 'students' : 
                          userType === 'startup' ? 'startups' : 
                          'clubs';
    
    // Convert string ID to ObjectId
    let userObjectId;
    try {
      userObjectId = new ObjectId(userId);
    } catch (error) {
      console.error('Invalid ObjectId format:', error);
      return NextResponse.json(
        { error: 'Invalid user ID format' },
        { status: 400 }
      );
    }
    
    // Try to find the user in either database
    for (const dbName of databases) {
      try {
        db = client.db(dbName);
        userCollection = db.collection(collectionName);
        
        console.log(`Looking for user in database: ${dbName}, collection: ${collectionName}`);
        const foundUser = await userCollection.findOne({ _id: userObjectId });
        
        if (foundUser) {
          console.log(`User found in database: ${dbName}`);
          user = foundUser;
          break;
        }
      } catch (err) {
        console.error(`Error checking database ${dbName}:`, err);
      }
    }
    
    if (!user) {
      console.log(`User not found in any database. User ID: ${userId}, Type: ${userType}`);
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Set up GridFS in the database where we found the user
    const bucket = new GridFSBucket(db, {
      bucketName: 'profileImages'
    });

    // Generate a unique filename
    const timestamp = new Date().getTime();
    const uniqueFilename = `${userId}_${timestamp}_${file.name}`;
    
    console.log(`Uploading file: ${uniqueFilename}`);
    
    // Set up an upload stream
    const uploadStream = bucket.openUploadStream(uniqueFilename, {
      metadata: {
        userId,
        userType,
        contentType: file.type,
        originalFilename: file.name,
        uploadDate: new Date()
      }
    });
    
    // Upload the file
    return new Promise((resolve) => {
      let fileId = null;
      
      uploadStream.on('finish', async (fileInfo) => {
        try {
          fileId = fileInfo._id.toString();
          console.log('File uploaded successfully:', fileId);
          
          // Update user record to reference the profile image
          const updateResult = await userCollection.updateOne(
            { _id: userObjectId },
            { 
              $set: { 
                profileImage: fileId,
                updatedAt: new Date()
              } 
            }
          );
          
          console.log('User record updated:', updateResult.matchedCount > 0);
          
          if (updateResult.matchedCount === 0) {
            console.warn('User record not updated - no matching document found');
          }
          
          resolve(NextResponse.json(
            { 
              message: 'Profile image uploaded successfully',
              fileId: fileId
            },
            { status: 201 }
          ));
        } catch (updateError) {
          console.error('Error updating user record:', updateError);
          resolve(NextResponse.json(
            { 
              message: 'Image uploaded but user record not updated',
              error: updateError.message,
              fileId: fileId // Using the saved fileId
            },
            { status: 207 } // Partial success
          ));
        }
      });
      
      uploadStream.on('error', (err) => {
        console.error('Error uploading image:', err);
        resolve(NextResponse.json(
          { error: 'Error uploading image: ' + err.message },
          { status: 500 }
        ));
      });
      
      // Write the buffer to the upload stream
      uploadStream.write(Buffer.from(buffer));
      uploadStream.end();
    });
    
  } catch (error) {
    console.error('Profile image upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload profile image: ' + error.message },
      { status: 500 }
    );
  }
}