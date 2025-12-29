import { createContext, useEffect, useState, type ReactNode } from "react";
import type { CartItem } from "../types/cart";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";

interface CartContextType {
  cart: CartItem[];
  loading: boolean;
  addToCart: (item: CartItem) => Promise<void>;
  getCart: () => Promise<void>;
  updateCartItem: (itemId: string, quantity: number) => void;
  removeCartItem: (itemId: string) => void;
}
/* eslint-disable react-refresh/only-export-components */
export const CartContext = createContext<CartContextType | null>(null);
type CartProvider = {
  children: ReactNode;
};

export const CartProvider = ({ children }: CartProvider) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const addToCart = async (item: CartItem) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `http://127.0.0.1:8000/api/cart/addCart`,
        item,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.data && res.data.item) {
        setCart(res.data.item);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const getCart = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(`http://127.0.0.1:8000/api/cart/getCart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const cartItem = res.data.item ? res.data.item : [];
      setCart(cartItem);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  const updateCartItem = async (itemId: string, quantity: number) => {
    try {
      const res = await axios.post(
        `http://127.0.0.1:8000/api/cart/updateCart`,
        { itemId: itemId, quantity: quantity }
      );
      setCart(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  const removeCartItem = async (itemId: string) => {
    try {
      const res = await axios.delete(
        `http://127.0.0.1:8000/api/cart/removeCart`,
        { data: { itemId } }
      );
      setCart(res.data || []);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    const fetchCart = async () => {
      if (user) {
        await getCart();
      } else {
        setCart([]);
      }
    };
    fetchCart();
  }, [user]);

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
