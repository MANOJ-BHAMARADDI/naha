import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import walletRoutes from "./routes/walletRoutes.js";
import protectedRoutes from "./routes/protectedRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import cron from "node-cron";
import { calculateInterest } from "./controllers/walletController.js";
import mongoose from "mongoose"; 

dotenv.config();

connectDB();

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(cors({ origin: "https://naha-frontend.vercel.app", credentials: true }));


app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api/protected-route", protectedRoutes);
app.use("/api/wallets", walletRoutes);
app.use("/api/transactions", transactionRoutes);

// Default route
app.get("/", (req, res) => {
  res.send("NaHa API is running...");
});

// Run on the 1st of every month at midnight
cron.schedule("0 0 1 * *", () => {
  console.log("🔄 Running monthly interest calculation...");
  calculateInterest();
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Global Error:", err.message);
  res.status(500).json({ message: "Server Error" });
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () =>
  console.log(`✅ Server running on port ${PORT}`)
);

process.on("SIGINT", async () => {
  console.log("🛑 Server shutting down...");
  await mongoose.connection.close();
  process.exit(0);
});
