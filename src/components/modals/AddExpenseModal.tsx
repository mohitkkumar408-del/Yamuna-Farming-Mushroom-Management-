import React, { useState } from 'react';
import { X, CreditCard, AlertCircle } from 'lucide-react';
import { useFarm } from '../../context/FarmContext';
import { ExpenseCategory, PaymentMethod } from '../../types';

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddExpenseModal: React.FC<AddExpenseModalProps> = ({ isOpen, onClose }) => {
  const { t, lang, addExpense, currentUser } = useFarm();

  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState<ExpenseCategory>('substrate_straw');
  const [amount, setAmount] = useState<number>(1000);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [recipient, setRecipient] = useState('');
  const [description, setDescription] = useState('');
  const [invoiceRef, setInvoiceRef] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (amount <= 0) {
      setError('Expense amount must be greater than 0.');
      return;
    }
    if (!recipient.trim()) {
      setError('Recipient or Vendor name is required.');
      return;
    }

    addExpense({
      date,
      category,
      amount: Number(amount),
      paymentMethod,
      recipient: recipient.trim(),
      description: description.trim(),
      invoiceRef: invoiceRef.trim(),
      recordedBy: currentUser?.name || 'Mohit Kumar Mahato',
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-stone-200 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-150">
        <div className="px-5 py-4 bg-emerald-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-emerald-200" />
            <h2 className="text-base sm:text-lg font-bold">
              {lang === 'hi' ? 'फार्म खर्च दर्ज करें' : 'Record Farm Expense'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-emerald-100 hover:text-white hover:bg-emerald-700/60"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs sm:text-sm">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-stone-700 font-semibold mb-1">
                {lang === 'hi' ? 'खर्च दिनांक' : 'Expense Date'} *
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-800 focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-stone-700 font-semibold mb-1">
                {lang === 'hi' ? 'खर्च श्रेणी' : 'Category'} *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
                className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-800 focus:ring-2 focus:ring-emerald-500"
              >
                <option value="spawn">Spawn / Seed Purchase</option>
                <option value="substrate_straw">Straw, Compost & Substrates</option>
                <option value="labour">Labour Wages & Daily Farm Workers</option>
                <option value="electricity_water">Electricity & Water Utilities</option>
                <option value="packaging">Packaging Bags & Punnet Trays</option>
                <option value="transport">Transportation & Delivery Petrol</option>
                <option value="rent">Farm Land / Polyhouse Rent</option>
                <option value="equipment_maintenance">Equipment Repair & Maintenance</option>
                <option value="spoilage">Spoilage & Wastage Write-off</option>
                <option value="miscellaneous">Miscellaneous Farm Overhead</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-stone-700 font-semibold mb-1">
                {lang === 'hi' ? 'राशि (₹)' : 'Amount (₹)'} *
              </label>
              <input
                type="number"
                min="1"
                value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-800 font-bold focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-stone-700 font-semibold mb-1">
                {lang === 'hi' ? 'भुगतान विधि' : 'Payment Mode'}
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-800 focus:ring-2 focus:ring-emerald-500"
              >
                <option value="cash">Cash Out of Pocket / Drawer</option>
                <option value="upi">UPI / GPay / PhonePe</option>
                <option value="bank_transfer">Bank Transfer (NEFT/IMPS)</option>
                <option value="cheque">Cheque</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-stone-700 font-semibold mb-1">
              {lang === 'hi' ? 'प्राप्तकर्ता / विक्रेता का नाम' : 'Recipient / Vendor Name'} *
            </label>
            <input
              type="text"
              placeholder="e.g. Kisan Straw Depot, Electric Utility, Daily Workers"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-800 focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-stone-700 font-semibold mb-1">
                {lang === 'hi' ? 'बिल / रसीद नंबर' : 'Invoice / Bill Reference'}
              </label>
              <input
                type="text"
                placeholder="e.g. BILL-9921 or Receipt #"
                value={invoiceRef}
                onChange={(e) => setInvoiceRef(e.target.value)}
                className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-800 focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-stone-700 font-semibold mb-1">
                {lang === 'hi' ? 'विवरण' : 'Description / Remarks'}
              </label>
              <input
                type="text"
                placeholder="e.g. 50 bundles straw for room 1"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-800 focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-xl font-medium"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold shadow-md shadow-emerald-800/20"
            >
              {lang === 'hi' ? 'खर्च सुरक्षित करें' : 'Record Expense & Cash Out'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
