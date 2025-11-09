-- ========================================
-- 📸 STORIES (24h ephemeral content)
-- ========================================

CREATE TABLE public.stories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    media_url TEXT NOT NULL,
    media_type TEXT NOT NULL CHECK (media_type IN ('image', 'video')),
    caption TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '24 hours'),
    view_count INTEGER DEFAULT 0,
    CONSTRAINT stories_user_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id)
);

CREATE TABLE public.story_views (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    story_id UUID NOT NULL REFERENCES public.stories(id) ON DELETE CASCADE,
    viewer_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    viewed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(story_id, viewer_id)
);

CREATE TABLE public.story_reactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    story_id UUID NOT NULL REFERENCES public.stories(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    emoji TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(story_id, user_id)
);

-- Indexy pro stories
CREATE INDEX idx_stories_user_id ON public.stories(user_id);
CREATE INDEX idx_stories_expires_at ON public.stories(expires_at);
CREATE INDEX idx_story_views_story_id ON public.story_views(story_id);
CREATE INDEX idx_story_views_viewer_id ON public.story_views(viewer_id);

-- RLS pro stories
ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.story_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.story_reactions ENABLE ROW LEVEL SECURITY;

-- Stories: každý vidí stories od svých matchů + vlastní
CREATE POLICY "Users can view stories from matches"
    ON public.stories FOR SELECT
    USING (
        user_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM public.matches m
            WHERE (m.user1_id = auth.uid() OR m.user2_id = auth.uid())
            AND (m.user1_id = stories.user_id OR m.user2_id = stories.user_id)
            AND m.is_mutual = true
        )
    );

CREATE POLICY "Users can insert own stories"
    ON public.stories FOR INSERT
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own stories"
    ON public.stories FOR DELETE
    USING (user_id = auth.uid());

-- Story views: insert pokud auth.uid() je viewer
CREATE POLICY "Users can record story views"
    ON public.story_views FOR INSERT
    WITH CHECK (viewer_id = auth.uid());

CREATE POLICY "Users can see who viewed their stories"
    ON public.story_views FOR SELECT
    USING (
        EXISTS (SELECT 1 FROM public.stories WHERE id = story_views.story_id AND user_id = auth.uid())
    );

-- Story reactions
CREATE POLICY "Users can react to stories"
    ON public.story_reactions FOR INSERT
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can see reactions on their stories"
    ON public.story_reactions FOR SELECT
    USING (
        EXISTS (SELECT 1 FROM public.stories WHERE id = story_reactions.story_id AND user_id = auth.uid())
    );

-- ========================================
-- 🎮 GAMIFICATION (Streaks & Achievements)
-- ========================================

CREATE TABLE public.user_stats (
    user_id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
    total_likes INTEGER DEFAULT 0,
    total_matches INTEGER DEFAULT 0,
    total_messages INTEGER DEFAULT 0,
    profile_views INTEGER DEFAULT 0,
    points INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    daily_streak_current INTEGER DEFAULT 0,
    daily_streak_longest INTEGER DEFAULT 0,
    daily_streak_last_activity TIMESTAMPTZ,
    message_streak_current INTEGER DEFAULT 0,
    message_streak_longest INTEGER DEFAULT 0,
    message_streak_last_activity TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.achievements (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('social', 'engagement', 'streak', 'special')),
    target INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.user_achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    achievement_id TEXT NOT NULL REFERENCES public.achievements(id),
    unlocked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    progress INTEGER DEFAULT 0,
    UNIQUE(user_id, achievement_id)
);

-- Indexy
CREATE INDEX idx_user_stats_user_id ON public.user_stats(user_id);
CREATE INDEX idx_user_achievements_user_id ON public.user_achievements(user_id);

-- RLS
ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own stats"
    ON public.user_stats FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Users can update own stats"
    ON public.user_stats FOR UPDATE
    USING (user_id = auth.uid());

