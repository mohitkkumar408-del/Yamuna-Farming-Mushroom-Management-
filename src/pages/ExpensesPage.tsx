import React, { useState } from 'react';
import {
  CreditCard,
  Plus,
  Search,
  Filter,
  DollarSign,
  TrendingDown,
  Calendar,
} from 'lucide-react';
import { useFarm } from '../context/FarmContext';
import { ExpenseCategory } from '../types';
import { formatINR, formatDate } from '../services/i18n';
import { CategoryBarChart } from '../components/common/Charts';
import { AddExpenseModal } from '../components/modals/AddExpenseModal';

export const ExpensesPage: React.FC = () => {
  const { state, lang, t, metrics } = useFarm();

  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  const filteredExpenses = state.expenses.filter((e) => {
    const matchesSearch =
      e.recipient.toLowerCase().includes(search.toLowerCase()) ||
      e.description.toLowerCase().includes(search.toLowerCase()) ||
      (e.invoiceRef && e.invoiceRef.toLowerCase().includes(search.toLowerCase()));

    const matchesCategory = filterCategory === 'all' || e.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // Calculate breakdown by category for chart
  const categoryTotals = React.useMemo(() => {
    const map: Record<string, number> = {};
    state.expenses.forEach((e) => {
      map[e.category] = (map[e.category] || 0) + e.amount;
    });

    const colors: Record<string, string> = {
      spawn: '#10b981',
      substrate_straw: '#d97706',
      labour: '#2563eb',
      electricity_water: '#7c3aed',
      packaging: '#f59e0b',
      transport: '#06b6d4',
      rent: '#84cc16',
      equipment_maintenance: '#ef4444',
      spoilage: '#e11d48',
      miscellaneous: '#78716c',
    };

    return Object.keys(map).map((cat) => ({
      label: cat.replace('_', ' '),
      amount: map[cat],
      color: colors[cat] || '#10b981',
    }));
  }, [state.expenses]);

  const totalFilteredAmount = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-emerald-700" />
            {lang === 'hi' ? 'फार्म खर्चे एवं लागत लेखा (Expenses)' : 'Farm Operating Expenses & Cost Tracking'}
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            {lang === 'hi'
              ? 'स्पॉन, पुआल, लेबर मजदूरी, बिजली, पानी, पैकेजिंग एवं वाहन ईंधन खर्च'
              : 'Detailed breakdown of mushroom cultivation inputs, labour wages, utilities and operational expenses'}
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-emerald-800/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          {t.addExpense}
        </button>
      </div>

      {/* Top Cards: Total & Top Cost Centers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider block">
              Total Farm Expenses Recorded
            </span>
            <span className="text-3xl font-black text-rose-700 mt-2 block font-mono">
              {formatINR(metrics.totalExpenses)}
            </span>
            <p className="text-xs text-stone-500 mt-1">
              {state.expenses.length} expense transactions in system
            </p>
          </div>

          <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-600">
            <span>Average Cost per Harvested kg:</span>
            <strong className="text-stone-900 font-mono">
              {formatINR(metrics.costPerKgProduced)} / kg
            </strong>
          </div>
        </div>

        {/* Category Breakdown Bar Chart */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b pb-2">
            <h3 className="text-xs font-bold text-stone-800 uppercase tracking-wider">
              Expense Allocation by Category
            </h3>
            <span className="text-xs text-stone-400">All Time</span>
          </div>

          <CategoryBarChart data={categoryTotals} />
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-3.5 rounded-xl border border-stone-200 flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder={lang === 'hi' ? 'प्राप्तकर्ता, विवरण, बिल नंबर द्वारा खोजें...' : 'Search recipient, description, invoice ref...'}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-stone-50 border border-stone-200 rounded-lg pl-9 pr-3 py-1.5 text-xs text-stone-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1.5 text-xs text-stone-700 focus:outline-hidden w-full sm:w-auto"
        >
          <option value="all">All Expense Categories</option>
          <option value="spawn">Spawn / Seed</option>
          <option value="substrate_straw">Straw & Compost</option>
          <option value="labour">Labour Wages</option>
          <option value="electricity_water">Electricity & Water</option>
          <option value="packaging">Packaging Bags & Trays</option>
          <option value="transport">Transport & Petrol</option>
          <option value="equipment_maintenance">Equipment Repair</option>
          <option value="miscellaneous">Miscellaneous</option>
        </select>
      </div>

      {/* Expenses Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-stone-100 text-stone-700 font-bold border-b border-stone-200 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Recipient / Payee</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Method & Ref</th>
                <th className="py-3 px-4 text-right">Amount (₹)</th>
                <th className="py-3 px-4">Recorded By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredExpenses.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-stone-400">
                    No expense records found.
                  </td>
                </tr>
              ) : (
                filteredExpenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-stone-50 transition-colors">
                    <td className="py-3 px-4 text-stone-700">{formatDate(exp.date)}</td>
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-800 text-[10px] font-bold uppercase">
                        {exp.category.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-stone-900">{exp.recipient}</td>
                    <td className="py-3 px-4 text-stone-600 max-w-xs truncate">{exp.description}</td>
                    <td className="py-3 px-4">
                      <span className="font-semibold uppercase text-stone-800 block text-[11px]">
                        {exp.paymentMethod}
                      </span>
                      {exp.invoiceRef && (
                        <span className="text-[10px] text-stone-500 font-mono block">
                          Ref: {exp.invoiceRef}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right font-extrabold text-sm font-mono text-rose-700">
                      {formatINR(exp.amount)}
                    </td>
                    <td className="py-3 px-4 text-stone-500 text-[11px]">{exp.recordedBy}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && (
        <AddExpenseModal
          isOpen={true}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  );
};
