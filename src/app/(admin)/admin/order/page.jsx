"use client";
import React, { useEffect, useState } from "react";
import {
  X,
  Package,
  Mail,
  Phone,
  MapPin,
  Loader2,
  IndianRupee,
  ChevronRight,
  ChevronLeft,
  Search as SearchIcon,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function AdminOrderPage() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 6;

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/user/order", { cache: "no-store" });
      const result = await res.json();
      if (result.success) {
        setOrders(result.data || []);
      } else {
        toast.error(result.error || "Data not found");
      }
    } catch (error) {
      toast.error("Server connection failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // --- SEARCH LOGIC ---
  const filteredOrders = orders.filter((o) => {
    const customer = o.customerInfo || {};
    const searchStr = searchTerm.toLowerCase();

    return (
      customer.firstName?.toLowerCase().includes(searchStr) ||
      customer.lastName?.toLowerCase().includes(searchStr) ||
      customer.email?.toLowerCase().includes(searchStr) ||
      o._id?.toLowerCase().includes(searchStr)
    );
  });

  const totalOrders = filteredOrders.length;
  const totalPages = Math.ceil(totalOrders / ordersPerPage);
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;

  const currentOrders = filteredOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder,
  );

  const showingFrom = totalOrders === 0 ? 0 : indexOfFirstOrder + 1;
  const showingTo = Math.min(indexOfLastOrder, totalOrders);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(dateString));
  };

  return (
    <div className="min-h-screen font-sans text-black bg-gray-50/50">
      <Toaster position="top-center" />

      <div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-gray-900 flex items-center gap-3 uppercase italic tracking-tighter">
              <Package className="text-blue-600" size={32} /> Order Management
            </h1>
            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">
              Real-time sales tracking & management
            </p>
          </div>

          <div className="relative w-full md:w-96">
            <input
              type="text"
              placeholder="Search by name, email or ID..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reset to page 1 on search
              }}
              className="w-full h-14 pl-14 pr-6 bg-gray-200 border-none rounded-2xl focus:ring-4 ring-blue-500/5 font-bold transition-all"
            />
            <SearchIcon className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>

          <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-2xl shadow-sm border border-gray-100">
            <span className="text-gray-500 font-bold uppercase text-xs tracking-widest">
              Total 
            </span>
            <span className="bg-blue-600 text-white px-4 py-1 rounded-full font-black text-lg">
              {totalOrders} 
            </span>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-80 text-gray-400">
            <Loader2 className="animate-spin mb-3 text-blue-600" size={40} />
            <p className="font-black uppercase tracking-widest text-[10px]">
              Fetching Database...
            </p>
          </div>
        ) : totalOrders === 0 ? (
          <div className="bg-white p-16 text-center rounded-[2.5rem] border-2 border-dashed border-gray-200">
            <Package className="mx-auto text-gray-200 mb-4" size={60} />
            <p className="text-gray-400 font-black uppercase italic tracking-widest">
              {searchTerm
                ? "No results match your search"
                : "No transactions found"}
            </p>
          </div>
        ) : (
          <>
            <div className="hidden md:block bg-white rounded-3xl shadow-xl shadow-gray-200/40 border border-gray-100 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-gray-50/50 border-b border-gray-100">
                  <tr>
                    <th className="p-6 text-[11px] font-black text-gray-400 uppercase tracking-widest">
                      Date & ID
                    </th>
                    <th className="p-6 text-[11px] font-black text-gray-400 uppercase tracking-widest">
                      Customer Detail
                    </th>
                    <th className="p-6 text-[11px] font-black text-gray-400 uppercase tracking-widest">
                      Transaction
                    </th>
                    <th className="p-6 text-[11px] font-black text-gray-400 uppercase tracking-widest text-right">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {currentOrders.map((order) => (
                    <tr
                      key={order._id}
                      className="hover:bg-blue-50/30 transition-colors group"
                    >
                      <td className="p-6">
                        <p className="text-sm font-bold text-gray-800">
                          {formatDate(order.createdAt)}
                        </p>
                        <p className="text-[9px] text-gray-400 font-mono mt-1">
                          #{order._id.slice(-10).toUpperCase()}
                        </p>
                      </td>
                      <td className="p-6">
                        <p className="text-sm font-black text-gray-900 uppercase italic">
                          {order.customerInfo?.firstName}{" "}
                          {order.customerInfo?.lastName}
                        </p>
                        <p className="text-[10px] text-gray-400 lowercase italic">
                          {order.customerInfo?.email}
                        </p>
                      </td>
                      <td className="p-6">
                        <div className="flex flex-col">
                          <span className="text-blue-600 font-black text-base italic">
                            ₹{order.totalAmount}
                          </span>
                          <span className="text-[9px] font-bold text-green-500 uppercase tracking-tighter">
                            Paid Online
                          </span>
                        </div>
                      </td>
                      <td className="p-6 text-right">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="text-[10px] font-black uppercase tracking-widest bg-black text-white px-5 py-2.5 rounded-xl hover:bg-blue-600 transition-all active:scale-95"
                        >
                          View Order
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination UI */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-gray-50/50 border-t border-gray-100 p-5">
                <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest italic">
                  Showing{" "}
                  <span className="text-blue-600">
                    {showingFrom}-{showingTo}
                  </span>{" "}
                  of <span className="text-blue-600">{totalOrders}</span>
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 border rounded-lg disabled:opacity-20"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (n) => (
                      <button
                        key={n}
                        onClick={() => paginate(n)}
                        className={`w-10 h-10 rounded-lg text-xs font-bold ${currentPage === n ? "bg-blue-600 text-white" : "bg-white border"}`}
                      >
                        {n}
                      </button>
                    ),
                  )}
                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 border rounded-lg disabled:opacity-20"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile View */}
            <div className="md:hidden space-y-4">
              {currentOrders.map((order) => (
                <div
                  key={order._id}
                  onClick={() => setSelectedOrder(order)}
                  className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-bold text-gray-400">
                      {formatDate(order.createdAt)}
                    </span>
                    <span className="text-blue-600 font-black italic">
                      ₹{order.totalAmount}
                    </span>
                  </div>
                  <h3 className="font-black text-gray-900 uppercase italic text-sm">
                    {order.customerInfo?.firstName}{" "}
                    {order.customerInfo?.lastName}
                  </h3>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Modal - Remains same as your code but with proper conditional checks */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-white w-full max-w-3xl rounded-t-[2.5rem] md:rounded-[2.5rem] shadow-2xl flex flex-col max-h-[95vh] overflow-hidden">
            <div className="p-8 border-b flex justify-between items-center bg-white">
              <h2 className="text-2xl font-black text-gray-900 uppercase italic">
                Transaction Details
              </h2>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-3 bg-gray-50 rounded-2xl hover:text-red-500"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-8 overflow-y-auto">
              {/* ... (Rest of your Modal Content) ... */}
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div className="bg-gray-50 p-6 rounded-3xl border">
                  <h3 className="text-[10px] font-black text-blue-600 uppercase mb-4">
                    Customer Info
                  </h3>
                  <p className="font-black uppercase italic">
                    {selectedOrder.customerInfo?.firstName}{" "}
                    {selectedOrder.customerInfo?.lastName}
                  </p>
                  <p className="text-xs text-gray-500">
                    {selectedOrder.customerInfo?.email}
                  </p>
                  <p className="text-xs text-gray-500">
                    {selectedOrder.customerInfo?.phone}
                  </p>
                  <p className="text-xs text-gray-600 mt-2">
                    <MapPin size={12} className="inline mr-1" />
                    {selectedOrder.customerInfo?.address}
                  </p>
                </div>
                <div className="bg-blue-600 p-6 rounded-3xl text-white">
                  <p className="text-[10px] font-bold uppercase opacity-70">
                    Total Amount
                  </p>
                  <p className="text-4xl font-black italic">
                    ₹{selectedOrder.totalAmount}
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                {selectedOrder.items?.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 border rounded-2xl"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image}
                        className="w-12 h-12 object-cover rounded-lg"
                        alt=""
                      />
                      <div>
                        <p className="text-xs font-black uppercase">
                          {item.title}
                        </p>
                        <p className="text-[10px] text-gray-400">
                          QTY: {item.quantity} | SIZE: {item.size}
                        </p>
                      </div>
                    </div>
                    <p className="font-black italic">₹{item.price}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
