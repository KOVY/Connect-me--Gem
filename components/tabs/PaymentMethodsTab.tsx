// FIX: Creating the `PaymentMethodsTab` component.
import React from 'react';

const PaymentMethodsTab: React.FC = () => {
  return (
    <div>
      <h2 className="text-xl font-semibold">Payment Methods</h2>
      <p className="mt-2 text-gray-400">Manage your saved payment methods here.</p>
       <div className="mt-6 p-6 bg-gray-800 rounded-lg">
        <p>No payment methods saved yet.</p>
        <button className="mt-4 px-4 py-2 rounded-full aurora-gradient font-semibold">
          Add a new card
        </button>
      </div>
    </div>
  );
};

export default PaymentMethodsTab;
