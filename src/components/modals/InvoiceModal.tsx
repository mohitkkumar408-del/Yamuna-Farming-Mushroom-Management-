import React from 'react';
import { X, Printer, Sprout, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useFarm } from '../../context/FarmContext';
import { Order } from '../../types';
import { formatINR, formatDate } from '../../services/i18n';

interface InvoiceModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ order, isOpen, onClose }) => {
  const { state, lang } = useFarm();

  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  const invoiceNumber = order.orderNumber.replace('YF-ORD', 'YF-INV');

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full border border-stone-200 overflow-hidden my-6">
        {/* Modal Toolbar - Hidden during print */}
        <div className="no-print px-5 py-3.5 bg-stone-900 text-white flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-2">
            <Printer className="w-4 h-4 text-emerald-400" />
            <span className="font-bold text-sm">
              {lang === 'hi' ? 'व्यापारिक बिल पूर्वावलोकन' : 'Commercial Invoice Preview'} ({invoiceNumber})
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              {lang === 'hi' ? 'बिल प्रिंट करें' : 'Print Invoice'}
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Sheet */}
        <div className="p-6 sm:p-8 space-y-6 text-stone-800 bg-white" id="printable-invoice">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b-2 border-emerald-800 pb-5 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-800 text-emerald-100 flex items-center justify-center shadow-xs">
                <Sprout className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-emerald-950 tracking-tight">
                  {state.settings.farmName}
                </h1>
                <p className="text-xs text-stone-500 font-medium">
                  {lang === 'hi' ? 'आधुनिक मशरूम फार्मिंग एवं थोक-खुदरा विक्रेता' : 'Modern Mushroom Cultivation & Agro Sales'}
                </p>
                <p className="text-[11px] text-stone-600 mt-0.5">
                  Owner: <strong>{state.settings.ownerName}</strong> | Tel: {state.settings.phone}
                </p>
              </div>
            </div>

            <div className="text-left sm:text-right text-xs space-y-0.5">
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-extrabold uppercase tracking-wider text-[10px]">
                TAX INVOICE / BILL
              </span>
              <p className="font-mono font-bold text-stone-900 pt-1 text-sm">{invoiceNumber}</p>
              <p className="text-stone-500">Order Ref: {order.orderNumber}</p>
              <p className="text-stone-500">Date: {formatDate(order.orderDate)}</p>
              {state.settings.gstin && (
                <p className="text-[10px] text-stone-500 font-mono">GSTIN: {state.settings.gstin}</p>
              )}
            </div>
          </div>

          {/* Billed To / Farm Address */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-stone-50 p-4 rounded-xl border border-stone-200">
            <div>
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block mb-1">
                Billed To (Customer):
              </span>
              <p className="text-sm font-bold text-stone-900">{order.customerName}</p>
              <p className="text-stone-600 mt-0.5">📞 {order.customerPhone}</p>
              <p className="text-stone-600 mt-0.5">📍 {order.customerAddress}</p>
            </div>

            <div className="sm:text-right">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block mb-1">
                Dispatched From:
              </span>
              <p className="font-bold text-stone-900">{state.settings.farmName}</p>
              <p className="text-stone-600 mt-0.5">{state.settings.address}</p>
              <p className="text-stone-600 mt-0.5">Email: {state.settings.email}</p>
              {state.settings.fssaiNumber && (
                <p className="text-[10px] text-emerald-800 font-mono mt-1">
                  Lic. {state.settings.fssaiNumber}
                </p>
              )}
            </div>
          </div>

          {/* Items Table */}
          <div className="border border-stone-200 rounded-xl overflow-hidden">
            <table className="w-full text-xs">
              <thead className="bg-stone-100 border-b border-stone-200 font-bold text-stone-700">
                <tr>
                  <th className="py-2.5 px-3 text-left">#</th>
                  <th className="py-2.5 px-3 text-left">Item Description</th>
                  <th className="py-2.5 px-3 text-right">Qty (kg)</th>
                  <th className="py-2.5 px-3 text-right">Rate (₹/kg)</th>
                  <th className="py-2.5 px-3 text-right">Amount (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                <tr>
                  <td className="py-3 px-3 text-stone-500 font-mono">1</td>
                  <td className="py-3 px-3">
                    <p className="font-bold text-stone-900">
                      Fresh {order.variety} Mushroom (ताजा मशरूम)
                    </p>
                    <p className="text-[11px] text-stone-500">
                      Farm harvested, sorted & Grade A packed. {order.notes || ''}
                    </p>
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-stone-900">
                    {order.quantityKg.toFixed(2)} kg
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-stone-800">
                    {formatINR(order.pricePerKg)}
                  </td>
                  <td className="py-3 px-3 text-right font-bold font-mono text-stone-900">
                    {formatINR(order.quantityKg * order.pricePerKg)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Financial Breakdown */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 text-xs">
            <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 w-full sm:max-w-xs space-y-1">
              <span className="font-bold text-stone-800 block text-xs">
                Payment & Fulfillment Details:
              </span>
              <p className="text-stone-600">
                Payment Mode: <strong className="uppercase">{order.paymentMethod}</strong>
              </p>
              <p className="text-stone-600">
                Delivery Target: <strong>{formatDate(order.expectedDeliveryDate)}</strong>
              </p>
              <p className="text-stone-600">
                Status: <strong className="uppercase text-emerald-800">{order.status}</strong>
              </p>
            </div>

            <div className="w-full sm:max-w-xs space-y-2">
              <div className="flex justify-between py-1 text-stone-600">
                <span>Subtotal:</span>
                <span className="font-mono font-medium">
                  {formatINR(order.quantityKg * order.pricePerKg)}
                </span>
              </div>
              {order.discountAmount > 0 && (
                <div className="flex justify-between py-1 text-rose-600">
                  <span>Special Discount:</span>
                  <span className="font-mono">- {formatINR(order.discountAmount)}</span>
                </div>
              )}
              {order.deliveryCharge > 0 && (
                <div className="flex justify-between py-1 text-stone-600">
                  <span>Delivery & Transport:</span>
                  <span className="font-mono">+ {formatINR(order.deliveryCharge)}</span>
                </div>
              )}
              <div className="flex justify-between py-2 border-t-2 border-stone-300 text-sm font-extrabold text-stone-900">
                <span>Grand Total:</span>
                <span className="font-mono text-emerald-900 text-base">
                  {formatINR(order.totalAmount)}
                </span>
              </div>
              <div className="flex justify-between py-1 text-emerald-700 font-semibold border-t border-stone-100">
                <span>Amount Paid / Advance:</span>
                <span className="font-mono">{formatINR(order.amountPaid)}</span>
              </div>
              <div className="flex justify-between py-1 text-rose-700 font-extrabold">
                <span>Balance Due:</span>
                <span className="font-mono text-sm">{formatINR(order.balanceDue)}</span>
              </div>
            </div>
          </div>

          {/* Footer Signature & Quality Guarantee */}
          <div className="pt-6 border-t border-stone-200 flex flex-col sm:flex-row justify-between items-end gap-6 text-xs">
            <div className="space-y-1">
              <p className="text-[11px] text-stone-500 font-medium">
                🌱 100% Organically Grown Fresh Mushrooms • Harvested Daily • Consume Fresh
              </p>
              <p className="text-[10px] text-stone-400">
                Thank you for supporting sustainable farming at Yamuna Farming!
              </p>
            </div>

            <div className="text-center sm:text-right border-t border-stone-300 sm:border-0 pt-3 sm:pt-0">
              <p className="text-[11px] text-stone-400 font-medium">For Yamuna Farming</p>
              <div className="h-10 flex items-center justify-center sm:justify-end text-emerald-800 font-serif italic text-base">
                Mohit Kumar Mahato
              </div>
              <p className="text-xs font-bold text-stone-800">Mohit Kumar Mahato</p>
              <p className="text-[10px] text-stone-500">Authorized Farm Owner & Signatory</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
