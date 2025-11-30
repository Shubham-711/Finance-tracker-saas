import React, { useState, useEffect } from "react";
import apiClient from "../api/axios";
import GoalCard from '../components/GoalCard';
import PageWrapper from "../components/PageWrapper";
import Card from "../components/ui/Card";

const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [name, setName] = useState(""); // Changed from 'title' to 'name'
  const [targetAmount, setTargetAmount] = useState("");
  const [currentAmount, setCurrentAmount] = useState("0"); // State for current amount
  const [deadline, setDeadline] = useState(""); // State for deadline
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const response = await apiClient.get("/goals");
        setGoals(response.data);
      } catch (err) {
        console.error("Failed to fetch goals:", err);
      }
    };
    fetchGoals();
  }, []);

  const handleAddGoal = async (e) => {
    e.preventDefault();
    setError("");

    if (!name || !targetAmount || !deadline) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      const response = await apiClient.post("/goals", {
        name, // Use 'name' to match the backend
        target_amount: parseFloat(targetAmount),
        current_amount: parseFloat(currentAmount),
        deadline,
      });
      setGoals((prev) => [response.data, ...prev]);
      // Reset form fields
      setName("");
      setTargetAmount("");
      setCurrentAmount("0");
      setDeadline("");
    } catch (err) {
      console.error(err);
      setError("Failed to add goal. Try again.");
    }
  };

  return (
    <PageWrapper>
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Financial Goals</h1>

      {/* Add Goal Form */}
      <form
        onSubmit={handleAddGoal}
        className="bg-white shadow-md rounded-lg p-4 mb-6 flex flex-wrap gap-4 items-center"
      >
        <input
          type="text"
          placeholder="Goal Name (e.g., New Car)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-grow p-2 border rounded-md"
          required
        />
        <input
          type="number"
          placeholder="Target Amount (₹)"
          value={targetAmount}
          onChange={(e) => setTargetAmount(e.target.value)}
          className="w-full sm:w-40 p-2 border rounded-md"
          required
        />
        <input
          type="number"
          placeholder="Current Amount (₹)"
          value={currentAmount}
          onChange={(e) => setCurrentAmount(e.target.value)}
          className="w-full sm:w-40 p-2 border rounded-md"
          required
        />
        <input
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          className="w-full sm:w-40 p-2 border rounded-md"
          required
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Add Goal
        </button>
      </form>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Goals List */}
      <div className="grid gap-4">
        {goals.length > 0 ? (
          goals.map((goal) => {
            // Use snake_case to match the API response
            const target = Number(goal.target_amount) || 0;
            const current = Number(goal.current_amount) || 0;
            const progress = target > 0 ? (current / target) * 100 : 0;

            return (
              <div
                key={goal.id}
                className="bg-white p-4 rounded-lg shadow-md"
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold">{goal.name}</h2>
                  <p className="text-gray-500 text-sm">
                    Due: {new Date(goal.deadline).toLocaleDateString()}
                  </p>
                </div>
                <p className="text-gray-600 mt-1">
                  Target: ₹{target.toFixed(2)}
                </p>
                <p className="text-gray-500">
                  Saved: ₹{current.toFixed(2)}
                </p>

                {/* Progress bar */}
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                  <div
                    className="bg-green-500 h-2.5 rounded-full"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-gray-500 text-center py-10">
            No goals yet. Start by adding one above.
          </p>
        )}
      </div>
    </div>
    </PageWrapper>
  );
};

export default Goals;