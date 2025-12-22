import { useState, useEffect } from 'react';
import { Search, Plus, ArrowUpRight, ArrowDownRight, Wallet, Edit2, Trash2 } from 'lucide-react';
import { GlassCard } from '@/components/GlassCard';
import { GradientText } from '@/components/GradientText';
import api from '@/api/axios';
import { toast } from 'sonner';

// Import Modal & Type
import AddTransactionModal, { Transaction } from '@/components/AddTransactionModal';

const Transactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); 
  const [search, setSearch] = useState('');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);

  // 1. Fetch Transactions (GET /transactions)
  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const res = await api.get('/transactions'); 
      setTransactions(res.data);
    } catch (error) {
      console.error("Failed to fetch transactions", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // 2. Handle Create (Opens Empty Modal)
  const handleCreate = () => {
    setEditingTx(null); 
    setIsModalOpen(true);
  }

  // 3. Handle Edit (Opens Modal with Data)
  const handleEdit = (tx: Transaction) => {
    setEditingTx(tx); 
    setIsModalOpen(true);
  };

  // 4. Handle Delete (DELETE /transactions/{id})
  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this transaction?")) return;
    try {
      await api.delete(`/transactions/${id}`);
      toast.success("Transaction deleted");
      fetchTransactions(); // Refresh list after delete
    } catch (error) {
      toast.error("Failed to delete transaction");
    }
  };

  // Filter Logic
  const filteredTransactions = transactions.filter(tx => {
    const type = tx.transaction_type.toLowerCase();
    const matchesFilter = filter === 'all' || type === filter;
    const searchLower = search.toLowerCase();
    const matchesSearch = tx.category.toLowerCase().includes(searchLower) || 
                          (tx.description && tx.description.toLowerCase().includes(searchLower));
    return matchesFilter && matchesSearch;
  });

  // Calculate Totals
  const totalIncome = transactions.filter(t => t.transaction_type.toLowerCase() === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.transaction_type.toLowerCase() === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const netBalance = totalIncome - totalExpenses;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold mb-2 font-display"><GradientText>Transactions</GradientText></h1>
          <p className="text-muted-foreground">Track and manage all your transactions</p>
        </div>
        
        <button 
          onClick={handleCreate}
          className="px-5 py-3 rounded-xl bg-purple-600 text-white font-medium flex items-center gap-2 hover:bg-purple-700 transition-colors shadow-lg shadow-purple-500/20"
        >
          <Plus className="w-4 h-4" /> Add Transaction
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-green-500/10 text-green-400"><ArrowUpRight className="w-6 h-6" /></div>
            <div><p className="text-sm text-gray-400">Total Income</p><p className="text-2xl font-bold text-white">₹{totalIncome.toLocaleString()}</p></div>
          </div>
        </GlassCard>
        <GlassCard className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-red-500/10 text-red-400"><ArrowDownRight className="w-6 h-6" /></div>
            <div><p className="text-sm text-gray-400">Total Expenses</p><p className="text-2xl font-bold text-white">₹{totalExpenses.toLocaleString()}</p></div>
          </div>
        </GlassCard>
        <GlassCard className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400"><Wallet className="w-6 h-6" /></div>
            <div><p className="text-sm text-gray-400">Net Balance</p><p className="text-2xl font-bold text-white">₹{netBalance.toLocaleString()}</p></div>
          </div>
        </GlassCard>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 p-1">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input type="text" placeholder="Search category or description..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white outline-none focus:border-purple-500 transition-colors" />
        </div>
        <div className="flex gap-2 bg-white/5 p-1 rounded-xl border border-white/10">
          {['all', 'income', 'expense'].map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${filter === f ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}>{f}</button>
          ))}
        </div>
      </div>

      {/* Transactions Table */}
      <GlassCard className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white/5 text-gray-400 text-xs uppercase">
              <tr>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Description</th>
                <th className="px-6 py-4 font-medium text-right">Amount</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                 <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">Loading transactions...</td></tr>
              ) : filteredTransactions.length === 0 ? (
                 <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">No transactions found</td></tr>
              ) : (
                filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4 text-sm text-gray-300">{new Date(tx.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4"><span className="px-2 py-1 rounded-md bg-white/5 text-xs text-gray-300 border border-white/10 capitalize">{tx.category}</span></td>
                    <td className="px-6 py-4 text-sm text-gray-400">{tx.description || '-'}</td>
                    <td className={`px-6 py-4 text-right font-medium ${tx.transaction_type.toLowerCase() === 'income' ? 'text-green-400' : 'text-white'}`}>
                      {tx.transaction_type.toLowerCase() === 'income' ? '+' : '-'}₹{tx.amount.toLocaleString()}
                    </td>
                    
                    {/* Actions Column with Edit/Delete */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleEdit(tx)}
                          className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => tx.id && handleDelete(tx.id)}
                          className="p-2 rounded-lg hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>

      <AddTransactionModal 
        open={isModalOpen} 
        onOpenChange={setIsModalOpen}
        onSuccess={fetchTransactions}
        initialData={editingTx} 
      />

    </div>
  );
};

export default Transactions;