import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    wallet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Wallet",
      required: true, // Every transaction must be linked to a wallet
    },
    type: {
      type: String,
      enum: ["deposit", "withdrawal"], // Transaction types
      required: true,
      trim: true, // Prevents accidental spaces
    },
    amount: {
      type: Number,
      required: true,
      min: [1, "Amount must be greater than 0"], // Validation for positive amounts
    },
    status: {
      type: String,
      enum: ["success", "failed", "pending", "approved"], // Transaction statuses
      default: "pending",
      trim: true,
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

// Add an index for performance optimization
transactionSchema.index({ wallet: 1, createdAt: -1 }); // Index transactions by wallet and creation date

const Transaction = mongoose.model("Transaction", transactionSchema);
export default Transaction;
