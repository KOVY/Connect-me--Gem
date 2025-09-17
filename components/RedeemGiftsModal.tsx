// FIX: Creating the RedeemGiftsModal component as a placeholder.
import React from 'react';
import Modal from './Modal';

interface RedeemGiftsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RedeemGiftsModal: React.FC<RedeemGiftsModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Redeem Gifts">
      <div className="text-center">
        <p className="text-gray-400">This feature is coming soon!</p>
        <p className="mt-2">You will be able to redeem gifts you've received for credits here.</p>
        <button
          onClick={onClose}
          className="mt-6 px-6 py-2 rounded-full aurora-gradient font-semibold"
        >
          Got it
        </button>
      </div>
    </Modal>
  );
};

export default RedeemGiftsModal;
