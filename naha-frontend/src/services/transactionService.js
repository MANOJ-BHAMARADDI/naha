import api from "../utils/api";
import axios from "axios";


export const getAllTransactions = async () => {
  try {
    const response = await api.get("/transactions");
    return response.data || { transactions: [] }; // Ensure transactions field always exists
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return { transactions: [] }; // Return empty array to prevent undefined errors
  }
};
