

import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/db";
import Blog from "@/models/blog";

export async function GET() {
  try {
    await connectMongoDB();
    const blogs = await Blog.find({}).sort({ createdAt: -1 });
    return NextResponse.json(blogs);
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch blogs" }, { status: 500 });
  }
}


export async function POST(req) {
  try {
    await connectMongoDB();
    
    const body = await req.json();
    
    if (!body.title || !body.content) {
      return NextResponse.json({ error: "Title and Content are required" }, { status: 400 });
    }

    const newBlog = await Blog.create({
      title: body.title,
      content: body.content,
      author: body.author || "Admin"
    });
    
   
    return NextResponse.json(newBlog, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}