CREATE POLICY "Everyone can view achievements"
    ON public.achievements FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Users can view own achievements"
    ON public.user_achievements FOR SELECT
    USING (user_id = auth.uid());

-- ========================================
-- 💰 MONETIZATION (Credits & Subscriptions)
-- ========================================

CREATE TABLE public.credits (
    user_id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
    balance INTEGER DEFAULT 0,
    total_earned INTEGER DEFAULT 0,
    total_spent INTEGER DEFAULT 0,
    last_purchase_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    tier TEXT NOT NULL CHECK (tier IN ('free', 'basic', 'premium', 'vip')),
    start_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expiry_date TIMESTAMPTZ,
    auto_renew BOOLEAN DEFAULT false,
    stripe_subscription_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('credit_purchase', 'subscription', 'gift_sent', 'boost', 'super_like')),
    amount DECIMAL(10, 2) NOT NULL,
    currency TEXT NOT NULL,
    credits_change INTEGER DEFAULT 0,
    description TEXT,
    stripe_payment_intent_id TEXT,
    stripe_session_id TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexy
CREATE INDEX idx_credits_user_id ON public.credits(user_id);
CREATE INDEX idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX idx_subscriptions_expiry ON public.subscriptions(expiry_date);
CREATE INDEX idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX idx_transactions_stripe_payment ON public.transactions(stripe_payment_intent_id);

-- RLS
ALTER TABLE public.credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own credits"
    ON public.credits FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Users can view own subscriptions"
    ON public.subscriptions FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Users can view own transactions"
    ON public.transactions FOR SELECT
    USING (user_id = auth.uid());

-- ========================================
-- 🌍 DISCOVERY PROFILES (Localized)
-- ========================================

CREATE TABLE public.discovery_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    age INTEGER NOT NULL,
    gender TEXT NOT NULL CHECK (gender IN ('male', 'female', 'other')),
    country TEXT NOT NULL,
    language TEXT NOT NULL,
    city TEXT,
    occupation TEXT,
    bio TEXT,
    interests TEXT[],
    hobbies TEXT[],
    icebreakers TEXT[],
    is_ai_profile BOOLEAN DEFAULT false,
    verified BOOLEAN DEFAULT false,
    last_seen TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexy pro discovery
CREATE INDEX idx_discovery_country ON public.discovery_profiles(country);
CREATE INDEX idx_discovery_gender ON public.discovery_profiles(gender);
CREATE INDEX idx_discovery_age ON public.discovery_profiles(age);
CREATE INDEX idx_discovery_is_ai ON public.discovery_profiles(is_ai_profile);

-- RLS - všichni vidí profily (pro discovery)
ALTER TABLE public.discovery_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view discovery profiles"
    ON public.discovery_profiles FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Users can update own discovery profile"
    ON public.discovery_profiles FOR UPDATE
    USING (user_id = auth.uid());

-- ========================================
-- 📊 FUNCTIONS & TRIGGERS
-- ========================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_stats_updated_at
    BEFORE UPDATE ON public.user_stats
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_credits_updated_at
    BEFORE UPDATE ON public.credits
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at
    BEFORE UPDATE ON public.subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Auto-increment view count on story_views insert
CREATE OR REPLACE FUNCTION increment_story_view_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.stories
    SET view_count = view_count + 1
    WHERE id = NEW.story_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER story_view_counter
    AFTER INSERT ON public.story_views
    FOR EACH ROW
    EXECUTE FUNCTION increment_story_view_count();

-- ========================================
-- 🗑️ CLEANUP: Auto-delete expired stories
-- ========================================

CREATE OR REPLACE FUNCTION delete_expired_stories()
RETURNS void AS $$
BEGIN
    DELETE FROM public.stories
    WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Spustit jako cron job každou hodinu (Supabase Extensions → pg_cron)
-- SELECT cron.schedule('delete-expired-stories', '0 * * * *', 'SELECT delete_expired_stories()');

COMMIT;
