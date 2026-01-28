// "use client";

// import { useEffect, useState, useRef } from "react";
// import Link from "next/link";
// import toast, { Toaster } from "react-hot-toast";
// import {
//   ChevronLeft,
//   ChevronRight,
//   CirclePlus,
//   BookOpen,
//   Search,
//   AlertCircle,
//   MoreHorizontal,
//   Eye,
//   Edit3,
//   Trash2,
// } from "lucide-react";

// export default function BlogListPage() {
//   const [blogs, setBlogs] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isDeleting, setIsDeleting] = useState(false);
//   const [deleteId, setDeleteId] = useState(null);

//   const [currentBlog, setCurrentBlog] = useState({
//     title: "",
//     content: "",
//   });
//   const [isSaving, setIsSaving] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const blogsPerPage = 8;

//   const editorRef = useRef();
//   const [editorLoaded, setEditorLoaded] = useState(false);

//   const fetchBlogs = async () => {
//     try {
//       const res = await fetch("/api/blog");
//       const data = await res.json();
//       setBlogs(Array.isArray(data) ? data : []);
//     } catch (err) {
//       toast.error("ડેટા લોડ કરવામાં ભૂલ આવી!");
//     }
//   };

//   const openEditPopup = (blog) => {
//     setCurrentBlog({
//       _id: blog._id,
//       title: blog.title,
//       content: blog.content,
//       status: blog.status ?? true, // જો સ્ટેટસ વાપરતા હોવ તો
//     });
//     setIsModalOpen(true);
//   };

//   useEffect(() => {
//     fetchBlogs();
//     editorRef.current = {
//       CKEditor: require("@ckeditor/ckeditor5-react").CKEditor,
//       ClassicEditor: require("@ckeditor/ckeditor5-build-classic"),
//     };
//     setEditorLoaded(true);
//   }, []);

//   const filteredBlogs = blogs.filter((blog) =>
//     blog.title.toLowerCase().includes(searchTerm.toLowerCase()),
//   );

//   const indexOfLastBlog = currentPage * blogsPerPage;
//   const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
//   const currentBlogs = filteredBlogs.slice(indexOfFirstBlog, indexOfLastBlog);
//   const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);

//   const getFirstImage = (htmlContent) => {
//     if (typeof window === "undefined" || !htmlContent)
//       return "https://via.placeholder.com/150";
//     const parser = new DOMParser();
//     const doc = parser.parseFromString(htmlContent, "text/html");
//     const img = doc.querySelector("img");
//     return img ? img.src : "https://via.placeholder.com/150";
//   };

//   const confirmDelete = async () => {
//     const loadingToast = toast.loading("Deleting...");
//     try {
//       const res = await fetch(`/api/blog/${deleteId}`, { method: "DELETE" });
//       if (res.ok) {
//         toast.success("Deleted!", { id: loadingToast });
//         fetchBlogs();
//         setIsDeleting(false);
//       }
//     } catch (err) {
//       toast.error("Error", { id: loadingToast });
//     }
//   };

//   const handleUpdate = async (e) => {
//     e.preventDefault();
//     setIsSaving(true);
//     const loadingToast = toast.loading("Updating...");
//     try {
//       const res = await fetch(`/api/blog/${currentBlog._id}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(currentBlog),
//       });
//       if (res.ok) {
//         toast.success("Updated!", { id: loadingToast });
//         setIsModalOpen(false);
//         fetchBlogs();
//       }
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   const { CKEditor, ClassicEditor } = editorRef.current || {};
//   function customAdapterPlugin(editor) {
//     editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
//       return {
//         upload: () =>
//           loader.file.then(
//             (file) =>
//               new Promise((resolve) => {
//                 const reader = new FileReader();
//                 reader.onload = () => resolve({ default: reader.result });
//                 reader.readAsDataURL(file);
//               }),
//           ),
//       };
//     };
//   }

//   return (
//     <div className="min-h-screen bg-[#F8FAFC]">
//       <Toaster position="top-center" />

