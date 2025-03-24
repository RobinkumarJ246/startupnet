import { connectToDatabase } from '@/app/lib/db';
import { isEmail } from 'validator';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import emailService from '@/app/lib/email';
import { generateVerificationToken } from '@/app/lib/verification';
import { ObjectId } from 'mongodb';

const validateFormData = (data) => {
  const errors = {};

  if (!data.email) errors.email = "Email is required";
  else if (!isEmail(data.email)) errors.email = "Please enter a valid email";

  if (!data.password) errors.password = "Password is required";
  else if (data.password.length < 8) errors.password = "Password must be at least 8 characters";

  if (!data.companyName) errors.companyName = "Company name is required";
  if (!data.industry) errors.industry = "Industry is required";
  if (data.industry === 'Other' && !data.customIndustry) errors.customIndustry = "Please specify your industry";
  if (!data.companySize) errors.companySize = "Company size is required";
  if (!data.location.city || !data.location.country) errors.location = "City and country are required";

  return errors;
};

export async function POST(request) {
  try {
    // Parse the request body
    const data = await request.json();
    
    // Validate the form data
    const validationErrors = validateFormData(data);
    if (Object.keys(validationErrors).length > 0) {
      return NextResponse.json({ errors: validationErrors }, { status: 400 });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);
    
    // Connect to MongoDB
    const { client } = await connectToDatabase();
    const db = client.db();
    
    // Check if email already exists
    const existingUser = await db.collection("startups").findOne({ email: data.email });
    if (existingUser) {
      return NextResponse.json(
        { errors: { email: "Email is already registered" } }, 
        { status: 400 }
      );
    }

    // Prepare startup data for storage
    // Remove confirmPassword as we don't need to store it
    const { confirmPassword, ...startupDataToStore } = data;
    
    // Create the startup document
    const newStartup = {
      ...startupDataToStore,
      password: hashedPassword,
      role: 'startup',
      emailVerified: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Insert the startup into the database
    const result = await db.collection("startups").insertOne(newStartup);
    
    // Add the ID to the startup object
    newStartup._id = result.insertedId;
    
    try {
      // Generate verification token
      const verificationToken = await generateVerificationToken(newStartup, 'startup');
      
      // Send verification email
      await emailService.sendVerificationEmail({
        email: newStartup.email,
        name: newStartup.companyName,
        verificationToken,
        userType: 'startup'
      });
      
      console.log(`Verification email sent to ${newStartup.email}`);
    } catch (emailError) {
      console.error('Error sending verification email:', emailError);
      // Continue with registration despite email error
    }

    // Return the startup data without the password
    const { password, ...startupWithoutPassword } = newStartup;
    
    return NextResponse.json({
      message: "Registration successful. Please check your email to verify your account.",
      startup: startupWithoutPassword,
      id: result.insertedId
    }, { status: 201 });
  } catch (error) {
    console.error('Error in startup registration:', error);
    return NextResponse.json(
      { message: 'An error occurred during registration', error: error.message }, 
      { status: 500 }
    );
  }
} 