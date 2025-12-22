import React, { createContext, useContext, useEffect, useState } from "react";
import { api } from "@/api/api";

// --- Types ---
interface Summary {
  income: number;
  expense: number;
  balance: number;
  savings: number;
}

export interface Transaction {
  id: number;
  amount: number;
  date: string;
  category: string;
  description: string;
  type: "income" | "expense";
}

// ✅ Updated Goal Interface to match your UI
export interface Goal {
  id: number;
  title: string;          // UI expects 'title'
  target: number;         // UI expects 'target' (mapped from target_amount)
  current: number;        // UI expects 'current' (mapped from current_amount)
  deadline: string;
}

interface DataContextProps {
  summary: Summary | null;
  transactions: Transaction[];
  goals: Goal[];
  loading: boolean;
  refreshAll: () => Promise<void>;
  addTransaction: (data: any) => Promise<void>;
  addGoal: (data: any) => Promise<void>; // ✅ New Function
}

const DataContext = createContext<DataContextProps | undefined>(undefined);

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshAll = async () => {
    try {
      setLoading(true);
      const [sumRes, txRes, goalRes] = await Promise.all([
        api.get("/reports/summary"),
        api.get("/transactions"),
        api.get("/goals"),
      ]);

      // 1. Summary
      const rawSummary = sumRes.data;
      setSummary({
        ...rawSummary,
        savings: rawSummary.savings ?? (rawSummary.income - rawSummary.expense),
      });

      // 2. Transactions
      setTransactions(txRes.data.map((t: any) => ({
        id: t.id,
        amount: t.amount,
        date: t.date,
        category: t.category,
        description: t.category,
        type: t.transaction_type,
      })));

      // 3. Goals (Normalization Fix)
      setGoals(goalRes.data.map((g: any) => ({
        id: g.id,
        title: g.title,
        // Backend sends 'target_amount', UI wants 'target'
        target: g.target_amount, 
        // Backend sends 'current_amount', UI wants 'current'
        current: g.current_amount || 0, 
        deadline: g.deadline,
      })));

    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const addTransaction = async (data: any) => {
    try {
      await api.post("/transactions", {
        amount: Number(data.amount),
        category: data.category,
        date: data.date,
        transaction_type: data.type,
      });
      await refreshAll();
    } catch (error) {
      console.error("Failed to add transaction:", error);
      throw error;
    }
  };

  // ✅ New Add Goal Function
  const addGoal = async (data: any) => {
    try {
      // Map UI data back to Backend format
      await api.post("/goals", {
        title: data.title,
        target_amount: Number(data.target),
        current_amount: Number(data.current || 0),
        deadline: data.deadline,
      });
      await refreshAll();
    } catch (error) {
      console.error("Failed to add goal:", error);
      throw error;
    }
  };

  useEffect(() => {
    refreshAll();
  }, []);

  return (
    <DataContext.Provider value={{ summary, transactions, goals, loading, refreshAll, addTransaction, addGoal }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error("useData must be used within a DataProvider");
  return context;
};