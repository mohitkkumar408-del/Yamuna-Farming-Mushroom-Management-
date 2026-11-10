import React, { useState } from 'react';
import {
  ShoppingCart,
  Plus,
  Search,
  Filter,
  Printer,
  Wallet,
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  Trash2,
  Calendar,
  Truck,
  ArrowRight,
} from 'lucide-react';
import { useFarm } from '../context/FarmContext';
import { Order, OrderStatus } from '../types';
import { formatINR, formatKg, formatDate } from '../services/i18n';
import { InvoiceModal } from '../components/modals/InvoiceModal';
import { RecordPaymentModal } from '../components/modals/RecordPaymentModal';

interface OrdersPageProps {
  onOpenNewOrder: () => void;
}

export const OrdersPage: React.FC<OrdersPageProps> = ({ onOpenNewOrder }) => {
  const { state, lang, t, updateOrderStatus, deleteOrder } = useFarm();

  const [activeTab, setActiveTab] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order | null>(null);
  const [payOrder, setPayOrder] = useState<Order | null>(null);
  const [statusError, setStatusError] = useState('');

  const filteredOrders = state.orders.filter((ord) => {
    const matchesSearch =
      ord.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      ord.customerName.toLowerCase().includes(search.toLowerCase()) ||
      ord.customerPhone.toLowerCase().includes(search.toLowerCase()) ||
      ord.variety.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;

    if (activeTab === 'all') return true;
    if (activeTab === 'pending') return ord.status === 'new' || ord.status === 'confirmed';
    if (activeTab === 'active') return ord.status === 'processing' || ord.status === 'ready_for_dispatch' || ord.status === 'dispatched';
    if (activeTab === 'completed') return ord.status === 'delivered';
    if (activeTab === 'cancelled') return ord.status === 'cancelled';
    return ord.status === activeTab;
  });

  const handleStatusChange = (order: Order, newStatus: OrderStatus) => {
    setStatusError('');
    const res = updateOrderStatus(order.id, newStatus);
    if (!res.success) {
      setStatusError(res.error || 'Failed to update order status');
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800';
      case 'confirmed':
        return 'bg-emerald-100 text-emerald-800';
      case 'processing':
        return 'bg-purple-100 text-purple-800';
      case 'ready_for_dispatch':
        return 'bg-amber-100 text-amber-800';
      case 'dispatched':
        return 'bg-indigo-100 text-indigo-800';
      case 'delivered':
        return 'bg-teal-100 text-teal-800';
      case 'cancelled':
        return 'bg-rose-100 text-rose-800';
      default:
        return 'bg-stone-100 text-stone-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight flex items-center gap-2">
            <ShoppingCart className="w-6 h-6 text-emerald-700" />
            {lang === 'hi' ? 'ग्राहक ऑर्डर प्रबंधन (Orders)' : 'Customer Orders & Sales Pipeline'}
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            {lang === 'hi'
              ? 'ऑर्डर स्थिति, स्टॉक आरक्षण (Reservation), अग्रिम भुगतान, बैलेंस देय व टैक्स इनवॉइस'
              : 'Complete lifecycle from booking, automated inventory reservation to fulfillment & billing'}
          </p>
        </div>

        <button
          onClick={onOpenNewOrder}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-emerald-800/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          {t.addOrder}
        </button>
      </div>

      {statusError && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
          <span>{statusError}</span>
        </div>
      )}

      {/* Status Filter Tabs */}
      <div className="flex overflow-x-auto border-b border-stone-200 text-xs sm:text-sm font-bold gap-3 sm:gap-6 pb-2">
        <button
          onClick={() => setActiveTab('all')}
          className={`whitespace-nowrap pb-1.5 transition-colors ${
            activeTab === 'all' ? 'text-emerald-800 border-b-2 border-emerald-700' : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          All Orders ({state.orders.length})
        </button>
        <button
          onClick={() => setActiveTab('pending')}
          className={`whitespace-nowrap pb-1.5 transition-colors ${
            activeTab === 'pending' ? 'text-emerald-800 border-b-2 border-emerald-700' : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          New & Confirmed ({state.orders.filter((o) => o.status === 'new' || o.status === 'confirmed').length})
        </button>
        <button
          onClick={() => setActiveTab('active')}
          className={`whitespace-nowrap pb-1.5 transition-colors ${
            activeTab === 'active' ? 'text-emerald-800 border-b-2 border-emerald-700' : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          In Prep & Dispatched ({state.orders.filter((o) => ['processing', 'ready_for_dispatch', 'dispatched'].includes(o.status)).length})
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`whitespace-nowrap pb-1.5 transition-colors ${
            activeTab === 'completed' ? 'text-emerald-800 border-b-2 border-emerald-700' : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          Delivered ({state.orders.filter((o) => o.status === 'delivered').length})
        </button>
        <button
          onClick={() => setActiveTab('cancelled')}
          className={`whitespace-nowrap pb-1.5 transition-colors ${
            activeTab === 'cancelled' ? 'text-rose-800 border-b-2 border-rose-700' : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          Cancelled ({state.orders.filter((o) => o.status === 'cancelled').length})
        </button>
      </div>

      {/* Search Input */}
      <div className="bg-white p-3.5 rounded-xl border border-stone-200">
        <div className="relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder={lang === 'hi' ? 'ऑर्डर नंबर, ग्राहक नाम, फ़ोन नंबर, किस्म द्वारा खोजें...' : 'Search by order #, customer name, phone, variety...'}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-stone-50 border border-stone-200 rounded-lg pl-9 pr-3 py-1.5 text-xs text-stone-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-stone-100 text-stone-700 font-bold border-b border-stone-200 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Order # & Date</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Variety & Qty</th>
                <th className="py-3 px-4 text-right">Total Amount</th>
                <th className="py-3 px-4 text-right">Paid / Advance</th>
                <th className="py-3 px-4 text-right">Balance Due</th>
                <th className="py-3 px-4">Status & Action</th>
                <th className="py-3 px-4 text-center">Invoicing</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-stone-400">
                    No orders found matching the filter criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => {
                  return (
                    <tr key={ord.id} className="hover:bg-stone-50 transition-colors">
                      <td className="py-3 px-4">
                        <span className="font-mono font-bold text-stone-900 block text-xs">
                          {ord.orderNumber}
                        </span>
                        <span className="text-[11px] text-stone-500 block">
                          {formatDate(ord.orderDate)}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-bold text-stone-900 block">{ord.customerName}</span>
                        <span className="text-[11px] text-stone-500 block">{ord.customerPhone}</span>
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-semibold text-emerald-900 block">
                          {ord.quantityKg.toFixed(1)} kg {ord.variety}
                        </span>
                        <span className="text-[11px] text-stone-500">
                          @{formatINR(ord.pricePerKg)}/kg
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right font-extrabold text-sm font-mono text-stone-900">
                        {formatINR(ord.totalAmount)}
                      </td>

                      <td className="py-3 px-4 text-right font-mono font-semibold text-emerald-800">
                        {formatINR(ord.amountPaid)}
                      </td>

                      <td className="py-3 px-4 text-right font-mono">
                        {ord.balanceDue > 0 ? (
                          <span className="font-bold text-rose-700 block">
                            {formatINR(ord.balanceDue)}
                          </span>
                        ) : (
                          <span className="text-emerald-700 font-bold text-[11px] block">Settled</span>
                        )}
                      </td>

                      {/* Status Selector & Trigger */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <select
                            value={ord.status}
                            onChange={(e) => handleStatusChange(ord, e.target.value as OrderStatus)}
                            className={`rounded-lg px-2 py-1 text-[11px] font-bold uppercase border-0 focus:ring-1 focus:ring-emerald-500 cursor-pointer ${getStatusColor(
                              ord.status
                            )}`}
                          >
                            <option value="new">1. New</option>
                            <option value="confirmed">2. Confirmed</option>
                            <option value="processing">3. Processing</option>
                            <option value="ready_for_dispatch">4. Ready Dispatch</option>
                            <option value="dispatched">5. Dispatched</option>
                            <option value="delivered">6. Delivered</option>
                            <option value="cancelled">7. Cancelled</option>
                          </select>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => setSelectedInvoiceOrder(ord)}
                            className="p-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                            title="View / Print Commercial Invoice"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Bill</span>
                          </button>

                          {ord.balanceDue > 0 && (
                            <button
                              onClick={() => setPayOrder(ord)}
                              className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                              title="Record Payment"
                            >
                              <Wallet className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">Pay</span>
                            </button>
                          )}

                          <button
                            onClick={() => {
                              if (confirm(`Delete order ${ord.orderNumber}? If stock was reserved, it will be restored.`)) {
                                deleteOrder(ord.id);
                              }
                            }}
                            className="p-1.5 hover:bg-rose-50 rounded-lg text-stone-400 hover:text-rose-600 transition-colors"
                            title="Delete order"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice Modal */}
      {selectedInvoiceOrder && (
        <InvoiceModal
          order={selectedInvoiceOrder}
          isOpen={true}
          onClose={() => setSelectedInvoiceOrder(null)}
        />
      )}

      {/* Payment Settlement Modal */}
      {payOrder && (
        <RecordPaymentModal
          isOpen={true}
          preselectedOrderId={payOrder.id}
          onClose={() => setPayOrder(null)}
        />
      )}
    </div>
  );
};
