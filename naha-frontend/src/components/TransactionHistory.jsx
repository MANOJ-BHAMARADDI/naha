import { useEffect, useState } from "react";
import { getAllTransactions } from "../services/transactionService";
import { useAuth } from "../context/AuthContext";

const TransactionHistory = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      const data = await getAllTransactions();
      console.log("Fetched Transactions:", data.transactions); // Debugging log
    
      let filteredTransactions = data.transactions || [];
    
      if (user?.role === "Person1") {
        filteredTransactions = filteredTransactions.filter(
          (tx) => tx.type === "withdrawal" && (tx.status === "success" || tx.status === "failed")
        );
      } else if (user?.role === "Person2") {
        filteredTransactions = filteredTransactions.filter((tx) => tx.userId === user?._id && tx.status !== "failed");
      }
    
      console.log("Filtered Transactions:", filteredTransactions); // Checks if filtering out transactions incorrectly
    
      setTransactions(filteredTransactions);
    };    
    fetchTransactions();
  }, [user]);

  return (
    <div className="w-full max-w-4xl">
      <h3 className="text-xl font-semibold">Transaction History</h3>
      {loading ? (
        <p>Loading transactions...</p>
      ) : transactions.length === 0 ? (
        <p className="text-gray-500">No transactions found.</p>
      ) : (
        <ul className="bg-white shadow-lg rounded-lg p-4 max-h-80 overflow-y-auto">
          {transactions.map((tx, index) => (
            <li
              key={index}
              className={`p-3 border-b flex justify-between ${
                tx.type === "deposit" ? "text-green-500" : "text-red-500"
              }`}
            >
              <span>{tx.type.toUpperCase()}</span>
              <span>₹{tx.amount}</span>
              <span className="text-sm text-gray-500">{new Date(tx.createdAt).toLocaleDateString()}</span>
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
