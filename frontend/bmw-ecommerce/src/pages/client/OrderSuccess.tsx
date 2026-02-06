import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { OrderSuccess } from "../../types/checkout";

export default function OrderSuccess() {
  const { state } = useLocation() as { state: OrderSuccess };
  const navigate = useNavigate();
  useEffect(() => {
    if (!state) navigate("/", { replace: true });
  }, [state, navigate]);
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0B0F19]">
      <div className="bg-white dark:bg-[#111827] p-10 rounded-2xl max-w-md w-full text-center">
        <h1 className="text-2xl font-black text-green-600 mb-4">
          Order Placed Successfully
        </h1>
        <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
          <div className="grid grid-cols-[140px_1fr] gap-y-3 text-sm text-justify">
            <span className="font-bold">Order Id:</span>
            <span className="break-all">{state.orderId}</span>

            <span className="font-bold">Transaction Id:</span>
            <span className="break-all">{state.transactionId}</span>

            <span className="font-bold">Payment Method:</span>
            <span className="break-all">{state.paymentMethod}</span>

            <span className="font-bold">Total Price:</span>
            <span className="font-bold text-green-500">{state.totalPrice}</span>

            <span className="font-bold">Order Status:</span>
            <span className="break-all">{state.orderStatus}</span>
          </div>
        </div>
        <button
          className="mt-6 w-full py-4 rounded-xl bg-[#1C69D2] text-white font-bold uppercase tracking-widest"
          onClick={() => {
            navigate("/");
          }}
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
}
