"use client";
import "@/styles/editor-style.css";
import React, { useEffect, useState, useCallback } from "react";
import toast, { Toaster } from "react-hot-toast";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  Search,
  Edit3,
  Trash2,
  Package,
  IndianRupee,
  X,
  Camera,
  CirclePlus,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
} from "lucide-react";

const CKEditorComponent = dynamic(
  () => import("@ckeditor/ckeditor5-react").then((mod) => mod.CKEditor),
  { ssr: false },
);

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [editorLoaded, setEditorLoaded] = useState(false);

  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

 
  const [isEditing, setIsEditing] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false); 
  const [deleteId, setDeleteId] = useState(null); 

  useEffect(() => {
    setEditorLoaded(true);
  }, []);

  const fetchData = useCallback(async () => {
    try {
      const [prodRes, colRes] = await Promise.all([
        fetch("/api/admin/product"),
        fetch("/api/admin/collection"),
      ]);
      const prodData = await prodRes.json();
      const colData = await colRes.json();
      if (prodData.success) setProducts(prodData.data);
      if (colData.success) setCollections(colData.data);
    } catch (error) {
      toast.error("Error loading data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);


  const filteredProducts = products.filter(
    (p) =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category?.title?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };


  const confirmDelete = async () => {
    if (!deleteId) return;
    const toastId = toast.loading("Deleting product...");
    setIsDeleting(false); 

    try {
      const res = await fetch("/api/admin/product", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: deleteId }),
      });
      const result = await res.json();
      if (result.success) {
        toast.success("Product Deleted Successfully!", { id: toastId });
        setProducts((prev) => prev.filter((p) => p._id !== deleteId));
      } else {
        toast.error(result.error, { id: toastId });
      }
    } catch (error) {
      toast.error("Failed to delete", { id: toastId });
    } finally {
      setDeleteId(null);
    }
  };

  const handleEditClick = (product) => {
    setEditProduct({
      ...product,
      category: product.category?._id || product.category,
      description: product.description || "",
    });
    setIsEditing(true);
  };

  const handleImageUpload = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setEditProduct((prev) => ({
        ...prev,
        images: [e.target.result, ...prev.images.slice(1)],
      }));
      toast.success("Image updated!");
    };
    reader.readAsDataURL(file);
  };

  const updateVariant = (index, field, value) => {
    const updatedVariants = [...editProduct.variants];
    updatedVariants[index][field] = value;
    setEditProduct({ ...editProduct, variants: updatedVariants });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Updating...");
    try {
      const res = await fetch("/api/admin/product", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editProduct._id,
          title: editProduct.title,
          description: editProduct.description,
          price: editProduct.price,
          category: editProduct.category,
          images: editProduct.images,
          variants: editProduct.variants,
        }),
      });
      const result = await res.json();
      if (result.success) {
        toast.success("Updated!", { id: toastId });
        setIsEditing(false);
        fetchData();
      } else {
        toast.error(result.error, { id: toastId });
      }
    } catch (error) {
      toast.error("Error updating", { id: toastId });
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    const toastId = toast.loading("Updating status...");
    try {
      const res = await fetch("/api/admin/product", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: !currentStatus }),
      });
      const result = await res.json();
      if (result.success) {
        toast.success("Status updated", { id: toastId });
        setProducts((prev) =>
          prev.map((p) =>
            p._id === id ? { ...p, status: !currentStatus } : p,
          ),
        );
      }
    } catch {
      toast.error("Failed", { id: toastId });
    }
  };

  if (loading)
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-white gap-4">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="font-black text-gray-400 text-xs tracking-widest uppercase">
          Loading products...
        </p>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-black">
      <Toaster position="top-center" />

      {isDeleting && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-200 p-4">
          <div className="bg-white rounded-4xl p-8 max-w-sm w-full animate-in zoom-in-95 duration-200 shadow-2xl text-center">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <AlertCircle size={32} />
            </div>
            <h3 className="text-xl font-black text-gray-900 tracking-tight">
              Delete Product?
            </h3>
            <p className="text-gray-500 mt-2 text-sm font-medium">
              This action cannot be undone. Product will be permanently removed.
            </p>
            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setIsDeleting(false)}
                className="flex-1 py-4 bg-gray-100 rounded-2xl font-black text-gray-500 hover:bg-gray-200 transition-all uppercase text-[10px] tracking-widest"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-4 bg-red-500 text-white rounded-2xl font-black shadow-lg shadow-red-100 hover:bg-red-600 transition-all uppercase text-[10px] tracking-widest"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {isEditing && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-100 p-3 md:p-6">
          <div className="bg-white rounded-xl p-6 md:p-10 w-full max-w-3xl max-h-[90vh] overflow-y-auto relative shadow-2xl border border-gray-100">
            <button
              onClick={() => setIsEditing(false)}
              className="absolute right-8 top-8 text-gray-400 hover:text-red-500 p-2 bg-gray-50 rounded-full"
            >
              <X size={20} />
            </button>
            <h3 className="text-2xl md:text-3xl font-black text-gray-900 mb-8 tracking-tight">
              Edit Product
            </h3>
            <form onSubmit={handleUpdate} className="space-y-6">
              <div className="flex justify-center mb-8">
                <div className="relative group w-32 h-32">
                  <img
                    src={editProduct.images[0]}
                    className="w-full h-full rounded-4xl object-cover border-4 border-white shadow-xl"
                    alt=""
                  />
                  <label className="absolute inset-0 bg-black/40 rounded-4xl opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center cursor-pointer text-white backdrop-blur-[2px]">
                    <Camera size={24} />
                    <span className="text-[10px] font-black mt-2 tracking-widest">
                      CHANGE
                    </span>
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => handleImageUpload(e.target.files[0])}
                    />
                  </label>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                    Title
                  </label>
                  <input
                    className="w-full p-4 bg-gray-50 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-blue-500/20"
                    value={editProduct.title}
                    onChange={(e) =>
                      setEditProduct({ ...editProduct, title: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                    Category
                  </label>
                  <select
                    className="w-full p-4 bg-gray-50 rounded-2xl font-bold outline-none appearance-none"
                    value={editProduct.category}
                    onChange={(e) =>
                      setEditProduct({
                        ...editProduct,
                        category: e.target.value,
                      })
                    }
                  >
                    {collections.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                  Description
                </label>
                <div className="rounded-xl overflow-hidden border-2 border-gray-50">
                  {editorLoaded && (
                    <CKEditorComponent
                      editor={require("@ckeditor/ckeditor5-build-classic")}
                      data={editProduct.description}
                      onChange={(event, editor) =>
                        setEditProduct({
                          ...editProduct,
                          description: editor.getData(),
                        })
                      }
                    />
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                  Base Price (₹)
                </label>
                <input
                  type="number"
                  className="w-full p-4 bg-blue-50/50 rounded-2xl font-black text-blue-600 text-xl outline-none border-2 border-transparent focus:border-blue-500/20"
                  value={editProduct.price}
                  onChange={(e) =>
                    setEditProduct({ ...editProduct, price: e.target.value })
                  }
                />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                  Inventory & Variants
                </label>
                <div className="grid grid-cols-1 gap-3">
                  {editProduct.variants.map((v, i) => (
                    <div
                      key={i}
                      className="grid grid-cols-3 gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100"
                    >
                      <div>
                        <p className="text-[8px] font-black text-gray-400 mb-1 uppercase">
                          Size
                        </p>
                        <input
                          className="w-full bg-white p-3 rounded-xl font-bold text-sm outline-none border border-gray-100"
                          value={v.size}
                          onChange={(e) =>
                            updateVariant(i, "size", e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <p className="text-[8px] font-black text-gray-400 mb-1 uppercase">
                          Stock
                        </p>
                        <input
                          type="number"
                          className="w-full bg-white p-3 rounded-xl font-bold text-sm outline-none border border-gray-100"
                          value={v.stock}
                          onChange={(e) =>
                            updateVariant(i, "stock", Number(e.target.value))
                          }
                        />
                      </div>
                      <div>
                        <p className="text-[8px] font-black text-gray-400 mb-1 uppercase">
                          Price
                        </p>
                        <input
                          type="number"
                          className="w-full bg-white p-3 rounded-xl font-black text-sm text-blue-600 outline-none border border-gray-100"
                          value={v.variantPrice || ""}
                          onChange={(e) =>
                            updateVariant(i, "variantPrice", e.target.value)
                          }
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-col md:flex-row gap-4 pt-6">
                <button
                  type="submit"
                  className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black shadow-xl shadow-blue-200 hover:bg-black transition-all"
                >
                  SAVE CHANGES
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 py-4 bg-gray-100 text-gray-500 rounded-2xl font-black hover:bg-gray-200 transition-all"
                >
                  CANCEL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="mb-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-100">
            <Package size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">
              Products
            </h2>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">
              {filteredProducts.length} Items Listed
            </p>
          </div>
        </div>

        <div className="relative w-full md:w-96">
          <Search
            className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300"
            size={20}
          />
          <input
            type="text"
            placeholder="Search products..."
            className="w-full h-14 pl-14 pr-6 bg-gray-200 border-none rounded-2xl focus:ring-4 ring-blue-500/5 font-bold transition-all"
            onChange={handleSearch}
          />
        </div>

        <div>
          <Link
            href="/admin/product"
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3.5 rounded-2xl shadow-lg shadow-blue-200 transition duration-200"
          >
            <CirclePlus size={20} /> ADD Product
          </Link>
        </div>
      </div>

      {/* --- TABLE AREA --- */}
      <div className="bg-white rounded-xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-400 text-[10px] uppercase font-black tracking-[2px] border-b border-gray-100">
              <tr>
                <th className="px-10 py-6">Product Information</th>
                <th className="px-8 py-6">Category</th>
                <th className="px-8 py-6">Price</th>
                <th className="px-8 py-6">variant&Stock</th>
                <th className="px-8 py-6">Status</th>
                <th className="px-10 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {currentItems.map((product) => (
                <tr
                  key={product._id}
                  className="hover:bg-blue-50/10 transition-all group"
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-5">
                      <img
                        src={product.images[0]}
                        className="h-16 w-16 object-cover rounded-2xl ring-4 ring-gray-50"
                        alt=""
                      />
                      <div>
                        <p className="font-black text-gray-800 text-lg line-clamp-1">
                          {product.title}
                        </p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">
                          ID: {product._id.slice(-6)}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 font-black text-gray-400 text-xs uppercase">
                    <span className="bg-gray-100 px-3 py-1 rounded-lg">
                      {product.category?.title}
                    </span>
                  </td>
                  <td className="px-8 py-6 font-black text-gray-900 text-lg">
                    ₹{product.price}
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col gap-1">
                      {product.variants?.map((v, idx) =>
                        v.stock > 0 ? (
                          <span
                            key={idx}
                            className="text-[10px] font-bold text-gray-600 bg-gray-100 px-2 py-0.5 rounded"
                          >
                            {v.size} : {v.stock}
                          </span>
                        ) : (
                          <span
                            key={idx}
                            className="text-[10px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded italic"
                          >
                            {v.size} : Out of Stock
                          </span>
                        ),
                      )}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <button
                      onClick={() => toggleStatus(product._id, product.status)}
                      className={`px-4 py-2 rounded-full text-xs font-black transition-all ${product.status ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}
                    >
                      {product.status ? "ACTIVE" : "INACTIVE"}
                    </button>
                  </td>
                  <td className="px-10 py-6 text-right">
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => handleEditClick(product)}
                        className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all"
                      >
                        <Edit3 size={18} />
                      </button>
                      <button
                        onClick={() => {
                          setDeleteId(product._id);
                          setIsDeleting(true);
                        }}
                        className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-600 hover:text-white transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
          {currentItems.map((product) => (
            <div
              key={product._id}
              className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-5"
            >
              <div className="flex gap-4">
                <img
                  src={product.images[0]}
                  className="h-24 w-24 rounded-3xl object-cover shadow-md"
                  alt=""
                />
                <div className="flex-1">
                  <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">
                    {product.category?.title}
                  </span>
                  <h4 className="font-black text-gray-900 text-lg mt-1 leading-tight">
                    {product.title}
                  </h4>
                  <p className="text-xl font-black text-gray-900 mt-2">
                    ₹{product.price}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                <div className="flex items-center gap-2 font-black text-gray-500 text-xs uppercase">
                  <Package size={16} /> Stock:{" "}
                  {product.variants?.reduce((acc, v) => acc + v.stock, 0)}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditClick(product)}
                    className="w-10 h-10 flex items-center justify-center bg-white border border-gray-100 text-blue-600 rounded-xl"
                  >
                    <Edit3 size={18} />
                  </button>
                  <button
                    onClick={() => {
                      setDeleteId(product._id);
                      setIsDeleting(true);
                    }}
                    className="w-10 h-10 flex items-center justify-center bg-white border border-gray-100 text-red-500 rounded-xl"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="py-32 text-center bg-white">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
              <Search size={32} />
            </div>
            <p className="text-gray-400 font-black text-xl uppercase tracking-tighter">
              No products found matching your search
            </p>
          </div>
        )}

        {totalPages > 1 && (
          <div className="px-10 py-8 bg-gray-50/50 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest italic">
              Showing{" "}
              <span className="text-blue-500">
                {indexOfFirstItem + 1} -{" "}
                {Math.min(indexOfLastItem, filteredProducts.length)}
              </span>{" "}
              of <span className="text-blue-500">{products.length}</span>{" "}
              product
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="w-10 h-10 p-2 rounded-lg bg-white border border-gray-200 disabled:opacity-30"
              >
                <ChevronLeft size={18} />
              </button>
              <div className="flex gap-1">
                {[...Array(totalPages)].map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => paginate(idx + 1)}
                    className={`w-10 h-10 rounded-lg font-bold text-xs transition-all ${currentPage === idx + 1 ? "bg-blue-600 text-white shadow-lg shadow-blue-200" : "bg-white border border-gray-200 text-gray-500"}`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="w-10 h-10 p-2 rounded-lg bg-white border border-gray-200 disabled:opacity-30"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
