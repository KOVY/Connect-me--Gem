import { UserProfile, Gift, CreditPackage, Reel } from './types';

// Placeholder avatars for user profile customization
export const PLACEHOLDER_AVATARS: string[] = [
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1887&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1887&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1887&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1887&auto=format&fit=crop',
];


// Mock profiles for the discovery feed
export const PROFILES: UserProfile[] = [
    {
        id: 'prof_1',
        name: 'Sophia',
        age: 28,
        imageUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1887&auto=format&fit=crop',
        occupation: 'Graphic Designer',
        bio: "Creative soul who loves painting, hiking, and finding hidden cafes. Looking for someone to share adventures and quiet moments with. Fluent in sarcasm and coffee.",
        interests: ['Art', 'Photography', 'Indie Music'],
        hobbies: ['Painting', 'Hiking', 'Trying new recipes'],
        country: 'USA',
        lastSeen: new Date(Date.now() - 1000 * 60 * 3).toISOString(), // 3 mins ago
    },
    {
        id: 'prof_2',
        name: 'Liam',
        age: 31,
        imageUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1887&auto=format&fit=crop',
        occupation: 'Software Engineer',
        bio: "Building cool things by day, exploring the city by night. I'm a big fan of live music, spicy food, and board games. Let's build a connection, one line of code at a time.",
        interests: ['Technology', 'Live Music', 'Cooking'],
        hobbies: ['Board Games', 'Rock Climbing', 'Podcasts'],
        country: 'Canada',
        lastSeen: new Date(Date.now() - 1000 * 60 * 60 * 25).toISOString(), // 25 hours ago
    },
    {
        id: 'prof_3',
        name: 'Isabella',
        age: 26,
        imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop',
        occupation: 'Chef',
        bio: "My love language is food. I believe every meal should be an experience. When I'm not in the kitchen, I'm probably tending to my garden or planning my next trip.",
        interests: ['Gastronomy', 'Travel', 'Gardening'],
        hobbies: ['Baking', 'Yoga', 'Documentaries'],
        country: 'Italy',
        lastSeen: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), // 4 hours ago
    },
     {
        id: 'prof_4',
        name: 'Noah',
        age: 30,
        imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1887&auto=format&fit=crop',
        occupation: 'Veterinarian',
        bio: "Dog dad, avid reader, and aspiring marathon runner. I can often be found at the park with my golden retriever, Leo. Looking for someone who doesn't mind a little dog hair.",
        interests: ['Animals', 'Running', 'Reading'],
        hobbies: ['Volunteering', 'Playing Guitar', 'Camping'],
        country: 'Australia',
        lastSeen: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
    }
];

// Available gifts in the application
export const GIFTS: Gift[] = [
    { id: 'gift_1', name: 'Rose', icon: '🌹', cost: 50 },
    { id: 'gift_2', name: 'Teddy Bear', icon: '🧸', cost: 150 },
];

// Credit packages available for purchase
export const CREDIT_PACKAGES: CreditPackage[] = [
  // USD
  { id: 'usd_1', credits: 100, price: 0.99, currency: 'USD' },
  { id: 'usd_2', credits: 550, price: 4.99, currency: 'USD' },
  { id: 'usd_3', credits: 1200, price: 9.99, currency: 'USD' },
  // EUR
  { id: 'eur_1', credits: 100, price: 0.99, currency: 'EUR' },
  { id: 'eur_2', credits: 550, price: 4.99, currency: 'EUR' },
  { id: 'eur_3', credits: 1200, price: 9.99, currency: 'EUR' },
  // GBP
  { id: 'gbp_1', credits: 100, price: 0.89, currency: 'GBP' },
  { id: 'gbp_2', credits: 550, price: 4.49, currency: 'GBP' },
  { id: 'gbp_3', credits: 1200, price: 8.99, currency: 'GBP' },
  // CZK
  { id: 'czk_1', credits: 100, price: 25, currency: 'CZK' },
  { id: 'czk_2', credits: 550, price: 125, currency: 'CZK' },
  { id: 'czk_3', credits: 1200, price: 250, currency: 'CZK' },
];

// Mock Reels data
export const REELS: Reel[] = [
    {
        id: 'reel_1',
        videoUrl: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4',
        description: 'Just enjoying the beautiful scenery on my hike today! 🌲☀️ #nature #hiking',
        userProfile: PROFILES[0],
    },
    {
        id: 'reel_2',
        videoUrl: 'https://test-videos.co.uk/vids/jellyfish/mp4/h264/360/Jellyfish_360_10s_1MB.mp4',
        description: 'My latest coding project is finally coming to life! #coding #developer',
        userProfile: PROFILES[1],
    },
    {
        id: 'reel_3',
        videoUrl: 'https://test-videos.co.uk/vids/sintel/mp4/h264/360/Sintel_360_10s_1MB.mp4',
        description: 'Baking up a storm this weekend. 🥐 #baking #foodie',
        userProfile: PROFILES[2],
    },
];
