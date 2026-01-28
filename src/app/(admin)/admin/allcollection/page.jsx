"use client";
import React, { useEffect, useState, useCallback } from "react";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";
import {
  Edit2,
  Trash2,
  Calendar,
  LayoutGrid,
  X,
  AlertCircle,
  CirclePlus,
  ChevronLeft,
  ChevronRight,
  Search,
  Camera,
} from "lucide-react";

export default function CollectionList() {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editData, setEditData] = useState({
    id: "",
    title: "",
    image: null,
    currentImageUrl: "",
  });
  const [deleteId, setDeleteId] = useState(null);

  // --- API Fetching ---
  const fetchCollections = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/collection");
      const result = await res.json();
      if (result.success) {
        setCollections(result.data);
      } else {
        toast.error("Failed to load collections");
      }
    } catch (error) {
      toast.error("Error connecting to server");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCollections();
  }, [fetchCollections]);

  // --- Toggle Status Logic (Fixed Logic) ---
  const toggleStatus = async (id, currentStatus) => {
    // Jo status undefined hoy (juno data), to tene active (true) dhari lo
    const actualStatus = currentStatus === undefined ? true : currentStatus;
    const newStatus = !actualStatus;

    const toastId = toast.loading("Updating status...");
    try {
      const res = await fetch("/api/admin/collection", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          status: newStatus,
        }),
      });

      const result = await res.json();
      if (result.success) {
        toast.success(newStatus ? "Activated" : "Inactivated", { id: toastId });
        setCollections((prev) =>
          prev.map((c) => (c._id === id ? { ...c, status: newStatus } : c)),
        );
      } else {
        toast.error(result.error || "Update failed", { id: toastId });
      }
    } catch (error) {
      toast.error("Failed to update status", { id: toastId });
    }
  };

  // --- Search & Pagination Logic ---
  const filteredCollections = collections.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredCollections.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCollections = filteredCollections.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // --- Delete Handler ---
  const handleDelete = async () => {
    if (!deleteId) return;
    const toastId = toast.loading("Removing collection...");
    setIsDeleting(false);

    try {
      const res = await fetch(`/api/admin/collection?id=${deleteId}`, {
        method: "DELETE",
      });
      const result = await res.json();
      if (result.success) {
        toast.success("Deleted successfully!", { id: toastId });
        setCollections((prev) => prev.filter((c) => c._id !== deleteId));
      } else {
        toast.error(result.error || "Delete failed", { id: toastId });
      }
    } catch (error) {
      toast.error("Something went wrong", { id: toastId });
    } finally {
      setDeleteId(null);
    }
  };

  // --- Update Handler ---
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Updating...");
    const formData = new FormData();
    formData.append("id", editData.id);
    formData.append("title", editData.title);
    if (editData.image) formData.append("image", editData.image);

    try {
      const res = await fetch("/api/admin/collection", {
        method: "PUT",
        body: formData,
      });
      const result = await res.json();
      if (result.success) {
        toast.success("Updated successfully!", { id: toastId });
        setIsEditing(false);
        fetchCollections();
      } else {
        toast.error(result.error || "Update failed", { id: toastId });
      }
    } catch (error) {
      toast.error("Something went wrong", { id: toastId });
    }
  };

  if (loading)
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-white gap-4">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="font-black text-gray-400 text-xs tracking-widest uppercase">
          Loading collections...
        </p>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-black">
      <Toaster position="top-center" />

      {/* --- DELETE MODAL --- */}
      {isDeleting && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-100 p-4">
          <div className="bg-white rounded-4xl p-8 max-w-sm w-full animate-in zoom-in-95 duration-200 shadow-2xl">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <AlertCircle size={32} />
            </div>
            <h3 className="text-xl font-black text-center text-gray-900 tracking-tight">
              Are you sure?
            </h3>
            <p className="text-gray-500 text-center mt-2 text-sm font-medium">
              This category will be permanently removed.
            </p>
            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setIsDeleting(false)}
                className="flex-1 py-4 bg-gray-100 rounded-2xl font-black text-gray-500 hover:bg-gray-200 transition-all"
              >
                CANCEL
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-4 bg-red-500 text-white rounded-2xl font-black shadow-lg shadow-red-100 hover:bg-red-600 transition-all"
              >
                DELETE
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- EDIT MODAL --- */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-100 p-4">
          <div className="bg-white rounded-4xl p-8 md:p-10 w-full max-w-md animate-in zoom-in-95 duration-200 shadow-2xl border border-gray-100 relative">
            <button
              onClick={() => setIsEditing(false)}
              className="absolute right-6 top-6 text-gray-400 hover:text-red-500 p-2 bg-gray-50 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
            <h3 className="text-2xl font-black mb-8 tracking-tight">
              Edit Collection
            </h3>
            <form onSubmit={handleEditSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                  Category Title
                </label>
                <input
                  type="text"
                  className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-500/20 focus:bg-white p-4 rounded-2xl outline-none font-bold transition-all"
                  value={editData.title}
                  onChange={(e) =>
                    setEditData({ ...editData, title: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                  Collection Image
                </label>
                <div className="relative group w-full h-40 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden">
                  {editData.image ? (
                    <img
                      src={URL.createObjectURL(editData.image)}
                      className="w-full h-full object-cover"
                      alt="Preview"
                    />
                  ) : (
                    <img
                      src={editData.currentImageUrl}
                      className="w-full h-full object-cover opacity-60"
                      alt="Current"
                    />
                  )}
                  <label className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all cursor-pointer backdrop-blur-[2px]">
                    <Camera size={24} />
                    <span className="text-[10px] font-black mt-2 tracking-widest uppercase">
                      Change Photo
                    </span>
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) =>
                        setEditData({ ...editData, image: e.target.files[0] })
                      }
                    />
                  </label>
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-black shadow-xl shadow-blue-100 hover:bg-black transition-all"
                >
                  SAVE CHANGES
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- HEADER --- */}
      <div className="mb-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* <div className="flex flex-1 max-w-2xl gap-4 w-full"> */}
       
        <div className="flex justify-between items-center gap-5">
          <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-100">
            <LayoutGrid size={28} />
          </div>
          <div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">
              Collections
            </h2>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">
              Manage Categories & Visuals
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
            placeholder="Search collections..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full h-14 pl-14 pr-6 bg-gray-200 border-none rounded-2xl focus:ring-4 ring-blue-500/5 font-bold transition-all"
          />
        </div>

        <div className="flex justify-center items-center">
          <Link
            href="/admin/admin/collection"
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3.5 rounded-2xl shadow-lg shadow-blue-200 transition duration-200"
          >
           <CirclePlus size={20} /> ADD Collection
          </Link>
        </div>
      </div>
      {/* </div> */}

      {/* --- TABLE AREA --- */}
      <div className="bg-white rounded-xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
        <div className="hidden lg:block">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-400 text-[10px] uppercase font-black tracking-[2px] border-b border-gray-100">
              <tr>
                <th className="px-10 py-6">Visual</th>
                <th className="px-8 py-6">Category Name</th>
                <th className="px-8 py-6">Created On</th>
                <th className="px-8 py-6">Status</th>
                <th className="px-10 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {currentCollections.map((item) => (
                <tr
                  key={item._id}
                  className="hover:bg-blue-50/10 transition-all group"
                >
                  <td className="px-10 py-5">
                    <img
                      src={item.image}
                      className="h-16 w-16 object-cover rounded-2xl ring-4 ring-gray-50 group-hover:ring-blue-50 transition-all shadow-sm"
                      alt={item.title}
                    />
                  </td>
                  <td className="px-8 py-5 text-lg font-black text-gray-800">
                    {item.title}
                  </td>
                  <td className="px-8 py-5 text-gray-400 font-bold text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-gray-300" />
                      {new Date(item.createdAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <button
                      onClick={() => toggleStatus(item._id, item.status)}
                      className={`px-4 py-2 rounded-full text-[10px] font-black transition-all ${
                        item.status !== false
                          ? "bg-green-100 text-green-700 ring-2 ring-green-50"
                          : "bg-red-100 text-red-600 ring-2 ring-red-50"
                      }`}
                    >
                      {item.status !== false ? "ACTIVE" : "INACTIVE"}
                    </button>
                  </td>
                  <td className="px-10 py-5 text-right">
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => {
                          setEditData({
                            id: item._id,
                            title: item.title,
                            currentImageUrl: item.image,
                          });
                          setIsEditing(true);
                        }}
                        className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => {
                          setDeleteId(item._id);
                          setIsDeleting(true);
                        }}
                        className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm"
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

        {/* --- MOBILE VIEW --- */}
        <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
          {currentCollections.map((item) => (
            <div
              key={item._id}
              className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-5"
            >
              <div className="flex gap-4">
                <img
                  src={item.image}
                  className="h-20 w-20 rounded-2xl object-cover shadow-md"
                  alt={item.title}
                />
                <div className="flex-1">
                  <h4 className="font-black text-gray-900 text-xl leading-tight">
                    {item.title}
                  </h4>
                  <p className="text-gray-400 text-[10px] font-bold mt-1 uppercase tracking-widest">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                <button
                  onClick={() => toggleStatus(item._id, item.status)}
                  className={`text-[10px] font-black ${item.status !== false ? "text-green-600" : "text-red-500"}`}
                >
                  {item.status !== false ? "ACTIVE" : "INACTIVE"}
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditData({
                        id: item._id,
                        title: item.title,
                        currentImageUrl: item.image,
                      });
                      setIsEditing(true);
                    }}
                    className="w-10 h-10 flex items-center justify-center bg-white border border-gray-100 text-blue-600 rounded-xl shadow-sm"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => {
                      setDeleteId(item._id);
                      setIsDeleting(true);
                    }}
                    className="w-10 h-10 flex items-center justify-center bg-white border border-gray-100 text-red-500 rounded-xl shadow-sm"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* --- EMPTY STATE --- */}
        {filteredCollections.length === 0 && (
          <div className="py-32 text-center">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
              <Search size={32} />
            </div>
            <p className="text-gray-400 font-black text-xl uppercase tracking-tighter">
              No collections found
            </p>
          </div>
        )}

        {/* --- PAGINATION --- */}
        {totalPages > 1 && (
          <div className="px-10 py-8 bg-gray-50/50 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest italic">
              Showing{" "}
              <span className="text-blue-500">
                {indexOfFirstItem + 1} -{" "}
                {Math.min(indexOfLastItem, filteredCollections.length)}
              </span>{" "}
              of <span className="text-blue-500">{collections.length}</span>{" "}
              collection
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="w-10 h-10 p-2 rounded-lg bg-white border border-gray-200 disabled:opacity-30 hover:shadow-md transition-all"
              >
                <ChevronLeft size={18} />
              </button>
              <div className="flex gap-1">
                {[...Array(totalPages)].map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => paginate(idx + 1)}
                    className={`w-10 h-10 rounded-lg font-bold text-xs transition-all ${currentPage === idx + 1 ? "bg-blue-600 text-white shadow-lg shadow-blue-200" : "bg-white border border-gray-200 text-gray-500 hover:border-blue-400"}`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="w-10 h-10 p-2 rounded-lg bg-white border border-gray-200 disabled:opacity-30 hover:shadow-md transition-all"
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
