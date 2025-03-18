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

  if (!data.fullName) errors.fullName = "Full name is required";
  if (!data.country) errors.country = "Country is required";
  if (data.country === 'India' && !data.state) errors.state = "State is required";
  if (!data.university) errors.university = "University is required";
  if (!data.isUniversityCollege && !data.college) errors.college = "College is required";
  if (!data.graduationYear) errors.graduationYear = "Graduation year is required";
  if (!data.course) errors.course = "Course is required";
  if (!data.major) errors.major = "Major is required";

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
    const existingUser = await db.collection("students").findOne({ email: data.email });
    if (existingUser) {
      return NextResponse.json(
        { errors: { email: "Email is already registered" } }, 
        { status: 400 }
      );
    }

    // Prepare user data for storage
    // Remove confirmPassword as we don't need to store it
    const { confirmPassword, ...userDataToStore } = data;
    
    // Create the user document
    const newUser = {
      ...userDataToStore,
      password: hashedPassword,
      role: 'student',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Insert the user into the database
    const result = await db.collection("students").insertOne(newUser);

    // Return the user data without the password
    const { password, ...userWithoutPassword } = newUser;
    
    return NextResponse.json({
      message: "Registration successful",
      user: userWithoutPassword,
      id: result.insertedId
    }, { status: 201 });
  } catch (error) {
    console.error('Error in student registration:', error);
    return NextResponse.json(
      { message: 'An error occurred during registration', error: error.message }, 
      { status: 500 }
    );
  }
}