import jwt from 'jsonwebtoken';
import cryptoRandomString from 'crypto-random-string';
import { connectToDatabase } from './db';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const TOKEN_EXPIRY = '24h'; // 24 hours

/**
 * Generate a verification token for email verification
 * @param {Object} user - User data
 * @param {string} userType - Type of user (student, startup, club)
 * @returns {string} - JWT token
 */
export const generateVerificationToken = async (user, userType) => {
  try {
    // Generate a random token ID for additional security
    const tokenId = cryptoRandomString({ length: 32, type: 'url-safe' });
    
    // Create a shorter verification code for manual entry (6 digits)
    const verificationCode = cryptoRandomString({ length: 6, type: 'numeric' });
    
    // Create token payload
    const payload = {
      id: user._id.toString(),
      email: user.email,
      type: userType,
      tokenId,
      code: verificationCode,
    };
    
    // Sign the token
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
    
    // Store token in the verificationTokens collection
    const { client, db } = await connectToDatabase();
    
    await db.collection('verificationTokens').insertOne({
      userId: user._id,
      email: user.email,
      tokenId,
      verificationCode,
      userType,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
      used: false
    });
    
    return token;
  } catch (error) {
    console.error('Error generating verification token:', error);
    throw error;
  }
};

/**
 * Verify a token and mark email as verified for the user
 * @param {string} token - JWT token
 * @param {string} email - User email
 * @returns {Object} - User data
 */
export const verifyEmailWithToken = async (token, email, userType) => {
  try {
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Check if token is for the right user and email
    if (decoded.email !== email || decoded.type !== userType) {
      throw new Error('Invalid token for this user');
    }
    
    const { client, db } = await connectToDatabase();
    
    // Check if token exists and hasn't been used
    const storedToken = await db.collection('verificationTokens').findOne({
      tokenId: decoded.tokenId,
      email,
      userType,
      used: false
    });
    
    if (!storedToken) {
      throw new Error('Token not found or already used');
    }
    
    // Check if token is expired based on our database record
    if (storedToken.expiresAt < new Date()) {
      throw new Error('Token has expired');
    }
    
    // Determine which collection to use based on user type
    let collection;
    switch (userType) {
      case 'student':
        collection = 'students';
        break;
      case 'startup':
        collection = 'startups';
        break;
      case 'club':
        collection = 'clubs';
        break;
      default:
        throw new Error('Invalid user type');
    }
    
    // Update user record to mark email as verified
    const result = await db.collection(collection).updateOne(
      { _id: decoded.id, email },
      { 
        $set: { 
          emailVerified: true,
          emailVerifiedAt: new Date() 
        }
      }
    );
    
    if (result.modifiedCount === 0) {
      throw new Error('User not found or already verified');
    }
    
    // Mark token as used
    await db.collection('verificationTokens').updateOne(
      { _id: storedToken._id },
      { $set: { used: true, usedAt: new Date() } }
    );
    
    // Get updated user data
    const user = await db.collection(collection).findOne({ _id: decoded.id });
    
    return user;
  } catch (error) {
    console.error('Error verifying email:', error);
    throw error;
  }
};

// Add a new function to verify an email using a verification code
/**
 * Verify a user's email with a verification code
 * @param {string} code - The verification code
 * @param {string} email - User email
 * @param {string} userType - Type of user (student, startup, club)
 * @returns {Object} - User data
 */
export const verifyEmailWithCode = async (code, email, userType) => {
  try {
    const { client, db } = await connectToDatabase();
    
    // Find the token with matching verification code and email
    const storedToken = await db.collection('verificationTokens').findOne({
      verificationCode: code,
      email,
      userType,
      used: false
    });
    
    if (!storedToken) {
      throw new Error('Invalid verification code or already used');
    }
    
    // Check if token is expired based on our database record
    if (storedToken.expiresAt < new Date()) {
      throw new Error('Verification code has expired');
    }
    
    // Determine which collection to use based on user type
    let collection;
    switch (userType) {
      case 'student':
        collection = 'students';
        break;
      case 'startup':
        collection = 'startups';
        break;
      case 'club':
        collection = 'clubs';
        break;
      default:
        throw new Error('Invalid user type');
    }
    
    // Update user record to mark email as verified
    const result = await db.collection(collection).updateOne(
      { email },
      { 
        $set: { 
          emailVerified: true,
          emailVerifiedAt: new Date() 
        }
      }
    );
    
    if (result.modifiedCount === 0) {
      throw new Error('User not found or already verified');
    }
    
    // Mark token as used
    await db.collection('verificationTokens').updateOne(
      { _id: storedToken._id },
      { $set: { used: true, usedAt: new Date() } }
    );
    
    // Get updated user data
    const user = await db.collection(collection).findOne({ email });
    
    return user;
  } catch (error) {
    console.error('Error verifying email with code:', error);
    throw error;
  }
}; 