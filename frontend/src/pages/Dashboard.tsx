import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Wallet, ArrowUpRight, ArrowDownRight, PiggyBank, Target, ArrowRight } from 'lucide-react';
import { GradientText } from '@/components/GradientText';
import { GlassCard } from '@/components/GlassCard';
import api from '@/api/axios'; 
import { Link } from 'react-router-dom';

// Note: No Modal imports needed here anymore!

interface StatCardData {
  label: string;
  amount: number;
  change: number;
  isPositive: boolean;
  icon: any;
  color: string;
}

interface Goal {
  id: number;
  target_amount: number;
  current_amount: number;
  deadline: string;
  title?: string;
}

interface Transaction {
  id: number;
  category: string;
  amount: number;
  date: string;
  transaction_type: string;
}

const Dashboard = () => {
  const [stats, setStats] = useState<StatCardData[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  // This runs every time you open the Dashboard page
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch all data in parallel
        const [statsRes, goalsRes, txRes] = await Promise.all([
          api.get('/reports/dashboard-stats'),
          api.get('/goals'),
          api.get('/transactions') 
        ]);

        // 1. Setup Stats
        const data = statsRes.data;
        const formattedStats: StatCardData[] = [
          { 
            label: 'Total Balance', amount: data.balance.amount, change: data.balance.change, isPositive: data.balance.isPositive, icon: Wallet, color: 'text-blue-400'
          },
          { 
            label: 'Income', amount: data.income.amount, change: data.income.change, isPositive: data.income.isPositive, icon: ArrowUpRight, color: 'text-green-400'
          },
          { 
            label: 'Expenses', amount: data.expenses.amount, change: data.expenses.change, isPositive: data.expenses.isPositive, icon: ArrowDownRight, color: 'text-red-400'
          },
          { 
            label: 'Savings', amount: data.savings.amount, change: data.savings.change, isPositive: data.savings.isPositive, icon: PiggyBank, color: 'text-purple-400'
          },
        ];
        
        setStats(formattedStats);
        setGoals(goalsRes.data);
        
        // 2. Setup Recent Transactions (Take top 5)
        // Since backend sends them sorted by date, this will always show the newest ones.
        setRecentTransactions(txRes.data.slice(0, 5));

      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Empty array means "run once when I enter this page"

  return (
    <>
      {/* HEADER */}
      <div className="mb-10">
        <motion.h1 
          className="text-4xl lg:text-5xl font-bold mb-3 font-display" 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        >
          <GradientText>Dashboard</GradientText>
        </motion.h1>
        <p className="text-muted-foreground text-lg">Overview of your financial activity</p>
      </div>

      {/* 1. STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
        {loading ? (
          [...Array(4)].map((_, i) => (
             <GlassCard key={i} className="h-32 animate-pulse bg-white/5"><></></GlassCard>
          ))
        ) : (
          stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}
            >
              <GlassCard className="p-6 h-full flex flex-col justify-between" hover={true}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-400">{stat.label}</p>
                    <h3 className="text-2xl font-bold text-white mt-1">₹{stat.amount.toLocaleString('en-IN')}</h3>
                  </div>
                  <div className={`p-3 rounded-xl bg-white/5 ${stat.color}`}><stat.icon className="w-6 h-6" /></div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-semibold ${stat.isPositive ? 'text-green-400' : 'text-red-400'}`}>
                    {stat.change > 0 ? '+' : ''}{stat.change}%
                  </span>
                  <span className="text-xs text-gray-500">from last month</span>
                </div>
              </GlassCard>
            </motion.div>
          ))
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 2. GOALS SUMMARY */}
        <div className="lg:col-span-2">
           <div className="flex items-center justify-between mb-6">
             <h2 className="text-xl font-bold text-white">Financial Goals</h2>
             <Link to="/goals" className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors">
               View All <ArrowRight className="w-4 h-4"/>
             </Link>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {loading ? <GlassCard className="h-32 bg-white/5 animate-pulse"><></></GlassCard> : 
              goals.length === 0 ? (
                <GlassCard className="p-8 text-center text-gray-500 col-span-2">
                  <Target className="w-8 h-8 mx-auto mb-3 opacity-50" />
                  <p>No active goals found.</p>
                </GlassCard>
              ) : (
                goals.slice(0, 2).map((goal) => (
                  <GlassCard key={goal.id} className="p-5" hover={true}>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-white font-semibold">{goal.title || `Goal #${goal.id}`}</p>
                        <p className="text-xs text-gray-400">Target: {new Date(goal.deadline).toLocaleDateString()}</p>
                      </div>
                      <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400"><Target className="w-5 h-5" /></div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                         <span className="text-gray-300">₹{goal.current_amount.toLocaleString()}</span>
                         <span className="text-gray-400">of ₹{goal.target_amount.toLocaleString()}</span>
                      </div>
                      <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                        <div 
                           className="h-full bg-gradient-to-r from-emerald-500 to-blue-500" 
                           style={{ width: `${Math.min((goal.current_amount / goal.target_amount) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  </GlassCard>
                ))
              )
             }
           </div>
        </div>

        {/* 3. RECENT TRANSACTIONS (Live & Read-Only) */}
        <div>
          <h2 className="text-xl font-bold text-white mb-6">Recent Activity</h2>
          <GlassCard className="p-0 overflow-hidden h-full min-h-[250px]">
             {loading ? (
               <div className="p-6 text-center text-gray-500">Loading...</div>
             ) : recentTransactions.length === 0 ? (
               <div className="p-8 text-center text-gray-500 flex flex-col items-center justify-center h-full">
                 <p>No transactions yet.</p>
               </div>
             ) : (
               <div className="divide-y divide-white/5">
                 {recentTransactions.map((tx) => (
                   <div key={tx.id} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                     <div className="flex items-center gap-3">
                       {/* Icon based on type */}
                       <div className={`p-2 rounded-lg ${tx.transaction_type.toLowerCase() === 'income' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                         {tx.transaction_type.toLowerCase() === 'income' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                       </div>
                       
                       {/* Details */}
                       <div>
                         <p className="text-sm font-medium text-white capitalize">{tx.category}</p>
                         <p className="text-xs text-gray-400">{new Date(tx.date).toLocaleDateString()}</p>
                       </div>
                     </div>
                     
                     {/* Amount */}
                     <span className={`text-sm font-semibold ${tx.transaction_type.toLowerCase() === 'income' ? 'text-green-400' : 'text-white'}`}>
                       {tx.transaction_type.toLowerCase() === 'income' ? '+' : '-'}₹{tx.amount.toLocaleString()}
                     </span>
                   </div>
                 ))}
               </div>
             )}
          </GlassCard>
        </div>
      </div>
    </>
  );
};

export default Dashboard;