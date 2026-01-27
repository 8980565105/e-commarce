"use client";
import React, { useEffect, useState } from "react";
import {
  X,
  Package,
  User,
  Mail,
  Phone,
  MapPin,
  Loader2,
  Calendar,
  IndianRupee,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function AdminOrderPage() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 7;

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

  const totalOrders = orders.length;
  const totalPages = Math.ceil(totalOrders / ordersPerPage);
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

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
        {" "}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-gray-900 flex items-center gap-3 uppercase italic tracking-tighter">
              <Package className="text-blue-600" size={32} /> Order Management
            </h1>
            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">
              Real-time sales tracking & management
            </p>
          </div>

          <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="text-right">
              <p className="text-[9px] font-black text-gray-400 uppercase">
                Total Volume
              </p>
              <p className="text-xl font-black text-blue-600 tracking-tighter">
                {totalOrders} Orders
              </p>
            </div>
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
              No transactions found
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
              <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-gray-50/50 border-t border-gray-300 p-5">
                <div className="text-center md:text-left">
                  <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest italic">
                    Showing{" "}
                    <span className="text-blue-600">
                      {showingFrom}-{showingTo}
                    </span>{" "}
                    of <span className="text-blue-600">{totalOrders}</span>{" "}
                    Orders
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="w-10 h-10 p-2 rounded-lg bg-white border border-gray-200 disabled:opacity-30 hover:shadow-md transition-all"
                  >
                    <ChevronLeft size={18} />
                  </button>

                  <div className="flex gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (number) => (
                        <button
                          key={number}
                          onClick={() => paginate(number)}
                          className={`w-10 h-10 rounded-lg font-bold text-xs transition-all  ${
                            currentPage === number
                              ? "bg-blue-600 text-white shadow-lg shadow-blue-200 "
                              : "bg-white border border-gray-200 text-gray-500 hover:border-blue-400"
                          }`}
                        >
                          {number}
                        </button>
                      ),
                    )}
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
            </div>

            <div className="md:hidden space-y-4">
              {currentOrders.map((order) => (
                <div
                  key={order._id}
                  onClick={() => setSelectedOrder(order)}
                  className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm"
                >
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[10px] font-black text-gray-400 uppercase">
                      {formatDate(order.createdAt)}
                    </span>
                    <span className="text-blue-600 font-black italic">
                      ₹{order.totalAmount}
                    </span>
                  </div>
                  <h3 className="font-black text-gray-900 uppercase italic text-sm line-clamp-1">
                    {order.customerInfo?.firstName}{" "}
                    {order.customerInfo?.lastName}
                  </h3>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4 bg-black/70 backdrop-blur-sm transition-all">
          <div className="bg-white w-full max-w-3xl rounded-t-[2.5rem] md:rounded-[2.5rem] shadow-2xl flex flex-col max-h-[95vh] md:max-h-[90vh] overflow-hidden animate-in slide-in-from-bottom duration-300">
            {/* Modal Header */}
            <div className="p-8 border-b flex justify-between items-center sticky top-0 bg-white z-20">
              <div>
                <h2 className="text-2xl font-black text-gray-900 uppercase italic tracking-tighter">
                  Transaction Details
                </h2>
                <p className="text-[9px] text-gray-400 font-bold tracking-[0.3em] uppercase mt-1">
                  Order Ref: {selectedOrder._id}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-12 h-12 flex items-center justify-center bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-2xl transition-all"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-8 md:p-12 overflow-y-auto space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] border-l-4 border-blue-600 pl-3">
                    Customer Info
                  </h3>
                  <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100 space-y-3">
                    <p className="text-sm font-black uppercase italic text-gray-800">
                      {selectedOrder.customerInfo?.firstName}{" "}
                      {selectedOrder.customerInfo?.lastName}
                    </p>
                    <p className="text-xs font-bold text-gray-500 flex items-center gap-2">
                      <Mail size={14} /> {selectedOrder.customerInfo?.email}
                    </p>
                    <p className="text-xs font-bold text-gray-500 flex items-center gap-2">
                      <Phone size={14} /> {selectedOrder.customerInfo?.phone}
                    </p>
                    <div className="pt-3 mt-3 border-t border-gray-200">
                      <p className="text-xs font-bold text-gray-600 italic leading-relaxed flex items-start gap-2">
                        <MapPin size={16} className="text-red-500 shrink-0" />
                        {selectedOrder.customerInfo?.address},{" "}
                        {selectedOrder.customerInfo?.city}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] border-l-4 border-blue-600 pl-3">
                    Payment Summary
                  </h3>
                  <div className="p-8 bg-blue-600 rounded-4xl shadow-xl shadow-blue-100 text-center text-white relative overflow-hidden">
                    <IndianRupee className="absolute -right-4 -bottom-4 opacity-10 w-32 h-32" />
                    <p className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-70">
                      Settled Amount
                    </p>
                    <p className="text-5xl font-black italic tracking-tighter">
                      ₹{selectedOrder.totalAmount}
                    </p>
                    <div className="mt-5 inline-flex px-4 py-1.5 bg-white/20 rounded-full text-[9px] font-black uppercase italic backdrop-blur-md">
                      Success
                    </div>
                  </div>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-4">
                <h3 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] border-l-4 border-blue-600 pl-3">
                  Ordered Items ({selectedOrder.items?.length})
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  {selectedOrder.items?.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-4 border border-gray-100 rounded-3xl bg-white hover:border-blue-200 transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={item.image}
                          className="w-16 h-16 object-cover rounded-2xl bg-gray-50"
                          alt={item.title}
                        />
                        <div>
                          <p className="text-xs font-black text-gray-900 uppercase italic line-clamp-1">
                            {item.title}
                          </p>
                          <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase">
                            Size: {item.size} • Qty: {item.quantity}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm font-black text-gray-800 italic pr-2">
                        ₹{item.price}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
