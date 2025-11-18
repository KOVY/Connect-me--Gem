# 🔔 Notification System - Design Document

> **Cíl:** Minimalizovat email spam pomocí in-app notifikací se zvonečkem v horní navigaci

---

## 📋 Table of Contents

1. [Přehled systému](#přehled-systému)
2. [UI/UX Design](#uiux-design)
3. [Database Schema](#database-schema)
4. [API Endpoints](#api-endpoints)
5. [React Components](#react-components)
6. [Real-time Updates](#real-time-updates)
7. [Notification Types](#notification-types)
8. [Implementation Steps](#implementation-steps)

---

## 🎯 Přehled systému

### Hlavní funkce:

- **Zvoneček v navigaci** - Zobrazuje počet nepřečtených notifikací
- **Dropdown panel** - Seznam posledních notifikací
- **Real-time updates** - Okamžité zobrazení nových notifikací (Supabase Realtime)
- **Groupování** - Podobné notifikace se seskupují ("3 lidi tě lajkli")
- **Deep linking** - Kliknutím na notifikaci → redirect na detail
- **Mark as read** - Jednotlivě nebo hromadně

### Co NEBUDE v emailu, ale ve zvonečku:

- 💬 Nové zprávy
- ❤️ Nové lajky
- ✨ Nové matche
- 🎁 Obdržené dárky
- 👀 Návštěvy profilu
- ⭐ Noví followersi
- 🔥 Boost aktivován
- 💎 Premium výhody použity

---

## 🎨 UI/UX Design

### 1. Zvoneček v navigaci

**Pozice:** Mezi kredity a menu hamburger (desktop) / vlevo od menu (mobile)

**States:**

```tsx
// No notifications
<Bell className="w-6 h-6 text-white" />

// Has unread (1-9)
<div className="relative">
  <Bell className="w-6 h-6 text-white" />
  <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
    {count}
  </span>
</div>

// Has many unread (10+)
<div className="relative">
  <Bell className="w-6 h-6 text-white animate-wiggle" />
  <span className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
    9+
  </span>
</div>
```

**Animace:**
- Nová notifikace → zvoneček se "zatřese" (wiggle animation)
- Badge → pulse animation
- Hover → zvětšení (scale-110)

---

### 2. Dropdown Panel

**Rozměry:**
- Width: 420px (desktop), 100vw - 32px (mobile)
- Max-height: 600px
- Position: Absolute, right-aligned pod zvonečkem

**Design:**

```
┌─────────────────────────────────────┐
│  🔔 Notifikace          [Vše jako přečtené] │
├─────────────────────────────────────┤
│                                     │
│  ● 💬 Jan ti poslal zprávu          │
│     "Ahoj, jak se máš?"             │
│     před 2 minutami                 │
│                                     │
├─────────────────────────────────────┤
│                                     │
│  ● ❤️ 3 lidi tě lajkli              │
│     Marie, Petra, Anna              │
│     před 15 minutami                │
│                                     │
├─────────────────────────────────────┤
│                                     │
│    ✨ Máš nový match s Tomášem!     │
│     před hodinou                    │
│                                     │
├─────────────────────────────────────┤
│                                     │
│    🎁 Anna ti poslala růži 🌹       │
│     včera                           │
│                                     │
├─────────────────────────────────────┤
│                                     │
│  [Zobrazit vše]                     │
└─────────────────────────────────────┘
```

**Features:**
- **Blue dot** (●) = nepřečtené
- **Avatary** - malé kruhové fotky uživatelů
- **Groupování** - "3 lidi tě lajkli" místo 3 samostatných
- **Čas** - relativní ("před 2 min", "včera", "před týdnem")
- **Click** - označí jako přečtené + redirect
- **Scroll** - infinite scroll / "Zobrazit vše"

---

### 3. Full Notifications Page (volitelně)

**Route:** `/${locale}/notifications`

Plná stránka se všemi notifikacemi (starší než 7 dní).

---

## 🗄️ Database Schema

### Table: `notifications`

```sql
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Příjemce
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

    -- Typ notifikace
    type VARCHAR(50) NOT NULL, -- 'message', 'like', 'match', 'gift', 'profile_view', 'follower', 'boost'

    -- Odesilatel/Actor (volitelné)
    actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,

    -- Data (JSON)
    data JSONB NOT NULL DEFAULT '{}', -- { message: "Ahoj!", gift_type: "rose", count: 3, ... }

    -- Link (kam má vést kliknutí)
    link VARCHAR(500), -- '/cs/chat/123', '/cs/profile/456', ...

    -- Status
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP,

    -- Timestamps
    created_at TIMESTAMP DEFAULT NOW(),

    -- Index
    INDEX idx_user_unread (user_id, is_read, created_at DESC),
    INDEX idx_user_created (user_id, created_at DESC)
);

-- Enable Row Level Security
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own notifications
CREATE POLICY "Users can view own notifications"
    ON notifications FOR SELECT
    USING (auth.uid() = user_id);

-- Policy: Users can update their own notifications (mark as read)
CREATE POLICY "Users can update own notifications"
    ON notifications FOR UPDATE
    USING (auth.uid() = user_id);
```

### Example Data:

```json
// New message
{
  "type": "message",
  "actor_id": "user-123",
  "data": {
    "message_preview": "Ahoj, jak se máš?",
    "actor_name": "Jan Novák",
    "actor_avatar": "https://..."
  },
  "link": "/cs/chat/user-123"
}

// New like
{
  "type": "like",
  "actor_id": "user-456",
  "data": {
    "actor_name": "Marie Svobodová",
    "actor_avatar": "https://..."
  },
  "link": "/cs/profile/user-456"
}

// Grouped likes (3 people liked you)
{
  "type": "like_group",
  "actor_id": null,
  "data": {
    "count": 3,
    "actors": [
      { "id": "user-1", "name": "Marie", "avatar": "..." },
      { "id": "user-2", "name": "Petra", "avatar": "..." },
      { "id": "user-3", "name": "Anna", "avatar": "..." }
    ]
  },
  "link": "/cs/profile/me/likes"
}

// New match
{
  "type": "match",
  "actor_id": "user-789",
  "data": {
    "actor_name": "Tomáš Dvořák",
    "actor_avatar": "https://..."
  },
  "link": "/cs/chat/user-789"
}

// Gift received
{
  "type": "gift",
  "actor_id": "user-999",
  "data": {
    "gift_type": "rose",
    "gift_emoji": "🌹",
    "actor_name": "Anna Nováková",
    "actor_avatar": "https://..."
  },
  "link": "/cs/profile/me/inventory"
}
```

---

## 🔌 API Endpoints

### 1. Get User Notifications

```typescript
GET /api/notifications?limit=20&offset=0&unread_only=false

Response:
{
  "notifications": [
    {
      "id": "notif-1",
      "type": "message",
      "actor": {
        "id": "user-123",
        "name": "Jan Novák",
        "avatar": "https://..."
      },
      "data": { ... },
      "link": "/cs/chat/user-123",
      "is_read": false,
      "created_at": "2024-11-18T10:30:00Z"
    },
    ...
  ],
  "unread_count": 5,
  "total": 42
}
```

### 2. Mark as Read

```typescript
POST /api/notifications/:id/read

Response:
{
  "success": true,
  "notification_id": "notif-1"
}
```

### 3. Mark All as Read

```typescript
POST /api/notifications/mark-all-read

Response:
{
  "success": true,
  "marked_count": 12
}
```

### 4. Get Unread Count (fast endpoint)

```typescript
GET /api/notifications/unread-count

Response:
{
  "count": 5
}
```

---

## ⚛️ React Components

### 1. NotificationBell Component

**File:** `components/NotificationBell.tsx`

```tsx
import { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { supabase } from '../lib/supabase';
import NotificationDropdown from './NotificationDropdown';

export function NotificationBell() {
  const { isLoggedIn } = useUser();
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // Load unread count
  useEffect(() => {
    if (!isLoggedIn) return;
    loadUnreadCount();
  }, [isLoggedIn]);

  // Subscribe to real-time updates
  useEffect(() => {
    if (!isLoggedIn) return;

    const subscription = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${supabase.auth.user()?.id}`
        },
        (payload) => {
          // New notification arrived!
          setUnreadCount(prev => prev + 1);
          triggerWiggleAnimation();
          playNotificationSound(); // optional
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [isLoggedIn]);

  const loadUnreadCount = async () => {
    const { count } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('is_read', false);

    setUnreadCount(count || 0);
  };

  const loadNotifications = async () => {
    const { data } = await supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);

    setNotifications(data || []);
  };

  const handleBellClick = () => {
    if (!isOpen) {
      loadNotifications();
    }
    setIsOpen(!isOpen);
  };

  if (!isLoggedIn) return null;

  return (
    <div className="relative">
      {/* Bell Button */}
      <button
        onClick={handleBellClick}
        className="relative group"
        aria-label="Notifications"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-lg group-hover:blur-xl transition-all"></div>
        <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-full p-3 hover:bg-white/20 transition-all duration-300 group-hover:scale-110">
          <Bell className={`w-6 h-6 text-white ${unreadCount > 0 ? 'animate-wiggle' : ''}`} />

          {/* Badge */}
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1.5 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </div>
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <NotificationDropdown
          notifications={notifications}
          onClose={() => setIsOpen(false)}
          onMarkAllRead={async () => {
            await markAllAsRead();
            setUnreadCount(0);
            loadNotifications();
          }}
        />
      )}
    </div>
  );
}
```

### 2. NotificationDropdown Component

**File:** `components/NotificationDropdown.tsx`

```tsx
import { formatDistanceToNow } from 'date-fns';
import { cs } from 'date-fns/locale';
import { Link } from 'react-router-dom';
import { CheckCheck } from 'lucide-react';

interface NotificationDropdownProps {
  notifications: Notification[];
  onClose: () => void;
  onMarkAllRead: () => void;
}

export default function NotificationDropdown({
  notifications,
  onClose,
  onMarkAllRead
}: NotificationDropdownProps) {

  const handleNotificationClick = async (notif: Notification) => {
    // Mark as read
    if (!notif.is_read) {
      await supabase
        .from('notifications')
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq('id', notif.id);
    }

    // Navigate
    if (notif.link) {
      navigate(notif.link);
    }

    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
      />

      {/* Dropdown Panel */}
      <div className="absolute top-full right-0 mt-2 w-[420px] max-w-[calc(100vw-32px)] z-50 animate-slideDown">
        <div className="bg-black/90 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden">

          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <div className="flex items-center space-x-2">
              <Bell className="w-5 h-5 text-purple-400" />
              <h3 className="text-white font-bold">Notifikace</h3>
            </div>
            <button
              onClick={onMarkAllRead}
              className="text-sm text-purple-300 hover:text-white transition-colors flex items-center space-x-1"
            >
              <CheckCheck className="w-4 h-4" />
              <span>Vše přečteno</span>
            </button>
          </div>

          {/* Notifications List */}
          <div className="max-h-[500px] overflow-y-auto custom-scrollbar">
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-gray-400">Žádné notifikace</p>
              </div>
            ) : (
              notifications.map((notif) => (
                <NotificationItem
                  key={notif.id}
                  notification={notif}
                  onClick={() => handleNotificationClick(notif)}
                />
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-white/10 bg-white/5">
            <Link
              to="/cs/notifications"
              onClick={onClose}
              className="block text-center text-sm text-purple-300 hover:text-white transition-colors"
            >
              Zobrazit všechny notifikace
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
```

### 3. NotificationItem Component

```tsx
function NotificationItem({ notification, onClick }) {
  const { type, data, is_read, created_at } = notification;

  const getIcon = () => {
    switch (type) {
      case 'message': return '💬';
      case 'like': return '❤️';
      case 'match': return '✨';
      case 'gift': return '🎁';
      case 'profile_view': return '👀';
      case 'follower': return '⭐';
      default: return '🔔';
    }
  };

  const getText = () => {
    switch (type) {
      case 'message':
        return `${data.actor_name} ti poslal zprávu`;
      case 'like':
        return `${data.actor_name} tě lajkl`;
      case 'like_group':
        return `${data.count} lidi tě lajkli`;
      case 'match':
        return `Máš nový match s ${data.actor_name}!`;
      case 'gift':
        return `${data.actor_name} ti poslal ${data.gift_emoji}`;
      default:
        return 'Nová notifikace';
    }
  };

  return (
    <button
      onClick={onClick}
      className={`w-full p-4 hover:bg-white/5 transition-colors text-left ${
        !is_read ? 'bg-purple-500/10' : ''
      }`}
    >
      <div className="flex items-start space-x-3">
        {/* Avatar or Icon */}
        <div className="flex-shrink-0">
          {data.actor_avatar ? (
            <img
              src={data.actor_avatar}
              alt={data.actor_name}
              className="w-10 h-10 rounded-full border-2 border-purple-500/30"
            />
          ) : (
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-xl">
              {getIcon()}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <p className="text-white text-sm font-medium">{getText()}</p>
            {!is_read && (
              <div className="w-2 h-2 bg-purple-500 rounded-full ml-2 flex-shrink-0" />
            )}
          </div>

          {/* Preview */}
          {data.message_preview && (
            <p className="text-gray-400 text-sm mt-1 truncate">
              "{data.message_preview}"
            </p>
          )}

          {/* Time */}
          <p className="text-gray-500 text-xs mt-1">
            {formatDistanceToNow(new Date(created_at), {
              addSuffix: true,
              locale: cs
            })}
          </p>
        </div>
      </div>
    </button>
  );
}
```

---

## 🔴 Real-time Updates (Supabase Realtime)

### Enable Realtime on Table:

```sql
-- Enable realtime for notifications table
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
```

### Subscribe in React:

```typescript
useEffect(() => {
  if (!isLoggedIn) return;

  const userId = supabase.auth.user()?.id;

  const subscription = supabase
    .channel('notifications')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${userId}`
      },
      (payload) => {
        console.log('New notification:', payload.new);

        // Update unread count
        setUnreadCount(prev => prev + 1);

        // Add to notifications list
        setNotifications(prev => [payload.new, ...prev]);

        // Trigger animation
        triggerBellAnimation();

        // Optional: Play sound
        playNotificationSound();

        // Optional: Show toast
        toast.success('Nová notifikace!');
      }
    )
    .subscribe();

  return () => {
    subscription.unsubscribe();
  };
}, [isLoggedIn]);
```

---

## 📊 Notification Types

| Type | Icon | Kdy se vytvoří | Data | Link |
|------|------|----------------|------|------|
| `message` | 💬 | Nová zpráva | `{actor_name, actor_avatar, message_preview}` | `/chat/{actor_id}` |
| `like` | ❤️ | Někdo tě lajkl | `{actor_name, actor_avatar}` | `/profile/{actor_id}` |
| `like_group` | ❤️ | 3+ lajků za poslední hodinu | `{count, actors[]}` | `/profile/me/likes` |
| `match` | ✨ | Nový match | `{actor_name, actor_avatar}` | `/chat/{actor_id}` |
| `gift` | 🎁 | Obdržel jsi dárek | `{actor_name, gift_type, gift_emoji}` | `/profile/me/inventory` |
| `profile_view` | 👀 | Někdo navštívil profil | `{actor_name, actor_avatar}` | `/profile/{actor_id}` |
| `follower` | ⭐ | Nový follower | `{actor_name, actor_avatar}` | `/profile/{actor_id}` |
| `boost` | 🔥 | Boost aktivován | `{duration, boost_type}` | `/profile/me` |
| `premium` | 💎 | Premium benefit použit | `{benefit_type}` | `/profile/me/subscription` |

---

## 🚀 Implementation Steps

### Phase 1: Database & Backend (1-2 hodiny)

- [ ] Vytvořit `notifications` tabulku v Supabase
- [ ] Enable Row Level Security
- [ ] Enable Realtime
- [ ] Vytvořit API endpoints (nebo Supabase edge functions)

### Phase 2: React Components (2-3 hodiny)

- [ ] Vytvořit `NotificationBell.tsx`
- [ ] Vytvořit `NotificationDropdown.tsx`
- [ ] Vytvořit `NotificationItem.tsx`
- [ ] Přidat CSS animace (wiggle, slideDown, pulse)

### Phase 3: Integration (1 hodina)

- [ ] Přidat NotificationBell do `FloatingGlassNav.tsx`
- [ ] Testovat real-time updates
- [ ] Testovat mark as read
- [ ] Testovat deep linking

### Phase 4: Trigger Creation (2-3 hodiny)

- [ ] Trigger: Nová zpráva → vytvoř notifikaci
- [ ] Trigger: Nový lajk → vytvoř notifikaci
- [ ] Trigger: Nový match → vytvoř notifikaci
- [ ] Trigger: Nový dárek → vytvoř notifikaci
- [ ] Cron job: Group likes (každou hodinu)

### Phase 5: Testing & Polish (1-2 hodiny)

- [ ] Testovat na mobile
- [ ] Testovat dark mode
- [ ] Optimalizovat performance
- [ ] Přidat loading states
- [ ] Přidat error handling

---

## 🎨 CSS Animations

```css
/* Wiggle animation for bell */
@keyframes wiggle {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(-15deg); }
  75% { transform: rotate(15deg); }
}

.animate-wiggle {
  animation: wiggle 0.5s ease-in-out;
}

/* Slide down animation for dropdown */
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

.animate-slideDown {
  animation: slideDown 0.2s ease-out;
}

/* Custom scrollbar */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(139, 92, 246, 0.5);
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(139, 92, 246, 0.7);
}
```

---

## 📈 Performance Optimizations

### 1. Pagination
```typescript
// Load only 20 newest notifications in dropdown
// Full page loads more with infinite scroll
```

### 2. Caching
```typescript
// Cache unread count in React Query
const { data: unreadCount } = useQuery(
  'notifications-unread',
  fetchUnreadCount,
  { staleTime: 30000 } // 30 seconds
);
```

### 3. Grouping
```typescript
// Cron job (každou hodinu):
// - Najdi všechny lajky za poslední hodinu pro každého usera
// - Pokud > 3, vytvoř jednu "like_group" notifikaci
// - Smaž jednotlivé notifikace
```

### 4. Cleanup
```sql
-- Delete old read notifications (older than 30 days)
DELETE FROM notifications
WHERE is_read = true
  AND read_at < NOW() - INTERVAL '30 days';
```

---

## 🔒 Security Considerations

1. **RLS Policies** - Users can only see their own notifications
2. **Rate Limiting** - Max 100 notifications per user per day (spam protection)
3. **Validation** - Validate actor_id exists before creating notification
4. **XSS Protection** - Sanitize message previews and user names

---

## 📱 Mobile Considerations

- **Touch targets:** Min 44x44px for bell button
- **Dropdown:** Full width on mobile (w-[calc(100vw-32px)])
- **Swipe to dismiss:** Optional gesture support
- **Push notifications:** Budoucí fáze (FCM/APNs)

---

## 🎯 Success Metrics

Track tyto metriky:

- **Notification open rate** (kolik % notifikací je otevřeno)
- **Click-through rate** (kolik % klikne na link)
- **Time to read** (jak rychle uživatelé čtou notifikace)
- **Email reduction** (o kolik % klesly emails díky notifikacím)

---

**Poslední update:** 2024-11-18
**Autor:** AI Assistant
**Status:** ✅ READY FOR IMPLEMENTATION
**Estimated time:** 8-12 hodin celková implementace
