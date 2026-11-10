import React, { useState } from 'react';
import { X, Wallet, AlertCircle } from 'lucide-react';
import { useFarm } from '../../context/FarmContext';
import { PaymentMethod } from '../../types';

interface RecordPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedOrderId?: string;
  preselectedCustomerId?: string;
}

export const RecordPaymentModal: React.FC<RecordPaymentModalProps> = ({
  isOpen,
  onClose,
  preselectedOrderId,
  preselectedCustomerId,
}) => {
  const { state, t, lang, addPayment, currentUser } = useFarm();

  const linkedOrder = state.orders.find((o) => o.id === preselectedOrderId);
  const linkedCustomer = state.customers.find(
    (c) => c.id === (preselectedCustomerId || linkedOrder?.customerId)
  );

  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [direction, setDirection] = useState<'in' | 'out'>('in');
  const [selectedOrderId, setSelectedOrderId] = useState(preselectedOrderId || '');
  const [partyName, setPartyName] = useState(
    linkedOrder?.customerName || linkedCustomer?.name || state.customers[0]?.name || ''
  );
  const [amount, setAmount] = useState<number>(linkedOrder?.balanceDue || 1500);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleOrderChange = (orderId: string) => {
    setSelectedOrderId(orderId);
    const ord = state.orders.find((o) => o.id === orderId);
    if (ord) {
      setPartyName(ord.customerName);
      setAmount(ord.balanceDue > 0 ? ord.balanceDue : ord.totalAmount);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (amount <= 0) {
      setError('Payment amount must be greater than 0.');
      return;
    }
    if (!partyName.trim()) {
      setError('Party or Customer name is required.');
      return;
    }

    addPayment({
      date,
      direction,
      type: direction === 'in' ? 'customer_payment' : 'supplier_payment',
      partyName: partyName.trim(),
      relatedId: selectedOrderId || undefined,
      amount: Number(amount),
      paymentMethod,
      referenceNumber: referenceNumber.trim(),
      notes: notes.trim(),
      recordedBy: currentUser?.name || 'Mohit Kumar Mahato',
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-stone-200 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-150">
        <div className="px-5 py-4 bg-emerald-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-emerald-200" />
            <h2 className="text-base sm:text-lg font-bold">
              {lang === 'hi' ? 'भुगतान प्रविष्टि दर्ज करें' : 'Record Payment / Cashbook Entry'}
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

          {/* Direction toggle */}
          <div className="flex rounded-xl bg-stone-100 p-1 border border-stone-200">
            <button
              type="button"
              onClick={() => setDirection('in')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                direction === 'in'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              📥 {lang === 'hi' ? 'रोकड़ आमद (Cash IN / Receipt)' : 'Cash IN (Customer Receipt)'}
            </button>
            <button
              type="button"
              onClick={() => setDirection('out')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                direction === 'out'
                  ? 'bg-rose-700 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              📤 {lang === 'hi' ? 'रोकड़ निकासी (Cash OUT / Payout)' : 'Cash OUT (Supplier Payout)'}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-stone-700 font-semibold mb-1">
                {lang === 'hi' ? 'दिनांक' : 'Payment Date'} *
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
                {lang === 'hi' ? 'संबंधित ऑर्डर (वैकल्पिक)' : 'Link to Order (Optional)'}
              </label>
              <select
                value={selectedOrderId}
                onChange={(e) => handleOrderChange(e.target.value)}
                className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-800 focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">-- No Specific Order --</option>
                {state.orders.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.orderNumber} ({o.customerName}) - Due: ₹{o.balanceDue}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-stone-700 font-semibold mb-1">
                {lang === 'hi' ? 'पार्टी / ग्राहक / सप्लायर' : 'Party / Customer Name'} *
              </label>
              <input
                type="text"
                value={partyName}
                onChange={(e) => setPartyName(e.target.value)}
                className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-800 focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-stone-700 font-semibold mb-1">
                {lang === 'hi' ? 'भुगतान राशि (₹)' : 'Payment Amount (₹)'} *
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
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-stone-700 font-semibold mb-1">
                {lang === 'hi' ? 'भुगतान माध्यम' : 'Payment Method'}
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-800 focus:ring-2 focus:ring-emerald-500"
              >
                <option value="upi">UPI / GPay / PhonePe</option>
                <option value="cash">Hard Cash</option>
                <option value="bank_transfer">Bank Transfer (NEFT/RTGS/IMPS)</option>
                <option value="cheque">Bank Cheque</option>
              </select>
            </div>

            <div>
              <label className="block text-stone-700 font-semibold mb-1">
                {lang === 'hi' ? 'रेफरेंस / UTR / ट्रांजैक्शन नं.' : 'UTR / Ref / Cheque #'}
              </label>
              <input
                type="text"
                placeholder="e.g. UPI/40291823901"
                value={referenceNumber}
                onChange={(e) => setReferenceNumber(e.target.value)}
                className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-800 focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-stone-700 font-semibold mb-1">
              {lang === 'hi' ? 'टिप्पणी' : 'Payment Remarks / Notes'}
            </label>
            <input
              type="text"
              placeholder="e.g. Partial balance clearance via phone pe"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-800 focus:ring-2 focus:ring-emerald-500"
            />
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
              {lang === 'hi' ? 'रोकड़ बही में दर्ज करें' : 'Record in Cashbook'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
