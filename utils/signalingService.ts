type SignalingData = {
    type: 'offer' | 'answer';
    sdp: string;
} | {
    type: 'candidate';
    candidate: RTCIceCandidateInit;
};

// Add a 'from' property to simulate a real message from another peer.
type SignalingMessage = SignalingData & {
    from: string;
};

/**
 * A mock signaling service that simulates a WebSocket server connection for WebRTC.
 * In a real-world application, this service would manage a persistent WebSocket
 * connection. This implementation uses an in-memory map to route messages,
 * which is useful for demonstrating the WebRTC flow without a backend.
 */
class SignalingService {
    // Maps a user ID to their message callback function.
    private listeners: Map<string, (data: SignalingMessage) => void> = new Map();

    /**
     * Sends a signaling message to a specific user.
     * @param toUserId The ID of the user to send the message to.
     * @param data The signaling data to send.
     */
    public send(toUserId: string, data: SignalingMessage) {
        // Simulate network delay to mimic real-world conditions.
        setTimeout(() => {
            const listener = this.listeners.get(toUserId);
            if (listener) {
                // If a listener is found for the target user, invoke it.
                listener(data);
            } else {
                console.warn(`[SignalingService] No listener for user ${toUserId}. Message dropped.`);
            }
        }, 300); // 300ms simulated latency.
    }

    /**
     * Registers a callback to handle incoming signaling messages for a user.
     * @param userId The ID of the user who is listening.
     * @param callback The function to call when a message is received.
     */
    public onMessage(userId: string, callback: (data: SignalingMessage) => void) {
        this.listeners.set(userId, callback);
    }

    /**
     * Removes the message listener for a user. This should be called when
     * a call ends or the component unmounts to prevent memory leaks.
     * @param userId The ID of the user to remove the listener for.
     */
    public removeListener(userId: string) {
        this.listeners.delete(userId);
    }
}

// Export a singleton instance so the same "connection" is shared across the app.
const signalingService = new SignalingService();
export default signalingService;
