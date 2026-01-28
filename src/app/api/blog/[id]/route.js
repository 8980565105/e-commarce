import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/db";
import Blog from "@/models/blog";

export async function GET(req, { params }) {
  try {
    await connectMongoDB();
    const { id } = await params;
    const blog = await Blog.findById(id);
    if (!blog)
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    return NextResponse.json(blog);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    await connectMongoDB();
    const { id } = await params;
    const body = await req.json();

    const updateData = {
      title: body.title,
      content: body.content,
      author: body.author,
    };

    if (body.status !== undefined) {
      updateData.status = body.status;
    }

    const updatedBlog = await Blog.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedBlog)
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    return NextResponse.json(updatedBlog);
  } catch (err) {
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
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
