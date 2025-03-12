import api from "../utils/api";

export const loginUser = async (email, password) => {
  const response = await api.post("/auth/login", { email, password });
  localStorage.setItem("token", response.data.token);
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};

export const registerUser = async (email, password) => {
  const response = await api.post("/auth/register", { email, password });
  localStorage.setItem("token", response.data.token);
  return response.data;
};
