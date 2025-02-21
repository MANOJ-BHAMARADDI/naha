import Wallet from "../models/Wallet.js";
import Transaction from "../models/Transaction.js";

export const getWalletDetails = async (req, res) => {
  try {
    const userId = req.user; // Extracted from JWT token via authMiddleware
    
    // Find the wallet for the logged-in user
    const wallet = await Wallet.findOne({ user: userId });

    if (!wallet) {
      return res.status(404).json({ message: "Wallet not found" });
    }

    res.json(wallet); // Return wallet details
  } catch (error) {
    console.error("Error fetching wallet details:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Create Wallet (Only Person 1 can create it)
export const createWallet = async (req, res) => {
  try {
    const { partnerId } = req.body;

    const wallet = new Wallet({
      owner: req.user,
      partner: partnerId,
      balance: 0,
    });

    await wallet.save();
    res.status(201).json({ message: "Wallet created successfully", wallet });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Deposit Money
export const depositMoney = async (req, res) => {
  try {
    const { amount } = req.body;
    const wallet = await Wallet.findOne({ owner: req.user });

    if (!wallet) return res.status(404).json({ message: "Wallet not found" });

    wallet.balance += amount;
    await wallet.save();

    const transaction = new Transaction({
      wallet: wallet._id,
      sender: req.user,
      amount,
      type: "DEPOSIT",
      status: "APPROVED",
    });

    await transaction.save();
    res.status(200).json({ message: "Deposit successful", balance: wallet.balance });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Request Withdrawal (Requires Approval)
export const requestWithdrawal = async (req, res) => {
  try {
    const { amount } = req.body;
    const wallet = await Wallet.findOne({
      $or: [{ owner: req.user }, { partner: req.user }],
    });

    if (!wallet) return res.status(404).json({ message: "Wallet not found" });

    if (amount > wallet.balance) return res.status(400).json({ message: "Insufficient balance" });

    const transaction = new Transaction({
      wallet: wallet._id,
      sender: req.user,
      amount,
      type: "WITHDRAWAL",
      status: "PENDING",
      approvals: [],
    });

    await transaction.save();
    res.status(200).json({ message: "Withdrawal request sent, awaiting approval" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Approve Withdrawal
export const approveWithdrawal = async (req, res) => {
  try {
    const { transactionId } = req.body;
    const transaction = await Transaction.findById(transactionId);

    if (!transaction) return res.status(404).json({ message: "Transaction not found" });
    if (transaction.status !== "PENDING") return res.status(400).json({ message: "Already processed" });

    const wallet = await Wallet.findById(transaction.wallet);
    if (![wallet.owner.toString(), wallet.partner.toString()].includes(req.user)) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Add approval
    if (!transaction.approvals.includes(req.user)) {
      transaction.approvals.push(req.user);
    }

    // Require two approvals: One from Person1 and another from NaHa
    if (transaction.approvals.length < 2) {
      await transaction.save();
      return res.status(200).json({ message: "Waiting for final approval" });
    }

    // Process withdrawal after both approvals
    wallet.balance -= transaction.amount;
    await wallet.save();

    transaction.status = "APPROVED";
    await transaction.save();
    res.status(200).json({ message: "Withdrawal approved" });
  } catch (error) {
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
