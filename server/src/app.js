import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import express from "express";
import { connectDB } from "./db/connectDB.js";
import categoryRoutes from "./routes/category.js";
import userRoutes from "./routes/user.js";
import productRoutes from "./routes/product.js";

dotenv.config({
  path: ".env",
});

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

// Configuration
const PORT = process.env.PORT || 3000;

// Routes
app.use("/api/user/", userRoutes);
app.use("/api/category/", categoryRoutes);
app.use("/api/product/", productRoutes);

// Start Server
const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer();
