
"use client";
import { useMemo } from "react"; 
import { useCart } from "@/context/cartcontext";
import Link from "next/link";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";

export default function CartPage() {
  const { cartItems = [], updateQuantity, removeFromCart } = useCart();

  const calculatedTotal = useMemo(() => {
    return cartItems.reduce((acc, item) => {
      const price = Number(item.price) || 0;
      const qty = Number(item.quantity) || 0;
      return acc + (price * qty);
    }, 0);
  }, [cartItems]);

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center bg-white px-6">
        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6 animate-bounce">
          <ShoppingBag size={40} className="text-gray-300" />
        </div>
        <h2 className="text-3xl font-black uppercase italic tracking-tighter text-gray-900">
          Your bag is empty
        </h2>
        <Link href="/collection" className="mt-8">
          <button className="bg-black text-white px-12 py-4 rounded-2xl font-black uppercase italic tracking-widest hover:bg-red-500 transition-all shadow-xl">
            Start Exploring
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12 px-4 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto">
        <div className="hidden md:grid grid-cols-6 border-b border-gray-100 pb-6 mb-8 px-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
          <div className="col-span-2">Product</div>
          <div className="text-center">Price</div>
          <div className="text-center">Quantity</div>
          <div className="text-center">Total</div>
          <div className="text-right items-center flex justify-end uppercase">Actions</div>
        </div>

        <div className="space-y-10">
          {cartItems.map((item, index) => (
            <div
              key={`${item._id}-${item.selectedSize}-${index}`}
              className="grid grid-cols-1 md:grid-cols-6 gap-6 items-center px-4 group border-b border-gray-50 pb-8 md:border-none"
            >
              <div className="md:col-span-2 flex items-center gap-6">
                <div className="w-24 h-32 shrink-0 overflow-hidden rounded-xl bg-gray-50 border border-gray-100">
                  <img
                    src={item.images?.[0] || "/placeholder.jpg"}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    alt={item.title}
                  />
                </div>
                <div>
                  <h3 className="font-black text-sm uppercase text-gray-800 tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-[10px] font-bold text-gray-400 uppercase mt-1">
                    Size: {item.selectedSize || "N/A"}
                  </p>
                </div>
              </div>

              <div className="hidden md:block text-center font-bold text-gray-500 text-sm">
                ₹{(Number(item.price) || 0).toFixed(2)}
              </div>

              <div className="flex justify-center">
                <div className="flex items-center gap-3 bg-white border border-gray-200 p-1 px-2 rounded-lg">
                  <button
                    onClick={() => updateQuantity(item._id, item.selectedSize, "dec")}
                    className="text-gray-400 hover:text-black transition-colors"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-8 text-center text-xs font-black">
                    {(item.quantity || 1).toString().padStart(2, "0")}
                  </span>
                  <button
                    onClick={() => updateQuantity(item._id, item.selectedSize, "inc")}
                    className="text-gray-400 hover:text-black transition-colors"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              <div className="hidden md:block text-center font-black text-red-400">
                ₹{((Number(item.price) || 0) * (item.quantity || 1)).toFixed(2)}
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => removeFromCart(item._id, item.selectedSize)}
                  className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-all"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 pt-10 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-8">
          <Link href="/collection">
            <button className="border-2 border-black text-black px-8 py-3 rounded-full font-black uppercase text-xs tracking-widest hover:bg-black hover:text-white transition-all">
              Continue Shopping
            </button>
          </Link>

          <div className="flex items-center gap-8">
            <div className="text-right">
              <span className="text-xs font-black uppercase tracking-widest text-gray-400">
                Subtotal:
              </span>
              <span className="text-2xl font-black text-red-500 ml-2">
                ₹{calculatedTotal.toFixed(2)}
              </span>
            </div>
            <Link href="/checkout">
              <button className="bg-black text-white p-4 px-8 rounded-full hover:bg-red-500 transition-all flex items-center gap-2 font-black uppercase text-[10px] tracking-widest shadow-lg">
                Checkout <ArrowRight size={18} />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}