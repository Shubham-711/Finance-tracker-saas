import React from 'react';

const GoalCard = ({ goal }) => {
  const target = Number(goal.target_amount) || 0;
  const current = Number(goal.current_amount) || 0;
  const progress = target > 0 ? (current / target) * 100 : 0;

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">{goal.name}</h2>
        <p className="text-sm text-gray-500">
          Due: {new Date(goal.deadline).toLocaleDateString()}
        </p>
      </div>
      <p className="text-gray-600 mt-1">
        Target: ₹{target.toFixed(2)}
      </p>
      <p className="text-gray-500">
        Saved: ₹{current.toFixed(2)}
      </p>
      <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
        <div
          className="bg-green-500 h-2.5 rounded-full"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default GoalCard;