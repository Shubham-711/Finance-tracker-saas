import React, { useState, useEffect } from "react";
import apiClient from "../api/axios";

const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [title, setTitle] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [error, setError] = useState("");

  // Fetch goals when component mounts
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

  // Add a new goal
  const handleAddGoal = async (e) => {
    e.preventDefault();
    setError("");

    if (!title || !targetAmount) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      const response = await apiClient.post("/goals", {
        title,
        targetAmount: parseFloat(targetAmount),
        currentAmount: 0,
      });
      setGoals((prev) => [response.data, ...prev]);
      setTitle("");
      setTargetAmount("");
    } catch (err) {
      console.error(err);
      setError("Failed to add goal. Try again.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Financial Goals</h1>

      {/* Add Goal Form */}
      <form
        onSubmit={handleAddGoal}
        className="bg-white shadow-md rounded-lg p-4 mb-6 flex gap-4 items-center"
      >
        <input
          type="text"
          placeholder="Goal Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="flex-1 p-2 border rounded-md"
          required
        />
        <input
          type="number"
          placeholder="Target Amount (₹)"
          value={targetAmount}
          onChange={(e) => setTargetAmount(e.target.value)}
          className="w-40 p-2 border rounded-md"
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
          goals.map((goal) => (
            <div
              key={goal.id}
              className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center"
            >
              <div>
                <h2 className="text-lg font-semibold">{goal.title}</h2>
                <p className="text-gray-600">
                  Target: ₹{goal.targetAmount.toFixed(2)}
                </p>
                <p className="text-gray-500">
                  Saved: ₹{goal.currentAmount?.toFixed(2) || 0}
                </p>
                {/* Progress bar */}
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{
                      width: `${
                        (goal.currentAmount / goal.targetAmount) * 100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center">
            No goals yet. Start by adding one above.
          </p>
        )}
      </div>
    </div>
  );
};

export default Goals;
