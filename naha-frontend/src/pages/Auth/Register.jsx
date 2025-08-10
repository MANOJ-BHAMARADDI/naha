import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import { registerUser } from "../../services/authService";

const Register = () => {
  const { setUser } = useAuth(); // Updates AuthContext after registration
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "Person1", // Default role
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/register", formData);
      if (res.data.token) {
        localStorage.setItem("token", res.data.token); // Store token correctly
      } else {
        console.error("Token not received from backend");
      }      
      setUser(res.data.user); // Updates AuthContext
      navigate("/dashboard"); 
    } catch (error) {
      console.error("Registration failed:", error.response.data);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center">Register</h2>
        <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} className="w-full p-2 border rounded mt-4"/>
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="w-full p-2 border rounded mt-2"/>
        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} className="w-full p-2 border rounded mt-2"/>
        <select name="role" value={formData.role} onChange={handleChange} className="w-full p-2 border rounded mt-2">
          <option value="Person1">Wallet owner </option>
          <option value="Person2">Wallet Partner </option>
        </select>
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded mt-4">Register</button>
        <p className="text-center mt-4">Already have an account? please <a href="/login" className="text-blue-500">Login</a></p>
      </form>
    </div>
  );
};

export default Register;
