import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  createWallet,
  depositMoney,
  requestWithdrawal,
  approveWithdrawal,
} from "../controllers/walletController.js";
import { getWalletDetails } from "../controllers/walletController.js";

const router = express.Router();

router.get("/", authMiddleware, getWalletDetails);
router.post("/create", authMiddleware, createWallet);
router.post("/deposit", authMiddleware, depositMoney);
router.post("/withdraw", authMiddleware, requestWithdrawal);
router.post("/approve", authMiddleware, approveWithdrawal);


export default router;
