import React, { useState, useEffect } from "react";
import Sidebar from "../components/sidebar";
import AddTransactionModal from "../components/AddTransactionModal";
import AddGoalModal from "../components/AddGoalModal";
import apiClient from "../api/axios";
import RecentTransactionsTable from '../components/RecentTransactionsTable';

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [goals, setGoals] = useState([]);
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [editingGoal, setEditingGoal] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTransactions();
    fetchGoals();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await apiClient.get("/transactions");
      setTransactions(res.data);
    } catch (err) {
      setError("Failed to fetch transactions.");
    }
  };

  const fetchGoals = async () => {
    try {
      const res = await apiClient.get("/goals");
      setGoals(res.data);
    } catch (err) {
      setError("Failed to fetch goals.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  // DELETE Transaction
  const handleDeleteTransaction = async (id) => {
    try {
      await apiClient.delete(`/transactions/${id}`);
      setTransactions(transactions.filter((tx) => tx.id !== id));
    } catch (err) {
      setError("Failed to delete transaction.");
    }
  };

  // DELETE Goal
  const handleDeleteGoal = async (id) => {
    try {
      await apiClient.delete(`/goals/${id}`);
      setGoals(goals.filter((goal) => goal.id !== id));
    } catch (err) {
      setError("Failed to delete goal.");
    }
  };

  // Prepare for Edit (future)
  const handleEditTransaction = (tx) => {
    setEditingTransaction(tx);
    setIsTxModalOpen(true);
    // Pass editingTransaction to AddTransactionModal for editing (future)
  };

  const handleEditGoal = (goal) => {
    setEditingGoal(goal);
    setIsGoalModalOpen(true);
    // Pass editingGoal to AddGoalModal for editing (future)
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

        {error && <div className="text-red-600 my-2">{error}</div>}

        {/* Transactions */}
        <h2 className="text-lg font-semibold mb-2">Recent Transactions</h2>
        <ul className="space-y-2 mb-6">
          {transactions.map((tx) => (
            <li key={tx.id} className="p-3 border rounded-md flex items-center justify-between">
              <span>
                {tx.date} - <strong>{tx.category}</strong>: ₹{tx.amount} ({tx.description})
              </span>
              <span>
                <button
                  className="px-2 py-1 mr-2 bg-blue-500 text-white rounded"
                  onClick={() => handleEditTransaction(tx)}
                >
                  Edit
                </button>
                <button
                  className="px-2 py-1 bg-red-500 text-white rounded"
                  onClick={() => handleDeleteTransaction(tx.id)}
                >
                  Delete
                </button>
              </span>
            </li>
          ))}
        </ul>

        {/* Goals */}
        <h2 className="text-lg font-semibold mb-2">Goals</h2>
        <ul className="space-y-2">
          {goals.map((goal) => (
            <li key={goal.id} className="p-3 border rounded-md flex items-center justify-between">
              <span>
                🎯 {goal.title} — Target: ₹{goal.target_amount} by {goal.deadline}
              </span>
              <span>
                <button
                  className="px-2 py-1 mr-2 bg-blue-500 text-white rounded"
                  onClick={() => handleEditGoal(goal)}
                >
                  Edit
                </button>
                <button
                  className="px-2 py-1 bg-red-500 text-white rounded"
                  onClick={() => handleDeleteGoal(goal.id)}
                >
                  Delete
                </button>
              </span>
            </li>
          ))}
        </ul>

        <AddTransactionModal
          isOpen={isTxModalOpen}
          onClose={() => {
            setIsTxModalOpen(false);
            setEditingTransaction(null);
          }}
          onTransactionAdded={fetchTransactions}
          editingTransaction={editingTransaction} // For future edit support
        />
        <AddGoalModal
          isOpen={isGoalModalOpen}
          onClose={() => {
            setIsGoalModalOpen(false);
            setEditingGoal(null);
          }}
          onGoalAdded={fetchGoals}
          editingGoal={editingGoal} // For future edit support
        />
      </div>
    </div>
  );
};

export default Dashboard;
