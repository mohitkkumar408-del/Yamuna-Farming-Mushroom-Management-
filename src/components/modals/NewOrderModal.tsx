import React, { useState } from 'react';
import { X, AlertCircle, CheckCircle, Package, Plus } from 'lucide-react';
import { useFarm } from '../../context/FarmContext';
import { OrderStatus, PaymentMethod, MushroomVariety } from '../../types';
import { formatINR } from '../../services/i18n';

interface NewOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewOrderModal: React.FC<NewOrderModalProps> = ({ isOpen, onClose }) => {
  const { state, t, lang, addOrder, addCustomer } = useFarm();

  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(state.customers[0]?.id || '');
  const [isNewCustomer, setIsNewCustomer] = useState(false);
  const [newCustName, setNewCustName] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');
  const [newCustAddress, setNewCustAddress] = useState('');
  const [newCustType, setNewCustType] = useState<'retail' | 'wholesale' | 'hotel' | 'mandi_trader'>('retail');

  const [variety, setVariety] = useState<MushroomVariety>('Oyster');
  const [quantityKg, setQuantityKg] = useState<number>(10);
  const [pricePerKg, setPricePerKg] = useState<number>(state.settings.defaultOysterPrice || 160);
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [deliveryCharge, setDeliveryCharge] = useState<number>(100);
  const [advancePaid, setAdvancePaid] = useState<number>(0);
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi');
  const [status, setStatus] = useState<OrderStatus>('confirmed');
  const [notes, setNotes] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  // Find stock for selected variety
  const currentStock = state.stocks.find(
    (s) => s.variety.toLowerCase() === variety.toLowerCase()
  );
  const availableKg = currentStock ? currentStock.availableKg : 0;

  // Selected customer details
  const selectedCustomer = state.customers.find((c) => c.id === selectedCustomerId);

  // Calculations
  const subtotal = (quantityKg || 0) * (pricePerKg || 0);
  const totalAmount = Math.max(0, subtotal - (discountAmount || 0) + (deliveryCharge || 0));
  const balanceDue = Math.max(0, totalAmount - (advancePaid || 0));

  const handleVarietyChange = (v: MushroomVariety) => {
    setVariety(v);
    let defaultPrice = state.settings.defaultOysterPrice;
    if (v === 'Button') defaultPrice = state.settings.defaultButtonPrice;
    else if (v === 'Milky') defaultPrice = state.settings.defaultMilkyPrice;
    else if (v === 'Shiitake') defaultPrice = state.settings.defaultShiitakePrice;
    else if (v === 'Paddy Straw') defaultPrice = state.settings.defaultPaddyStrawPrice;
    setPricePerKg(defaultPrice);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (quantityKg <= 0) {
      setErrorMessage('Order quantity must be greater than 0 kg.');
      return;
    }
    if (pricePerKg <= 0) {
      setErrorMessage('Price per kg must be greater than 0.');
      return;
    }

    let customerId = selectedCustomerId;
    let customerName = selectedCustomer?.name || 'Walk-in Customer';
    let customerPhone = selectedCustomer?.phone || '';
    let customerAddress = selectedCustomer?.address || '';

    if (isNewCustomer) {
      if (!newCustName.trim() || !newCustPhone.trim()) {
        setErrorMessage('Customer name and phone number are required.');
        return;
      }
      customerId = `cust_${Date.now()}`;
      customerName = newCustName.trim();
      customerPhone = newCustPhone.trim();
      customerAddress = newCustAddress.trim();

      addCustomer({
        name: customerName,
        phone: customerPhone,
        address: customerAddress,
        type: newCustType,
      });
    }

    const res = addOrder({
      orderDate: new Date().toISOString().split('T')[0],
      customerId,
      customerName,
      customerPhone,
      customerAddress,
      variety,
      quantityKg: Number(quantityKg),
      pricePerKg: Number(pricePerKg),
      discountAmount: Number(discountAmount) || 0,
      deliveryCharge: Number(deliveryCharge) || 0,
      totalAmount,
      advancePaid: Number(advancePaid) || 0,
      amountPaid: Number(advancePaid) || 0,
      balanceDue,
      expectedDeliveryDate,
      paymentMethod,
      status,
      notes,
    });

    if (!res.success) {
      setErrorMessage(res.error || 'Failed to create order.');
      return;
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-stone-200 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-150">
        <div className="px-5 py-4 bg-emerald-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-emerald-200" />
            <h2 className="text-base sm:text-lg font-bold">
              {lang === 'hi' ? 'नया मशरूम ऑर्डर दर्ज करें' : 'Create New Mushroom Order'}
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
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Customer Selection */}
          <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-stone-800">
                {lang === 'hi' ? 'ग्राहक जानकारी' : 'Customer Details'}
              </span>
              <button
                type="button"
                onClick={() => setIsNewCustomer(!isNewCustomer)}
                className="text-xs text-emerald-700 font-semibold hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                {isNewCustomer
                  ? lang === 'hi'
                    ? 'मौजूदा ग्राहक चुनें'
                    : 'Choose Existing Customer'
                  : lang === 'hi'
                  ? 'नया ग्राहक जोड़ें'
                  : 'Add New Customer'}
              </button>
            </div>

