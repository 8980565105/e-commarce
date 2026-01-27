import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/db";
import Collection from "../../../../models/collection";

// 1. GET: Badha collections melvva mate
export async function GET() {
  try {
    await connectMongoDB();
    const collections = await Collection.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: collections });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// 2. POST: Navu collection umerva mate
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

    // Default status: true (Active)
    const newCollection = await Collection.create({ title, image: base64Image, status: true });
    return NextResponse.json({ success: true, message: "Created!", data: newCollection });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// 3. DELETE: Collection delete karva mate
export async function DELETE(request) {
  try {
    await connectMongoDB();
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

// 4. PUT: Edit Title/Image AND Toggle Status
export async function PUT(request) {
  try {
    await connectMongoDB();
    
    const contentType = request.headers.get("content-type");
    let id, updateData = {};

    // Check if request is JSON (for Status Toggle) or FormData (for Edit)
    if (contentType && contentType.includes("application/json")) {
      const body = await request.json();
      id = body.id;
      // Status update logic
      if (body.hasOwnProperty("status")) {
        updateData.status = body.status;
      }
    } else {
      const formData = await request.formData();
      id = formData.get("id");
      const title = formData.get("title");
      const file = formData.get("image");

      if (title) updateData.title = title;

      // Image processing
      if (file && typeof file !== "string") {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        updateData.image = `data:${file.type};base64,${buffer.toString("base64")}`;
      }
    }

    if (!id) {
      return NextResponse.json({ success: false, error: "ID is required" }, { status: 400 });
    }

    const updatedCollection = await Collection.findByIdAndUpdate(
      id, 
      { $set: updateData }, 
      { new: true }
    );

    return NextResponse.json({ 
      success: true, 
      message: "Updated Successfully!", 
      data: updatedCollection 
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}