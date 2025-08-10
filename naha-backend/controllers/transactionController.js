import mongoose from "mongoose";
import Transaction from "../models/Transaction.js";
import Wallet from "../models/Wallet.js"; // Import the Wallet model
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

/**
 * @desc Analyze transactions for the shared wallet and get AI insights
 * @route GET /api/transactions/analyze
 * @access Private
 */
export const analyzeTransactions = async (req, res) => {
  try {
    const loggedInUserId = req.user.id;
    console.log(`🔍 Finding shared wallet for user: ${loggedInUserId}`);

    // Find the wallet associated with the logged-in user (either as owner or partner)
    const wallet = await Wallet.findOne({
      $or: [{ owner: loggedInUserId }, { partner: loggedInUserId }],
    });

    if (!wallet) {
      console.log("❌ No wallet found for this user.");
      return res
        .status(404)
        .json({ message: "No wallet found for this user." });
    }

    // All transactions are created by the partner (Person2), so we use the partner's ID to fetch them.
    const partnerId = wallet.partner;
    console.log(
      `🤖 Fetching all transactions for the wallet's partner: ${partnerId}`
    );

    const transactions = await Transaction.find({ userId: partnerId }).sort({
      createdAt: -1,
    });
    console.log(`📊 Found ${transactions.length} transactions for the wallet.`);

    if (!transactions.length) {
      console.log("❌ No transactions found in this wallet to analyze.");
      return res.json({
        analysis:
          "No transactions have been made yet. Make a deposit to get your first AI analysis!",
      });
    }

    const transactionText = transactions
      .map((t) => `${t.type}: ₹${t.amount}`)
      .join("\n");

    console.log("🤖 Sending request to Gemini...");
    const geminiResponse = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: `Analyze this shared transaction history and provide financial insights and a saving strategy in 3-4 lines:\n${transactionText}`,
              },
            ],
          },
        ],
      },
      { headers: { "Content-Type": "application/json" } }
    );
    console.log("✅ Gemini Response received.");

    let analysis =
      geminiResponse.data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Could not generate analysis at this time.";

    // Also create a strategy from the analysis
    const strategyResponse = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: `Based on this analysis, suggest a simple, one-sentence saving strategy:\n${analysis}`,
              },
            ],
          },
        ],
      },
      { headers: { "Content-Type": "application/json" } }
    );

    let strategy =
      strategyResponse.data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No strategy available.";

    return res.json({ analysis, strategy });
  } catch (error) {
    console.error("❌ AI Processing Error:", error);
    if (error.response) {
      console.error("Gemini API Error Response:", error.response.data);
    }
    return res
      .status(500)
      .json({ message: "Error processing request", error: error.message });
  }
};

// ... (the rest of your controller functions: getTransactions, createTransaction, etc.)

/**
 * @desc Get all transactions for the authenticated user with pagination
 * @route GET /api/transactions
 * @access Private
 */
export const getTransactions = async (req, res) => {
  try {
    let filters = {};
    const userId = req.user.id;
    const userRole = req.user.role;

    if (userRole === "Person1") {
      // Owner should see withdrawal requests from the shared wallet's partner
      const wallet = await Wallet.findOne({ owner: userId });
      if (wallet) {
        filters.userId = wallet.partner;
        filters.type = "withdrawal";
      }
    } else if (userRole === "Person2") {
      // Partner sees their own transactions
      filters.userId = new mongoose.Types.ObjectId(userId);
    }

    const transactions = await Transaction.find(filters).sort({
      createdAt: -1,
    });
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
    const { type, amount, status } = req.body;

    if (!type || !amount || !status) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const transaction = new Transaction({
      userId: req.user.id,
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

export const getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });

    if (!transactions || transactions.length === 0) {
      return res.status(404).json({ message: "No transactions found" });
    }

    res.status(200).json(transactions);
  } catch (error) {
    console.error("Transaction Fetch Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
