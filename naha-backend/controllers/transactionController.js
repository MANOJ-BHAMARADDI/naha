import Transaction from "../models/Transaction.js";

/**
 * @desc Get all transactions for the authenticated user with pagination
 * @route GET /api/transactions
 * @access Private
 */
export const getTransactions = async (req, res) => {
  try {
    let filters = {};

    if (req.user.role === "Person1") {
      filters.type = "withdrawal";
      filters.status = { $in: ["success", "failed"] }; 
    } else if (req.user.role === "Person2") {
      filters.userId = req.user.id;
      filters.status = { $ne: "failed" }; 
    }

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
    const { type, amount, status } = req.body;

    if (!type || !amount || !status) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const transaction = new Transaction({
      userId: req.user.id, // Ensure transaction is linked to the authenticated user
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
    const transactions = await Transaction.find({ userId: req.user.id }).sort({ createdAt: -1 });

    if (!transactions || transactions.length === 0) {
      return res.status(404).json({ message: "No transactions found" });
    }

    res.status(200).json(transactions);
  } catch (error) {
    console.error("Transaction Fetch Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};