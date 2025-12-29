import { useEffect } from "react";
import CartItemCard from "../components/CartItemCard";
import OrderSummary from "../components/OrderSummary";
import { useCart } from "../hooks/useCart";

export default function Cart() {
  const { cart, getCart, loading } = useCart();
  useEffect(() => {
    getCart();
  }, [getCart]);
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0b0f19] px-6 py-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-6">
          <h1 className="text-3xl font-black uppercase mb-6">Shopping Cart</h1>
          <div className="space-y-6 min-h-[200px]">
            {loading ? (
              <div className="text-gray-400 text-lg">Loading your cart...</div>
            ) : cart.length === 0 ? (
              <div className="text-gray-400 text-lg">Your cart is empty</div>
            ) : (
              cart.map((item) => <CartItemCard key={item._id} item={item} />)
            )}
          </div>
        </div>
        <div className="lg:col-span-1">
          <OrderSummary cart={cart} />
        </div>
      </div>
    </div>
  );
}
