import { User } from '../types';
import { PLACEHOLDER_AVATARS } from '../constants';

// Defines the weight of each profile field for the completeness score.
const COMPLETENESS_CHECKS: { key: keyof User | string, check: (user: User) => boolean, suggestion: string, weight: number }[] = [
    { 
        key: 'name', 
        check: (user) => !!user.name?.trim(), 
        suggestion: 'Add your name to let others know who you are.',
        weight: 1 
    },
    { 
        key: 'bio', 
        check: (user) => !!user.bio?.trim() && user.bio.length >= 20, 
        suggestion: 'Write a bio of at least 20 characters.',
        weight: 1 
    },
    { 
        key: 'occupation', 
        check: (user) => !!user.occupation?.trim(), 
        suggestion: 'Add your occupation to help others get to know you.',
        weight: 1 
    },
    { 
        key: 'interests', 
        check: (user) => user.interests.length > 0,
        suggestion: 'Add at least one interest to show your personality.',
        weight: 1 
    },
    { 
        key: 'profilePictureUrl', 
        check: (user) => !!user.profilePictureUrl && !PLACEHOLDER_AVATARS.includes(user.profilePictureUrl),
        suggestion: 'Upload a personal profile picture.',
        weight: 1 
    },
];

const TOTAL_WEIGHT = COMPLETENESS_CHECKS.reduce((sum, item) => sum + item.weight, 0);

/**
 * Calculates the profile completeness percentage based on defined checks.
 * @param user The user object.
 * @returns A number between 0 and 100.
 */
export const calculateProfileCompleteness = (user: User | null): number => {
    if (!user) return 0;

    const completedWeight = COMPLETENESS_CHECKS.reduce((sum, item) => {
        return sum + (item.check(user) ? item.weight : 0);
    }, 0);
    
    return Math.round((completedWeight / TOTAL_WEIGHT) * 100);
};

/**
 * Gets a list of suggestions for improving profile completeness.
 * @param user The user object.
 * @returns An array of string suggestions.
 */
export const getProfileCompletionSuggestions = (user: User | null): string[] => {
    if (!user) return ['Complete your profile to get started.'];
    
    const suggestions = COMPLETENESS_CHECKS
        .filter(item => !item.check(user))
        .map(item => item.suggestion);
        
    if (suggestions.length === 0) {
        return ["Your profile looks great!"];
    }
    
    return suggestions;
};