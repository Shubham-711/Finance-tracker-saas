import { useState, useEffect } from 'react';
import { Target, Plus, TrendingUp, Calendar, X, Save, Trophy, Trash2 } from 'lucide-react'; // Edit3 removed
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '@/components/GlassCard';
import { GradientText } from '@/components/GradientText';
import { AnimatedWrapper, StaggerContainer, StaggerItem } from '@/components/AnimatedWrapper';
import api from '@/api/axios';
import { toast } from 'sonner';

interface GoalUI {
  id: number;
  title: string;
  target: number;
  current: number;
  deadline: string;
}

const Goals = () => {
  const [goals, setGoals] = useState<GoalUI[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<GoalUI | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    target_amount: '',
    deadline: '',
    current_amount: '0'
  });

  // --- 1. Fetch Goals ---
  const fetchGoals = async () => {
    try {
      setLoading(true);
      const res = await api.get('/goals');
      
      const formattedGoals = res.data.map((g: any) => ({
        id: g.id,
        // Assuming backend might not have title, we fallback to Goal #ID
        title: g.title || `Goal #${g.id}`, 
        target: g.target_amount,
        current: g.current_amount,
        deadline: g.deadline 
      }));

      setGoals(formattedGoals);
    } catch (error) {
      console.error("Failed to fetch goals", error);
      toast.error("Could not load goals");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  // --- 2. Open Create Modal ---
  const openCreateModal = () => {
    setEditingGoal(null); // Clear edit mode
    setFormData({ target_amount: '', deadline: '', current_amount: '0' });
    setIsModalOpen(true);
  };

  // --- 3. Open Edit Modal ---
  const openEditModal = (goal: GoalUI, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent conflicting clicks
    setEditingGoal(goal); // Set edit mode
    setFormData({
      target_amount: goal.target.toString(),
      // Ensure date is formatted YYYY-MM-DD for input
      deadline: new Date(goal.deadline).toISOString().split('T')[0],
      current_amount: goal.current.toString()
    });
    setIsModalOpen(true);
  };

  // --- 4. Handle Delete ---
  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this goal?")) return;
    
    try {
      await api.delete(`/goals/${id}`);
      toast.success("Goal deleted");
      fetchGoals();
    } catch (error) {
      toast.error("Failed to delete goal");
    }
  };

  // --- 5. Submit Form (Create or Update) ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        target_amount: parseFloat(formData.target_amount),
        deadline: formData.deadline,
        current_amount: parseFloat(formData.current_amount)
      };

      if (editingGoal) {
        // PUT Request
        await api.put(`/goals/${editingGoal.id}`, payload);
        toast.success("Goal updated successfully!");
      } else {
        // POST Request
        await api.post('/goals', payload);
        toast.success("Goal created successfully!");
      }
      
      setIsModalOpen(false);
      fetchGoals();
    } catch (error) {
      console.error(error);
      toast.error("Failed to save goal");
    }
  };

  // Stats Calculation
  const totalTarget = goals.reduce((sum, g) => sum + g.target, 0);
  const totalCurrent = goals.reduce((sum, g) => sum + g.current, 0);
  const overallProgress = totalTarget > 0 ? Math.round((totalCurrent / totalTarget) * 100) : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <AnimatedWrapper>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <motion.h1 
              className="text-4xl lg:text-5xl font-bold mb-3 font-display" 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            >
              <GradientText>Financial Goals</GradientText>
            </motion.h1>
            <p className="text-muted-foreground text-lg">Track your savings goals and milestones</p>
          </div>
          <motion.button 
            onClick={openCreateModal} 
            whileHover={{ scale: 1.02, y: -2 }} 
            whileTap={{ scale: 0.98 }} 
            className="px-5 py-3 rounded-xl gradient-bg font-medium flex items-center gap-2 w-fit group relative overflow-hidden shadow-lg shadow-purple-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>New Goal</span>
          </motion.button>
        </div>
      </AnimatedWrapper>

      {/* Overview Card */}
      <AnimatedWrapper delay={0.1}>
        <GlassCard className="p-6 glow-border-always" hover={false}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div className="flex items-center gap-5">
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl gradient-bg flex items-center justify-center relative overflow-hidden">
                  <Target className="w-8 h-8 text-white relative z-10" />
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Overall Progress</p>
                <p className="text-4xl font-bold font-display">{overallProgress}%</p>
                <p className="text-sm text-muted-foreground mt-1">
                  ₹{totalCurrent.toLocaleString()} of ₹{totalTarget.toLocaleString()}
                </p>
              </div>
            </div>
            
            <div className="relative w-36 h-36 mx-auto md:mx-0">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="72" cy="72" r="60" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="10" fill="none" />
                <motion.circle 
                  cx="72" cy="72" r="60" 
                  stroke="url(#progressGradient)" 
                  strokeWidth="10" 
                  fill="none" 
                  strokeLinecap="round" 
                  initial={{ strokeDasharray: `${2 * Math.PI * 60}`, strokeDashoffset: `${2 * Math.PI * 60}` }} 
                  animate={{ strokeDashoffset: `${2 * Math.PI * 60 * (1 - overallProgress / 100)}` }} 
                  transition={{ duration: 1.5, ease: 'easeOut' }} 
                />
                <defs>
                  <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="hsl(250, 89%, 65%)" />
                    <stop offset="50%" stopColor="hsl(280, 80%, 60%)" />
                    <stop offset="100%" stopColor="hsl(190, 95%, 50%)" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                 <div className="text-center">
                    <span className="text-3xl font-bold font-display">{overallProgress}%</span>
                    <p className="text-xs text-muted-foreground">Complete</p>
                 </div>
              </div>
            </div>
          </div>
        </GlassCard>
      </AnimatedWrapper>

      {/* Goals Grid */}
      <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {loading ? (
           [...Array(3)].map((_, i) => (
             <GlassCard key={i} className="h-64 animate-pulse bg-white/5"><></></GlassCard>
           ))
        ) : (
          goals.map((goal, index) => {
            const progress = goal.target > 0 ? Math.round((goal.current / goal.target) * 100) : 0;
            const remaining = goal.target - goal.current;
            const isCompleted = progress >= 100;
            
            return (
              <StaggerItem key={goal.id}>
                {/* Clicking card opens EDIT modal */}
                <div onClick={(e) => openEditModal(goal, e)} className="h-full cursor-pointer">
                  <GlassCard className="p-6 group relative overflow-hidden h-full transition-transform hover:-translate-y-1" hover={true} glow>
                    
                    {isCompleted && (
                      <div className="absolute inset-0 bg-green-500/5 pointer-events-none" />
                    )}

                    <div className="space-y-5 relative z-10">
                      {/* Header Section with Title and Icons */}
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-semibold font-display">{goal.title}</h3>
                          <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1.5">
                            <Calendar className="w-3.5 h-3.5" />Due: {new Date(goal.deadline).toLocaleDateString()}
                          </p>
                        </div>
                        
                        {/* Right side icons container */}
                        <div className="flex items-center gap-2">
                           {/* Delete Button - Visible only on hover */}
                           <button 
                             onClick={(e) => handleDelete(goal.id, e)}
                             className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all opacity-0 group-hover:opacity-100"
                             title="Delete Goal"
                           >
                             <Trash2 className="w-4 h-4" />
                           </button>

                          {/* Trending/Status Icon */}
                          <div className={`p-2.5 rounded-xl ${isCompleted ? 'bg-green-500/20 text-green-400' : 'bg-gradient-to-br from-primary/20 to-primary/5 text-primary'}`}>
                            {isCompleted ? <Trophy className="w-5 h-5" /> : <TrendingUp className="w-5 h-5" />}
                          </div>
                        </div>
                      </div>

                      {/* Progress Bar Section */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Progress</span>
                          <span className={isCompleted ? "font-medium text-green-400" : "font-medium"}>
                            {progress}%
                          </span>
                        </div>
                        <div className="h-3 rounded-full overflow-hidden" style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
                          <motion.div 
                            initial={{ width: 0 }} 
                            animate={{ width: `${progress}%` }} 
                            transition={{ duration: 1, delay: index * 0.1, ease: 'easeOut' }} 
                            className={`h-full rounded-full relative overflow-hidden ${isCompleted ? 'bg-green-500' : 'gradient-bg'}`} 
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 pt-2">
                        <div className="p-3 rounded-xl" style={{ background: 'rgba(255, 255, 255, 0.03)' }}>
                          <p className="text-xs text-muted-foreground">Saved</p>
                          <p className="text-lg font-semibold text-emerald-400 font-display">
                            ₹{goal.current.toLocaleString()}
                          </p>
                        </div>
                        <div className="p-3 rounded-xl" style={{ background: 'rgba(255, 255, 255, 0.03)' }}>
                          <p className="text-xs text-muted-foreground">Remaining</p>
                          <p className="text-lg font-semibold font-display">
                            ₹{Math.max(0, remaining).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                </div>
              </StaggerItem>
            );
          })
        )}
        
        {/* Create New Goal Card */}
        {!loading && (
          <StaggerItem>
            <motion.div onClick={openCreateModal} whileHover={{ scale: 1.02, y: -4 }} className="h-full">
              <div 
                className="h-full min-h-[250px] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all duration-300 hover:border-primary/50" 
                style={{ borderColor: 'rgba(255, 255, 255, 0.1)', background: 'rgba(255, 255, 255, 0.01)' }}
              >
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
                  <Plus className="w-7 h-7 text-muted-foreground" />
                </div>
                <p className="text-lg font-medium text-muted-foreground">Create New Goal</p>
              </div>
            </motion.div>
          </StaggerItem>
        )}
      </StaggerContainer>

      {/* INLINE MODAL COMPONENT */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-md z-10"
            >
              <GlassCard className="p-6 border-2 border-white/10" hover={false}>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-white">
                    {editingGoal ? `Edit Goal #${editingGoal.id}` : 'Create New Goal'}
                  </h2>
                  <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Target */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Target Amount (₹)</label>
                    <input 
                      type="number" required
                      value={formData.target_amount}
                      onChange={(e) => setFormData({...formData, target_amount: e.target.value})}
                      className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white focus:border-blue-500 outline-none"
                    />
                  </div>
                  
                  {/* Deadline */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Target Date</label>
                    <input 
                      type="date" required
                      value={formData.deadline}
                      onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                      className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white focus:border-blue-500 outline-none [color-scheme:dark]"
                    />
                  </div>

                  {/* Current Savings (Important for updates) */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">
                      {editingGoal ? 'Total Saved Amount' : 'Initial Savings'}
                    </label>
                    <input 
                      type="number" 
                      value={formData.current_amount}
                      onChange={(e) => setFormData({...formData, current_amount: e.target.value})}
                      className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white focus:border-blue-500 outline-none"
                    />
                    {editingGoal && (
                       <p className="text-xs text-gray-500">Update this number to add or remove savings.</p>
                    )}
                  </div>

                  <button 
                    type="submit" 
                    className="w-full py-3 mt-4 rounded-xl gradient-bg font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                  >
                    <Save className="w-4 h-4" /> 
                    {editingGoal ? 'Update Goal' : 'Save Goal'}
                  </button>
                </form>
              </GlassCard>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Goals;