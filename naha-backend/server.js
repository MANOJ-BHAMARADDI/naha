import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import walletRoutes from "./routes/walletRoutes.js";
import protectedRoutes from "./routes/protectedRoutes.js";
import cron from "node-cron";
import { calculateInterest } from "./controllers/walletController.js";


// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api/protected-route", protectedRoutes);

// Default route
app.get("/", (req, res) => {
  res.send("NaHa API is running...");
});

// Run on the 1st of every month at midnight
cron.schedule("0 0 1 * *", () => {
  console.log("🔄 Running monthly interest calculation...");
  calculateInterest();
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
