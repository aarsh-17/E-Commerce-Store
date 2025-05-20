import express from 'express';
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
import { connectMongoDB } from './lib/db.js';

const app = express();
dotenv.config();
const PORT=process.env.PORT;
app.use(express.json());

app.use("/api/auth",authRoutes)
app.listen(5000,() => {
  console.log('Server running on port 5000');
  connectMongoDB();
});

