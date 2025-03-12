import axios from "axios";

const API_BASE_URL = "https://naha-ifme.onrender.com/api"; // 🔥 Use deployed backend

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

export default api;