//       {/* --- HEADER & SEARCH (Same as Image) --- */}
//       <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-6">
//         <div className="flex items-center gap-4">
//           <div className="bg-blue-600 p-3 rounded-2xl shadow-lg shadow-blue-200">
//             <BookOpen className="text-white" size={28} />
//           </div>
//           <div>
//             <h1 className="text-3xl font-black text-[#1E293B] uppercase tracking-tighter">
//               Blog Management
//             </h1>
//             <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">
//               Real-time content tracking
//             </p>
//           </div>
//         </div>

//         <div className="relative w-full md:w-96">
//           <Search
//             className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"
//             size={20}
//           />
//           <input
//             type="text"
//             placeholder="Search by title..."
//             value={searchTerm}
//             onChange={(e) => {
//               setSearchTerm(e.target.value);
//               setCurrentPage(1);
//             }}
//             className="w-full h-14 pl-14 pr-6 bg-gray-200 border-none rounded-2xl focus:ring-4 ring-blue-500/5 font-bold transition-all"
//           />
//         </div>

//         <div>
//           <Link
//             href="/admin/blog/new"
//             className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3.5 rounded-2xl shadow-lg shadow-blue-200 transition duration-200"
//           >
//             <CirclePlus size={20} /> ADD Artical
//           </Link>
//         </div>
//       </div>

