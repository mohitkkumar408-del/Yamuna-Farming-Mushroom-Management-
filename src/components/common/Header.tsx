import React, { useState } from 'react';
import {
  Bell,
  Globe,
  Plus,
  UserCheck,
  ChevronDown,
  Menu,
  X,
  Sprout,
  AlertTriangle,
  Clock,
  Package,
  Truck,
  DollarSign,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { useFarm } from '../../context/FarmContext';
import { formatINR, formatDate } from '../../services/i18n';

interface HeaderProps {
  onOpenMobileMenu: () => void;
  onOpenQuickSale: () => void;
  onOpenNewOrder: () => void;
  onOpenLogHarvest: () => void;
  onOpenAddExpense: () => void;
  onNavigate: (tab: string) => void;
  activeTab: string;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenMobileMenu,
  onOpenQuickSale,
  onOpenNewOrder,
  onOpenLogHarvest,
  onOpenAddExpense,
  onNavigate,
  activeTab,
}) => {
  const { state, lang, setLang, t, currentUser, setCurrentUser, metrics, markNotificationRead, markAllNotificationsRead } = useFarm();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showQuickAdd, setShowQuickAdd] = useState(false);

  const toggleLanguage = () => {
    setLang(lang === 'en' ? 'hi' : 'en');
  };

  const getNotifIcon = (type: string) => {
    switch (type) {
      case 'order_pending':
        return <Package className="w-4 h-4 text-blue-600" />;
      case 'delivery_due':
      case 'delivery_overdue':
        return <Truck className="w-4 h-4 text-amber-600" />;
      case 'low_stock':
        return <AlertTriangle className="w-4 h-4 text-rose-600" />;
      case 'harvest_upcoming':
        return <Sprout className="w-4 h-4 text-emerald-600" />;
      case 'payment_due':
        return <DollarSign className="w-4 h-4 text-purple-600" />;
      default:
        return <Bell className="w-4 h-4 text-stone-600" />;
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Mobile trigger & Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenMobileMenu}
              className="lg:hidden p-2 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 focus:outline-hidden"
              aria-label="Toggle menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div
              onClick={() => onNavigate('dashboard')}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center text-white shadow-sm shadow-emerald-700/20 group-hover:scale-105 transition-transform">
                <Sprout className="w-6 h-6 text-emerald-100" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-lg tracking-tight text-emerald-950 font-sans flex items-center gap-1.5">
                  {lang === 'hi' ? 'यमुना फार्मिंग' : 'Yamuna Farming'}
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    Mushroom Farm
                  </span>
                </span>
                <span className="text-[11px] text-stone-500 font-medium">
                  {lang === 'hi' ? 'संचालक: मोहित कुमार महतो' : 'Owner: Mohit Kumar Mahato'}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Quick actions, Language, Notifications & Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Actions Button */}
            <div className="relative">
              <button
                onClick={() => setShowQuickAdd(!showQuickAdd)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs sm:text-sm font-medium shadow-xs transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">{lang === 'hi' ? 'नया जोड़ें' : 'Quick Action'}</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-80" />
              </button>

              {showQuickAdd && (
                <div
                  className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-stone-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100"
                  onClick={() => setShowQuickAdd(false)}
                >
                  <button
                    onClick={onOpenNewOrder}
                    className="w-full text-left px-3.5 py-2 text-xs sm:text-sm text-stone-700 hover:bg-emerald-50 hover:text-emerald-900 flex items-center gap-2.5 font-medium"
                  >
                    <Package className="w-4 h-4 text-emerald-700" />
                    {lang === 'hi' ? '+ नया ऑर्डर दर्ज करें' : '+ Create New Order'}
                  </button>
                  <button
                    onClick={onOpenLogHarvest}
                    className="w-full text-left px-3.5 py-2 text-xs sm:text-sm text-stone-700 hover:bg-emerald-50 hover:text-emerald-900 flex items-center gap-2.5 font-medium"
                  >
                    <Sprout className="w-4 h-4 text-emerald-700" />
                    {lang === 'hi' ? '+ ताजा तुड़ाई रिकॉर्ड करें' : '+ Record Fresh Harvest'}
                  </button>
                  <button
                    onClick={onOpenQuickSale}
                    className="w-full text-left px-3.5 py-2 text-xs sm:text-sm text-stone-700 hover:bg-emerald-50 hover:text-emerald-900 flex items-center gap-2.5 font-medium"
                  >
                    <DollarSign className="w-4 h-4 text-amber-700" />
                    {lang === 'hi' ? '⚡ त्वरित फार्म-गेट नकद बिक्री' : '⚡ Quick Farm-Gate POS Sale'}
                  </button>
                  <button
                    onClick={onOpenAddExpense}
                    className="w-full text-left px-3.5 py-2 text-xs sm:text-sm text-stone-700 hover:bg-emerald-50 hover:text-emerald-900 flex items-center gap-2.5 font-medium border-t border-stone-100"
                  >
                    <DollarSign className="w-4 h-4 text-rose-700" />
                    {lang === 'hi' ? '+ फार्म खर्च दर्ज करें' : '+ Add Farm Expense'}
                  </button>
                </div>
              )}
            </div>

            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-stone-700 hover:text-emerald-800 bg-stone-100 hover:bg-stone-200/80 rounded-lg text-xs font-semibold transition-colors"
              title="Toggle English / हिन्दी"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-700" />
              <span>{lang === 'en' ? 'हिन्दी' : 'English'}</span>
            </button>

            {/* Notifications Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors focus:outline-hidden"
                aria-label="View notifications"
              >
                <Bell className="w-5 h-5" />
                {metrics.unreadNotifications > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-rose-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                    {metrics.unreadNotifications}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-stone-200 py-2 z-50">
                  <div className="px-4 py-2 border-b border-stone-100 flex items-center justify-between">
                    <span className="font-bold text-sm text-stone-800">
                      {lang === 'hi' ? 'सूचनाएं एवं अलर्ट' : 'Alerts & Reminders'} ({state.notifications.length})
                    </span>
                    {metrics.unreadNotifications > 0 && (
                      <button
                        onClick={markAllNotificationsRead}
                        className="text-xs text-emerald-700 hover:underline font-medium"
                      >
                        {lang === 'hi' ? 'सभी पढ़ा हुआ मार्क करें' : 'Mark all read'}
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-stone-100">
                    {state.notifications.length === 0 ? (
                      <div className="p-4 text-center text-xs text-stone-400">
                        {lang === 'hi' ? 'कोई नई सूचना नहीं है।' : 'No active notifications.'}
                      </div>
                    ) : (
                      state.notifications.map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => {
                            markNotificationRead(notif.id);
                            if (notif.linkPage) onNavigate(notif.linkPage);
                            setShowNotifications(false);
                          }}
                          className={`p-3 text-xs hover:bg-stone-50 cursor-pointer transition-colors flex items-start gap-2.5 ${
                            !notif.isRead ? 'bg-emerald-50/50' : ''
                          }`}
                        >
                          <div className="p-1.5 rounded-lg bg-stone-100 mt-0.5">{getNotifIcon(notif.type)}</div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <p className="font-semibold text-stone-900">{lang === 'hi' ? notif.titleHi : notif.title}</p>
                              {!notif.isRead && <span className="w-2 h-2 rounded-full bg-emerald-600" />}
                            </div>
                            <p className="text-stone-600 mt-0.5 line-clamp-2">{lang === 'hi' ? notif.messageHi : notif.message}</p>
                            <span className="text-[10px] text-stone-400 mt-1 block">{formatDate(notif.date)}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="px-3 py-2 border-t border-stone-100 text-center">
                    <button
                      onClick={() => {
                        onNavigate('notifications');
                        setShowNotifications(false);
                      }}
                      className="text-xs font-semibold text-emerald-700 hover:text-emerald-800"
                    >
                      {lang === 'hi' ? 'सभी सूचनाएं एवं चेतावनी देखें →' : 'View all alerts center →'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* User Profile & Role Menu */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 p-1 pl-2 sm:pr-3 rounded-lg hover:bg-stone-100 transition-colors border border-transparent hover:border-stone-200"
              >
                <div className="w-8 h-8 rounded-full bg-emerald-900 text-amber-300 font-bold text-xs flex items-center justify-center shadow-xs">
                  MK
                </div>
                <div className="hidden md:flex flex-col text-left">
                  <span className="text-xs font-bold text-stone-800 leading-tight">Mohit Kumar Mahato</span>
                  <span className="text-[10px] text-emerald-800 font-medium capitalize flex items-center gap-1">
                    <ShieldCheck className="w-2.5 h-2.5 text-emerald-600" />
                    {currentUser?.role || 'Owner'}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-stone-400 hidden sm:block" />
              </button>

              {showProfileMenu && (
                <div
                  className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-stone-200 py-2 z-50"
                  onClick={() => setShowProfileMenu(false)}
                >
                  <div className="px-4 py-2 border-b border-stone-100">
                    <p className="text-xs text-stone-400 font-medium">{t.activeUser}</p>
                    <p className="text-sm font-bold text-stone-900">Mohit Kumar Mahato</p>
                    <p className="text-xs text-stone-500 font-mono">mohitkkumar408@gmail.com</p>
                    <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-semibold">
                      <ShieldCheck className="w-3 h-3" />
                      Role: {currentUser?.role?.toUpperCase() || 'OWNER'}
                    </div>
                  </div>

                  <div className="px-2 py-1.5 border-b border-stone-100">
                    <p className="text-[11px] font-bold text-stone-400 uppercase tracking-wider px-2 py-1">
                      {lang === 'hi' ? 'भूमिका बदलें' : 'Switch Role (Simulation)'}
                    </p>
                    {state.users.map((u) => (
                      <button
                        key={u.id}
                        onClick={() => setCurrentUser(u)}
                        className={`w-full text-left px-2 py-1.5 text-xs rounded-md flex items-center justify-between ${
                          currentUser?.id === u.id ? 'bg-emerald-50 text-emerald-900 font-bold' : 'text-stone-700 hover:bg-stone-50'
                        }`}
                      >
                        <span>{u.name} ({u.role})</span>
                        {currentUser?.id === u.id && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                      </button>
                    ))}
                  </div>

                  <div className="px-2 pt-1">
                    <button
                      onClick={() => onNavigate('settings')}
                      className="w-full text-left px-2 py-1.5 text-xs text-stone-700 hover:bg-stone-100 rounded-md font-medium"
                    >
                      ⚙️ {lang === 'hi' ? 'फार्म सेटिंग्स व प्रोफाइल' : 'Farm Settings & Profile'}
                    </button>
                    <button
                      onClick={() => onNavigate('auth')}
                      className="w-full text-left px-2 py-1.5 text-xs text-stone-700 hover:bg-stone-100 rounded-md font-medium"
                    >
                      🔒 {lang === 'hi' ? 'सुरक्षा व पिन लॉक' : 'Security & PIN Lock'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
