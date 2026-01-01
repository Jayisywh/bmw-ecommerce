import {
  createContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { CartItem } from "../types/cart";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";

interface CartContextType {
  cart: CartItem[];
  loading: boolean;
  addToCart: (item: CartItem) => Promise<void>;
  getCart: () => Promise<void>;
  updateCartItem: (itemId: string, quantity: number) => Promise<void>;
  removeCartItem: (itemId: string) => Promise<void>;
}
/* eslint-disable react-refresh/only-export-components */
export const CartContext = createContext<CartContextType | null>(null);

type CartProviderProps = { children: ReactNode };

export const CartProvider = ({ children }: CartProviderProps) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { user, authLoading, logout } = useAuth();

  const getCart = useCallback(async (): Promise<void> => {
    const token = localStorage.getItem("token");
    if (!token || !user) {
      setCart([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await axios.get<{ item: CartItem[] }>(
        "http://127.0.0.1:8000/api/cart/getCart",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCart(res.data.item ?? []);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        console.error("GET CART ERROR:", err.response?.data);
        if (err.response?.status === 401 || err.response?.status === 403)
          logout();
      } else {
        console.error("UNKNOWN ERROR:", err);
      }
      setCart([]);
    } finally {
      setLoading(false);
    }
  }, [user, logout]);

  const addToCart = useCallback(
    async (item: CartItem): Promise<void> => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await axios.post<{ item: CartItem[] }>(
          "http://127.0.0.1:8000/api/cart/addCart",
          item,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (res.data?.item) setCart(res.data.item);
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          console.error("ADD CART ERROR:", err.response?.data);
          if (err.response?.status === 401 || err.response?.status === 403)
            logout();
        } else {
          console.error("UNKNOWN ERROR:", err);
        }
      }
    },
    [logout]
  );

  const updateCartItem = useCallback(
    async (itemId: string, quantity: number): Promise<void> => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await axios.post<{ item: CartItem[] }>(
          "http://127.0.0.1:8000/api/cart/updateCart",
          { itemId, quantity },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (res.data?.item) setCart(res.data.item);
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          console.error("UPDATE CART ERROR:", err.response?.data);
          if (err.response?.status === 401 || err.response?.status === 403)
            logout();
        } else {
          console.error("UNKNOWN ERROR:", err);
        }
      }
    },
    [logout]
  );

  const removeCartItem = useCallback(
    async (itemId: string): Promise<void> => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await axios.delete<{ item: CartItem[] }>(
          "http://127.0.0.1:8000/api/cart/deleteCart",
          {
            data: { itemId },
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("REMOVE CART RESPONSE:", res.data);
        if (res.data?.item) setCart(res.data.item);
        else setCart([]);
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          console.error("REMOVE CART ERROR:", err.response?.data);
          if (err.response?.status === 401 || err.response?.status === 403)
            logout();
        } else {
          console.error("UNKNOWN ERROR:", err);
        }
      }
    },
    [logout]
  );

  useEffect(() => {
    if (authLoading) return;
    if (user) getCart();
    else {
      setCart([]);
      setLoading(false);
    }
  }, [user, authLoading, getCart]);

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        addToCart,
        getCart,
        updateCartItem,
        removeCartItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
