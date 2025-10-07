import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/"); // Navigate back to the login page
  };

  return (
    <div className="h-screen w-64 bg-gray-800 text-white flex flex-col p-6">
      <h1 className="text-xl font-bold mb-6">💰 Finance Tracker</h1>
      <nav className="flex flex-col gap-4">
        {/* Use <Link> for instant navigation without page reloads */}
        <Link to="/dashboard" className="hover:text-blue-400">Dashboard</Link>
        <Link to="/transactions" className="hover:text-blue-400">Transactions</Link>
        <Link to="/goals" className="hover:text-blue-400">Goals</Link>
        <Link to="/reports" className="hover:text-blue-400">Reports</Link>
      </nav>
      <button onClick={handleLogout} className="mt-auto bg-red-500 px-4 py-2 rounded hover:bg-red-600">
        Logout
      </button>
    </div>
  );
};

export default Sidebar;