//       {/* --- TABLE CONTAINER --- */}
//       <div className="bg-white rounded-xl shadow-xl shadow-gray-200/50 overflow-hidden border border-gray-100">
//         <div className="overflow-x-auto">
//           <table className="w-full text-left border-collapse">
//             <thead>
//               <tr className="border-b border-gray-50">
//                 <th className="px-8 py-6 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">
//                   Image & title
//                 </th>
//                 <th className="px-8 py-6 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">
//                   id & date
//                 </th>
//                 <th className="px-8 py-6 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">
//                   Status
//                 </th>
//                 <th className="px-8 py-6 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">
//                   Action
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-50">
//               {currentBlogs.map((blog) => (
//                 <tr key={blog._id} className="transition-colors">
//                   <td className="px-8 py-6">
//                     <div className="flex items-center gap-4">
//                       <img
//                         src={getFirstImage(blog.content)}
//                         className="w-14 h-14 rounded-2xl object-cover shadow-md border-2 border-white"
//                         alt="thumb"
//                       />
//                       <p className="text-sm font-black text-[#1E293B] line-clamp-1 max-w-75 uppercase italic">
//                         {blog.title}
//                       </p>
//                     </div>
//                   </td>
//                   <td className="px-8 py-6">
//                     <p className="text-xs font-black text-gray-400 uppercase tracking-tighter">
//                       #{blog._id.slice(-6)}
//                     </p>
//                     <p className="text-[10px] text-gray-300 font-bold">
//                       {new Date().toLocaleDateString()}
//                     </p>
//                   </td>
//                   <td className="px-8 py-6">
//                     <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-50 text-green-600 text-[10px] font-black uppercase tracking-widest">
//                       Published
//                     </span>
//                   </td>
//                   <td className="px-8 py-6 text-right">
//                     <div className="flex justify-end gap-2 transition-opacity">
//                       <button
//                         onClick={() => openEditPopup(blog)}
//                         className="p-3 bg-white border border-gray-100 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"
//                       >
//                         <Edit3 size={16} />
//                       </button>
//                       <button
//                         onClick={() => {
//                           setDeleteId(blog._id);
//                           setIsDeleting(true);
//                         }}
//                         className="p-3 bg-white border border-gray-100 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
//                       >
//                         <Trash2 size={16} />
//                       </button>
//                     </div>
//                     {/* Fallback for Mobile */}
//                     <button className="md:hidden p-2 text-gray-400">
//                       <MoreHorizontal />
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {/* --- PAGINATION (Same as Image) --- */}
//         <div className="px-8 py-6 bg-gray-50/50 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-gray-100">
//           <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest italic">
//             Showing{" "}
//             <span className="text-blue-600">
//               {indexOfFirstBlog + 1}-
//               {Math.min(indexOfLastBlog, filteredBlogs.length)}
//             </span>{" "}
//             of <span className="text-blue-500">{filteredBlogs.length}</span>{" "}
//             artical
//           </p>
//           <div className="flex items-center gap-2">
//             <button
//               onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
//               disabled={currentPage === 1}
//               className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-gray-200 disabled:opacity-30 hover:shadow-md transition-all"
//             >
//               <ChevronLeft size={18} />
//             </button>
//             <div className="bg-blue-600 text-white w-10 h-10 flex items-center justify-center rounded-xl font-black shadow-lg shadow-blue-200">
//               {currentPage}
//             </div>
//             <button
//               onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
//               disabled={currentPage === totalPages}
//               className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-gray-200 disabled:opacity-30 hover:shadow-md transition-all"
//             >
//               <ChevronRight size={18} />
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* --- DELETE MODAL --- */}
//       {isDeleting && (
//         <div className="fixed inset-0 bg-[#1E293B]/60 backdrop-blur-md flex items-center justify-center z-100 p-4">
//           <div className="bg-white rounded-[2.5rem] p-10 max-w-sm w-full shadow-2xl text-center">
//             <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
//               <AlertCircle size={40} />
//             </div>
//             <h3 className="text-2xl font-black text-[#1E293B] tracking-tighter">
//               DELETE BLOG?
//             </h3>
//             <p className="text-gray-400 mt-2 text-sm font-bold uppercase tracking-widest">
//               This cannot be undone
//             </p>
//             <div className="flex gap-4 mt-10">
//               <button
//                 onClick={() => setIsDeleting(false)}
//                 className="flex-1 py-4 bg-gray-100 rounded-2xl font-black text-gray-500 uppercase text-[10px] tracking-[0.2em]"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={confirmDelete}
//                 className="flex-1 py-4 bg-red-500 text-white rounded-2xl font-black hover:bg-red-600 uppercase text-[10px] tracking-[0.2em] shadow-lg shadow-red-200"
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* --- EDIT MODAL --- */}
//       {isModalOpen && (
//         <div className="fixed inset-0 bg-[#1E293B]/60 backdrop-blur-md flex items-center justify-center z-100 p-4">
//           <div className="bg-white rounded-[3rem] w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border-8 border-white">
//             <div className="p-8 border-b flex justify-between items-center bg-[#F8FAFC]">
//               <h2 className="text-2xl font-black text-[#1E293B] uppercase tracking-tighter italic">
//                 Edit Article
//               </h2>
//               <button
//                 onClick={() => setIsModalOpen(false)}
//                 className="w-12 h-12 flex items-center justify-center bg-white rounded-2xl text-gray-400 hover:text-red-500 transition-all shadow-sm"
//               >
//                 ✕
//               </button>
//             </div>
//             <form
//               onSubmit={handleUpdate}
//               className="p-10 overflow-y-auto flex-1 bg-white"
//             >
//               <div className="mb-8">
//                 <label className="block text-[10px] font-black uppercase text-gray-400 mb-3 tracking-[0.2em]">
//                   Title of Article
//                 </label>
//                 <input
//                   type="text"
//                   value={currentBlog.title}
//                   onChange={(e) =>
//                     setCurrentBlog({ ...currentBlog, title: e.target.value })
//                   }
//                   className="w-full px-6 py-5 bg-[#F8FAFC] border-none rounded-2xl font-black text-[#1E293B] focus:ring-4 ring-blue-500/10 transition-all"
//                 />
//               </div>
//               <div className="mb-8">
//                 <label className="block text-[10px] font-black uppercase text-gray-400 mb-3 tracking-[0.2em]">
//                   Full Content
//                 </label>
//                 <div className="rounded-3xl overflow-hidden border-4 border-[#F8FAFC]">
//                   {editorLoaded && (
//                     <CKEditor
//                       editor={ClassicEditor}
//                       data={currentBlog.content}
//                       config={{ extraPlugins: [customAdapterPlugin] }}
//                       onChange={(event, editor) =>
//                         setCurrentBlog({
//                           ...currentBlog,
//                           content: editor.getData(),
//                         })
//                       }
//                     />
//                   )}
//                 </div>
//               </div>
//               <div className="flex gap-4 pt-4">
//                 <button
//                   type="button"
//                   onClick={() => setIsModalOpen(false)}
//                   className="flex-1 py-5 bg-gray-100 rounded-2xl font-black uppercase text-xs tracking-widest text-gray-400"
//                 >
//                   Discard Changes
//                 </button>
//                 <button
//                   type="submit"
//                   disabled={isSaving}
//                   className="flex-2 px-12 py-5 bg-blue-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-[#1E293B] transition-all shadow-xl shadow-blue-200"
//                 >
//                   {isSaving ? "Updating..." : "Save & Publish"}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import {
  ChevronLeft,
  ChevronRight,
  CirclePlus,
  BookOpen,
  Search,
  AlertCircle,
  MoreHorizontal,
  Edit3,
  Trash2,
} from "lucide-react";

