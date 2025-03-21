import { connectDB } from '@/lib/mongodb';
import { isEmail } from 'validator';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

const validateFormData = (data) => {
  console.log('Validating form data:', JSON.stringify(data, null, 2));
  const errors = {};

  if (!data.email) errors.email = "Email is required";
  else if (!isEmail(data.email)) errors.email = "Please enter a valid email";

  if (!data.password) errors.password = "Password is required";
  else if (data.password.length < 8) errors.password = "Password must be at least 8 characters";

  if (!data.clubName) errors.clubName = "Club name is required";
  
  // Validate university/college for university clubs
  if (data.clubType === 'university') {
    if (!data.university) {
      errors.university = "University is required for university clubs";
    } else if (data.university === 'Other' && !data.otherUniversity) {
      errors.otherUniversity = "Please specify your university";
    }
  }
  
  // Member count is optional but must be a positive number if provided
  if (data.memberCount && (isNaN(data.memberCount) || parseInt(data.memberCount) < 0)) {
    errors.memberCount = "Member count must be a positive number";
  }
  
  if (!data.location) errors.location = "Location is required";
  if (!data.clubDescription) errors.clubDescription = "Club description is required";
  if (!data.fullName) errors.fullName = "Contact person name is required";
  if (data.mainActivities && data.mainActivities.length === 0) errors.mainActivities = "Please select at least one activity";

  console.log('Validation errors:', Object.keys(errors).length > 0 ? errors : 'None');
  return errors;
};

export async function POST(request) {
  console.log('API endpoint hit: /api/register/club');
  
  try {
    // Parse the request body
    console.log('Parsing request body...');
    const data = await request.json();
    console.log('Request data received:', JSON.stringify(data, null, 2));
    
    // Validate the form data
    console.log('Validating form data...');
    const validationErrors = validateFormData(data);
    if (Object.keys(validationErrors).length > 0) {
      console.log('Validation failed with errors:', validationErrors);
      return NextResponse.json({ errors: validationErrors }, { status: 400 });
    }
    console.log('Validation passed');

    // Hash the password
    console.log('Hashing password...');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);
    console.log('Password hashed successfully');
    
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    const db = await connectDB();
    console.log('MongoDB connection established');
    
    // Check if email already exists
    console.log('Checking if email exists:', data.email);
    const existingClub = await db.collection("clubs").findOne({ email: data.email });
    if (existingClub) {
      console.log('Email already exists in database');
      return NextResponse.json(
        { errors: { email: "Email is already registered" } }, 
        { status: 400 }
      );
    }
    console.log('Email is available');

    // Prepare club data for storage
    console.log('Preparing club data for storage...');
    // Remove confirmPassword as we don't need to store it
    const { confirmPassword, ...clubDataToStore } = data;
    
    // Create the club document
    const newClub = {
      ...clubDataToStore,
      password: hashedPassword,
      role: 'club',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    console.log('Club document prepared');

    // Insert the club into the database
    console.log('Inserting club into database...');
    const result = await db.collection("clubs").insertOne(newClub);
    console.log('Club inserted successfully with ID:', result.insertedId);

    // Return the club data without the password
    const { password, ...clubWithoutPassword } = newClub;
    
    console.log('Sending successful response');
    return NextResponse.json({
      message: "Registration successful",
      club: clubWithoutPassword,
      id: result.insertedId
    }, { status: 201 });
  } catch (error) {
    console.error('Error in club registration:', error);
    console.error('Error stack:', error.stack);
    console.error('Error details:', JSON.stringify({
      name: error.name,
      message: error.message,
      code: error.code
    }, null, 2));
    
    return NextResponse.json(
      { message: 'An error occurred during registration', error: error.message }, 
      { status: 500 }
    );
  }
}