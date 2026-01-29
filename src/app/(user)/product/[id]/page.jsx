"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useCart } from "../../../../context/cartcontext";
import toast, { Toaster } from "react-hot-toast";

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState("");
  const [displayPrice, setDisplayPrice] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/user/product?id=${id}`);

        if (!res.ok) {
          router.replace("/product");
          return;
        }

        const result = await res.json();
        if (result.success) {
          const fetchedProduct = result.data;
          setProduct(fetchedProduct);
          setDisplayPrice(fetchedProduct.price);

          const availableVariants = fetchedProduct.variants?.filter(
            (v) => v.stock > 0,
          );

          if (availableVariants && availableVariants.length > 0) {
            setSelectedSize(availableVariants[0].size);
            setDisplayPrice(
              availableVariants[0].variantPrice || fetchedProduct.price,
            );
          }
        }
      } catch (err) {
        router.replace("/product");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id, router]);

  const nextImage = () => {
    if (product?.images) {
      setCurrentImageIndex((prev) =>
        prev === product.images.length - 1 ? 0 : prev + 1,
      );
    }
  };

  const prevImage = () => {
    if (product?.images) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? product.images.length - 1 : prev - 1,
      );
    }
  };

  const handleAddToCart = () => {
    const availableVariants = product.variants?.filter((v) => v.stock > 0);

    if (availableVariants?.length === 0) {
      toast.error("Item is out of stock");
      return;
    }

    if (!selectedSize && product.variants?.length > 0) {
      toast.error("Please select a size");
      return;
    }

    addToCart(product, selectedSize, displayPrice);
    toast.success("Added to Cart!");

    setTimeout(() => {
      router.push("/cart");
    }, 300);
  };

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center font-black italic uppercase text-gray-400 animate-pulse">
        Fetching Details...
      </div>
    );

  if (!product || !product.images || product.images.length === 0)
    return (
      <div className="p-20 text-center uppercase font-black text-black">
        Product Not Found!
      </div>
    );

  const isAllOutOfStock =
    product.variants?.filter((v) => v.stock > 0).length === 0;

  return (
    <div className="min-h-screen bg-white py-12 md:py-24 px-6 md:px-24 text-black">
      <Toaster position="top-center" reverseOrder={false} />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        <div className="sticky top-24 space-y-6">
          <div className="relative group overflow-hidden bg-gray-50 aspect-4/5 rounded-xl">
            <img
              src={product.images[currentImageIndex]}
              className="w-full h-full object-cover transition-all duration-500"
              alt={product.title}
            />
            {product.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <span className="text-xl font-bold">‹</span>
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <span className="text-xl font-bold">›</span>
                </button>
              </>
            )}
          </div>

          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {product.images.map((img, idx) => (
              <div
                key={idx}
                onClick={() => setCurrentImageIndex(idx)}
                className={`shrink-0 w-24 h-24 rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${
                  currentImageIndex === idx
                    ? "border-black shadow-md"
                    : "border-gray-100"
                }`}
              >
                <img
                  src={img}
                  className="w-full h-full object-cover"
                  alt="thumbnail"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col space-y-8">
          <div>
            <h1 className="text-5xl md:text-6xl font-black uppercase italic tracking-tighter mt-2 text-gray-900 leading-none">
              {product.title}
            </h1>
            <p className="text-4xl font-black text-gray-800 mt-6 tracking-tight">
              ₹{displayPrice}
            </p>
          </div>

          <div className="pt-4">
            <p className="font-black uppercase text-xs tracking-[0.2em] mb-4 text-gray-400">
              Select Size
            </p>
            <div className="flex flex-wrap gap-3">
              {product.variants
                ?.filter((v) => v.stock > 0)
                .map((v) => (
                  <button
                    key={v.size}
                    onClick={() => {
                      setSelectedSize(v.size);
                      setDisplayPrice(v.variantPrice || product.price);
                    }}
                    className={`px-8 py-4 rounded-2xl font-black transition-all duration-300 border-2 ${
                      selectedSize === v.size
                        ? "bg-black hover:text-gray-500 text-white border-black shadow-xl scale-105"
                        : "bg-white hover:text-black text-gray-400 border-gray-100 hover:border-gray-300"
                    }`}
                  >
                    {v.size}
                  </button>
                ))}
            </div>
          </div>

          <div className="pt-10 space-y-5">
            <button
              disabled={isAllOutOfStock}
              onClick={handleAddToCart}
              className={`w-full py-6 rounded-[2.5rem] font-black text-xl shadow-2xl transition-all duration-500 uppercase italic tracking-widest active:scale-95 ${
                isAllOutOfStock
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed shadow-none"
                  : "bg-red-500 text-white hover:bg-black"
              }`}
            >
              {isAllOutOfStock ? "Sold Out" : "Add To Cart"}
            </button>

            <div className="flex items-center justify-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
              {isAllOutOfStock ? (
                <>
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                  Currently Unavailable
                </>
              ) : (
                <>
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                  In Stock - Ready to Ship
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-20 border-t pt-10">
        <div
          className="max-w-7xl w-full text-gray-600 leading-relaxed text-lg product-html-content prose prose-red"
          dangerouslySetInnerHTML={{ __html: product.description }}
        />
      </div>
    </div>
  );
}
