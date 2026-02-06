import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoute from "./routes/client/authRoutes.js";
import carRoute from "./routes/client/carRoutes.js";
import wishlistRoute from "./routes/client/wishlistRoutes.js";
import cartRoute from "./routes/client/cartRoutes.js";
import dbConnect from "./config/db.js";
import caroptionsRoute from "./routes/client/caroptionsRoutes.js";
import checkoutRoute from "./routes/client/checkoutRoutes.js";
import userRoutes from "./routes/admin/userRoutes.js";
import carRoutes from "./routes/admin/carRoutes.js";
import orderRoutes from "./routes/admin/orderRoutes.js";
import paymentRoutes from "./routes/admin/paymentRoutes.js";
import dashboardRoutes from "./routes/admin/dashboardRoutes.js";
import categoryRoutes from "./routes/admin/categoryRoutes.js";
import reviewRoutes from "./routes/client/reviewRoutes.js";
import readReviewRoute from "./routes/admin/reviewRoute.js";

dotenv.config();
dbConnect();
const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoute);
app.use("/api/browse", carRoute);
app.use("/api/wishlist", wishlistRoute);
app.use("/api/cart", cartRoute);
app.use("/api/carOptions", caroptionsRoute);
app.use("/api/orders", checkoutRoute);

app.use("/api/admin", userRoutes);
app.use("/api/admin", carRoutes);
app.use("/api/admin", orderRoutes);
app.use("/api/admin", paymentRoutes);
app.use("/api/admin", dashboardRoutes);
app.use("/api/admin", categoryRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/reviews", readReviewRoute);
app.get("/", (req, res) => {
  res.send("BMW Ecommerce'backend is running");
});

const port = 8000;
app.listen(port, "127.0.0.1", () => {
  console.log("server is running at port 8000");
});
