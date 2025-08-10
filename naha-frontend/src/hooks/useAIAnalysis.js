import { useQuery } from "@tanstack/react-query";
import api from "../utils/api";

// The fetch function should be clean and simple.
// It doesn't need to worry about authentication headers; the 'api' instance handles that.
const fetchAIAnalysis = async () => {
  // The user ID is not needed here since the backend gets it from the token.
  const response = await api.get("/transactions/analyze");
  return response.data;
};

export const useAIAnalysis = (userId) => {
  return useQuery({
    queryKey: ["aiAnalysis", userId],
    // The query function is now simpler.
    queryFn: fetchAIAnalysis,
    // This rule is still important: only run the query if the user is logged in.
    enabled: !!userId,
  });
};
