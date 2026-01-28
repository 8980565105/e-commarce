"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import { useCart } from "../../../../context/cartcontext";
import { ChevronLeft, ChevronRight } from "lucide-react";

function CollectionDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { addToCart } = useCart();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryName, setCategoryName] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 9; 

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/user/product?category=${id}`);
        const result = await res.json();

        if (result.success) {
          setProducts(result.data);
          if (result.data.length > 0 && result.data[0].category) {
            setCategoryName(result.data[0].category.title);
          }
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProducts();
  }, [id]);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct,
  );
  const totalPages = Math.ceil(products.length / productsPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 400, behavior: "smooth" });
  };

  const handleDirectAddToCart = (product) => {
    if (product.variants && product.variants.length > 0) {
      const defaultSize = product.variants[0].size;
      const defaultPrice = product.variants[0].variantPrice || product.price;

      addToCart(product, defaultSize, defaultPrice);
      toast.success("Added to cart!");

      setTimeout(() => {
        router.push("/cart");
      }, 300);
    } else {
      addToCart(product, null, product.price);
      router.push("/cart");
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-white font-black text-gray-300 animate-pulse">
        COLLECTING PRODUCTS...
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen text-black">
      <Toaster position="top-center" />

      <section className="bg-gray-50 py-16 px-6 md:px-24 border-b border-gray-100">
        <div className="max-w-7xl mx-auto">
          <span className="text-red-500 font-black text-xs uppercase tracking-[0.3em]">
            Category Store
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 mt-2 uppercase italic tracking-tighter">
            {categoryName || "Collection"}
          </h1>
          <p className="text-gray-400 font-bold mt-4 tracking-wide">
            EXPLORE {products.length} EXCLUSIVE ITEMS
          </p>
        </div>
      </section>

      <section className="py-16 px-6 md:px-6 max-w-7xl mx-auto">
        {currentProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {currentProducts.map((product) => (
                <div
                  key={product._id}
                  className="group border border-transparent hover:border-gray-100 p-2 transition-all"
                >
                  <Link href={`/product/${product._id}`}>
                    <div className="relative h-96 overflow-hidden bg-gray-100 shadow-sm transition-all duration-500">
                      <img
                        src={product.images[0]}
                        alt={product.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    </div>
                  </Link>

                  <div className="mt-6">
                    <Link href={`/product/${product._id}`}>
                      <h3 className="text-xl font-black text-gray-800 group-hover:text-red-500 transition-colors uppercase truncate">
                        {product.title}
                      </h3>
                    </Link>
                    <div className="flex justify-between items-center mt-4">
                      <p className="text-xl font-black text-gray-900">
                        ₹{product.price}
                      </p>

                      <button
                        onClick={() => handleDirectAddToCart(product)}
                        className="px-6 py-3 bg-red-500 text-white rounded-full font-black text-sm shadow-lg hover:bg-black transition-all duration-300 uppercase italic active:scale-90"
                      >
                        Add To Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-20 flex justify-center items-center gap-3">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="w-12 h-12 flex items-center justify-center rounded-2xl border-2 border-gray-100 text-gray-400 hover:border-black hover:text-black disabled:opacity-20 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft size={20} />
                </button>

                <div className="flex gap-2">
                  {[...Array(totalPages)].map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => paginate(idx + 1)}
                      className={`w-12 h-12 rounded-2xl font-black text-sm transition-all ${
                        currentPage === idx + 1
                          ? "bg-black text-white shadow-xl scale-110"
                          : "bg-white border-2 border-gray-100 text-gray-400 hover:border-red-500 hover:text-red-500"
                      }`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="w-12 h-12 flex items-center justify-center rounded-2xl border-2 border-gray-100 text-gray-400 hover:border-black hover:text-black disabled:opacity-20 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="py-32 text-center">
            <h2 className="text-3xl font-black text-gray-200 uppercase tracking-tighter">
              No Products Found
            </h2>
            <Link href="/collection">
              <button className="mt-8 bg-black text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-red-500 transition-all">
                Back to All Collections
              </button>
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}

export default CollectionDetailPage;
