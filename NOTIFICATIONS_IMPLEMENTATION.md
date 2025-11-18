# 🔔 Notification System - Implementation Guide

> **Status:** ✅ Implemented & Ready to Use

---

## 📋 Přehled

Kompletní in-app notification systém se zvonečkem v navigaci. Minimalizuje email spam pomocí real-time notifikací.

### ✅ Co je implementováno:

1. **Database Schema** - Notifications tabulka s RLS policies
2. **React Komponenty** - NotificationBell, NotificationDropdown, NotificationItem
3. **Helper Service** - notificationService.ts s pomocnými funkcemi
4. **CSS Animace** - Wiggle & slideDown animace
5. **Real-time Updates** - Supabase Realtime integrace
6. **FloatingGlassNav integrace** - Zvoneček mezi kredity a menu

---

## 🚀 Rychlý Start

### 1. Spusť Database Migration

```bash
# V Supabase dashboard nebo CLI
supabase db push
```

Migrations:
- `013_add_notifications_system.sql` - Základní notifications tabulka
- `015_enhance_notifications_for_bell.sql` - Rozšíření o actor_id, link, další typy

### 2. Enable Realtime

V Supabase Dashboard:
```
Settings → API → Realtime → Enable for 'notifications' table
```

Nebo SQL:
```sql
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
```

### 3. Testuj Notifikace

```typescript
import { notifyNewMessage, notifyNewLike, notifyNewMatch } from './src/lib/notificationService';

// Příklad: Nová zpráva
await notifyNewMessage({
  recipient_id: 'user-123',
  sender_id: 'user-456',
  sender_name: 'Jan Novák',
  sender_avatar: 'https://...',
  message_preview: 'Ahoj, jak se máš?',
  chat_id: 'chat-789',
});

// Příklad: Nový lajk
await notifyNewLike({
  recipient_id: 'user-123',
  liker_id: 'user-456',
  liker_name: 'Marie Svobodová',
  liker_avatar: 'https://...',
});

// Příklad: Nový match
await notifyNewMatch({
  recipient_id: 'user-123',
  match_id: 'user-456',
  match_name: 'Petra Nová',
  match_avatar: 'https://...',
});
```

---

## 📁 Soubory & Struktura

### Database:
```
/supabase/migrations/
  ├── 013_add_notifications_system.sql
  └── 015_enhance_notifications_for_bell.sql
```

### React Komponenty:
```
/components/
  ├── NotificationBell.tsx         # Zvoneček s badge
  ├── NotificationDropdown.tsx     # Dropdown panel
  └── NotificationItem.tsx         # Jednotlivá notifikace
```

### Services:
```
/src/lib/
  └── notificationService.ts       # Helper funkce
```

### Styling:
```
/tailwind.config.js                # Wiggle & slideDown animace
/src/index.css                     # Custom scrollbar
```

---

## 🎨 Komponenty

### NotificationBell

Zobrazuje zvoneček s badge počtu nepřečtených notifikací.

**Features:**
- Real-time updates přes Supabase Realtime
- Wiggle animace při nové notifikaci
- Badge s počtem (max "9+")
- Kliknutí otevře dropdown

**Props:** Žádné (používá `useUser` context)

**Umístění:** FloatingGlassNav mezi kredity a menu

---

### NotificationDropdown

Dropdown panel se seznamem notifikací.

**Features:**
- Max height 500px s custom scrollbarem
- "Vše přečteno" tlačítko
- Loading state
- Empty state
- Link na full notifications page

**Props:**
```typescript
{
  notifications: Notification[];
  isLoading: boolean;
  onClose: () => void;
  onMarkAllRead: () => void;
}
```

---

### NotificationItem

Zobrazuje jednotlivou notifikaci.

**Features:**
- Avatar nebo emoji ikona
- Title & message
- Preview text (u zpráv)
- Relative time (formatDistanceToNow)
- Unread indicator (blue dot)
- Click handler (mark as read + navigate)

**Props:**
```typescript
{
  notification: Notification;
  onClick: () => void;
}
```

---

## 🛠️ Notification Service API

### Základní funkce:

#### createNotification(data)
```typescript
import { createNotification } from './src/lib/notificationService';

await createNotification({
  user_id: 'user-123',
  type: 'message',
  title: 'Jan ti poslal zprávu',
  message: 'Ahoj, jak se máš?',
  actor_id: 'user-456',
  link: '/cs/chat/user-456',
  data: {
    actor_name: 'Jan Novák',
    actor_avatar: 'https://...',
    message_preview: 'Ahoj, jak se máš?',
  },
});
```

### Helper funkce:

