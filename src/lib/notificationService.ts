/**
 * Notification Service
 * Helper functions for creating and managing notifications
 */

import { supabase } from './supabase';

export interface NotificationData {
  user_id: string;
  type: string;
  title: string;
  message: string;
  data?: any;
  actor_id?: string;
  link?: string;
}

/**
 * Create a notification for a user
 */
export async function createNotification(notification: NotificationData) {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .insert({
        user_id: notification.user_id,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        data: notification.data || {},
        actor_id: notification.actor_id || null,
        link: notification.link || null,
        is_read: false,
      })
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('[NotificationService] Failed to create notification:', error);
    return { success: false, error };
  }
}

/**
 * Shorthand helpers for common notification types
 */

export async function notifyNewMessage(params: {
  recipient_id: string;
  sender_id: string;
  sender_name: string;
  sender_avatar?: string;
  message_preview: string;
  chat_id: string;
}) {
  return createNotification({
    user_id: params.recipient_id,
    type: 'message',
    title: `${params.sender_name} ti poslal zprávu`,
    message: params.message_preview,
    actor_id: params.sender_id,
    link: `/cs/chat/${params.sender_id}`,
    data: {
      actor_name: params.sender_name,
      actor_avatar: params.sender_avatar,
      message_preview: params.message_preview,
      chat_id: params.chat_id,
    },
  });
}

export async function notifyNewLike(params: {
  recipient_id: string;
  liker_id: string;
  liker_name: string;
  liker_avatar?: string;
}) {
  return createNotification({
    user_id: params.recipient_id,
    type: 'like',
    title: `${params.liker_name} tě lajkl`,
    message: 'Podívej se na jejich profil!',
    actor_id: params.liker_id,
    link: `/cs/profile/${params.liker_id}`,
    data: {
      actor_name: params.liker_name,
      actor_avatar: params.liker_avatar,
    },
  });
}

export async function notifyNewMatch(params: {
  recipient_id: string;
  match_id: string;
  match_name: string;
  match_avatar?: string;
}) {
  return createNotification({
    user_id: params.recipient_id,
    type: 'match',
    title: `Máš nový match s ${params.match_name}! ✨`,
    message: 'Začni konverzaci teď!',
    actor_id: params.match_id,
    link: `/cs/chat/${params.match_id}`,
    data: {
      actor_name: params.match_name,
      actor_avatar: params.match_avatar,
    },
  });
}

export async function notifyGiftReceived(params: {
  recipient_id: string;
  sender_id: string;
  sender_name: string;
  sender_avatar?: string;
  gift_type: string;
  gift_emoji: string;
}) {
  return createNotification({
    user_id: params.recipient_id,
    type: 'gift_received',
    title: `${params.sender_name} ti poslal ${params.gift_emoji}`,
    message: 'Podívej se na svůj inventář!',
    actor_id: params.sender_id,
    link: `/cs/profile/me/inventory`,
    data: {
      actor_name: params.sender_name,
      actor_avatar: params.sender_avatar,
      gift_type: params.gift_type,
      gift_emoji: params.gift_emoji,
    },
  });
}

export async function notifyProfileView(params: {
  recipient_id: string;
  viewer_id: string;
  viewer_name: string;
  viewer_avatar?: string;
}) {
  return createNotification({
    user_id: params.recipient_id,
    type: 'profile_view',
    title: `${params.viewer_name} si prohlédl tvůj profil`,
    message: 'Zajímáš ho!',
    actor_id: params.viewer_id,
    link: `/cs/profile/${params.viewer_id}`,
    data: {
      actor_name: params.viewer_name,
      actor_avatar: params.viewer_avatar,
    },
  });
}

export async function notifyNewFollower(params: {
  recipient_id: string;
  follower_id: string;
  follower_name: string;
  follower_avatar?: string;
}) {
  return createNotification({
    user_id: params.recipient_id,
    type: 'follower',
    title: `${params.follower_name} tě začal sledovat`,
    message: 'Máš nového followera!',
    actor_id: params.follower_id,
    link: `/cs/profile/${params.follower_id}`,
    data: {
      actor_name: params.follower_name,
      actor_avatar: params.follower_avatar,
    },
  });
}

