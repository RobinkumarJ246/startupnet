import clientPromise from '../../../../../lib/mongodb';
import { isEmail } from 'validator';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

const validateFormData = (data) => {
  const errors = {};

  if (!data.email) errors.email = "Email is required";
  else if (!isEmail(data.email)) errors.email = "Please enter a valid email";

  if (!data.password) errors.password = "Password is required";
  else if (data.password.length < 8) errors.password = "Password must be at least 8 characters";

  if (!data.clubName) errors.clubName = "Club name is required";
  if (data.clubType === 'university' && !data.parentOrganization) errors.parentOrganization = "Parent organization is required for university clubs";
  if (!data.memberCount) errors.memberCount = "Member count is required";
  if (!data.location) errors.location = "Location is required";
  if (!data.clubDescription) errors.clubDescription = "Club description is required";
  if (!data.fullName) errors.fullName = "Contact person name is required";
  if (data.mainActivities.length === 0) errors.mainActivities = "Please select at least one activity";

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
    const client = await clientPromise;
    const db = client.db("users");
    
    // Check if email already exists
    const existingClub = await db.collection("clubs").findOne({ email: data.email });
    if (existingClub) {
      return NextResponse.json(
        { errors: { email: "Email is already registered" } }, 
        { status: 400 }
      );
    }

    // Prepare club data for storage
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

    // Insert the club into the database
    const result = await db.collection("clubs").insertOne(newClub);

    // Return the club data without the password
    const { password, ...clubWithoutPassword } = newClub;
    
    return NextResponse.json({
      message: "Registration successful",
      club: clubWithoutPassword,
      id: result.insertedId
    }, { status: 201 });
  } catch (error) {
    console.error('Error in club registration:', error);
    return NextResponse.json(
      { message: 'An error occurred during registration', error: error.message }, 
      { status: 500 }
    );
  }
} 