import axios from "axios";
import {
  createContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { toast } from "react-toastify";
import type { WishlistItem } from "../types/wishlist";
import { useAuth } from "../hooks/useAuth";

interface IWishlistContext {
  wishlist: string[];
  totalWishlist: () => Promise<void>;
  toggleWishlist: (carId: string) => Promise<void>;
  isWishlisted: (carId: string) => boolean;
}

interface WishlistProviderProps {
  children: ReactNode;
}

/* eslint-disable react-refresh/only-export-components */
export const WishlistContext = createContext<IWishlistContext | null>(null);

export const WishlistProvider = ({ children }: WishlistProviderProps) => {
  const [wishlist, setWishlist] = useState<string[]>([]);
  const { user } = useAuth();

  // FIX: This function now handles BOTH fetching and clearing
  const totalWishlist = useCallback(async () => {
    // 1. If no user/token, clear wishlist immediately
    const token = localStorage.getItem("token");
    if (!user || !token) {
      setWishlist([]);
      return;
    }

    // 2. If user exists, fetch data
    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/api/wishlist/getWishlist`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const stringIds = res.data.data.wishlist.map(
        (item: WishlistItem) => item.carId,
      );
      setWishlist(stringIds);
    } catch (err) {
      // If token is invalid or user not found, clear token and wishlist
      if (axios.isAxiosError(err)) {
        const status = err.response?.status;
        if (status === 401 || status === 403 || status === 404) {
          localStorage.removeItem("token");
          setWishlist([]);
          return;
        }
      }
      console.log(err);
      setWishlist([]); // Fallback clear on error
    }
  }, [user]);

  const toggleWishlist = async (carId: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token || !user) {
        toast.info("Please login or signup to use wishlist");
        return;
      }

      const res = await axios.post(
        `http://127.0.0.1:8000/api/wishlist/toggleWishlist`,
        { carId },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      const data = res.data.data || res.data;
      const stringIds = data.map((item: WishlistItem) => item.carId);
      setWishlist(stringIds);

      if (stringIds.includes(carId)) {
        toast.success("Added to wishlist ❤️");
      } else {
        toast.warn("Removed from wishlist");
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const status = err.response?.status;
        if (status === 401 || status === 403 || status === 404) {
          localStorage.removeItem("token");
          setWishlist([]);
          toast.info("Please login to use wishlist");
          return;
        }
      }
      console.log(err);
    }
  };

  const isWishlisted = (carId: string) => wishlist.includes(carId);

  useEffect(() => {
    totalWishlist();
  }, [totalWishlist]);

  return (
    <WishlistContext.Provider
      value={{ wishlist, totalWishlist, toggleWishlist, isWishlisted }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
