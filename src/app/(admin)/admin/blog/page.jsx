"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import { ChevronLeft, ChevronRight, BookOpen, Search as SearchIcon } from "lucide-react"; // Search icon add kiya

export default function BlogListPage() {
  const [blogs, setBlogs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // Search state
  const [currentBlog, setCurrentBlog] = useState({
    title: "",
    content: "",
    author: "Admin",
  });
  const [isSaving, setIsSaving] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 8;

  const editorRef = useRef();
  const [editorLoaded, setEditorLoaded] = useState(false);

  const fetchBlogs = async () => {
    try {
      const res = await fetch("/api/blog");
      const data = await res.json();
      setBlogs(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error("ડેટા લોડ કરવામાં ભૂલ આવી!");
    }
  };

  useEffect(() => {
    fetchBlogs();
    editorRef.current = {
      CKEditor: require("@ckeditor/ckeditor5-react").CKEditor,
      ClassicEditor: require("@ckeditor/ckeditor5-build-classic"),
    };
    setEditorLoaded(true);
  }, []);

  // --- SEARCH LOGIC (Only Title) ---
  const filteredBlogs = blogs.filter((blog) =>
    blog.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- PAGINATION LOGIC (Based on Filtered Data) ---
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
      return "https://via.placeholder.com/400x250?text=No+Image";
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, "text/html");
    const img = doc.querySelector("img");
    return img ? img.src : "https://via.placeholder.com/400x250?text=No+Image";
  };

  const deleteBlog = async (id) => {
    toast((t) => (
      <div className="flex flex-col gap-3">
        <p className="font-medium">Are you sure you want to delete this blog?</p>
        <div className="flex gap-2">
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              const res = await fetch(`/api/blog/${id}`, { method: "DELETE" });
              if (res.ok) {
                toast.success("Blog Deleted Successfully!");
                fetchBlogs();
              }
            }}
            className="flex-1 bg-red-600 text-white px-4 py-2 rounded font-bold"
          >
            Delete
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="flex-1 bg-gray-200 px-4 py-2 rounded font-bold"
          >
            Cancel
          </button>
        </div>
      </div>
    ));
  };

  const openEditPopup = (blog) => {
    setCurrentBlog(blog);
    setIsModalOpen(true);
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

  return (
    <div className="min-h-screen shadow-xl shadow-gray-200/50 bg-white p-4 rounded-xl">
      <Toaster position="top-center" />

      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight text-center md:text-left uppercase italic">
            Admin Blog
          </h1>
          <p className="text-gray-500 font-medium text-center md:text-left text-[10px] uppercase tracking-widest mt-1">
            Manage your articles and news
          </p>
        </div>

        {/* --- SEARCH BAR (New) --- */}
        <div className="relative w-full md:w-96">
          <input
            type="text"
            placeholder="Search blog title..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset to page 1
            }}
            className="w-full pl-12 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500 font-bold transition-all outline-none text-sm"
          />
          <SearchIcon className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>

        <Link
          href="/admin/blog/new"
          className="bg-blue-600 hover:bg-blue-500 text-white font-black uppercase text-xs tracking-widest px-8 py-4 rounded-2xl shadow-lg shadow-blue-100 transition-all whitespace-nowrap"
        >
          + Add New Blog
        </Link>
      </div>

      {/* --- BLOG GRID --- */}
      <div className="overflow-hidden">
        <div className="p-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {currentBlogs.map((blog) => (
            <div
              key={blog._id}
              className="bg-white rounded-xl border border-gray-100 overflow-hidden group transition-all hover:shadow-2xl hover:shadow-gray-200/50"
            >
              <div className="h-44 overflow-hidden relative">
                <img
                  src={getFirstImage(blog.content)}
                  alt={blog.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>

              <div className="p-6">
                <h2 className="text-sm font-black text-gray-800 mb-4 line-clamp-2 h-10 leading-tight uppercase italic">
                  {blog.title}
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEditPopup(blog)}
                    className="flex-1 bg-gray-50 text-blue-600 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-blue-600 hover:text-white transition-all"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteBlog(blog._id)}
                    className="flex-1 bg-gray-50 text-red-600 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-red-600 hover:text-white transition-all"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* --- NO DATA STATE --- */}
        {filteredBlogs.length === 0 && (
          <div className="text-center py-20 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
            <BookOpen className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-400 font-black uppercase italic tracking-widest">
              {searchTerm ? `No results for "${searchTerm}"` : "No blogs available"}
            </p>
          </div>
        )}

        {/* --- PAGINATION --- */}
        {totalPages > 1 && (
          <div className="mt-10 py-6 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest italic">
              Showing <span className="text-blue-500">{indexOfFirstBlog + 1}-{Math.min(indexOfLastBlog, filteredBlogs.length)}</span> of <span className="text-blue-500">{filteredBlogs.length}</span> Articles
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="w-10 h-10 flex items-center justify-center rounded-lg bg-white border border-gray-200 disabled:opacity-20 transition-all"
              >
                <ChevronLeft size={18} />
              </button>
              {/* Limited page numbers for clean UI */}
              <div className="flex gap-1">
                {[...Array(totalPages)].map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => paginate(idx + 1)}
                    className={`w-10 h-10 rounded-lg font-bold text-xs transition-all ${
                      currentPage === idx + 1
                        ? "bg-blue-600 text-white shadow-lg"
                        : "bg-white border border-gray-200 text-gray-400"
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="w-10 h-10 flex items-center justify-center rounded-lg bg-white border border-gray-200 disabled:opacity-20 transition-all"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* --- EDIT MODAL (Remains Same) --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[3rem] w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="p-8 border-b flex justify-between items-center bg-gray-50/50">
              <h2 className="text-2xl font-black text-gray-900 uppercase italic tracking-tighter">Edit Article</h2>
              <button onClick={() => setIsModalOpen(false)} className="w-12 h-12 flex items-center justify-center bg-white rounded-2xl text-gray-400 hover:text-red-500 transition-all shadow-sm">
                <ChevronRight className="rotate-45" size={24} /> {/* X icon alternative */}
              </button>
            </div>
            <form onSubmit={handleUpdate} className="p-8 overflow-y-auto flex-1">
              <div className="mb-6">
                <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 tracking-[0.2em]">Title</label>
                <input
                  type="text"
                  value={currentBlog.title}
                  onChange={(e) => setCurrentBlog({ ...currentBlog, title: e.target.value })}
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold"
                  required
                />
              </div>
              <div className="mb-8">
                <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 tracking-[0.2em]">Content</label>
                <div className="rounded-2xl overflow-hidden border border-gray-100">
                  {editorLoaded && (
                    <CKEditor
                      editor={ClassicEditor}
                      data={currentBlog.content}
                      config={{ extraPlugins: [customAdapterPlugin] }}
                      onChange={(event, editor) =>
                        setCurrentBlog({ ...currentBlog, content: editor.getData() })
                      }
                    />
                  )}
                </div>
              </div>
              <div className="flex gap-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 bg-gray-100 rounded-2xl font-black uppercase text-[10px] tracking-widest">Cancel</button>
                <button type="submit" disabled={isSaving} className="flex-2 py-4 bg-black text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-blue-600 transition-all">
                  {isSaving ? "Updating..." : "Update Blog"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}