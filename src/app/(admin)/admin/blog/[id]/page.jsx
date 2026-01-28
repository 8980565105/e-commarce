"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

export default function BlogFormPage({ params }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const [editorLoaded, setEditorLoaded] = useState(false);
  const [CKEditorComponent, setCKEditorComponent] = useState(null);
  const [ClassicEditor, setClassicEditor] = useState(null);

  const [blog, setBlog] = useState({ title: "", content: "", author: "Admin" });
  const [loading, setLoading] = useState(id !== "new");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const initEditor = async () => {
      const { CKEditor } = await import("@ckeditor/ckeditor5-react");
      const ClassicEditor = await import("@ckeditor/ckeditor5-build-classic");

      setCKEditorComponent(() => CKEditor);
      setClassicEditor(() => ClassicEditor.default);
      setEditorLoaded(true);
    };

    initEditor();

    if (id !== "new") {
      fetch(`/api/blog/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setBlog(data);
          setLoading(false);
        })
        .catch(() => {
          toast.error("Failed to load blog");
          setLoading(false);
        });
    }
  }, [id]);

  // --- Image Upload Adapter ---
  function uploadAdapter(loader) {
    return {
      upload: () =>
        loader.file.then(
          (file) =>
            new Promise((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = () => resolve({ default: reader.result });
              reader.onerror = (err) => reject(err);
              reader.readAsDataURL(file);
            }),
        ),
    };
  }

  function customAdapterPlugin(editor) {
    editor.plugins.get("FileRepository").createUploadAdapter = (loader) =>
      uploadAdapter(loader);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!blog.title.trim() || !blog.content.trim()) {
      toast.error("Title and Content are required!");
      return;
    }
    setIsSaving(true);
    const loadingToast = toast.loading("Saving blog...");
    try {
      const res = await fetch(id === "new" ? "/api/blog" : `/api/blog/${id}`, {
        method: id === "new" ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(blog),
      });
      if (res.ok) {
        toast.success("Blog saved successfully!", { id: loadingToast });
        router.push("/admin/blog");
      } else {
        toast.error("Save failed", { id: loadingToast });
      }
    } catch (err) {
      toast.error("Error saving blog", { id: loadingToast });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <Toaster position="top-center" />

      <style>{`
        .ck-editor__editable_inline {
          min-height: 500px;
          padding: 0 20px !important;
        }
        /* Toolbar Design */
        .ck-toolbar {
          border: 1px solid #d1d5db !important;
          background: #fdfdfd !important;
        }
      `}</style>

      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">
          {id === "new" ? "Add New Blog" : "Edit Blog"}
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="font-bold text-gray-700 block mb-2">
              Blog Title
            </label>
            <input
              type="text"
              value={blog.title}
              onChange={(e) => setBlog({ ...blog, title: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Enter blog title"
              required
            />
          </div>

          <div className="mb-6">
            <label className="font-bold text-gray-700 block mb-2">
              Content
            </label>
            <div className="rounded-lg overflow-hidden border border-gray-300">
              {editorLoaded && CKEditorComponent ? (
                <CKEditorComponent
                  editor={ClassicEditor}
                  data={blog.content}
                  config={{
                    extraPlugins: [customAdapterPlugin],
                    toolbar: [
                      "heading",
                      "|",
                      "bold",
                      "italic",
                      "underline",
                      "strikethrough",
                      "subscript",
                      "superscript",
                      "|",
                      "fontColor",
                      "fontBackgroundColor",
                      "fontSize",
                      "fontFamily",
                      "|",
                      "alignment",
                      "|",
                      "bulletedList",
                      "numberedList",
                      "|",
                      "link",
                      "uploadImage",
                      "insertTable",
                      "blockQuote",
                      "mediaEmbed",
                      "|",
                      "undo",
                      "redo",
                    ],
                  }}
                  onChange={(event, editor) => {
                    setBlog({ ...blog, content: editor.getData() });
                  }}
                />
              ) : (
                <div className="p-10 text-center text-gray-400">
                  Loading Editor...
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isSaving}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
            >
              {isSaving ? "Saving..." : "Save Blog"}
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
