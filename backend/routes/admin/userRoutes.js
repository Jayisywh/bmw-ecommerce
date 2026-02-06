import express from "express";
import {
  createUser,
  deleteUser,
  getAllUser,
  updateUser,
} from "../../controllers/admin/userController.js";

const userRoutes = express.Router();

userRoutes.get("/users", getAllUser);
userRoutes.post("/users", createUser);
userRoutes.put("/users/:id", updateUser);
userRoutes.delete("/users/:id", deleteUser);

export default userRoutes;
