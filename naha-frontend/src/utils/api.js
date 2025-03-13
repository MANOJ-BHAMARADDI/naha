import axios from "axios";

const API_BASE_URL = "https://naha-rmhf.onrender.com/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

export default api;