export async function notifyBoostActivated(params: {
  user_id: string;
  duration_minutes: number;
  boost_type: string;
}) {
  return createNotification({
    user_id: params.user_id,
    type: 'boost_activated',
    title: `Tvůj boost byl aktivován! 🔥`,
    message: `Tvůj profil bude vidět ${params.duration_minutes} minut.`,
    link: `/cs/profile/me`,
    data: {
      duration_minutes: params.duration_minutes,
      boost_type: params.boost_type,
    },
  });
}

export async function notifyPremiumActivated(params: {
  user_id: string;
  plan_name: string;
  expires_at: string;
}) {
  return createNotification({
    user_id: params.user_id,
    type: 'premium_activated',
    title: `Vítej v Premium! 💎`,
    message: `Máš nyní přístup ke všem premium funkcím.`,
    link: `/cs/profile/me/subscription`,
    data: {
      plan_name: params.plan_name,
      expires_at: params.expires_at,
    },
  });
}

export async function notifyPayoutApproved(params: {
  user_id: string;
  amount: number;
  payout_id: string;
}) {
  return createNotification({
    user_id: params.user_id,
    type: 'payout_approved',
    title: `Výplata schválena! 💰`,
    message: `Tvoje výplata ${params.amount} Kč byla schválena a brzy bude odeslána.`,
    link: `/cs/profile/me/payout`,
    data: {
      amount: params.amount,
      payout_id: params.payout_id,
    },
  });
}

export async function notifyPayoutRejected(params: {
  user_id: string;
  amount: number;
  reason: string;
  payout_id: string;
}) {
  return createNotification({
    user_id: params.user_id,
    type: 'payout_rejected',
    title: `Výplata zamítnuta`,
    message: `Důvod: ${params.reason}`,
    link: `/cs/profile/me/payout`,
    data: {
      amount: params.amount,
      reason: params.reason,
      payout_id: params.payout_id,
    },
  });
}

/**
 * Group similar notifications (e.g., multiple likes)
 * This should be run periodically (e.g., every hour)
 */
export async function groupSimilarNotifications(
  user_id: string,
  type: string,
  time_window_hours: number = 1
) {
  try {
    const { data: notifications, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user_id)
      .eq('type', type)
      .eq('is_read', false)
      .gte('created_at', new Date(Date.now() - time_window_hours * 60 * 60 * 1000).toISOString())
      .order('created_at', { ascending: false });

    if (error) throw error;

    // If less than 3 notifications, don't group
    if (!notifications || notifications.length < 3) {
      return { success: true, grouped: false };
    }

    // Extract actors
    const actors = notifications
      .filter(n => n.actor_id && n.data?.actor_name)
      .map(n => ({
        id: n.actor_id,
        name: n.data.actor_name,
        avatar: n.data.actor_avatar,
      }));

    // Create grouped notification
    const { error: insertError } = await supabase
      .from('notifications')
      .insert({
        user_id,
        type: `${type}_group`,
        title: `${actors.length} lidi tě lajkli`,
        message: actors.slice(0, 3).map(a => a.name).join(', '),
        link: `/cs/profile/me/likes`,
        data: {
          count: actors.length,
          actors,
        },
        is_read: false,
      });

    if (insertError) throw insertError;

    // Delete individual notifications
    const { error: deleteError } = await supabase
      .from('notifications')
      .delete()
      .in('id', notifications.map(n => n.id));

    if (deleteError) throw deleteError;

    return { success: true, grouped: true, count: actors.length };
  } catch (error) {
    console.error('[NotificationService] Failed to group notifications:', error);
    return { success: false, error };
  }
}

/**
 * Mark notification as read
 */
export async function markAsRead(notification_id: string) {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true, read_at: new Date().toISOString() })
      .eq('id', notification_id);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('[NotificationService] Failed to mark as read:', error);
    return { success: false, error };
  }
}

/**
 * Mark all notifications as read for a user
 */
export async function markAllAsRead(user_id: string) {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true, read_at: new Date().toISOString() })
      .eq('user_id', user_id)
      .eq('is_read', false);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('[NotificationService] Failed to mark all as read:', error);
    return { success: false, error };
  }
}

/**
 * Get unread count for a user
 */
export async function getUnreadCount(user_id: string) {
  try {
    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user_id)
      .eq('is_read', false);

    if (error) throw error;
    return { success: true, count: count || 0 };
  } catch (error) {
    console.error('[NotificationService] Failed to get unread count:', error);
    return { success: false, count: 0, error };
  }
}
