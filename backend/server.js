import express from 'express';
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
import { connectMongoDB } from './lib/db.js';
import productRoutes from "./routes/product.route.js";
import cartRoutes from "./routes/cart.route.js";
import couponRoutes from "./routes/coupon.route.js";
import cookieParser from "cookie-parser";
import paymentRoutes from "./routes/payment.route.js";
import analyticsRoutes from "./routes/analytics.route.js";

const app = express();
dotenv.config();
const PORT=process.env.PORT;
app.use(cookieParser())
app.use(express.json());

app.use("/api/auth",authRoutes)
app.use("/api/products",productRoutes)
app.use("/api/carts",cartRoutes)
app.use("/api/coupons",couponRoutes)
app.use("/api/payment",paymentRoutes)
app.use("/api/analytics",analyticsRoutes)

app.listen(5000,() => {
  console.log('Server running on port 5000');
  connectMongoDB();
});

