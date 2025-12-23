import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoute from "./routes/authRoutes.js";
import dbConnect from "./config/db.js";

dotenv.config();
dbConnect();
const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoute);
app.get("/", (req, res) => {
  res.send("BMW Ecommerce'backend is running");
});

const port = 8000;
app.listen(port, "127.0.0.1", () => {
  console.log("server is running at port 8000");
});
