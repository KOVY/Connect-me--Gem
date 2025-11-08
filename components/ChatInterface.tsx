import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ChatMessage, UserProfile } from '../types';
import { useTranslations } from '../hooks/useTranslations';
import { useLocale } from '../contexts/LocaleContext';
import { useUser } from '../contexts/UserContext';

type SignalingData = {
    type: 'offer' | 'answer';
    sdp: string;
} | {
    type: 'candidate';
    candidate: RTCIceCandidateInit;
};

interface ChatInterfaceProps {
    messages: ChatMessage[];
    onSendMessage: (message: string) => void;
    isSending: boolean;
    recipient: UserProfile;
    recipientLastSeenStatus?: string;
    onOpenGiftModal: () => void;
    onAddReaction: (messageId: string, emoji: string) => void;
    isCallActive: boolean;
    onStartCall: () => void;
    onEndCall: () => void;
    signalingData: SignalingData | null;
    onSignal: (data: SignalingData) => void;
    disabledReason?: 'API_KEY' | 'LOCKED' | null;
    prefilledMessage?: string | null;
}

// --- ICONS ---
const GiftIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6">
        <path d="M10 2a.75.75 0 0 1 .75.75v.518A3 3 0 0 1 12.5 5h.213a2.25 2.25 0 0 1 2.22 2.024c.09.849.043 1.71.043 2.592 0 .882-.047 1.743-.138 2.592A2.25 2.25 0 0 1 12.713 14H12.5a3 3 0 0 1-1.75-.482V15.25a.75.75 0 0 1-1.5 0v-1.232a3 3 0 0 1-1.75.482h-.213a2.25 2.25 0 0 1-2.22-1.808c-.09-.849-.043-1.71-.043-2.592 0-.882.047-1.743.138 2.592A2.25 2.25 0 0 1 7.287 7H7.5a3 3 0 0 1 1.75.482V2.75A.75.75 0 0 1 10 2ZM11 6.323a.75.75 0 0 0-1 0V9.677a.75.75 0 0 0 1 0V6.323Z" />
    </svg>
);
const SendIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-white">
        <path d="M3.105 6.187a.75.75 0 0 1 .945-.324l11.42 4.08a.75.75 0 0 1 0 1.314l-11.42 4.08a.75.75 0 0 1-.945-.99l2.224-6.862-2.224-6.862a.75.75 0 0 1 0-.656Z" />
    </svg>
);
const ReactionIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
        <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm-2.903-4.293a.75.75 0 0 1 .993-.264 13.442 13.442 0 0 0 3.82 0 .75.75 0 0 1 .729 1.257 14.943 14.943 0 0 1-5.278 0 .75.75 0 0 1-.264-.993ZM8.5 8.25a.75.75 0 0 1 .75-.75h.01a.75.75 0 0 1 .75.75v.01a.75.75 0 0 1-.75.75h-.01a.75.75 0 0 1-.75-.75v-.01ZM11.5 7.5a.75.75 0 0 0-.75.75v.01a.75.75 0 0 0 .75.75h.01a.75.75 0 0 0 .75-.75v-.01a.75.75 0 0 0-.75-.75h-.01Z" clipRule="evenodd" />
    </svg>
);
const VideoCameraIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6">
        <path d="M3.25 4A2.25 2.25 0 0 0 1 6.25v7.5A2.25 2.25 0 0 0 3.25 16h7.5A2.25 2.25 0 0 0 13 13.75v-7.5A2.25 2.25 0 0 0 10.75 4h-7.5ZM15 5.75a.75.75 0 0 0-.75.75v7a.75.75 0 0 0 1.5 0v-7a.75.75 0 0 0-.75-.75Z" />
    </svg>
);
const MuteIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 0 0 1.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.66 1.905H6.44l4.5 4.5c.945.945 2.56.276 2.56-1.06V4.06Z M18.584 14.828a.75.75 0 0 0 1.06-1.06l-1.59-1.59 1.59-1.59a.75.75 0 0 0-1.06-1.06l-1.59 1.59-1.59-1.59a.75.75 0 1 0-1.06 1.06l1.59 1.59-1.59 1.59a.75.75 0 1 0 1.06 1.06l1.59-1.59 1.59 1.59Z" />
    </svg>
);
const UnmuteIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 0 0 1.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.66 1.905H6.44l4.5 4.5c.945.945 2.56.276 2.56-1.06V4.06ZM17.25 12a.75.75 0 0 0 .75-.75 4.5 4.5 0 0 0-9 0 .75.75 0 0 0 1.5 0 3 3 0 0 1 6 0 .75.75 0 0 0 .75.75Z" />
    </svg>
);
const EndCallIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path fillRule="evenodd" d="M1.5 4.5a3 3 0 0 1 3-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 0 1-.694 2.056l-1.293.97c-.135.101-.164.298-.083.465a11.25 11.25 0 0 0 6.18 6.18c.167.08.364.052.465-.083l.97-1.293a1.875 1.875 0 0 1 2.056-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 0 1-3 3h-2.25C6.55 22.5 1.5 17.45 1.5 10.75V4.5Z" clipRule="evenodd" />
    </svg>
);
const CameraOffIcon: React.FC = () => (
     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M15.12 3.26a.75.75 0 0 1 1.053-.162l4.5 3.75a.75.75 0 0 1 0 1.324l-4.5 3.75a.75.75 0 0 1-1.215-.862L15.39 10.5H13.5a.75.75 0 0 1 0-1.5h1.89l-.518-1.038A.75.75 0 0 1 15.12 3.26ZM8.733 3.655a.75.75 0 0 1 .118 1.053L5.43 9H7.5a.75.75 0 0 1 0 1.5H5.43l3.42 4.297a.75.75 0 1 1-1.2.96l-3.5-4.375a.75.75 0 0 1 0-1.264l3.5-4.375a.75.75 0 0 1 1.053-.118Z" />
        <path fillRule="evenodd" d="M1.5 8.25a.75.75 0 0 1 .75-.75h2.25a.75.75 0 0 1 0 1.5H3v7.5h8.25V18a.75.75 0 0 1 1.5 0v.75a.75.75 0 0 1-.75.75H2.25a.75.75 0 0 1-.75-.75v-10.5ZM19.673 3.327a.75.75 0 0 1 1.054 1.054L4.38 20.727a.75.75 0 0 1-1.054-1.054L19.673 3.327Z" clipRule="evenodd" />
    </svg>
);
const ErrorIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12 text-red-400">
        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z" clipRule="evenodd" />
    </svg>
);
const SearchIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6">
        <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z" clipRule="evenodd" />
    </svg>
);
const XIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6">
        <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
    </svg>
);
const CheckmarkIcon: React.FC<{ double?: boolean; className?: string }> = ({ double = false, className = "" }) => (
    double ? (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-4 h-4 ${className}`}>
            <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
            <path fillRule="evenodd" d="M12.704 4.153a.75.75 0 0 1 .143 1.052l-6 7.5a.75.75 0 0 1-1.195-.09l-2-2.5a.75.75 0 1 1 1.176-.94l1.358 1.697 5.368-6.719a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" opacity="0.5" />
        </svg>
    ) : (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-4 h-4 ${className}`}>
            <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
        </svg>
    )
);


