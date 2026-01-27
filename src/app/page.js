"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

function Page() {
  const [collections, setCollections] = useState([]);
  const [blogs, setBlogs] = useState([]);

  const partnerLogos = [
    { name: "Dior", src: "https://upload.wikimedia.org/wikipedia/commons/a/a8/Dior_Logo.svg" },
    { name: "H&M", src: "https://upload.wikimedia.org/wikipedia/commons/5/53/H%26M-Logo.svg" },
    { name: "Gucci", src: "https://upload.wikimedia.org/wikipedia/commons/9/9b/Gucci_logo.png" },
    { name: "Zara", src: "https://upload.wikimedia.org/wikipedia/commons/f/fd/Zara_Logo.svg" },
    { name: "Versace", src: "https://upload.wikimedia.org/wikipedia/commons/4/4c/Versace_old_logo.svg" },
    { name: "Estee Lauder", src: "https://upload.wikimedia.org/wikipedia/commons/7/79/Est%C3%A9e_Lauder_Companies_Logo.svg" },
    { name: "Cartier", src: "https://upload.wikimedia.org/wikipedia/commons/8/86/Cartier_logo.svg" },
    { name: "Chanel", src: "https://upload.wikimedia.org/wikipedia/commons/3/35/Chanel_logo.svg" },
  ];

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const res = await fetch("/api/admin/collection");
        const result = await res.json();
        if (result.success && Array.isArray(result.data)) {
          // --- LOGIC: Khali Active (status !== false) hoy ej filter karo ---
          const activeCollections = result.data.filter(item => item.status !== false);
          // Latest 4 collections reverse order ma set karo
          setCollections(activeCollections.reverse().slice(0, 4));
        }
      } catch (err) {
        console.error("Collection fetch error", err);
      }
    };
    fetchCollections();
  }, []);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch("/api/blog", { cache: "no-store" });
        const data = await res.json();
        if (Array.isArray(data)) {
          setBlogs(data.reverse().slice(0, 3));
        }
      } catch (err) {
        console.error("Blog fetch error", err);
      }
    };
    fetchBlogs();
  }, []);

  const getFirstImage = (html) => {
    if (!html) return "https://via.placeholder.com/400x300";
    const doc = new DOMParser().parseFromString(html, "text/html");
    const img = doc.querySelector("img");
    return img ? img.src : "https://via.placeholder.com/400x300";
  };

  return (
    <div className="w-full bg-white overflow-x-hidden">
      {/* --- HERO SECTION --- */}
      <section className="relative min-h-[90vh] flex items-center">
        <div className=" px-6 md:px-12 lg:px-24 w-full flex flex-col lg:flex-row items-center justify-between py-12">
          <div className="z-10 w-full lg:w-1/2 space-y-6 text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-2">
              <span className="text-red-500 font-semibold text-sm md:text-base uppercase tracking-widest">
                2025 Style collection 🔥
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-[#1A2B49] leading-tight">
              Discover The Best <br /> Fashion Style For You
            </h1>
            <p className="text-gray-600 text-sm md:text-lg max-w-md mx-auto lg:mx-0">
              Explore our curated collection of stylish clothing and accessories
              tailored to your unique taste.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <Link href="/collection">
                <button className="bg-[#FF4D59] text-white px-8 py-4 rounded-full font-bold uppercase tracking-widest text-xs flex items-center gap-2 hover:bg-black transition-all shadow-lg">
                  SHOP NOW <span>→</span>
                </button>
              </Link>
              <button className="flex items-center gap-3 font-bold text-[#1A2B49] group text-xs uppercase tracking-widest">
                <span className="w-12 h-12 flex items-center justify-center border-2 border-gray-100 rounded-full bg-white shadow-md group-hover:scale-110 transition-transform">
                  <span className="text-red-500 ml-1">▶</span>
                </span>
                PLAY VIDEO
              </button>
            </div>
            <div className="hidden md:flex justify-center lg:justify-start gap-4 mt-12">
              <div className="w-24 h-32 rounded-t-full overflow-hidden bg-pink-100 border-4 border-white shadow-md">
                <img src="/img/small1.png" alt="Model" className="w-full h-full object-cover" />
              </div>
              <div className="w-24 h-32 rounded-t-full overflow-hidden bg-blue-100 border-4 border-white shadow-md">
                <img src="/img/small2.png" alt="Model" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
          <div className="relative w-full lg:w-1/2 mt-12 lg:mt-0 flex justify-center lg:justify-end">
            <div className="relative w-72 h-96 md:w-112.5 md:h-150 bg-[#C5B4A1] rounded-t-full">
              <img
                src="/img/big1.png"
                alt="Main Style"
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[110%] max-w-none h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* --- PARTNERS MARQUEE --- */}
      <section className="py-10 bg-gray-50 border-y border-gray-100 overflow-hidden">
        <style
          dangerouslySetInnerHTML={{
            __html: `
              @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
              .marquee-inner { display: flex; width: max-content; animation: marquee 30s linear infinite; }
              .marquee-inner:hover { animation-play-state: paused; }
            `,
          }}
        />
        <div
          className="relative flex overflow-hidden items-center"
          style={{ maskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)", WebkitMaskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)" }}
        >
          <div className="marquee-inner py-4">
            <div className="flex shrink-0 items-center">
              {partnerLogos.concat(partnerLogos).map((logo, index) => (
                <div key={index} className="mx-8 md:mx-12 shrink-0">
                  <img src={logo.src} alt={logo.name} className="h-8 md:h-10 w-auto object-contain grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-500" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- POPULAR COLLECTIONS SECTION --- */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4 text-center md:text-left">
            <div>
              <h2 className="text-4xl md:text-5xl font-black text-[#1A2B49] mt-2">
                Popular Collections
              </h2>
            </div>
            <Link
              href="/collection"
              className="text-sm font-bold border-b-2 border-black pb-1 hover:text-red-500 hover:border-red-500 transition-all uppercase tracking-widest"
            >
              View All Collections
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {collections.map((item) => (
              <div
                key={item._id}
                className="group relative h-112.5 rounded-2xl overflow-hidden bg-gray-100 shadow-xl"
              >
                <img
                  src={item.image || "https://via.placeholder.com/500"}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/90 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                <div className="absolute bottom-0 left-0 p-8 w-full translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <h3 className="text-white text-3xl font-black mb-4 uppercase">
                    {item.title}
                  </h3>
                  <Link href={`/collection/${item._id}`}>
                    <button className="bg-white text-black font-black py-4 px-8 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 hover:bg-red-500 hover:text-white flex items-center gap-2 uppercase text-xs tracking-widest">
                      View More <span>→</span>
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
          
          {collections.length === 0 && (
            <div className="text-center py-10 text-gray-400 font-bold uppercase tracking-widest">
              No active collections found.
            </div>
          )}
        </div>
      </section>

      {/* --- BLOG SECTION --- */}
      <section className="py-20 bg-[#FAFAFA]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-[#1A2B49] mt-2">
              Our Latest Blog
            </h2>
            <p className="text-gray-500 mt-4 max-w-lg mx-auto">
              Stay updated with the latest fashion trends and expert tips.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {blogs.map((blog) => (
              <div key={blog._id} className="overflow-hidden shadow-sm transition-shadow group bg-white rounded-2xl">
                <div className="overflow-hidden h-64">
                  <img
                    src={getFirstImage(blog.content)}
                    alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-8 text-center">
                  <h3 className="text-xl font-bold mb-3 text-[#1A2B49] line-clamp-2 uppercase tracking-tight">
                    {blog.title}
                  </h3>
                  <p className="text-gray-500 text-sm line-clamp-3 mb-6">
                    {blog.content.replace(/<[^>]*>/g, "").substring(0, 120)}...
                  </p>
                  <Link
                    href={`/blog/${blog._id}`}
                    className="inline-flex items-center gap-2 text-xs font-black text-black hover:text-red-500 transition-all uppercase tracking-widest border-b-2 border-gray-100 hover:border-red-500 pb-1"
                  >
                    Read More <ArrowRight size={20} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Page;