import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import type { CheckoutErrors } from "../../types/checkout";
import { useCart } from "../../hooks/useCart";
import { useAuth } from "../../hooks/useAuth";

export const Checkout = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    zipCode: "",
    paymentMethod: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<CheckoutErrors>({});

  // New state to prevent redirecting when order is successful
  const [isSuccess, setIsSuccess] = useState(false);

  const inputStyle = `w-full px-4 py-3 rounded-xl bg-transparent border border-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-[#1C69D2]
  focus:ring-2 focus:ring-[#1C69D2]/20
  transition-all duration-300
  `;
  const { cart, getCart, loading: cartLoading } = useCart();
  const { user } = useAuth();
  const useRefRan = useRef(false);

  // --- 1. FIXED USE EFFECT ---
  useEffect(() => {
    // If the order was just successful, DO NOT redirect to cart
    if (isSuccess) return;

    if (useRefRan.current) return;

    // Only redirect if cart is truly empty AND we are not loading AND not successful
    if (!cartLoading && (!cart || cart.length === 0)) {
      toast.info("Your cart is empty", { toastId: "checkout-empty" });
      navigate("/cart");
      useRefRan.current = true;
    }
  }, [cart, cartLoading, navigate, isSuccess]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const newError: CheckoutErrors = {};
    if (!form.fullName.trim()) newError.fullName = "Fullname is required";
    if (!form.phone.trim()) newError.phone = "Phone is required";
    if (!form.address.trim()) newError.address = "Address is required";
    if (!form.city.trim()) newError.city = "City is required";
    if (!form.country.trim()) newError.country = "Country is required";
    if (!form.zipCode.trim()) newError.zipCode = "Zipcode is required";
    if (!form.paymentMethod)
      newError.paymentMethod = "Payment method is required";

    setError(newError);
    return Object.keys(newError).length === 0;
  };

  const handleCheckout = async () => {
    if (!user) {
      toast.info("Please login or create an account to complete checkout.");
      return;
    }

    // --- 2. FIXED VALIDATION ---
    // Changed '<= 1' to '=== 0'. Now you can checkout with just 1 item!
    if (!cart || cart.length === 0) {
      toast.info("Your cart is empty.");
      return;
    }

    if (!validateForm()) return;

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `http://127.0.0.1:8000/api/orders/checkout`,
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (res.data.status === "success") {
        // --- 3. FIX THE REDIRECT & ORDER COUNT ---
        setIsSuccess(true); // Flag to stop the useEffect above

        // Update cart (it will become empty, but the flag stops the redirect)
        await getCart();

        // Navigate to success page
        navigate("/order-success", {
          state: res.data.orderSuccess,
        });

        // OPTIONAL: Reload page to update "Order Count" in sidebar if needed
        // window.location.reload();
      }
    } catch (err) {
      console.log(err || "Checkout failed");
      toast.error("Checkout failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center dark:text-white">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0B0F19] py-12">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 bg-white dark:bg-[#111827] p-8 rounded-2xl border border-gray-200 dark:border-gray-800">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Shipping Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1 block">
                Full Name
              </label>
              <input
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                className={inputStyle}
              />
              <p className="h-4 text-xs text-red-500 mt-1">
                {error.fullName || ""}
              </p>
            </div>

            {/* Phone */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1 block">
                Phone
              </label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className={inputStyle}
              />
              <p className="h-4 text-xs text-red-500 mt-1">
                {error.phone || ""}
              </p>
            </div>

            {/* Address */}
            <div className="md:col-span-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1 block">
                Address
              </label>
              <input
                name="address"
                value={form.address}
                onChange={handleChange}
                className={inputStyle}
              />
              <p className="h-4 text-xs text-red-500 mt-1">
                {error.address || ""}
              </p>
            </div>

            {/* City */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1 block">
                City
              </label>
              <input
                name="city"
                value={form.city}
                onChange={handleChange}
                className={inputStyle}
              />
              <p className="h-4 text-xs text-red-500 mt-1">
                {error.city || ""}
              </p>
            </div>

            {/* Country */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1 block">
                Country
              </label>
              <input
                name="country"
                value={form.country}
                onChange={handleChange}
                className={inputStyle}
              />
              <p className="h-4 text-xs text-red-500 mt-1">
                {error.country || ""}
              </p>
            </div>

            {/* Zip */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1 block">
                Zip Code
              </label>
              <input
                name="zipCode"
                value={form.zipCode}
                onChange={handleChange}
                className={inputStyle}
              />
              <p className="h-4 text-xs text-red-500 mt-1">
                {error.zipCode || ""}
              </p>
            </div>
          </div>

          <div className="mt-10">
            <p className="text-sm font-bold uppercase tracking-widest text-gray-700 dark:text-gray-300 mb-4">
              Payment Method
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { id: "Card", label: "Card" },
                { id: "COD", label: "Cash on Delivery" },
                { id: "PayPal", label: "PayPal" },
              ].map((method) => (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => setForm({ ...form, paymentMethod: method.id })}
                  className={`
          p-5 rounded-xl border
          text-sm font-bold uppercase tracking-widest
          transition-all duration-300
          ${
            form.paymentMethod === method.id
              ? "border-[#1C69D2] bg-[#1C69D2]/10 text-[#1C69D2]"
              : "border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-[#1C69D2]"
          }
        `}
                >
                  {method.label}
                </button>
              ))}
            </div>
            <p className="h-4 text-xs text-red-500 mt-1 text-center md:text-left">
              {error.paymentMethod || ""}
            </p>
          </div>
          <button
            type="submit"
            onClick={handleCheckout}
            className="w-full py-5 rounded-2xl mt-4 bg-[#1C69D2] hover:bg-[#1652a7] transition-colors text-white text-sm font-black uppercase tracking-widest shadow-lg shadow-blue-500/20"
          >
            Place Order
          </button>
        </div>

        {/* Simple Order Summary Side Panel (Optional Visualization) */}
        <div className="bg-white dark:bg-[#111827] p-8 rounded-2xl border border-gray-200 dark:border-gray-800 h-fit">
          <h3 className="text-xl font-bold dark:text-white mb-4">
            Order Summary
          </h3>
          <div className="flex justify-between mb-2 text-gray-500">
            <span>Items</span>
            <span>{cart.reduce((acc, item) => acc + item.quantity, 0)}</span>
          </div>
          <div className="border-t dark:border-gray-700 my-4"></div>
          <div className="flex justify-between font-bold text-xl dark:text-white">
            <span>Total</span>
            <span>
              $
              {cart
                .reduce((acc, item) => acc + item.unitPrice * item.quantity, 0)
                .toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
