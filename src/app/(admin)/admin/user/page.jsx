"use client";
import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { ChevronLeft, ChevronRight, Search, UserX } from "lucide-react";

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // --- Pagination States ---
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 7;

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/auth/register");
      const result = await res.json();

      if (result.success) {
        setUsers(result.data);
      } else {
        toast.error("Failed to load users");
      }
    } catch (error) {
      toast.error("Error connecting to server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter Logic
  const filteredUsers = users.filter(
    (u) =>
      u.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.role?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // --- Pagination Calculation ---
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  // પેજ બદલવાનું ફંક્શન
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // જ્યારે સર્ચ કરો ત્યારે પાછા પેલા પેજ પર આવી જવું
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  if (loading)
    return (
      <div className="h-96 w-full flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 font-bold text-gray-500 animate-pulse">
          Loading Users...
        </p>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Toaster position="top-center" />

      {/* --- HEADER SECTION --- */}
      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-gray-900 tracking-tight">
            Fesona Users
          </h2>
          <p className="text-gray-500 font-medium mt-1">
            Manage and view all registered accounts
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-96">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-14 pl-14 pr-6 bg-gray-200 border-none rounded-2xl focus:ring-4 ring-blue-500/5 font-bold transition-all"
          />
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>

        {/* User Count Badge */}
        <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-2xl shadow-sm border border-gray-100">
          <span className="text-gray-500 font-bold uppercase text-xs tracking-widest">
            Total
          </span>
          <span className="bg-blue-600 text-white px-4 py-1 rounded-full font-black text-lg">
            {filteredUsers.length}
          </span>
        </div>
      </div>

      {/* --- TABLE SECTION --- */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 text-gray-400 text-[12px] border-b border-gray-100 uppercase font-black tracking-widest">
                <th className="px-8 py-5">User Info</th>
                <th className="px-8 py-5">Email Address</th>
                <th className="px-8 py-5">Phone</th>
                <th className="px-8 py-5">Role</th>
                <th className="px-8 py-5 text-right">Joined Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {currentUsers.map((user) => (
                <tr
                  key={user._id}
                  className="hover:bg-blue-50/30 transition-colors group"
                >
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-black text-sm">
                        {user.firstName ? user.firstName[0].toUpperCase() : "?"}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 capitalize">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase">
                          ID: {user._id.slice(-6)}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5 font-bold text-blue-600/80">
                    {user.email}
                  </td>
                  <td className="px-8 py-5 font-bold text-gray-700">
                    {user.phone || "—"}
                  </td>
                  <td className="px-8 py-5">
                    <span
                      className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${
                        user.role === "admin"
                          ? "bg-purple-50 text-purple-600 border-purple-100"
                          : "bg-blue-50 text-blue-600 border-blue-100"
                      }`}
                    >
                      {user.role || "User"}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right text-xs font-bold text-gray-400 uppercase">
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString("en-GB")
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredUsers.length === 0 && (
            <div className="text-center py-20 bg-white">
              <UserX className="w-12 h-12 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-400 font-black text-lg">No Users Found</p>
            </div>
          )}
        </div>

        {/* --- PAGINATION CONTROLS --- */}
        {totalPages > 1 && (
          <div className="px-8 py-5 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest italic">
              Showing {""}
              <span className="text-blue-600">
                {indexOfFirstUser + 1}-{" "}
                {Math.min(indexOfLastUser, filteredUsers.length)}
              </span>{" "}
              of <span className="text-blue-600">{filteredUsers.length}</span> Users
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="w-10 h-10 p-2 rounded-xl border border-gray-200 bg-white disabled:opacity-30 hover:bg-gray-50 transition-all shadow-sm"
              >
                <ChevronLeft size={18} className="text-gray-600" />
              </button>

              {/* Page Numbers */}
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
                className="w-10 h-10 p-2 rounded-xl border border-gray-200 bg-white disabled:opacity-30 hover:bg-gray-50 transition-all shadow-sm"
              >
                <ChevronRight size={18} className="text-gray-600" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
