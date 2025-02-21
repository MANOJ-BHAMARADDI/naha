import Transaction from "../models/Transaction.js";

/**
 * @desc Get all transactions for the authenticated user with pagination
 * @route GET /api/transactions
 * @access Private
 */
export const getTransactions = async (req, res) => {
  try {
    const userId = req.user.id; // Extract user ID from authenticated request
    const { page = 1, limit = 10 } = req.query; // Pagination parameters

    // Convert page and limit to numbers
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    // Fetch transactions with pagination
    const transactions = await Transaction.find({ userId })
      .sort({ createdAt: -1 }) // Sort by most recent transactions
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .lean(); // Optimize query performance

    // Get total transaction count for pagination metadata
    const totalTransactions = await Transaction.countDocuments({ userId });

    res.status(200).json({
      success: true,
      transactions,
      totalPages: Math.ceil(totalTransactions / limitNum),
      currentPage: pageNum,
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ success: false, message: "Server error" });
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
