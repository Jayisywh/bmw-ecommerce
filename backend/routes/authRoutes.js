import express from "express";
import { login, signup } from "../controllers/authController.js";
import verifyToken from "../middlewares/verifyToken.js";
import { getCurrentUser } from "../controllers/userController.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/me", verifyToken, getCurrentUser);

export default router;
