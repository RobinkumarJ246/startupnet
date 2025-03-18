import { NextResponse } from 'next/server';
import clientPromise from '../../../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(request) {
  try {
    const userData = await request.json();
    
    // Validate input
    if (!userData.email || !userData.type) {
      return NextResponse.json(
        { error: 'Email and user type are required' },
        { status: 400 }
      );
    }

    // Connect to the database
    const client = await clientPromise;
    
    // Try both potential database names
    const dbNames = ['users', 'just-ants'];
    let db;
    let updated = false;
    let user = null;
    
    for (const dbName of dbNames) {
      if (updated) break;
      
      try {
        db = client.db(dbName);
        console.log(`Attempting to update user in database: ${dbName}`);
        
        // Determine which collection to update based on user type
        const collection = userData.type === 'student' ? 'students' : 
                           userData.type === 'startup' ? 'startups' : 
                           userData.type === 'club' ? 'clubs' : null;
        
        if (!collection) {
          continue; // Skip to next database if invalid collection
        }
        
        // Get the user by email
        user = await db.collection(collection).findOne({ email: userData.email });
        
        if (!user) {
          console.log(`User not found in ${dbName}.${collection}`);
          continue; // Skip to next database if user not found
        }
        
        console.log(`User found in ${dbName}.${collection}, updating profile...`);
        
        // Create update document, removing fields we don't want to modify
        const { type, email, id, _id, password, ...updateData } = userData;
        
        // Add updated timestamp
        updateData.updatedAt = new Date();
        
        // Update the user document
        const result = await db.collection(collection).updateOne(
          { email: userData.email },
          { $set: updateData }
        );
        
        if (result.modifiedCount === 0) {
          console.log('No changes were made to the document');
        } else {
          console.log(`Successfully updated user in ${dbName}.${collection}`);
          updated = true;
          
          // Get the updated user
          user = await db.collection(collection).findOne({ email: userData.email });
        }
      } catch (err) {
        console.error(`Error updating in ${dbName}:`, err);
      }
    }
    
    if (!updated || !user) {
      return NextResponse.json(
        { error: 'Failed to update profile. User not found.' },
        { status: 404 }
      );
    }
    
    // Prepare the user object for response (remove sensitive data)
    const { password, ...userWithoutPassword } = user;
    
    return NextResponse.json({
      message: 'Profile updated successfully',
      user: userWithoutPassword
    });
    
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
} 