import React from 'react';
import {
  LayoutDashboard,
  Sprout,
  Scissors,
  Boxes,
  ShoppingCart,
  Truck,
  Users,
  Building2,
  Receipt,
  Wallet,
  CreditCard,
  TrendingUp,
  BarChart3,
  Bell,
  Settings,
  Database,
  Lock,
  ChevronRight,
  X,
} from 'lucide-react';
import { useFarm } from '../../context/FarmContext';

interface SidebarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onSelectTab, mobileOpen, onCloseMobile }) => {
  const { lang, t, metrics } = useFarm();

  const navGroups = [
    {
      title: t.navOverview,
      items: [
        { id: 'dashboard', label: t.navDashboard, icon: LayoutDashboard },
      ],
    },
    {
      title: t.navOperations,
      items: [
        { id: 'production', label: t.navProduction, icon: Sprout },
        { id: 'harvest', label: t.navHarvest, icon: Scissors },
        {
          id: 'inventory',
          label: t.navInventory,
          icon: Boxes,
          badge: metrics.lowStockItems.length > 0 ? metrics.lowStockItems.length : undefined,
          badgeColor: 'bg-rose-500 text-white',
        },
      ],
    },
    {
      title: t.navSalesCRM,
      items: [
        {
          id: 'orders',
          label: t.navOrders,
          icon: ShoppingCart,
          badge: metrics.statusCounts.new > 0 ? metrics.statusCounts.new : undefined,
          badgeColor: 'bg-blue-600 text-white',
        },
        {
          id: 'deliveries',
          label: t.navDeliveries,
          icon: Truck,
          badge: metrics.dueDeliveriesToday.length > 0 ? metrics.dueDeliveriesToday.length : undefined,
          badgeColor: 'bg-amber-600 text-white',
        },
        { id: 'customers', label: t.navCustomers, icon: Users },
        { id: 'suppliers', label: t.navSuppliers, icon: Building2 },
        { id: 'sales', label: t.navSalesPOS, icon: Receipt },
      ],
    },
    {
      title: t.navFinance,
      items: [
        { id: 'payments', label: t.navPayments, icon: Wallet },
        { id: 'expenses', label: t.navExpenses, icon: CreditCard },
        { id: 'profitloss', label: t.navProfitLoss, icon: TrendingUp },
      ],
    },
    {
      title: t.navAnalytics,
      items: [
        { id: 'reports', label: t.navReports, icon: BarChart3 },
        {
          id: 'notifications',
          label: t.navNotifications,
          icon: Bell,
          badge: metrics.unreadNotifications > 0 ? metrics.unreadNotifications : undefined,
          badgeColor: 'bg-rose-600 text-white',
        },
        { id: 'settings', label: t.navSettings, icon: Settings },
        { id: 'backup', label: t.navBackup, icon: Database },
        { id: 'auth', label: lang === 'hi' ? 'सुरक्षा व लॉगिन' : 'User Security & PIN', icon: Lock },
      ],
    },
  ];

  const handleSelect = (id: string) => {
    onSelectTab(id);
    onCloseMobile();
  };

  const content = (
    <div className="flex flex-col h-full bg-stone-900 text-stone-300">
      {/* Mobile top close bar */}
      <div className="lg:hidden flex items-center justify-between p-4 border-b border-stone-800">
        <span className="font-bold text-white text-base">Yamuna Farming Menu</span>
        <button
          onClick={onCloseMobile}
          className="p-1 rounded-md text-stone-400 hover:text-white hover:bg-stone-800"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Nav items */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 text-xs">
        {navGroups.map((group, gIdx) => (
          <div key={gIdx} className="space-y-1">
            <p className="px-3 text-[10px] font-bold text-stone-400 uppercase tracking-wider font-mono">
              {group.title}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-medium transition-all group ${
                      isActive
                        ? 'bg-emerald-600 text-white font-semibold shadow-sm shadow-emerald-900/50'
                        : 'text-stone-300 hover:bg-stone-800 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon
                        className={`w-4 h-4 flex-shrink-0 transition-colors ${
                          isActive ? 'text-white' : 'text-stone-400 group-hover:text-emerald-400'
                        }`}
                      />
                      <span className="truncate">{item.label}</span>
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {item.badge !== undefined && (
                        <span
                          className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold leading-tight ${
                            item.badgeColor || 'bg-stone-700 text-stone-200'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                      {isActive && <ChevronRight className="w-3.5 h-3.5 text-white/70" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Info */}
      <div className="p-3 border-t border-stone-800 text-[11px] text-stone-400 space-y-1">
        <div className="flex items-center justify-between text-stone-400">
          <span>Yamuna Farming v2.2</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" title="System Online" />
        </div>
        <p className="truncate text-stone-400">
          Owner: <strong className="text-stone-300">Mohit Kumar Mahato</strong>
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop fixed sidebar */}
      <aside className="hidden lg:block w-64 flex-shrink-0 h-[calc(100vh-4rem)] sticky top-16 border-r border-stone-800">
        {content}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={onCloseMobile} />
          <div className="fixed inset-y-0 left-0 w-72 max-w-[85vw] shadow-2xl z-50 animate-in slide-in-from-left duration-200">
            {content}
          </div>
        </div>
      )}
    </>
  );
};
