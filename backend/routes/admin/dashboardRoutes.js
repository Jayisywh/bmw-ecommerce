import express from "express";
import { getDashboardSummary } from "../../controllers/admin/dashboardController.js";

const router = express.Router();

router.get("/dashboard", getDashboardSummary);

export default router;