// --- REACTION COMPONENTS ---
const EMOJIS = ['👍', '❤️', '😂', '😯', '😢', '🙏'];
const ReactionPicker: React.FC<{ onSelect: (emoji: string) => void; className?: string; t: (key: any) => string; }> = ({ onSelect, className = '', t }) => (
    <div className={`absolute bottom-full mb-2 bg-gray-800 border border-gray-700 rounded-full p-1 flex items-center gap-1 shadow-lg z-20 ${className}`}>
        {EMOJIS.map(emoji => (
            <button key={emoji} onClick={() => onSelect(emoji)} className="text-xl p-1 rounded-full hover:bg-gray-700 transition-colors" aria-label={`${t('add_reaction')} ${emoji}`}>{emoji}</button>
        ))}
    </div>
);
const ReactionsDisplay: React.FC<{ reactions: Record<string, string[]>; alignment: 'left' | 'right' | 'center' }> = ({ reactions, alignment }) => {
    const reactionEntries = Object.entries(reactions).filter(([, users]) => users.length > 0);
    if (reactionEntries.length === 0) return null;
    const alignmentClasses = { left: 'left-4', right: 'right-4', center: 'left-1/2 -translate-x-1/2' };
    return (
        <div className={`absolute -bottom-3 flex gap-1 ${alignmentClasses[alignment]}`}>
            {reactionEntries.map(([emoji, users]) => (
                <div key={emoji} className="flex items-center bg-gray-900/80 backdrop-blur-sm border border-white/10 rounded-full px-2 py-0.5 text-xs shadow-md">
                    <span>{emoji}</span>
                    <span className="ml-1 text-white/80 font-medium">{users.length}</span>
                </div>
            ))}
        </div>
    );
};


