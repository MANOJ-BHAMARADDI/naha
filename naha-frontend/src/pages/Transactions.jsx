import { useState, useEffect } from "react";
import { getAllTransactions } from "../services/transactionService";
import { useAuth } from "../context/AuthContext";
import { useAIAnalysis } from "../hooks/useAIAnalysis";

const Transactions = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [transactionType, setTransactionType] = useState("all");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [loading, setLoading] = useState(true);

  const { data: aiInsights, isLoading: aiLoading } = useAIAnalysis(user?._id);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        // This service now calls the backend route that correctly filters by role
        const data = await getAllTransactions();

        // No need for client-side role filtering anymore. The backend handles it.
        let filteredTransactions = data.transactions || [];

        // You can keep the UI filters for Person2
        if (user?.role === "Person2") {
          if (transactionType !== "all") {
            filteredTransactions = filteredTransactions.filter(
              (tx) => tx.type === transactionType
            );
          }
          // ... (keep the rest of the date and amount filters)
        }

        setTransactions(filteredTransactions);
      } catch (error) {
        console.error("Error fetching transactions:", error);
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      // Ensure user is loaded before fetching
      fetchTransactions();
    }
  }, [
    startDate,
    endDate,
    transactionType,
    minAmount,
    maxAmount,
    searchTerm,
    user,
  ]);

  return (
    <div className="min-h-screen flex flex-col items-center p-6 bg-gray-100">
      <h2 className="text-2xl font-bold">Transaction History</h2>

      {/* AI Spending Insights */}
      <div className="mt-4 w-full max-w-2xl bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-bold">💡 AI Spending Insights</h3>
        {aiLoading ? (
          <p>Analyzing spending patterns...</p>
        ) : aiInsights?.analysis ? (
          <p>{aiInsights.analysis}</p>
        ) : (
          <p className="text-gray-500">No insights available at the moment.</p>
        )}
      </div>

      {/* Filters for Person2 */}
      {user?.role === "Person2" && (
        <div className="flex flex-wrap gap-4 mt-4 w-full max-w-2xl">
          <input
            type="text"
            placeholder="Search..."
            className="p-2 border rounded-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <input
            type="date"
            className="p-2 border rounded-md"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <input
            type="date"
            className="p-2 border rounded-md"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />

          <select
            className="p-2 border rounded-md"
            value={transactionType}
            onChange={(e) => setTransactionType(e.target.value)}
          >
            <option value="all">All</option>
            <option value="deposit">Deposit</option>
            <option value="withdrawal">Withdrawal</option>
          </select>

          <input
            type="number"
            placeholder="Min Amount"
            className="p-2 border rounded-md"
            value={minAmount}
            onChange={(e) => setMinAmount(e.target.value)}
          />
          <input
            type="number"
            placeholder="Max Amount"
            className="p-2 border rounded-md"
            value={maxAmount}
            onChange={(e) => setMaxAmount(e.target.value)}
          />
        </div>
      )}

      {/* Transaction List */}
      <div className="mt-6 w-full max-w-2xl">
        {loading ? (
          <p>Loading...</p>
        ) : transactions.length === 0 ? (
          <p className="text-gray-500">
            {user?.role === "Person1"
              ? "No withdrawal transactions found."
              : "No transactions found. Waiting for wallet activity."}
          </p>
        ) : (
          <ul className="bg-white shadow-lg rounded-lg p-4 max-h-80 overflow-y-auto">
            {transactions.map((tx, index) => (
              <li
                key={index}
                className={`p-3 border-b flex justify-between ${
                  tx.type.toLowerCase() === "deposit" ? "text-green-500" : "text-red-500"
                }`}
              >
                <span>{tx.type?.toUpperCase() || "UNKNOWN"}</span>
                <span>₹{tx.amount || "0.00"}</span>
                {user?.role === "Person1" && (
                  <span>{tx.status === "success" ? "✅ Approved" : "❌ Denied"}</span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Transactions;
