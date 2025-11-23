import { describe, it, expect } from 'vitest';
import {
  calculateProfileCompleteness,
  getProfileCompletionSuggestions,
} from '../utils/profile';
import { User } from '../types';
import { PLACEHOLDER_AVATARS } from '../constants';

// Helper to create a minimal user object for testing
const createTestUser = (overrides: Partial<User> = {}): User => ({
  id: 'test-user-1',
  name: '',
  bio: '',
  occupation: '',
  interests: [],
  credits: 0,
  transactions: [],
  profilePictureUrl: '',
  avatarUrl: '',
  ...overrides,
});

describe('calculateProfileCompleteness', () => {
  describe('Empty/Null user', () => {
    it('should return 0% for null user', () => {
      const completeness = calculateProfileCompleteness(null);
      expect(completeness).toBe(0);
    });

    it('should return 0% for user with no filled fields', () => {
      const user = createTestUser();
      const completeness = calculateProfileCompleteness(user);
      expect(completeness).toBe(0);
    });
  });

  describe('Name field', () => {
    it('should add to completeness when name is provided', () => {
      const userWithName = createTestUser({ name: 'John' });
      const userWithoutName = createTestUser({ name: '' });

      expect(calculateProfileCompleteness(userWithName)).toBeGreaterThan(
        calculateProfileCompleteness(userWithoutName)
      );
    });

    it('should not count whitespace-only name', () => {
      const user = createTestUser({ name: '   ' });
      const emptyUser = createTestUser();

      expect(calculateProfileCompleteness(user)).toBe(
        calculateProfileCompleteness(emptyUser)
      );
    });
  });

  describe('Bio field', () => {
    it('should add to completeness when bio is at least 20 characters', () => {
      const userWithBio = createTestUser({ bio: 'This is a bio that is at least twenty characters long.' });
      const userWithoutBio = createTestUser();

      expect(calculateProfileCompleteness(userWithBio)).toBeGreaterThan(
        calculateProfileCompleteness(userWithoutBio)
      );
    });

    it('should not count bio shorter than 20 characters', () => {
      const userShortBio = createTestUser({ bio: 'Short bio' }); // 9 chars
      const userNoBio = createTestUser();

      expect(calculateProfileCompleteness(userShortBio)).toBe(
        calculateProfileCompleteness(userNoBio)
      );
    });

    it('should count bio with exactly 20 characters', () => {
      const user = createTestUser({ bio: '12345678901234567890' }); // exactly 20
      const emptyUser = createTestUser();

      expect(calculateProfileCompleteness(user)).toBeGreaterThan(
        calculateProfileCompleteness(emptyUser)
      );
    });
  });

  describe('Occupation field', () => {
    it('should add to completeness when occupation is provided', () => {
      const userWithOccupation = createTestUser({ occupation: 'Software Engineer' });
      const userWithoutOccupation = createTestUser();

      expect(calculateProfileCompleteness(userWithOccupation)).toBeGreaterThan(
        calculateProfileCompleteness(userWithoutOccupation)
      );
    });

    it('should not count whitespace-only occupation', () => {
      const user = createTestUser({ occupation: '   ' });
      const emptyUser = createTestUser();

      expect(calculateProfileCompleteness(user)).toBe(
        calculateProfileCompleteness(emptyUser)
      );
    });
  });

  describe('Interests field', () => {
    it('should add to completeness when at least one interest is added', () => {
      const userWithInterests = createTestUser({ interests: ['Music'] });
      const userWithoutInterests = createTestUser();

      expect(calculateProfileCompleteness(userWithInterests)).toBeGreaterThan(
        calculateProfileCompleteness(userWithoutInterests)
      );
    });

    it('should not count empty interests array', () => {
      const user = createTestUser({ interests: [] });
      const completeness = calculateProfileCompleteness(user);

      // Should be 0 or very low (only interests missing doesn't matter if everything else is missing too)
      expect(completeness).toBe(0);
    });

    it('should count multiple interests same as one interest', () => {
      const userOneInterest = createTestUser({ interests: ['Music'] });
      const userManyInterests = createTestUser({ interests: ['Music', 'Art', 'Travel'] });

      // Both should get the same credit for having interests
      expect(calculateProfileCompleteness(userOneInterest)).toBe(
        calculateProfileCompleteness(userManyInterests)
      );
    });
  });

  describe('Profile picture field', () => {
    it('should add to completeness when profile picture is not a placeholder', () => {
      const userWithPicture = createTestUser({
        profilePictureUrl: 'https://example.com/my-photo.jpg',
      });
      const userWithoutPicture = createTestUser();

      expect(calculateProfileCompleteness(userWithPicture)).toBeGreaterThan(
        calculateProfileCompleteness(userWithoutPicture)
      );
    });

    it('should not count placeholder avatar as complete', () => {
      const user = createTestUser({
        profilePictureUrl: PLACEHOLDER_AVATARS[0],
      });
      const emptyUser = createTestUser();

      expect(calculateProfileCompleteness(user)).toBe(
        calculateProfileCompleteness(emptyUser)
      );
    });

    it('should not count any placeholder avatar', () => {
      PLACEHOLDER_AVATARS.forEach((placeholder) => {
        const user = createTestUser({ profilePictureUrl: placeholder });
        const emptyUser = createTestUser();

        expect(calculateProfileCompleteness(user)).toBe(
          calculateProfileCompleteness(emptyUser)
        );
      });
    });
  });

  describe('Fully complete profile', () => {
    it('should return 100% for fully completed profile', () => {
      const completeUser = createTestUser({
        name: 'John Doe',
        bio: 'This is my bio that is definitely longer than twenty characters.',
        occupation: 'Software Engineer',
        interests: ['Music', 'Travel'],
        profilePictureUrl: 'https://example.com/my-photo.jpg',
      });

      expect(calculateProfileCompleteness(completeUser)).toBe(100);
    });
  });

  describe('Partial completion', () => {
    it('should return 20% for 1 of 5 fields completed', () => {
      const user = createTestUser({ name: 'John' });
      expect(calculateProfileCompleteness(user)).toBe(20);
    });

    it('should return 40% for 2 of 5 fields completed', () => {
      const user = createTestUser({
        name: 'John',
        occupation: 'Engineer',
      });
      expect(calculateProfileCompleteness(user)).toBe(40);
    });

    it('should return 60% for 3 of 5 fields completed', () => {
      const user = createTestUser({
        name: 'John',
        occupation: 'Engineer',
        interests: ['Music'],
      });
      expect(calculateProfileCompleteness(user)).toBe(60);
    });

    it('should return 80% for 4 of 5 fields completed', () => {
      const user = createTestUser({
        name: 'John',
        occupation: 'Engineer',
        interests: ['Music'],
        bio: 'This is a bio that is longer than twenty characters here.',
      });
      expect(calculateProfileCompleteness(user)).toBe(80);
    });
  });
});

