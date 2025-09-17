import React, { useState } from 'react';
import Modal from './Modal';
import { useTranslations } from '../hooks/useTranslations';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (apiKey: string) => void;
}

const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose, onSave }) => {
  const { t } = useTranslations();
  const [key, setKey] = useState('');

  const handleSave = () => {
    if (key.trim()) {
      onSave(key.trim());
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('api_key_modal_title')}>
      <div className="space-y-4">
        <p className="text-sm text-gray-300">{t('api_key_modal_description')}</p>
        <div>
          <input
            type="password"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder={t('api_key_placeholder')}
            className="block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-pink-500 focus:border-pink-500"
          />
        </div>
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-full bg-gray-600 hover:bg-gray-500 font-semibold"
          >
            {t('cancel')}
          </button>
          <button
            onClick={handleSave}
            disabled={!key.trim()}
            className="px-4 py-2 rounded-full aurora-gradient font-semibold disabled:opacity-50"
          >
            {t('save')}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ApiKeyModal;
