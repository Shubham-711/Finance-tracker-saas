// src/components/Charts.jsx
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const Charts = ({ labels, incomeData, expenseData }) => {
  const chartData = labels.map((label, idx) => ({
    date: label,
    income: incomeData[idx],
    expense: expenseData[idx],
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="income" stroke="#4CAF50" name="Income" />
        <Line type="monotone" dataKey="expense" stroke="#F44336" name="Expense" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default Charts;
