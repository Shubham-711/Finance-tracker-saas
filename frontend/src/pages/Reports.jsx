import React from "react";
import { useData } from "../context/DataContext";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title } from 'chart.js';
import { Doughnut, Line } from 'react-chartjs-2';
import Card from "../components/Card";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title);

const Reports = () => {
  // --- THIS IS THE MAIN FIX ---
  // We are now asking for 'summary', 'trends', and 'loading' which the context provides.
  const { summary, trends, loading } = useData();

  if (loading) return <p>Loading reports...</p>;
  if (!summary || !trends) return <p>No report data available yet.</p>;

  // Prepare data for the Pie Chart using the summary data
  const pieChartData = {
    labels: ['Income', 'Expense'],
    datasets: [{
      data: [summary.total_income, summary.total_expense],
      backgroundColor: ['#10B981', '#EF4444'],
      borderColor: '#FFFFFF',
      borderWidth: 2,
    }]
  };

  // Prepare data for the Trends Chart using the trends data
  const lineChartData = {
    labels: trends.labels.map(l => new Date(l).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
    datasets: [
      {
        label: 'Income',
        data: trends.income, // Use the 'income' property from the context
        borderColor: '#10B981',
        tension: 0.1
      },
      {
        label: 'Expense',
        data: trends.expenses, // Use the 'expenses' property from the context
        borderColor: '#EF4444',
        tension: 0.1
      }
    ]
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Reports</h1>
      
      <Card title={`${summary.month} Summary`}>
        <div className="flex justify-around text-center">
          <div>
            <p className="text-gray-500">Total Income</p>
            <p className="text-2xl font-bold text-green-600">₹{summary.total_income.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-gray-500">Total Expense</p>
            <p className="text-2xl font-bold text-red-500">₹{summary.total_expense.toFixed(2)}</p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Income vs Expense Breakdown">
          <div className="h-80">
            <Doughnut data={pieChartData} options={{ maintainAspectRatio: false }} />
          </div>
        </Card>

        <Card title="Income vs Expense Trends (Last 30 Days)">
          <div className="h-80">
            <Line data={lineChartData} options={{ maintainAspectRatio: false }} />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Reports;