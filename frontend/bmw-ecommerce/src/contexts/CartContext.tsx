import {
  createContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { CartItem } from "../types/cart";
import axios from "axios";
import { toast } from "react-toastify";
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

type CartProviderProps = {
  children: ReactNode;
};

export const CartProvider = ({ children }: CartProviderProps) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();

  // Helper: Normalize items to preserve a readable `name`
  const normalizeCartItems = useCallback((items: any[]) => {
    try {
      return items.map((it) => {
        const id = it._id ?? it.carId;
        // Use a simple check to find existing name if available
        const name =
          it.name ||
          (it.carId &&
            typeof it.carId === "object" &&
            (it.carId.name || it.carId.model)) ||
          (typeof it.carId === "string" ? it.carId : "Vehicle");
        return { ...it, name };
      });
    } catch (e) {
      return items;
    }
  }, []);

  // Helper: Resolve ID strings
  const resolveId = (v: any) => {
    if (!v && v !== 0) return "";
    if (typeof v === "string") return v;
    if (typeof v === "object") return v._id ?? v.carId ?? "";
    return String(v);
  };

  // --- GET CART (Fixed Logic) ---
  const getCart = useCallback(async () => {
    const token = localStorage.getItem("token");

    // 1. GUEST / LOGOUT STATE
    if (!token || !user) {
      try {
        const guest = localStorage.getItem("guest_cart");
        if (guest) {
          const parsed = JSON.parse(guest) as CartItem[];
          setCart(normalizeCartItems(parsed));
        } else {
          setCart([]); // Explicitly clear if no guest data
        }
      } catch {
        setCart([]);
      }
      setLoading(false);
      return;
    }

    // 2. LOGGED IN STATE
    try {
      setLoading(true);
      const res = await axios.get(`http://127.0.0.1:8000/api/cart/getCart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const cartItem = res.data.item ? res.data.item : [];
      setCart(normalizeCartItems(cartItem));
    } catch (err: any) {
      console.log(err);
      // Handle authentication errors by logging out
      if (err.response?.status === 401 || err.response?.status === 403) {
        logout();
        setCart([]); // Ensure cart is cleared on auth fail
      } else {
        // If it's just a fetch error (server down), keep empty or prev state
        // usually safer to show empty or error state
      }
    } finally {
      setLoading(false);
    }
  }, [user, logout, normalizeCartItems]);

  // --- ADD TO CART ---
  const addToCart = useCallback(
    async (item: CartItem) => {
      try {
        const token = localStorage.getItem("token");

        // GUEST MODE
        if (!token || !user) {
          try {
            const guestRaw = localStorage.getItem("guest_cart");
            const guest: CartItem[] = guestRaw ? JSON.parse(guestRaw) : [];

            // Check duplicates based on ID + Options
            const existingIndex = guest.findIndex((g) => {
              return (
                resolveId(g._id ?? g.carId) ===
                  resolveId(item._id ?? item.carId) &&
                JSON.stringify(g.selectOptions) ===
                  JSON.stringify(item.selectOptions)
              );
            });

            if (existingIndex >= 0) {
              guest[existingIndex].quantity += item.quantity;
            } else {
              guest.push(item);
            }

            localStorage.setItem("guest_cart", JSON.stringify(guest));
            setCart(normalizeCartItems(guest));
            toast.info("Added to cart (saved locally)");
            return;
          } catch (e) {
            console.log(e);
            toast.error("Failed to add item to cart");
            return;
          }
        }

        // AUTHENTICATED MODE
        const res = await axios.post(
          `http://127.0.0.1:8000/api/cart/addCart`,
          item,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        if (res.data && res.data.item) {
          setCart(normalizeCartItems(res.data.item));
          toast.success("Added to cart");
        }
      } catch (err: any) {
        console.log(err);
        if (err.response?.status === 401 || err.response?.status === 403) {
          logout();
        }
        toast.error("Failed to add item to cart");
      }
    },
    [user, logout, normalizeCartItems],
  );

  // --- UPDATE CART ITEM ---
  const updateCartItem = useCallback(
    async (itemId: string, quantity: number) => {
      try {
        const token = localStorage.getItem("token");

        // GUEST MODE
        if (!token || !user) {
          try {
            const guestRaw = localStorage.getItem("guest_cart");
            const guest: CartItem[] = guestRaw ? JSON.parse(guestRaw) : [];
            const idx = guest.findIndex(
              (g) => resolveId(g._id ?? g.carId) === resolveId(itemId),
            );
            if (idx >= 0) {
              guest[idx].quantity = quantity;
              localStorage.setItem("guest_cart", JSON.stringify(guest));
              setCart(normalizeCartItems(guest));
              toast.info("Cart updated");
            }
          } catch (e) {
            console.log(e);
          }
          return;
        }

        // AUTHENTICATED MODE
        const res = await axios.post(
          `http://127.0.0.1:8000/api/cart/updateCart`,
          { itemId: itemId, quantity: quantity },
          { headers: { Authorization: `Bearer ${token}` } },
        );
        if (res.data && res.data.item) {
          setCart(normalizeCartItems(res.data.item));
          toast.info("Cart updated");
        }
      } catch (err: any) {
        console.log(err);
        if (err.response?.status === 401 || err.response?.status === 403) {
          logout();
        }
      }
    },
    [user, logout, normalizeCartItems],
  );

  // --- REMOVE CART ITEM ---
  const removeCartItem = useCallback(
    async (itemId: string) => {
      try {
        const token = localStorage.getItem("token");

        // GUEST MODE
        if (!token || !user) {
          try {
            const guestRaw = localStorage.getItem("guest_cart");
            const guest: CartItem[] = guestRaw ? JSON.parse(guestRaw) : [];
            const filtered = guest.filter(
              (g) => resolveId(g._id ?? g.carId) !== resolveId(itemId),
            );
            localStorage.setItem("guest_cart", JSON.stringify(filtered));
            setCart(normalizeCartItems(filtered));
            toast.info("Removed from cart");
          } catch (e) {
            console.log(e);
          }
          return;
        }

        // AUTHENTICATED MODE
        const res = await axios.delete(
          `http://127.0.0.1:8000/api/cart/deleteCart`,
          {
            data: { itemId },
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        if (res.data && res.data.item) {
          setCart(normalizeCartItems(res.data.item));
          toast.success("Removed from cart");
        } else {
          // If the backend returns empty or deleted, clear local state
          // Depending on API response, sometimes getting fresh cart is safer
          // But here we rely on the response item array
          setCart([]);
        }
      } catch (err: any) {
        console.log(err);
        if (err.response?.status === 401 || err.response?.status === 403) {
          logout();
        }
        toast.error("Failed to update cart");
      }
    },
    [user, logout, normalizeCartItems],
  );

  // --- INITIAL LOAD ---
  useEffect(() => {
    getCart();
  }, [getCart]);

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
