import { useState, useEffect } from "react"; 
import { getWalletDetails, depositMoney, requestWithdrawal, approveWithdrawal } from "../services/walletService";
import { useAuth } from "../context/AuthContext";
import { useAIAnalysis } from "../hooks/useAIAnalysis"; // 🔹 Import AI Analysis Hook

const Wallet = () => {
  const { user } = useAuth();
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [transactions, setTransactions] = useState([]); // Store transactions

  const { data, isLoading } = useAIAnalysis(user?._id); // 🔹 Fetch AI financial insights

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const data = await getWalletDetails();
        setWallet(data);
        setTransactions(data?.transactions || []);
      } catch (error) {
        console.error("Error fetching wallet:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWallet();
  }, []);

  const openModal = (type) => {
    setModalType(type);
    setAmount("");
    setShowModal(true);
  };

  const handleSubmit = async () => {
    if (!amount || isNaN(amount) || amount <= 0) {
      setMessage("Please enter a valid amount");
      return;
    }

    try {
      if (modalType === "deposit") {
        await depositMoney(parseFloat(amount));
        setMessage("Deposit successful!");
        setWallet((prev) => ({ ...prev, balance: prev.balance + parseFloat(amount) }));
      } else if (modalType === "withdraw") {
        await requestWithdrawal(parseFloat(amount));
        setMessage("Withdrawal request sent!");
      }

      setTimeout(() => {
        setShowModal(false);
      }, 1000);
    } catch (error) {
      console.error("Transaction error:", error);
      setMessage("Transaction failed!");
    }
  };

  // Approval/Deny & Update Balance Instantly
  const handleApproval = async (transactionId, approved, amount) => {
    if (user?.role !== "Person1") return; 

    try {
      await approveWithdrawal(transactionId, approved);

      // Update transactions list
      setTransactions((prevTransactions) =>
        prevTransactions.map((tx) =>
          tx._id === transactionId ? { ...tx, status: approved ? "success" : "failed" } : tx
        )
      );

      // Instantly update wallet balance when approved
      if (approved) {
        setWallet((prevWallet) => ({
          ...prevWallet,
          balance: prevWallet.balance - amount,
        }));
      }
    } catch (error) {
      console.error("Error approving withdrawal:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      {loading ? (
        <p>Loading...</p>
      ) : wallet ? (
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md text-center">
          <h1 className="text-2xl font-bold">Welcome, {user?.name}</h1>
          <h2 className="text-2xl font-bold">Wallet Balance</h2>
          <p className="text-3xl font-bold text-green-500">₹{wallet.balance}</p>

          <div className="mt-4">
            {user.role === "Person2" && (
              <>
                <button onClick={() => openModal("deposit")} className="bg-blue-500 text-white p-2 rounded-md mr-2">
                  Deposit
                </button>
                <button onClick={() => openModal("withdraw")} className="bg-red-500 text-white p-2 rounded-md">
                  Request Withdrawal
                </button>
              </>
            )}
          </div>

          {/* 🔹 AI Financial Strategy Section */}
          <div className="mt-6 w-full bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-bold">📈 AI Financial Strategy</h3>
            {isLoading ? <p>Loading suggestions...</p> : <p>{data?.strategy}</p>}
          </div>

          {/* Pending Withdrawal Requests for Person 1 */}
          {user.role === "Person1" && (
            <div className="mt-6">
              <h3 className="text-xl font-semibold">
                Withdrawal Requests ({transactions.filter((tx) => tx.status === "pending").length})
              </h3>
              {transactions.filter((tx) => tx.status === "pending").length === 0 ? (
                <p className="text-gray-500">No pending withdrawals.</p>
              ) : (
                <ul className="bg-gray-100 p-3 rounded-md mt-2">
                  {transactions
                    .filter((tx) => tx.status === "pending")
                    .map((tx) => (
                      <li key={tx._id} className="flex justify-between items-center border-b p-2">
                        <span>₹{tx.amount}</span>
                        <div>
                          <button
                            onClick={() => handleApproval(tx._id, true, tx.amount)}
                            className="bg-green-500 text-white px-2 py-1 rounded-md mr-2"
                          >
                            ✅ Approve
                          </button>
                          <button
                            onClick={() => handleApproval(tx._id, false, tx.amount)}
                            className="bg-red-500 text-white px-2 py-1 rounded-md"
                          >
                            ❌ Deny
                          </button>
                        </div>
                      </li>
                    ))}
                </ul>
              )}
            </div>
          )}
        </div>
      ) : (
        <p>No wallet found ( Refresh the Page )</p>
      )}

      {/* Modal Popup */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h3 className="text-lg font-bold">
              {modalType === "deposit" ? "Deposit Money" : "Request Withdrawal"}
            </h3>
            <input
              type="number"
              className="border p-2 mt-4 w-full"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            {message && <p className="text-sm text-red-500 mt-2">{message}</p>}
            <button className="mt-4 bg-blue-500 text-white p-2 rounded-md" onClick={handleSubmit}>
              Submit
            </button>
            <button className="mt-4 bg-gray-500 text-white p-2 rounded-md" onClick={() => setShowModal(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Wallet;