#### notifyNewMessage
```typescript
await notifyNewMessage({
  recipient_id: string;
  sender_id: string;
  sender_name: string;
  sender_avatar?: string;
  message_preview: string;
  chat_id: string;
});
```

#### notifyNewLike
```typescript
await notifyNewLike({
  recipient_id: string;
  liker_id: string;
  liker_name: string;
  liker_avatar?: string;
});
```

#### notifyNewMatch
```typescript
await notifyNewMatch({
  recipient_id: string;
  match_id: string;
  match_name: string;
  match_avatar?: string;
});
```

#### notifyGiftReceived
```typescript
await notifyGiftReceived({
  recipient_id: string;
  sender_id: string;
  sender_name: string;
  sender_avatar?: string;
  gift_type: string;
  gift_emoji: string;
});
```

#### notifyProfileView
```typescript
await notifyProfileView({
  recipient_id: string;
  viewer_id: string;
  viewer_name: string;
  viewer_avatar?: string;
});
```

#### notifyNewFollower
```typescript
await notifyNewFollower({
  recipient_id: string;
  follower_id: string;
  follower_name: string;
  follower_avatar?: string;
});
```

#### notifyBoostActivated
```typescript
await notifyBoostActivated({
  user_id: string;
  duration_minutes: number;
  boost_type: string;
});
```

#### notifyPremiumActivated
```typescript
await notifyPremiumActivated({
  user_id: string;
  plan_name: string;
  expires_at: string;
});
```

### Utility funkce:

#### markAsRead
```typescript
await markAsRead(notification_id: string);
```

#### markAllAsRead
```typescript
await markAllAsRead(user_id: string);
```

#### getUnreadCount
```typescript
const { count } = await getUnreadCount(user_id: string);
```

#### groupSimilarNotifications
```typescript
// Group likes within last hour (run via cron job)
await groupSimilarNotifications(
  user_id: string,
  type: 'like',
  time_window_hours: 1
);
```

---

## 📊 Notification Types

| Type | Icon | Kdy vytvořit | Link |
|------|------|--------------|------|
| `message` | 💬 | Nová zpráva | `/chat/{sender_id}` |
| `like` | ❤️ | Někdo lajkl | `/profile/{liker_id}` |
| `like_group` | ❤️ | 3+ lajků za hodinu | `/profile/me/likes` |
| `match` | ✨ | Nový match | `/chat/{match_id}` |
| `gift_received` | 🎁 | Obdržel dárek | `/profile/me/inventory` |
| `profile_view` | 👀 | Návštěva profilu | `/profile/{viewer_id}` |
| `follower` | ⭐ | Nový follower | `/profile/{follower_id}` |
| `boost_activated` | 🔥 | Boost aktivován | `/profile/me` |
| `premium_activated` | 💎 | Premium aktivováno | `/profile/me/subscription` |
| `payout_approved` | 💰 | Výplata schválena | `/profile/me/payout` |
| `payout_rejected` | ❌ | Výplata zamítnuta | `/profile/me/payout` |

---

## 🔗 Integrace do Existujícího Kódu

### 1. Při odeslání zprávy

```typescript
// V ChatInterface nebo message handler
import { notifyNewMessage } from '../src/lib/notificationService';

async function sendMessage(text: string, recipientId: string) {
  // ... send message logic ...

  // Notify recipient
  await notifyNewMessage({
    recipient_id: recipientId,
    sender_id: currentUser.id,
    sender_name: currentUser.name,
    sender_avatar: currentUser.avatar_url,
    message_preview: text.substring(0, 100),
    chat_id: chatId,
  });
}
```

### 2. Při lajkování

```typescript
// V DiscoveryActions nebo like handler
import { notifyNewLike } from '../src/lib/notificationService';

async function likeProfile(profileId: string) {
  // ... like logic ...

  // Notify profile owner
  await notifyNewLike({
    recipient_id: profileId,
    liker_id: currentUser.id,
    liker_name: currentUser.name,
    liker_avatar: currentUser.avatar_url,
  });
}
```

### 3. Při nákupu dárku

```typescript
// V GiftModal nebo gift purchase handler
import { notifyGiftReceived } from '../src/lib/notificationService';

async function sendGift(giftType: string, recipientId: string) {
  // ... purchase & send gift logic ...

  // Notify recipient
  await notifyGiftReceived({
    recipient_id: recipientId,
    sender_id: currentUser.id,
    sender_name: currentUser.name,
    sender_avatar: currentUser.avatar_url,
    gift_type: giftType,
    gift_emoji: getGiftEmoji(giftType), // Helper function
  });
}
```

---

## ⚙️ Nastavení & Konfigurace

### Database RLS Policies

