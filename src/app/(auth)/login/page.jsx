
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // state to track validation errors
  const [errors, setErrors] = useState({
    email: false,
    password: false,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {
      email: formData.email.trim() === "",
      password: formData.password.trim() === "",
    };

    setErrors(newErrors);

    if (newErrors.email || newErrors.password) {
      toast.error("Please fill in all required fields");
      return;
    }
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("userToken", JSON.stringify(data.user));
        document.cookie = `userRole=${data.user.role}; path=/; max-age=86400`;
        document.cookie = `isLoggedIn=true; path=/; max-age=86400`;

        toast.success("Login successful!");

        if (data.user.role === "admin") {
          router.push("/admin/user");
        } else {
          router.push("/");
        }
        router.refresh();
      } else {
        toast.error(data.message || "Login failed");
      }
    } catch (err) {
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <Toaster />

      <form
        onSubmit={handleSubmit}
        noValidate
        className="p-8 bg-white shadow-xl rounded-2xl space-y-4 border w-full max-w-md"
      >
        <h1 className="text-2xl font-black text-center text-gray-800 uppercase tracking-tight">
          Welcome Back
        </h1>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase text-gray-500">
            Email Address
          </label>
          <input
            type="email"
            placeholder="name@example.com"
            className={`w-full p-3 bg-gray-50 border rounded-xl outline-none transition-all text-black font-semibold shadow-sm ${
              errors.email
                ? "border-red-500"
                : "focus:border-red-400 border-gray-200"
            }`}
            onChange={(e) => {
              setFormData({ ...formData, email: e.target.value });
              if (errors.email) setErrors({ ...errors, email: false });
            }}
            value={formData.email}
          />
          {errors.email && (
            <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider">
              * Email is required
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase text-gray-500">
            Password
          </label>
          <input
            type="password"
            placeholder="••••••••"
            className={`w-full p-3 bg-gray-50 border rounded-xl outline-none transition-all text-black font-semibold shadow-sm ${
              errors.password
                ? "border-red-500"
                : "focus:border-red-400 border-gray-200"
            }`}
            onChange={(e) => {
              setFormData({ ...formData, password: e.target.value });
              if (errors.password) setErrors({ ...errors, password: false });
            }}
            value={formData.password}
          />
          {errors.password && (
            <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider">
              * Password is required
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-4 rounded-xl font-bold uppercase tracking-widest text-[12px] hover:bg-red-500 transition-all shadow-lg disabled:bg-gray-400"
        >
          {loading ? "Verifying..." : "Login"}
        </button>

        <p className="text-center text-[11px] font-bold text-gray-500 uppercase tracking-widest">
          Don't have an account?{" "}
          <a href="/register" className="text-red-500 hover:underline">
            Register
          </a>
        </p>
      </form>
    </div>
  );
}
