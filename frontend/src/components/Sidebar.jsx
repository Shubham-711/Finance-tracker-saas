import React from "react";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white shadow-md p-6 flex flex-col gap-4">
      <h1 className="text-xl font-bold">Finance Tracker</h1>
      <nav className="flex flex-col gap-2">
        <a href="/" className="text-gray-700 hover:text-blue-600">Dashboard</a>
        <a href="/transactions" className="text-gray-700 hover:text-blue-600">Transactions</a>
        <a href="/goals" className="text-gray-700 hover:text-blue-600">Goals</a>
      </nav>
    </aside>
  );
}
