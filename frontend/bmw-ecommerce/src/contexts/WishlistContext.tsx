import axios from "axios";
import { createContext, useState, type ReactNode } from "react";
import { toast } from "react-toastify";
interface IWishlistContext {
  wishlist: string[];
  totalWishlist: () => Promise<void>;
  toggleWishlist: (carId: string) => Promise<void>;
  isWishlisted: (carId: string) => boolean;
}

interface WishlistProvider {
  children: ReactNode;
}
/* eslint-disable react-refresh/only-export-components */
export const WishlistContext = createContext<IWishlistContext | null>(null);

export const WishlistProvider = ({ children }: WishlistProvider) => {
  const [wishlist, setWishlist] = useState<string[]>([]);
  const totalWishlist = async () => {
    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/api/wishlist/getWishlist`
      );
      const stringIds = res.data.data.map((item: any) => item.carId);
      setWishlist(stringIds);
    } catch (err) {
      console.log(err);
    }
  };

  const toggleWishlist = async (carId: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login or signup to use wishlist");
        return;
      }
      const res = await axios.post(
        `http://127.0.0.1:8000/api/wishlist/toggleWishlist`,
        { carId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Convert the updated response to strings as well
      const data = res.data.data || res.data;
      const stringIds = data.map((item: any) => item.carId);
      setWishlist(stringIds);
      if (stringIds.includes(carId)) {
        toast.success("Added to wishlist ❤️");
      } else {
        toast.warn("Removed from wishlist");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const isWishlisted = (carId: string) => {
    return wishlist.includes(carId);
  };
  return (
    <WishlistContext.Provider
      value={{ wishlist, totalWishlist, toggleWishlist, isWishlisted }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
