"use client";
import React from "react";
import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";

export default function SuccessPage() {
  return (
    <div className="my-30 bg-white flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center space-y-8">
        
        <div className="flex justify-center">
          <div className="bg-[#10b981] p-4 rounded-full shadow-lg shadow-green-100">
            <Check size={40} className="text-white stroke-[4px]" />
          </div>
        </div>


        <div className="space-y-4">
          <h1 className="text-5xl font-bold text-[#111827] tracking-tight">
            Your Order Completed
          </h1>
          

          <p className="text-gray-600 text-lg max-w-xl mx-auto leading-relaxed">
            An order is considered "completed" when it has been fully fulfilled and delivered to the customer. 
            This typically means the order has been prepared, packed, shipped, and the delivery has been confirmed.
          </p>
        </div>

        <div className="flex justify-center pt-4">
          <Link 
            href="/"
            className="group bg-[#ff4757] text-white px-10 py-4 rounded-full font-bold uppercase tracking-widest flex items-center gap-3 hover:bg-[#ff3043] transition-all shadow-lg shadow-red-100 active:scale-95"
          >
            Go to Home 
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

      </div>
    </div>
  );
}