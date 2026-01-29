"use client";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email";
    }

    if (!formData.subject.trim()) newErrors.subject = "Subject is required";
    if (!formData.message.trim()) newErrors.message = "Message is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Sending message...");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success("Message sent successfully!", { id: toastId });
        setFormData({ name: "", email: "", subject: "", message: "" });
        setErrors({});
      } else {
        toast.error("Failed to send message", { id: toastId });
      }
    } catch (err) {
      toast.error("Something went wrong!", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field) =>
    `w-full px-4 py-3 border rounded-md focus:outline-none ${
      errors[field] ? "border-red-500" : "border-gray-300"
    }`;

  return (
    <>
      <Toaster position="top-center" />

      {/* HERO SECTION */}
      <div>
        <section
          className="h-75 bg-cover bg-center flex items-center justify-center text-white"
          style={{
            backgroundImage: "url('./img/contact.png')",
          }}
        >
          <div className="text-center px-6 py-4 rounded">
            <h1 className="text-4xl font-bold">Contact</h1>
            <p className="mt-2 max-w-xs text-sm">
              Explore Our curated collection of stylish clothing and accessories
              tailored to your unique taste.{" "}
            </p>
          </div>
        </section>

        {/* FORM SECTION */}
        <section className="flex justify-center items-center flex-col my-10">
          <h2 className="text-xl font-semibold text-center mb-8">
            Get In Touch With Us
          </h2>
          <form onSubmit={handleSubmit} noValidate className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div className="w-full">
                <label className="text-sm font-medium">Name</label>
                <input
                  type="text"
                  placeholder="Enter Your Name"
                  className={inputClass("name")}
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              {/* Email */}
              <div className="w-full">
                <label className="text-sm font-medium">Email</label>
                <input
                  type="email"
                  placeholder="Enter Your Email"
                  className={inputClass("email")}
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>
            </div>

            {/* Subject */}
            <div className="w-full">
              <label className="text-sm font-medium">Subject</label>
              <input
                type="text"
                placeholder="Enter Subject"
                className={inputClass("subject")}
                value={formData.subject}
                onChange={(e) =>
                  setFormData({ ...formData, subject: e.target.value })
                }
              />
              {errors.subject && (
                <p className="text-red-500 text-sm mt-1">{errors.subject}</p>
              )}
            </div>

            {/* Message */}
            <div className="w-full">
              <label className="text-sm font-medium">Message</label>
              <textarea
                placeholder="Enter Your Message"
                className={`${inputClass("message")} h-32 resize-none`}
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
              />
              {errors.message && (
                <p className="text-red-500 text-sm mt-1">{errors.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-500 text-white py-3 rounded-full hover:bg-red-600 transition disabled:bg-gray-400"
            >
              {loading ? "Sending..." : "Send"}
            </button>
          </form>
        </section>

        {/* MAP SECTION */}
        <section>
          <iframe
            src="https://www.google.com/maps?q=India&output=embed"
            width="100%"
            height="450"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </section>
        
      </div>
    </>
  );
}
