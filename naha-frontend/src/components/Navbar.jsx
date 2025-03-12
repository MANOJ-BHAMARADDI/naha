import { useLocation, useNavigate } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const getRouteName = (path) => {
    switch (path) {
      case "/dashboard":
        return "Dashboard";
      case "/wallet":
        return "Wallet";
      case "/transactions":
        return "Transactions";
      case "/profile":
        return "Profile";
      default:
        return "Welcome";
    }
  };

  return (
    <div className="bg-blue-500 text-white p-4 shadow-md flex justify-between items-center">
      <h1 className="text-2xl font-bold">{getRouteName(location.pathname)}</h1>
      <button
        onClick={() => navigate(-1)}
        className="bg-white text-blue-500 px-4 py-2 rounded-md hover:bg-gray-100"
      >
        Back
      </button>
    </div>
  );
};

export default Navbar;