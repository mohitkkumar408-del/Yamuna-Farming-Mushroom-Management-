import React from 'react';
import { X, Printer, Users, FileText } from 'lucide-react';
import { useFarm } from '../../context/FarmContext';
import { Customer } from '../../types';
import { formatINR, formatDate } from '../../services/i18n';

interface CustomerStatementModalProps {
  customer: Customer | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CustomerStatementModal: React.FC<CustomerStatementModalProps> = ({
  customer,
  isOpen,
  onClose,
}) => {
  const { state, lang } = useFarm();

  if (!isOpen || !customer) return null;

  const customerOrders = state.orders.filter((o) => o.customerId === customer.id);
  const customerPayments = state.payments.filter(
    (p) => p.partyName.toLowerCase() === customer.name.toLowerCase()
  );

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full border border-stone-200 overflow-hidden my-6">
        <div className="no-print px-5 py-3.5 bg-stone-900 text-white flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-400" />
            <span className="font-bold text-sm">
              {lang === 'hi' ? 'ग्राहक खाता विवरण (Ledger Statement)' : 'Customer Statement of Account'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              {lang === 'hi' ? 'स्टेटमेंट प्रिंट करें' : 'Print Statement'}
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-6 text-stone-800 bg-white" id="customer-statement">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b pb-4">
            <div>
              <h1 className="text-xl font-black text-emerald-950">{state.settings.farmName}</h1>
              <p className="text-xs text-stone-500">{state.settings.address}</p>
              <p className="text-xs text-stone-500">
                Owner: {state.settings.ownerName} | Tel: {state.settings.phone}
              </p>
            </div>
            <div className="sm:text-right text-xs">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-extrabold text-[10px]">
                CUSTOMER LEDGER STATEMENT
              </span>
              <p className="text-stone-500 mt-1">Generated: {formatDate(new Date().toISOString())}</p>
            </div>
          </div>

          {/* Customer Summary Card */}
          <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <p className="font-extrabold text-sm text-stone-900">{customer.name}</p>
              <p className="text-stone-600 mt-0.5">📞 {customer.phone}</p>
              <p className="text-stone-600 mt-0.5">📍 {customer.address}</p>
              <p className="text-stone-500 mt-0.5 uppercase font-medium">Category: {customer.type}</p>
            </div>
            <div className="space-y-1 sm:text-right">
              <p className="text-stone-500">
                Total Billed: <strong className="text-stone-900">{formatINR(customer.totalBilledAmount)}</strong>
              </p>
              <p className="text-emerald-700">
                Total Paid: <strong className="font-bold">{formatINR(customer.totalPaidAmount)}</strong>
              </p>
              <p className="text-rose-700 font-extrabold text-sm">
                Outstanding Balance Due: {formatINR(customer.balanceDue)}
              </p>
            </div>
          </div>

          {/* Orders History */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-stone-700 uppercase tracking-wider">
              Order Transactions ({customerOrders.length})
            </h3>
            <div className="border border-stone-200 rounded-xl overflow-hidden">
              <table className="w-full text-xs">
                <thead className="bg-stone-100 text-stone-700 border-b">
                  <tr>
                    <th className="py-2 px-3 text-left">Date</th>
                    <th className="py-2 px-3 text-left">Order #</th>
                    <th className="py-2 px-3 text-left">Item</th>
                    <th className="py-2 px-3 text-right">Qty</th>
                    <th className="py-2 px-3 text-right">Total</th>
                    <th className="py-2 px-3 text-right">Paid</th>
                    <th className="py-2 px-3 text-right">Due</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {customerOrders.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-4 text-center text-stone-400">
                        No orders recorded for this customer yet.
                      </td>
                    </tr>
                  ) : (
                    customerOrders.map((ord) => (
                      <tr key={ord.id}>
                        <td className="py-2 px-3 text-stone-600">{formatDate(ord.orderDate)}</td>
                        <td className="py-2 px-3 font-mono font-bold text-stone-900">{ord.orderNumber}</td>
                        <td className="py-2 px-3">{ord.variety}</td>
                        <td className="py-2 px-3 text-right">{ord.quantityKg} kg</td>
                        <td className="py-2 px-3 text-right font-medium">{formatINR(ord.totalAmount)}</td>
                        <td className="py-2 px-3 text-right text-emerald-700">{formatINR(ord.amountPaid)}</td>
                        <td className="py-2 px-3 text-right font-bold text-rose-700">
                          {formatINR(ord.balanceDue)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Payment Receipts History */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-stone-700 uppercase tracking-wider">
              Payments Received ({customerPayments.length})
            </h3>
            <div className="border border-stone-200 rounded-xl overflow-hidden">
              <table className="w-full text-xs">
                <thead className="bg-stone-100 text-stone-700 border-b">
                  <tr>
                    <th className="py-2 px-3 text-left">Date</th>
                    <th className="py-2 px-3 text-left">Txn Code</th>
                    <th className="py-2 px-3 text-left">Mode</th>
                    <th className="py-2 px-3 text-left">Reference #</th>
                    <th className="py-2 px-3 text-right">Amount Received</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {customerPayments.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-4 text-center text-stone-400">
                        No direct payment transactions found.
                      </td>
                    </tr>
                  ) : (
                    customerPayments.map((p) => (
                      <tr key={p.id}>
                        <td className="py-2 px-3 text-stone-600">{formatDate(p.date)}</td>
                        <td className="py-2 px-3 font-mono">{p.transactionCode}</td>
                        <td className="py-2 px-3 uppercase">{p.paymentMethod}</td>
                        <td className="py-2 px-3 text-stone-500 font-mono">{p.referenceNumber || '-'}</td>
                        <td className="py-2 px-3 text-right font-bold text-emerald-800">
                          {formatINR(p.amount)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
