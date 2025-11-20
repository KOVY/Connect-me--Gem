import React, { useState, useEffect } from 'react';
import { useTranslations } from '../hooks/useTranslations';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useLocale } from '../contexts/LocaleContext';
import { supabase } from '../src/lib/supabase';
import { AuthError } from '@supabase/supabase-js';

// Helper function to get user-friendly error messages
const getAuthErrorMessage = (error: AuthError | Error | any, t: (key: string) => string): string => {
    // Log full error in development only
    if (import.meta.env.DEV) {
        console.error('[Auth] Full error details:', error);
        console.error('[Auth] Error message:', error?.message);
        console.error('[Auth] Error status:', error?.status);
    }

    // Rate limit - check first (most specific)
    if (error?.status === 429 ||
        error?.message?.toLowerCase().includes('rate limit') ||
        error?.message?.toLowerCase().includes('too many requests') ||
        error?.code === 'over_request_rate_limit') {
        return t('too_many_attempts');
    }

    // Map Supabase error codes to user-friendly messages
    if (error?.status === 400) {
        return t('invalid_credentials');
    }
    if (error?.status === 422) {
        return t('invalid_email_format');
    }
    if (error?.message?.includes('Invalid login credentials')) {
        return t('invalid_credentials');
    }
    if (error?.message?.includes('Email not confirmed')) {
        return t('email_not_confirmed');
    }
    if (error?.message?.includes('User already registered')) {
        return t('email_already_exists');
    }
    if (error?.message?.includes('Password should be')) {
        return t('password_too_short');
    }

    // In dev mode, show the actual error message for debugging
    if (import.meta.env.DEV && error?.message) {
        return `${t('auth_error')} (DEV: ${error.message})`;
    }

    // Generic error message
    return t('auth_error');
};

interface LoginPageProps {
    mode?: 'login' | 'register';
}

