"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react"; // Import for clean icons

export default function BlogListingPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- Pagination States ---
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 9; // Show 9 blogs

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

  // --- Pagination Logic ---
  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = blogs.slice(indexOfFirstBlog, indexOfLastBlog);
  const totalPages = Math.ceil(blogs.length / blogsPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 500, behavior: "smooth" }); // Scroll to grid top on change
  };

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
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-xl font-medium text-gray-500">Loading Blogs...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-[60vh] md:h-[80vh] flex items-center justify-center text-center px-6">
        <div
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{ backgroundImage: `url('./img/image.png')` }}
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
      <div className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
          Latest Blog
        </h2>

        {/* 9 Blogs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentBlogs.map((blog) => (
            <div
              key={blog._id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100 flex flex-col"
            >
              <div className="h-64 overflow-hidden relative">
                <img
                  src={getFirstImage(blog.content)}
                  alt={blog.title}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                />
              </div>

              <div className="p-6 flex flex-col grow">
                <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                  <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                    Fashion
                  </span>
                  <span className="font-medium">
                    {new Date(blog.createdAt).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>

                <Link href={`/blog/${blog._id}`}>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 hover:text-purple-600 transition-colors line-clamp-2 leading-snug">
                    {blog.title}
                  </h3>
                </Link>

                <p className="text-gray-600 mb-6 line-clamp-3 text-sm leading-relaxed">
                  {blog.content.replace(/<[^>]*>?/gm, "").substring(0, 150)}...
                </p>

                <div className="mt-auto">
                  <Link
                    href={`/blog/${blog._id}`}
                    className="inline-flex items-center text-purple-600 font-bold hover:gap-3 transition-all duration-200 group"
                  >
                    READ MORE{" "}
                    <span className="ml-2 group-hover:translate-x-1 transition-transform">
                      →
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* --- CENTERED PAGINATION --- */}
        {blogs.length > blogsPerPage && (
          <div className="mt-16 flex justify-center items-center gap-2">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-gray-300 hover:bg-purple-600 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-current transition-all"
            >
              <ChevronLeft size={20} />
            </button>

            <div className="flex gap-2">
              {[...Array(totalPages)].map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => paginate(idx + 1)}
                  className={`w-10 h-10 rounded-lg font-bold transition-all ${
                    currentPage === idx + 1
                      ? "bg-purple-600 text-white shadow-lg shadow-purple-200"
                      : "bg-white border border-gray-300 text-gray-600 hover:border-purple-600"
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>

            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-gray-300 hover:bg-purple-600 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-current transition-all"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}

        {blogs.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400 text-xl font-medium">
              No blogs found at the moment.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
