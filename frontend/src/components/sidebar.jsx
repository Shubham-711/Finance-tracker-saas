import React from "react";

const Sidebar = ({ onLogout }) => {
  return (
    <div className="h-screen w-64 bg-gray-800 text-white flex flex-col p-6">
      <h1 className="text-xl font-bold mb-6">💰 Finance Tracker</h1>
      <nav className="flex flex-col gap-4">
        <a href="/dashboard" className="hover:text-blue-400">Dashboard</a>
        <a href="/goals" className="hover:text-blue-400">Goals</a>
      </nav>
      <button onClick={onLogout} className="mt-auto bg-red-500 px-4 py-2 rounded hover:bg-red-600">
        Logout
      </button>
    </div>
  );
};

export default Sidebar;
