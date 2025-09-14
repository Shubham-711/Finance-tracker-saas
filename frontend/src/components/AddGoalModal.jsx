import React, { useState } from "react";
import apiClient from "../api/axios";

const AddGoalModal = ({ isOpen, onClose, onGoalAdded }) => {
  const [title, setTitle] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [deadline, setDeadline] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await apiClient.post("/goals", {
        title,
        target_amount: parseFloat(targetAmount),
        deadline,
      });
      onGoalAdded(res.data);
      onClose();
    } catch (err) {
      setError("Failed to add goal. Try again.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Add New Goal</h2>
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Goal Title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-2 border rounded" required />
          <input type="number" placeholder="Target Amount (₹)" value={targetAmount} onChange={(e) => setTargetAmount(e.target.value)} className="w-full p-2 border rounded" required />
          <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} className="w-full p-2 border rounded" required />
          <div className="flex justify-end gap-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Add Goal</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddGoalModal;
