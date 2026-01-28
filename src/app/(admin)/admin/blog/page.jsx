"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import { ChevronLeft, ChevronRight, BookOpen } from "lucide-react";

export default function BlogListPage() {
  const [blogs, setBlogs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = blogs.slice(indexOfFirstBlog, indexOfLastBlog);
  const totalPages = Math.ceil(blogs.length / blogsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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
        <p className="font-medium">
          Are you sure you want to delete this blog?
        </p>
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
    <div className="min-h-screen shadow-xl shadow-gray-200/50 bg-white p-4 rounded-3xl">
      <Toaster position="top-center" />

      {/* --- HEADER --- */}
      <div className="max-w-400 mx-auto flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight text-center md:text-left">
            Admin Blog Dashboard
          </h1>
          <p className="text-gray-500 font-medium text-center md:text-left">
            Manage your articles and news
          </p>
        </div>
        <Link
          href="/admin/blog/new"
          className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-4 rounded-2xl shadow-lg shadow-blue-100 transition-all"
        >
          + Add New Blog
        </Link>
      </div>

      {/* --- MAIN WRAPPER BOX WITH SHADOW --- */}
      <div className="max-w-400 mx-auto   overflow-hidden">
        {/* --- BLOG GRID (4 Columns) --- */}
        <div className="p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {currentBlogs.map((blog) => (
            <div
              key={blog._id}
              className="bg-gray-50/50 rounded-2xl border border-gray-100 overflow-hidden group transition-all"
            >
              <div className="h-44 overflow-hidden relative">
                <img
                  src={getFirstImage(blog.content)}
                  alt={blog.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="p-5">
                <h2 className="text-lg font-bold text-gray-800 mb-4 line-clamp-2 h-12 leading-tight">
                  {blog.title}
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEditPopup(blog)}
                    className="flex-1 bg-white border border-gray-200 text-blue-600 py-2.5 rounded-xl font-bold hover:bg-blue-600 hover:text-white transition-all text-xs"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteBlog(blog._id)}
                    className="flex-1 bg-white border border-gray-200 text-red-600 py-2.5 rounded-xl font-bold hover:bg-red-600 hover:text-white transition-all text-xs"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* --- NO DATA STATE --- */}
        {blogs.length === 0 && (
          <div className="text-center py-20">
            <BookOpen className="w-12 h-12 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 font-black text-lg">No blogs found.</p>
          </div>
        )}

        {/* --- PAGINATION (Inside the Main Box) --- */}
        {totalPages > 1 && (
          <div className="px-8 py-6  border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest italic">
              Showing {""}
              <span className="text-blue-500">
                {indexOfFirstBlog + 1}-{Math.min(indexOfLastBlog, blogs.length)}
              </span>{" "}
              of
              <span className="text-blue-500"> {blogs.length} </span>Articles
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

      {/* --- EDIT MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-4xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-gray-100">
            <div className="p-6 border-b flex justify-between items-center bg-gray-50">
              <h2 className="text-xl font-black text-gray-800 uppercase tracking-tight">
                Edit Blog
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-3xl text-gray-400 hover:text-red-500 transition-colors"
              >
                &times;
              </button>
            </div>

            <form
              onSubmit={handleUpdate}
              className="p-8 overflow-y-auto flex-1"
            >
              <div className="mb-6">
                <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 tracking-widest">
                  Article Title
                </label>
                <input
                  type="text"
                  value={currentBlog.title}
                  onChange={(e) =>
                    setCurrentBlog({ ...currentBlog, title: e.target.value })
                  }
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                  required
                />
              </div>

              <div className="mb-8">
                <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 tracking-widest">
                  Content
                </label>
                <div className="rounded-2xl overflow-hidden border border-gray-200">
                  {editorLoaded && (
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

              <div className="flex gap-4 sticky bottom-0 bg-white pt-4 border-t mt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-4 bg-gray-100 rounded-2xl font-black uppercase text-xs tracking-widest"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-2 py-4 px-10 bg-black text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-blue-600 transition-all disabled:bg-gray-400"
                >
                  {isSaving ? "Saving..." : "Update Article"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}