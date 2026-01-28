"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import {
  Menu,
  X,
  ShoppingCart,
  PackagePlus,
  Users,
  Package,
  Folders,
  LogOut,
} from "lucide-react";

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    {
      id: "users",
      label: "Users",
      path: "/admin/user",
      icon: <Users size={20} />,
    },
    {
      id: "order",
      label: "Orders",
      path: "/admin/order",
      icon: <ShoppingCart size={20} />,
    },
    {
      id: "blog",
      label: "Blogs",
      path: "/admin/blog",
      icon: <PackagePlus size={20} />,
    },
    {
      id: "allcollection",
      label: "Collections",
      path: "/admin/allcollection",
      icon: <Folders size={20} />,
    },
    {
      id: "allproduct",
      label: "Products",
      path: "/admin/allproduct",
      icon: <Package size={20} />,
    },
  ];

  const toggleSidebar = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    document.cookie =
      "userRole=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    toast.success("Logged out successfully");
    router.push("/login");
    router.refresh();
  };

  return (
    <div className="flex h-screen bg-[#F8F9FA] overflow-hidden font-sans">
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={toggleSidebar}
        />
      )}

      <aside
        className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-[#1E293B] text-white transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <span className="text-xl font-black tracking-tighter text-white">
            ADMIN PANEL
          </span>
          <button
            className="lg:hidden text-slate-400 hover:text-white"
            onClick={toggleSidebar}
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.id}
                href={item.path}
                onClick={() => setIsOpen(false)}
              >
                <div
                  className={`
                  flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200
                  ${
                    isActive
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20"
                      : "text-slate-400 hover:bg-slate-800 hover:text-white"
                  }
                `}
                >
                  {item.icon}
                  <span className="font-semibold text-[15px]">
                    {item.label}
                  </span>
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-700">
          <button
            onClick={handleLogout}
            className="flex items-center gap-4 w-full px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-all font-bold text-[15px]"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* --- Main Content Area --- */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="flex lg:hidden items-center justify-between bg-blue-600 px-5 py-4 shadow-md z-30">
          <button onClick={toggleSidebar} className="text-white p-1">
            <Menu size={28} />
          </button>
          <span className="text-white font-bold tracking-wider">
            ADMIN PANEL
          </span>
          <div className="w-8"></div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-10 lg:p-12">
          {children}
        </div>
      </main>
    </div>
  );
}
