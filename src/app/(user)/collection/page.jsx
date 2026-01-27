"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";

function AllCollectionPage() {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const res = await fetch("/api/admin/collection");
        const result = await res.json();
        
        if (result.success) {
          // --- LOGIC: Khali Active collections j filter karo ---
          // item.status !== false etle ke: undefined (juno data) athva true (navo data) 
          const activeOnly = result.data.filter((item) => item.status !== false);
          setCollections(activeOnly);
        }
      } catch (error) {
        console.error("Error fetching collections:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCollections();
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-red-500 rounded-full animate-spin"></div>
          <p className="font-black text-gray-400 tracking-widest uppercase text-xs">Loading Collections...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen text-black">
      
      {/* --- 1. PREMIUM BANNER SECTION --- */}
      <section className="relative h-[40vh] md:h-[50vh] bg-[#1A2B49] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-[-10%] left-[-5%] w-64 h-64 rounded-full bg-white blur-3xl"></div>
          <div className="absolute bottom-[-10%] right-[-5%] w-96 h-96 rounded-full bg-red-500 blur-3xl"></div>
        </div>

        <div className="z-10 text-center px-6">
          <span className="text-red-500 font-black tracking-[0.4em] uppercase text-[10px] md:text-xs mb-4 block">
            Exclusive Styles 2026
          </span>
          <h1 className="text-5xl md:text-8xl font-black text-white mb-6 tracking-tighter uppercase italic">
            OUR COLLECTIONS
          </h1>
          <div className="flex items-center justify-center gap-3 text-xs font-bold text-gray-400">
            <Link href="/" className="hover:text-white transition-all uppercase">Home</Link>
            <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
            <span className="text-red-500 uppercase tracking-widest">All Categories</span>
          </div>
        </div>
      </section>

      {/* --- 2. COLLECTION GRID SECTION --- */}
      <section className="py-20 px-6 md:px-12 lg:px-6 max-w-7xl mx-auto">
        
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 uppercase tracking-tight">
            Explore <span className="text-red-500">By Category</span>
          </h2>
          <div className="h-1.5 w-24 bg-red-500 mt-4 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {collections.map((item) => (
            <Link
              key={item._id}
              href={`/collection/${item._id}`}
              className="group relative h-125 rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 block"
            >
              <img
                src={item.image || "https://via.placeholder.com/600x800"}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              />

              <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/30 to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-500" />

              <div className="absolute inset-0 p-10 flex flex-col justify-end">
                <span className="text-red-500 font-black text-[10px] uppercase tracking-[0.3em] mb-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  Shop Now
                </span>
                <h3 className="text-white text-4xl font-black mb-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75 uppercase italic">
                  {item.title}
                </h3>
                
                <div className="overflow-hidden">
                  <span className="inline-flex items-center gap-3 bg-white text-black font-black text-[10px] py-4 px-8 rounded-2xl transform translate-y-20 group-hover:translate-y-0 transition-transform duration-700">
                    VIEW PRODUCTS <span className="text-red-500 text-lg">→</span>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {!loading && collections.length === 0 && (
          <div className="text-center py-24 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
            <h3 className="text-2xl font-black text-gray-300 uppercase">No Active Collections</h3>
            <p className="text-gray-400 mt-2 font-medium">Please check back later for new arrivals.</p>
            <Link href="/" className="mt-6 inline-block text-red-500 font-bold underline uppercase tracking-widest text-xs">
              Go Back Home
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}

export default AllCollectionPage;