import { useQuery } from "@tanstack/react-query";
import api from "../utils/api";

const fetchAIAnalysis = async (userId) => {
  const response = await api.get(`/transactions/analyze`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
  });
  return response.data;
};

export const useAIAnalysis = (userId) => {
  return useQuery({
    queryKey: ["aiAnalysis", userId],
    queryFn: () => fetchAIAnalysis(userId), // Pass userId to the function
    enabled: !!userId, // Only fetch when userId is available
  });
};
