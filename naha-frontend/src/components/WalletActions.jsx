import { depositMoney, requestWithdrawal, approveWithdrawal } from "../services/walletService";

const WalletActions = ({ user, wallet }) => {
  const handleDeposit = async () => {
    const amount = prompt("Enter deposit amount:");
    if (amount) {
      await depositMoney(parseFloat(amount));
      alert("Deposit successful!");
      window.location.reload();
    }
  };

  const handleWithdraw = async () => {
    const amount = prompt("Enter withdrawal amount:");
    if (amount) {
      await requestWithdrawal(parseFloat(amount));
      alert("Withdrawal request sent!");
      window.location.reload();
    }
  };

  const handleApproveWithdrawal = async () => {
    const transactionId = prompt("Enter Transaction ID to approve:");
    if (transactionId) {
      await approveWithdrawal(transactionId, true);
      alert("Withdrawal approved!");
      window.location.reload();
    }
  };

  return (
    <div className="mt-6 w-full max-w-4xl flex flex-wrap gap-4 justify-center">
      {user.role === "Person2" && (
        <>
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg" onClick={handleDeposit}>
            Deposit
          </button>
          <button className="px-4 py-2 bg-red-500 text-white rounded-lg" onClick={handleWithdraw}>
            Request Withdrawal
          </button>
        </>
      )}

      {user.role === "Person1" && (
        <button className="px-4 py-2 bg-green-500 text-white rounded-lg" onClick={handleApproveWithdrawal}>
          Approve Withdrawal
        </button>
      )}
    </div>
  );
};

export default WalletActions;
