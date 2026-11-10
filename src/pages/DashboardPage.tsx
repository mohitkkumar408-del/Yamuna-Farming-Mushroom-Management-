import React from 'react';
import {
  Sprout,
  Package,
  TrendingUp,
  Boxes,
  Truck,
  AlertTriangle,
  Clock,
  DollarSign,
  Users,
  ChevronRight,
  ArrowUpRight,
  Plus,
  Zap,
} from 'lucide-react';
import { useFarm } from '../context/FarmContext';
import { formatINR, formatKg, formatDate } from '../services/i18n';
import { HarvestSalesTrendChart, VarietyDonutChart } from '../components/common/Charts';

interface DashboardPageProps {
  onNavigate: (tab: string) => void;
  onOpenNewOrder: () => void;
  onOpenLogHarvest: () => void;
  onOpenQuickSale: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onNavigate,
  onOpenNewOrder,
  onOpenLogHarvest,
  onOpenQuickSale,
}) => {
  const { state, lang, t, metrics } = useFarm();

  // 7-day trend calculation
  const trendData = React.useMemo(() => {
    const days: { label: string; dateStr: string; harvestKg: number; salesKg: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const label = d.toLocaleDateString('en-IN', { weekday: 'short' });

      const harvestKg = state.harvests
        .filter((h) => h.harvestDate === dateStr)
        .reduce((sum, h) => sum + (h.netFreshQtyKg || 0), 0);

      const salesKg = state.orders
        .filter((o) => o.orderDate === dateStr && o.status !== 'cancelled')
        .reduce((sum, o) => sum + (o.quantityKg || 0), 0);

      days.push({ label, dateStr, harvestKg, salesKg });
    }
    return days;
  }, [state.harvests, state.orders]);

  // Donut variety distribution data
  const varietyItems = [
    { variety: 'Oyster (ढींगरी)', qtyKg: state.stocks.find((s) => s.variety === 'Oyster')?.availableKg || 0, color: '#059669' },
    { variety: 'Button (बटन)', qtyKg: state.stocks.find((s) => s.variety === 'Button')?.availableKg || 0, color: '#d97706' },
    { variety: 'Milky (दूधिया)', qtyKg: state.stocks.find((s) => s.variety === 'Milky')?.availableKg || 0, color: '#2563eb' },
    { variety: 'Shiitake', qtyKg: state.stocks.find((s) => s.variety === 'Shiitake')?.availableKg || 0, color: '#7c3aed' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Farm Gate Bar */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-stone-900 rounded-2xl p-5 sm:p-6 text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none flex items-center justify-end pr-8">
          <Sprout className="w-56 h-56 text-white" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-700/60 text-emerald-200 text-xs font-semibold mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              {lang === 'hi' ? 'लाइव फार्मिंग डैशबोर्ड' : 'Live Mushroom Farm Management'}
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight">
              {state.settings.farmName}
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 mt-1 max-w-xl">
              {lang === 'hi'
                ? 'मालिक: मोहित कुमार महतो • उत्पादन, स्टॉक, ऑर्डर, वित्तीय हिसाब-किताब व डिलीवरी प्रबंधन'
                : 'Owner: Mohit Kumar Mahato • Real-time batch cultivation, fresh inventory, logistics & accounting'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={onOpenQuickSale}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all active:scale-95"
            >
              <Zap className="w-4 h-4 fill-stone-950" />
              {t.quickSale}
            </button>
            <button
              onClick={onOpenLogHarvest}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all active:scale-95"
            >
              <Sprout className="w-4 h-4" />
              {t.logHarvest}
            </button>
            <button
              onClick={onOpenNewOrder}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-white text-emerald-950 hover:bg-emerald-50 rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all active:scale-95"
            >
              <Plus className="w-4 h-4 text-emerald-800" />
              {t.addOrder}
            </button>
          </div>
        </div>
      </div>

      {/* Critical Alerts Banner (if any) */}
      {(metrics.lowStockItems.length > 0 || metrics.dueDeliveriesToday.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {metrics.lowStockItems.length > 0 && (
            <div
              onClick={() => onNavigate('inventory')}
              className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 flex items-center justify-between cursor-pointer hover:bg-rose-100/70 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0" />
                <div className="text-xs">
                  <p className="font-bold">
                    {lang === 'hi' ? 'कम स्टॉक चेतावनी' : 'Low Fresh Stock Notice'}
                  </p>
                  <p className="text-rose-700">
                    {metrics.lowStockItems.map((s) => `${s.variety} (${s.availableKg.toFixed(1)}kg)`).join(', ')}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-rose-500" />
            </div>
          )}

          {metrics.dueDeliveriesToday.length > 0 && (
            <div
              onClick={() => onNavigate('deliveries')}
              className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-center justify-between cursor-pointer hover:bg-amber-100/70 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Truck className="w-5 h-5 text-amber-600 flex-shrink-0" />
                <div className="text-xs">
                  <p className="font-bold">
                    {metrics.dueDeliveriesToday.length} {lang === 'hi' ? 'ऑर्डर आज डिलीवरी हेतु शेष' : 'Orders Due for Delivery Today'}
                  </p>
                  <p className="text-amber-800">
                    {metrics.dueDeliveriesToday.map((d) => d.customerName).slice(0, 2).join(', ')}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-amber-500" />
            </div>
          )}
        </div>
      )}

      {/* Primary Key Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {/* Total Produced */}
        <div
          onClick={() => onNavigate('harvest')}
          className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs hover:border-emerald-300 cursor-pointer transition-all hover:shadow-sm group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500">{t.totalProduced}</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700 group-hover:scale-110 transition-transform">
              <Sprout className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-xl sm:text-2xl font-black text-stone-900">
              {formatKg(metrics.totalProducedKg)}
            </span>
          </div>
          <p className="text-[11px] text-stone-500 mt-1">
            {t.todayProduction}: <strong className="text-emerald-700">{formatKg(metrics.todayHarvestKg)}</strong>
          </p>
        </div>

        {/* Available Fresh Stock */}
        <div
          onClick={() => onNavigate('inventory')}
          className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs hover:border-emerald-300 cursor-pointer transition-all hover:shadow-sm group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500">{t.availableStock}</span>
            <div className="p-2 rounded-lg bg-teal-50 text-teal-700 group-hover:scale-110 transition-transform">
              <Boxes className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-xl sm:text-2xl font-black text-emerald-950">
              {formatKg(metrics.availableStockKg)}
            </span>
          </div>
          <p className="text-[11px] text-stone-500 mt-1">
            Reserved for orders: <strong className="text-amber-700">{formatKg(metrics.reservedStockKg)}</strong>
          </p>
        </div>

        {/* Total Revenue */}
        <div
          onClick={() => onNavigate('sales')}
          className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs hover:border-emerald-300 cursor-pointer transition-all hover:shadow-sm group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500">{t.totalRevenue}</span>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-700 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-xl sm:text-2xl font-black text-stone-900">
              {formatINR(metrics.totalSalesRevenue)}
            </span>
          </div>
          <p className="text-[11px] text-stone-500 mt-1">
            {t.cashCollected}: <strong className="text-emerald-700">{formatINR(metrics.cashCollected)}</strong>
          </p>
        </div>

        {/* Net Operating Profit */}
        <div
          onClick={() => onNavigate('profitloss')}
          className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs hover:border-emerald-300 cursor-pointer transition-all hover:shadow-sm group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500">{t.netProfit}</span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-700 group-hover:scale-110 transition-transform">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className={`text-xl sm:text-2xl font-black ${metrics.netProfit >= 0 ? 'text-emerald-900' : 'text-rose-700'}`}>
              {formatINR(metrics.netProfit)}
            </span>
            <span className="text-xs font-bold text-stone-500 font-mono">
              {metrics.profitMarginPct.toFixed(1)}% margin
            </span>
          </div>
          <p className="text-[11px] text-stone-500 mt-1">
            Total Expenses: <strong className="text-rose-700">{formatINR(metrics.totalExpenses)}</strong>
          </p>
        </div>
      </div>

      {/* Secondary Quick Metric Bar (Orders Funnel & Dues) */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-xs">
        <div className="flex items-center justify-between mb-3 border-b border-stone-100 pb-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-stone-700">
            {lang === 'hi' ? 'ऑर्डर पाइपलाइन एवं डिलीवरी स्थिति' : 'Live Order & Delivery Funnel'}
          </h2>
          <button
            onClick={() => onNavigate('orders')}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
          >
            {lang === 'hi' ? 'सभी ऑर्डर देखें →' : 'View all orders →'}
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 text-center text-xs">
          <div
            onClick={() => onNavigate('orders')}
            className="p-2.5 rounded-xl bg-blue-50/70 border border-blue-100 hover:bg-blue-100/70 cursor-pointer"
          >
            <span className="text-[11px] text-blue-700 font-medium block">1. New Orders</span>
            <span className="text-lg font-extrabold text-blue-900 block">{metrics.statusCounts.new}</span>
          </div>
          <div
            onClick={() => onNavigate('orders')}
            className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-100 hover:bg-emerald-100/70 cursor-pointer"
          >
            <span className="text-[11px] text-emerald-800 font-medium block">2. Confirmed</span>
            <span className="text-lg font-extrabold text-emerald-900 block">{metrics.statusCounts.confirmed}</span>
          </div>
          <div
            onClick={() => onNavigate('orders')}
            className="p-2.5 rounded-xl bg-stone-100 border border-stone-200 hover:bg-stone-200 cursor-pointer"
          >
            <span className="text-[11px] text-stone-600 font-medium block">3. In Prep</span>
            <span className="text-lg font-extrabold text-stone-900 block">{metrics.statusCounts.processing}</span>
          </div>
          <div
            onClick={() => onNavigate('orders')}
            className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-100 hover:bg-amber-100/70 cursor-pointer"
          >
            <span className="text-[11px] text-amber-800 font-medium block">4. Ready Dispatch</span>
            <span className="text-lg font-extrabold text-amber-900 block">{metrics.statusCounts.ready_for_dispatch}</span>
          </div>
          <div
            onClick={() => onNavigate('deliveries')}
            className="p-2.5 rounded-xl bg-indigo-50/70 border border-indigo-100 hover:bg-indigo-100/70 cursor-pointer"
          >
            <span className="text-[11px] text-indigo-800 font-medium block">5. Dispatched</span>
            <span className="text-lg font-extrabold text-indigo-900 block">{metrics.statusCounts.dispatched}</span>
          </div>
          <div
            onClick={() => onNavigate('orders')}
            className="p-2.5 rounded-xl bg-teal-50/70 border border-teal-100 hover:bg-teal-100/70 cursor-pointer"
          >
            <span className="text-[11px] text-teal-800 font-medium block">6. Delivered</span>
            <span className="text-lg font-extrabold text-teal-900 block">{metrics.statusCounts.delivered}</span>
          </div>
          <div
            onClick={() => onNavigate('orders')}
            className="p-2.5 rounded-xl bg-rose-50/70 border border-rose-100 hover:bg-rose-100/70 cursor-pointer"
          >
            <span className="text-[11px] text-rose-700 font-medium block">7. Cancelled</span>
            <span className="text-lg font-extrabold text-rose-900 block">{metrics.statusCounts.cancelled}</span>
          </div>
        </div>
      </div>

      {/* Charts Row: 7-Day Trend + Stock Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Harvest vs Sales 7-Day Trend Chart */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-stone-900">
                {lang === 'hi' ? '7-दिवसीय तुड़ाई एवं बिक्री प्रवृत्ति' : '7-Day Production vs Sales Trend'}
              </h2>
              <p className="text-xs text-stone-500">Daily harvest output vs customer fulfillment volume (kg)</p>
            </div>
            <button
              onClick={() => onNavigate('reports')}
              className="text-xs font-semibold text-emerald-700 hover:underline"
            >
              {lang === 'hi' ? 'पूरी रिपोर्ट →' : 'Full Analytics →'}
            </button>
          </div>

          <HarvestSalesTrendChart data={trendData} />
        </div>

        {/* Variety Distribution Donut */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-stone-900">
                {lang === 'hi' ? 'उपलब्ध ताजा स्टॉक विवरण' : 'Available Stock by Variety'}
              </h2>
              <p className="text-xs text-stone-500">Live fresh ready-to-sell stock</p>
            </div>
            <button
              onClick={() => onNavigate('inventory')}
              className="text-xs font-semibold text-emerald-700 hover:underline"
            >
              Manage
            </button>
          </div>

          <VarietyDonutChart items={varietyItems} />

          <div className="pt-2 border-t border-stone-100">
            <div className="flex items-center justify-between text-xs text-stone-600">
              <span>Customer Pending Dues:</span>
              <strong className="text-rose-700 font-mono">{formatINR(metrics.pendingCustomerDues)}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row: Upcoming Harvest Batches & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Growing Batches & Harvest Forecast */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-emerald-700" />
              {lang === 'hi' ? 'सक्रिय उत्पादन बैच एवं आगामी तुड़ाई' : 'Active Batches & Harvest Forecast'}
            </h2>
            <button
              onClick={() => onNavigate('production')}
              className="text-xs font-semibold text-emerald-700 hover:underline"
            >
              {lang === 'hi' ? 'सभी बैच देखें' : 'View all'}
            </button>
          </div>

          <div className="space-y-2.5">
            {state.batches.slice(0, 4).map((batch) => {
              const statusColor =
                batch.status === 'harvesting'
                  ? 'bg-emerald-100 text-emerald-800'
                  : batch.status === 'pinheading'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-blue-100 text-blue-800';

              return (
                <div
                  key={batch.id}
                  onClick={() => onNavigate('production')}
                  className="p-3 rounded-xl border border-stone-100 bg-stone-50/50 hover:bg-stone-50 cursor-pointer flex items-center justify-between text-xs transition-colors"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-stone-900">{batch.batchCode}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${statusColor}`}>
                        {batch.status}
                      </span>
                    </div>
                    <p className="text-stone-500 mt-0.5">
                      {batch.variety} • {batch.bagCount} bags • {batch.roomNumber}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] text-stone-500 block">Target:</span>
                    <span className="font-semibold text-stone-800">{formatDate(batch.targetHarvestDate)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Orders List */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
              <Package className="w-4 h-4 text-emerald-700" />
              {lang === 'hi' ? 'हाल के ग्राहक ऑर्डर' : 'Recent Customer Orders'}
            </h2>
            <button
              onClick={() => onNavigate('orders')}
              className="text-xs font-semibold text-emerald-700 hover:underline"
            >
              {lang === 'hi' ? 'ऑर्डर लिस्ट' : 'View all'}
            </button>
          </div>

          <div className="space-y-2.5">
            {state.orders.slice(0, 4).map((order) => (
              <div
                key={order.id}
                onClick={() => onNavigate('orders')}
                className="p-3 rounded-xl border border-stone-100 bg-stone-50/50 hover:bg-stone-50 cursor-pointer flex items-center justify-between text-xs transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-stone-900">{order.orderNumber}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-stone-200 text-stone-800">
                      {order.status}
                    </span>
                  </div>
                  <p className="text-stone-700 font-medium mt-0.5">{order.customerName}</p>
                  <p className="text-stone-400 text-[11px]">
                    {order.quantityKg} kg {order.variety} • Expected: {formatDate(order.expectedDeliveryDate)}
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-bold text-stone-900 block font-mono">{formatINR(order.totalAmount)}</span>
                  {order.balanceDue > 0 ? (
                    <span className="text-[10px] text-rose-600 font-bold block">
                      Due: {formatINR(order.balanceDue)}
                    </span>
                  ) : (
                    <span className="text-[10px] text-emerald-700 font-bold block">Paid Full</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
