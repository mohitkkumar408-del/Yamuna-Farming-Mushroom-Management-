import React, { useState } from 'react';
import {
  BarChart3,
  Download,
  Printer,
  Calendar,
  Filter,
  FileSpreadsheet,
  Sprout,
  TrendingUp,
  Boxes,
  Users,
} from 'lucide-react';
import { useFarm } from '../context/FarmContext';
import { formatINR, formatKg, formatDate } from '../services/i18n';

export const ReportsPage: React.FC = () => {
  const { state, lang, t, metrics } = useFarm();

  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');

  const exportTableToCSV = (tableName: string, data: any[]) => {
    if (!data || data.length === 0) {
      alert('No records available to export.');
      return;
    }

    const headers = Object.keys(data[0]);
    const csvRows = [headers.join(',')];

    data.forEach((row) => {
      const values = headers.map((header) => {
        const val = row[header];
        if (typeof val === 'string') {
          return `"${val.replace(/"/g, '""')}"`;
        }
        return val !== undefined && val !== null ? val : '';
      });
      csvRows.push(values.join(','));
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvRows.join('\n'));
    const link = document.createElement('a');
    link.setAttribute('href', csvContent);
    link.setAttribute('download', `Yamuna_Farming_${tableName}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-emerald-700" />
            {lang === 'hi' ? 'व्यापारिक रिपोर्ट एवं CSV एक्सपोर्ट' : 'Business Reports & CSV Data Export'}
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            {lang === 'hi'
              ? 'उत्पादन, बिक्री, इन्वेंटरी, खर्च व लाभ-हानि रिपोर्ट को एक्सेल या CSV में डाउनलोड करें'
              : 'Generate exportable reports for audits, tax filing, batch ROI and operational reviews'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs sm:text-sm font-bold transition-colors"
          >
            <Printer className="w-4 h-4" />
            {t.printReport}
          </button>
        </div>
      </div>

      {/* CSV Export Quick Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs flex flex-col justify-between space-y-3">
          <div>
            <span className="font-bold text-stone-900 block text-xs">Orders & Sales Dataset</span>
            <p className="text-[11px] text-stone-500 mt-0.5">
              {state.orders.length} orders with customer details, rates & balances.
            </p>
          </div>
          <button
            onClick={() => exportTableToCSV('Orders', state.orders)}
            className="w-full py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Download Orders CSV
          </button>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs flex flex-col justify-between space-y-3">
          <div>
            <span className="font-bold text-stone-900 block text-xs">Harvest Records Dataset</span>
            <p className="text-[11px] text-stone-500 mt-0.5">
              {state.harvests.length} harvest events with Grade A, B, C & spoilage.
            </p>
          </div>
          <button
            onClick={() => exportTableToCSV('Harvests', state.harvests)}
            className="w-full py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Download Harvests CSV
          </button>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs flex flex-col justify-between space-y-3">
          <div>
            <span className="font-bold text-stone-900 block text-xs">Customer Database & Dues</span>
            <p className="text-[11px] text-stone-500 mt-0.5">
              {state.customers.length} client contacts with purchase & dues totals.
            </p>
          </div>
          <button
            onClick={() => exportTableToCSV('Customers', state.customers)}
            className="w-full py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Download Customers CSV
          </button>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs flex flex-col justify-between space-y-3">
          <div>
            <span className="font-bold text-stone-900 block text-xs">Expenses & Cost Ledger</span>
            <p className="text-[11px] text-stone-500 mt-0.5">
              {state.expenses.length} expense payouts categorized by input type.
            </p>
          </div>
          <button
            onClick={() => exportTableToCSV('Expenses', state.expenses)}
            className="w-full py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Download Expenses CSV
          </button>
        </div>
      </div>

      {/* Printable Comprehensive Performance Report Sheet */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-6 sm:p-8 space-y-6" id="business-report">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b pb-4">
          <div>
            <h2 className="text-xl font-black text-emerald-950">{state.settings.farmName}</h2>
            <p className="text-xs text-stone-500">{state.settings.address}</p>
            <p className="text-xs text-stone-500 font-medium">
              Owner: <strong>{state.settings.ownerName}</strong> | Tel: {state.settings.phone}
            </p>
          </div>
          <div className="sm:text-right text-xs">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-extrabold uppercase text-[10px]">
              BUSINESS EXECUTIVE SUMMARY REPORT
            </span>
            <p className="text-stone-500 mt-1">Generated: {formatDate(new Date().toISOString())}</p>
          </div>
        </div>

        {/* Section 1: Production & Yield Performance */}
        <div className="space-y-3">
          <h3 className="font-extrabold text-xs uppercase tracking-wider text-stone-800 border-b pb-1">
            1. Mushroom Production & Batch Harvest Yields
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-stone-50 rounded-xl">
              <span className="text-stone-500 block">Total Cultivated Net:</span>
              <strong className="text-base font-extrabold text-stone-900">{formatKg(metrics.totalProducedKg)}</strong>
            </div>
            <div className="p-3 bg-stone-50 rounded-xl">
              <span className="text-stone-500 block">Total Sold & Dispatched:</span>
              <strong className="text-base font-extrabold text-stone-900">{formatKg(metrics.totalSoldKg)}</strong>
            </div>
            <div className="p-3 bg-stone-50 rounded-xl">
              <span className="text-stone-500 block">Current Available Stock:</span>
              <strong className="text-base font-extrabold text-emerald-800">{formatKg(metrics.availableStockKg)}</strong>
            </div>
            <div className="p-3 bg-stone-50 rounded-xl">
              <span className="text-stone-500 block">Active Grow Batches:</span>
              <strong className="text-base font-extrabold text-stone-900">{state.batches.length} batches</strong>
            </div>
          </div>
        </div>

        {/* Section 2: Financial Performance & Margin */}
        <div className="space-y-3">
          <h3 className="font-extrabold text-xs uppercase tracking-wider text-stone-800 border-b pb-1">
            2. Financial Performance & Commercial Profitability
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-stone-50 rounded-xl">
              <span className="text-stone-500 block">Gross Sales Invoiced:</span>
              <strong className="text-base font-extrabold text-stone-900 font-mono">
                {formatINR(metrics.totalSalesRevenue)}
              </strong>
            </div>
            <div className="p-3 bg-stone-50 rounded-xl">
              <span className="text-stone-500 block">Cash Collected (IN):</span>
              <strong className="text-base font-extrabold text-emerald-800 font-mono">
                {formatINR(metrics.cashCollected)}
              </strong>
            </div>
            <div className="p-3 bg-stone-50 rounded-xl">
              <span className="text-stone-500 block">Operating Costs:</span>
              <strong className="text-base font-extrabold text-rose-700 font-mono">
                {formatINR(metrics.totalExpenses)}
              </strong>
            </div>
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
              <span className="text-emerald-900 font-semibold block">Net Profit:</span>
              <strong className="text-base font-extrabold text-emerald-950 font-mono">
                {formatINR(metrics.netProfit)}
              </strong>
            </div>
          </div>
        </div>

        {/* Section 3: Customer Outstanding Dues Breakdown */}
        <div className="space-y-2">
          <h3 className="font-extrabold text-xs uppercase tracking-wider text-stone-800 border-b pb-1">
            3. Accounts Receivable & Customer Dues
          </h3>
          <div className="border border-stone-200 rounded-xl overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className="bg-stone-100 text-stone-700 font-bold border-b text-[11px]">
                <tr>
                  <th className="py-2 px-3">Customer Name</th>
                  <th className="py-2 px-3">Contact</th>
                  <th className="py-2 px-3 text-right">Total Invoiced</th>
                  <th className="py-2 px-3 text-right">Paid</th>
                  <th className="py-2 px-3 text-right">Outstanding Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {state.customers
                  .filter((c) => c.balanceDue > 0)
                  .map((c) => (
                    <tr key={c.id}>
                      <td className="py-2 px-3 font-bold text-stone-900">{c.name}</td>
                      <td className="py-2 px-3 text-stone-600">{c.phone}</td>
                      <td className="py-2 px-3 text-right font-mono">{formatINR(c.totalBilledAmount)}</td>
                      <td className="py-2 px-3 text-right font-mono text-emerald-800">{formatINR(c.totalPaidAmount)}</td>
                      <td className="py-2 px-3 text-right font-mono font-bold text-rose-700">
                        {formatINR(c.balanceDue)}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Signature */}
        <div className="pt-6 border-t border-stone-200 flex justify-between items-end text-xs">
          <span className="text-stone-400">Yamuna Farming Agro Management System</span>
          <div className="text-right">
            <p className="font-serif italic text-base text-emerald-900">Mohit Kumar Mahato</p>
            <p className="font-bold text-stone-800">Mohit Kumar Mahato</p>
            <p className="text-[10px] text-stone-500">Farm Owner & Manager</p>
          </div>
        </div>
      </div>
    </div>
  );
};
