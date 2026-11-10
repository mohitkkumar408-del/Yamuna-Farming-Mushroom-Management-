import React, { useState } from 'react';
import {
  Receipt,
  Zap,
  Search,
  Filter,
  Printer,
  Calendar,
  TrendingUp,
  DollarSign,
} from 'lucide-react';
import { useFarm } from '../context/FarmContext';
import { Order } from '../types';
import { formatINR, formatKg, formatDate } from '../services/i18n';
import { InvoiceModal } from '../components/modals/InvoiceModal';

interface SalesPageProps {
  onOpenQuickSale: () => void;
}

export const SalesPage: React.FC<SalesPageProps> = ({ onOpenQuickSale }) => {
  const { state, lang, t, metrics } = useFarm();

  const [search, setSearch] = useState('');
  const [filterPeriod, setFilterPeriod] = useState<string>('all');
  const [selectedInvoice, setSelectedInvoice] = useState<Order | null>(null);

  const nonCancelledSales = state.orders.filter((o) => o.status !== 'cancelled');

  const filteredSales = nonCancelledSales.filter((o) => {
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.variety.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;

    if (filterPeriod === 'all') return true;

    const todayStr = new Date().toISOString().split('T')[0];
    if (filterPeriod === 'today') return o.orderDate === todayStr;

    const orderTime = new Date(o.orderDate).getTime();
    const now = new Date().getTime();
    const diffDays = (now - orderTime) / (1000 * 3600 * 24);

    if (filterPeriod === 'week') return diffDays <= 7;
    if (filterPeriod === 'month') return diffDays <= 30;
    if (filterPeriod === 'year') return diffDays <= 365;

    return true;
  });

  const totalFilteredRevenue = filteredSales.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalFilteredKg = filteredSales.reduce((sum, o) => sum + o.quantityKg, 0);
  const totalFilteredPaid = filteredSales.reduce((sum, o) => sum + o.amountPaid, 0);
  const totalFilteredDues = filteredSales.reduce((sum, o) => sum + o.balanceDue, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight flex items-center gap-2">
            <Receipt className="w-6 h-6 text-emerald-700" />
            {lang === 'hi' ? 'बिक्री एवं बिलिंग रिकॉर्ड्स (Sales & Invoices)' : 'Sales Records & Commercial Invoicing'}
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            {lang === 'hi'
              ? 'दैनिक, साप्ताहिक, मासिक एवं वार्षिक बिक्री, थोक बनाम खुदरा व टैक्स इनवॉइस बिल'
              : 'Daily, weekly, monthly retail & wholesale sales records with instant invoice printing'}
          </p>
        </div>

        <button
          onClick={onOpenQuickSale}
          className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all self-start sm:self-auto"
        >
          <Zap className="w-4 h-4 fill-stone-950" />
          {t.quickSale}
        </button>
      </div>

      {/* Sales Summary KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white p-4 rounded-xl border border-stone-200">
          <span className="text-xs font-semibold text-stone-500 block">Total Sales Volume</span>
          <span className="text-xl font-black text-stone-900 mt-1 block font-mono">
            {formatKg(totalFilteredKg)}
          </span>
          <span className="text-[11px] text-stone-400">{filteredSales.length} invoices</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200">
          <span className="text-xs font-semibold text-stone-500 block">Gross Sales Value</span>
          <span className="text-xl font-black text-emerald-900 mt-1 block font-mono">
            {formatINR(totalFilteredRevenue)}
          </span>
          <span className="text-[11px] text-emerald-700 font-medium">Billed revenue</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200">
          <span className="text-xs font-semibold text-stone-500 block">Cash / UPI Collected</span>
          <span className="text-xl font-black text-emerald-700 mt-1 block font-mono">
            {formatINR(totalFilteredPaid)}
          </span>
          <span className="text-[11px] text-stone-500">Realized cash in</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200">
          <span className="text-xs font-semibold text-stone-500 block">Outstanding Dues</span>
          <span className="text-xl font-black text-rose-700 mt-1 block font-mono">
            {formatINR(totalFilteredDues)}
          </span>
          <span className="text-[11px] text-rose-600 font-medium">Receivable from buyers</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-3.5 rounded-xl border border-stone-200 flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder={lang === 'hi' ? 'बिल नंबर, ग्राहक नाम, किस्म द्वारा खोजें...' : 'Search by bill #, customer name, variety...'}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-stone-50 border border-stone-200 rounded-lg pl-9 pr-3 py-1.5 text-xs text-stone-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <select
          value={filterPeriod}
          onChange={(e) => setFilterPeriod(e.target.value)}
          className="bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1.5 text-xs text-stone-700 focus:outline-hidden w-full sm:w-auto"
        >
          <option value="all">All Time Sales</option>
          <option value="today">Today's Sales</option>
          <option value="week">Past 7 Days</option>
          <option value="month">This Month</option>
          <option value="year">This Year</option>
        </select>
      </div>

      {/* Sales Invoices Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-stone-100 text-stone-700 font-bold border-b border-stone-200 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Invoice / Bill #</th>
                <th className="py-3 px-4">Customer Name</th>
                <th className="py-3 px-4">Item & Weight</th>
                <th className="py-3 px-4 text-right">Rate</th>
                <th className="py-3 px-4 text-right">Total (₹)</th>
                <th className="py-3 px-4 text-right">Received (₹)</th>
                <th className="py-3 px-4 text-right">Due (₹)</th>
                <th className="py-3 px-4 text-center">Print Bill</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredSales.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-stone-400">
                    No sales invoices found matching filter.
                  </td>
                </tr>
              ) : (
                filteredSales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-stone-50 transition-colors">
                    <td className="py-3 px-4 text-stone-700">{formatDate(sale.orderDate)}</td>
                    <td className="py-3 px-4 font-mono font-bold text-stone-900">
                      {sale.orderNumber.replace('YF-ORD', 'YF-INV')}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-stone-900 block">{sale.customerName}</span>
                      <span className="text-[11px] text-stone-500">{sale.customerPhone}</span>
                    </td>
                    <td className="py-3 px-4 font-medium text-emerald-900">
                      {sale.quantityKg} kg {sale.variety}
                    </td>
                    <td className="py-3 px-4 text-right font-mono">₹{sale.pricePerKg}/kg</td>
                    <td className="py-3 px-4 text-right font-extrabold text-sm font-mono text-stone-900">
                      {formatINR(sale.totalAmount)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-semibold text-emerald-800">
                      {formatINR(sale.amountPaid)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono">
                      {sale.balanceDue > 0 ? (
                        <span className="font-bold text-rose-700">{formatINR(sale.balanceDue)}</span>
                      ) : (
                        <span className="font-bold text-emerald-700 text-[11px]">Paid</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => setSelectedInvoice(sale)}
                        className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-xs font-semibold inline-flex items-center gap-1 transition-colors"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Print Bill</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedInvoice && (
        <InvoiceModal
          order={selectedInvoice}
          isOpen={true}
          onClose={() => setSelectedInvoice(null)}
        />
      )}
    </div>
  );
};
