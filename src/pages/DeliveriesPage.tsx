import React, { useState } from 'react';
import {
  Truck,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  User,
  Phone,
  MapPin,
  Calendar,
  X,
} from 'lucide-react';
import { useFarm } from '../context/FarmContext';
import { Delivery, DeliveryStatus } from '../types';
import { formatINR, formatKg, formatDate } from '../services/i18n';

export const DeliveriesPage: React.FC = () => {
  const { state, lang, t, metrics, updateDeliveryStatus, addDelivery } = useFarm();

  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [editingDelivery, setEditingDelivery] = useState<Delivery | null>(null);

  // Edit delivery status form state
  const [editStatus, setEditStatus] = useState<DeliveryStatus>('delivered');
  const [editDeliveredKg, setEditDeliveredKg] = useState<number>(0);
  const [editRemarks, setEditRemarks] = useState<string>('');

  // Dispatch new delivery form
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [schedOrderId, setSchedOrderId] = useState(state.orders[0]?.id || '');
  const [schedDriverName, setSchedDriverName] = useState('Sunil Kumar (Farm Staff)');
  const [schedDriverPhone, setSchedDriverPhone] = useState('+91 98222 33445');
  const [schedVehicle, setSchedVehicle] = useState('JH-01-BK-4592');
  const [schedTransportCost, setSchedTransportCost] = useState<number>(100);
  const [schedDate, setSchedDate] = useState(new Date().toISOString().split('T')[0]);

  const filteredDeliveries = state.deliveries.filter((d) => {
    const matchesSearch =
      d.deliveryCode.toLowerCase().includes(search.toLowerCase()) ||
      d.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      d.customerName.toLowerCase().includes(search.toLowerCase()) ||
      d.deliveryPersonName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === 'all' || d.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const openStatusEditor = (del: Delivery) => {
    setEditingDelivery(del);
    setEditStatus(del.status);
    setEditDeliveredKg(del.deliveredQuantityKg || del.quantityToDeliverKg);
    setEditRemarks(del.deliveryRemarks || '');
  };

  const handleSaveStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDelivery) return;

    updateDeliveryStatus(editingDelivery.id, editStatus, Number(editDeliveredKg), editRemarks);
    setEditingDelivery(null);
  };

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ord = state.orders.find((o) => o.id === schedOrderId);
    if (!ord) return;

    addDelivery({
      orderId: ord.id,
      orderNumber: ord.orderNumber,
      customerName: ord.customerName,
      customerPhone: ord.customerPhone,
      deliveryAddress: ord.customerAddress,
      variety: ord.variety,
      quantityToDeliverKg: ord.quantityKg,
      dispatchDate: schedDate,
      expectedDeliveryDate: ord.expectedDeliveryDate,
      deliveryPersonName: schedDriverName,
      deliveryPersonPhone: schedDriverPhone,
      transportCost: Number(schedTransportCost) || 0,
      vehicleNumber: schedVehicle,
      status: 'scheduled',
      deliveryRemarks: 'Scheduled dispatch',
    });

    setShowScheduleModal(false);
  };

  const getStatusBadge = (status: DeliveryStatus) => {
    switch (status) {
      case 'scheduled':
        return <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold uppercase">Scheduled</span>;
      case 'in_transit':
        return <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold uppercase animate-pulse">Out for Delivery</span>;
      case 'delivered':
        return <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase">Delivered</span>;
      case 'failed':
        return <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold uppercase">Failed / Returned</span>;
      case 'partial':
        return <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-bold uppercase">Partial Delivery</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight flex items-center gap-2">
            <Truck className="w-6 h-6 text-emerald-700" />
            {lang === 'hi' ? 'डिलीवरी एवं परिवहन प्रबंधन' : 'Delivery Logistics Management'}
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            {lang === 'hi'
              ? 'डिलीवरी शेड्यूलिंग, ड्राइवर असाइनमेंट, आंशिक डिलीवरी एवं स्थिति ट्रैकिंग'
              : 'Dispatch schedule, transport vehicle tracking, partial fulfillment and delivery notes'}
          </p>
        </div>

        <button
          onClick={() => setShowScheduleModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-emerald-800/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          {lang === 'hi' ? '+ नया डिस्पैच शेड्यूल करें' : '+ Schedule Dispatch'}
        </button>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-3.5 rounded-xl border border-stone-200 flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder={lang === 'hi' ? 'डिलीवरी कोड, ऑर्डर नं, ग्राहक, ड्राइवर खोजें...' : 'Search delivery code, order #, customer, driver...'}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-stone-50 border border-stone-200 rounded-lg pl-9 pr-3 py-1.5 text-xs text-stone-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1.5 text-xs text-stone-700 focus:outline-hidden w-full sm:w-auto"
        >
          <option value="all">All Delivery Statuses</option>
          <option value="scheduled">Scheduled</option>
          <option value="in_transit">In Transit (Out for Delivery)</option>
          <option value="delivered">Delivered</option>
          <option value="partial">Partial</option>
          <option value="failed">Failed / Returned</option>
        </select>
      </div>

      {/* Deliveries List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDeliveries.length === 0 ? (
          <div className="col-span-full bg-white p-8 rounded-2xl border border-stone-200 text-center space-y-2">
            <Truck className="w-12 h-12 text-stone-300 mx-auto" />
            <p className="text-sm font-bold text-stone-700">No deliveries found</p>
            <p className="text-xs text-stone-400">Schedule a dispatch for any confirmed order to populate this module.</p>
          </div>
        ) : (
          filteredDeliveries.map((del) => {
            const isFullyDelivered = del.deliveredQuantityKg >= del.quantityToDeliverKg && del.status === 'delivered';

            return (
              <div
                key={del.id}
                className="bg-white rounded-2xl border border-stone-200 shadow-xs hover:shadow-md transition-all p-5 flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-mono font-extrabold text-sm text-stone-900 block">
                        {del.deliveryCode}
                      </span>
                      <span className="text-[11px] text-stone-500 font-mono">
                        Linked: {del.orderNumber}
                      </span>
                    </div>
                    {getStatusBadge(del.status)}
                  </div>

                  {/* Customer & Address */}
                  <div className="mt-3 bg-stone-50 p-3 rounded-xl border border-stone-100 text-xs space-y-1">
                    <p className="font-bold text-stone-900">{del.customerName}</p>
                    <p className="text-stone-600 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-stone-400" />
                      {del.customerPhone}
                    </p>
                    <p className="text-stone-600 flex items-start gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-stone-400 flex-shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{del.deliveryAddress}</span>
                    </p>
                  </div>

                  {/* Quantities & Driver */}
                  <div className="mt-3 space-y-1 text-xs text-stone-600">
                    <div className="flex justify-between">
                      <span>Item / Variety:</span>
                      <strong className="text-stone-900">{del.variety} Mushroom</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Target Quantity:</span>
                      <strong className="text-stone-900 font-mono">{del.quantityToDeliverKg.toFixed(1)} kg</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivered So Far:</span>
                      <strong className={isFullyDelivered ? 'text-emerald-700 font-mono' : 'text-amber-700 font-mono'}>
                        {del.deliveredQuantityKg.toFixed(1)} kg
                      </strong>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-stone-100">
                      <span>Driver / Vehicle:</span>
                      <span className="text-stone-800 font-medium">
                        {del.deliveryPersonName} ({del.vehicleNumber || 'Bike/Auto'})
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Transport Cost:</span>
                      <span className="font-mono">{formatINR(del.transportCost)}</span>
                    </div>
                  </div>

                  {del.deliveryRemarks && (
                    <p className="mt-2 text-[11px] text-stone-500 bg-amber-50/60 p-2 rounded-lg border border-amber-100 italic">
                      "{del.deliveryRemarks}"
                    </p>
                  )}
                </div>

                <div className="pt-2 border-t border-stone-100">
                  <button
                    onClick={() => openStatusEditor(del)}
                    className="w-full py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 rounded-lg text-xs font-bold transition-colors text-center"
                  >
                    Update Delivery Status / Handover
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Edit Status Modal */}
      {editingDelivery && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-stone-200 overflow-hidden my-6">
            <div className="px-5 py-4 bg-emerald-800 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base">Update {editingDelivery.deliveryCode}</h3>
                <p className="text-xs text-emerald-200">{editingDelivery.customerName}</p>
              </div>
              <button
                onClick={() => setEditingDelivery(null)}
                className="text-emerald-200 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStatus} className="p-5 space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-stone-700 font-semibold mb-1">
                  Delivery Status *
                </label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as DeliveryStatus)}
                  className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-800 focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="scheduled">Scheduled</option>
                  <option value="in_transit">In Transit / Out for Delivery</option>
                  <option value="delivered">Delivered (Completed)</option>
                  <option value="partial">Partial Delivery Handover</option>
                  <option value="failed">Delivery Failed / Returned</option>
                </select>
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">
                  Delivered Quantity (kg) *
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max={editingDelivery.quantityToDeliverKg}
                  value={editDeliveredKg}
                  onChange={(e) => setEditDeliveredKg(parseFloat(e.target.value) || 0)}
                  className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-800 font-bold focus:ring-2 focus:ring-emerald-500"
                  required
                />
                <span className="text-[11px] text-stone-500 mt-1 block">
                  Total required by order: {editingDelivery.quantityToDeliverKg} kg
                </span>
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">
                  Delivery Remarks / Handover Notes
                </label>
                <input
                  type="text"
                  placeholder="e.g. Delivered to Chef, quality checked"
                  value={editRemarks}
                  onChange={(e) => setEditRemarks(e.target.value)}
                  className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-800 focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingDelivery(null)}
                  className="px-4 py-2 bg-stone-100 text-stone-700 rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 text-white rounded-xl font-bold hover:bg-emerald-800"
                >
                  Save Handover
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Schedule Dispatch Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-stone-200 overflow-hidden my-6">
            <div className="px-5 py-4 bg-emerald-800 text-white flex items-center justify-between">
              <h3 className="font-bold text-base">Schedule New Order Dispatch</h3>
              <button
                onClick={() => setShowScheduleModal(false)}
                className="text-emerald-200 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleScheduleSubmit} className="p-5 space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-stone-700 font-semibold mb-1">
                  Select Confirmed Order *
                </label>
                <select
                  value={schedOrderId}
                  onChange={(e) => setSchedOrderId(e.target.value)}
                  className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-800 focus:ring-2 focus:ring-emerald-500"
                  required
                >
                  {state.orders.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.orderNumber} - {o.customerName} ({o.quantityKg} kg {o.variety}) [{o.status}]
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">
                    Dispatch Date *
                  </label>
                  <input
                    type="date"
                    value={schedDate}
                    onChange={(e) => setSchedDate(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-800"
                    required
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-semibold mb-1">
                    Transport Cost (₹)
                  </label>
                  <input
                    type="number"
                    value={schedTransportCost}
                    onChange={(e) => setSchedTransportCost(parseFloat(e.target.value) || 0)}
                    className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">
                    Driver / Person Name
                  </label>
                  <input
                    type="text"
                    value={schedDriverName}
                    onChange={(e) => setSchedDriverName(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-800"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-semibold mb-1">
                    Driver Phone
                  </label>
                  <input
                    type="tel"
                    value={schedDriverPhone}
                    onChange={(e) => setSchedDriverPhone(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">
                  Vehicle Registration #
                </label>
                <input
                  type="text"
                  placeholder="e.g. JH-01-BK-4592"
                  value={schedVehicle}
                  onChange={(e) => setSchedVehicle(e.target.value)}
                  className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-800"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowScheduleModal(false)}
                  className="px-4 py-2 bg-stone-100 text-stone-700 rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 text-white rounded-xl font-bold hover:bg-emerald-800"
                >
                  Confirm Dispatch Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
