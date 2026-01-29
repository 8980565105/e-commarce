"use client";

import { useEffect, useState } from "react";
import { Search, ChevronLeft, ChevronRight, MessageSquare } from "lucide-react";

export default function AdminContactTable() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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
      <div className="p-10 text-center text-xl animate-pulse">
        Loading data...
      </div>
    );
  if (error)
    return <div className="p-10 text-center text-red-500">Error: {error}</div>;

  return (
    <div className="bg-gray-50 min-h-screen">
      <div>
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <MessageSquare className="text-blue-600" /> Admin - Contact Messages
          </h2>

          <div className="relative w-full md:w-72">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
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

        <div className="bg-white shadow-xl rounded-xl overflow-hidden border border-gray-100">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Subject
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Message
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentItems.length > 0 ? (
                currentItems.map((contact) => (
                  <tr
                    key={contact._id}
                  >
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                      {contact.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-blue-600">
                      {contact.email}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {contact.subject}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 italic max-w-xs truncate">
                      {contact.message}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="px-6 py-10 text-center text-gray-500"
                  >
                    Koi data malya nathi.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="px-6 py-4 bg-gray-50 border-t flex items-center justify-between">
            <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest italic">
              Showing{" "}
              <span className="text-blue-500">
                {indexOfFirstItem + 1}-{" "}
                {Math.min(indexOfLastItem, filteredContacts.length)}
              </span>{" "}
              of{" "}
              <span className="text-blue-500">{filteredContacts.length}</span>{" "}
              results
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 border rounded-lg disabled:opacity-20"
              >
                <ChevronLeft size={18} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  onClick={() => setCurrentPage(n)}
                  className={`w-10 h-10 rounded-lg text-xs font-bold ${currentPage === n ? "bg-blue-600 text-white" : "bg-white border"}`}
                >
                  {n}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 border rounded-lg disabled:opacity-20"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
