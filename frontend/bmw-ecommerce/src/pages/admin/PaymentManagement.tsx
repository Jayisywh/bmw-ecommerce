import React, { useEffect, useState, useMemo } from "react";
import {
  Search,
  Download,
  ExternalLink,
  DollarSign,
  CheckCircle,
  Clock,
  Trash2,
  RefreshCcw,
  X,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

// --- TYPES ---
interface PaymentData {
  id: string;
  transactionId: string;
  customerName: string;
  customerEmail: string;
  orderId: string;
  amount: number;
  method: string;
  status: "Success" | "Pending" | "Failed";
  date: string;
}

const PaymentsManagement: React.FC = () => {
  const [payments, setPayments] = useState<PaymentData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [methodFilter, setMethodFilter] = useState("All");
  const [loading, setLoading] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<PaymentData | null>(
    null,
  );

  // --- API: Fetch All Payments ---
  const fetchPayments = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://127.0.0.1:8000/api/admin/payments");
      const list = res.data.data.map((p: any) => ({
        id: p._id,
        transactionId: p.transactionId || p._id.slice(-10).toUpperCase(),
        customerName: p.userId?.name || "Anonymous",
        customerEmail: p.userId?.email || "No Email",
        orderId: p.orderId?._id || "N/A",
        amount: p.amount || 0,
        method: p.paymentMethod || "Card",
        status: p.status || "Pending",
        date: new Date(p.createdAt).toLocaleString(),
      }));
      setPayments(list);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  // --- API: Update Status (The "Real World" Admin Action) ---
  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      setLoading(true);
      await axios.put(`http://127.0.0.1:8000/api/admin/payments/${id}`, {
        status: newStatus,
      });
      // Refresh local UI
      setPayments((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: newStatus as any } : p)),
      );
      setSelectedPayment(null);
    } catch (err) {
      toast.error("Failed to update status. Check backend console.");
    } finally {
      setLoading(false);
    }
  };

  // --- API: Delete ---
  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this financial record?")) return;
    try {
      await axios.delete(`http://127.0.0.1:8000/api/admin/payments/${id}`);
      setPayments((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  // --- UI LOGIC: CSV Export ---
  const exportToCSV = () => {
    const headers = ["Transaction ID,Customer,Amount,Method,Status,Date\n"];
    const rows = payments.map(
      (p) =>
        `${p.transactionId},${p.customerName},${p.amount},${p.method},${p.status},${p.date}\n`,
    );
    const blob = new Blob([...headers, ...rows], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `BMW_Revenue_${new Date().toLocaleDateString()}.csv`;
    a.click();
  };

  // --- UI LOGIC: Stats & Filters ---
  const stats = useMemo(
    () => ({
      total: payments.reduce((acc, c) => acc + c.amount, 0),
      success: payments
        .filter((p) => p.status === "Success")
        .reduce((acc, c) => acc + c.amount, 0),
      pending: payments
        .filter((p) => p.status === "Pending")
        .reduce((acc, c) => acc + c.amount, 0),
    }),
    [payments],
  );

  const filtered = payments.filter((p) => {
    const matchSearch =
      p.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.transactionId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchMethod = methodFilter === "All" || p.method === methodFilter;
    return matchSearch && matchMethod;
  });

  return (
    <div className="p-8 bg-[#0b0e14] min-h-screen text-white font-sans">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-black italic tracking-tighter text-white uppercase">
            Revenue Control
          </h1>
          <p className="text-gray-500 text-sm mt-1 font-medium italic">
            SECURE BMW TRANSACTION GATEWAY
          </p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={fetchPayments}
            className="p-3 bg-[#161927] border border-gray-800 rounded-2xl hover:text-blue-400 transition-all"
          >
            <RefreshCcw size={20} className={loading ? "animate-spin" : ""} />
          </button>
          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-2xl text-sm font-black hover:bg-gray-200 transition-all"
          >
            <Download size={18} /> EXPORT DATA
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <StatCard
          title="Total Volume"
          val={stats.total}
          icon={<DollarSign />}
          color="text-blue-400"
        />
        <StatCard
          title="Settled"
          val={stats.success}
          icon={<CheckCircle />}
          color="text-emerald-400"
        />
        <StatCard
          title="In Review"
          val={stats.pending}
          icon={<Clock />}
          color="text-amber-400"
        />
      </div>

      {/* Main Table Container */}
      <div className="bg-[#111420] rounded-[32px] border border-gray-800 p-2 shadow-2xl overflow-hidden">
        <div className="p-6 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
              size={18}
            />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter by customer or ID..."
              className="w-full bg-[#0b0e14] border border-gray-800 rounded-2xl pl-12 pr-4 py-4 text-sm focus:ring-2 focus:ring-blue-600 outline-none transition-all"
            />
          </div>
          <select
            onChange={(e) => setMethodFilter(e.target.value)}
            className="bg-[#0b0e14] border border-gray-800 px-6 py-4 rounded-2xl text-sm font-bold outline-none cursor-pointer"
          >
            <option value="All">All Payment Methods</option>
            <option value="Card">Credit Card</option>
            <option value="PayPal">PayPal</option>
            <option value="COD">Cash on Delivery</option>
          </select>
        </div>

        <table className="w-full text-left">
          <thead className="bg-[#161927]/50 text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">
            <tr>
              <th className="px-8 py-5">Transaction ID</th>
              <th className="px-8 py-5">Payer</th>
              <th className="px-8 py-5">Settlement</th>
              <th className="px-8 py-5">Status</th>
              <th className="px-8 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/40">
            {filtered.map((p) => (
              <tr
                key={p.id}
                className="hover:bg-blue-600/[0.03] transition-all group border-none"
              >
                <td className="px-8 py-6">
                  <p className="text-xs font-mono font-bold text-gray-400">
                    #{p.transactionId}
                  </p>
                  <p className="text-[10px] text-gray-600 mt-1 uppercase font-black">
                    {p.method}
                  </p>
                </td>
                <td className="px-8 py-6">
                  <p className="text-sm font-bold text-white">
                    {p.customerName}
                  </p>
                  <p className="text-[10px] text-gray-500 font-medium">
                    {p.customerEmail}
                  </p>
                </td>
                <td className="px-8 py-6 font-black text-sm text-blue-400">
                  ${p.amount.toLocaleString()}
                </td>
                <td className="px-8 py-6">
                  <span
                    className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                      p.status === "Success"
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        : p.status === "Pending"
                          ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                          : "bg-red-500/10 text-red-400 border-red-500/20"
                    }`}
                  >
                    {p.status}
                  </span>
                </td>
                <td className="px-8 py-6 text-right space-x-2">
                  <button
                    onClick={() => setSelectedPayment(p)}
                    className="p-3 bg-gray-800/40 rounded-xl text-gray-400 hover:text-white transition-all"
                  >
                    <ExternalLink size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="p-3 bg-red-500/10 rounded-xl text-red-500 hover:bg-red-500 hover:text-white transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ACTION MODAL: VERIFY & VIEW */}
      {selectedPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
          <div className="bg-[#111420] border border-gray-800 w-full max-w-lg rounded-[32px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-8 border-b border-gray-800 flex justify-between items-center bg-[#161927]">
              <h2 className="text-xl font-black italic tracking-tighter">
                FINANCIAL AUDIT
              </h2>
              <button
                onClick={() => setSelectedPayment(null)}
                className="p-2 hover:bg-gray-800 rounded-full text-gray-400 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-8 space-y-6">
              <div className="flex items-center justify-between p-4 bg-[#0b0e14] border border-gray-800 rounded-2xl">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-tighter">
                  System Log
                </span>
                <span
                  className={`text-[10px] font-black uppercase flex items-center gap-2 ${selectedPayment.status === "Success" ? "text-emerald-400" : "text-amber-400"}`}
                >
                  <ShieldCheck size={14} /> {selectedPayment.status} RECORD
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="p-4 bg-[#161927] rounded-2xl border border-gray-800">
                  <p className="text-[10px] font-black text-gray-600 uppercase mb-1">
                    Settlement
                  </p>
                  <p className="font-black text-xl text-white">
                    ${selectedPayment.amount.toLocaleString()}
                  </p>
                </div>
                <div className="p-4 bg-[#161927] rounded-2xl border border-gray-800">
                  <p className="text-[10px] font-black text-gray-600 uppercase mb-1">
                    Gateway
                  </p>
                  <p className="font-bold text-white">
                    {selectedPayment.method}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <DetailRow
                  label="Transaction ID"
                  val={selectedPayment.transactionId}
                  mono
                />
                <DetailRow
                  label="Order Reference"
                  val={selectedPayment.orderId}
                  mono
                />
                <DetailRow label="Finalized Date" val={selectedPayment.date} />
              </div>
            </div>

            {/* REAL WORLD ACTIONS: Only show buttons if record isn't already settled */}
            <div className="p-8 bg-[#161927]/50 border-t border-gray-800 flex gap-4">
              {selectedPayment.status === "Pending" ? (
                <>
                  <button
                    onClick={() =>
                      handleUpdateStatus(selectedPayment.id, "Success")
                    }
                    className="flex-1 bg-emerald-600 py-4 rounded-2xl font-black text-sm shadow-xl shadow-emerald-600/20 hover:bg-emerald-700 transition-all flex items-center justify-center gap-2"
                  >
                    <CheckCircle size={18} /> APPROVE
                  </button>
                  <button
                    onClick={() =>
                      handleUpdateStatus(selectedPayment.id, "Failed")
                    }
                    className="flex-1 bg-red-600/10 border border-red-600/20 text-red-500 py-4 rounded-2xl font-black text-sm hover:bg-red-600 hover:text-white transition-all"
                  >
                    REJECT
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setSelectedPayment(null)}
                  className="w-full bg-blue-600 py-4 rounded-2xl font-black hover:bg-blue-700 transition-all uppercase tracking-widest text-sm"
                >
                  Return to Ledger
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- SUBCOMPONENTS ---
const StatCard = ({ title, val, icon, color }: any) => (
  <div className="bg-[#111420] p-7 rounded-[32px] border border-gray-800 hover:border-blue-500/30 transition-all group">
    <div className="flex justify-between items-start mb-4">
      <div
        className={`p-3 rounded-2xl bg-[#0b0e14] border border-gray-800 ${color} shadow-inner`}
      >
        {icon}
      </div>
      <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
        {title}
      </span>
    </div>
    <h3 className="text-3xl font-black text-white italic tracking-tighter">
      ${val.toLocaleString()}
    </h3>
  </div>
);

const DetailRow = ({ label, val, mono }: any) => (
  <div className="flex justify-between items-center py-2 border-b border-gray-800/50">
    <span className="text-[10px] font-black text-gray-500 uppercase tracking-tighter">
      {label}
    </span>
    <span
      className={`text-xs font-bold ${mono ? "font-mono text-blue-300" : "text-white"}`}
    >
      {val}
    </span>
  </div>
);

export default PaymentsManagement;
