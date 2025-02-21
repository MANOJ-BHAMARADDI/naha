import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // Index for faster lookups
    },
    type: {
      type: String,
      enum: ["deposit", "withdrawal"],
      required: true,
      trim: true, // Prevents accidental spaces
    },
    amount: {
      type: Number,
      required: true,
      min: [1, "Amount must be greater than 0"], // Ensures positive amounts
    },
    status: {
      type: String,
      enum: ["success", "failed", "pending"],
      default: "pending",
      trim: true,
    },
  },
  { timestamps: true }
);

// Add an index for performance optimization
transactionSchema.index({ userId: 1, createdAt: -1 });

const Transaction = mongoose.model("Transaction", transactionSchema);
export default Transaction;
