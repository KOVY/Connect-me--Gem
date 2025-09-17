// FIX: Implementing the SettingsTab component as a placeholder for user settings.
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkNotificationPermission, requestNotificationPermission } from '../../utils/notifications';
import { useTranslations } from '../../hooks/useTranslations';
import { useLocale } from '../../contexts/LocaleContext';
import Modal from '../Modal';

const SettingsTab: React.FC = () => {
    const { t } = useTranslations();
    const { locale } = useLocale();
    const navigate = useNavigate();
    const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    useEffect(() => {
        setNotificationPermission(checkNotificationPermission());
    }, []);

    const handleEnableNotifications = useCallback(async () => {
        const permission = await requestNotificationPermission();
        setNotificationPermission(permission);
    }, []);

    const handleConfirmDelete = () => {
        console.log("Account deletion confirmed.");
        // In a real app, this would call an API endpoint.
        // For simulation, we clear local storage and redirect.
        localStorage.clear();
        setIsDeleteModalOpen(false);
        navigate(`/${locale}/login`);
    };

    const renderNotificationSettings = () => {
        switch (notificationPermission) {
            case 'granted':
                return <p className="text-sm text-green-400">Notifications are enabled.</p>;
            case 'denied':
                return <p className="text-sm text-red-400">Notifications are blocked. You'll need to enable them in your browser settings.</p>;
            default:
                return (
                    <button onClick={handleEnableNotifications} className="px-4 py-2 text-sm rounded-full bg-pink-600 hover:bg-pink-700 font-semibold transition-colors">
                        Enable Notifications
                    </button>
                );
        }
    };


    return (
        <>
            <div>
                <h2 className="text-xl font-semibold">Settings</h2>
                <p className="mt-2 text-gray-400">Manage your account settings and preferences here.</p>
                <div className="mt-6 space-y-4">
                    <div className="p-4 bg-gray-800 rounded-lg flex justify-between items-center">
                        <div>
                            <h3 className="font-semibold">Push Notifications</h3>
                            <p className="text-sm text-gray-400">Receive alerts for new messages and matches.</p>
                        </div>
                        <div>
                            {renderNotificationSettings()}
                        </div>
                    </div>
                    <div className="p-4 bg-gray-800 rounded-lg">
                        <h3 className="font-semibold">Privacy</h3>
                        <p className="text-sm text-gray-400">Coming soon.</p>
                    </div>
                    <div className="p-4 bg-gray-800 rounded-lg">
                        <h3 className="font-semibold">Theme</h3>
                        <p className="text-sm text-gray-400">Coming soon.</p>
                    </div>
                </div>

                {/* Account Deletion Section */}
                <div className="mt-8 p-4 border border-red-500/50 rounded-lg bg-red-500/10">
                    <h3 className="font-semibold text-red-400">{t('delete_account')}</h3>
                    <p className="text-sm text-red-400/80 mt-1">{t('delete_account_description')}</p>
                    <button
                        onClick={() => setIsDeleteModalOpen(true)}
                        className="mt-4 px-4 py-2 text-sm rounded-full bg-red-600 hover:bg-red-700 text-white font-semibold transition-colors"
                    >
                        {t('delete_account')}
                    </button>
                </div>
            </div>
            
            <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title={t('delete_confirmation_title')}>
                <div className="text-center">
                    <p className="text-gray-300">{t('delete_confirmation_body')}</p>
                    <div className="flex justify-center gap-4 mt-6">
                        <button
                            onClick={() => setIsDeleteModalOpen(false)}
                            className="px-6 py-2 rounded-full bg-gray-600 hover:bg-gray-500 font-semibold"
                        >
                            {t('cancel')}
                        </button>
                        <button
                            onClick={handleConfirmDelete}
                            className="px-6 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white font-semibold"
                        >
                            {t('confirm_deletion')}
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default SettingsTab;