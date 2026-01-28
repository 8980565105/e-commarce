import { connectMongoDB } from "@/lib/db";
import '@/styles/editor-style.css';
import Blog from "@/models/blog";
import Link from "next/link";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }) {
  const { id } = await params;

  try {
    await connectMongoDB();
    const blog = await Blog.findById(id).lean();

    if (!blog) {
      return { title: "Blog Not Found | Fesona" };
    }

    return {
      title: `${blog.title} | Fesona`,
      description: blog.content.substring(0, 160).replace(/<[^>]*>?/gm, ""),
      openGraph: {
        title: blog.title,
        description: "Read the latest blog post on Fesona",
        type: "article",
      },
    };
  } catch (error) {
    return { title: "Blog | Fesona" };
  }
}

async function getBlog(id) {
  try {
    await connectMongoDB();
    const blog = await Blog.findById(id).lean();
    return blog ? JSON.parse(JSON.stringify(blog)) : null;
  } catch (error) {
    console.error("Database Error:", error);
    return null;
  }
}

export default async function BlogDetailPage({ params }) {
  const { id } = await params;
  const blog = await getBlog(id);

  if (!blog) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <Link
          href="/blog"
          className="inline-flex items-center text-purple-600 font-semibold mb-8 hover:text-purple-800 transition-colors"
        >
          ← Back to Blogs
        </Link>

        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
          {blog.title}
        </h1>

        <div className="flex items-center gap-4 text-gray-600 mb-8 pb-8 border-b border-gray-200">
          <span className="bg-purple-100 text-purple-600 px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wider">
            Fashion
          </span>
          <span className="text-md">
            {new Date(blog.createdAt).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </span>
        </div>

        <div
          className="prose prose-lg max-w-none text-gray-800 leading-relaxed
                     prose-headings:text-gray-900 prose-strong:text-gray-900 
                     prose-img:rounded-xl prose-img:shadow-md"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
      </div>
    </div>
  );
}
