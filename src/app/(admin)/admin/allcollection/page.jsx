"use client";
import React, { useEffect, useState } from "react";
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
} from "lucide-react";

export default function CollectionList() {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- Pagination States ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Modals States
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editData, setEditData] = useState({ id: "", title: "", image: null });
  const [deleteId, setDeleteId] = useState(null);

  const fetchCollections = async () => {
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
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  // --- Pagination Calculation ---
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCollections = collections.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );
  const totalPages = Math.ceil(collections.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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
        fetchCollections();
      } else {
        toast.error(result.error || "Delete failed", { id: toastId });
      }
    } catch (error) {
      toast.error("Something went wrong", { id: toastId });
    } finally {
      setDeleteId(null);
    }
  };

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
      <div className="h-screen w-full flex flex-col items-center justify-center bg-white">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500 font-medium">Loading...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Toaster position="top-center" />

      {/* Delete Modal */}
      {isDeleting && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-9999 p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-sm w-full animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle size={32} />
            </div>
            <h3 className="text-xl font-bold text-center text-gray-800">
              Are you sure?
            </h3>
            <p className="text-gray-500 text-center mt-2 text-sm">
              Action cannot be undone.
            </p>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setIsDeleting(false)}
                className="flex-1 py-3 bg-gray-100 rounded-xl font-bold text-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-3 bg-red-500 text-white rounded-xl font-bold"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-9999 p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-md animate-in zoom-in-95 duration-200 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Edit Collection</h3>
              <X
                className="cursor-pointer text-gray-400 hover:text-red-500"
                onClick={() => setIsEditing(false)}
              />
            </div>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <input
                type="text"
                className="w-full bg-gray-50 border p-4 rounded-xl outline-none focus:ring-2 ring-blue-500/20"
                value={editData.title}
                onChange={(e) =>
                  setEditData({ ...editData, title: e.target.value })
                }
                required
              />
              <input
                type="file"
                className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-50 file:text-blue-700 font-medium"
                onChange={(e) =>
                  setEditData({ ...editData, image: e.target.files[0] })
                }
              />
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-all"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 bg-gray-100 py-3 rounded-xl font-bold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-4xl font-black text-gray-900 tracking-tight">
            Collections
          </h2>
          <p className="text-gray-500 font-medium">
            Manage store categories and visuals
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center bg-white px-5 py-3 rounded-2xl border border-gray-100 shadow-sm">
            <LayoutGrid size={20} className="text-blue-600 mr-2" />
            <span className="font-black text-gray-700">
              {collections.length} Total
            </span>
          </div>
          <Link
            href="/admin/collection"
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3.5 rounded-2xl shadow-lg shadow-blue-200 transition duration-200"
          >
            <CirclePlus size={22} /> Add Collection
          </Link>
        </div>
      </div>

      {/* Main List Box with Shadow */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden">
        {/* Desktop View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 border-b border-gray-100">
              <tr className="text-gray-400 text-[10px] uppercase font-black tracking-widest">
                <th className="px-8 py-6">Visual</th>
                <th className="px-8 py-6">Category</th>
                <th className="px-8 py-6">Date Created</th>
                <th className="px-8 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {currentCollections.map((item) => (
                <tr
                  key={item._id}
                  className="hover:bg-blue-50/10 transition-colors group"
                >
                  <td className="px-8 py-5">
                    <img
                      src={item.image}
                      className="h-16 w-16 object-cover rounded-xl ring-4 ring-gray-50 group-hover:ring-blue-50 transition-all"
                      alt={item.title}
                    />
                  </td>
                  <td className="px-8 py-5">
                    <p className="font-bold text-gray-800 text-lg">
                      {item.title}
                    </p>
                  </td>
                  <td className="px-8 py-5 text-gray-400 font-bold text-sm">
                    {new Date(item.createdAt).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => {
                          setEditData({ id: item._id, title: item.title });
                          setIsEditing(true);
                        }}
                        className="p-3 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-xl transition-all"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => {
                          setDeleteId(item._id);
                          setIsDeleting(true);
                        }}
                        className="p-3 bg-red-50 text-red-500 hover:bg-red-600 hover:text-white rounded-xl transition-all"
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

        {/* Mobile View */}
        <div className="md:hidden divide-y divide-gray-100">
          {currentCollections.map((item) => (
            <div key={item._id} className="p-6 flex flex-col gap-5">
              <div className="flex items-center gap-4">
                <img
                  src={item.image}
                  className="h-20 w-20 object-cover rounded-2xl shadow-sm"
                  alt={item.title}
                />
                <div className="flex-1">
                  <h4 className="font-black text-gray-800 text-xl">
                    {item.title}
                  </h4>
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-400 mt-1 uppercase tracking-wider">
                    <Calendar size={14} />
                    {new Date(item.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setEditData({ id: item._id, title: item.title });
                    setIsEditing(true);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-blue-50 text-blue-600 rounded-2xl font-black text-xs uppercase tracking-widest"
                >
                  <Edit2 size={16} /> Edit
                </button>
                <button
                  onClick={() => {
                    setDeleteId(item._id);
                    setIsDeleting(true);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-red-50 text-red-500 rounded-2xl font-black text-xs uppercase tracking-widest"
                >
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {collections.length === 0 && (
          <div className="text-center py-24 bg-white">
            <LayoutGrid size={48} className="mx-auto text-gray-100 mb-4" />
            <p className="text-gray-400 font-black text-xl">
              No Collections Found
            </p>
          </div>
        )}

        {/* --- PAGINATION CONTROLS --- */}
        {totalPages > 1 && (
          <div className="px-8 py-6 bg-gray-50/50 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest italic">
              Showing {""}
              <span className="text-blue-500">
                {indexOfFirstItem + 1}-
                {Math.min(indexOfLastItem, collections.length)}{" "}
              </span>
              of <span className="text-blue-500">{collections.length}</span>{" "}
              Categories
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
                    className={`w-10 h-10 rounded-lg font-bold text-xs transition-all ${
                      currentPage === idx + 1
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                        : "bg-white border border-gray-200 text-gray-500 hover:border-blue-400"
                    }`}
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
