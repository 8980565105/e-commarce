"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function BlogListingPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch("/api/blog", { cache: "no-store" });
        const data = await res.json();
        setBlogs(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch blogs");
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const getFirstImage = (htmlContent) => {
    if (typeof window !== "undefined" && htmlContent) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlContent, "text/html");
      const img = doc.querySelector("img");
      return img
        ? img.src
        : "https://via.placeholder.com/400x250?text=Fashion+Blog";
    }
    return "https://via.placeholder.com/400x250?text=Fashion+Blog";
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen text-2xl">
        Loading Blogs...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="relative h-[80vh] flex items-center justify-center text-center px-6">
        <div
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{
            backgroundImage: `url('./img/image.png')`,
          }}
        >
          <div className="absolute inset-0 bg-black/50"></div>
        </div>

        <div className="relative z-10 max-w-3xl">
          <span className="text-white text-20 font-bold text-xs uppercase tracking-[0.3em]">
            Welcome to Fashion
          </span>
          <h1 className="text-4xl md:text-60 font-black text-white mt-4 uppercase tracking-tighter">
            Clothes Fashion Blog
          </h1>
          <p className="text-gray-200 font-medium mt-6 text-sm md:text-20 leading-relaxed">
            Explore Our curated collection of stylish clothing and accessories
            tailored to your unique taste.
          </p>
        </div>
      </section>

      {/* Blog Grid Section */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
          Latest Blog
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <div
              key={blog._id}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300"
            >
              {/* Image Container */}
              <div className="h-56 overflow-hidden">
                <img
                  src={getFirstImage(blog.content)}
                  alt={blog.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Meta Data */}
              <div className="p-6">
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                  <span className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full font-semibold">
                    Fashion
                  </span>
                  <span>
                    {new Date(blog.createdAt).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>

                {/* Title */}
                <Link href={`/blog/${blog._id}`}>
                  <h3 className="text-xl font-bold text-gray-800 mb-3 hover:text-purple-600 transition-colors line-clamp-2">
                    {blog.title}
                  </h3>
                </Link>

                {/* Short Description */}
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {blog.content.replace(/<[^>]*>?/gm, "").substring(0, 150)}...
                </p>

                {/* Read More Button */}
                <Link
                  href={`/blog/${blog._id}`}
                  className="inline-flex items-center text-purple-600 font-semibold hover:text-purple-800 transition-colors"
                >
                  Read More →
                </Link>
              </div>
            </div>
          ))}
        </div>

        {blogs.length === 0 && (
          <p className="text-center text-gray-500 text-xl mt-12">
            No blogs found.
          </p>
        )}
      </div>
    </div>
  );
}