// --- VIDEO CALL VIEW ---
interface VideoCallViewProps {
    recipient: UserProfile;
    onEndCall: () => void;
    signalingData: SignalingData | null;
    onSignal: (data: SignalingData) => void;
    t: (key: any, replacements?: Record<string, string | number>) => string;
}
const VideoCallView: React.FC<VideoCallViewProps> = ({ recipient, onEndCall, signalingData, onSignal, t }) => {
    const [isMuted, setIsMuted] = useState(false);
    const [isCameraOff, setIsCameraOff] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState<RTCPeerConnectionState>('new');
    const [callError, setCallError] = useState<string | null>(null);
    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);
    const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
    const localStreamRef = useRef<MediaStream | null>(null);

    // Effect for handling incoming signaling data
    useEffect(() => {
        if (!signalingData || !peerConnectionRef.current) return;
        
        const pc = peerConnectionRef.current;

        (async () => {
            try {
                if (signalingData.type === 'offer') {
                    await pc.setRemoteDescription(new RTCSessionDescription(signalingData));
                    const answer = await pc.createAnswer();
                    await pc.setLocalDescription(answer);
                    onSignal({ type: 'answer', sdp: answer.sdp! });
                } else if (signalingData.type === 'answer') {
                    await pc.setRemoteDescription(new RTCSessionDescription(signalingData));
                } else if (signalingData.type === 'candidate') {
                    await pc.addIceCandidate(new RTCIceCandidate(signalingData.candidate));
                }
            } catch (err) {
                 console.error("Error handling signaling data:", err);
                 setCallError(t('signaling_error'));
            }
        })();

    }, [signalingData, onSignal, t]);


    // Effect for initializing the call
    useEffect(() => {
        const servers = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };
        const pc = new RTCPeerConnection(servers);
        peerConnectionRef.current = pc;

        const startStreamAndCreateOffer = async () => {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            localStreamRef.current = stream;
            if (localVideoRef.current) {
                localVideoRef.current.srcObject = stream;
            }
            
            stream.getTracks().forEach(track => pc.addTrack(track, stream));

            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);
            onSignal({ type: 'offer', sdp: offer.sdp! });
        };

        startStreamAndCreateOffer().catch(err => {
            console.error("Error accessing media devices or starting WebRTC.", err);
            if (err.name === "NotAllowedError") {
                 setCallError(t('permission_denied_error'));
            } else if (err.name === "NotFoundError") {
                 setCallError(t('no_media_error'));
            } else {
                 setCallError(t('unexpected_call_error'));
            }
        });

        pc.ontrack = (event) => {
            if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = event.streams[0];
            }
        };

        pc.onicecandidate = (event) => {
            if (event.candidate) {
                onSignal({ type: 'candidate', candidate: event.candidate.toJSON() });
            }
        };
        
        pc.onconnectionstatechange = () => setConnectionStatus(pc.connectionState);

        return () => {
            localStreamRef.current?.getTracks().forEach(track => track.stop());
            pc?.close();
        };
    }, [onEndCall, onSignal, t]);

    const toggleMute = () => {
        if (!localStreamRef.current) return;
        localStreamRef.current.getAudioTracks().forEach(track => {
            track.enabled = !track.enabled;
        });
        setIsMuted(prev => !prev);
    };

    const toggleCamera = () => {
        if (!localStreamRef.current) return;
        localStreamRef.current.getVideoTracks().forEach(track => {
            track.enabled = !track.enabled;
        });
        setIsCameraOff(prev => !prev);
    }
    
    const getStatusText = () => {
        switch (connectionStatus) {
            case 'connected': return t('video_call_connected');
            case 'connecting': return t('video_call_connecting');
            case 'failed': return t('video_call_failed');
            default: return t('video_call_initializing');
        }
    }
    
    const hasError = !!callError || connectionStatus === 'failed';
    const errorMessage = callError || t('call_failed_default_error');

    return (
        <div className="relative h-full w-full bg-black flex items-center justify-center overflow-hidden text-white">
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${recipient.imageUrl})` }}>
                <div className="absolute inset-0 bg-black/50 backdrop-blur-2xl"></div>
            </div>

            {hasError ? (
                 <div className="absolute z-30 flex flex-col items-center text-center p-4">
                    <ErrorIcon />
                    <h3 className="text-2xl font-bold mt-4">{t('call_failed_title')}</h3>
                    <p className="text-white/80 mt-1 max-w-sm">{errorMessage}</p>
                 </div>
            ) : (
                <>
                    <video ref={remoteVideoRef} autoPlay playsInline className="h-full w-full object-cover"></video>
                    {connectionStatus !== 'connected' && (
                        <div className="absolute z-10 text-center text-white transition-opacity duration-500">
                            <img src={recipient.imageUrl} alt={recipient.name} className="w-28 h-28 rounded-full mx-auto border-4 border-white/20" />
                            <h3 className="text-3xl font-bold mt-4">{recipient.name}</h3>
                            <p className="text-white/70">{getStatusText()}</p>
                        </div>
                    )}
                    <video ref={localVideoRef} autoPlay muted playsInline className="absolute bottom-6 right-6 w-48 h-auto rounded-lg shadow-2xl border-2 border-white/20 object-cover z-20"></video>
                </>
            )}

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-4 bg-black/40 backdrop-blur-md p-3 rounded-full">
                {!hasError && (
                    <>
                        <button onClick={toggleMute} className="w-14 h-14 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors">
                            {isMuted ? <MuteIcon /> : <UnmuteIcon />}
                        </button>
                        <button onClick={toggleCamera} className="w-14 h-14 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors">
                            {isCameraOff ? <CameraOffIcon /> : <VideoCameraIcon />}
                        </button>
                    </>
                )}
                <button onClick={onEndCall} className="w-16 h-14 rounded-full flex items-center justify-center bg-red-600 hover:bg-red-700 transition-colors end-call-pulse">
                    <EndCallIcon />
                </button>
            </div>
        </div>
    );
};


// --- MAIN CHAT INTERFACE ---
const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, onSendMessage, isSending, recipient, recipientLastSeenStatus, onOpenGiftModal, onAddReaction, isCallActive, onStartCall, onEndCall, signalingData, onSignal, disabledReason = null, prefilledMessage = null }) => {
    const { t } = useTranslations();
    const { locale } = useLocale();
    const { user } = useUser();
    const [input, setInput] = useState('');
    const [activeReactionPicker, setActiveReactionPicker] = useState<string | null>(null);
    const [isSearchVisible, setIsSearchVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Handle prefilled message from icebreaker
    useEffect(() => {
        if (prefilledMessage) {
            setInput(prefilledMessage);
        }
    }, [prefilledMessage]);

    // Check if user has premium features (read receipts)
    const hasReadReceipts = user?.subscription &&
        (user.subscription.tier === 'premium' || user.subscription.tier === 'vip') &&
        new Date(user.subscription.expiryDate) > new Date();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(() => {
        if (!searchQuery) {
            scrollToBottom();
        }
    }, [messages, isSending, searchQuery]);

    const handleSend = () => {
        if (input.trim() && !isSending) {
            onSendMessage(input.trim());
            setInput('');
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    }

    const formatTimestamp = (isoString: string) => {
        const date = new Date(isoString);
        return new Intl.DateTimeFormat(locale, {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
        }).format(date);
    };

    const filteredMessages = useMemo(() => {
        if (!searchQuery.trim()) {
            return messages;
        }
        return messages.filter(msg =>
            msg.type === 'text' && msg.text?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [messages, searchQuery]);
    
    const getPlaceholder = () => {
        if (disabledReason === 'API_KEY') return t('chat_needs_api_key');
        if (disabledReason === 'LOCKED') return t('unlock_chat_placeholder');
        return t('type_your_message');
    };

    const isInputDisabled = isSending || !!disabledReason;

    const Highlight: React.FC<{ text: string; query: string }> = ({ text, query }) => {
        if (!query.trim()) return <>{text}</>;
        const parts = text.split(new RegExp(`(${query})`, 'gi'));
        return (
            <>
                {parts.map((part, i) =>
                    part.toLowerCase() === query.toLowerCase() ? (
                        <span key={i} className="bg-pink-500/50 rounded">{part}</span>
                    ) : (
                        part
                    )
                )}
            </>
        );
    };

    if (isCallActive) {
        return <VideoCallView recipient={recipient} onEndCall={onEndCall} signalingData={signalingData} onSignal={onSignal} t={t} />;
    }

    return (
        <div className="flex flex-col h-full bg-black/20 rounded-2xl overflow-hidden border border-white/10">
            <div className="p-4 bg-black/30 border-b border-white/10 flex justify-between items-center transition-all duration-300">
                {isSearchVisible ? (
                    <div className="flex items-center gap-2 w-full">
                         <input
                            type="text"
                            placeholder={t('search_placeholder')}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="flex-1 bg-gray-700 border border-gray-600 rounded-full px-4 py-1.5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
                            autoFocus
                        />
                        <button onClick={() => { setIsSearchVisible(false); setSearchQuery(''); }} className="p-2 rounded-full hover:bg-white/10 transition-colors" aria-label={t('close_search')}>
                            <XIcon />
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="text-center flex-1">
                            <h2 className="text-lg font-bold aurora-text">{t('chat_with', { name: recipient.name })}</h2>
                            {recipientLastSeenStatus && (
                                <p className="text-xs text-white/60">{recipientLastSeenStatus}</p>
                            )}
                        </div>
                        <div className="flex items-center">
                            <button onClick={() => setIsSearchVisible(true)} className="p-2 rounded-full hover:bg-white/10 transition-colors" aria-label={t('search_placeholder')}>
                                <SearchIcon />
                            </button>
                            <button onClick={onStartCall} className="p-2 rounded-full hover:bg-white/10 transition-colors" aria-label={t('start_video_call')}>
                                <VideoCameraIcon />
                            </button>
                        </div>
                    </>
                )}
            </div>
            <div className="flex-1 p-4 overflow-y-auto space-y-2">
                {filteredMessages.length > 0 ? filteredMessages.map((msg) => {
                     if (msg.type === 'gift') {
                        return (
                            <div key={msg.id} className="relative group my-4 text-center">
                                {activeReactionPicker === msg.id && (
                                    <ReactionPicker onSelect={(emoji) => { onAddReaction(msg.id, emoji); setActiveReactionPicker(null); }} className="left-1/2 -translate-x-1/2" t={t} />
                                )}
                                <div className="relative w-fit mx-auto">
                                    <div className="text-center text-pink-400 text-sm py-2 border-y border-pink-400/20">
                                        {t('you_sent_a_gift', { recipientName: recipient.name, giftName: msg.gift!.name, giftIcon: msg.gift!.icon })}
                                    </div>
                                     <div className="absolute top-1/2 -translate-y-1/2 right-0 translate-x-full pl-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => setActiveReactionPicker(activeReactionPicker === msg.id ? null : msg.id)} className="p-1 rounded-full bg-gray-600 hover:bg-gray-500 text-gray-300" aria-label={t('add_reaction')}>
                                            <ReactionIcon />
                                        </button>
                                    </div>
                                </div>
                                <div className="text-xs text-white/50 mt-1">{formatTimestamp(msg.timestamp)}</div>
                                {msg.reactions && <ReactionsDisplay reactions={msg.reactions} alignment="center" />}
                            </div>
                        )
                    }
                    if (msg.sender === 'system') {
                         return ( <div key={msg.id} className="text-center text-gray-400 text-xs my-2">{msg.text}</div> )
                    }
                    
                    const isUser = msg.sender === 'user';
                    return (
                        <div key={msg.id} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                            <div className={`flex items-end gap-2 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                                <div className="relative group">
                                    {activeReactionPicker === msg.id && (
                                        <ReactionPicker 
                                            t={t}
                                            onSelect={(emoji) => { 
                                                onAddReaction(msg.id, emoji); 
                                                setActiveReactionPicker(null); 
                                            }} 
                                        />
                                    )}
                                    <div className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-2xl ${ isUser ? 'bg-pink-600 text-white rounded-br-none' : 'bg-gray-700 text-white rounded-bl-none' }`}>
                                        <p>
                                            <Highlight text={msg.text!} query={searchQuery} />
                                        </p>
                                    </div>
                                    <div className={`absolute top-1/2 -translate-y-1/2 ${isUser ? 'left-0 -translate-x-full pr-1' : 'right-0 translate-x-full pl-1'} opacity-0 group-hover:opacity-100 transition-opacity`}>
                                        <button onClick={() => setActiveReactionPicker(activeReactionPicker === msg.id ? null : msg.id)} className="p-1 rounded-full bg-gray-600 hover:bg-gray-500 text-gray-300" aria-label={t('add_reaction')}>
                                            <ReactionIcon />
                                        </button>
                                    </div>
                                    {msg.reactions && <ReactionsDisplay reactions={msg.reactions} alignment={isUser ? 'right' : 'left'} />}
                                </div>
                            </div>
                            <div className={`text-xs text-white/50 mt-1 px-2 flex items-center gap-1 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                                <span>{formatTimestamp(msg.timestamp)}</span>
                                {isUser && hasReadReceipts && (
                                    <CheckmarkIcon
                                        double={msg.read}
                                        className={msg.read ? 'text-blue-400' : 'text-white/30'}
                                    />
                                )}
                                {isUser && !hasReadReceipts && msg.read === undefined && (
                                    <span className="text-xs text-white/30 italic ml-1" title="Upgrade to Premium to see read receipts">
                                        (Premium)
                                    </span>
                                )}
                            </div>
                        </div>
                    );
                }) : (
                    <div className="text-center text-gray-400 py-10">
                        <p>{t('no_search_results')}</p>
                    </div>
                )}
                {isSending && !searchQuery && (
                    <div className="flex justify-start">
                         <div className="max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-2xl bg-gray-700 text-white rounded-bl-none">
                            <div className="flex items-center space-x-2">
                                <span className="italic text-sm text-white/80">{t('is_typing', { name: recipient.name })}</span>
                                <div className="w-1.5 h-1.5 bg-white/80 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                                <div className="w-1.5 h-1.5 bg-white/80 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                                <div className="w-1.5 h-1.5 bg-white/80 rounded-full animate-pulse"></div>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            <div className="p-4 bg-black/30 border-t border-white/10">
                <div className="flex items-center gap-4">
                    <button onClick={onOpenGiftModal} className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center bg-gray-700 hover:bg-gray-600 transition-colors text-pink-400 disabled:opacity-50 disabled:cursor-not-allowed" aria-label={t('send_a_gift')} disabled={isInputDisabled}>
                       <GiftIcon />
                    </button>
                    <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={handleKeyPress} placeholder={getPlaceholder()} className="flex-1 bg-gray-700 border border-gray-600 rounded-full px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500" disabled={isInputDisabled} />
                    <button onClick={handleSend} disabled={!input.trim() || isInputDisabled} className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center bg-pink-600 hover:bg-pink-700 transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed" aria-label={t('send_message')}>
                       <SendIcon />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatInterface;