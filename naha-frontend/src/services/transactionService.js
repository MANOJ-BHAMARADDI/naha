import api from "../utils/api";

export const getAllTransactions = async () => {
  try {
    const response = await api.get("/transactions");
    return response.data && response.data.transactions
      ? response.data
      : { transactions: [] }; // Ensure transactions field always exists
  } catch (error) {
    console.error("Error fetching transactions:", error.message);
    return { transactions: [] }; // Return empty array to prevent undefined errors
  }
};
