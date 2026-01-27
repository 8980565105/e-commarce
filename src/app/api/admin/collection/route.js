

import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/db";
import Collection from "../../../../models/collection";

// 1. GET: બધા કલેક્શન મેળવવા
export async function GET() {
  try {
    await connectMongoDB();
    const collections = await Collection.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: collections });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// 2. POST: નવું કલેક્શન ઉમેરવા
export async function POST(request) {
  try {
    await connectMongoDB();
    const formData = await request.formData();
    const title = formData.get("title");
    const file = formData.get("image");

    if (!file || !title) {
      return NextResponse.json({ success: false, error: "Title and Image are required" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = `data:${file.type};base64,${buffer.toString("base64")}`;

    const newCollection = await Collection.create({ title, image: base64Image });
    return NextResponse.json({ success: true, message: "Created!", data: newCollection });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// 3. DELETE: કલેક્શન ડીલીટ કરવા
export async function DELETE(request) {
  try {
    await connectMongoDB();
    // URL માંથી ID મેળવવા માટે (દા.ત. /api/admin/collection?id=123)
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "ID is required" }, { status: 400 });
    }

    await Collection.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: "Collection Deleted Successfully!" });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// 4. PUT (EDIT): કલેક્શન અપડેટ કરવા
export async function PUT(request) {
  try {
    await connectMongoDB();
    const formData = await request.formData();
    const id = formData.get("id");
    const title = formData.get("title");
    const file = formData.get("image"); // આ ઓપ્શનલ હોઈ શકે (જો યુઝર ઈમેજ ન બદલે તો)

    if (!id) {
      return NextResponse.json({ success: false, error: "ID is required" }, { status: 400 });
    }

    let updateData = { title };

    // જો નવી ઈમેજ અપલોડ કરી હોય તો જ તેને Base64 માં ફેરવો
    if (file && typeof file !== "string") {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      updateData.image = `data:${file.type};base64,${buffer.toString("base64")}`;
    }

    const updatedCollection = await Collection.findByIdAndUpdate(id, updateData, { new: true });
    
    return NextResponse.json({ 
      success: true, 
      message: "Updated Successfully!", 
      data: updatedCollection 
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}