"use client";
import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useDropzone } from "react-dropzone";
import toast, { Toaster } from "react-hot-toast";
import { Upload, X, CheckCircle2, Image as ImageIcon } from "lucide-react";

export default function CollectionPage() {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onDrop = useCallback((acceptedFiles) => {
    const selectedFile = acceptedFiles[0];
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !file) {
      toast.error("Please enter title and select a file!");
      return;
    }

    const toastId = toast.loading("Storing data...");
    setLoading(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("image", file);

    try {
      const response = await fetch("/api/admin/collection", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Success: " + result.message, { id: toastId });
        setTitle("");
        setFile(null);
        setPreview(null);
      } else {
        toast.error("Error: " + result.error, { id: toastId });
      }
    } catch (error) {
      toast.error("Something went wrong while saving data.", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-10 flex justify-center items-start">
      <Toaster position="top-center" reverseOrder={false} />

      <div className="w-full max-w-2xl bg-white rounded-xl md:rounded-xl shadow-xl shadow-blue-900/5 border border-gray-100 p-6 md:p-12 transition-all">
        <header className="mb-8">
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
            Add New Collection
          </h1>
          <p className="text-gray-500 text-sm mt-1 font-medium">
            Create a new category for your products
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title Input */}
          <div className="space-y-2">
            <label className="text-[11px] font-black text-gray-400 uppercase tracking-wider ml-1">
              Collection Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Summer Wear, Footwear..."
              className="w-full bg-gray-50 border-2 border-gray-50 p-4 rounded-2xl focus:border-blue-500 focus:bg-white outline-none transition-all font-bold text-gray-700 placeholder:text-gray-300"
            />
          </div>
          {/* Upload Area */}
          <div className="space-y-2">
            <label className="text-[11px] font-black text-gray-400 uppercase tracking-wider ml-1">
              Collection Image
            </label>

            <div
              {...getRootProps()}
              className={`relative border-2 border-dashed rounded-xl p-6 md:p-10 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-50 ${
                isDragActive
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 bg-gray-50 hover:bg-gray-100/50"
              }`}
            >
              <input {...getInputProps()} />

              {preview ? (
                <div className="relative w-full">
                  <div className="relative w-32 h-32 md:w-40 md:h-40 mx-auto">
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-full h-full object-cover rounded-3xl shadow-lg border-4 border-white"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setFile(null);
                        setPreview(null);
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white p-1.5 rounded-full shadow-md hover:bg-red-600 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                  <div className="mt-4 flex items-center justify-center gap-2 text-green-600 font-bold text-sm">
                    <CheckCircle2 size={16} />
                    <span>Image Selected</span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-inner">
                    <Upload size={28} />
                  </div>
                  <p className="text-gray-700 font-bold text-base md:text-lg">
                    {isDragActive ? "Drop it here!" : "Upload Collection Image"}
                  </p>
                  <p className="text-gray-400 text-xs mt-2 font-medium max-w-50 mx-auto">
                    Drag & drop or click to browse (PNG, JPG, SVG)
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full py-4 md:py-5 rounded-2xl text-white font-black text-lg shadow-xl shadow-blue-200 transition-all active:scale-95 flex items-center justify-center gap-3 ${
                loading
                  ? "bg-gray-400 cursor-not-allowed shadow-none"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>PROCESSING...</span>
                </>
              ) : (
                <>
                  <ImageIcon size={20} />
                  <span>STORE COLLECTION</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="bg-gray-200 px-8 py-3 rounded-lg font-bold hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
