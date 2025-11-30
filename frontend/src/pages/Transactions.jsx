import React, { useState, useEffect } from 'react';
import apiClient from '../api/axios';
import { useData } from '../context/DataContext';
import AddTransactionModal from '../components/AddTransactionModal';
import PageWrapper from '../components/PageWrapper';


const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch all transactions when the component mounts
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await apiClient.get('/transactions');
        setTransactions(response.data);
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  // Callback function to add a new transaction to the state without re-fetching
  const handleTransactionAdded = (newTransaction) => {
    setTransactions(prev => [newTransaction, ...prev]);
  };

  if (loading) return <div>Loading transactions...</div>;

  return (
    <PageWrapper>
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Transactions</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition-colors"
        >
          Add Transaction [+]
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
            </tr>
          </thead>
         <tbody className="divide-y divide-gray-200">
         {transactions.length > 0 ? (
          transactions.map(tx => (
           <tr key={tx.id}>
           <td className="px-6 py-4 whitespace-nowrap">{new Date(tx.date).toLocaleDateString()}</td>
           <td className="px-6 py-4 whitespace-nowrap">{tx.category}</td>
           <td className="px-6 py-4 whitespace-nowrap">{tx.description}</td>
           <td className={`px-6 py-4 whitespace-nowrap text-right font-medium ${tx.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
          ₹{Number(tx.amount).toFixed(2)}
        </td>
      </tr>
    ))

            ) : (
              <tr>
                <td colSpan="4" className="text-center py-10 text-gray-500">
                  No transactions yet. Click "Add Transaction" to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* The Modal for adding a new transaction */}
      <AddTransactionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onTransactionAdded={handleTransactionAdded}
      />
    </div>
    </PageWrapper>
  );
};

export default Transactions;