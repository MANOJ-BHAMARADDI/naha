import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getWalletDetails, createWallet } from "../services/walletService";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [partnerId, setPartnerId] = useState("");

  useEffect(() => {
    const fetchWallet = async () => {
      setLoading(true);
      try {
        const walletData = await getWalletDetails();
        setWallet(walletData);
      } catch (err) {
        console.error("Error fetching wallet:", err);
        setWallet(null);
      } finally {
        setLoading(false);
      }
    };

    fetchWallet();
  }, []);

  const handleCreateWallet = async () => {
    try {
      if (!partnerId) {
        setError("Please enter a Partner ID.");
        return;
      }

      await createWallet(partnerId);
      setShowModal(false);
      setPartnerId("");
      window.location.reload(); // Refresh to show wallet
    } catch (err) {
      console.error("Error creating wallet:", err);
      setError("Failed to create wallet.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-2xl font-bold">Welcome, {user?.name}</h1>
      <h2 className="text-3xl font-bold mb-6">Dashboard</h2>

      {user?.role === "Person2" && (
        <div className="bg-white p-4 rounded-lg shadow-md w-full max-w-md text-center">
          <h3 className="text-lg font-bold">Your Unique Partner ID</h3>
          <p className="text-xl font-bold text-blue-600">{user?.partnerId}</p>
          <button
            className="mt-2 bg-gray-500 text-white p-2 rounded-md"
            onClick={() => navigator.clipboard.writeText(user?.partnerId)}
          >
            Copy ID
          </button>
        </div>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : wallet ? (
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md text-center">
          <h2 className="text-2xl font-bold">Wallet Balance</h2>
          <p className="text-3xl font-bold text-green-500">₹{wallet.balance}</p>
          <button
            className="mt-4 bg-blue-500 text-white p-2 rounded-md"
            onClick={() => navigate("/wallet")}
          >
            View Wallet
          </button>
        </div>
      ) : user.role === "Person1" ? (
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md text-center">
          <p className="text-red-500">No wallet found. Create one to start.</p>
          {error && <p className="text-red-500">{error}</p>}
          <button className="mt-4 bg-green-500 text-white p-2 rounded-md" onClick={() => setShowModal(true)}>
            Create Wallet
          </button>
        </div>
      ) : (
        <p className="text-gray-500">Waiting for wallet creation...( Refresh the page if already created the wallet )</p>
      )}

      {/* Wallet Creation Popup */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-md">
            <h3 className="text-xl font-bold mb-4">Enter Your Partner ID</h3>
            <input
              type="text"
              value={partnerId}
              onChange={(e) => setPartnerId(e.target.value)}
              placeholder="Enter Partner ID"
              className="w-full p-2 border border-gray-300 rounded-md mb-4"
            />
            {error && <p className="text-red-500">{error}</p>}
            <div className="flex justify-center gap-4">
              <button className="bg-green-500 text-white p-2 rounded-md" onClick={handleCreateWallet}>
                Create Wallet
              </button>
              <button className="bg-red-500 text-white p-2 rounded-md" onClick={() => setShowModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
