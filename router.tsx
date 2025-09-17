// FIX: Creating the main application router.
import { createBrowserRouter } from "react-router-dom";
import RootRedirect from "./components/RootRedirect";
import LocaleLayout from "./components/LocaleLayout";
import DiscoveryPage from "./pages/DiscoveryPage";
import ChatPage from "./pages/ChatPage";
import ProfileHubPage from "./pages/ProfileHubPage";
import PublicProfilePage from "./pages/PublicProfilePage";
import LoginPage from "./pages/LoginPage";
import OnboardingPage from "./pages/OnboardingPage";
import NotFoundPage from "./pages/NotFoundPage";

// Hub Tabs
import OverviewTab from "./components/tabs/OverviewTab";
import MyProfileTab from "./components/tabs/MyProfileTab";
import ShopTab from "./components/tabs/ShopTab";
import HistoryTab from "./components/tabs/HistoryTab";
import AnalyticsTab from "./components/tabs/AnalyticsTab";
import SettingsTab from "./components/tabs/SettingsTab";
import PaymentMethodsTab from "./components/tabs/PaymentMethodsTab";


export const router = createBrowserRouter([
    {
        path: "/",
        element: <RootRedirect />,
        errorElement: <NotFoundPage />
    },
    {
        path: "/:locale",
        element: <LocaleLayout />,
        children: [
            {
                index: true,
                element: <DiscoveryPage />,
            },
            {
                path: "match/:userId",
                element: <ChatPage />,
            },
            {
                path: "profile/:userId",
                element: <PublicProfilePage />,
            },
            {
                path: "profile/me",
                element: <ProfileHubPage />,
                children: [
                    { index: true, element: <OverviewTab /> },
                    { path: "profile", element: <MyProfileTab /> },
                    { path: "shop", element: <ShopTab /> },
                    { path: "history", element: <HistoryTab /> },
                    { path: "analytics", element: <AnalyticsTab /> },
                    { path: "settings", element: <SettingsTab /> },
                    { path: "payments", element: <PaymentMethodsTab /> },
                ]
            },
            {
                path: "login",
                element: <LoginPage />,
            },
            {
                path: "onboarding",
                element: <OnboardingPage />,
            },
        ]
    }
]);
