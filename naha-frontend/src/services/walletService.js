import api from "../utils/api";

export const getWalletDetails = async () => {
  const response = await api.get("/wallet");
  return response.data;
};

export const createWallet = async (partnerId) => {
  const response = await api.post("/wallet/create", { partnerId });
  return response.data;
};

export const requestWithdrawal = async (amount) => {
  const response = await api.post("/wallet/request-withdrawal", { amount });
  return response.data;
};

export const approveWithdrawal = async (transactionId, approved) => {
  try {
    const response = await api.post("/wallet/approve-withdrawal", { transactionId, approved });
    return response.data; // Should include the updated balance
  } catch (error) {
    console.error("Approval Error:", error);
    throw error;
  }
};

export const depositMoney = async (amount) => {
  const response = await api.post("/wallet/deposit", { amount }); 
  return response.data;
};