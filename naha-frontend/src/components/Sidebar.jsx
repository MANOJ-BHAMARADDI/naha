import { useState } from "react";
import { LogOut, CreditCard, User, Wallet, Menu, X, Home } from "lucide-react";
import { Link } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

export default function Sidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false); 

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/"; 
  };

  return (
    <div>
      {/* Mobile Sidebar Toggle Button */}
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="absolute top-4 left-4 md:hidden bg-gray-200 dark:bg-gray-700 p-2 rounded-full"
        >
          <Menu className="w-6 h-6 text-gray-800 dark:text-white" />
        </button>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:relative top-0 left-0 h-full w-64 bg-gray-100 dark:bg-gray-900 p-4 space-y-6 shadow-lg transition-transform transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        {/* Sidebar Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-yellow-600 dark:text-white">NaHa</h1>
          {sidebarOpen && (
            <button onClick={() => setSidebarOpen(false)} className="md:hidden">
              <X className="w-6 h-6 text-gray-700 dark:text-white" />
            </button>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="space-y-4">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-md"
            onClick={() => setSidebarOpen(false)}
          >
            <Home className="w-6 h-6" /> Dashboard
          </Link>
          <Link
            to="/transactions"
            className="flex items-center gap-2 p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-md"
            onClick={() => setSidebarOpen(false)}
          >
            <CreditCard className="w-6 h-6" /> Transactions
          </Link>
          <Link
            to="/wallet"
            className="flex items-center gap-2 p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-md"
            onClick={() => setSidebarOpen(false)}
          >
            <Wallet className="w-6 h-6" /> Wallet
          </Link>
          <Link
            to="/profile"
            className="flex items-center gap-2 p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-md"
            onClick={() => setSidebarOpen(false)}
          >
            <User className="w-6 h-6" /> Profile
          </Link>
        </nav>

        {/* Logout */}
        <div className="absolute bottom-4 left-4">
          <Link
            onClick={logout}
            to="/logout"
            className="flex items-center gap-2 text-red-500 hover:text-red-700 dark:hover:text-red-400"
          >
            <LogOut className="w-6 h-6" /> Logout
          </Link>
        </div>

        {/* Dark Mode Toggle */}
        <div className="absolute bottom-4 right-4">
          <ThemeToggle />
        </div>
      </aside>
    </div>
  );
}