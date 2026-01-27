import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/db";
import Product from "@/models/product";

export async function GET() {
  try{
  await connectMongoDB();
  const products = await Product.find({})
    .populate("category")
    .sort({ createdAt: -1 });

  return NextResponse.json({ success: true, data: products });
  }catch (error){
    return NextResponse.json({ success: false, error: error.message });

  }
}

export async function POST(req) {
  await connectMongoDB();
  const data = await req.json();

  const newProduct = await Product.create({
    ...data,
    status: true,
  });

  return NextResponse.json({ success: true, data: newProduct });
}

export async function PUT(req) {
  await connectMongoDB();
  const { id, ...updateData } = await req.json();

  const updated = await Product.findByIdAndUpdate(
    id,
    { $set: updateData },
    { new: true }
  );

  return NextResponse.json({ success: true, data: updated });
}

export async function DELETE(req) {
  try {
    await connectMongoDB();

    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Product ID is required" }, 
        { status: 400 }
      );
    }

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return NextResponse.json(
        { success: false, error: "Product not found or already deleted" }, 
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: "Product deleted successfully" 
    });

  } catch (error) {
    console.error("Delete API Error:", error);
    return NextResponse.json(
      { success: false, error: error.message }, 
      { status: 500 }
    );
  }
}