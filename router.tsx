import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import RootRedirect from './components/RootRedirect';
import LocaleLayout from './components/LocaleLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import DiscoveryPage from './pages/DiscoveryPage';
import ReelsPage from './pages/ReelsPage';
import ChatPage from './pages/ChatPage';
import PublicProfilePage from './pages/PublicProfilePage';
import ProfileHubPage from './pages/ProfileHubPage';
import LoginPage from './pages/LoginPage';
import OnboardingPage from './pages/OnboardingPage';
import NotFoundPage from './pages/NotFoundPage';

// Profile Hub Tabs
import OverviewTab from './components/tabs/OverviewTab';
import MyProfileTab from './components/tabs/MyProfileTab';
import LikesTab from './components/tabs/LikesTab';
import SubscriptionTab from './components/tabs/SubscriptionTab';
import ShopTab from './components/tabs/ShopTab';
import HistoryTab from './components/tabs/HistoryTab';
import AnalyticsTab from './components/tabs/AnalyticsTab';
import PaymentMethodsTab from './components/tabs/PaymentMethodsTab';
import SettingsTab from './components/tabs/SettingsTab';
import { PayoutPage } from './src/pages/PayoutPage';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        errorElement: <NotFoundPage />,
        children: [
            {
                index: true,
                element: <RootRedirect />
            },
            {
                path: ':locale',
                element: <LocaleLayout />,
                children: [
                    {
                        index: true,
                        element: <DiscoveryPage />
                    },
                    {
                        path: 'reels',
                        element: <ReelsPage />
                    },
                    {
                        path: 'chat/:userId',
                        element: <ChatPage />
                    },
                    {
                        path: 'profile/me',
                        element: <ProtectedRoute />,
                        children: [
                            {
                                element: <ProfileHubPage />,
                                children: [
                                    { index: true, element: <OverviewTab /> },
                                    { path: 'profile', element: <MyProfileTab /> },
                                    { path: 'likes', element: <LikesTab /> },
                                    { path: 'subscription', element: <SubscriptionTab /> },
                                    { path: 'shop', element: <ShopTab /> },
                                    { path: 'payout', element: <PayoutPage /> },
                                    { path: 'history', element: <HistoryTab /> },
                                    { path: 'analytics', element: <AnalyticsTab /> },
                                    { path: 'payments', element: <PaymentMethodsTab /> },
                                    { path: 'settings', element: <SettingsTab /> },
                                ]
                            }
                        ]
                    },
                    {
                        path: 'profile/:userId',
                        element: <PublicProfilePage />
                    },
                    {
                        path: 'login',
                        element: <LoginPage />
                    },
                    {
                        path: 'onboarding',
                        element: <OnboardingPage />
                    },
                ]
            },
        ]
    }
]);
