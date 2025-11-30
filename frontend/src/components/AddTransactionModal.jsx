import React, { useState } from 'react';
import apiClient from '../api/axios';

const AddTransactionModal = ({ isOpen, onClose, onTransactionAdded }) => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [isExpense, setIsExpense] = useState(true);
  const [error, setError] = useState('');

  // 🔹 Predefined categories
  const expenseCategories = [
    "Food", "Transport", "Shopping", "Bills", "Entertainment", "Healthcare", "Rent", "Other"
  ];
  const incomeCategories = [
    "Salary", "Freelance", "Investments", "Bonus", "Gifts", "Other"
  ];

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const finalAmount = Math.abs(parseFloat(amount));

    try {
      const response = await apiClient.post('/transactions', {
        date,
        category: category.trim().toLowerCase(), // ✅ Always lowercase for backend consistency
        amount: finalAmount,
        description,
        transaction_type: isExpense ? "expense" : "income"
      });
      onTransactionAdded(response.data);
      window.dispatchEvent(new Event("refreshSummary"));
      onClose();
    } catch (err) {
      setError('Failed to add transaction. Please try again.');
      console.error(err);
    }
  };

  const categories = isExpense ? expenseCategories : incomeCategories;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Add New Transaction</h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Transaction Type */}
          <div className="flex gap-4 mb-4">
            <button
              type="button"
              onClick={() => {
                setIsExpense(true);
                setCategory('');
              }}
              className={`flex-1 py-2 rounded-lg ${isExpense ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
            >
              Expense
            </button>
            <button
              type="button"
              onClick={() => {
                setIsExpense(false);
                setCategory('');
              }}
              className={`flex-1 py-2 rounded-lg ${!isExpense ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
            >
              Income
            </button>
          </div>

          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            className="w-full p-2 border rounded-md"
            required
          />

          {/* Category Dropdown */}
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="w-full p-2 border rounded-md"
            required
          >
            <option value="">Select {isExpense ? "Expense" : "Income"} Category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Amount (₹)"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            className="w-full p-2 border rounded-md"
            required
          />

          <input
            type="text"
            placeholder="Description (optional)"
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="w-full p-2 border rounded-md"
          />

          <div className="flex justify-end space-x-4 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add Transaction
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTransactionModal;
