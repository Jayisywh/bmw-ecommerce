import express from "express";
import { createReview } from "../../controllers/client/reviewController.js";
import verifyToken from "../../middlewares/verifyToken.js";

const router = express.Router();
router.post("/create", verifyToken, createReview);

export default router;
