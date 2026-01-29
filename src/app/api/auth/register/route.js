

import { connectMongoDB } from "@/lib/db"; 
import User from "@/models/users";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

// --- GET: Fetch all users ---
export async function GET() {
  try {
    await connectMongoDB();

    // Fetch all users, excluding the password field for security
    const users = await User.find({}).select("-password").sort({ createdAt: -1 });

    return NextResponse.json(
      { success: true, data: users }, 
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Database Error: " + error.message }, 
      { status: 500 }
    );
  }
}

// --- POST: Create a new user ---
export async function POST(req) {
  try {
    await connectMongoDB(); 

    const body = await req.json();
    const { firstName, lastName, email, phone, password } = body;

    // Basic validation
    if (!firstName || !email || !password) {
      return NextResponse.json({ message: "Fields are missing" }, { status: 400 });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return NextResponse.json({ message: "User already exists" }, { status: 400 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user in DB
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      phone,
      password: hashedPassword,
    });

    return NextResponse.json({ message: "Account Created Successfully!", user: newUser }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Database Error: " + error.message }, { status: 500 });
  }
}