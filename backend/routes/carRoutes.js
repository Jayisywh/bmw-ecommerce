import express from "express";
import { addCar, getAllCar, getCarById } from "../controllers/carController.js";

const router = express.Router();

router.get("/cars", getAllCar);
router.get("/car/:id", getCarById);
router.post("/car/addCar", addCar);

export default router;
