"use client";

import { useEffect, useState } from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Mail,
  User,
  BookOpen,
} from "lucide-react";

export default function AdminContactTable() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await fetch("/api/contact");
        const result = await response.json();
        if (result.success) {
          setContacts(result.data);
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError("Data fetch karva ma problem che.");
      } finally {
        setLoading(false);
      }
    };
    fetchContacts();
  }, []);

  const filteredContacts = contacts.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredContacts.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );
  const totalPages = Math.ceil(filteredContacts.length / itemsPerPage);

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl font-bold text-gray-600 animate-pulse">
            Loading data...
          </p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="p-10 text-center text-red-500 font-bold">
        Error: {error}
      </div>
    );

  return (
    <div className="bg-gray-50 min-h-screen">
      <div>
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#1A2B49] flex items-center gap-3">
              <MessageSquare className="text-blue-600" size={32} />
              Admin - Contact Messages
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Manage and respond to user inquiries
            </p>
          </div>

          <div className="relative w-full lg:w-96">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search by name or email..."
              className="w-full h-14 pl-14 pr-6 bg-gray-200 border-none rounded-2xl focus:ring-4 ring-blue-500/5 font-bold transition-all"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>

        <div className="bg-white shadow-2xl shadow-gray-200/50 rounded-xl overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="px-6 py-5 text-left text-[11px] font-black text-gray-400 uppercase tracking-[2px]">
                    Name
                  </th>
                  <th className="px-6 py-5 text-left text-[11px] font-black text-gray-400 uppercase tracking-[2px]">
                    Email
                  </th>
                  <th className="px-6 py-5 text-left text-[11px] font-black text-gray-400 uppercase tracking-[2px]">
                    Subject
                  </th>
                  <th className="px-6 py-5 text-left text-[11px] font-black text-gray-400 uppercase tracking-[2px]">
                    Message
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 bg-white">
                {currentItems.length > 0 ? (
                  currentItems.map((contact) => (
                    <tr
                      key={contact._id}
                      className="hover:bg-blue-50/30 transition-colors group"
                    >
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm">
                            {contact.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-sm font-bold text-gray-900">
                            {contact.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <span className="text-sm text-blue-600 font-medium bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                          {contact.email}
                        </span>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <span className="text-sm text-gray-700 font-semibold">
                          {contact.subject}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <p className="text-sm text-gray-500 italic max-w-xs md:max-w-sm lg:max-w-full line-clamp-1">
                          {contact.message}
                        </p>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center">
                        <Search size={40} className="text-gray-200 mb-4" />
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">
                          Koi data malya nathi.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-6 bg-white border-t border-gray-50 flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest italic text-center md:text-left">
              Showing{" "}
              <span className="text-blue-600">
                {indexOfFirstItem + 1} —{" "}
                {Math.min(indexOfLastItem, filteredContacts.length)}
              </span>{" "}
              of{" "}
              <span className="text-blue-600">{filteredContacts.length}</span>{" "}
              results
            </p>

            <div className="flex items-center gap-2 pb-2 md:pb-0 max-w-full">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 border border-gray-200 rounded-xl disabled:opacity-30 hover:bg-gray-50 transition-colors shadow-sm"
              >
                <ChevronLeft size={20} className="text-gray-600" />
              </button>

              <div className="flex items-center gap-2 px-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((n) => {
                    if (totalPages <= 5) return true;
                    return (
                      n === 1 ||
                      n === totalPages ||
                      Math.abs(n - currentPage) <= 1
                    );
                  })
                  .map((n, index, array) => (
                    <div key={n} className="flex items-center gap-2">
                      {index > 0 && array[index - 1] !== n - 1 && (
                        <span className="text-gray-300">...</span>
                      )}
                      <button
                        onClick={() => setCurrentPage(n)}
                        className={`w-10 h-10 rounded-xl text-xs font-black transition-all shadow-sm ${
                          currentPage === n
                            ? "bg-blue-600 text-white scale-110 shadow-blue-200"
                            : "bg-white border border-gray-200 text-gray-600 hover:border-blue-400"
                        }`}
                      >
                        {n}
                      </button>
                    </div>
                  ))}
              </div>

              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages || totalPages === 0}
                className="p-2 border border-gray-200 rounded-xl disabled:opacity-30 hover:bg-gray-50 transition-colors shadow-sm"
              >
                <ChevronRight size={20} className="text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
