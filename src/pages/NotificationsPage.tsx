import React, { useState } from 'react';
import {
  Bell,
  CheckCircle2,
  Trash2,
  AlertTriangle,
  Clock,
  Package,
  Truck,
  DollarSign,
  Sprout,
  ShieldAlert,
  ArrowRight,
} from 'lucide-react';
import { useFarm } from '../context/FarmContext';
import { formatDate } from '../services/i18n';

interface NotificationsPageProps {
  onNavigate: (tab: string) => void;
}

export const NotificationsPage: React.FC<NotificationsPageProps> = ({ onNavigate }) => {
  const { state, lang, t, metrics, markNotificationRead, markAllNotificationsRead, clearNotifications } = useFarm();

  const [filterType, setFilterType] = useState('all');

  const filteredNotifs = state.notifications.filter((n) => {
    if (filterType === 'all') return true;
    if (filterType === 'unread') return !n.isRead;
    return n.type === filterType;
  });

  const getNotifIcon = (type: string) => {
    switch (type) {
      case 'order_pending':
        return <Package className="w-5 h-5 text-blue-600" />;
      case 'delivery_due':
      case 'delivery_overdue':
        return <Truck className="w-5 h-5 text-amber-600" />;
      case 'low_stock':
        return <AlertTriangle className="w-5 h-5 text-rose-600" />;
      case 'harvest_upcoming':
        return <Sprout className="w-5 h-5 text-emerald-600" />;
      case 'payment_due':
        return <DollarSign className="w-5 h-5 text-purple-600" />;
      default:
        return <Bell className="w-5 h-5 text-stone-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight flex items-center gap-2">
            <Bell className="w-6 h-6 text-emerald-700" />
            {lang === 'hi' ? 'सूचनाएं, अलर्ट एवं स्मरण केंद्र' : 'Alerts, Notifications & Reminders'}
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            {lang === 'hi'
              ? 'लंबित ऑर्डर, आज की डिलीवरी, कम स्टॉक, आगामी तुड़ाई व बकाया भुगतान अलर्ट'
              : 'Real-time proactive business alerts: low inventory, upcoming harvests, deliveries and dues'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {metrics.unreadNotifications > 0 && (
            <button
              onClick={markAllNotificationsRead}
              className="px-3.5 py-2 bg-emerald-50 text-emerald-900 hover:bg-emerald-100 rounded-xl text-xs font-bold transition-colors"
            >
              {lang === 'hi' ? 'सभी पढ़ा हुआ मार्क करें' : 'Mark All Read'}
            </button>
          )}
          <button
            onClick={() => {
              if (confirm('Clear all notification history?')) {
                clearNotifications();
              }
            }}
            className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-semibold transition-colors"
          >
            {lang === 'hi' ? 'हटाएं' : 'Clear All'}
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex overflow-x-auto border-b border-stone-200 text-xs sm:text-sm font-bold gap-3 sm:gap-6 pb-2">
        <button
          onClick={() => setFilterType('all')}
          className={`whitespace-nowrap pb-1.5 transition-colors ${
            filterType === 'all' ? 'text-emerald-800 border-b-2 border-emerald-700' : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          All Alerts ({state.notifications.length})
        </button>
        <button
          onClick={() => setFilterType('unread')}
          className={`whitespace-nowrap pb-1.5 transition-colors ${
            filterType === 'unread' ? 'text-emerald-800 border-b-2 border-emerald-700' : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          Unread ({metrics.unreadNotifications})
        </button>
        <button
          onClick={() => setFilterType('delivery_due')}
          className={`whitespace-nowrap pb-1.5 transition-colors ${
            filterType === 'delivery_due' ? 'text-amber-800 border-b-2 border-amber-700' : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          Deliveries
        </button>
        <button
          onClick={() => setFilterType('low_stock')}
          className={`whitespace-nowrap pb-1.5 transition-colors ${
            filterType === 'low_stock' ? 'text-rose-800 border-b-2 border-rose-700' : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          Low Stock
        </button>
        <button
          onClick={() => setFilterType('harvest_upcoming')}
          className={`whitespace-nowrap pb-1.5 transition-colors ${
            filterType === 'harvest_upcoming' ? 'text-emerald-800 border-b-2 border-emerald-700' : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          Upcoming Harvests
        </button>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifs.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-stone-200 text-center space-y-2">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
            <p className="text-sm font-bold text-stone-700">All caught up!</p>
            <p className="text-xs text-stone-400">No active alerts requiring immediate action.</p>
          </div>
        ) : (
          filteredNotifs.map((notif) => (
            <div
              key={notif.id}
              onClick={() => {
                markNotificationRead(notif.id);
                if (notif.linkPage) onNavigate(notif.linkPage);
              }}
              className={`bg-white p-4 rounded-xl border border-stone-200 shadow-xs hover:border-emerald-300 transition-all cursor-pointer flex items-start justify-between gap-3 ${
                !notif.isRead ? 'bg-emerald-50/40 border-emerald-200' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-stone-100 flex-shrink-0 mt-0.5">
                  {getNotifIcon(notif.type)}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-stone-900">
                      {lang === 'hi' ? notif.titleHi : notif.title}
                    </h3>
                    {!notif.isRead && (
                      <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block" />
                    )}
                  </div>
                  <p className="text-xs text-stone-600">
                    {lang === 'hi' ? notif.messageHi : notif.message}
                  </p>
                  <span className="text-[10px] text-stone-400 block">{formatDate(notif.date)}</span>
                </div>
              </div>

              {notif.linkPage && (
                <div className="flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex-shrink-0 pt-1">
                  <span>Take Action</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
