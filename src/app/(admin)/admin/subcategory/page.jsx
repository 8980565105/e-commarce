// "use client";
// import React, { useState, useEffect } from "react";

// export default function AddSubcategoryPage() {
//   const [collections, setCollections] = useState([]);
//   const [selectedCol, setSelectedCol] = useState("");
//   const [subName, setSubName] = useState("");
//   const [loading, setLoading] = useState(false);

//   // Database mathi badha Collections fetch karva mate
//   useEffect(() => {
//     const fetchCollections = async () => {
//       const res = await fetch("/api/admin/collection"); // Tamari collections fetch karvani API
//       const data = await res.json();
//       if (data.success) setCollections(data.data);
//     };
//     fetchCollections();
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!selectedCol) return alert("Please select a collection");

//     setLoading(true);
//     const response = await fetch("/api/subcategory", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         collectionId: selectedCol,
//         subcategoryName: subName,
//       }),
//     });

//     const result = await response.json();
//     if (result.success) {
//       alert("Subcategory successfully add thai gayi!");
//       setSubName("");
//     } else {
//       alert("Error: " + result.error);
//     }
//     setLoading(false);
//   };

//   return (
//     <div
//       style={{
//         maxWidth: "500px",
//         margin: "50px auto",
//         fontFamily: "sans-serif",
//       }}
//     >
//       <h2 style={{ borderBottom: "2px solid #eee", paddingBottom: "10px" }}>
//         Add Subcategory
//       </h2>

//       <form onSubmit={handleSubmit} style={{ marginTop: "20px" }}>
//         <div style={{ marginBottom: "15px" }}>
//           <label style={{ display: "block", marginBottom: "5px" }}>
//             Select Collection:
//           </label>
//           <select
//             style={{
//               width: "100%",
//               padding: "10px",
//               borderRadius: "5px",
//               border: "1px solid #ccc",
//             }}
//             value={selectedCol}
//             onChange={(e) => setSelectedCol(e.target.value)}
//             required
//           >
//             <option value="">-- Select Category --</option>
//             {collections.map((col) => (
//               <option key={col._id} value={col._id}>
//                 {col.title}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div style={{ marginBottom: "15px" }}>
//           <label style={{ display: "block", marginBottom: "5px" }}>
//             Subcategory Name:
//           </label>
//           <input
//             type="text"
//             style={{
//               width: "100%",
//               padding: "10px",
//               borderRadius: "5px",
//               border: "1px solid #ccc",
//             }}
//             value={subName}
//             onChange={(e) => setSubName(e.target.value)}
//             placeholder="Ex: T-Shirts, Mobiles, etc."
//             required
//           />
//         </div>

//         <button
//           type="submit"
//           disabled={loading}
//           style={{
//             width: "100%",
//             padding: "12px",
//             backgroundColor: loading ? "#ccc" : "#0070f3",
//             color: "white",
//             border: "none",
//             borderRadius: "5px",
//             cursor: "pointer",
//           }}
//         >
//           {loading ? "Processing..." : "Save Subcategory"}
//         </button>
//       </form>
//     </div>
//   );
// }

"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { Layers, Save, ArrowLeft, ChevronDown } from "lucide-react";

export default function AddSubcategoryPage() {
  const [collections, setCollections] = useState([]);
  const [selectedCol, setSelectedCol] = useState("");
  const [subName, setSubName] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Fetch Collections
  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const res = await fetch("/api/admin/collection");
        const data = await res.json();
        if (data.success) setCollections(data.data);
      } catch (error) {
        toast.error("Failed to load collections");
      }
    };
    fetchCollections();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCol || !subName) {
      toast.error("Please fill in all fields!");
      return;
    }

    const toastId = toast.loading("Saving subcategory...");
    setLoading(true);

    try {
      const response = await fetch("/api/admin/subcategory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          collectionId: selectedCol,
          subcategoryName: subName,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Subcategory added successfully!", { id: toastId });
        setSubName("");
        setSelectedCol("");
      } else {
        toast.error("Error: " + result.error, { id: toastId });
      }
    } catch (error) {
      toast.error("Something went wrong.", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-10 flex justify-center items-start">
      <Toaster position="top-center" reverseOrder={false} />

      <div className="w-full max-w-2xl bg-white rounded-xl shadow-xl shadow-blue-900/5 border border-gray-100 p-6 md:p-12 transition-all">
        <header className="mb-8">
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
            Add New Subcategory
          </h1>
          <p className="text-gray-500 text-sm mt-1 font-medium">
            Link a specific sub-type to your existing collections
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Collection Selector */}
          <div className="space-y-2">
            <label className="text-[11px] font-black text-gray-400 uppercase tracking-wider ml-1">
              Parent Collection
            </label>
            <div className="relative group">
              <select
                value={selectedCol}
                onChange={(e) => setSelectedCol(e.target.value)}
                className="w-full appearance-none bg-gray-50 border-2 border-gray-50 p-4 rounded-2xl focus:border-blue-500 focus:bg-white outline-none transition-all font-bold text-gray-700 cursor-pointer"
                required
              >
                <option value="">-- Select Category --</option>
                {collections.map((col) => (
                  <option key={col._id} value={col._id}>
                    {col.title}
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
                <ChevronDown size={20} />
              </div>
            </div>
          </div>

          {/* Subcategory Name Input */}
          <div className="space-y-2">
            <label className="text-[11px] font-black text-gray-400 uppercase tracking-wider ml-1">
              Subcategory Name
            </label>
            <input
              type="text"
              value={subName}
              onChange={(e) => setSubName(e.target.value)}
              placeholder="e.g. T-Shirts, Casual Shoes..."
              className="w-full bg-gray-50 border-2 border-gray-50 p-4 rounded-2xl focus:border-blue-500 focus:bg-white outline-none transition-all font-bold text-gray-700 placeholder:text-gray-300"
              required
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 group relative py-4 rounded-2xl text-white font-black text-lg shadow-xl shadow-blue-200 transition-all active:scale-95 flex items-center justify-center gap-3 ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
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
                  <Layers size={20} />
                  <span>SAVE SUBCATEGORY</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => router.back()}
              className="px-8 py-4 rounded-2xl font-bold bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700 transition-all flex items-center justify-center gap-2"
            >
              <ArrowLeft size={18} />
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}