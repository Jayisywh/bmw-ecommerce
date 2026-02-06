import express from "express";
import {
  login,
  requestPasswordOtp,
  resetPasswordWithOTP,
  signup,
  updateUserInfo,
} from "../../controllers/client/authController.js";
import verifyToken from "../../middlewares/verifyToken.js";
import {
  getCurrentUser,
  getUserinfo,
} from "../../controllers/client/userController.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/me", verifyToken, getCurrentUser);
router.get("/userprofile", verifyToken, getUserinfo);
router.put("/update-profile", verifyToken, updateUserInfo);
router.post("/request-otp", requestPasswordOtp);
router.post("/reset-password", resetPasswordWithOTP);

export default router;
