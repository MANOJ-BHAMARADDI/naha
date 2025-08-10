import express from "express";
import {
  getTransactions,
  createTransaction,
  analyzeTransactions,
} from "../controllers/transactionController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// --- CORRECTED ROUTE ORDER ---

// 1. Define the specific '/analyze' route FIRST.
// This ensures that requests to '/api/transactions/analyze' are handled correctly.
router.get("/analyze", authMiddleware, analyzeTransactions);

// 2. Define the general '/' route for fetching all transactions AFTER.
// Note: The duplicate route for getAllTransactions has been removed as it was redundant.
router.get("/", authMiddleware, getTransactions);

// The POST route can be placed anywhere as it uses a different HTTP method.
router.post("/", authMiddleware, createTransaction);

export default router;
