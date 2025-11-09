// Supabase Database Types
// Generated based on our schema

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      // ========================================
      // STORIES
      // ========================================
      stories: {
        Row: {
          id: string
          user_id: string
          media_url: string
          media_type: 'image' | 'video'
          caption: string | null
          created_at: string
          expires_at: string
          view_count: number
        }
        Insert: {
          id?: string
          user_id: string
          media_url: string
          media_type: 'image' | 'video'
          caption?: string | null
          created_at?: string
          expires_at?: string
          view_count?: number
        }
        Update: {
          id?: string
          user_id?: string
          media_url?: string
          media_type?: 'image' | 'video'
          caption?: string | null
          created_at?: string
          expires_at?: string
          view_count?: number
        }
      }
      story_views: {
        Row: {
          id: string
          story_id: string
          viewer_id: string
          viewed_at: string
        }
        Insert: {
          id?: string
          story_id: string
          viewer_id: string
          viewed_at?: string
        }
        Update: {
          id?: string
          story_id?: string
          viewer_id?: string
          viewed_at?: string
        }
      }
      story_reactions: {
        Row: {
          id: string
          story_id: string
          user_id: string
          emoji: string
          created_at: string
        }
        Insert: {
          id?: string
          story_id: string
          user_id: string
          emoji: string
          created_at?: string
        }
        Update: {
          id?: string
          story_id?: string
          user_id?: string
          emoji?: string
          created_at?: string
        }
      }
      // ========================================
      // GAMIFICATION
      // ========================================
      user_stats: {
        Row: {
          user_id: string
          total_likes: number
          total_matches: number
          total_messages: number
          profile_views: number
          points: number
          level: number
          daily_streak_current: number
          daily_streak_longest: number
          daily_streak_last_activity: string | null
          message_streak_current: number
          message_streak_longest: number
          message_streak_last_activity: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          total_likes?: number
          total_matches?: number
          total_messages?: number
          profile_views?: number
          points?: number
          level?: number
          daily_streak_current?: number
          daily_streak_longest?: number
          daily_streak_last_activity?: string | null
          message_streak_current?: number
          message_streak_longest?: number
          message_streak_last_activity?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          user_id?: string
          total_likes?: number
          total_matches?: number
          total_messages?: number
          profile_views?: number
          points?: number
          level?: number
          daily_streak_current?: number
          daily_streak_longest?: number
          daily_streak_last_activity?: string | null
          message_streak_current?: number
          message_streak_longest?: number
          message_streak_last_activity?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      achievements: {
        Row: {
          id: string
          name: string
          description: string
          icon: string
          category: 'social' | 'engagement' | 'streak' | 'special'
          target: number
          created_at: string
        }
        Insert: {
          id: string
          name: string
          description: string
          icon: string
          category: 'social' | 'engagement' | 'streak' | 'special'
          target: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          icon?: string
          category?: 'social' | 'engagement' | 'streak' | 'special'
          target?: number
          created_at?: string
        }
      }
      user_achievements: {
        Row: {
          id: string
          user_id: string
          achievement_id: string
          unlocked_at: string
          progress: number
        }
        Insert: {
          id?: string
          user_id: string
          achievement_id: string
          unlocked_at?: string
          progress?: number
        }
        Update: {
          id?: string
          user_id?: string
          achievement_id?: string
          unlocked_at?: string
          progress?: number
        }
      }
      // ========================================
      // MONETIZATION
      // ========================================
      credits: {
        Row: {
          user_id: string
          balance: number
          total_earned: number
          total_spent: number
          last_purchase_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          balance?: number
          total_earned?: number
          total_spent?: number
          last_purchase_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          user_id?: string
          balance?: number
          total_earned?: number
          total_spent?: number
          last_purchase_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          tier: 'free' | 'basic' | 'premium' | 'vip'
          start_date: string
          expiry_date: string | null
          auto_renew: boolean
          stripe_subscription_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          tier: 'free' | 'basic' | 'premium' | 'vip'
          start_date?: string
          expiry_date?: string | null
          auto_renew?: boolean
          stripe_subscription_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          tier?: 'free' | 'basic' | 'premium' | 'vip'
          start_date?: string
          expiry_date?: string | null
          auto_renew?: boolean
          stripe_subscription_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      transactions: {
        Row: {
          id: string
          user_id: string
          type: 'credit_purchase' | 'subscription' | 'gift_sent' | 'boost' | 'super_like'
          amount: number
          currency: string
          credits_change: number
          description: string | null
          stripe_payment_intent_id: string | null
          stripe_session_id: string | null
          status: 'pending' | 'completed' | 'failed' | 'refunded'
          metadata: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: 'credit_purchase' | 'subscription' | 'gift_sent' | 'boost' | 'super_like'
          amount: number
          currency: string
          credits_change?: number
          description?: string | null
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
          status?: 'pending' | 'completed' | 'failed' | 'refunded'
          metadata?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: 'credit_purchase' | 'subscription' | 'gift_sent' | 'boost' | 'super_like'
          amount?: number
          currency?: string
          credits_change?: number
          description?: string | null
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
          status?: 'pending' | 'completed' | 'failed' | 'refunded'
          metadata?: Json | null
          created_at?: string
        }
      }
      // ========================================
      // DISCOVERY
      // ========================================
      discovery_profiles: {
        Row: {
          id: string
          user_id: string | null
          name: string
          age: number
          gender: 'male' | 'female' | 'other'
          country: string
          language: string
          city: string | null
          occupation: string | null
          bio: string | null
          interests: string[]
          hobbies: string[]
          icebreakers: string[]
          is_ai_profile: boolean
          verified: boolean
          last_seen: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          name: string
          age: number
          gender: 'male' | 'female' | 'other'
          country: string
          language: string
          city?: string | null
          occupation?: string | null
          bio?: string | null
          interests?: string[]
          hobbies?: string[]
          icebreakers?: string[]
          is_ai_profile?: boolean
          verified?: boolean
          last_seen?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          name?: string
          age?: number
          gender?: 'male' | 'female' | 'other'
          country?: string
          language?: string
          city?: string | null
          occupation?: string | null
          bio?: string | null
          interests?: string[]
          hobbies?: string[]
          icebreakers?: string[]
          is_ai_profile?: boolean
          verified?: boolean
          last_seen?: string
          created_at?: string
        }
      }
    }
  }
}