describe('getProfileCompletionSuggestions', () => {
  describe('Null user', () => {
    it('should return generic suggestion for null user', () => {
      const suggestions = getProfileCompletionSuggestions(null);

      expect(suggestions).toContain('Complete your profile to get started.');
    });
  });

  describe('Incomplete profile suggestions', () => {
    it('should suggest adding name when missing', () => {
      const user = createTestUser({ name: '' });
      const suggestions = getProfileCompletionSuggestions(user);

      expect(suggestions.some((s) => s.toLowerCase().includes('name'))).toBe(true);
    });

    it('should suggest adding bio when missing', () => {
      const user = createTestUser({ bio: '' });
      const suggestions = getProfileCompletionSuggestions(user);

      expect(suggestions.some((s) => s.toLowerCase().includes('bio'))).toBe(true);
    });

    it('should suggest adding occupation when missing', () => {
      const user = createTestUser({ occupation: '' });
      const suggestions = getProfileCompletionSuggestions(user);

      expect(suggestions.some((s) => s.toLowerCase().includes('occupation'))).toBe(true);
    });

    it('should suggest adding interests when missing', () => {
      const user = createTestUser({ interests: [] });
      const suggestions = getProfileCompletionSuggestions(user);

      expect(suggestions.some((s) => s.toLowerCase().includes('interest'))).toBe(true);
    });

    it('should suggest uploading profile picture when missing', () => {
      const user = createTestUser({ profilePictureUrl: '' });
      const suggestions = getProfileCompletionSuggestions(user);

      expect(
        suggestions.some(
          (s) => s.toLowerCase().includes('picture') || s.toLowerCase().includes('photo')
        )
      ).toBe(true);
    });
  });

  describe('Complete profile', () => {
    it('should return positive message when profile is complete', () => {
      const completeUser = createTestUser({
        name: 'John Doe',
        bio: 'This is my bio that is definitely longer than twenty characters.',
        occupation: 'Software Engineer',
        interests: ['Music'],
        profilePictureUrl: 'https://example.com/photo.jpg',
      });

      const suggestions = getProfileCompletionSuggestions(completeUser);

      expect(suggestions).toContain('Your profile looks great!');
    });

    it('should return exactly one message when profile is complete', () => {
      const completeUser = createTestUser({
        name: 'John Doe',
        bio: 'This is my bio that is definitely longer than twenty characters.',
        occupation: 'Software Engineer',
        interests: ['Music'],
        profilePictureUrl: 'https://example.com/photo.jpg',
      });

      const suggestions = getProfileCompletionSuggestions(completeUser);

      expect(suggestions).toHaveLength(1);
    });
  });

  describe('Multiple suggestions', () => {
    it('should return multiple suggestions for empty profile', () => {
      const user = createTestUser();
      const suggestions = getProfileCompletionSuggestions(user);

      expect(suggestions.length).toBe(5); // All 5 fields missing
    });

    it('should return correct number of suggestions based on missing fields', () => {
      const userWith2Fields = createTestUser({
        name: 'John',
        occupation: 'Engineer',
      });
      const suggestions = getProfileCompletionSuggestions(userWith2Fields);

      expect(suggestions).toHaveLength(3); // 3 fields still missing
    });
  });
});
