import Wallet from "../models/Wallet.js";
import Transaction from "../models/Transaction.js";
import User from "../models/User.js";


export const createWallet = async (req, res) => {
  try {
    const { partnerId } = req.body;
    const ownerId = req.user.id;

    if (!partnerId) {
      return res.status(400).json({ message: "Partner ID is required" });
    }

    // Find Person 2 by their Partner ID
    const partner = await User.findOne({ partnerId });

    if (!partner) {
      return res.status(400).json({ message: "Invalid Partner ID" });
    }

    // Ensure Person 1 is not using their own ID
    if (ownerId === partner._id.toString()) {
      return res.status(400).json({ message: "You cannot use your own ID" });
    }

    const existingWallet = await Wallet.findOne({
      $or: [
        { owner: ownerId, partner: partner._id },
        { owner: partner._id, partner: ownerId },
      ],
    });

    if (existingWallet) {
      return res.status(400).json({ message: "Wallet already exists" });
    }

    const newWallet = await Wallet.create({
      owner: ownerId,
      partner: partner._id,
      balance: 0,
      transactions: [],
    });

    res.status(201).json({ message: "Wallet created successfully", wallet: newWallet });
  } catch (error) {
    console.error("Error creating wallet:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getWalletDetails = async (req, res) => {
  try {
    const wallet = await Wallet.findOne({
      $or: [{ owner: req.user.id }, { partner: req.user.id }],
    }).populate("transactions");

    if (!wallet) {
      return res.status(404).json({ message: "Wallet not found" });
    }

    res.json(wallet);
  } catch (error) {
    console.error("Error fetching wallet:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const depositMoney = async (req, res) => {
  try {
    const { amount } = req.body;
    if (amount <= 0) {
      return res.status(400).json({ message: "Amount must be greater than 0" });
    }

    const wallet = await Wallet.findOne({ partner: req.user.id });
    if (!wallet) {
      return res.status(403).json({ message: "You are not allowed to deposit" });
    }

    wallet.balance += amount;

    const transaction = new Transaction({
      userId: req.user.id,
      type: "deposit",
      amount,
      status: "success",
      wallet: wallet._id,
    });

    await transaction.save();
    wallet.transactions.push(transaction._id);
    await wallet.save();

    res.json({ message: "Deposit successful", balance: wallet.balance });
  } catch (error) {
    console.error("Deposit Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const requestWithdrawal = async (req, res) => {
  try {
    const { amount } = req.body;
    if (amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    const wallet = await Wallet.findOne({ partner: req.user.id });
    if (!wallet) {
      return res.status(403).json({ message: "You are not allowed to withdraw" });
    }

    if (wallet.balance < amount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    const transaction = new Transaction({
      userId: req.user.id,
      type: "withdrawal",
      amount,
      status: "pending",
    });

    await transaction.save();
    wallet.transactions.push(transaction._id);
    await wallet.save();

    res.json({ message: "Withdrawal request sent, awaiting approval" });
  } catch (error) {
    console.error("Withdrawal Request Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const approveWithdrawal = async (req, res) => {
  try {
    const { transactionId, approved } = req.body;

    const transaction = await Transaction.findById(transactionId);
    if (!transaction || transaction.status !== "pending") {
      return res.status(400).json({ message: "Invalid transaction" });
    }

    const wallet = await Wallet.findOne({ owner: req.user.id });
    if (!wallet) {
      return res.status(403).json({ message: "Unauthorized to approve" });
    }

    if (approved) {
      if (wallet.balance < transaction.amount) {
        return res.status(400).json({ message: "Insufficient funds" });
      }
      wallet.balance -= transaction.amount;
      transaction.status = "success";
    } else {
      transaction.status = "failed";
    }

    await transaction.save();
    await wallet.save();

    res.json({ message: `Withdrawal ${approved ? "approved" : "denied"}`, balance: wallet.balance });
  } catch (error) {
    console.error("Approval Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getTransactions = async (req, res) => {
  try {
    let filters = {};

    if (req.user.role === "Person1") {
      filters.type = "withdrawal";
      filters.status = { $in: ["success", "failed"] }; 
    } else {
      filters.userId = req.user.id;
    }
    
    if (req.user.role === "Person2") {
      filters.status = { $ne: "failed" }; // Exclude denied transactions for Person 2
    }
    
    const transactions = await Transaction.find(filters).sort({ createdAt: -1 });
    
    res.json({ success: true, transactions });
  } catch (error) {
    console.error("Fetch Transactions Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Calculate Monthly Interest
export const calculateInterest = async () => {
  try {
    const wallets = await Wallet.find();
    for (let wallet of wallets) {
      const interest = wallet.balance * 0.01; // 1% monthly interest
      wallet.interestEarned += interest;
      wallet.balance += interest;

      await wallet.save();
    }
  } catch (error) {
    console.error("Error calculating interest:", error);
  }
};
