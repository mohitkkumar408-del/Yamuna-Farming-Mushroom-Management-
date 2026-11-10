import React, { useState } from 'react';
import {
  Wallet,
  Plus,
  Search,
  Filter,
  ArrowDownLeft,
  ArrowUpRight,
  CreditCard,
  Calendar,
  CheckCircle2,
} from 'lucide-react';
import { useFarm } from '../context/FarmContext';
import { formatINR, formatDate } from '../services/i18n';
import { RecordPaymentModal } from '../components/modals/RecordPaymentModal';

export const PaymentsPage: React.FC = () => {
  const { state, lang, t, metrics } = useFarm();

  const [search, setSearch] = useState('');
  const [filterDirection, setFilterDirection] = useState<'all' | 'in' | 'out'>('all');
  const [filterMethod, setFilterMethod] = useState<string>('all');
  const [showAddPaymentModal, setShowAddPaymentModal] = useState(false);

  const filteredPayments = state.payments.filter((p) => {
    const matchesSearch =
      p.transactionCode.toLowerCase().includes(search.toLowerCase()) ||
      p.partyName.toLowerCase().includes(search.toLowerCase()) ||
      (p.referenceNumber && p.referenceNumber.toLowerCase().includes(search.toLowerCase())) ||
      (p.notes && p.notes.toLowerCase().includes(search.toLowerCase()));

    const matchesDir = filterDirection === 'all' || p.direction === filterDirection;
    const matchesMethod = filterMethod === 'all' || p.paymentMethod === filterMethod;

    return matchesSearch && matchesDir && matchesMethod;
  });

  const totalIn = state.payments
    .filter((p) => p.direction === 'in')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalOut = state.payments
    .filter((p) => p.direction === 'out')
    .reduce((sum, p) => sum + p.amount, 0);

  const netCashBalance = totalIn - totalOut;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight flex items-center gap-2">
            <Wallet className="w-6 h-6 text-emerald-700" />
            {lang === 'hi' ? 'भुगतान एवं दैनिक रोकड़ बही (Cashbook)' : 'Payments Ledger & Daily Cashbook'}
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            {lang === 'hi'
              ? 'ग्राहक भुगतान, अग्रिम जमा, सप्लायर भुगतान, नकद/UPI हिसाब एवं दैनिक कैश बैलेंस'
              : 'Record cash in/out, UPI transactions, bank transfers, supplier payouts and cash balance'}
          </p>
        </div>

        <button
          onClick={() => setShowAddPaymentModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-emerald-800/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          {t.recordPayment}
        </button>
      </div>

      {/* Cashbook Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-stone-500 block">Total Cash / UPI Received (IN)</span>
            <span className="text-2xl font-black text-emerald-800 mt-1 block font-mono">
              {formatINR(totalIn)}
            </span>
            <span className="text-[11px] text-stone-400">Customer payments & advances</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <ArrowDownLeft className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-stone-500 block">Total Cash Disbursed (OUT)</span>
            <span className="text-2xl font-black text-rose-700 mt-1 block font-mono">
              {formatINR(totalOut)}
            </span>
            <span className="text-[11px] text-stone-400">Suppliers, wages & farm expenses</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center">
            <ArrowUpRight className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-stone-500 block">Net Running Cashbook Balance</span>
            <span className={`text-2xl font-black mt-1 block font-mono ${netCashBalance >= 0 ? 'text-emerald-950' : 'text-rose-700'}`}>
              {formatINR(netCashBalance)}
            </span>
            <span className="text-[11px] text-stone-500">Available cash & bank pool</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
            <Wallet className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-3.5 rounded-xl border border-stone-200 flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder={lang === 'hi' ? 'ट्रांजैक्शन कोड, पार्टी का नाम, UTR नंबर खोजें...' : 'Search by txn code, party name, UTR / ref...'}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-stone-50 border border-stone-200 rounded-lg pl-9 pr-3 py-1.5 text-xs text-stone-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={filterDirection}
            onChange={(e) => setFilterDirection(e.target.value as any)}
            className="bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1.5 text-xs text-stone-700 focus:outline-hidden"
          >
            <option value="all">All Cashflow (IN & OUT)</option>
            <option value="in">Cash IN (Receipts)</option>
            <option value="out">Cash OUT (Payouts)</option>
          </select>

          <select
            value={filterMethod}
            onChange={(e) => setFilterMethod(e.target.value)}
            className="bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1.5 text-xs text-stone-700 focus:outline-hidden"
          >
            <option value="all">All Payment Methods</option>
            <option value="upi">UPI / GPay / PhonePe</option>
            <option value="cash">Hard Cash</option>
            <option value="bank_transfer">Bank Transfer</option>
            <option value="cheque">Cheque</option>
          </select>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-stone-100 text-stone-700 font-bold border-b border-stone-200 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Txn Code</th>
                <th className="py-3 px-4">Direction</th>
                <th className="py-3 px-4">Party / Source</th>
                <th className="py-3 px-4">Method & Ref</th>
                <th className="py-3 px-4 text-right">Amount (₹)</th>
                <th className="py-3 px-4">Notes</th>
                <th className="py-3 px-4">Recorded By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-stone-400">
                    No payment transactions found matching filter.
                  </td>
                </tr>
              ) : (
                filteredPayments.map((p) => {
                  const isIncoming = p.direction === 'in';

                  return (
                    <tr key={p.id} className="hover:bg-stone-50 transition-colors">
                      <td className="py-3 px-4 text-stone-700">{formatDate(p.date)}</td>
                      <td className="py-3 px-4 font-mono font-bold text-stone-900">{p.transactionCode}</td>
                      <td className="py-3 px-4">
                        {isIncoming ? (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase inline-flex items-center gap-1">
                            <ArrowDownLeft className="w-3 h-3" />
                            Cash IN
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold uppercase inline-flex items-center gap-1">
                            <ArrowUpRight className="w-3 h-3" />
                            Cash OUT
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 font-bold text-stone-900">{p.partyName}</td>
                      <td className="py-3 px-4">
                        <span className="font-semibold uppercase text-stone-800 block text-[11px]">
                          {p.paymentMethod}
                        </span>
                        {p.referenceNumber && (
                          <span className="text-[10px] text-stone-500 font-mono block">
                            Ref: {p.referenceNumber}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right font-extrabold text-sm font-mono">
                        <span className={isIncoming ? 'text-emerald-800' : 'text-rose-700'}>
                          {isIncoming ? `+ ${formatINR(p.amount)}` : `- ${formatINR(p.amount)}`}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-stone-500 max-w-xs truncate">{p.notes || '-'}</td>
                      <td className="py-3 px-4 text-stone-500 text-[11px]">{p.recordedBy}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showAddPaymentModal && (
        <RecordPaymentModal
          isOpen={true}
          onClose={() => setShowAddPaymentModal(false)}
        />
      )}
    </div>
  );
};
