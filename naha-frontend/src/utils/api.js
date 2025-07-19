import axios from "axios";

const API_BASE_URL = "http://localhost:5002/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

export default api;
