
import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/db";
import Blog from "@/models/blog";


export async function GET(req, { params }) {
  try {
    await connectMongoDB();
    const { id } = await params;
    const blog = await Blog.findById(id);
    if (!blog) return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    return NextResponse.json(blog);
  } catch (err) {
    // console.error("GET ERROR:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}


export async function PUT(req, { params }) {
  try {
    await connectMongoDB();
    const { id } = await params;
    const body = await req.json();
    
    const updatedBlog = await Blog.findByIdAndUpdate(
      id, 
      {
        title: body.title,
        content: body.content,
        author: body.author
      }, 
      { new: true }
    );
    
    if (!updatedBlog) return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    return NextResponse.json(updatedBlog);
  } catch (err) {
    // console.error("PUT ERROR:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}


export async function DELETE(req, { params }) {
  try {
    await connectMongoDB();
    const { id } = await params;
    await Blog.findByIdAndDelete(id);
    return NextResponse.json({ message: "Blog Deleted Successfully" });
  } catch (err) {
    // console.error("DELETE ERROR:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}