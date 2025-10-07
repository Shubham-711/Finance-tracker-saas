import React, { createContext, useState, useEffect, useContext } from 'react';
import apiClient from '../api/axios';

// Create the context
const DataContext = createContext();

// Create a custom hook for easy access to the context
export const useData = () => useContext(DataContext);

// Create the provider component that will wrap our app
export const DataProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [goals, setGoals] = useState([]);
  const [summary, setSummary] = useState(null);
  const [trends, setTrends] = useState(null);
  const [loading, setLoading] = useState(true);

  // This effect runs once to fetch all initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [transactionsRes, goalsRes, summaryRes, trendsRes] = await Promise.all([
          apiClient.get('/transactions'),
          apiClient.get('/goals'),
          apiClient.get('/reports/summary'),
          apiClient.get('/reports/trends'),
        ]);
        setTransactions(transactionsRes.data);
        setGoals(goalsRes.data);
        setSummary(summaryRes.data);
        setTrends({
          labels: trendsRes.data.labels,
          expenses: trendsRes.data.expense_data,
          income: trendsRes.data.income_data,
        });
      } catch (error) {
        console.error("Failed to fetch initial data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Function to add a transaction to our central state
  const addTransaction = (newTransaction) => {
    setTransactions(prev => [newTransaction, ...prev]);
  };

  // Function to add a goal to our central state
  const addGoal = (newGoal) => {
    setGoals(prev => [...prev, newGoal]);
  };

  // The value that will be provided to all consuming components
  const value = {
    transactions,
    goals,
    summary,
    trends,
    addTransaction,
    addGoal,
    loading,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
