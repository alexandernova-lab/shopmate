import dotenv from "dotenv";
import express from "express";
import { connectDB } from "./db/connectDB.js";

dotenv.config({
  path: ".env",
});

const app = express();

// Middleware
app.use(express.json());

// Configuration
const PORT = process.env.PORT || 3000;

// Start Server
const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer();
