import express from "express";
import {
  createWallet,
  getWalletDetails,
  depositMoney,
  requestWithdrawal,
  approveWithdrawal,
} from "../controllers/walletController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create", authMiddleware, createWallet);
router.get("/", authMiddleware, getWalletDetails);
router.post("/deposit", authMiddleware, depositMoney);
router.post("/approve-withdrawal", authMiddleware, approveWithdrawal);
router.post("/request-withdrawal", authMiddleware, requestWithdrawal);

export default router;
