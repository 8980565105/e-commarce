"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function BlogListingPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 9;

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch("/api/blog?admin=false", { cache: "no-store" });
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

  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;

  const currentBlogs = blogs.slice(indexOfFirstBlog, indexOfLastBlog);
  const totalPages = Math.ceil(blogs.length / blogsPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 500, behavior: "smooth" });
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
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
        <div className="relative z-10 max-w-3xl text-white">
          <span className="font-bold text-xs uppercase tracking-[0.3em]">
            Welcome to Fashion
          </span>
          <h1 className="text-4xl md:text-6xl font-black mt-4 uppercase tracking-tighter">
            Clothes Fashion Blog
          </h1>
          <p className="font-medium mt-6 text-sm md:text-lg leading-relaxed opacity-90">
            Explore our curated collection of stylish clothing and accessories.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-800 uppercase italic">
          Latest Articles
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {currentBlogs.map((blog) => (
            <div
              key={blog._id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300 flex flex-col"
            >
              <div className="h-64 overflow-hidden relative">
                <img
                  src={getFirstImage(blog.content)}
                  alt={blog.title}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                />
              </div>

              <div className="p-8 flex flex-col grow">
                <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">
                  <span className="text-purple-600">Fashion</span>
                  <span>•</span>
                  <span>
                    {new Date(blog.createdAt).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>

                <Link href={`/blog/${blog._id}`}>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 hover:text-purple-600 transition-colors line-clamp-2 leading-tight uppercase italic">
                    {blog.title}
                  </h3>
                </Link>

                <p className="text-gray-500 text-sm mb-6 line-clamp-3 leading-relaxed">
                  {blog.content.replace(/<[^>]*>?/gm, "").substring(0, 120)}...
                </p>

                <div className="mt-auto">
                  <Link
                    href={`/blog/${blog._id}`}
                    className="inline-flex items-center text-xs font-black uppercase tracking-widest text-purple-600 group"
                  >
                    Read more{" "}
                    <span className="ml-2 group-hover:translate-x-2 transition-transform">
                      →
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {blogs.length > blogsPerPage && (
          <div className="mt-20 flex justify-center items-center gap-3">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-3 rounded-xl border border-gray-200 hover:bg-purple-600 hover:text-white disabled:opacity-20 disabled:hover:bg-transparent disabled:hover:text-current transition-all bg-white"
            >
              <ChevronLeft size={20} />
            </button>

            <div className="flex gap-2">
              {[...Array(totalPages)].map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => paginate(idx + 1)}
                  className={`w-12 h-12 rounded-xl font-black text-xs transition-all ${
                    currentPage === idx + 1
                      ? "bg-purple-600 text-white shadow-xl shadow-purple-100"
                      : "bg-white border border-gray-200 text-gray-400 hover:border-purple-600 hover:text-purple-600"
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>

            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-3 rounded-xl border border-gray-200 hover:bg-purple-600 hover:text-white disabled:opacity-20 disabled:hover:bg-transparent disabled:hover:text-current transition-all bg-white"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}

        {blogs.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg font-bold uppercase tracking-widest">
              No blogs published yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