const LoginPage: React.FC<LoginPageProps> = ({ mode }) => {
    const { t } = useTranslations();
    const { locale } = useLocale();
    const navigate = useNavigate();
    const location = useLocation();

    // Determine mode from URL path if prop not provided
    const isRegisterPage = mode === 'register' || location.pathname.includes('/register');

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSignUp, setIsSignUp] = useState(isRegisterPage);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Debug logging
    useEffect(() => {
        console.log('[LoginPage] Mode:', mode, 'Path:', location.pathname, 'isSignUp:', isSignUp);
    }, [mode, location.pathname, isSignUp]);

    // Update isSignUp when URL or mode changes
    useEffect(() => {
        const shouldBeSignUp = mode === 'register' || location.pathname.includes('/register');
        setIsSignUp(shouldBeSignUp);
        setError(null);
        setSuccessMessage(null);
    }, [mode, location.pathname]);

    // Email/Password Login
    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setSuccessMessage(null);

        console.log('[LoginPage] Submit - isSignUp:', isSignUp, 'email:', email);

        try {
            if (isSignUp) {
                // Sign Up
                console.log('[LoginPage] Attempting SIGNUP');
                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        emailRedirectTo: `${window.location.origin}/${locale}/`,
                    },
                });

                if (error) throw error;

                if (data?.user) {
                    setSuccessMessage(t('check_email_confirmation'));
                    setEmail('');
                    setPassword('');
                    // Redirect to login page after 3 seconds
                    setTimeout(() => navigate(`/${locale}/login`), 3000);
                }
            } else {
                // Sign In
                console.log('[LoginPage] Attempting SIGNIN');
                const { data, error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });

                if (error) throw error;

                if (data?.user) {
                    console.log('[LoginPage] Login successful, user:', data.user.id);
                    // Redirect to home page after successful login
                    navigate(`/${locale}/`);
                }
            }
        } catch (err: any) {
            setError(getAuthErrorMessage(err, t));
        } finally {
            setIsLoading(false);
        }
    };

    // Google OAuth
    const handleGoogleLogin = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/${locale}/`,
                },
            });

            if (error) throw error;
        } catch (err: any) {
            setError(getAuthErrorMessage(err, t));
            setIsLoading(false);
        }
    };

    // Apple OAuth
    const handleAppleLogin = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'apple',
                options: {
                    redirectTo: `${window.location.origin}/${locale}/`,
                },
            });

            if (error) throw error;
        } catch (err: any) {
            setError(getAuthErrorMessage(err, t));
            setIsLoading(false);
        }
    };

    // Password Reset
    const handlePasswordReset = async () => {
        if (!email) {
            setError(t('enter_email_first'));
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/${locale}/reset-password`,
            });

            if (error) throw error;

            setSuccessMessage(t('password_reset_sent'));
        } catch (err: any) {
            setError(getAuthErrorMessage(err, t));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-purple-900 via-pink-900 to-rose-900">
            {/* Back button */}
            <Link
                to={`/${locale}/`}
                className="absolute top-4 left-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all backdrop-blur-sm"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-white">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
            </Link>

            {/* Login Card */}
            <div className="w-full max-w-md bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20">
                {/* Logo/Title */}
                <div className="text-center mb-8">
                    <div className="text-6xl mb-4">💖</div>
                    <h1 className="text-3xl font-bold aurora-text mb-2">
                        {isSignUp ? t('create_account') : t('welcome_back')}
                    </h1>
                    <p className="text-white/60 text-sm">
                        {isSignUp ? t('join_community') : t('login_to_continue')}
                    </p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-sm">
                        {error}
                    </div>
                )}

                {/* Success Message */}
                {successMessage && (
                    <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-xl text-green-200 text-sm">
                        {successMessage}
                    </div>
                )}

                {/* Email/Password Form */}
                <form onSubmit={handleEmailLogin} className="space-y-4 mb-6">
                    <div>
                        <label className="block text-white/80 text-sm font-medium mb-2">
                            {t('email')}
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            required
                            disabled={isLoading}
                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all disabled:opacity-50"
                        />
                    </div>

                    <div>
                        <label className="block text-white/80 text-sm font-medium mb-2">
                            {t('password')}
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            disabled={isLoading}
                            minLength={6}
                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all disabled:opacity-50"
                        />
                    </div>

                    {/* Forgot Password */}
                    {!isSignUp && (
                        <div className="text-right">
                            <button
                                type="button"
                                onClick={handlePasswordReset}
                                disabled={isLoading}
                                className="text-sm text-pink-300 hover:text-pink-200 transition-colors disabled:opacity-50"
                            >
                                {t('forgot_password')}
                            </button>
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-4 px-6 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                        {isLoading ? (
                            <div className="flex items-center justify-center gap-2">
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                <span>{t('loading')}</span>
                            </div>
                        ) : (
                            isSignUp ? t('sign_up') : t('sign_in')
                        )}
                    </button>
                </form>

                {/* Divider */}
                <div className="relative mb-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-white/20"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-4 bg-transparent text-white/60">{t('or_continue_with')}</span>
                    </div>
                </div>

                {/* Social Login Buttons */}
                <div className="space-y-3 mb-6">
                    {/* Google */}
                    <button
                        onClick={handleGoogleLogin}
                        disabled={isLoading}
                        className="w-full py-3 px-4 bg-white hover:bg-gray-50 rounded-xl font-medium text-gray-700 flex items-center justify-center gap-3 transition-all border border-white/20 disabled:opacity-50"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        {t('continue_with_google')}
                    </button>

                    {/* Apple */}
                    <button
                        onClick={handleAppleLogin}
                        disabled={isLoading}
                        className="w-full py-3 px-4 bg-black hover:bg-gray-900 rounded-xl font-medium text-white flex items-center justify-center gap-3 transition-all border border-white/20 disabled:opacity-50"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                        </svg>
                        {t('continue_with_apple')}
                    </button>
                </div>

                {/* Toggle Sign In / Sign Up */}
                <div className="text-center">
                    <Link
                        to={`/${locale}/${isSignUp ? 'login' : 'register'}`}
                        className="text-white/80 hover:text-white text-sm transition-colors inline-block"
                    >
                        {isSignUp ? (
                            <>
                                {t('already_have_account')} <span className="font-semibold text-pink-300">{t('sign_in')}</span>
                            </>
                        ) : (
                            <>
                                {t('dont_have_account')} <span className="font-semibold text-pink-300">{t('sign_up')}</span>
                            </>
                        )}
                    </Link>
                </div>

                {/* Privacy Policy */}
                <p className="text-white/40 text-xs text-center mt-6">
                    {t('by_continuing_agree')} <a href="#" className="underline hover:text-white/60">{t('terms')}</a> {t('and')} <a href="#" className="underline hover:text-white/60">{t('privacy')}</a>
                </p>
            </div>

            {/* Anonymous Mode */}
            <Link
                to={`/${locale}/`}
                className="mt-6 text-white/60 hover:text-white text-sm transition-colors flex items-center gap-2"
            >
                <span>{t('continue_as_guest')}</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
            </Link>
        </div>
    );
};

export default LoginPage;
