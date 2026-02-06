import express from "express";
import {
  createCar,
  deleteCar,
  updateCar,
  getAllCars,
} from "../../controllers/admin/carController.js";
import {
  getOptionsByCarId,
  saveCarOptions,
} from "../../controllers/admin/carOptionController.js";

const carRoutes = express.Router();
carRoutes.get("/cars", getAllCars);
carRoutes.post("/cars", createCar);
carRoutes.put("/cars/:id", updateCar);
carRoutes.delete("/cars/:id", deleteCar);

carRoutes.post("/car-options", saveCarOptions);
carRoutes.get("/car-options/:id", getOptionsByCarId);

export default carRoutes;