            {!isNewCustomer ? (
              <div>
                <select
                  value={selectedCustomerId}
                  onChange={(e) => setSelectedCustomerId(e.target.value)}
                  className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-800 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                >
                  {state.customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.phone}) - {c.type.toUpperCase()}
                    </option>
                  ))}
                </select>
                {selectedCustomer && (
                  <p className="text-[11px] text-stone-500 mt-1 truncate">
                    📍 {selectedCustomer.address} | Dues: {formatINR(selectedCustomer.balanceDue)}
                  </p>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <input
                  type="text"
                  placeholder="Customer Full Name *"
                  value={newCustName}
                  onChange={(e) => setNewCustName(e.target.value)}
                  className="bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-800 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  required
                />
                <input
                  type="tel"
                  placeholder="Phone Number *"
                  value={newCustPhone}
                  onChange={(e) => setNewCustPhone(e.target.value)}
                  className="bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-800 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  required
                />
                <input
                  type="text"
                  placeholder="Delivery Address *"
                  value={newCustAddress}
                  onChange={(e) => setNewCustAddress(e.target.value)}
                  className="sm:col-span-2 bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-800 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  required
                />
                <select
                  value={newCustType}
                  onChange={(e) => setNewCustType(e.target.value as any)}
                  className="bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-800 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                >
                  <option value="retail">Retail Customer</option>
                  <option value="wholesale">Sabzi Mandi Wholesaler</option>
                  <option value="hotel">Hotel / Restaurant</option>
                </select>
              </div>
            )}
          </div>

          {/* Variety & Stock Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-stone-700 font-semibold mb-1">
                {lang === 'hi' ? 'मशरूम किस्म' : 'Mushroom Variety'} *
              </label>
              <select
                value={variety}
                onChange={(e) => handleVarietyChange(e.target.value as MushroomVariety)}
                className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-800 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              >
                <option value="Oyster">Oyster (ढींगरी मशरूम)</option>
                <option value="Button">Button (बटन मशरूम)</option>
                <option value="Milky">Milky (दूधिया मशरूम)</option>
                <option value="Shiitake">Shiitake Mushroom</option>
                <option value="Paddy Straw">Paddy Straw (पुआल खुंभी)</option>
              </select>
              <div className="flex items-center justify-between text-[11px] mt-1">
                <span className="text-stone-500">Live Available Stock:</span>
                <span className={`font-bold ${availableKg < 10 ? 'text-rose-600' : 'text-emerald-700'}`}>
                  {availableKg.toFixed(1)} kg available
                </span>
              </div>
            </div>

            <div>
              <label className="block text-stone-700 font-semibold mb-1">
                {lang === 'hi' ? 'मात्रा (किग्रा)' : 'Order Quantity (kg)'} *
              </label>
              <input
                type="number"
                step="0.5"
                min="0.5"
                value={quantityKg}
                onChange={(e) => setQuantityKg(parseFloat(e.target.value) || 0)}
                className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-800 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden font-bold"
                required
              />
              {quantityKg > availableKg && (
                <p className="text-[11px] text-amber-600 font-medium mt-1">
                  ⚠️ Note: Exceeds current available stock ({availableKg.toFixed(1)} kg).
                </p>
              )}
            </div>
          </div>

          {/* Pricing, Discount, Delivery */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-stone-700 font-semibold mb-1">
                {lang === 'hi' ? 'दर (₹/किग्रा)' : 'Price per kg (₹)'} *
              </label>
              <input
                type="number"
                min="10"
                value={pricePerKg}
                onChange={(e) => setPricePerKg(parseFloat(e.target.value) || 0)}
                className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-800 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                required
              />
            </div>

            <div>
              <label className="block text-stone-700 font-semibold mb-1">
                {lang === 'hi' ? 'छूट (₹)' : 'Discount (₹)'}
              </label>
              <input
                type="number"
                min="0"
                value={discountAmount}
                onChange={(e) => setDiscountAmount(parseFloat(e.target.value) || 0)}
                className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-800 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-stone-700 font-semibold mb-1">
                {lang === 'hi' ? 'डिलीवरी चार्ज (₹)' : 'Delivery Charge (₹)'}
              </label>
              <input
                type="number"
                min="0"
                value={deliveryCharge}
                onChange={(e) => setDeliveryCharge(parseFloat(e.target.value) || 0)}
                className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-800 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Payment & Advance */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-stone-700 font-semibold mb-1">
                {lang === 'hi' ? 'अग्रिम राशि (₹)' : 'Advance Payment (₹)'}
              </label>
              <input
                type="number"
                min="0"
                max={totalAmount}
                value={advancePaid}
                onChange={(e) => setAdvancePaid(parseFloat(e.target.value) || 0)}
                className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-800 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-stone-700 font-semibold mb-1">
                {lang === 'hi' ? 'भुगतान विधि' : 'Payment Mode'}
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-800 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              >
                <option value="upi">UPI / GPay / PhonePe</option>
                <option value="cash">Cash on Delivery / Gate</option>
                <option value="bank_transfer">Bank Transfer (NEFT/IMPS)</option>
                <option value="cheque">Bank Cheque</option>
              </select>
            </div>

            <div>
              <label className="block text-stone-700 font-semibold mb-1">
                {lang === 'hi' ? 'ऑर्डर स्थिति' : 'Initial Order Status'}
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as OrderStatus)}
                className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-800 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              >
                <option value="confirmed">Confirmed (Reserves Stock)</option>
                <option value="new">New Order (Pending Review)</option>
                <option value="processing">In Preparation</option>
                <option value="ready_for_dispatch">Ready for Dispatch</option>
              </select>
            </div>
          </div>

          {/* Delivery Date & Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-stone-700 font-semibold mb-1">
                {lang === 'hi' ? 'अपेक्षित डिलीवरी दिनांक' : 'Expected Delivery Date'} *
              </label>
              <input
                type="date"
                value={expectedDeliveryDate}
                onChange={(e) => setExpectedDeliveryDate(e.target.value)}
                className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-800 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                required
              />
            </div>

            <div>
              <label className="block text-stone-700 font-semibold mb-1">
                {lang === 'hi' ? 'विशेष टिप्पणी' : 'Order Notes'}
              </label>
              <input
                type="text"
                placeholder="e.g. 200g punnet packing, morning delivery"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-800 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Order Summary Box */}
          <div className="p-3 bg-stone-100 rounded-xl border border-stone-200 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div>
              <span className="text-stone-500 block">Calculated Total:</span>
              <span className="text-base font-extrabold text-stone-900">{formatINR(totalAmount)}</span>
            </div>
            <div>
              <span className="text-stone-500 block">Advance Deposit:</span>
              <span className="text-sm font-bold text-emerald-700">{formatINR(advancePaid)}</span>
            </div>
            <div>
              <span className="text-stone-500 block">Remaining Due:</span>
              <span className="text-sm font-extrabold text-rose-700">{formatINR(balanceDue)}</span>
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
              {lang === 'hi' ? 'ऑर्डर सुरक्षित करें' : 'Create & Reserve Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
