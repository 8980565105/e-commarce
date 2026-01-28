import React from "react";
import { Calendar, LineChart, UserPlus, Store } from "lucide-react";

const FashionLandingPage = () => {
  const stats = [
    {
      id: 1,
      icon: <Calendar size={28} />,
      value: "15+",
      label: "Years",
      desc: "The order has been prepared.",
    },
    {
      id: 2,
      icon: <LineChart size={28} />,
      value: "95k",
      label: "Product Sales",
      desc: "The order has been prepared.",
    },
    {
      id: 3,
      icon: <UserPlus size={28} />,
      value: "45k",
      label: "Happy Client",
      desc: "The order has been prepared.",
    },
    {
      id: 4,
      icon: <Store size={28} />,
      value: "10+",
      label: "Our store",
      desc: "The order has been prepared.",
    },
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      <section className="relative h-[80vh] flex items-center justify-center text-center px-6">
        <div
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{
            backgroundImage: `url('./img/banner.png')`,
          }}
        >
          <div className="absolute inset-0 bg-black/50"></div>
        </div>

        <div className="relative z-10 max-w-3xl">
          <span className="text-white font-bold text-xs uppercase tracking-[0.3em]">
            Welcome to Fashion
          </span>
          <h1 className="text-4xl md:text-7xl font-black text-white mt-4 uppercase tracking-tighter">
            Available to Everyone!
          </h1>
          <p className="text-gray-200 font-medium mt-6 text-sm md:text-lg leading-relaxed">
            Explore our curated collection of stylish clothing and accessories
            tailored to your unique taste.
          </p>
        </div>
      </section>

      {/* --- CONTENT SECTIONS --- */}
      <div className="max-w-7xl mx-auto py-20 px-6 md:px-12 space-y-32">
        {/* Section 1: The Best Product */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="rounded-xl overflow-hidden shadow-2xl order-1 md:order-1">
            <img
              src="./img/image (1).png"
              alt="Model"
              className="w-full h-auto object-cover"
            />
          </div>
          <div className="space-y-6 order-2 md:order-2">
            <h2 className="text-3xl font-black text-[#1a2e5a] uppercase">
              The Best Product
            </h2>
            <p className="text-gray-500 leading-relaxed text-justify">
              An order is considered "completed" when it has been fully
              fulfilled and delivered to the customer. This typically means the
              order has been prepared, picked, shipped, and the delivery has
              been confirmed. This typically means the order has been prepared,
              picked, shipped, and the delivery has been confirmed.
            </p>
            <button className="flex items-center gap-2 font-black text-xs uppercase tracking-widest hover:text-blue-700 transition-colors">
              Read More <span className="text-lg">→</span>
            </button>
          </div>
        </div>

        {/* Section 2: Our Mission */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 order-2 md:order-1">
            <h2 className="text-3xl font-black text-[#1a2e5a] uppercase">
              Our Mission
            </h2>
            <p className="text-gray-500 leading-relaxed text-justify">
              An order is considered "completed" when it has been fully
              fulfilled and delivered to the customer. This typically means the
              order has been prepared, picked, shipped, and the delivery has
              been confirmed. This typically means the order has been prepared,
              picked, shipped, and the delivery has been confirmed.
            </p>
            <button className="flex items-center gap-2 font-black text-xs uppercase tracking-widest hover:text-blue-700 transition-colors">
              Read More <span className="text-lg">→</span>
            </button>
          </div>
          <div className="rounded-xl overflow-hidden shadow-2xl order-1 md:order-2">
            <img
              src="./img/image (2).png"
              alt="Craftsmanship"
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      </div>

      <section className="bg-[#FAFAFA] py-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 text-center">
            {stats.map((stat) => (
              <div
                key={stat.id}
                className="flex flex-col items-center space-y-3"
              >
                {/* Icon */}
                <div className="text-[#FF4D59] mb-2 transition-transform hover:scale-110 duration-300">
                  {stat.icon}
                </div>

                {/* Value */}
                <h3 className="text-4xl font-bold text-[#0F172A] tracking-tight">
                  {stat.value}
                </h3>

                {/* Label */}
                <p className="text-sm font-medium text-gray-600">
                  {stat.label}
                </p>

                {/* Description */}
                <p className="text-[11px] text-gray-400 leading-relaxed max-w-37.5">
                  {stat.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default FashionLandingPage;
