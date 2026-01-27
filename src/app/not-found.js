"use client";
import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src="./img/notfound.png"
          alt="Fashion Background"
          className="h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"></div>
      </div>

      <div className="relative z-10 max-w-4xl px-6 text-center">
        <span className="text-white font-black text-[10px] md:text-xs uppercase tracking-[0.4em] mb-4 block animate-fade-in">
          Welcome to Fashion
        </span>

        <h1 className="text-5xl md:text-8xl font-black text-white uppercase italic tracking-tighter leading-none mb-6">
          Page Not Found!
        </h1>

        <p className="text-gray-300 font-bold text-sm md:text-lg max-w-2xl mx-auto leading-relaxed mb-10 tracking-wide">
          Explore our curated collection of stylish clothing and accessories
          tailored to your unique taste.
        </p>

        <div className="flex justify-center">
          <Link
            href="/collection"
            className="group flex items-center gap-3 px-10 py-4 bg-[#FF4D59] text-white rounded-full font-black text-xs md:text-sm uppercase italic tracking-widest hover:bg-white hover:text-[#FF4D59] transition-all duration-500 shadow-2xl"
          >
            Our Collection
            <ArrowRight
              size={18}
              className="group-hover:translate-x-2 transition-transform duration-300"
            />
          </Link>
        </div>
      </div>

      <div className="absolute bottom-10 left-10 hidden md:block">
        <div className="h-20 w-1px bg-white/30 mb-4"></div>
        <p className="text-white/40 text-[10px] uppercase tracking-widest vertical-text">
          EST. 2024
        </p>
      </div>

      <style jsx>{`
        .vertical-text {
          writing-mode: vertical-rl;
          transform: rotate(180deg);
        }
      `}</style>
    </div>
  );
}
