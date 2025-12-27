import { useContext } from "react";
import { WishlistContext } from "../contexts/WishlistContext";

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context)
    throw new Error("useWishlist can be used within the wishlist provider");
  return context;
};
