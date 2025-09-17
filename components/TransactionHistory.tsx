// FIX: Creating the `TransactionHistory` component to display past transactions.
import React from 'react';
import { useUser } from '../contexts/UserContext';

const TransactionHistory: React.FC = () => {
    const { transactions, isLoading } = useUser();

    if (isLoading) {
        return <div>Loading history...</div>;
    }
    
    if (transactions.length === 0) {
        return <div>No transactions yet.</div>;
    }

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold">Transaction History</h2>
            <ul className="space-y-3">
                {transactions.map(tx => (
                    <li key={tx.id} className="p-4 bg-gray-800 rounded-lg flex justify-between items-center">
                        <div>
                            <p className="font-semibold">{tx.description}</p>
                            <p className="text-sm text-gray-400">{tx.date}</p>
                        </div>
                        <p className={`font-bold ${tx.amount > 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {tx.amount > 0 ? '+' : ''}{tx.amount}
                        </p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TransactionHistory;
