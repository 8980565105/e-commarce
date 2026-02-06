"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  ShoppingCart,
  LayoutGrid,
  Package,
  FileText,
  Mail,
} from "lucide-react";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalCollections: 0,
    totalSubCollections: 0,
    totalProducts: 0,
    totalBlogs: 0,
    totalContacts: 0,
  });
  const [loading, setLoading] = useState(true);

  const getCount = (data) => {
    if (Array.isArray(data)) return data.length;
    if (data && typeof data.total === "number") return data.total;
    if (data && typeof data.count === "number") return data.count;
    if (data && typeof data.data === "object" && Array.isArray(data.data))
      return data.data.length;
    return 0;
  };

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);

        // Fetch all APIs in parallel
        const responses = await Promise.allSettled([
          fetch("/api/auth/register").then((res) => res.json()),
          fetch("/api/user/order").then((res) => res.json()),
          fetch("/api/admin/collection").then((res) => res.json()),
          fetch("/api/admin/product").then((res) => res.json()),
          fetch("/api/blog").then((res) => res.json()),
          fetch("/api/contact").then((res) => res.json()),
        ]);

        // Map responses back to state keys
        const results = responses.map((result) =>
          result.status === "fulfilled" ? result.value : [],
        );

        setStats({
          totalUsers: getCount(results[0]),
          totalOrders: getCount(results[1]),
          totalCollections: getCount(results[2]),
          totalProducts: getCount(results[3]),
          totalBlogs: getCount(results[4]),
          totalContacts: getCount(results[5]),
        });
      } catch (error) {
        console.error("Dashboard Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const displayStats = [
    {
      label: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600",
      path: "/admin/user",
    },
    {
      label: "Total Orders",
      value: stats.totalOrders,
      icon: ShoppingCart,
      bgColor: "bg-orange-100",
      iconColor: "text-orange-600",
      path: "/admin/order",
    },
    {
      label: "Total category",
      value: stats.totalCollections,
      icon: LayoutGrid,
      bgColor: "bg-green-100",
      iconColor: "text-green-600",
      path: "/admin/allcollection",
    },
     {
      label: "Total sub category",
      value: stats.totalSubCollections,
      icon: LayoutGrid,
      bgColor: "bg-green-100",
      iconColor: "text-green-600",
      path: "/admin/allcollection",
    },
    {
      label: "Total Products",
      value: stats.totalProducts,
      icon: Package,
      bgColor: "bg-purple-100",
      iconColor: "text-purple-600",
      path: "/admin/allproduct",
    },
    {
      label: "Total Blogs",
      value: stats.totalBlogs,
      icon: FileText,
      bgColor: "bg-pink-100",
      iconColor: "text-pink-600",
      path: "/admin/blog",
    },
    {
      label: "Total Contacts",
      value: stats.totalContacts,
      icon: Mail,
      bgColor: "bg-yellow-100",
      iconColor: "text-yellow-600",
      path: "/admin/contact",
    },
    
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
        <div className="mb-8">
          <span className="bg-blue-50 text-blue-700 px-4 py-1.5 rounded-lg font-bold text-lg">
            Admin Dashboard
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayStats.map((item, index) => (
            <Link
              href={item.path}
              key={index}
              className="block transition-transform hover:scale-[1.02]"
            >
              <div className="bg-white border border-gray-100 rounded-2xl p-6 flex justify-between items-center shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)]">
                <div>
                  <p className="text-gray-400 text-sm font-semibold mb-1 uppercase tracking-wider">
                    {item.label}
                  </p>
                  <h3 className="text-4xl font-extrabold text-gray-800">
                    {loading ? (
                      <span className="inline-block w-8 h-8 bg-gray-200 animate-pulse rounded"></span>
                    ) : (
                      item.value
                    )}
                  </h3>
                </div>

                <div
                  className={`p-4 rounded-2xl ${item.bgColor} ${item.iconColor} flex items-center justify-center`}
                >
                  <item.icon size={32} strokeWidth={2.5} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
