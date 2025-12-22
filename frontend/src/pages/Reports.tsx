import { useState, useEffect, useMemo } from 'react';
import { BarChart3, PieChart, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/GlassCard';
import { GradientText } from '@/components/GradientText';
import { AnimatedWrapper, StaggerContainer, StaggerItem } from '@/components/AnimatedWrapper';
import { cn } from '@/lib/utils';
import api from '@/api/axios';

// Interfaces
interface DashboardStats {
  income: { amount: number };
  expenses: { amount: number };
}

interface TrendResponse {
  labels: string[];       // ["2025-12-20", "2025-12-21"]
  income_data: number[];  // [1000, 0]
  expense_data: number[]; // [0, 500]
}

const Reports = () => {
  const [loading, setLoading] = useState(true);
  
  // State for data
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [categoryData, setCategoryData] = useState<{ [key: string]: number }>({});
  const [trendData, setTrendData] = useState<TrendResponse | null>(null);

  // Fetch all data on load
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [statsRes, catRes, trendRes] = await Promise.all([
          api.get('/reports/dashboard-stats'),
          api.get('/reports/categories'),
          api.get('/reports/trends')
        ]);

        setStats(statsRes.data);
        setCategoryData(catRes.data.category_expenses);
        setTrendData(trendRes.data);
      } catch (error) {
        console.error("Failed to fetch report data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // --- 1. Process Category Data ---
  const { categoryBreakdown, topCategory } = useMemo(() => {
    if (!categoryData) return { categoryBreakdown: [], topCategory: null };

    const totalExpenses = Object.values(categoryData).reduce((sum, val) => sum + val, 0);
    const colors = ['bg-primary', 'bg-emerald-500', 'bg-amber-500', 'bg-cyan-500', 'bg-rose-500', 'bg-violet-500', 'bg-blue-500'];
    
    const breakdown = Object.entries(categoryData)
      .map(([category, amount], index) => ({
        category,
        amount,
        percentage: totalExpenses > 0 ? Math.round((amount / totalExpenses) * 100) : 0,
        color: colors[index % colors.length]
      }))
      .sort((a, b) => b.amount - a.amount);

    return { categoryBreakdown: breakdown, topCategory: breakdown[0] };
  }, [categoryData]);

  // --- 2. Process Chart Data (FIXED: Generates continuous 14 days) ---
  const chartData = useMemo(() => {
    if (!trendData) return [];

    // Create maps for quick lookup: "2025-12-21" -> 500
    const incomeMap = new Map();
    const expenseMap = new Map();

    trendData.labels.forEach((dateStr, i) => {
      incomeMap.set(dateStr, trendData.income_data[i]);
      expenseMap.set(dateStr, trendData.expense_data[i]);
    });

    // Generate the last 14 days cleanly
    const last14Days = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      
      // Generate YYYY-MM-DD key to match backend format
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const dateKey = `${year}-${month}-${day}`;

      // Generate Display Label (e.g. "Dec 21")
      const displayLabel = d.toLocaleDateString('default', { month: 'short', day: 'numeric' });

      last14Days.push({
        label: displayLabel,
        // Look up data for this day, or use 0 if missing
        income: incomeMap.get(dateKey) || 0,
        expenses: expenseMap.get(dateKey) || 0
      });
    }

    return last14Days;
  }, [trendData]);

  // --- 3. Process Summary Stats ---
  const averages = useMemo(() => {
    return {
      income: stats?.income.amount || 0,
      expense: stats?.expenses.amount || 0
    };
  }, [stats]);

  const savingsRate = useMemo(() => {
    if (averages.income <= 0) return 0;
    return Math.round(((averages.income - averages.expense) / averages.income) * 100);
  }, [averages]);

  // Determine max value for bar height scaling
  const maxValue = Math.max(...chartData.map(d => Math.max(d.income, d.expenses)), 100);

  return (
    <div className="space-y-8">
      {/* Header */}
      <AnimatedWrapper>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <motion.h1 
              className="text-4xl lg:text-5xl font-bold mb-3 font-display" 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }}
            >
              <GradientText>Reports</GradientText>
            </motion.h1>
            <p className="text-muted-foreground text-lg">Analyze your financial performance</p>
          </div>
        </div>
      </AnimatedWrapper>

      {/* Top Stats Cards */}
      <StaggerContainer className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StaggerItem>
          <GlassCard className="p-5" hover={false}>
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 text-emerald-400">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Monthly Income</p>
                {loading ? (
                   <div className="h-8 w-24 bg-white/5 animate-pulse rounded mt-1"/>
                ) : (
                   <p className="text-2xl font-bold font-display">₹{averages.income.toLocaleString()}</p>
                )}
              </div>
            </div>
          </GlassCard>
        </StaggerItem>
        <StaggerItem>
          <GlassCard className="p-5" hover={false}>
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-rose-500/20 to-rose-500/5 text-rose-400">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Monthly Expenses</p>
                {loading ? (
                   <div className="h-8 w-24 bg-white/5 animate-pulse rounded mt-1"/>
                ) : (
                   <p className="text-2xl font-bold font-display">₹{averages.expense.toLocaleString()}</p>
                )}
              </div>
            </div>
          </GlassCard>
        </StaggerItem>
        <StaggerItem>
          <GlassCard className="p-5" hover={false}>
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary">
                <PieChart className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Savings Rate</p>
                {loading ? (
                   <div className="h-8 w-16 bg-white/5 animate-pulse rounded mt-1"/>
                ) : (
                   <p className="text-2xl font-bold font-display">{savingsRate}%</p>
                )}
              </div>
            </div>
          </GlassCard>
        </StaggerItem>
      </StaggerContainer>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Income vs Expenses (Last 14 Days) */}
        <AnimatedWrapper delay={0.3}>
          <GlassCard className="p-6" hover={false}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold font-display">Recent Activity (14 Days)</h2>
            </div>
            
            <div className="flex items-end gap-2 h-64">
              {loading ? (
                 <div className="w-full h-full flex items-center justify-center text-muted-foreground">Loading chart...</div>
              ) : chartData.length > 0 ? (
                chartData.map((data, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center gap-2 group">
                    <div className="flex gap-1 h-48 items-end w-full justify-center">
                      
                      {/* Income Bar (Green) */}
                      <motion.div 
                        initial={{ height: 0 }} 
                        animate={{ height: `${(data.income / maxValue) * 100}%` }} 
                        transition={{ duration: 0.6, delay: index * 0.05 }} 
                        className="w-1.5 sm:w-3 bg-emerald-500 rounded-t-sm relative min-h-[4px]" // min-height ensures 0 isn't invisible if you want dots
                        style={{ opacity: data.income > 0 ? 1 : 0.1 }}
                      >
                         {/* Tooltip */}
                         <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 opacity-0 group-hover:opacity-100 bg-black/90 border border-white/10 px-2 py-1 rounded text-[10px] text-emerald-400 whitespace-nowrap z-10 pointer-events-none transition-opacity">
                            Inc: ₹{data.income}
                         </div>
                      </motion.div>
                      
                      {/* Expense Bar (Red) */}
                      <motion.div 
                        initial={{ height: 0 }} 
                        animate={{ height: `${(data.expenses / maxValue) * 100}%` }} 
                        transition={{ duration: 0.6, delay: 0.1 + index * 0.05 }} 
                        className="w-1.5 sm:w-3 bg-rose-500 rounded-t-sm relative min-h-[4px]"
                        style={{ opacity: data.expenses > 0 ? 1 : 0.1 }}
                      >
                         {/* Tooltip */}
                         <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-8 opacity-0 group-hover:opacity-100 bg-black/90 border border-white/10 px-2 py-1 rounded text-[10px] text-rose-400 whitespace-nowrap z-10 pointer-events-none transition-opacity">
                            Exp: ₹{data.expenses}
                         </div>
                      </motion.div>
                    </div>
                    
                    {/* Date Labels - Show every other label to prevent crowding on small screens */}
                    <span className="text-[10px] text-muted-foreground truncate w-full text-center">
                      {index % 2 === 0 || index === 13 ? data.label : ''}
                    </span>
                  </div>
                ))
              ) : (
                <div className="flex w-full h-full items-center justify-center text-muted-foreground">
                  No transaction data available
                </div>
              )}
            </div>
          </GlassCard>
        </AnimatedWrapper>

        {/* Chart 2: Category Breakdown */}
        <AnimatedWrapper delay={0.4}>
          <GlassCard className="p-6" hover={false}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold font-display">Spending by Category</h2>
            </div>
            
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {loading ? (
                 <div className="space-y-4 animate-pulse">
                   {[1,2,3].map(i => <div key={i} className="h-8 bg-white/5 rounded-full" />)}
                 </div>
              ) : categoryBreakdown.length > 0 ? (
                categoryBreakdown.map((item, index) => (
                  <motion.div 
                    key={item.category} 
                    className="space-y-2" 
                    initial={{ opacity: 0, x: -20 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    transition={{ delay: 0.4 + index * 0.08 }}
                  >
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className={cn('w-3 h-3 rounded-full', item.color)} />
                        <span className="font-medium capitalize">{item.category}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-muted-foreground">₹{item.amount.toLocaleString()}</span>
                        <span className="text-muted-foreground w-10 text-right">{item.percentage}%</span>
                      </div>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
                      <motion.div 
                        initial={{ width: 0 }} 
                        animate={{ width: `${item.percentage}%` }} 
                        transition={{ duration: 0.6, delay: 0.5 + index * 0.08, ease: 'easeOut' }} 
                        className={cn('h-full rounded-full', item.color)} 
                      />
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-10 text-muted-foreground">No expenses recorded yet.</div>
              )}
            </div>
          </GlassCard>
        </AnimatedWrapper>
      </div>

      {/* Insights Section */}
      <AnimatedWrapper delay={0.5}>
        <GlassCard className="p-6 glow-border-always" hover={false}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.div 
              className="p-4 rounded-xl" 
              style={{ background: 'rgba(139, 92, 246, 0.08)', border: '1px solid rgba(139, 92, 246, 0.15)' }} 
              whileHover={{ scale: 1.02 }}
            >
              <p className="text-primary font-medium mb-1">Quick Tip</p>
              <p className="text-sm text-muted-foreground">
                {topCategory ? (
                  <>Reducing <b>{topCategory.category}</b> by 10% could save you ₹{Math.round(topCategory.amount * 0.1)} this month.</>
                ) : (
                  "Add expenses to get personalized saving tips!"
                )}
              </p>
            </motion.div>
             
             <div className="hidden md:block p-4 rounded-xl border border-white/5 bg-white/[0.02]">
                <p className="text-emerald-400 font-medium mb-1">On Track</p>
                <p className="text-sm text-muted-foreground">Keep tracking your income to build better habits.</p>
             </div>
             
             <div className="hidden md:block p-4 rounded-xl border border-white/5 bg-white/[0.02]">
                <p className="text-blue-400 font-medium mb-1">Projection</p>
                <p className="text-sm text-muted-foreground">
                    At this rate, you'll save ₹{Math.max(0, (averages.income - averages.expense) * 12).toLocaleString()} this year.
                </p>
             </div>

          </div>
        </GlassCard>
      </AnimatedWrapper>
    </div>
  );
};

export default Reports;