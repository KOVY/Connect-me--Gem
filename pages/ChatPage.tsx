import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { GoogleGenAI, Chat } from "@google/genai";
import { UserProfile, ChatMessage, Gift } from '../types';
import { PROFILES, GIFTS } from '../constants';
import { useLocale } from '../contexts/LocaleContext';
import ChatInterface from '../components/ChatInterface';
import GiftWall from '../components/GiftWall';
import { useUser } from '../contexts/UserContext';
import GiftSelectionModal from '../components/GiftSelectionModal';
import { useTranslations } from '../hooks/useTranslations';
import { showLocalNotification } from '../utils/notifications';
import ApiKeyModal from '../components/ApiKeyModal';

// Define a type for our signaling data for clarity
type SignalingData = {
    type: 'offer' | 'answer';
    sdp: string;
} | {
    type: 'candidate';
    candidate: RTCIceCandidateInit;
};


const ChatPage: React.FC = () => {
    const { userId } = useParams<{ userId: string }>();
    const { locale } = useLocale();
    const { user, sendGift } = useUser();
    const { t } = useTranslations();
    
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isSending, setIsSending] = useState(false);
    const [isChatUnlocked, setIsChatUnlocked] = useState(false);
    const [isGiftModalOpen, setIsGiftModalOpen] = useState(false);
    const [isCallActive, setIsCallActive] = useState(false);
    const [geminiChat, setGeminiChat] = useState<Chat | null>(null);
    const [signalingData, setSignalingData] = useState<SignalingData | null>(null);
    const [apiKey, setApiKey] = useState<string | null>(null);
    const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);


    const lastSeenStatus = useMemo(() => {
        if (!profile?.lastSeen) return '';

        const lastSeenDate = new Date(profile.lastSeen);
        const now = new Date();
        const diffInMinutes = (now.getTime() - lastSeenDate.getTime()) / (1000 * 60);

        if (diffInMinutes < 5) {
            return t('online');
        }

        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
        
        const lastSeenDay = new Date(lastSeenDate.getFullYear(), lastSeenDate.getMonth(), lastSeenDate.getDate());

        const timeFormatter = new Intl.DateTimeFormat(locale, { hour: 'numeric', minute: 'numeric' });
        const dateFormatter = new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'short', day: 'numeric' });

        if (lastSeenDay.getTime() === today.getTime()) {
            return t('last_seen_today', { time: timeFormatter.format(lastSeenDate) });
        }
        if (lastSeenDay.getTime() === yesterday.getTime()) {
            return t('last_seen_yesterday', { time: timeFormatter.format(lastSeenDate) });
        }
        return t('last_seen_on', { date: dateFormatter.format(lastSeenDate) });

    }, [profile, t, locale]);

    // Effect to check for API key on mount
    useEffect(() => {
        const storedKey = localStorage.getItem('gemini_api_key');
        if (storedKey) {
            setApiKey(storedKey);
        } else {
            setIsApiKeyModalOpen(true);
        }
    }, []);

    // Effect to find profile on mount
    useEffect(() => {
        const foundProfile = PROFILES.find(p => p.id === userId);
        if (foundProfile) {
            setProfile(foundProfile);
            setMessages([
                { id: '1', sender: 'system', type: 'text', text: `You've matched with ${foundProfile.name}! Send a gift to start chatting.`, timestamp: new Date().toISOString() }
            ]);
            
            // Simulate a "new match" notification if the tab is not active
            if (document.hidden) {
                showLocalNotification(
                    t('new_match_title'),
                    {
                        body: t('new_match_body', { name: foundProfile.name }),
                        icon: foundProfile.imageUrl,
                    }
                );
            }
        }
    }, [userId, t]);
    
    // Effect to initialize Gemini chat when we have a profile AND an API key
    useEffect(() => {
        if (profile && apiKey) {
            const ai = new GoogleGenAI({ apiKey });
            const chat = ai.chats.create({
                model: 'gemini-2.5-flash',
                config: {
                     systemInstruction: `You are ${profile.name}, a ${profile.age}-year-old from ${profile.country}. Your bio is "${profile.bio}". You are on a dating app. Be friendly, engaging, and stay in character. Keep your responses brief, like a text message.`,
                }
            });
            setGeminiChat(chat);
        }
    }, [profile, apiKey]);

    const handleSaveApiKey = (key: string) => {
        localStorage.setItem('gemini_api_key', key);
        setApiKey(key);
        setIsApiKeyModalOpen(false);
    };

    const handleUnlockAndOpenModal = () => {
        setIsGiftModalOpen(true);
    };

    const handleSendGift = async (giftId: string) => {
        if (!profile) return;
        const giftToSend = GIFTS.find(g => g.id === giftId);
        if (!giftToSend) return;

        try {
            await sendGift(giftToSend, profile.name);
            setIsGiftModalOpen(false);
            
            const giftMessage: ChatMessage = {
                id: Date.now().toString(),
                sender: 'user',
                type: 'gift',
                gift: giftToSend,
                timestamp: new Date().toISOString()
            };

            if (!isChatUnlocked) {
                setIsChatUnlocked(true);
                 setMessages([giftMessage, {
                    id: Date.now().toString() + 'unlock',
                    sender: 'system',
                    type: 'text',
                    text: `You can now chat with ${profile.name}.`,
                    timestamp: new Date().toISOString()
                }]);
            } else {
                 setMessages(prev => [...prev, giftMessage]);
            }

        } catch (error) {
            console.error("Failed to send gift from ChatPage", error);
        }
    }

    const handleSendMessage = async (message: string) => {
        if (!geminiChat || !profile) return;
        if (!isChatUnlocked) {
            handleUnlockAndOpenModal();
            return;
        }

        const userMessage: ChatMessage = {
            id: Date.now().toString(),
            sender: 'user',
            type: 'text',
            text: message,
            timestamp: new Date().toISOString()
        };
        setMessages(prev => [...prev, userMessage]);
        setIsSending(true);

        try {
            const response = await geminiChat.sendMessage({ message });
            const aiResponseText = response.text;
            
            const aiMessage: ChatMessage = {
                id: Date.now().toString() + 'ai',
                sender: 'ai',
                type: 'text',
                text: aiResponseText,
                timestamp: new Date().toISOString()
            };
            setMessages(prev => [...prev, aiMessage]);

            if (document.hidden) {
                 showLocalNotification(t('new_message_title', { name: profile.name }), {
                    body: aiResponseText,
                    icon: profile.imageUrl,
                 });
            }

        } catch (error) {
            console.error('Gemini API error:', error);
            const errorMessage: ChatMessage = {
                id: Date.now().toString() + 'err',
                sender: 'system',
                type: 'text',
                text: 'Sorry, I am having trouble responding right now.',
                timestamp: new Date().toISOString()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsSending(false);
        }
    };
    
    const handleAddReaction = (messageId: string, emoji: string) => {
        if (!user) return;

        setMessages(prevMessages => 
            prevMessages.map(msg => {
                if (msg.id === messageId) {
                    const newReactions = { ...(msg.reactions || {}) };
                    const usersForEmoji = newReactions[emoji] || [];

                    if (usersForEmoji.includes(user.id)) {
                        // User has already reacted with this emoji, so remove their reaction
                        newReactions[emoji] = usersForEmoji.filter(id => id !== user.id);
                        // If no one has reacted with this emoji anymore, remove the emoji key
                        if (newReactions[emoji].length === 0) {
                            delete newReactions[emoji];
                        }
                    } else {
                        // User has not reacted with this emoji, so add their reaction
                        newReactions[emoji] = [...usersForEmoji, user.id];
                    }
                    
                    return { ...msg, reactions: newReactions };
                }
                return msg;
            })
        );
    };

    const handleStartCall = () => setIsCallActive(true);
    const handleEndCall = () => {
        setIsCallActive(false);
        setSignalingData(null); // Reset signaling data on call end
    };
    
    // This function simulates a signaling server.
    const handleSignal = (data: SignalingData) => {
        console.log('[SIGNALING] Sent:', data);
        // In a real app, this would send data over a WebSocket.
        // Here, we simulate the "other peer" receiving it after a short delay.
        setTimeout(() => {
            console.log('[SIGNALING] Received:', data);
            setSignalingData(data);
        }, 500);
    };

    if (!profile) {
        return <div className="p-8 text-center">User not found.</div>;
    }

    return (
        <>
            <div className="h-full w-full flex flex-col md:flex-row overflow-hidden">
                <div className="w-full md:w-1/3 h-1/3 md:h-full bg-cover bg-center flex-shrink-0" style={{ backgroundImage: `url(${profile.imageUrl})` }}>
                    <div className="h-full w-full bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 flex flex-col justify-between text-white">
                        <div>
                            <Link to={`/${locale}/`} className="text-white/80 hover:text-white transition-colors text-sm">
                                &larr; Back to Discovery
                            </Link>
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold">{profile.name}, {profile.age}</h1>
                            <p className="text-lg mt-1 opacity-90">{profile.bio}</p>
                        </div>
                    </div>
                </div>

                <div className="flex-1 flex flex-col p-4 md:p-6 overflow-hidden">
                    <div className="relative flex-1 flex flex-col justify-center">
                        {!isChatUnlocked && !isCallActive && (
                            <div className="absolute inset-0 flex items-center justify-center z-10">
                                <GiftWall onUnlock={handleUnlockAndOpenModal} />
                            </div>
                        )}
                        <div className={`transition-all duration-500 h-full ${!isChatUnlocked && !isCallActive ? 'blur-md' : ''}`}>
                            <ChatInterface 
                                messages={messages}
                                onSendMessage={handleSendMessage}
                                isSending={isSending}
                                recipient={profile}
                                recipientLastSeenStatus={lastSeenStatus}
                                onOpenGiftModal={() => setIsGiftModalOpen(true)}
                                onAddReaction={handleAddReaction}
                                isCallActive={isCallActive}
                                onStartCall={handleStartCall}
                                onEndCall={handleEndCall}
                                signalingData={signalingData}
                                onSignal={handleSignal}
                                isChatDisabled={!apiKey}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {isGiftModalOpen && (
                <GiftSelectionModal 
                    recipientName={profile.name}
                    onClose={() => setIsGiftModalOpen(false)}
                    onGiftSent={handleSendGift}
                />
            )}

            <ApiKeyModal
                isOpen={isApiKeyModalOpen}
                onClose={() => setIsApiKeyModalOpen(false)}
                onSave={handleSaveApiKey}
            />
        </>
    );
};

export default ChatPage;