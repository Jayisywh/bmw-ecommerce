import express from "express";
import { checkout } from "../../controllers/client/checkoutController.js";
import verifyToken from "../../middlewares/verifyToken.js";

const checkoutRoute = express.Router();

checkoutRoute.post("/checkout", verifyToken, checkout);

export default checkoutRoute;
