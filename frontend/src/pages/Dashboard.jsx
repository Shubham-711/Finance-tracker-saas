import React, { useState, useEffect } from "react";
import Sidebar from "../components/sidebar";
import AddTransactionModal from "../components/AddTransactionModal";
import AddGoalModal from "../components/AddGoalModal";
import apiClient from "../api/axios";

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [goals, setGoals] = useState([]);
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);

  useEffect(() => {
    fetchTransactions();
    fetchGoals();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await apiClient.get("/transactions");
      setTransactions(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchGoals = async () => {
    try {
      const res = await apiClient.get("/goals");
      setGoals(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="flex">
      <Sidebar onLogout={handleLogout} />
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        <div className="flex gap-4 mb-6">
          <button onClick={() => setIsTxModalOpen(true)} className="px-4 py-2 bg-blue-600 text-white rounded-lg">+ Add Transaction</button>
          <button onClick={() => setIsGoalModalOpen(true)} className="px-4 py-2 bg-green-600 text-white rounded-lg">+ Add Goal</button>
        </div>

        {/* Transactions */}
        <h2 className="text-lg font-semibold mb-2">Recent Transactions</h2>
        <ul className="space-y-2 mb-6">
          {transactions.map((tx) => (
            <li key={tx.id} className="p-3 border rounded-md">
              {tx.date} - <strong>{tx.category}</strong>: ₹{tx.amount} ({tx.description})
            </li>
          ))}
        </ul>

        {/* Goals */}
        <h2 className="text-lg font-semibold mb-2">Goals</h2>
        <ul className="space-y-2">
          {goals.map((goal) => (
            <li key={goal.id} className="p-3 border rounded-md">
              🎯 {goal.title} — Target: ₹{goal.target_amount} by {goal.deadline}
            </li>
          ))}
        </ul>

        <AddTransactionModal isOpen={isTxModalOpen} onClose={() => setIsTxModalOpen(false)} onTransactionAdded={fetchTransactions} />
        <AddGoalModal isOpen={isGoalModalOpen} onClose={() => setIsGoalModalOpen(false)} onGoalAdded={fetchGoals} />
      </div>
    </div>
  );
};

export default Dashboard;
