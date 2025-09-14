import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="bg-blue-600 text-white px-6 py-4 shadow-md flex justify-between items-center">
      <h1 className="text-xl font-bold">💰 Expense Tracker</h1>

      <nav className="flex gap-6">
        <Link to="/dashboard" className="hover:text-gray-200">Dashboard</Link>
        <Link to="/transactions" className="hover:text-gray-200">Transactions</Link>
        <Link to="/goals" className="hover:text-gray-200">Goals</Link>
      </nav>
    </header>
  );
};

export default Header;
