import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../hooks/useAuth";
import SummaryRow from "./SummaryRow";
import type { CartItem } from "../../types/cart";

export default function OrderSummary({ cart }: { cart: CartItem[] }) {
  const subtotal = cart.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );
  const tax = subtotal * 0.05;
  const total = subtotal + tax;

  const navigate = useNavigate();
  const { user } = useAuth();

  const handleCheckout = () => {
    if (!user) {
      toast.info("Please login or create an account to checkout.", {
        toastId: "checkout-login",
      });
      navigate("/login");
      return;
    }
    if (!cart || cart.length === 0) {
      toast.info("Your cart is empty", { toastId: "checkout-empty" });
      return;
    }
    navigate("/checkout");
  };
  return (
    <div
      className="
      sticky top-24
      p-6 rounded-2xl
      bg-white dark:bg-[#111827]
      border border-gray-200 dark:border-gray-800
    "
    >
      <h3 className="text-xl font-black uppercase mb-6">Order Summary</h3>
      <SummaryRow label="Subtotal" value={`$${subtotal.toLocaleString()}`} />
      <SummaryRow label="Shipping" value="Free" />
      <SummaryRow label="Tax (5%)" value={`$${tax.toLocaleString()}`} />
      <div className="border-t my-6" />
      <SummaryRow label="Total" value={`$${total.toLocaleString()}`} bold />
      <button
        className="
        w-full mt-6 py-4 rounded-xl
        bg-[#1C69D2] hover:bg-[#1652a7]
        text-white text-xs font-black
        uppercase tracking-widest
      "
        onClick={handleCheckout}
      >
        Checkout
      </button>
    </div>
  );
}
