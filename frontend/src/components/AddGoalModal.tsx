import { useState, useEffect } from 'react';
import { X, Loader2, Calendar, Tag, DollarSign, ArrowUpRight, ArrowDownRight, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/api/axios';
import { toast } from 'sonner';

// Define Transaction Interface matching your backend schemas
export interface Transaction {
  id?: number;
  amount: number;
  category: string;
  date: string;
  transaction_type: string;
  description?: string;
}

interface AddTransactionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  initialData?: Transaction | null; // Pass this when editing
}

const AddTransactionModal = ({ open, onOpenChange, onSuccess, initialData }: AddTransactionModalProps) => {
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    transaction_type: 'expense',
    description: ''
  });

  // Load initial data when "Edit" is clicked
  useEffect(() => {
    if (open && initialData) {
      setFormData({
        amount: initialData.amount.toString(),
        category: initialData.category,
        date: new Date(initialData.date).toISOString().split('T')[0],
        transaction_type: initialData.transaction_type,
        description: initialData.description || ''
      });
    } else if (open && !initialData) {
      // Reset form if creating new
      setFormData({
        amount: '',
        category: '',
        date: new Date().toISOString().split('T')[0],
        transaction_type: 'expense',
        description: ''
      });
    }
  }, [open, initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount || !formData.category) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      
      // Prepare payload matching schemas.TransactionCreate
      const payload = {
        amount: parseFloat(formData.amount),
        category: formData.category,
        date: formData.date,
        transaction_type: formData.transaction_type,
        description: formData.description
      };

      if (initialData?.id) {
        // ✅ UPDATE: Calls your @router.put("/{transaction_id}")
        await api.put(`/transactions/${initialData.id}`, payload);
        toast.success("Transaction updated successfully!");
      } else {
        // ✅ CREATE: Calls your @router.post("")
        await api.post('/transactions', payload);
        toast.success("Transaction added successfully!");
      }

      onSuccess(); // Refresh the list
      onOpenChange(false); // Close modal
    } catch (err) {
      console.error(err);
      toast.error('Operation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => onOpenChange(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-md bg-[#0A0A0A] border border-white/10 rounded-2xl shadow-2xl overflow-hidden pointer-events-auto"
            >
              <div className="flex items-center justify-between p-6 border-b border-white/5">
                <h2 className="text-xl font-bold font-display text-white">
                  {initialData ? 'Edit Transaction' : 'Add Transaction'}
                </h2>
                <button onClick={() => onOpenChange(false)} className="p-2 hover:bg-white/5 rounded-lg text-muted-foreground hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {/* Type Toggle */}
                <div className="grid grid-cols-2 gap-2 p-1 bg-white/5 rounded-xl">
                  {(['income', 'expense'] as const).map((t) => (
                    <button
                      key={t} type="button"
                      onClick={() => setFormData({ ...formData, transaction_type: t })}
                      className={`py-2 rounded-lg text-sm font-medium capitalize flex items-center justify-center gap-2 transition-all ${
                        formData.transaction_type === t
                          ? t === 'income' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/20 text-rose-400 border border-rose-500/20'
                          : 'text-muted-foreground hover:bg-white/5'
                      }`}
                    >
                      {t === 'income' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                      {t}
                    </button>
                  ))}
                </div>

                {/* Amount */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Amount</label>
                  <div className="relative group">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-white" />
                    <input
                      type="number" placeholder="0.00" value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 text-white"
                    />
                  </div>
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Category</label>
                  <div className="relative group">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-white" />
                    <input
                      type="text" placeholder="e.g. Salary, Food" value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 text-white"
                    />
                  </div>
                </div>

                {/* Date */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Date</label>
                  <div className="relative group">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-white" />
                    <input
                      type="date" value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 text-white/90 [color-scheme:dark]"
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Description (Optional)</label>
                  <div className="relative group">
                    <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-white" />
                    <input
                      type="text" placeholder="Quick note..." value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 text-white"
                    />
                  </div>
                </div>

                <button
                  type="submit" disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-medium flex items-center justify-center gap-2 transition-all disabled:opacity-50 mt-2 shadow-lg shadow-purple-500/20"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (initialData ? 'Update Transaction' : 'Add Transaction')}
                </button>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AddTransactionModal;