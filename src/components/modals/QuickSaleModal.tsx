import React, { useState } from 'react';
import { X, Zap, DollarSign, AlertCircle } from 'lucide-react';
import { useFarm } from '../../context/FarmContext';
import { MushroomVariety, PaymentMethod } from '../../types';
import { formatINR } from '../../services/i18n';

interface QuickSaleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuickSaleModal: React.FC<QuickSaleModalProps> = ({ isOpen, onClose }) => {
  const { state, lang, t, addOrder } = useFarm();

  const [customerName, setCustomerName] = useState('Walk-in Customer (फार्म-गेट ग्राहक)');
  const [customerPhone, setCustomerPhone] = useState('Farm Gate Direct');
  const [variety, setVariety] = useState<MushroomVariety>('Oyster');
  const [quantityKg, setQuantityKg] = useState<number>(2);
  const [pricePerKg, setPricePerKg] = useState<number>(state.settings.defaultOysterPrice || 160);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const currentStock = state.stocks.find(
    (s) => s.variety.toLowerCase() === variety.toLowerCase()
  );
  const availableKg = currentStock ? currentStock.availableKg : 0;
  const totalAmount = (quantityKg || 0) * (pricePerKg || 0);

  const handleVarietyChange = (v: MushroomVariety) => {
    setVariety(v);
    let defaultPrice = state.settings.defaultOysterPrice;
    if (v === 'Button') defaultPrice = state.settings.defaultButtonPrice;
    else if (v === 'Milky') defaultPrice = state.settings.defaultMilkyPrice;
    else if (v === 'Shiitake') defaultPrice = state.settings.defaultShiitakePrice;
    else if (v === 'Paddy Straw') defaultPrice = state.settings.defaultPaddyStrawPrice;
    setPricePerKg(defaultPrice);
  };

  const handleCompleteSale = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (quantityKg <= 0) {
      setError('Quantity must be greater than 0 kg.');
      return;
    }
    if (availableKg < quantityKg) {
      setError(`Only ${availableKg.toFixed(1)} kg available. Cannot complete sale.`);
      return;
    }

    const todayStr = new Date().toISOString().split('T')[0];

    // Quick direct sale: marks directly as delivered & paid
    const res = addOrder({
      orderDate: todayStr,
      customerId: 'cust_direct_walkin',
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      customerAddress: 'Yamuna Farming Counter / Farm Gate',
      variety,
      quantityKg: Number(quantityKg),
      pricePerKg: Number(pricePerKg),
      discountAmount: 0,
      deliveryCharge: 0,
      totalAmount,
      advancePaid: totalAmount,
      amountPaid: totalAmount,
      balanceDue: 0,
      expectedDeliveryDate: todayStr,
      paymentMethod,
      status: 'delivered', // Immediate handover
      notes: 'Farm gate quick walk-in sale. Handed over at farm reception.',
    });

    if (!res.success) {
      setError(res.error || 'Failed to complete quick sale.');
      return;
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-stone-200 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-150">
        <div className="px-5 py-4 bg-gradient-to-r from-amber-600 to-amber-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-200 fill-amber-200" />
            <h2 className="text-base sm:text-lg font-bold">
              {lang === 'hi' ? 'त्वरित फार्म-गेट नकद / UPI बिक्री' : 'Quick Farm-Gate Direct POS'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-amber-100 hover:text-white hover:bg-amber-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleCompleteSale} className="p-5 space-y-4 text-xs sm:text-sm">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-stone-700 font-semibold mb-1">
              {lang === 'hi' ? 'ग्राहक का नाम' : 'Customer Name'}
            </label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-800 focus:ring-2 focus:ring-amber-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-stone-700 font-semibold mb-1">
                {lang === 'hi' ? 'मशरूम किस्म' : 'Variety'}
              </label>
              <select
                value={variety}
                onChange={(e) => handleVarietyChange(e.target.value as MushroomVariety)}
                className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-800 focus:ring-2 focus:ring-amber-500"
              >
                <option value="Oyster">Oyster (ढींगरी)</option>
                <option value="Button">Button (बटन)</option>
                <option value="Milky">Milky (दूधिया)</option>
                <option value="Shiitake">Shiitake</option>
                <option value="Paddy Straw">Paddy Straw</option>
              </select>
              <span className="text-[10px] text-stone-500 block mt-0.5">
                Stock: <strong className="text-emerald-700">{availableKg.toFixed(1)} kg</strong>
              </span>
            </div>

            <div>
              <label className="block text-stone-700 font-semibold mb-1">
                {lang === 'hi' ? 'मात्रा (किग्रा)' : 'Weight (kg)'} *
              </label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                max={availableKg}
                value={quantityKg}
                onChange={(e) => setQuantityKg(parseFloat(e.target.value) || 0)}
                className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-800 font-bold text-base focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-stone-700 font-semibold mb-1">
                {lang === 'hi' ? 'दर (₹/किग्रा)' : 'Rate (₹/kg)'}
              </label>
              <input
                type="number"
                value={pricePerKg}
                onChange={(e) => setPricePerKg(parseFloat(e.target.value) || 0)}
                className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-800 focus:ring-2 focus:ring-amber-500"
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
                className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-800 focus:ring-2 focus:ring-amber-500"
              >
                <option value="cash">Hard Cash (नकद)</option>
                <option value="upi">UPI / QR Code Scan</option>
              </select>
            </div>
          </div>

          {/* Quick Pay Box */}
          <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-center space-y-1">
            <span className="text-xs text-amber-800 font-semibold block uppercase">
              Immediate Amount to Collect:
            </span>
            <span className="text-2xl font-black text-amber-950 font-mono block">
              {formatINR(totalAmount)}
            </span>
            <span className="text-[11px] text-amber-700 block">
              Stock will be deducted and cash recorded in cashbook instantly.
            </span>
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
              className="px-5 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-xl font-bold shadow-md shadow-amber-800/20"
            >
              ⚡ {lang === 'hi' ? 'बिक्री पूरी करें' : 'Complete Instant Sale'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
