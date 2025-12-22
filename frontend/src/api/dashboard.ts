import { api } from "@/api/api";

export const getSummary = async () => {
  const res = await api.get("/reports/summary");
  return res.data;
};

export const getTransactions = async () => {
  const res = await api.get("/transactions");
  return res.data;
};

export const getGoals = async () => {
  const res = await api.get("/goals");
  return res.data;
};
