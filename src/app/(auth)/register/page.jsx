"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

export default function Register() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    firstName: false,
    lastName: false,
    email: false,
    phone: false,
    password: false,
  });

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);
  const validatePassword = (password) =>
    /^(?=.*[0-9])(?=.*[@#$%&])[A-Za-z0-9@#$%&]{8,}$/.test(password);
  const validatePhone = (phone) => phone.length >= 10;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors((prev) => ({ ...prev, [name]: value.trim() === "" }));

    if (name === "email")
      setErrors((prev) => ({ ...prev, email: !validateEmail(value) }));
    if (name === "password")
      setErrors((prev) => ({ ...prev, password: !validatePassword(value) }));
    if (name === "phone")
      setErrors((prev) => ({ ...prev, phone: !validatePhone(value) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {
      firstName: formData.firstName.trim() === "",
      lastName: formData.lastName.trim() === "",
      email: !validateEmail(formData.email),
      phone: !validatePhone(formData.phone),
      password: !validatePassword(formData.password),
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some((err) => err)) {
      toast.error("red error sole");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("account created!");

        // --- 15 દિવસ માટે Cookies સેટ કરવાનું લોજિક ---
        const maxAge = 15 * 24 * 60 * 60; // 15 days in seconds

        document.cookie = `isLoggedIn=true; path=/; max-age=${maxAge}; SameSite=Lax`;
        document.cookie = `userName=${formData.firstName}; path=/; max-age=${maxAge}; SameSite=Lax`;

        if (data.user?.role) {
          document.cookie = `userRole=${data.user.role}; path=/; max-age=${maxAge}; SameSite=Lax`;
        }

        // Header ના તાત્કાલિક અપડેટ માટે LocalStorage પણ સેટ કરી દઈએ
        localStorage.setItem(
          "userToken",
          JSON.stringify({
            firstName: formData.firstName,
            role: data.user?.role || "user",
          }),
        );

        setTimeout(() => {
          router.push("/");
          router.refresh();
        }, 1500);
      } else {
        toast.error(data.message || "account not created");
      }
    } catch (err) {
      toast.error("server error try agin");
    } finally {
      setLoading(false);
    }
  };

  const getInputClass = (isError) =>
    `w-full p-3 bg-gray-50 border rounded-xl outline-none transition-all text-black font-semibold text-sm ${
      isError
        ? "border-red-500 bg-red-50"
        : "focus:border-red-400 border-gray-200"
    }`;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <Toaster />
      <form
        noValidate
        onSubmit={handleSubmit}
        className="p-8 bg-white shadow-xl rounded-2xl space-y-4 border w-full max-w-md"
      >
        <h1 className="text-2xl font-black text-center text-gray-800 uppercase tracking-tight">
          Create Account
        </h1>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase text-gray-500">
              First Name
            </label>
            <input
              name="firstName"
              type="text"
              placeholder="John"
              className={getInputClass(errors.firstName)}
              value={formData.firstName}
              onChange={handleChange}
            />
            {errors.email && (
              <p className="text-[9px] text-red-500 font-bold">*required</p>
            )}
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase text-gray-500">
              Last Name
            </label>
            <input
              name="lastName"
              type="text"
              placeholder="Doe"
              className={getInputClass(errors.lastName)}
              value={formData.lastName}
              onChange={handleChange}
            />
            {errors.email && (
              <p className="text-[9px] text-red-500 font-bold">*required</p>
            )}
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase text-gray-500">
            Email Address
          </label>
          <input
            name="email"
            type="email"
            placeholder="john@example.com"
            className={getInputClass(errors.email)}
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && (
            <p className="text-[9px] text-red-500 font-bold">*required</p>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase text-gray-500">
            Phone Number
          </label>
          <input
            name="phone"
            type="tel"
            placeholder="9876543210"
            className={getInputClass(errors.phone)}
            value={formData.phone}
            onChange={handleChange}
          />
          {errors.phone && (
            <p className="text-[9px] text-red-500 font-bold">*required</p>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase text-gray-500">
            Password
          </label>
          <input
            name="password"
            type="password"
            placeholder="••••••••"
            className={getInputClass(errors.password)}
            value={formData.password}
            onChange={handleChange}
          />
          <p
            className={`text-[9px] mt-1 font-medium ${errors.password ? "text-red-500 font-bold" : "text-gray-400"}`}
          >
            * 8+ chars, 1 number, 1 special (@#$%&)
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-4 rounded-xl font-bold uppercase tracking-widest text-[12px] hover:bg-red-500 transition-all shadow-lg disabled:bg-gray-400"
        >
          {loading ? "Creating Account..." : "Sign Up"}
        </button>

        <p className="text-center text-[11px] font-bold text-gray-500 uppercase tracking-widest">
          Already have an account?{" "}
          <a href="/login" className="text-red-500 hover:underline">
            Login here
          </a>
        </p>
      </form>
    </div>
  );
}
