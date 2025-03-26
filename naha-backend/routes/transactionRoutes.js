import express from "express";
import { getTransactions, createTransaction, getAllTransactions, analyzeTransactions } from "../controllers/transactionController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createTransaction);
router.get("/", authMiddleware, getTransactions);
router.get("/", authMiddleware, getAllTransactions);
router.get("/analyze", authMiddleware, analyzeTransactions); // 🆕 AI Route

export default router;
