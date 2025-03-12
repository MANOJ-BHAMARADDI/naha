import { useState, useEffect } from "react";
import { getAllTransactions } from "../services/transactionService";
import { useAuth } from "../context/AuthContext";

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

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const data = await getAllTransactions({ startDate, endDate, transactionType, minAmount, maxAmount });

        let filteredTransactions = data.transactions || [];

        if (user?.role === "Person1") {
          filteredTransactions = filteredTransactions.filter(
            (tx) => tx.type === "withdrawal" && (tx.status === "success" || tx.status === "failed")
          );
        } else if (user?.role === "Person2") {
          filteredTransactions = filteredTransactions.filter(
            (tx) => tx.userId === user?._id && tx.status !== "failed"
          );
        }

        setTransactions(filteredTransactions);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [startDate, endDate, transactionType, minAmount, maxAmount, user]);

  return (
    <div className="min-h-screen flex flex-col items-center p-6 bg-gray-100">
      <h2 className="text-2xl font-bold">Transaction History</h2>

      {/* Filters are only for Person 2 */}
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

          <select className="p-2 border rounded-md" value={transactionType} onChange={(e) => setTransactionType(e.target.value)}>
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
          <p className="text-gray-500">No transactions found. ( Refresh the Page )</p>
        ) : (
          <ul className="bg-white shadow-lg rounded-lg p-4 max-h-80 overflow-y-auto">
            {transactions
              .filter(tx => tx.type.toLowerCase().includes(searchTerm.toLowerCase()))
              .map((tx, index) => (
                <li
                  key={index}
                  className={`p-3 border-b flex justify-between ${
                    tx.type.toLowerCase() === "deposit" ? "text-green-500" : "text-red-500"
                  }`}
                >
                  <span> {tx.type.toUpperCase()} </span>
                  <span> ₹{tx.amount}   </span>
                  <span> On {new Date(tx.createdAt).toLocaleDateString()}</span>
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
