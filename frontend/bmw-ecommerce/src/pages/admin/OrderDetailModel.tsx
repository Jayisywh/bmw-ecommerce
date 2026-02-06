import { X, CheckCircle, Clock, Truck, AlertCircle } from "lucide-react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const OrderDetailsModal = ({ isOpen, onClose, orderId, onUpdated }: any) => {
  const [order, setOrder] = useState<any>(null);
  const [status, setStatus] = useState<string>("");
  const [payStatus, setPayStatus] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen || !orderId) return;
    const loadOrder = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `http://127.0.0.1:8000/api/admin/orders/${orderId}`,
        );
        const data = res.data.data;
        setOrder(data);
        setStatus(data.orderStatus || "Pending");
        setPayStatus(data.paymentStatus || "Unpaid");
      } catch (err) {
        console.error("Load failed:", err);
      } finally {
        setLoading(false);
      }
    };
    loadOrder();
  }, [isOpen, orderId]);

  const handleUpdate = async () => {
    try {
      await axios.put(`http://127.0.0.1:8000/api/admin/orders/${orderId}`, {
        orderStatus: status,
        paymentStatus: payStatus,
      });
      toast.success("Order and Payment updated successfully!");
      if (onUpdated) onUpdated();
      onClose();
    } catch (err) {
      toast.error("Update failed");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="bg-[#111420] w-full max-w-3xl rounded-3xl border border-gray-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-800 flex justify-between items-center bg-[#161927]">
          <div>
            <h2 className="text-xl font-bold text-white">Manage Order</h2>
            <p className="text-xs text-gray-500 font-mono mt-1">{orderId}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        <div className="p-8 overflow-y-auto custom-scrollbar space-y-8">
          {loading ? (
            <div className="py-20 text-center text-gray-500">
              Loading order data...
            </div>
          ) : (
            <>
              {/* Items Section */}
              <section>
                <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">
                  Purchased Vehicles
                </h3>
                <div className="space-y-3">
                  {order?.items?.map((item: any, idx: number) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between bg-[#1a1d2e] p-4 rounded-2xl border border-gray-800"
                    >
                      <div>
                        <p className="font-bold text-white">
                          {item.carId?.name || "BMW Model"}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Qty: {item.quantity} × $
                          {item.unitPrice?.toLocaleString()}
                        </p>
                      </div>
                      <p className="text-blue-400 font-bold">
                        ${(item.quantity * item.unitPrice).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Status Update */}
                <section className="space-y-4">
                  <div>
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-2">
                      Order Progress
                    </label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full bg-[#0b0e14] border border-gray-800 text-sm rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500"
                    >
                      {[
                        "Pending",
                        "Confirmed",
                        "Processing",
                        "Shipped",
                        "Delivered",
                        "Canceled",
                      ].map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-2">
                      Payment Status
                    </label>
                    <select
                      value={payStatus}
                      onChange={(e) => setPayStatus(e.target.value)}
                      className="w-full bg-[#0b0e14] border border-gray-800 text-sm rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500"
                    >
                      {["Unpaid", "Paid", "Refunded"].map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-2">
                      Payment Method
                    </label>
                    <div className="bg-[#1a1d2e] p-4 rounded-2xl border border-gray-800">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                          order?.paymentId?.paymentMethod === "COD"
                            ? "bg-purple-500/10 text-purple-400"
                            : order?.paymentId?.paymentMethod === "PayPal"
                              ? "bg-blue-500/10 text-blue-400"
                              : "bg-gray-800/50 text-gray-300"
                        }`}
                      >
                        {order?.paymentId?.paymentMethod || "N/A"}
                      </span>
                      {order?.paymentId?.transactionId && (
                        <p className="text-xs text-gray-500 mt-2 font-mono">
                          Txn: {order.paymentId.transactionId}
                        </p>
                      )}
                    </div>
                  </div>
                </section>

                {/* Shipping Info */}
                <section>
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-2">
                    Delivery Details
                  </label>
                  <div className="bg-[#1a1d2e] p-4 rounded-2xl border border-gray-800 text-sm text-gray-300">
                    <p className="text-white font-bold mb-1">
                      {order?.shippingAddress?.fullName}
                    </p>
                    <p>{order?.shippingAddress?.address}</p>
                    <p>
                      {order?.shippingAddress?.city},{" "}
                      {order?.shippingAddress?.zipCode}
                    </p>
                    <p className="mt-2 text-gray-500">{order?.userId?.email}</p>
                  </div>
                </section>
              </div>
            </>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-8 py-6 bg-[#161927] border-t border-gray-800 flex justify-between items-center">
          <div>
            <p className="text-[10px] font-black text-gray-500 uppercase">
              Grand Total
            </p>
            <p className="text-2xl font-black text-white">
              ${order?.totalPrice?.toLocaleString()}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-6 py-3 text-sm font-bold text-gray-400 hover:text-white transition-colors"
            >
              Discard
            </button>
            <button
              onClick={handleUpdate}
              className="px-10 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-500/20 transition-all"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;
