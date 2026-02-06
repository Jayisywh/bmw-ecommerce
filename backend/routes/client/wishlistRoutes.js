import express from "express";
import {
  getWishlist,
  toggleWishlist,
} from "../../controllers/client/wishlistController.js";
import verifyToken from "../../middlewares/verifyToken.js";

const router = express.Router();

router.get("/getWishlist", verifyToken, getWishlist);
router.post("/toggleWishlist", verifyToken, toggleWishlist);

export default router;
