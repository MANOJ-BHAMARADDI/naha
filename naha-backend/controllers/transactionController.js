import Transaction from "../models/Transaction.js";
import Wallet from "../models/Wallet.js";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

/**
 * @desc Analyze transactions and get AI insights
 * @route GET /api/transactions/analyze
 * @access Private
 */
export const analyzeTransactions = async (req, res) => {
  try {
    console.log("🔍 Fetching transactions...");
    const userId = req.user.id;
    console.log("🆔 User ID:", userId);

    const transactions = await Transaction.find({ userId }).sort({ createdAt: -1 });
    console.log("📊 Transactions:", transactions);

    if (!transactions.length) {
      console.log("❌ No transactions found for user:", userId);
      return res.status(404).json({ message: "No transactions found" });
    }

    const transactionText = transactions.map((t) => `${t.type}: ₹${t.amount}`).join("\n");

    console.log("🤖 Sending request to Gemini...");
    const geminiResponse = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: `Analyze this transaction history and provide financial insights in just 5-7 lines:\n${transactionText}`,
              },
            ],
          },
        ],
      },
      { headers: { "Content-Type": "application/json" } }
    );
    console.log("✅ Gemini Response:", geminiResponse.data);

    let analysis =
      geminiResponse.data.candidates?.[0]?.content?.parts?.[0]?.text || "No analysis available";
    analysis = analysis.split("\n").slice(0, 7).join("\n");
    return res.json({ analysis });
  } catch (error) {
    console.error("❌ AI Processing Error:", error.message);
    return res.status(500).json({ message: "Error processing request", error: error.message });
  }
};

/**
 * @desc Get all transactions for the authenticated user with pagination
 * @route GET /api/transactions
 * @access Private
 */
export const getTransactions = async (req, res) => {
  try {
    let filters = {};

    if (req.user.role === "Person1") {
      // Check if the user has a wallet
      const wallet = await Wallet.findOne({ owner: req.user.id });
      if (!wallet) {
        // If no wallet exists, return an empty array
        return res.json({ success: true, transactions: [] });
      }

      // Filter transactions for withdrawals linked to the wallet
      filters.wallet = wallet._id;
      filters.type = "withdrawal";
      filters.status = { $in: ["success", "failed"] };
    } else if (req.user.role === "Person2") {
      // Check if the user is linked to any wallet
      const wallet = await Wallet.findOne({ partner: req.user.id });
      if (!wallet) {
        // If no wallet exists, return an empty array
        return res.json({ success: true, transactions: [] });
      }

      // Filter transactions for the partner's wallet
      filters.wallet = wallet._id;
      filters.status = { $ne: "failed" };
    }

    // Fetch transactions based on the filters
    const transactions = await Transaction.find(filters).sort({ createdAt: -1 });

    res.json({ success: true, transactions });
  } catch (error) {
    console.error("Fetch Transactions Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc Create a new transaction
 * @route POST /api/transactions
 * @access Private
 */
export const createTransaction = async (req, res) => {
  try {
    const { type, amount, status, walletId } = req.body;

    if (!type || !amount || !status || !walletId) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // Ensure the wallet exists and is linked to the user
    const wallet = await Wallet.findById(walletId);
    if (!wallet) {
      return res.status(404).json({ success: false, message: "Wallet not found" });
    }

    const transaction = new Transaction({
      wallet: walletId, // Link transaction to the wallet
      type,
      amount,
      status,
    });

    await transaction.save();
    res.status(201).json({ success: true, transaction });
  } catch (error) {
    console.error("Error creating transaction:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * @desc Get all transactions for the authenticated user
 * @route GET /api/transactions/all
 * @access Private
 */
export const getAllTransactions = async (req, res) => {
  try {
    // Fetch transactions linked to the user's wallet
    const wallet = await Wallet.findOne({
      $or: [{ owner: req.user.id }, { partner: req.user.id }],
    });

    if (!wallet) {
      return res.status(404).json({ message: "No transactions found" });
    }

    const transactions = await Transaction.find({ wallet: wallet._id }).sort({ createdAt: -1 });

    if (!transactions || transactions.length === 0) {
      return res.status(404).json({ message: "No transactions found" });
    }

    res.status(200).json({ success: true, transactions });
  } catch (error) {
    console.error("Transaction Fetch Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

