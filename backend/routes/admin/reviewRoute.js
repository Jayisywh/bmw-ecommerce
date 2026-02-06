import express from "express";
import { getAllReviews } from "../../controllers/admin/reviewController.js";
import verifyToken from "../../middlewares/verifyToken.js";

const router = express.Router();
router.get("/all", verifyToken, getAllReviews);

export default router;
