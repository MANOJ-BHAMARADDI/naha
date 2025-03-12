import Hero from "../components/Hero";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen bg-white text-black">
      
      {/* 🔹 Header Section */}
      <header className="flex justify-between items-center p-6 bg-blue-500 text-white sticky top-0 z-50">
        <h1 className="text-3xl font-bold">NaHa</h1>
        <div className="flex gap-4">
          <Link to="/register" className="px-4 py-2 bg-white text-blue-500 rounded-lg font-semibold hover:bg-gray-200">
            Register
          </Link>
          <Link to="/login" className="px-4 py-2 bg-white text-blue-500 rounded-lg font-semibold hover:bg-gray-200">
            Sign In
          </Link>
        </div>
      </header>
      <Hero />
    </div>
  );
};

export default Home;
