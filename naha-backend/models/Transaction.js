import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  wallet: { type: mongoose.Schema.Types.ObjectId, ref: "Wallet", required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  amount: { type: Number, required: true },
  type: { type: String, enum: ["DEPOSIT", "WITHDRAWAL"], required: true },
  status: { type: String, enum: ["PENDING", "APPROVED"], default: "PENDING" },
  approvals: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
});

export default mongoose.model("Transaction", transactionSchema);
