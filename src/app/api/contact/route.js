import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../lib/db";

import Contact from "@/models/Contact";

export async function POST(req) {
  try {
    await connectMongoDB();
    const body = await req.json();
    
    const newContact = await Contact.create(body);
    
    return NextResponse.json({ success: true, data: newContact }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function GET() {
  try {
    await connectMongoDB();

    // Fetch all documents, sorted by newest first
    const contacts = await Contact.find({}).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: contacts }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch contacts" },
      { status: 500 }
    );
  }
}