import { useEffect, useState } from "react";
import { getAllTransactions } from "../services/transactionService";
import { useAuth } from "../context/AuthContext";

const TransactionHistory = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const data = await getAllTransactions();
        console.log("Fetched Transactions:", data.transactions); // Debugging log

        if (!data || !data.transactions || data.transactions.length === 0) {
          // If no transactions are found, set an empty array
          console.log("No transactions found.");
          setTransactions([]);
          return;
        }

        let filteredTransactions = data.transactions;

        if (user?.role === "Person1") {
          // Filter for withdrawal transactions with success or failed status
          filteredTransactions = filteredTransactions.filter(
            (tx) => tx.type === "withdrawal" && (tx.status === "success" || tx.status === "failed")
          );
        } else if (user?.role === "Person2") {
          // Filter for transactions linked to the partner and exclude failed ones
          filteredTransactions = filteredTransactions.filter(
            (tx) => tx.wallet?.partner === user?._id && tx.status !== "failed"
          );
        }

        setTransactions(filteredTransactions);
      } catch (err) {
        console.error("Error fetching transactions:", err);
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [user]);

  return (
    <div className="w-full max-w-4xl">
      <h3 className="text-xl font-semibold">Transaction History</h3>
      {loading ? (
        <p>Loading transactions...</p>
      ) : transactions.length === 0 ? (
        <p className="text-gray-500">
          {user?.role === "Person1"
            ? "No withdrawal transactions found."
            : "No transactions found. Waiting for wallet activity."}
        </p>
      ) : (
        <ul
          className="bg-white shadow-lg rounded-lg p-4 max-h-80 overflow-y-auto"
          style={{ scrollbarWidth: "thin", overflowY: "scroll" }} // Ensure scrolling
        >
          {transactions.map((tx, index) => (
            <li
              key={index}
              className={`p-3 border-b flex justify-between ${
                tx.type === "deposit" ? "text-green-500" : "text-red-500"
              }`}
            >
              <span>{tx.type?.toUpperCase() || "UNKNOWN"}</span>
              <span>₹{tx.amount || "0.00"}</span>
              <span className="text-sm text-gray-500">
                {tx.createdAt ? new Date(tx.createdAt).toLocaleDateString() : "N/A"}
              </span>
              {user?.role === "Person1" && (
                <span>{tx.status === "success" ? "✅ Approved" : "❌ Denied"}</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TransactionHistory;