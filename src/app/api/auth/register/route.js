import { connectMongoDB } from "@/lib/db";
import User from "@/models/users";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectMongoDB();

    const users = await User.find({})
      .select("-password")
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: users }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Database Error: " + error.message },
      { status: 500 },
    );
  }
}

export async function POST(req) {
  try {
    await connectMongoDB();

    const body = await req.json();
    const { firstName, lastName, email, phone, password } = body;

    if (!firstName || !email || !password) {
      return NextResponse.json(
        { message: "Fields are missing" },
        { status: 400 },
      );
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      firstName,
      lastName,
      email,
      phone,
      password: hashedPassword,
    });

    return NextResponse.json(
      { message: "Account Created Successfully!", user: newUser },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Database Error: " + error.message },
      { status: 500 },
    );
  }
}
