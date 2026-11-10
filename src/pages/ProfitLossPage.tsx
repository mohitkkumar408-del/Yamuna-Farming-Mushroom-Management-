import React from 'react';
import {
  TrendingUp,
  DollarSign,
  PieChart,
  HelpCircle,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  CheckCircle2,
} from 'lucide-react';
import { useFarm } from '../context/FarmContext';
import { formatINR, formatKg } from '../services/i18n';

export const ProfitLossPage: React.FC = () => {
  const { state, lang, t, metrics } = useFarm();

  // Accounting definitions:
  // Gross Revenue: Sum of all non-cancelled order totals (Accrual basis)
  const grossRevenue = metrics.totalSalesRevenue;
  // Realized Cash Collected
  const cashCollected = metrics.cashCollected;
  // Customer Receivables (Dues)
  const customerDues = metrics.pendingCustomerDues;

  // COGS: Direct cultivation costs for mushrooms produced & sold
  const totalBatchCost = state.batches.reduce((sum, b) => sum + (b.totalCost || 0), 0);
  const totalHarvestedKg = metrics.totalProducedKg;
  const costPerKg = totalHarvestedKg > 0 ? totalBatchCost / totalHarvestedKg : 0;
  const cogs = metrics.totalSoldKg * costPerKg;

  // Gross Margin = Gross Revenue - COGS
  const grossProfit = grossRevenue - cogs;
  const grossMarginPct = grossRevenue > 0 ? (grossProfit / grossRevenue) * 100 : 0;

  // Total Operating Expenses (utilities, extra transport, rent, general upkeep)
  const totalOpExpenses = metrics.totalExpenses;

  // Net Operating Profit
  const netProfit = grossRevenue - totalOpExpenses;
  const netMarginPct = grossRevenue > 0 ? (netProfit / grossRevenue) * 100 : 0;

  // Realized Net Cashflow Profit = Cash in - Cash out
  const cashDisbursed = state.payments
    .filter((p) => p.direction === 'out')
    .reduce((sum, p) => sum + p.amount, 0);
  const cashBasisProfit = cashCollected - cashDisbursed;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-emerald-700" />
            {lang === 'hi' ? 'लाभ-हानि खाता (Profit & Loss Statement)' : 'Profit & Loss Statement & Financial Analytics'}
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            {lang === 'hi'
              ? 'सकल बिक्री आमदनी, नकद वसूली, उत्पादन लागत प्रति किग्रा, सकल लाभ व शुद्ध मुनाफा'
              : 'Accrual & cash-basis accounting: gross revenue, cash collections, COGS and net margins'}
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 bg-emerald-50 text-emerald-900 rounded-xl border border-emerald-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-700" />
          <span>Yamuna Farming Fiscal 2026</span>
        </div>
      </div>

      {/* Main KPI Quad */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Gross Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <span className="text-xs font-semibold text-stone-500 block uppercase tracking-wider">
            Gross Billed Revenue
          </span>
          <span className="text-2xl sm:text-3xl font-black text-stone-900 mt-2 block font-mono">
            {formatINR(grossRevenue)}
          </span>
          <p className="text-[11px] text-stone-500 mt-1">
            Sold: <strong>{formatKg(metrics.totalSoldKg)}</strong> fresh mushrooms
          </p>
        </div>

        {/* Realized Cash Collected */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <span className="text-xs font-semibold text-stone-500 block uppercase tracking-wider">
            Realized Cash / UPI In
          </span>
          <span className="text-2xl sm:text-3xl font-black text-emerald-800 mt-2 block font-mono">
            {formatINR(cashCollected)}
          </span>
          <p className="text-[11px] text-stone-500 mt-1">
            Uncollected Dues: <strong className="text-rose-600">{formatINR(customerDues)}</strong>
          </p>
        </div>

        {/* Total Operating Costs */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <span className="text-xs font-semibold text-stone-500 block uppercase tracking-wider">
            Total Farm Expenditures
          </span>
          <span className="text-2xl sm:text-3xl font-black text-rose-700 mt-2 block font-mono">
            {formatINR(totalOpExpenses)}
          </span>
          <p className="text-[11px] text-stone-500 mt-1">
            Avg Production Cost: <strong>{formatINR(costPerKg)} / kg</strong>
          </p>
        </div>

        {/* Net Operating Profit */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <span className="text-xs font-semibold text-stone-500 block uppercase tracking-wider">
            Net Profit (Accrual)
          </span>
          <span className={`text-2xl sm:text-3xl font-black mt-2 block font-mono ${netProfit >= 0 ? 'text-emerald-950' : 'text-rose-700'}`}>
            {formatINR(netProfit)}
          </span>
          <p className="text-[11px] text-emerald-800 font-bold mt-1">
            {netMarginPct.toFixed(1)}% Net Profit Margin
          </p>
        </div>
      </div>

      {/* Accounting P&L Ledger Breakdown Sheet */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="px-6 py-4 bg-stone-900 text-white flex items-center justify-between">
          <div>
            <h2 className="font-extrabold text-sm sm:text-base">
              Yamuna Farming – Statement of Profit and Loss
            </h2>
            <p className="text-xs text-stone-400">
              Commercial standard GAAP representation for Mushroom Enterprise
            </p>
          </div>
          <span className="text-xs text-amber-300 font-mono">Mohit Kumar Mahato, Owner</span>
        </div>

        <div className="p-6 space-y-6 text-xs sm:text-sm">
          {/* Revenue Section */}
          <div className="space-y-2">
            <h3 className="font-extrabold text-stone-800 uppercase tracking-wider text-xs border-b pb-1">
              1. Revenue from Mushroom Sales
            </h3>
            <div className="space-y-1.5 pl-3">
              <div className="flex justify-between text-stone-700">
                <span>Gross Mushroom Sales Revenue (Invoiced to Wholesale & Retail):</span>
                <span className="font-mono font-bold">{formatINR(grossRevenue)}</span>
              </div>
              <div className="flex justify-between text-emerald-800 font-medium">
                <span>• Actual Cash / UPI Inflow Deposited:</span>
                <span className="font-mono">{formatINR(cashCollected)}</span>
              </div>
              <div className="flex justify-between text-rose-700 font-medium">
                <span>• Outstanding Accounts Receivable (Customer Balance Due):</span>
                <span className="font-mono">{formatINR(customerDues)}</span>
              </div>
              <div className="flex justify-between text-stone-500 text-xs">
                <span>• Average Realized Real Selling Price:</span>
                <span className="font-mono">
                  {formatINR(metrics.avgSellingPricePerKg)} / kg
                </span>
              </div>
            </div>
          </div>

          {/* Cost of Production / Goods Sold */}
          <div className="space-y-2">
            <h3 className="font-extrabold text-stone-800 uppercase tracking-wider text-xs border-b pb-1">
              2. Cost of Goods Sold (Direct Mushroom Cultivation Cost)
            </h3>
            <div className="space-y-1.5 pl-3">
              <div className="flex justify-between text-stone-700">
                <span>Direct Batch Inoculation & Spawn Costs:</span>
                <span className="font-mono">
                  {formatINR(state.batches.reduce((sum, b) => sum + b.spawnCost, 0))}
                </span>
              </div>
              <div className="flex justify-between text-stone-700">
                <span>Substrate, Wheat & Paddy Straw Preparation:</span>
                <span className="font-mono">
                  {formatINR(state.batches.reduce((sum, b) => sum + b.substrateCost, 0))}
                </span>
              </div>
              <div className="flex justify-between text-stone-700">
                <span>Direct Production Labour Wages:</span>
                <span className="font-mono">
                  {formatINR(state.batches.reduce((sum, b) => sum + b.labourCost, 0))}
                </span>
              </div>
              <div className="flex justify-between text-stone-700">
                <span>Grow Room Humidity & Electricity Utilities:</span>
                <span className="font-mono">
                  {formatINR(state.batches.reduce((sum, b) => sum + b.electricityWaterCost, 0))}
                </span>
              </div>
              <div className="flex justify-between font-bold text-stone-900 pt-1 border-t border-stone-200">
                <span>Estimated COGS for Sold Quantity ({formatKg(metrics.totalSoldKg)}):</span>
                <span className="font-mono text-rose-700">{formatINR(cogs)}</span>
              </div>
            </div>
          </div>

          {/* Gross Margin */}
          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex justify-between font-extrabold text-stone-900 text-sm">
            <span>Gross Operating Margin:</span>
            <div className="text-right">
              <span className="font-mono text-emerald-900 block">{formatINR(grossProfit)}</span>
              <span className="text-xs text-stone-500 font-normal">({grossMarginPct.toFixed(1)}% of revenue)</span>
            </div>
          </div>

          {/* Operating Overhead Expenses */}
          <div className="space-y-2">
            <h3 className="font-extrabold text-stone-800 uppercase tracking-wider text-xs border-b pb-1">
              3. Operating Expenses & Farm Overhead
            </h3>
            <div className="space-y-1.5 pl-3">
              <div className="flex justify-between text-stone-700">
                <span>Total Recorded Operating Cash Expenses:</span>
                <span className="font-mono font-bold text-rose-700">{formatINR(totalOpExpenses)}</span>
              </div>
              <div className="flex justify-between text-stone-500 text-xs">
                <span>(Including raw material stock restocks, equipment repairs, transport petrol)</span>
              </div>
            </div>
          </div>

          {/* Net Profit Summary Box */}
          <div className="p-4 bg-emerald-50 rounded-2xl border-2 border-emerald-600 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="font-black text-base text-emerald-950 block">
                Net Operating Profit (Accrual Basis):
              </span>
              <span className="text-xs text-emerald-800">
                Total Revenue ({formatINR(grossRevenue)}) minus Total Farm Operating Expenses ({formatINR(totalOpExpenses)})
              </span>
            </div>
            <div className="text-right">
              <span className="text-2xl sm:text-3xl font-black font-mono text-emerald-950 block">
                {formatINR(netProfit)}
              </span>
              <span className="text-xs font-bold text-emerald-800">
                {netMarginPct.toFixed(1)}% Realized Margin
              </span>
            </div>
          </div>

          {/* Pure Cash-Basis Comparison Note */}
          <div className="p-3.5 bg-stone-100 rounded-xl border border-stone-200 text-xs text-stone-600 space-y-1">
            <span className="font-bold text-stone-800 block">
              💡 Cash-Basis Accounting Insight:
            </span>
            <p>
              On a strict physical cash-in-hand basis, cash collected is <strong>{formatINR(cashCollected)}</strong> against cash disbursed of <strong>{formatINR(cashDisbursed)}</strong>, giving a net physical cash surplus of <strong>{formatINR(cashBasisProfit)}</strong>. An additional <strong>{formatINR(customerDues)}</strong> remains to be collected from buyers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
