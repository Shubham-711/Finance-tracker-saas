import React, { useState, useEffect } from "react";
import PageWrapper from "../components/PageWrapper";
import Card from "../components/ui/Card";
import { useData } from "../context/DataContext";
import { Wallet, TrendingUp, TrendingDown, PiggyBank } from "lucide-react";
console.log("🔥 Dashboard.jsx LOADED — version 5");
const Dashboard = () => {
  const { summary, transactions, loading } = useData();
  const [stats, setStats] = useState([]);

  useEffect(() => {
    if (!summary) return;

    const totalBalance = summary.income - summary.expense;

    setStats([
      {
        title: "Total Balance",
        value: `₹${totalBalance.toLocaleString("en-IN")}`,
        change: "+12.5%",
        icon: <Wallet className="w-5 h-5 text-gray-200" />,
        changeColor: "text-emerald-400",
      },
      {
        title: "Income",
        value: `₹${summary.income.toLocaleString("en-IN")}`,
        change: "+8.2%",
        icon: <TrendingUp className="w-5 h-5 text-emerald-400" />,
        changeColor: "text-emerald-400",
      },
      {
        title: "Expenses",
        value: `₹${summary.expense.toLocaleString("en-IN")}`,
        change: "-4.3%",
        icon: <TrendingDown className="w-5 h-5 text-rose-400" />,
        changeColor: "text-rose-400",
      },
      {
        title: "Savings",
        value: `₹${(totalBalance * 0.5).toLocaleString("en-IN")}`,
        change: "+15.1%",
        icon: <PiggyBank className="w-5 h-5 text-indigo-300" />,
        changeColor: "text-emerald-400",
      },
    ]);
  }, [summary]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-gray-400">
        Loading dashboard…
      </div>
    );
  }

  return (
    <PageWrapper>
      <div className="min-h-screen w-full px-4 py-8 text-white lg:px-8">
        <div className="mx-auto max-w-6xl space-y-8">
          {/* 🟣 HERO HEADER */}
          <section className="relative overflow-hidden rounded-3xl border border-white/5 bg-gradient-to-br from-[#111827] via-[#05060A] to-[#05060A] px-6 py-6 lg:px-8 lg:py-8 shadow-[0_18px_45px_rgba(0,0,0,0.7)]">
            {/* subtle glow */}
            <div
              className="pointer-events-none absolute inset-0 opacity-70"
              style={{
                background:
                  "radial-gradient(circle at top left, rgba(99,102,241,0.35), transparent 55%)",
              }}
            />
            <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h1 className="text-3xl font-semibold tracking-tight lg:text-4xl">
                  Dashboard
                </h1>
                <p className="mt-2 max-w-xl text-sm text-gray-400 lg:text-base">
                  Welcome back! Here’s your real-time financial overview across
                  income, expenses and savings.
                </p>
              </div>
              {/* tiny summary pill on the right */}
              <div className="inline-flex items-center gap-2 rounded-full bg-black/30 px-4 py-2 text-xs text-gray-300 border border-white/10">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Data synced from your latest transactions
              </div>
            </div>
          </section>

          {/* 📊 STAT CARDS */}
          <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((item) => (
              <Card
                key={item.title}
                className="flex flex-col gap-3 border border-white/7 bg-[#0F1117] hover:border-indigo-400/40 hover:bg-[#111827] transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-center justify-between">
                  <div className="text-xs font-medium uppercase tracking-wide text-gray-400">
                    {item.title}
                  </div>
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 border border-white/10">
                    {item.icon}
                  </div>
                </div>
                <div className="text-2xl font-semibold tracking-tight">
                  {item.value}
                </div>
                <div className={`text-xs font-medium ${item.changeColor}`}>
                  {item.change} from last month
                </div>
              </Card>
            ))}
          </section>

          {/* 🧾 TRANSACTIONS & SPENDING */}
          <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Recent Transactions */}
            <Card className="border border-white/7 bg-[#0F1117]">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold tracking-tight">
                  Recent Transactions
                </h2>
              </div>

              {transactions && transactions.length > 0 ? (
                <ul className="divide-y divide-white/5">
                  {transactions.slice(0, 6).map((tx) => (
                    <li
                      key={tx.id}
                      className="flex items-center justify-between py-3 text-sm"
                    >
                      <div>
                        <p className="font-medium text-gray-100">
                          {tx.description || tx.category}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(tx.date).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                      <span
                        className={`text-sm font-semibold ${
                          tx.transaction_type === "income"
                            ? "text-emerald-400"
                            : "text-rose-400"
                        }`}
                      >
                        {tx.transaction_type === "income" ? "+" : "-"}₹
                        {tx.amount}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="flex h-40 items-center justify-center text-sm text-gray-500">
                  No transactions yet. Add one to see your activity here.
                </div>
              )}
            </Card>

            {/* Spending Overview */}
            <Card className="border border-white/7 bg-[#0F1117]">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold tracking-tight">
                  Spending Overview
                </h2>
              </div>
              <div className="flex h-40 items-center justify-center text-sm text-gray-500">
                Chart will appear here (monthly spend vs income).
              </div>
            </Card>
          </section>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Dashboard;
