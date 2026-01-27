
import { connectMongoDB } from "@/lib/db";
import User from "@/models/users";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectMongoDB();

    const { email, password } = await req.json();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { message: "User not found with this email" },
        { status: 404 }
      );
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return NextResponse.json(
        { message: "Invalid password. Please try again." },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        message: "Login successful!",
        user: {
          id: user._id,
          firstName: user.firstName,
          email: user.email,
          role: user.role || "user", 
        },
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json(
      { message: "Internal server error: " + error.message },
      { status: 500 }
    );
  }
}