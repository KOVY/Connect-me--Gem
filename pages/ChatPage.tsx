import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useParams, useNavigate, Link, useSearchParams } from 'react-router-dom';
// FIX: Import from @google/genai
import { GoogleGenAI, Chat } from '@google/genai';

import { PROFILES, GIFTS } from '../constants';
import { UserProfile, ChatMessage, Gift } from '../types';
import { useLocale } from '../contexts/LocaleContext';
import { useUser } from '../contexts/UserContext';
import { useTranslations } from '../hooks/useTranslations';
import { showLocalNotification } from '../utils/notifications';
import signalingService from '../utils/signalingService';
import { supabase } from '../src/lib/supabase';

import ChatInterface from '../components/ChatInterface';
import GiftWall from '../components/GiftWall';
import GiftSelectionModal from '../components/GiftSelectionModal';
import { GiftModal } from '../components/GiftModal';
import GiftUnlockModal from '../components/GiftUnlockModal';
import MessageLimitBanner from '../components/MessageLimitBanner';
import { useMessageTracker } from '../hooks/useMessageTracker';

const ChatPage: React.FC = () => {
  // Hooks
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { locale } = useLocale();
  const { t } = useTranslations();
  const { user, isLoggedIn, getUserTier } = useUser();
  const [searchParams, setSearchParams] = useSearchParams();

  // Message tracking for FREE users
  const userTier = getUserTier();
  const messageTracker = useMessageTracker(userTier, isLoggedIn);

  // State
  const [prefilledMessage, setPrefilledMessage] = useState<string | null>(null);
  const [recipient, setRecipient] = useState<UserProfile | undefined>();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isSending, setIsSending] = useState(false);
  // In a real app, this would be persisted
  const [isChatLocked, setIsChatLocked] = useState(true);
  const [isGiftModalOpen, setIsGiftModalOpen] = useState(false);
  const [isNewGiftModalOpen, setIsNewGiftModalOpen] = useState(false);
  const [isGiftUnlockModalOpen, setIsGiftUnlockModalOpen] = useState(false);
  const [unlockModalReason, setUnlockModalReason] = useState<'cooldown' | 'daily_limit' | 'profile_limit'>('cooldown');

  // WebRTC Call State
  const [isCallActive, setIsCallActive] = useState(false);
  const [signalingData, setSignalingData] = useState(null);
  
  // Gemini AI Chat Ref
  const chatRef = useRef<Chat | null>(null);

  // Memoized Gemini API check
  const isApiKeyMissing = useMemo(() => !process.env.API_KEY, []);
  
  // Handle icebreaker message from URL parameter
  useEffect(() => {
    const messageParam = searchParams.get('message');
    if (messageParam) {
      setPrefilledMessage(decodeURIComponent(messageParam));
      // Clear the URL parameter after capturing it
      setSearchParams({});
    }
  }, [searchParams, setSearchParams]);

  // Find recipient profile (from Supabase or PROFILES fallback)
  useEffect(() => {
    const loadProfile = async () => {
      if (!userId) return;

      // Try to find in PROFILES first (for backward compatibility)
      const profileInConstants = PROFILES.find(p => p.id === userId);
      if (profileInConstants) {
        setRecipient(profileInConstants);
        return;
      }

      // Fetch from Supabase discovery_profiles
      try {
        console.log('🔍 [ChatPage] Loading profile with ID:', userId);
        const { data, error } = await supabase
          .from('discovery_profiles')
          .select('*')
          .eq('id', userId) // FIX: Changed from user_id to id
          .single();

        if (error) {
          console.error('❌ [ChatPage] Error loading profile:', error);
          throw error;
        }

        if (data) {
          console.log('✅ [ChatPage] Profile loaded:', data.name);
          setRecipient({
            id: data.id, // FIX: Use profile id, not user_id
            name: data.name,
            age: data.age,
            imageUrl: data.photo_url || 'https://via.placeholder.com/100',
            occupation: data.occupation || 'User',
            bio: data.bio || '',
            interests: data.interests || [],
            hobbies: data.hobbies || [],
            country: data.country || 'Unknown',
            lastSeen: data.last_seen || new Date().toISOString(),
            verified: data.verified || false,
            icebreakers: data.icebreakers || []
          });
        } else {
          // Handle user not found
          console.warn('⚠️ [ChatPage] Profile not found, redirecting...');
          setTimeout(() => navigate(`/${locale}/`), 3000);
        }
      } catch (error) {
        console.error('Error loading profile:', error);
        setTimeout(() => navigate(`/${locale}/`), 3000);
      }
    };

    loadProfile();
  }, [userId, navigate, locale]);

  // Initialize Gemini Chat
  useEffect(() => {
    if (!recipient || isChatLocked || isApiKeyMissing || chatRef.current || !isLoggedIn) {
        return;
    }
    
    // FIX: Initialize GoogleGenAI with named apiKey parameter as per guidelines
    const ai = new GoogleGenAI({apiKey: process.env.API_KEY!});

    const systemInstruction = `You are ${recipient.name}, a ${recipient.age}-year-old ${recipient.occupation} from ${recipient.country}. 
    Your personality is reflected in your bio: "${recipient.bio}". 
    Your interests are: ${recipient.interests.join(', ')}. 
    Your hobbies include: ${recipient.hobbies.join(', ')}.
    Your goal is to have a friendly, engaging conversation with the user, embodying this persona. 
    Keep your responses relatively short and conversational, like a text message. Do not reveal you are an AI.`;

    // FIX: Create chat session using ai.chats.create
    // FIX: Use correct model name 'gemini-2.5-flash'
    chatRef.current = ai.chats.create({
        model: 'gemini-2.5-flash', 
        history: [],
        config: {
            systemInstruction: systemInstruction,
        }
    });

  }, [recipient, isChatLocked, isApiKeyMissing, isLoggedIn]);
  
   // WebRTC Signaling Effect
  useEffect(() => {
    if (!isCallActive || !user) return;

    const listenerId = user.id;

    // Set up a listener for incoming signaling messages.
    signalingService.onMessage(listenerId, (data) => {
      setSignalingData(data);
    });

    // When the component unmounts or the call ends, remove the listener.
    return () => signalingService.removeListener(listenerId);
  }, [isCallActive, user]);


  const handleSendMessage = async (message: string) => {
    if (!chatRef.current || isSending) return;

    // Check message limits for FREE users
    if (userTier === 'free' && recipient) {
      if (!messageTracker.canMessageProfile(recipient.id)) {
        // Determine the reason for blocking
        if (messageTracker.hasDailyLimit) {
          setUnlockModalReason('daily_limit');
        } else if (messageTracker.hasProfileCooldown(recipient.id)) {
          setUnlockModalReason('cooldown');
        } else {
          setUnlockModalReason('profile_limit');
        }
        setIsGiftUnlockModalOpen(true);
        return;
      }
    }

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      type: 'text',
      text: message,
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, userMessage]);

    // Track message for FREE users
    if (userTier === 'free' && recipient) {
      messageTracker.incrementMessage(recipient.id);
    }
    
    // Simulate reading time before showing typing indicator
    const readingDelay = Math.random() * 1000 + 500; // 0.5s to 1.5s
    await new Promise(resolve => setTimeout(resolve, readingDelay));

    setIsSending(true);

    try {
        // FIX: Use sendMessageStream for a streaming response
        const stream = await chatRef.current.sendMessageStream({ message });
        
        let aiResponseText = '';
        let aiMessageId = '';

        for await (const chunk of stream) {
            // FIX: Get text directly from chunk.text property
            const chunkText = chunk.text; 
            aiResponseText += chunkText;

            if (!aiMessageId) {
                aiMessageId = `msg-ai-${Date.now()}`;
                const aiMessage: ChatMessage = {
                    id: aiMessageId,
                    sender: 'ai',
                    type: 'text',
                    text: aiResponseText,
                    timestamp: new Date().toISOString(),
                };
                setMessages(prev => [...prev, aiMessage]);
            } else {
                setMessages(prev => prev.map(m => m.id === aiMessageId ? { ...m, text: aiResponseText } : m));
            }
        }
        
        if (recipient) {
            showLocalNotification(t('new_message_title', { name: recipient.name }), {
                body: aiResponseText,
                icon: recipient.imageUrl
            });
        }

    } catch (error) {
      console.error("Gemini API error:", error);
      const errorMessage: ChatMessage = {
        id: `msg-err-${Date.now()}`,
        sender: 'system',
        type: 'text',
        text: 'Sorry, I am having trouble connecting. Please try again later.',
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsSending(false);
    }
  };

  const handleGiftSent = (giftId: string) => {
    const gift = GIFTS.find(g => g.id === giftId);
    if (!gift || !recipient) return;

    const giftMessage: ChatMessage = {
        id: `gift-${Date.now()}`,
        sender: 'user',
        type: 'gift',
        gift: gift,
        timestamp: new Date().toISOString(),
    };
    
    const systemMessage: ChatMessage = {
        id: `sys-${Date.now()}`,
        sender: 'system',
        type: 'text',
        text: 'You sent a gift and unlocked the chat!',
        timestamp: new Date().toISOString(),
    }

    setMessages(prev => [...prev, giftMessage, systemMessage]);
    setIsGiftModalOpen(false);
    setIsChatLocked(false);
    
    // Send a thank you message from the AI
    setTimeout(() => {
        const thankYouMessage: ChatMessage = {
            id: `msg-ai-${Date.now()}`,
            sender: 'ai',
            type: 'text',
            text: `Oh, wow! A ${gift.name}? Thank you so much! ${gift.icon} That's so sweet of you.`,
            timestamp: new Date().toISOString(),
        };
        setMessages(prev => [...prev, thankYouMessage]);
    }, 1000);
  };
  
  const handleAddReaction = (messageId: string, emoji: string) => {
    if (!user) return;
    setMessages(prevMessages => prevMessages.map(msg => {
        if (msg.id === messageId) {
            const newReactions = { ...(msg.reactions || {}) };
            if (!newReactions[emoji]) {
                newReactions[emoji] = [];
            }
            // Toggle reaction
            if (newReactions[emoji].includes(user.id)) {
                newReactions[emoji] = newReactions[emoji].filter(uid => uid !== user.id);
            } else {
                newReactions[emoji].push(user.id);
            }
            return { ...msg, reactions: newReactions };
        }
        return msg;
    }));
  };

  const calculateLastSeen = useCallback((isoString: string): string => {
    const now = new Date();
    const lastSeenDate = new Date(isoString);
    const diffSeconds = (now.getTime() - lastSeenDate.getTime()) / 1000;

    if (diffSeconds < 300) { // 5 minutes
      return t('online');
    }

    const timeFormat: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: 'numeric', hour12: true };
    const dateFormat: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };

    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);

    if (lastSeenDate >= today) {
      return t('last_seen_today', { time: lastSeenDate.toLocaleTimeString(locale, timeFormat) });
    }
    if (lastSeenDate >= yesterday) {
      return t('last_seen_yesterday', { time: lastSeenDate.toLocaleTimeString(locale, timeFormat) });
    }
    return t('last_seen_on', { date: lastSeenDate.toLocaleDateString(locale, dateFormat) });
  }, [locale, t]);

  
  const handleSignal = (data: any) => {
    // Send signaling data. In this mock setup where the user is in a call with an AI
    // (which has no WebRTC client), we echo the signal back to the user's own listener
    // to complete the WebRTC handshake and demonstrate the video call UI.
    if (user) {
      // The 'to' user is the user themselves, creating a loopback.
      // The 'from' property is added to more realistically mimic a signaling message.
      signalingService.send(user.id, { ...data, from: recipient?.id || 'ai-peer' });
    }
  };

  const handleStartCall = useCallback(() => setIsCallActive(true), []);
  const handleEndCall = useCallback(() => setIsCallActive(false), []);

  // RENDER LOGIC
  if (!recipient) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full">
        <p className="text-xl">User not found.</p>
        <p className="text-white/70">Redirecting you back to discovery...</p>
      </div>
    );
  }

  const handleGiftUnlock = async (giftType: 'coffee' | 'rose' | 'diamond') => {
    if (!user || !recipient) return;

    // Map gift type to actual gift from GIFTS
    const giftMap = {
      coffee: GIFTS[0], // Assuming first gift is coffee
      rose: GIFTS[1],   // Assuming second gift is rose
      diamond: GIFTS[2] // Assuming third gift is diamond
    };

    const selectedGift = giftMap[giftType];
    if (!selectedGift) {
      alert('Gift not found');
      return;
    }

    try {
      setIsGiftUnlockModalOpen(false);

      // Call send-gift edge function
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-gift`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            recipientId: recipient.id,
            giftId: selectedGift.id,
            creditCost: selectedGift.cost,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || result.error) {
        throw new Error(result.error || 'Failed to send gift');
      }

      // Success! Show success message and unlock chat
      alert(`${selectedGift.icon} ${selectedGift.name} sent successfully!`);

      // Add gift message to chat
      const giftMessage: ChatMessage = {
        id: Date.now().toString(),
        sender: 'user',
        type: 'gift',
        gift: selectedGift,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, giftMessage]);

      // Unlock chat/cooldown based on context
      // This would depend on your specific unlock logic

    } catch (error) {
      console.error('Error sending gift:', error);
      alert(`Failed to send gift: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="h-full w-full max-w-5xl mx-auto p-4 flex flex-col">
      <div className="mb-4">
        <Link to={`/${locale}/`} className="text-pink-400 hover:underline text-sm">
          &larr; Back to Discovery
        </Link>
      </div>

      {/* Message Limit Banner for FREE users */}
      {userTier === 'free' && !isChatLocked && recipient && (
        <div className="mb-4">
          <MessageLimitBanner
            messagesRemaining={messageTracker.dailyMessagesRemaining}
            profileMessagesRemaining={messageTracker.getProfileMessagesRemaining(recipient.id)}
            cooldownMinutes={messageTracker.getCooldownTime(recipient.id)}
            recipientName={recipient.name}
            onUpgradeClick={() => setIsGiftUnlockModalOpen(true)}
          />
        </div>
      )}

      <div className="flex-1 min-h-0">
        {isChatLocked ? (
          <div className="h-full flex items-center justify-center">
            <GiftWall onUnlock={() => setIsGiftModalOpen(true)} isLoggedIn={isLoggedIn} />
          </div>
        ) : (
          <ChatInterface
            messages={messages}
            onSendMessage={handleSendMessage}
            isSending={isSending}
            recipient={recipient}
            recipientLastSeenStatus={calculateLastSeen(recipient.lastSeen)}
            onOpenGiftModal={() => setIsNewGiftModalOpen(true)}
            onAddReaction={handleAddReaction}
            isCallActive={isCallActive}
            onStartCall={handleStartCall}
            onEndCall={handleEndCall}
            signalingData={signalingData}
            onSignal={handleSignal}
            disabledReason={isApiKeyMissing ? 'API_KEY' : null}
            prefilledMessage={prefilledMessage}
          />
        )}
      </div>
      {/* Old gift modal for unlocking chat */}
      {isGiftModalOpen && (
        <GiftSelectionModal
          recipientName={recipient.name}
          onClose={() => setIsGiftModalOpen(false)}
          onGiftSent={handleGiftSent}
        />
      )}

      {/* New gift modal with Edge Function integration */}
      {isNewGiftModalOpen && recipient && user && (
        <GiftModal
          isOpen={isNewGiftModalOpen}
          onClose={() => setIsNewGiftModalOpen(false)}
          recipientId={recipient.id}
          recipientName={recipient.name}
        />
      )}

      {/* Gift Unlock Modal for FREE users hitting limits */}
      {isGiftUnlockModalOpen && recipient && (
        <GiftUnlockModal
          isOpen={isGiftUnlockModalOpen}
          onClose={() => setIsGiftUnlockModalOpen(false)}
          recipient={recipient}
          reason={unlockModalReason}
          cooldownMinutes={messageTracker.getCooldownTime(recipient.id)}
          onGiftSelect={handleGiftUnlock}
        />
      )}
    </div>
  );
};

export default ChatPage;