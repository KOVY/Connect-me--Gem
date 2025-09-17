import React, { useState } from 'react';
import Modal from './Modal';
import { GIFTS } from '../constants';
import { Gift } from '../types';
import { useUser } from '../contexts/UserContext';
import GiftSending from './GiftSending';

interface GiftSelectionModalProps {
    recipientName: string;
    onClose: () => void;
    onGiftSent: (giftId: string) => void;
}

const GiftSelectionModal: React.FC<GiftSelectionModalProps> = ({ recipientName, onClose, onGiftSent }) => {
    const { user, sendGift, isLoading } = useUser();
    const [selectedGift, setSelectedGift] = useState<Gift | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isSending, setIsSending] = useState(false);

    const handleSendGift = async () => {
        if (!selectedGift) return;
        
        if (user && user.credits < selectedGift.cost) {
            setError('You do not have enough credits. Please buy more.');
            return;
        }

        setIsSending(true);
        setError(null);
        try {
            await sendGift(selectedGift, recipientName);
            onGiftSent(selectedGift.id);
        } catch (err) {
            setError('Failed to send gift. Please try again.');
        } finally {
            setIsSending(false);
        }
    };

    const handleSelectGift = (gift: Gift) => {
        setError(null);
        setSelectedGift(gift);
    }
    
    return (
        <Modal isOpen={true} onClose={onClose} title={selectedGift ? 'Confirm Your Gift' : `Send a Gift to ${recipientName}`}>
            {isSending && (
                <div className="text-center p-8">
                    <p>Sending your gift...</p>
                </div>
            )}
            
            {!isSending && selectedGift && (
                <GiftSending 
                    gift={selectedGift}
                    recipientName={recipientName}
                    onConfirm={handleSendGift}
                    onCancel={() => setSelectedGift(null)}
                />
            )}
            
            {!isSending && !selectedGift && (
                <div>
                     <p className="text-center text-gray-400 mb-6">Select a gift to unlock the chat.</p>
                     <div className="flex justify-center items-center gap-4">
                        {GIFTS.map(gift => (
                        <button 
                            key={gift.id} 
                            onClick={() => handleSelectGift(gift)}
                            className="flex flex-col items-center gap-2 p-4 rounded-xl bg-gray-700 hover:bg-gray-600 border-2 border-transparent hover:border-pink-500/50 transition-all duration-300 transform hover:scale-105 group"
                        >
                            <span className="text-5xl transition-transform duration-300 group-hover:scale-125">{gift.icon}</span>
                            <div className="text-sm">
                            <p className="font-semibold text-white">{gift.name}</p>
                            <p className="text-gray-300">{gift.cost} credits</p>
                            </div>
                        </button>
                        ))}
                    </div>
                    {error && <p className="text-red-400 text-center mt-4">{error}</p>}
                    <div className="text-center mt-6">
                        <p className="text-gray-400">Your balance: {user?.credits ?? 0} credits</p>
                    </div>
                </div>
            )}
        </Modal>
    );
};

export default GiftSelectionModal;
