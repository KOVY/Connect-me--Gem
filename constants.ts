// FIX: Creating constant data for the application.
import { UserProfile, Gift, CreditPackage } from './types';

const now = new Date();

export const PROFILES: UserProfile[] = [
    { id: 'cz-f-1', name: 'Eva', age: 27, bio: 'Marketing specialist living in Prague. I love art galleries, weekend trips, and a good cup of coffee.', imageUrl: 'https://images.unsplash.com/photo-1599942031688-3398c76ea1fb?q=80&w=1887&auto=format&fit=crop', country: 'Czech Republic', lastSeen: new Date(now.getTime() - 2 * 60 * 1000).toISOString() }, // 2 minutes ago
    { id: 'cz-m-1', name: 'Jan', age: 31, bio: 'IT consultant from Brno. Passionate about technology, hiking in the Beskydy mountains, and craft beer.', imageUrl: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=1887&auto=format&fit=crop', country: 'Czech Republic', lastSeen: new Date(now.getTime() - 5 * 60 * 60 * 1000).toISOString() }, // 5 hours ago
    { id: 'cz-f-2', name: 'Tereza', age: 25, bio: 'A student of architecture, I find beauty in old buildings and modern design. Also, a big fan of cinema.', imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop', country: 'Czech Republic', lastSeen: new Date(now.getTime() - 25 * 60 * 60 * 1000).toISOString() }, // Yesterday
    { id: 'cz-m-2', name: 'Petr', age: 29, bio: 'Physiotherapist who loves helping people. In my free time, you can find me cycling or trying new recipes.', imageUrl: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=1740&auto=format&fit=crop', country: 'Czech Republic', lastSeen: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString() }, // 2 days ago
    { id: 'cz-f-3', name: 'Lucie', age: 30, bio: 'Graphic designer with a love for animals and vintage fashion. Looking for someone to share quiet evenings and loud laughs with.', imageUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961&auto=format&fit=crop', country: 'Czech Republic', lastSeen: new Date(now.getTime() - 10 * 60 * 1000).toISOString() }, // 10 minutes ago
    { id: 'cz-m-3', name: 'Martin', age: 34, bio: 'Entrepreneur from Ostrava. I enjoy a fast-paced life but also cherish relaxing moments. Let\'s build something together.', imageUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1887&auto=format&fit=crop', country: 'Czech Republic', lastSeen: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString() }, // 1 week ago
    { id: 'cz-f-4', name: 'Aneta', age: 26, bio: 'I teach yoga and believe in a balanced life. Nature is my sanctuary. Searching for a kind soul with a positive outlook.', imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1888&auto=format&fit=crop', country: 'Czech Republic', lastSeen: new Date(now.getTime() - 1 * 60 * 60 * 1000).toISOString() }, // 1 hour ago
    { id: 'cz-m-4', name: 'Tomáš', age: 28, bio: 'Photographer always looking for the perfect shot. I love exploring hidden corners of the city and deep conversations.', imageUrl: 'https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?q=80&w=1740&auto=format&fit=crop', country: 'Czech Republic', lastSeen: new Date(now.getTime() - 48 * 60 * 60 * 1000).toISOString() }, // 2 days ago
    { id: 'cz-f-5', name: 'Karolína', age: 32, bio: 'Lawyer who loves to unwind with a good book or a challenging run. I value honesty and a good sense of humor.', imageUrl: 'https://images.unsplash.com/photo-1521227889354-927acec2f31c?q=80&w=1887&auto=format&fit=crop', country: 'Czech Republic', lastSeen: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString() }, // 3 days ago
    { id: 'cz-m-5', name: 'David', age: 33, bio: 'A musician at heart, playing guitar in a local band. I\'m looking for a partner for concerts and life\'s adventures.', imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1887&auto=format&fit=crop', country: 'Czech Republic', lastSeen: new Date(now.getTime() - 30 * 60 * 1000).toISOString() }, // 30 minutes ago
];

export const GIFTS: Gift[] = [
    { id: 'rose', name: 'Rose', icon: '🌹', cost: 10 },
    { id: 'ring', name: 'Ring', icon: '💍', cost: 50 },
    { id: 'teddy', name: 'Teddy Bear', icon: '🧸', cost: 25 },
];

export const CREDIT_PACKAGES: CreditPackage[] = [
    { id: 'usd_small', credits: 100, price: 4.99, currency: 'USD' },
    { id: 'usd_medium', credits: 250, price: 9.99, currency: 'USD' },
    { id: 'usd_large', credits: 600, price: 19.99, currency: 'USD' },
    { id: 'eur_small', credits: 100, price: 4.99, currency: 'EUR' },
    { id: 'eur_medium', credits: 250, price: 9.99, currency: 'EUR' },
    { id: 'eur_large', credits: 600, price: 19.99, currency: 'EUR' },
    { id: 'gbp_small', credits: 100, price: 3.99, currency: 'GBP' },
    { id: 'gbp_medium', credits: 250, price: 7.99, currency: 'GBP' },
    { id: 'gbp_large', credits: 600, price: 15.99, currency: 'GBP' },
    { id: 'czk_small', credits: 100, price: 99, currency: 'CZK' },
    { id: 'czk_medium', credits: 250, price: 249, currency: 'CZK' },
    { id: 'czk_large', credits: 600, price: 499, currency: 'CZK' },
];