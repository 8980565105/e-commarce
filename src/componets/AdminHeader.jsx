"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import {
  LayoutDashboard,
  Box,
  Users,
  ShoppingCart,
  User,
  X,
  LogOut,
  Menu,
  ChevronRight,
} from "lucide-react";

export default function AdminHeader() {
  const [showModal, setShowModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [authMode, setAuthMode] = useState("signin");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  const router = useRouter();
  const dropdownTimerRef = useRef(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
  });

  useEffect(() => {
    const savedUser = localStorage.getItem("userToken");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  useEffect(() => {
    if (showDropdown) {
      if (dropdownTimerRef.current) clearTimeout(dropdownTimerRef.current);

      dropdownTimerRef.current = setTimeout(() => {
        setShowDropdown(false);
      }, 3000);
    }

    return () => {
      if (dropdownTimerRef.current) clearTimeout(dropdownTimerRef.current);
    };
  }, [showDropdown]);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const endpoint =
        authMode === "signup" ? "/api/auth/register" : "/api/auth/login";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("userToken", JSON.stringify(data.user));
        setUser(data.user);
        setShowModal(false);
        toast.success(`Welcome Admin, ${data.user.firstName}!`);
        window.location.reload();
      } else {
        toast.error(data.message || "Auth Error");
      }
    } catch (error) {
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    setUser(null);
    setShowDropdown(false);
    toast.success("Logged out from Admin Panel");

    setTimeout(() => {
      router.push("/");
      router.refresh();
    }, 500);
  };

  return (
    <nav className="w-full bg-[#1A2B49] text-white border-b border-white/10 sticky top-0 z-100 font-sans shadow-xl">
      <Toaster position="top-center" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 md:h-20 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            className="lg:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-all"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu size={24} />
          </button>
          <Link
            href="/admin/order"
            className="font-black text-xl tracking-tighter italic"
          >
            ADMIN<span className="text-red-500">PANEL</span>
          </Link>
        </div>

        <div className="hidden lg:flex items-center gap-8 font-bold uppercase tracking-widest text-[10px]">
          <AdminNavLink
            href="/admin/allcollection"
            icon={<LayoutDashboard size={16} />}
            label="Collections"
          />
          <AdminNavLink
            href="/admin/allproduct"
            icon={<Box size={16} />}
            label="Products"
          />
          <AdminNavLink
            href="/admin/order"
            icon={<ShoppingCart size={16} />}
            label="Orders"
          />
          <AdminNavLink
            href="/admin/users"
            icon={<Users size={16} />}
            label="Users"
          />
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 p-2 bg-white/5 hover:bg-white/10 rounded-full transition-all border border-white/10"
            >
              <User size={20} />
              {user && (
                <span className="hidden md:inline text-[11px] font-black uppercase tracking-widest text-red-400">
                  {user.firstName}
                </span>
              )}
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-3 w-56 bg-white text-[#1A2B49] rounded-2xl shadow-2xl py-3 z-110 animate-in fade-in slide-in-from-top-2 duration-200">
                {!user ? (
                  <div className="px-2 space-y-1">
                    <button
                      onClick={() => {
                        setShowModal(true);
                        setAuthMode("signin");
                        setShowDropdown(false);
                      }}
                      className="w-full text-left px-4 py-3 text-xs font-black uppercase hover:bg-gray-50 rounded-xl transition-all"
                    >
                      Login
                    </button>
                  </div>
                ) : (
                  <div className="px-2 space-y-1">
                    <div className="px-4 py-2 border-b mb-1">
                      <p className="text-[10px] text-gray-400 font-bold uppercase">
                        Administrator
                      </p>
                      <p className="text-sm font-black text-[#1A2B49]">
                        {user.firstName} {user.lastName}
                      </p>
                    </div>
                    <Link
                      href="/"
                      onClick={() => setShowDropdown(false)}
                      className="block px-4 py-3 text-xs font-bold uppercase hover:bg-gray-50 rounded-xl"
                    >
                      View Website
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 text-xs font-black uppercase text-red-600 hover:bg-red-50 rounded-xl flex items-center gap-2 border-t mt-1"
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-150 lg:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
          <div className="fixed top-0 left-0 bottom-0 w-70 bg-[#1A2B49] shadow-2xl flex flex-col animate-in slide-in-from-left duration-300 border-r border-white/10">
            <div className="p-6 flex items-center justify-between border-b border-white/10">
              <span className="font-black italic text-white">ADMIN PANEL</span>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 hover:bg-white/10 rounded-full text-white"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-4 space-y-2">
              <MobileAdminLink
                href="/admin/allcollection"
                label="Collections"
                onClick={() => setIsMobileMenuOpen(false)}
              />
              <MobileAdminLink
                href="/admin/allproduct"
                label="Products"
                onClick={() => setIsMobileMenuOpen(false)}
              />
              <MobileAdminLink
                href="/admin/order"
                label="Orders"
                onClick={() => setIsMobileMenuOpen(false)}
              />
              <MobileAdminLink
                href="/admin/users"
                label="Users"
                onClick={() => setIsMobileMenuOpen(false)}
              />
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-200 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md text-[#1A2B49]">
          <div className="bg-white w-full max-w-md rounded-4xl p-8 relative shadow-2xl animate-in fade-in zoom-in duration-300">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-black"
            >
              <X size={24} />
            </button>
            <h2 className="text-2xl font-black text-center mb-6 uppercase tracking-tighter">
              Admin Authentication
            </h2>
            <form onSubmit={handleAuth} className="space-y-4">
              <input
                type="email"
                placeholder="Admin Email"
                required
                className="w-full p-4 bg-gray-50 border rounded-2xl outline-none focus:border-red-400 font-bold text-sm"
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
              <input
                type="password"
                placeholder="Password"
                required
                className="w-full p-4 bg-gray-50 border rounded-2xl outline-none focus:border-red-400 font-bold text-sm"
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#1A2B49] text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-red-500 transition-all shadow-xl disabled:bg-gray-400"
              >
                {loading ? "Authenticating..." : "Login to Dashboard"}
              </button>
            </form>
          </div>
        </div>
      )}
    </nav>
  );
}

function AdminNavLink({ href, icon, label }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 hover:text-red-400 transition-colors py-2"
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}

function MobileAdminLink({ href, label, onClick }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center justify-between p-4 hover:bg-white/5 rounded-xl border border-white/5 transition-all"
    >
      <span className="font-bold uppercase tracking-widest text-[11px] text-white">
        {label}
      </span>
      <ChevronRight size={16} className="text-gray-500" />
    </Link>
  );
}
