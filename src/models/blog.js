
import mongoose, { Schema, models, model } from "mongoose";

const blogSchema = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String, default: "Admin" },
    status: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Blog = models.Blog || model("Blog", blogSchema);
export default Blog;