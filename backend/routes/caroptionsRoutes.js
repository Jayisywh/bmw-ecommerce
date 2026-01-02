import express from "express";
import { getCarOptionsById } from "../controllers/carOptionController.js";

const caroptionsRouter = express.Router();

caroptionsRouter.get("/:carId", getCarOptionsById);
export default caroptionsRouter;