Uživatelé mohou:
- ✅ Číst své vlastní notifikace
- ✅ Updatovat své notifikace (mark as read)
- ❌ Mazat notifikace (soft delete via read_at)
- ❌ Vytvářet notifikace (jen přes service/edge functions)

### Real-time Subscriptions

NotificationBell automaticky subscribuje na:
- INSERT events → nová notifikace
- UPDATE events → notifikace označena jako přečtená

**Filter:** `user_id=eq.{current_user_id}`

---

## 🎨 Styling & Theming

### Animace

**Wiggle** - Zatřese zvonečkem při nové notifikaci:
```css
@keyframes wiggle {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(-15deg); }
  75% { transform: rotate(15deg); }
}
```

**SlideDown** - Dropdown se plynule objeví:
```css
@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### Custom Scrollbar

Purple scrollbar v dropdownu:
```css
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(139, 92, 246, 0.5);
}
```

### Colors

- **Unread badge:** Gradient pink-500 → purple-500
- **Unread indicator:** Purple-500 dot
- **Icons:** Purple-400
- **Hover:** White/5 → White/10

---

## 🧪 Testing

### Manual Testing:

1. **Test zvoneček zobrazení:**
   ```typescript
   // V browser console
   await notifyNewLike({
     recipient_id: 'current-user-id',
     liker_id: 'test-user',
     liker_name: 'Test User',
   });
   ```

2. **Test real-time:**
   - Otevři 2 okna (různí uživatelé)
   - User A pošle zprávu User B
   - User B by měl vidět notifikaci okamžitě

3. **Test mark as read:**
   - Klikni na notifikaci
   - Blue dot zmizí
   - Badge count klesne

4. **Test grouping:**
   - Vytvoř 3+ lajků za hodinu
   - Spusť groupSimilarNotifications()
   - Zkontroluj, že se sloučily

---

## 📈 Performance

### Optimalizace:

- ✅ Pagination (max 20 v dropdownu)
- ✅ Indexes na user_id, is_read, created_at
- ✅ Real-time pouze pro přihlášené uživatele
- ✅ Lazy loading dropdown (jen při otevření)

### Cron Job pro cleanup:

```sql
-- Delete old read notifications (>30 days)
DELETE FROM notifications
WHERE is_read = true
  AND read_at < NOW() - INTERVAL '30 days';
```

Setup v Supabase:
```sql
SELECT cron.schedule(
  'cleanup-notifications',
  '0 3 * * *', -- 3am daily
  'SELECT cleanup_old_notifications();'
);
```

---

## 🐛 Troubleshooting

### Zvoneček se nezobrazuje:
- ✅ Uživatel je přihlášený? (`isLoggedIn = true`)
- ✅ NotificationBell import v FloatingGlassNav?
- ✅ CSS animace v tailwind.config.js?

### Real-time nefunguje:
- ✅ Realtime enabled pro notifications tabulku?
- ✅ RLS policies správně nastavené?
- ✅ User má správné `user_id`?

### Notifikace se nevytváří:
- ✅ RLS policy "System can insert notifications" existuje?
- ✅ `user_id` existuje v auth.users?
- ✅ Error v console?

### Unread count se neaktualizuje:
- ✅ Real-time subscription běží?
- ✅ UPDATE policy povoluje update `is_read`?
- ✅ Browser console errors?

---

## 🚀 Budoucí Vylepšení

### Fáze 2 (volitelné):
- [ ] Push notifications (PWA + FCM)
- [ ] Email fallback (pokud uživatel není aktivní 24h)
- [ ] Notification preferences (vypnout jednotlivé typy)
- [ ] Mark all as read keyboard shortcut (Shift+Enter)
- [ ] Sound effects (volitelné)
- [ ] Desktop notifications (browser API)

### Fáze 3 (pokročilé):
- [ ] Full notifications page (`/notifications`)
- [ ] Infinite scroll
- [ ] Search & filter
- [ ] Archive notifications
- [ ] Notification groups (conversations)

---

## 📚 Odkazy

- [NOTIFICATION_SYSTEM_DESIGN.md](./NOTIFICATION_SYSTEM_DESIGN.md) - Kompletní design dokumentace
- [EMAIL_FLOW_DOCUMENTATION.md](./EMAIL_FLOW_DOCUMENTATION.md) - Email flow strategie
- [Supabase Realtime Docs](https://supabase.com/docs/guides/realtime)
- [date-fns formatDistanceToNow](https://date-fns.org/v2.29.3/docs/formatDistanceToNow)

---

**Poslední update:** 2024-11-18
**Autor:** AI Assistant
**Status:** ✅ READY FOR PRODUCTION
**Implementace trvala:** ~4 hodiny
