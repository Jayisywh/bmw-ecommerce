import React, { useEffect, useState } from "react";
import {
  Search,
  ChevronDown,
  Eye,
  Filter,
  Trash2,
  RefreshCw,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import OrderDetailsModal from "./OrderDetailModel";

interface OrderData {
  id: string;
  customerName: string;
  customerEmail: string;
  totalPrice: number;
  paymentStatus: string;
  paymentMethod: string;
  orderStatus: string;
  date: string;
}

const OrdersManagement: React.FC = () => {
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/admin/orders");
      const list = res.data.data.map((o: any) => ({
        id: o._id,
        customerName: o.userId?.name || "Guest",
        customerEmail: o.userId?.email || "No Email",
        totalPrice: o.totalPrice,
        paymentStatus: o.paymentStatus,
        paymentMethod: o.paymentId?.paymentMethod || "N/A",
        orderStatus: o.orderStatus,
        date: new Date(o.createdAt).toLocaleDateString(),
      }));
      setOrders(list);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // REAL FILTERING LOGIC
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "All" || order.orderStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDelete = async (id: string) => {
    if (
      !window.confirm(
        "Permanent delete? This will remove all financial records.",
      )
    )
      return;
    try {
      await axios.delete(`http://127.0.0.1:8000/api/admin/orders/${id}`);
      setOrders((prev) => prev.filter((o) => o.id !== id));
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="p-8 bg-[#0b0e14] min-h-screen text-white">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-black mb-1 italic tracking-tighter">
            ORDER CENTER
          </h1>
          <p className="text-gray-500 text-sm">
            Process payments and track logistics for BMW units.
          </p>
        </div>
        <button
          onClick={fetchOrders}
          className="p-2 bg-gray-900 border border-gray-800 rounded-lg hover:text-blue-400"
        >
          <RefreshCw size={18} />
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
          <input
            type="text"
            placeholder="Search by ID or Customer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#161927] border border-gray-800 rounded-2xl pl-12 pr-4 py-3.5 text-sm focus:ring-2 focus:ring-blue-500 transition-all outline-none"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#161927] border border-gray-800 pl-12 pr-10 py-3.5 rounded-2xl text-sm font-bold appearance-none outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Canceled">Canceled</option>
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 w-4 h-4 pointer-events-none" />
        </div>
      </div>

      <div className="bg-[#111420] rounded-3xl border border-gray-800 overflow-hidden shadow-2xl">
        <table className="w-full text-left">
          <thead className="bg-[#161927] text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">
            <tr>
              <th className="px-8 py-5">Order ID</th>
              <th className="px-8 py-5">Client</th>
              <th className="px-8 py-5">Total</th>
              <th className="px-8 py-5">Payment</th>
              <th className="px-8 py-5">Method</th>
              <th className="px-8 py-5">Logistics</th>
              <th className="px-8 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/50">
            {filteredOrders.map((order) => (
              <tr
                key={order.id}
                className="hover:bg-blue-500/5 transition-all group"
              >
                <td className="px-8 py-5 text-xs font-mono text-gray-600">
                  {order.id.slice(-8).toUpperCase()}
                </td>
                <td className="px-8 py-5">
                  <p className="text-sm font-bold text-white">
                    {order.customerName}
                  </p>
                  <p className="text-[10px] text-gray-500 uppercase font-medium">
                    {order.customerEmail}
                  </p>
                </td>
                <td className="px-8 py-5 text-sm font-black text-blue-400">
                  ${order.totalPrice.toLocaleString()}
                </td>
                <td className="px-8 py-5">
                  <span
                    className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                      order.paymentStatus === "Paid"
                        ? "bg-emerald-500/10 text-emerald-500"
                        : "bg-amber-500/10 text-amber-500"
                    }`}
                  >
                    {order.paymentStatus}
                  </span>
                </td>
                <td className="px-8 py-5">
                  <span
                    className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                      order.paymentMethod === "COD"
                        ? "bg-purple-500/10 text-purple-400"
                        : order.paymentMethod === "PayPal"
                          ? "bg-blue-500/10 text-blue-400"
                          : "bg-gray-800/50 text-gray-300"
                    }`}
                  >
                    {order.paymentMethod}
                  </span>
                </td>
                <td className="px-8 py-5">
                  <span
                    className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                      order.orderStatus === "Delivered"
                        ? "bg-blue-500 text-white shadow-lg shadow-blue-500/20"
                        : "bg-gray-800 text-gray-400"
                    }`}
                  >
                    {order.orderStatus}
                  </span>
                </td>
                <td className="px-8 py-5 text-right space-x-2">
                  <button
                    onClick={() => {
                      setSelectedOrder(order.id);
                      setIsModalOpen(true);
                    }}
                    className="p-2.5 bg-gray-800 rounded-xl text-gray-400 hover:text-white transition-all"
                  >
                    <Eye size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(order.id)}
                    className="p-2.5 bg-red-500/10 rounded-xl text-red-500 hover:bg-red-500 hover:text-white transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredOrders.length === 0 && (
          <div className="py-20 text-center text-gray-600 font-medium">
            No orders found matching your criteria.
          </div>
        )}
      </div>

      {isModalOpen && (
        <OrderDetailsModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          orderId={selectedOrder}
          onUpdated={fetchOrders}
        />
      )}
    </div>
  );
};

export default OrdersManagement;
