import express from "express";
import { getAllCategories } from "../../controllers/admin/categoryController.js";

const categoryRoutes = express.Router();

categoryRoutes.get("/categories", getAllCategories);

export default categoryRoutes;
