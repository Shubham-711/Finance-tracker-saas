import React from 'react';

const RecentTransactionsTable = ({ transactions }) => {
  return (
    <div className="bg-white rounded-lg shadow-md mt-6">
      <h2 className="text-xl font-semibold p-6 text-gray-800">Recent Transactions</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {transactions && transactions.length > 0 ? (
              transactions.map(tx => (
                <tr key={tx.id}>
                  <td className="px-6 py-4">{new Date(tx.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4">{tx.category}</td>
                  <td className="px-6 py-4">{tx.description}</td>
                  <td className={`px-6 py-4 text-right font-medium ${tx.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                    ₹{tx.amount.toFixed(2)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-10 text-gray-500">
                  No recent transactions.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentTransactionsTable;