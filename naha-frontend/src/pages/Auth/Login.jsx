import { useState } from "react";
import { loginUser, getCurrentUser } from "../../services/authService";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const { setUser } = useAuth(); // auth context
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const data = await loginUser(email, password);
      console.log("Login Successful:", data);

      // Store token and update user state
      localStorage.setItem("token", data.token);

      api.defaults.headers.Authorization = `Bearer ${data.token}`;

      // 🚨 FIX: Fetch the full user and then update the state
      const fullUser = await getCurrentUser();
      setUser(fullUser);

      navigate("/dashboard");
    } catch (error) {
      setError("Invalid email or password.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-gray-700">
          <p className="font-semibold">Sample Login Credentials:</p>
          <p>
            <strong>OWNER LOGIN</strong> - Email:{" "}
            <span className="font-mono">laxmi@gmail.com</span>, Password:{" "}
            <span className="font-mono">laxmi123</span>
          </p>
          <p>
            <strong>PARTNER LOGIN</strong> - Email:{" "}
            <span className="font-mono">deve@gmail.com</span>, Password:{" "}
            <span className="font-mono">deve123</span>
          </p>
        </div>
        <h2 className="text-2xl font-bold text-center text-gray-700">Login</h2>
        {error && <p className="text-red-500 text-center mt-2">{error}</p>}

        <form className="mt-4 space-y-4" onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            Login
          </button>
        </form>

        <p className="mt-4 text-center text-gray-600">
          Don't have an account? or you want to Register both users by your own
          you can{" "}
          <a href="/register" className="text-blue-500 hover:underline">
            Register
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
