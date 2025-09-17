import React from 'react';
import { Gift } from '../types';

interface GiftSendingProps {
    gift: Gift;
    recipientName: string;
    onConfirm: () => void;
    onCancel: () => void;
}

const GiftSending: React.FC<GiftSendingProps> = ({ gift, recipientName, onConfirm, onCancel }) => {
    return (
        <div className="text-center">
            <p className="text-lg">You are sending a</p>
            <div className="my-4">
                <span className="text-6xl">{gift.icon}</span>
                <p className="font-bold text-xl">{gift.name}</p>
                <p className="text-gray-400">{gift.cost} credits</p>
            </div>
            <p className="text-lg">to <span className="font-bold">{recipientName}</span>.</p>

            <div className="flex justify-center gap-4 mt-6">
                <button onClick={onCancel} className="px-6 py-2 rounded-full bg-gray-600 hover:bg-gray-500 font-semibold">
                    Cancel
                </button>
                <button onClick={onConfirm} className="px-6 py-2 rounded-full aurora-gradient font-semibold">
                    Confirm
                </button>
            </div>
        </div>
    );
};

export default GiftSending;
