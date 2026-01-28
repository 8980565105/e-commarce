

"use client";
import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

import {
  Plus,
  X,
  Trash2,
  Package,
  Image as ImageIcon,
  Sparkles,
} from "lucide-react";

const CKEditorComponent = dynamic(
  () => import("@ckeditor/ckeditor5-react").then((mod) => mod.CKEditor),
  { ssr: false },
);

export default function ProductForm({ editData = null, onComplete }) {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editorLoaded, setEditorLoaded] = useState(false);
  const router = useRouter();

  const initialState = {
    title: "",
    description: "",
    price: "",
    comparePrice: "",
    category: "",
    images: [],
    variants: [{ size: "", stock: 0, variantPrice: "" }],
  };

  const [formData, setFormData] = useState(initialState);

  useEffect(() => {
    setEditorLoaded(true);
    const fetchCats = async () => {
      const res = await fetch("/api/admin/collection");
      const result = await res.json();
      if (result.success) setCollections(result.data);
    };
    fetchCats();
  }, []);

  useEffect(() => {
    if (editData) {
      setFormData({
        ...editData,
        category: editData.category?._id || editData.category,
        variants: editData.variants?.map((v) => ({
          ...v,
          variantPrice: v.variantPrice || "",
        })) || [{ size: "", stock: 0, variantPrice: "" }],
      });
    }
  }, [editData]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, reader.result],
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    });
  };

  const addVariant = () =>
    setFormData({
      ...formData,
      variants: [...formData.variants, { size: "", stock: 0, variantPrice: "" }],
    });

  const removeVariant = (index) => {
    if (formData.variants.length > 1) {
      const newVariants = formData.variants.filter((_, i) => i !== index);
      setFormData({ ...formData, variants: newVariants });
    }
  };

  const updateVariant = (index, field, value) => {
    const newVariants = [...formData.variants];
    newVariants[index][field] = value;
    setFormData({ ...formData, variants: newVariants });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ૨. જો પહેલેથી પ્રોસેસ ચાલુ હોય તો બીજી વાર ફંક્શન રન ન થાય (Prevent Multiple Clicks)
    if (loading) return;

    setLoading(true);
    const toastId = toast.loading(editData ? "Updating..." : "Publishing...");

    const finalVariants = formData.variants.map((v) => ({
      ...v,
      variantPrice: v.variantPrice || formData.price,
    }));

    const finalData = { ...formData, variants: finalVariants };

    try {
      const method = editData ? "PUT" : "POST";
      const payload = editData ? { ...finalData, id: editData._id } : finalData;

      const res = await fetch("/api/admin/product", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await res.json();

      if (result.success) {
        toast.success(editData ? "Updated!" : "Published!", { id: toastId });

        // ૩. ફોર્મ ક્લિયર લોજિક (ફક્ત જો નવો પ્રોડક્ટ હોય તો)
        if (!editData) {
          setFormData(initialState);
        }

        if (onComplete) onComplete();
      } else {
        toast.error(result.error || "Failed", { id: toastId });
      }
    } catch (err) {
      toast.error("Error connecting to server", { id: toastId });
    } finally {
      // ૪. પ્રોસેસ પૂરી થાય એટલે લોડિંગ ફોલ્સ કરવું
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-10 bg-white md:rounded-xl shadow-2xl border border-gray-100 my-0 md:my-10 text-black font-sans">
      <Toaster position="top-center" />

      <style>{`
        .ck-editor__editable_inline {
          min-height: 300px; /* હાઇટ વધારવા માટે */
        }
      `}</style>

      <div className="mb-8 md:mb-12 text-center">
        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
          <Sparkles size={12} /> Product Management
        </div>
        <h2 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight uppercase italic">
          {editData ? "Edit Product" : "Deploy Item"}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 md:space-y-12">
        {/* GALLERY SECTION */}
        <div className="space-y-4">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2 flex items-center gap-2">
            <ImageIcon size={14} /> Product Gallery
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-4 bg-gray-50 p-4 md:p-8 rounded-xl border-2 border-dashed border-gray-200">
            <label className="aspect-square flex flex-col items-center justify-center bg-white rounded-xl cursor-pointer hover:border-blue-400 transition-all border-2 border-gray-100 group shadow-sm">
              <Plus
                size={24}
                className="text-gray-300 group-hover:text-blue-500 mb-1"
              />
              <span className="text-[9px] font-black text-gray-400 group-hover:text-blue-500 uppercase">
                Add Photo
              </span>
              <input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>

            {formData.images.map((img, idx) => (
              <div
                key={idx}
                className="relative aspect-square rounded-xl overflow-hidden shadow-md border-2 border-white group"
              >
                <img
                  src={img}
                  className="w-full h-full object-cover"
                  alt="preview"
                />
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-lg transform scale-90 md:opacity-0 md:group-hover:opacity-100 transition-all"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* BASIC INFO */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <div className="md:col-span-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">
              Product Title
            </label>
            <input
              className="w-full p-4 md:p-5 bg-gray-50 rounded-2xl font-bold border-2 border-transparent focus:border-blue-500 focus:bg-white outline-none mt-2 transition-all text-sm md:text-base"
              placeholder="e.g. PREMIUM OVERSIZED TEE"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">
              Description
            </label>
            <div className="mt-2 overflow-hidden border-2 border-gray-50 bg-gray-50 transition-all">
              {editorLoaded && (
                <CKEditorComponent
                  editor={require("@ckeditor/ckeditor5-build-classic")}
                  data={formData.description}
                  onChange={(event, editor) => {
                    setFormData({ ...formData, description: editor.getData() });
                  }}
                  config={{
                    placeholder: "Share the details...",
                    toolbar: [
                      "heading",
                      "|",
                      "bold",
                      "italic",
                      "bulletedList",
                      "numberedList",
                      "undo",
                      "redo",
                    ],
                  }}
                />
              )}
            </div>
          </div>

          <div>
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">
              Base Price (₹)
            </label>
            <input
              type="number"
              className="w-full p-4 md:p-5 bg-gray-50 rounded-2xl font-black text-black border-none outline-none mt-2 text-lg"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              required
            />
          </div>

          <div>
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">
              Collection
            </label>
            <select
              className="w-full p-4 md:p-5 bg-gray-50 rounded-2xl font-bold border-none outline-none mt-2 appearance-none text-gray-600 cursor-pointer"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              required
            >
              <option value="">Choose Collection</option>
              {collections.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* VARIANTS SECTION */}
        <div className="p-4 md:p-8 rounded-xl bg-gray-50/50">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 md:mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-xl text-white">
                <Package size={20} />
              </div>
              <h3 className="font-black text-gray-500 text-[12px] md:text-sm uppercase tracking-[0.2em] italic">
                Inventory & Sizing
              </h3>
            </div>
            <button
              type="button"
              onClick={addVariant}
              className="w-full md:w-auto text-[10px] font-black bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-black transition-all shadow-lg active:scale-95"
            >
              + ADD NEW SIZE
            </button>
          </div>

          <div className="space-y-4">
            {formData.variants.map((v, index) => (
              <div
                key={index}
                className="flex flex-col md:flex-row gap-3 md:gap-4 bg-white p-4 md:p-6 rounded-2xl items-end border border-gray-100 shadow-sm"
              >
                <div className="w-full">
                  <label className="text-[9px] font-black text-gray-400 ml-2 uppercase">
                    Size Name
                  </label>
                  <input
                    placeholder="XL, 42, etc."
                    className="w-full p-4 text-black rounded-xl font-bold outline-none border border-gray-200 focus:border-blue-500 transition-all mt-1"
                    value={v.size}
                    onChange={(e) => updateVariant(index, "size", e.target.value)}
                    required
                  />
                </div>
                <div className="w-full md:w-56">
                  <label className="text-[9px] font-black text-gray-400 ml-2 uppercase">
                    Variant Price (₹)
                  </label>
                  <input
                    type="number"
                    placeholder="Optional"
                    className="w-full p-4 rounded-xl font-black outline-none border border-gray-200 text-black focus:border-blue-500 transition-all mt-1"
                    value={v.variantPrice}
                    onChange={(e) =>
                      updateVariant(index, "variantPrice", e.target.value)
                    }
                  />
                </div>
                <div className="w-full md:w-40">
                  <label className="text-[9px] font-black text-gray-400 ml-2 uppercase">
                    Stock Qty
                  </label>
                  <input
                    type="number"
                    className="w-full p-4 text-black rounded-xl font-bold outline-none border border-gray-200 focus:border-blue-500 transition-all mt-1"
                    value={v.stock}
                    onChange={(e) => updateVariant(index, "stock", e.target.value)}
                    required
                  />
                </div>
                {formData.variants.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeVariant(index)}
                    className="p-4 text-red-500 bg-red-50 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* SUBMIT BUTTONS */}
        <div className="flex flex-col md:flex-row gap-4">
          <button
            disabled={loading}
            type="submit"
            className={`flex-1 py-4 font-black rounded-full transition-all shadow-xl uppercase tracking-[0.2em] text-sm md:text-base italic flex items-center justify-center gap-3 active:scale-95 ${
              loading
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-black"
            }`}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : editData ? (
              "CONFIRM & UPDATE ITEM"
            ) : (
              "PUBLISH TO STORE"
            )}
          </button>

          <button
            type="button"
            onClick={() => router.back()}
            className="px-10 py-4 bg-gray-100 text-gray-500 rounded-full font-black uppercase text-sm tracking-widest hover:bg-gray-200 transition-all"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}