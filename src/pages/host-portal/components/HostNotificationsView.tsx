import { useState } from 'react';
import { HostNotification } from '@/pages/admin/types';
import { markNotificationAsRead, markAllNotificationsAsRead, loadHostData, saveHostData } from '@/pages/admin/hostStore';

interface Props {
  hostId: string;
  notifications: HostNotification[];
  onUpdate: (notifications: HostNotification[]) => void;
}

const typeConfig: Record<string, { icon: string; color: string; bg: string }> = {
  booking: { icon: 'ri-calendar-check-line', color: 'text-emerald-600', bg: 'bg-emerald-50' },
  message: { icon: 'ri-chat-3-line', color: 'text-amber-600', bg: 'bg-amber-50' },
  payout: { icon: 'ri-money-rupee-circle-line', color: 'text-blue-600', bg: 'bg-blue-50' },
  review: { icon: 'ri-star-line', color: 'text-purple-600', bg: 'bg-purple-50' },
  system: { icon: 'ri-settings-3-line', color: 'text-stone-600', bg: 'bg-stone-100' },
};

export default function HostNotificationsView({ hostId, notifications, onUpdate }: Props) {
  const [filter, setFilter] = useState<'all' | 'unread' | 'booking' | 'message' | 'payout' | 'review' | 'system'>('all');

  const filtered = notifications.filter((n) => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !n.read;
    return n.type === filter;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkRead = (id: string) => {
    markNotificationAsRead(hostId, id);
    const data = loadHostData();
    onUpdate(data.notifications.filter((n) => n.hostId === hostId));
  };

  const handleMarkAllRead = () => {
    markAllNotificationsAsRead(hostId);
    const data = loadHostData();
    onUpdate(data.notifications.filter((n) => n.hostId === hostId));
  };

  const handleDelete = (id: string) => {
    const data = loadHostData();
    data.notifications = data.notifications.filter((n) => n.id !== id);
    saveHostData(data);
    onUpdate(data.notifications.filter((n) => n.hostId === hostId));
  };

  const formatTime = (ts: string) => {
    const d = new Date(ts);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
  };

  const tabs = [
    { id: 'all', label: 'All', count: notifications.length },
    { id: 'unread', label: 'Unread', count: unreadCount },
    { id: 'booking', label: 'Bookings', count: notifications.filter((n) => n.type === 'booking').length },
    { id: 'message', label: 'Messages', count: notifications.filter((n) => n.type === 'message').length },
    { id: 'payout', label: 'Payouts', count: notifications.filter((n) => n.type === 'payout').length },
    { id: 'review', label: 'Reviews', count: notifications.filter((n) => n.type === 'review').length },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-stone-900">Notifications</h2>
            {unreadCount > 0 && (
              <span className="px-2.5 py-0.5 bg-red-100 text-red-700 text-xs font-bold rounded-full">
                {unreadCount} new
              </span>
            )}
          </div>
          <p className="text-stone-500 text-sm mt-1">Stay updated on bookings, messages, and payouts</p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="flex items-center gap-2 px-4 py-2 bg-stone-100 text-stone-700 rounded-xl text-sm font-medium hover:bg-stone-200 transition-colors cursor-pointer whitespace-nowrap"
          >
            <i className="ri-check-double-line" /> Mark all as read
          </button>
        )}
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl mb-5 w-fit flex-wrap">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setFilter(t.id as typeof filter)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
              filter === t.id ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-700'
            }`}
          >
            {t.label} <span className="opacity-60">({t.count})</span>
          </button>
        ))}
      </div>

      {/* Notifications list */}
      {filtered.length === 0 && (
        <div className="text-center py-16 bg-white rounded-xl border border-stone-200">
          <div className="w-16 h-16 flex items-center justify-center bg-stone-100 rounded-2xl mx-auto mb-4">
            <i className="ri-notification-3-line text-stone-300 text-3xl" />
          </div>
          <p className="font-medium text-stone-500">No notifications</p>
          <p className="text-stone-400 text-sm mt-1">
            {filter === 'unread' ? 'You have read all notifications!' : 'Notifications will appear here when there are updates'}
          </p>
        </div>
      )}

      <div className="space-y-3">
        {filtered.map((n) => {
          const cfg = typeConfig[n.type] || typeConfig.system;
          return (
            <div
              key={n.id}
              className={`bg-white rounded-xl border ${n.read ? 'border-stone-200' : 'border-amber-200'} p-4 transition-all hover:shadow-sm`}
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className={`w-10 h-10 flex items-center justify-center ${cfg.bg} rounded-xl shrink-0`}>
                  <i className={`${cfg.icon} ${cfg.color} text-lg`} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className={`font-semibold text-sm ${n.read ? 'text-stone-700' : 'text-stone-900'}`}>
                          {n.title}
                        </h4>
                        {!n.read && (
                          <span className="w-2 h-2 bg-amber-400 rounded-full" />
                        )}
                      </div>
                      <p className={`text-sm mt-1 ${n.read ? 'text-stone-500' : 'text-stone-600'}`}>
                        {n.content}
                      </p>
                      <p className="text-xs text-stone-400 mt-2">{formatTime(n.timestamp)}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      {!n.read && (
                        <button
                          onClick={() => handleMarkRead(n.id)}
                          className="w-8 h-8 flex items-center justify-center text-stone-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                          title="Mark as read"
                        >
                          <i className="ri-check-line" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(n.id)}
                        className="w-8 h-8 flex items-center justify-center text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title="Delete"
                      >
                        <i className="ri-delete-bin-line" />
                      </button>
                    </div>
                  </div>

                  {/* Action button */}
                  {n.actionUrl && n.actionLabel && (
                    <button
                      onClick={() => {
                        handleMarkRead(n.id);
                        // Navigate to the section
                        const section = new URLSearchParams(n.actionUrl.split('?')[1]).get('section');
                        if (section) {
                          window.location.href = `/resort-owner-portal?section=${section}`;
                        }
                      }}
                      className="mt-3 px-4 py-1.5 bg-stone-100 text-stone-700 rounded-lg text-xs font-medium hover:bg-stone-200 transition-colors cursor-pointer whitespace-nowrap inline-flex items-center gap-1"
                    >
                      {n.actionLabel} <i className="ri-arrow-right-line" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
