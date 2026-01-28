"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Search as SearchIcon,
  Edit2,
  X,
  CirclePlus,
  Trash2,
  Calendar,
  AlertCircle,
} from "lucide-react";

export default function BlogListPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 5;

  // Modals State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const [currentBlog, setCurrentBlog] = useState({
    title: "",
    content: "",
    author: "Admin",
  });
  const [isSaving, setIsSaving] = useState(false);

  const editorRef = useRef();
  const [editorLoaded, setEditorLoaded] = useState(false);

  // --- API Fetching ---
  const fetchBlogs = useCallback(async () => {
    try {
      const res = await fetch("/api/blog");
      const data = await res.json();
      setBlogs(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error("Failed to load blogs");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBlogs();
    // Dynamic import for CKEditor
    editorRef.current = {
      CKEditor: require("@ckeditor/ckeditor5-react").CKEditor,
      ClassicEditor: require("@ckeditor/ckeditor5-build-classic"),
    };
    setEditorLoaded(true);
  }, [fetchBlogs]);

  // --- Search & Pagination ---
  const filteredBlogs = blogs.filter((blog) =>
    blog.title?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = filteredBlogs.slice(indexOfFirstBlog, indexOfLastBlog);
  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getFirstImage = (htmlContent) => {
    if (typeof window === "undefined" || !htmlContent)
      return "https://via.placeholder.com/50x50?text=NA";
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, "text/html");
    const img = doc.querySelector("img");
    return img ? img.src : "https://via.placeholder.com/50x50?text=NA";
  };

  // --- Delete Handler ---
  const handleDelete = async () => {
    if (!deleteId) return;
    const toastId = toast.loading("Deleting article...");
    setIsDeleting(false);

    try {
      const res = await fetch(`/api/blog/${deleteId}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Blog deleted successfully!", { id: toastId });
        setBlogs((prev) => prev.filter((b) => b._id !== deleteId));
      } else {
        toast.error("Failed to delete", { id: toastId });
      }
    } catch (err) {
      toast.error("Connection error", { id: toastId });
    } finally {
      setDeleteId(null);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    const loadingToast = toast.loading("Updating blog...");
    try {
      const res = await fetch(`/api/blog/${currentBlog._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(currentBlog),
      });
      if (res.ok) {
        toast.success("Blog Updated Successfully!", { id: loadingToast });
        setIsModalOpen(false);
        fetchBlogs();
      }
    } catch (err) {
      toast.error("Error updating blog", { id: loadingToast });
    } finally {
      setIsSaving(false);
    }
  };

  const { CKEditor, ClassicEditor } = editorRef.current || {};
  function customAdapterPlugin(editor) {
    editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
      return {
        upload: () =>
          loader.file.then(
            (file) =>
              new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = () => resolve({ default: reader.result });
                reader.readAsDataURL(file);
              }),
          ),
      };
    };
  }

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-black">
      <Toaster position="top-center" />

      {/* --- DELETE CONFIRMATION MODAL (Center) --- */}
      {isDeleting && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-100 p-4">
          <div className="bg-white rounded-4xl p-8 max-w-sm w-full animate-in zoom-in-95 duration-200 shadow-2xl">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <AlertCircle size={32} />
            </div>
            <h3 className="text-xl font-black text-center text-gray-900 tracking-tight">
              Delete Article?
            </h3>
            <p className="text-gray-500 text-center mt-2 text-sm font-medium">
              This action cannot be undone. The blog will be permanently
              removed.
            </p>
            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setIsDeleting(false)}
                className="flex-1 py-4 bg-gray-100 rounded-2xl font-black text-gray-500 hover:bg-gray-200 transition-all uppercase text-[10px] tracking-widest"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-4 bg-red-500 text-white rounded-2xl font-black shadow-lg shadow-red-100 hover:bg-red-600 transition-all uppercase text-[10px] tracking-widest"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tighter uppercase italic">
            Article Manager
          </h1>
          <p className="text-gray-400 font-bold text-[9px] uppercase tracking-[0.3em] mt-1">
            Control your content and publishing
          </p>
        </div>

        <div className="relative w-full md:w-96">
          <input
            type="text"
            placeholder="Search blogs..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full h-14 pl-14 pr-6 bg-gray-200 border-none rounded-2xl focus:ring-4 ring-blue-500/5 font-bold transition-all"
          />
          <SearchIcon className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
        </div>

        <Link
          href="/admin/blog/new"
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3.5 rounded-2xl shadow-lg shadow-blue-200 transition duration-200"
        >
          <CirclePlus size={20} /> ADD Blog
        </Link>
      </div>

      {/* --- TABLE AREA --- */}
      <div className="bg-white rounded-xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-400 text-[10px] uppercase font-black tracking-[2px] border-b border-gray-100">
              <tr>
                <th className="px-8 py-6">Visual</th>
                <th className="px-6 py-6">Blog Details</th>
                <th className="px-6 py-6">Created On</th>
                <th className="px-8 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {currentBlogs.map((blog) => (
                <tr
                  key={blog._id}
                  className="hover:bg-blue-50/10 transition-all group"
                >
                  <td className="px-8 py-5">
                    <img
                      src={getFirstImage(blog.content)}
                      className="h-16 w-16 object-cover rounded-2xl ring-4 ring-gray-50"
                      alt=""
                    />
                  </td>
                  <td className="px-6 py-5">
                    <p className="font-black text-gray-800 line-clamp-1 uppercase text-xs italic tracking-tight mb-1">
                      {blog.title}
                    </p>
                    <span className="text-[9px] font-black bg-blue-50 text-blue-600 px-2 py-0.5 rounded uppercase">
                      By {blog.author || "Admin"}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-gray-400 font-bold text-xs uppercase italic">
                      <Calendar size={14} className="text-gray-300" />
                      {new Date(blog.createdAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => {
                          setCurrentBlog(blog);
                          setIsModalOpen(true);
                        }}
                        className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => {
                          setDeleteId(blog._id);
                          setIsDeleting(true);
                        }}
                        className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-600 hover:text-white transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredBlogs.length === 0 && (
          <div className="py-24 text-center">
            <BookOpen className="w-14 h-14 text-gray-100 mx-auto mb-4" />
            <p className="text-gray-400 font-black uppercase text-[10px] tracking-widest">
              No Articles Found
            </p>
          </div>
        )}

        {/* --- PAGINATION --- */}
        {totalPages > 1 && (
          <div className="px-10 py-8 bg-gray-50/50 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Showing{" "}
              <span className="text-black">
                {indexOfFirstBlog + 1} -{" "}
                {Math.min(indexOfLastBlog, filteredBlogs.length)}
              </span>{" "}
              of {filteredBlogs.length}
            </p>
            <div className="flex gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => paginate(currentPage - 1)}
                className="w-10 h-10 flex items-center justify-center bg-white border border-gray-200 rounded-xl disabled:opacity-30"
              >
                <ChevronLeft size={18} />
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => paginate(i + 1)}
                  className={`w-10 h-10 rounded-xl font-black text-xs transition-all ${currentPage === i + 1 ? "bg-black text-white shadow-lg" : "bg-white border border-gray-200 text-gray-400"}`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                disabled={currentPage === totalPages}
                onClick={() => paginate(currentPage + 1)}
                className="w-10 h-10 flex items-center justify-center bg-white border border-gray-200 rounded-xl disabled:opacity-30"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* --- EDIT MODAL (Full Screen Overlay) --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-100 p-4">
          <div className="bg-white rounded-xl w-full max-w-5xl max-h-[95vh] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-8 border-b flex justify-between items-center bg-gray-50/50">
              <div>
                <h2 className="text-2xl font-black text-gray-900 uppercase italic tracking-tighter">
                  Update Content
                </h2>
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                  Editing: {currentBlog.title}
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-gray-400 hover:text-red-500 shadow-sm transition-all"
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={handleUpdate}
              className="p-8 overflow-y-auto flex-1"
            >
              <div className="mb-8">
                <label className="block text-[10px] font-black uppercase text-gray-400 mb-3 tracking-widest">
                  Headline
                </label>
                <input
                  type="text"
                  value={currentBlog.title}
                  onChange={(e) =>
                    setCurrentBlog({ ...currentBlog, title: e.target.value })
                  }
                  className="w-full px-6 py-5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-500/5 focus:bg-white outline-none font-bold text-lg transition-all"
                  required
                />
              </div>
              <div className="mb-10">
                <label className="block text-[10px] font-black uppercase text-gray-400 mb-3 tracking-widest">
                  Article Body
                </label>
                <div className="rounded-2xl overflow-hidden border border-gray-100 min-h-100">
                  {editorLoaded && CKEditor && (
                    <CKEditor
                      editor={ClassicEditor}
                      data={currentBlog.content}
                      config={{ extraPlugins: [customAdapterPlugin] }}
                      onChange={(event, editor) =>
                        setCurrentBlog({
                          ...currentBlog,
                          content: editor.getData(),
                        })
                      }
                    />
                  )}
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-5 bg-gray-100 rounded-2xl font-black uppercase text-[10px] tracking-widest"
                >
                  Discard
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-2 py-5 bg-black text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-blue-100"
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
