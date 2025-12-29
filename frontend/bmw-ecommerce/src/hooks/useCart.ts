import { useContext } from "react";
import { CartContext } from "../contexts/CartContext";

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart can be used within the cart provider");
  return context;
};
