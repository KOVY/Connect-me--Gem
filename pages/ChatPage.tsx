import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
// FIX: Import from @google/genai
import { GoogleGenAI, Chat } from '@google/genai';

import { PROFILES, GIFTS } from '../constants';
import { UserProfile, ChatMessage, Gift } from '../types';
import { useLocale } from '../contexts/LocaleContext';
import { useUser } from '../contexts/UserContext';
import { useTranslations } from '../hooks/useTranslations';
import { showLocalNotification } from '../utils/notifications';
import signalingService from '../utils/signalingService';

import ChatInterface from '../components/ChatInterface';
import GiftWall from '../components/GiftWall';
import GiftSelectionModal from '../components/GiftSelectionModal';

const ChatPage: React.FC = () => {
  // Hooks
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { locale } = useLocale();
  const { t } = useTranslations();
  const { user, isLoggedIn } = useUser();
  
  // State
  const [recipient, setRecipient] = useState<UserProfile | undefined>();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isSending, setIsSending] = useState(false);
  // In a real app, this would be persisted
  const [isChatLocked, setIsChatLocked] = useState(true); 
  const [isGiftModalOpen, setIsGiftModalOpen] = useState(false);

  // WebRTC Call State
  const [isCallActive, setIsCallActive] = useState(false);
  const [signalingData, setSignalingData] = useState(null);
  
  // Gemini AI Chat Ref
  const chatRef = useRef<Chat | null>(null);

  // Memoized Gemini API check
  const isApiKeyMissing = useMemo(() => !process.env.API_KEY, []);
  
  // Find recipient profile
  useEffect(() => {
    const profile = PROFILES.find(p => p.id === userId);
    if (profile) {
      setRecipient(profile);
    } else {
      // Handle user not found, maybe redirect after a delay
      setTimeout(() => navigate(`/${locale}/`), 3000);
    }
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

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      type: 'text',
      text: message,
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, userMessage]);
    
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

  return (
    <div className="h-full w-full max-w-5xl mx-auto p-4 flex flex-col">
      <div className="mb-4">
        <Link to={`/${locale}/`} className="text-pink-400 hover:underline text-sm">
          &larr; Back to Discovery
        </Link>
      </div>
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
            onOpenGiftModal={() => setIsGiftModalOpen(true)}
            onAddReaction={handleAddReaction}
            isCallActive={isCallActive}
            onStartCall={handleStartCall}
            onEndCall={handleEndCall}
            signalingData={signalingData}
            onSignal={handleSignal}
            disabledReason={isApiKeyMissing ? 'API_KEY' : null}
          />
        )}
      </div>
      {isGiftModalOpen && (
        <GiftSelectionModal
          recipientName={recipient.name}
          onClose={() => setIsGiftModalOpen(false)}
          onGiftSent={handleGiftSent}
        />
      )}
    </div>
  );
};

export default ChatPage;