"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";

export default function AllProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const res = await fetch("/api/user/product");
        const result = await res.json();
        if (result.success) setProducts(result.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllProducts();
  }, []);

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center font-black italic">
        LOADING SHOP...
      </div>
    );

  return (
    <div className="min-h-screen bg-white py-20 px-6 md:px-24">
      <div className="mb-16">
        <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter">
          New Arrivals
        </h1>
        <p className="text-gray-400 font-bold mt-2 tracking-widest uppercase text-xs">
          Explore our latest fashion drops
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.map((product) => (
          <Link
            href={`/product/${product._id}`}
            key={product._id}
            className="group"
          >
            <div className="relative aspect-3/4 rounded-[2.5rem] overflow-hidden bg-gray-100 shadow-sm transition-all duration-500 group-hover:shadow-2xl">
              <img
                src={product.images[0]}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                alt={product.title}
              />
              <div className="absolute top-6 right-6 bg-white px-4 py-2 rounded-2xl font-black text-sm shadow-xl">
                ₹{product.price}
              </div>
            </div>
            <div className="mt-6 text-center">
              <h3 className="font-black text-lg uppercase truncate">
                {product.title}
              </h3>
              <p className="text-red-500 font-bold text-xs tracking-widest uppercase">
                {product.category?.title}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
