-- ========================================
-- 🏆 SEED: Achievements (Gamification)
-- ========================================

-- Insert achievement categories
INSERT INTO public.achievements (id, name, description, category, icon, requirement_type, requirement_value, points_reward) VALUES
-- === PROFILE ACHIEVEMENTS ===
('ach_001', 'First Impression', 'Complete your profile with a photo and bio', 'profile', '✨', 'profile_complete', 1, 50),
('ach_002', 'Show Off', 'Add 5 photos to your profile', 'profile', '📸', 'photos_uploaded', 5, 100),
('ach_003', 'Verified', 'Get your profile verified', 'profile', '✓', 'verified', 1, 200),
('ach_004', 'Trendsetter', 'Post your first Story', 'profile', '🎬', 'stories_posted', 1, 75),
('ach_005', 'Popular', 'Get 100 profile views', 'profile', '👀', 'profile_views', 100, 150),

-- === MATCHING ACHIEVEMENTS ===
('ach_101', 'First Like', 'Send your first like', 'matching', '💙', 'likes_sent', 1, 25),
('ach_102', 'Liked Back', 'Receive your first like', 'matching', '💕', 'likes_received', 1, 25),
('ach_103', 'It''s a Match!', 'Get your first match', 'matching', '💘', 'matches', 1, 100),
('ach_104', 'Matchmaker', 'Get 10 matches', 'matching', '🔥', 'matches', 10, 250),
('ach_105', 'Heartbreaker', 'Get 50 matches', 'matching', '💖', 'matches', 50, 500),
('ach_106', 'Love Magnet', 'Get 100 matches', 'matching', '🧲', 'matches', 100, 1000),
('ach_107', 'Picky', 'Like 100 profiles', 'matching', '🎯', 'likes_sent', 100, 200),

-- === CONVERSATION ACHIEVEMENTS ===
('ach_201', 'Icebreaker', 'Send your first message', 'conversation', '👋', 'messages_sent', 1, 50),
('ach_202', 'Conversationalist', 'Send 50 messages', 'conversation', '💬', 'messages_sent', 50, 150),
('ach_203', 'Chatterbox', 'Send 200 messages', 'conversation', '🗨️', 'messages_sent', 200, 300),
('ach_204', 'Social Butterfly', 'Send 500 messages', 'conversation', '🦋', 'messages_sent', 500, 750),
('ach_205', 'Quick Reply', 'Reply within 1 minute 10 times', 'conversation', '⚡', 'quick_replies', 10, 200),
('ach_206', 'Night Owl', 'Send a message after midnight', 'conversation', '🦉', 'night_messages', 1, 100),
('ach_207', 'Early Bird', 'Send a message before 6 AM', 'conversation', '🐦', 'morning_messages', 1, 100),

-- === STREAK ACHIEVEMENTS ===
('ach_301', 'Getting Started', 'Login for 3 days in a row', 'streak', '🔥', 'daily_streak', 3, 100),
('ach_302', 'Committed', 'Login for 7 days in a row', 'streak', '📅', 'daily_streak', 7, 250),
('ach_303', 'Dedicated', 'Login for 14 days in a row', 'streak', '⭐', 'daily_streak', 14, 500),
('ach_304', 'Unstoppable', 'Login for 30 days in a row', 'streak', '💪', 'daily_streak', 30, 1000),
('ach_305', 'Legend', 'Login for 100 days in a row', 'streak', '👑', 'daily_streak', 100, 5000),
('ach_306', 'Engaged', 'Message 3 days in a row', 'streak', '💌', 'message_streak', 3, 150),
('ach_307', 'Consistent', 'Message 7 days in a row', 'streak', '📬', 'message_streak', 7, 300),

-- === ENGAGEMENT ACHIEVEMENTS ===
('ach_401', 'Generous', 'Send your first micro-gift', 'engagement', '🎁', 'gifts_sent', 1, 100),
('ach_402', 'Gift Giver', 'Send 10 micro-gifts', 'engagement', '🎀', 'gifts_sent', 10, 300),
('ach_403', 'Santa Claus', 'Send 50 micro-gifts', 'engagement', '🎅', 'gifts_sent', 50, 1000),
('ach_404', 'Appreciated', 'Receive 10 micro-gifts', 'engagement', '💝', 'gifts_received', 10, 250),
('ach_405', 'Story Watcher', 'View 50 Stories', 'engagement', '👁️', 'stories_viewed', 50, 150),
('ach_406', 'Story Star', 'Get 100 Story views', 'engagement', '⭐', 'story_views_received', 100, 300),
('ach_407', 'Reactor', 'React to 25 Stories', 'engagement', '❤️', 'story_reactions_sent', 25, 100),

-- === PREMIUM ACHIEVEMENTS ===
('ach_501', 'VIP', 'Subscribe to Premium', 'premium', '💎', 'premium_subscription', 1, 500),
('ach_502', 'Supporter', 'Make your first purchase', 'premium', '💳', 'purchase', 1, 200),
('ach_503', 'Credit Collector', 'Earn 1000 credits', 'premium', '🪙', 'credits_earned', 1000, 250),
('ach_504', 'Boosted', 'Use your first Boost', 'premium', '🚀', 'boosts_used', 1, 150),
('ach_505', 'Super Star', 'Send 10 Super Likes', 'premium', '⭐', 'super_likes_sent', 10, 200),

-- === SPECIAL ACHIEVEMENTS ===
('ach_601', 'Early Adopter', 'Join during beta period', 'special', '🎉', 'early_adopter', 1, 1000),
('ach_602', 'Influencer', 'Refer 5 friends', 'special', '📣', 'referrals', 5, 500),
('ach_603', 'Ambassador', 'Refer 20 friends', 'special', '🌟', 'referrals', 20, 2000),
('ach_604', 'Quiz Master', 'Complete the compatibility quiz', 'special', '🧠', 'quiz_complete', 1, 100),
('ach_605', 'Perfect Match', 'Find a 95%+ compatibility match', 'special', '💯', 'high_compatibility', 1, 300),
('ach_606', 'Global Citizen', 'Match with someone from another country', 'special', '🌍', 'international_match', 1, 200),
('ach_607', 'Polyglot', 'Chat in 3 different languages', 'special', '🗣️', 'languages_used', 3, 400);

-- Verify insertion
SELECT
    category,
    COUNT(*) as achievement_count,
    SUM(points_reward) as total_points
FROM public.achievements
GROUP BY category
ORDER BY category;

COMMIT;