export default function BlogListPage() {
  const [blogs, setBlogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const [currentBlog, setCurrentBlog] = useState({
    title: "",
    content: "",
  });
  const [isSaving, setIsSaving] = useState(false);

  // --- PAGINATION STATES ---
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 5;

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

  // --- EDIT POPUP LOGIC ---
  const openEditPopup = (blog) => {
    setCurrentBlog({
      _id: blog._id,
      title: blog.title,
      content: blog.content,
    });
    setIsModalOpen(true);
  };

  // --- SEARCH & PAGINATION LOGIC ---
  const filteredBlogs = blogs.filter((blog) =>
    blog.title.toLowerCase().includes(searchTerm.toLowerCase()),
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
      return "https://via.placeholder.com/150";
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, "text/html");
    const img = doc.querySelector("img");
    return img ? img.src : "https://via.placeholder.com/150";
  };

  const confirmDelete = async () => {
    const loadingToast = toast.loading("Deleting...");
    try {
      const res = await fetch(`/api/blog/${deleteId}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Deleted!", { id: loadingToast });
        fetchBlogs();
        setIsDeleting(false);
      }
    } catch (err) {
      toast.error("Error", { id: loadingToast });
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    const loadingToast = toast.loading("Updating...");
    try {
      const res = await fetch(`/api/blog/${currentBlog._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(currentBlog),
      });
      if (res.ok) {
        toast.success("Updated!", { id: loadingToast });
        setIsModalOpen(false);
        fetchBlogs();
      }
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
    <div className="min-h-screen bg-[#F8FAFC]">
      <Toaster position="top-center" />

      {/* --- HEADER & SEARCH --- */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-6">
        <div className="flex items-center gap-4">
          <div className="bg-blue-600 p-3 rounded-2xl shadow-lg shadow-blue-200">
            <BookOpen className="text-white" size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-[#1E293B] uppercase tracking-tighter">
              Blog Management
            </h1>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">
              Real-time content tracking
            </p>
          </div>
        </div>

        <div className="relative w-full md:w-96">
          <Search
            className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search by title..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full h-14 pl-14 pr-6 bg-gray-200 border-none rounded-2xl focus:ring-4 ring-blue-500/5 font-bold transition-all"
          />
        </div>

        <div>
          <Link
            href="/admin/blog/new"
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3.5 rounded-2xl shadow-lg shadow-blue-200 transition duration-200"
          >
            <CirclePlus size={20} /> ADD ARTICLE
          </Link>
        </div>
      </div>

      {/* --- TABLE CONTAINER --- */}
      <div className="bg-white rounded-xl shadow-xl shadow-gray-200/50 overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-50">
                <th className="px-8 py-6 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">
                  Image & title
                </th>
                <th className="px-8 py-6 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">
                  id & date
                </th>
                <th className="px-8 py-6 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">
                  Status
                </th>
                <th className="px-8 py-6 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {currentBlogs.map((blog) => (
                <tr
                  key={blog._id}
                  className="transition-colors hover:bg-gray-50/50"
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <img
                        src={getFirstImage(blog.content)}
                        className="w-14 h-14 rounded-2xl object-cover shadow-md border-2 border-white"
                        alt="thumb"
                      />
                      <p className="text-sm font-black text-[#1E293B] line-clamp-1 max-w-75 uppercase italic">
                        {blog.title}
                      </p>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-xs font-black text-gray-400 uppercase tracking-tighter">
                      #{blog._id.slice(-6)}
                    </p>
                    <p className="text-[10px] text-gray-300 font-bold">
                      {new Date(
                        blog.createdAt || Date.now(),
                      ).toLocaleDateString()}
                    </p>
                  </td>
                  <td className="px-8 py-6">
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-50 text-green-600 text-[10px] font-black uppercase tracking-widest">
                      Published
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => openEditPopup(blog)}
                        className="p-3 bg-white border border-gray-100 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        onClick={() => {
                          setDeleteId(blog._id);
                          setIsDeleting(true);
                        }}
                        className="p-3 bg-white border border-gray-100 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
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

        {/* --- PAGINATION --- */}
        <div className="px-8 py-6 bg-gray-50/50 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-gray-100">
          <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest italic">
            Showing{" "}
            <span className="text-blue-600">
              {filteredBlogs.length === 0 ? 0 : indexOfFirstBlog + 1}-
              {Math.min(indexOfLastBlog, filteredBlogs.length)}
            </span>{" "}
            of <span className="text-blue-500">{filteredBlogs.length}</span>{" "}
            articles
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-gray-200 disabled:opacity-30 hover:shadow-md transition-all"
            >
              <ChevronLeft size={18} />
            </button>

            <div className="flex gap-1">
              {[...Array(totalPages)].map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => paginate(idx + 1)}
                  className={`w-10 h-10 rounded-xl font-black text-xs transition-all shadow-sm ${
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
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-gray-200 disabled:opacity-30 hover:shadow-md transition-all"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* --- DELETE MODAL --- */}
      {isDeleting && (
        <div className="fixed inset-0 bg-[#1E293B]/60 backdrop-blur-md flex items-center justify-center z-110 p-4">
          <div className="bg-white rounded-[2.5rem] p-10 max-w-sm w-full shadow-2xl text-center">
            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <AlertCircle size={40} />
            </div>
            <h3 className="text-2xl font-black text-[#1E293B] tracking-tighter uppercase">
              Delete Blog?
            </h3>
            <p className="text-gray-400 mt-2 text-sm font-bold uppercase tracking-widest">
              This action is permanent
            </p>
            <div className="flex gap-4 mt-10">
              <button
                onClick={() => setIsDeleting(false)}
                className="flex-1 py-4 bg-gray-100 rounded-2xl font-black text-gray-500 uppercase text-[10px] tracking-[0.2em]"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-4 bg-red-500 text-white rounded-2xl font-black hover:bg-red-600 uppercase text-[10px] tracking-[0.2em] shadow-lg shadow-red-200"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- EDIT MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#1E293B]/60 backdrop-blur-md flex items-center justify-center z-100 p-4">
          <div className="bg-white rounded-[3rem] w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border-8 border-white">
            <div className="p-8 border-b flex justify-between items-center bg-[#F8FAFC]">
              <h2 className="text-2xl font-black text-[#1E293B] uppercase tracking-tighter italic">
                Edit Article
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-12 h-12 flex items-center justify-center bg-white rounded-2xl text-gray-400 hover:text-red-500 transition-all shadow-sm"
              >
                ✕
              </button>
            </div>
            <form
              onSubmit={handleUpdate}
              className="p-10 overflow-y-auto flex-1 bg-white"
            >
              <div className="mb-8">
                <label className="block text-[10px] font-black uppercase text-gray-400 mb-3 tracking-[0.2em]">
                  Title of Article
                </label>
                <input
                  type="text"
                  value={currentBlog.title}
                  onChange={(e) =>
                    setCurrentBlog({ ...currentBlog, title: e.target.value })
                  }
                  className="w-full px-6 py-5 bg-[#F8FAFC] border-none rounded-2xl font-black text-[#1E293B] focus:ring-4 ring-blue-500/10 transition-all"
                />
              </div>
              <div className="mb-8">
                <label className="block text-[10px] font-black uppercase text-gray-400 mb-3 tracking-[0.2em]">
                  Full Content
                </label>
                <div className="rounded-3xl overflow-hidden border-4 border-[#F8FAFC]">
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
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-5 bg-gray-100 rounded-2xl font-black uppercase text-xs tracking-widest text-gray-400"
                >
                  Discard Changes
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-2 px-12 py-5 bg-blue-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-[#1E293B] transition-all shadow-xl shadow-blue-200"
                >
                  {isSaving ? "Updating..." : "Save & Publish"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
