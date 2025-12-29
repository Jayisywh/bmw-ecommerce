import express from "express";
import {
  addToCartItem,
  deleteCartItem,
  getCartItem,
  updateCartItem,
} from "../controllers/cartController.js";
import verifyToken from "../middlewares/verifyToken.js";

const router = express.Router();
router.post("/addCart", verifyToken, addToCartItem);
router.post("/updateCart", updateCartItem);
router.delete("/deleteCart", deleteCartItem);
router.get("/getCard", verifyToken, getCartItem);

export default router;
