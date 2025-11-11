import { useState, useCallback } from 'react';
import { AIModelConfig, PersonalityType } from '../src/lib/database.types';

interface SLMChatMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

interface SLMChatResponse {
    message: string;
    error?: string;
}

interface UseSLMChatOptions {
    profileId: string;
    personality: PersonalityType;
    aiModelConfig: AIModelConfig;
    enabled?: boolean; // false pokud ještě není model připravený
}

/**
 * Hook pro komunikaci se SLM (Small Language Model)
 *
 * Tento hook je připravený pro tvůj lokálně trénovaný model.
 * Až budeš mít model připravený a nasazený na API, stačí změnit endpoint.
 *
 * @example
 * const { sendMessage, isLoading, error } = useSLMChat({
 *   profileId: 'profile-123',
 *   personality: 'friendly',
 *   aiModelConfig: profile.ai_model_config,
 *   enabled: false // Zatím vypnuto, dokud není model ready
 * });
 */
export const useSLMChat = ({
    profileId,
    personality,
    aiModelConfig,
    enabled = false
}: UseSLMChatOptions) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [conversationHistory, setConversationHistory] = useState<SLMChatMessage[]>([]);

    /**
     * Sestaví system prompt na základě personality
     */
    const getSystemPrompt = useCallback((): string => {
        if (aiModelConfig.system_prompt) {
            return aiModelConfig.system_prompt;
        }

        // Default prompts based on personality
        const personalityPrompts: Record<PersonalityType, string> = {
            friendly: 'Jsi přátelská a vstřícná osoba. Odpovídáš mile, otevřeně a ukázuješ zájem o druhého člověka.',
            professional: 'Jsi profesionální a korektní. Odpovídáš slušně, jasně a respektujícím tónem.',
            flirty: 'Jsi koketní a hravá. Občas použiješ kompliment nebo náznak flirtu, ale stále respektuješ hranice.',
            intellectual: 'Jsi inteligentní a hloubavá. Zajímají tě hlubší konverzace a philosophy života.',
            funny: 'Jsi vtipná a humorná. Ráda používáš humor a dokážeš rozesmát druhé lidi.',
            romantic: 'Jsi romantická a citlivá. Mluvíš o emocích, vztazích a hledáš hluboké spojení.',
            adventurous: 'Jsi dobrodružná a spontánní. Miluješ cestování, nové zážitky a výzvy.',
            calm: 'Jsi klidná a vyrovnaná. Odpovídáš rozvážně a přinášíš klid do konverzace.',
            energetic: 'Jsi energická a nadšená! Tvoje odpovědi jsou plné energie a pozitivity!',
            mysterious: 'Jsi trochu tajemná a záhadná. Ne vždy prozradíš všechno a rád/a nechá druhé hádat.',
        };

        return personalityPrompts[personality] || personalityPrompts.friendly;
    }, [personality, aiModelConfig]);

    /**
     * Pošle zprávu do SLM modelu
     */
    const sendMessage = useCallback(async (
        userMessage: string,
        context?: string
    ): Promise<SLMChatResponse> => {
        if (!enabled) {
            return {
                message: '',
                error: 'SLM není zatím připravený. Model se trénuje lokálně.'
            };
        }

        setIsLoading(true);
        setError(null);

        try {
            // Sestavíme conversation history
            const messages: SLMChatMessage[] = [
                {
                    role: 'system',
                    content: getSystemPrompt()
                },
                ...conversationHistory,
                {
                    role: 'user',
                    content: userMessage
                }
            ];

            // Připravíme request na SLM API
            const endpoint = aiModelConfig.model_endpoint || 'http://localhost:8000/v1/chat';

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messages,
                    temperature: aiModelConfig.temperature || 0.8,
                    max_tokens: aiModelConfig.max_tokens || 150,
                    profile_id: profileId,
                    personality,
                    context,
                    ...aiModelConfig.custom_params
                })
            });

            if (!response.ok) {
                throw new Error(`SLM API error: ${response.status}`);
            }

            const data = await response.json();
            const assistantMessage = data.message || data.response || data.text;

            // Aktualizujeme conversation history
            setConversationHistory(prev => [
                ...prev,
                { role: 'user', content: userMessage },
                { role: 'assistant', content: assistantMessage }
            ]);

            return {
                message: assistantMessage
            };

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Neznámá chyba při volání SLM';
            setError(errorMessage);
            console.error('SLM Chat Error:', err);

            return {
                message: '',
                error: errorMessage
            };
        } finally {
            setIsLoading(false);
        }
    }, [enabled, profileId, personality, aiModelConfig, conversationHistory, getSystemPrompt]);

    /**
     * Reset konverzace
     */
    const resetConversation = useCallback(() => {
        setConversationHistory([]);
        setError(null);
    }, []);

    /**
     * Fallback na Gemini API (pokud SLM není ready)
     */
    const sendMessageWithFallback = useCallback(async (
        userMessage: string,
        geminiApiKey?: string
    ): Promise<SLMChatResponse> => {
        // Pokud je SLM enabled, použij SLM
        if (enabled) {
            return sendMessage(userMessage);
        }

        // Jinak fallback na Gemini
        if (!geminiApiKey) {
            return {
                message: '',
                error: 'Gemini API klíč není nastaven a SLM není ready.'
            };
        }

        try {
            setIsLoading(true);

            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${geminiApiKey}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{
                            parts: [{
                                text: `${getSystemPrompt()}\n\nUser: ${userMessage}\nAssistant:`
                            }]
                        }]
                    })
                }
            );

            const data = await response.json();
            const message = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

            return { message };

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Chyba při volání Gemini API';
            setError(errorMessage);
            return { message: '', error: errorMessage };
        } finally {
            setIsLoading(false);
        }
    }, [enabled, sendMessage, getSystemPrompt]);

    return {
        sendMessage,
        sendMessageWithFallback,
        resetConversation,
        isLoading,
        error,
        conversationHistory,
        systemPrompt: getSystemPrompt(),
        isEnabled: enabled
    };
};
