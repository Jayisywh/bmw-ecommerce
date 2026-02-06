import express from "express";
import {
  getAllPayments,
  getPaymentById,
  updatePayment,
  createPayment,
  deletePayment,
} from "../../controllers/admin/paymentController.js";

const router = express.Router();

router.get("/payments", getAllPayments);
router.get("/payments/:id", getPaymentById);
router.post("/payments", createPayment);
router.put("/payments/:id", updatePayment);
router.delete("/payments/:id", deletePayment);

export default router;
