"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useCart } from "../context/cartcontext";
import toast, { Toaster } from "react-hot-toast";
import {
  ShoppingBag,
  User,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Home,
  ShoppingCart,
  BookText,
  Info,
  Mail,
} from "lucide-react";

export default function UserHeader() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  const router = useRouter();
  const pathname = usePathname();
  const { cartItems } = useCart();

  const getCookie = (name) => {
    if (typeof document === "undefined") return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  };

  const checkAuth = () => {
    const isLoggedIn = getCookie("isLoggedIn") === "true";
    const name = getCookie("userName");
    const role = getCookie("userRole");

    if (isLoggedIn) {
      setUser({ firstName: name || "User", role: role || "user" });
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    checkAuth();
    setShowDropdown(false);
    setIsMobileMenuOpen(false); // Link click thaya pachi mobile menu bandh thai jase
  }, [pathname]);

  const handleLogout = () => {
    document.cookie =
      "isLoggedIn=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    document.cookie =
      "userRole=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    document.cookie =
      "userName=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    localStorage.removeItem("userToken");

    setUser(null);
    setShowDropdown(false);
    toast.success("Logged out successfully");
    router.push("/");
    router.refresh();
  };

  return (
    <nav className="w-full bg-white sticky top-0 z-50 shadow-sm border-b">
      <Toaster position="top-center" />

      <div className="max-w-7xl mx-auto px-4 h-16 md:h-20 flex items-center justify-between">
        {/* Left Side: Mobile Menu Button & Logo */}
        <div className="flex items-center gap-4">
          <button
            className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-md transition"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu size={24} />
          </button>
          <Link href="/">
            <img src="/img/Logo.png" alt="logo" className="h-8 md:h-10" />
          </Link>
        </div>

        <div className="hidden lg:flex items-center gap-10 text-[#1A2B49] font-bold uppercase tracking-widest text-sm">
          <Link href="/" className="hover:text-red-500 transition">
            Home
          </Link>
          <Link href="/collection" className="hover:text-red-500 transition">
            Shop
          </Link>
          <Link href="/blog" className="hover:text-red-500 transition">
            Blog
          </Link>
          <Link href="/about" className="hover:text-red-500 transition">
            About Us
          </Link>
        </div>

        <div className="flex items-center gap-2 md:gap-5">
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-1 hover:text-red-500 transition group py-2"
            >
              <User
                size={22}
                className="text-gray-700 group-hover:text-red-500"
              />
              {user && (
                <span className="text-[12px] font-black uppercase hidden md:inline">
                  {user.firstName}
                </span>
              )}
              <ChevronDown
                size={14}
                className={`transition-transform ${showDropdown ? "rotate-180" : ""}`}
              />
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-3 w-52 bg-white border rounded-2xl shadow-2xl py-2 z-100">
                {!user ? (
                  <div className="p-2 space-y-1">
                    <Link
                      href="/login"
                      className="block px-4 py-3 bg-black text-white text-center rounded-xl font-bold text-xs uppercase hover:bg-red-600 transition"
                      onClick={() => setShowDropdown(false)}
                    >
                      login
                    </Link>
                    <Link
                      href="/register"
                      className="block px-4 py-3 border border-black text-black text-center rounded-xl font-bold text-xs uppercase hover:bg-gray-100 transition"
                      onClick={() => setShowDropdown(false)}
                    >
                      register
                    </Link>
                  </div>
                ) : (
                  <>
                    <div className="px-5 py-3 border-b bg-gray-50/50">
                      <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">
                        Account
                      </p>
                      <p className="text-[13px] font-black truncate">
                        {user.firstName}
                      </p>
                    </div>
                    {user.role === "admin" && (
                      <Link
                        href="/admin/dashboard"
                        className="block px-5 py-2.5 text-blue-600 font-bold text-xs hover:bg-blue-50 transition"
                        onClick={() => setShowDropdown(false)}
                      >
                        Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-5 py-3 text-red-600 font-bold flex items-center gap-2 hover:bg-red-50 text-xs uppercase mt-1"
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          <Link
            href="/cart"
            className="relative p-2 hover:bg-gray-100 rounded-full transition"
          >
            <ShoppingBag size={22} />
            {cartItems?.length > 0 && (
              <span className="absolute top-1 right-1 bg-red-500 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {cartItems.length}
              </span>
            )}
          </Link>
        </div>
      </div>

      <div
        className={`fixed inset-0 bg-black/50 transition-opacity z-110 lg:hidden ${isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      <div
        className={`fixed top-0 left-0 h-full w-70 bg-white z-120 transform transition-transform duration-300 ease-in-out lg:hidden ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="p-5 flex justify-between items-center border-b">
          <img src="/img/Logo.png" alt="logo" className="h-8" />
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X size={24} className="text-gray-600" />
          </button>
        </div>

        <div className="flex flex-col p-6 gap-6 text-[#1A2B49] font-bold uppercase tracking-widest">
          <Link
            href="/"
            className="flex items-center gap-3 hover:text-red-500 transition"
          >
            <Home size={20} /> Home
          </Link>
          <Link
            href="/collection"
            className="flex items-center gap-3 hover:text-red-500 transition"
          >
            <ShoppingCart size={20} /> Shop
          </Link>
          <Link
            href="/blog"
            className="flex items-center gap-3 hover:text-red-500 transition"
          >
            <BookText size={20} /> Blog
          </Link>
          <Link
            href="/about"
            className="flex items-center gap-3 hover:text-red-500 transition"
          >
            <Info size={20} /> About Us
          </Link>
          <Link
            href="/contact"
            className="flex items-center gap-3 hover:text-red-500 transition"
          >
            <Mail size={20} /> contact
          </Link>
        </div>

        {!user && (
          <div className="absolute bottom-0 w-full p-6 border-t bg-gray-50">
            <Link
              href="/login"
              className="block w-full py-3 bg-black text-white text-center rounded-xl font-bold uppercase text-sm mb-3"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="block w-full py-3 border border-black text-black text-center rounded-xl font-bold uppercase text-sm"
            >
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
