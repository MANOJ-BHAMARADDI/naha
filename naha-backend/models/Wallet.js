import mongoose from "mongoose";

const walletSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, 
    partner: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null }, 
    balance: { type: Number, default: 0 },
    transactions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Transaction" }],
    interestEarned: { type: Number, default: 0 }, // Track interest earned over time
  },
  { timestamps: true } // Adds createdAt & updatedAt
);

const Wallet = mongoose.model("Wallet", walletSchema);
export default Wallet;
