import React, { useState } from 'react';
import {
  Boxes,
  Sliders,
  AlertTriangle,
  History,
  Plus,
  ArrowDownLeft,
  ArrowUpRight,
  ShieldAlert,
} from 'lucide-react';
import { useFarm } from '../context/FarmContext';
import { MushroomVariety } from '../types';
import { formatKg, formatDate } from '../services/i18n';
import { StockAdjustModal } from '../components/modals/StockAdjustModal';

export const InventoryPage: React.FC = () => {
  const { state, lang, t, metrics, addRawMaterial } = useFarm();

  const [selectedAdjustVariety, setSelectedAdjustVariety] = useState<MushroomVariety | null>(null);
  const [activeTab, setActiveTab] = useState<'fresh' | 'raw' | 'movements'>('fresh');

  // New raw material inline form state
  const [showAddRaw, setShowAddRaw] = useState(false);
  const [rawName, setRawName] = useState('');
  const [rawCategory, setRawCategory] = useState<'spawn' | 'substrate' | 'packaging' | 'chemical' | 'other'>('spawn');
  const [rawUnit, setRawUnit] = useState<'kg' | 'pieces' | 'litres' | 'bags'>('kg');
  const [rawQty, setRawQty] = useState<number>(20);
  const [rawMinThreshold, setRawMinThreshold] = useState<number>(5);
  const [rawCost, setRawCost] = useState<number>(150);
  const [rawSupplier, setRawSupplier] = useState('');

  const handleAddRaw = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rawName.trim()) return;

    addRawMaterial({
      name: rawName.trim(),
      category: rawCategory,
      unit: rawUnit,
      currentQty: Number(rawQty) || 0,
      minThreshold: Number(rawMinThreshold) || 0,
      costPerUnit: Number(rawCost) || 0,
      supplierName: rawSupplier.trim(),
      lastRestockedDate: new Date().toISOString().split('T')[0],
    });

    setRawName('');
    setRawSupplier('');
    setShowAddRaw(false);
  };

  const getMovementIcon = (type: string) => {
    switch (type) {
      case 'harvest_in':
        return <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-600" />;
      case 'sale_dispatch':
        return <ArrowUpRight className="w-3.5 h-3.5 text-amber-600" />;
      case 'order_reservation':
        return <Boxes className="w-3.5 h-3.5 text-blue-600" />;
      case 'reservation_release':
        return <Boxes className="w-3.5 h-3.5 text-purple-600" />;
      case 'spoilage_out':
        return <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />;
      default:
        return <Sliders className="w-3.5 h-3.5 text-stone-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight flex items-center gap-2">
            <Boxes className="w-6 h-6 text-emerald-700" />
            {lang === 'hi' ? 'स्टॉक एवं इन्वेंटरी प्रबंधन' : 'Stock & Inventory Management'}
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            {lang === 'hi'
              ? 'ताजा मशरूम स्टॉक, कच्चा माल (स्पॉन, पुआल, बैग) एवं FIFO ऑडिट हिस्ट्री'
              : 'Live fresh mushroom varieties, farming supplies, FIFO movements and inventory audit log'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedAdjustVariety('Oyster')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-stone-800 hover:bg-stone-900 text-white rounded-xl text-xs sm:text-sm font-semibold transition-colors"
          >
            <Sliders className="w-3.5 h-3.5" />
            {lang === 'hi' ? 'स्टॉक समायोजन' : 'Adjust Stock'}
          </button>
        </div>
      </div>

      {/* Low Stock Warning Banner if any */}
      {metrics.lowStockItems.length > 0 && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0" />
          <div className="text-xs">
            <span className="font-bold block">
              Low Stock Alert ({metrics.lowStockItems.length} varieties below safety threshold):
            </span>
            <span>
              {metrics.lowStockItems.map((s) => `${s.variety}: ${s.availableKg.toFixed(1)} kg available (Min ${s.lowStockThresholdKg} kg)`).join(' • ')}
            </span>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-stone-200 text-xs sm:text-sm font-bold gap-6">
        <button
          onClick={() => setActiveTab('fresh')}
          className={`pb-2.5 transition-colors relative ${
            activeTab === 'fresh' ? 'text-emerald-800 border-b-2 border-emerald-700' : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          {lang === 'hi' ? '1. ताजा मशरूम स्टॉक' : '1. Fresh Mushrooms Stock'}
        </button>
        <button
          onClick={() => setActiveTab('raw')}
          className={`pb-2.5 transition-colors relative ${
            activeTab === 'raw' ? 'text-emerald-800 border-b-2 border-emerald-700' : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          {lang === 'hi' ? '2. कच्चा माल व सामग्री' : '2. Raw Materials & Supplies'} ({state.rawMaterials.length})
        </button>
        <button
          onClick={() => setActiveTab('movements')}
          className={`pb-2.5 transition-colors relative ${
            activeTab === 'movements' ? 'text-emerald-800 border-b-2 border-emerald-700' : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          {lang === 'hi' ? '3. स्टॉक मूवमेंट ऑडिट लॉग (FIFO)' : '3. Stock Movement Audit (FIFO)'} ({state.movements.length})
        </button>
      </div>

      {/* Tab 1: Fresh Mushroom Stock Cards */}
      {activeTab === 'fresh' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {state.stocks.map((stock) => {
            const isLow = stock.availableKg <= stock.lowStockThresholdKg;

            return (
              <div
                key={stock.variety}
                className="bg-white rounded-2xl border border-stone-200 shadow-xs hover:shadow-md transition-all p-5 flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-extrabold text-base text-stone-900">{stock.variety} Mushroom</h3>
                      <p className="text-[11px] text-stone-500">Threshold: {stock.lowStockThresholdKg} kg</p>
                    </div>
                    {isLow ? (
                      <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold uppercase flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3 text-rose-600" />
                        Low Stock
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase">
                        Optimal
                      </span>
                    )}
                  </div>

                  {/* Big Available Number */}
                  <div className="mt-4 p-3 bg-stone-50 rounded-xl border border-stone-100 text-center">
                    <span className="text-[11px] text-stone-500 font-medium block uppercase tracking-wider">
                      Available Ready-to-Sell
                    </span>
                    <span className={`text-2xl sm:text-3xl font-black font-mono block ${isLow ? 'text-rose-700' : 'text-emerald-950'}`}>
                      {stock.availableKg.toFixed(1)} kg
                    </span>
                  </div>

                  {/* Breakdown Table */}
                  <div className="mt-3 space-y-1.5 text-xs text-stone-600">
                    <div className="flex justify-between py-0.5">
                      <span>Total Harvest In:</span>
                      <strong className="text-stone-900 font-mono">{stock.totalHarvestedKg.toFixed(1)} kg</strong>
                    </div>
                    <div className="flex justify-between py-0.5">
                      <span>Reserved for Active Orders:</span>
                      <strong className="text-amber-700 font-mono">{stock.reservedKg.toFixed(1)} kg</strong>
                    </div>
                    <div className="flex justify-between py-0.5">
                      <span>Delivered / Dispatched:</span>
                      <strong className="text-stone-800 font-mono">{stock.dispatchedKg.toFixed(1)} kg</strong>
                    </div>
                    <div className="flex justify-between py-0.5">
                      <span>Damaged / Spoiled:</span>
                      <strong className="text-rose-600 font-mono">{stock.spoiledKg.toFixed(1)} kg</strong>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-stone-100">
                  <button
                    onClick={() => setSelectedAdjustVariety(stock.variety)}
                    className="w-full py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-xs font-bold transition-colors"
                  >
                    Adjust / Audit Weight
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 2: Raw Materials Inventory */}
      {activeTab === 'raw' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={() => setShowAddRaw(!showAddRaw)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              {showAddRaw ? 'Cancel' : '+ Add Raw Material Item'}
            </button>
          </div>

          {showAddRaw && (
            <form onSubmit={handleAddRaw} className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-3 text-xs">
              <span className="font-bold text-stone-800 block text-sm">Add New Raw Material / Farming Supply</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <input
                  type="text"
                  placeholder="Item Name (e.g. Grain Spawn, PP Bags)"
                  value={rawName}
                  onChange={(e) => setRawName(e.target.value)}
                  className="bg-white border rounded-lg px-3 py-2 text-stone-800"
                  required
                />
                <select
                  value={rawCategory}
                  onChange={(e) => setRawCategory(e.target.value as any)}
                  className="bg-white border rounded-lg px-3 py-2 text-stone-800"
                >
                  <option value="spawn">Spawn / Seed</option>
                  <option value="substrate">Substrate / Straw</option>
                  <option value="packaging">Bags & Packaging</option>
                  <option value="chemical">Disinfectant & Chemicals</option>
                  <option value="other">Other Supply</option>
                </select>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Current Qty"
                    value={rawQty}
                    onChange={(e) => setRawQty(parseFloat(e.target.value) || 0)}
                    className="w-1/2 bg-white border rounded-lg px-3 py-2 text-stone-800"
                    required
                  />
                  <select
                    value={rawUnit}
                    onChange={(e) => setRawUnit(e.target.value as any)}
                    className="w-1/2 bg-white border rounded-lg px-2 py-2 text-stone-800"
                  >
                    <option value="kg">kg</option>
                    <option value="bags">bags</option>
                    <option value="pieces">pieces</option>
                    <option value="litres">litres</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <input
                  type="number"
                  placeholder="Min Alert Threshold"
                  value={rawMinThreshold}
                  onChange={(e) => setRawMinThreshold(parseFloat(e.target.value) || 0)}
                  className="bg-white border rounded-lg px-3 py-2 text-stone-800"
                />
                <input
                  type="number"
                  placeholder="Unit Cost (₹)"
                  value={rawCost}
                  onChange={(e) => setRawCost(parseFloat(e.target.value) || 0)}
                  className="bg-white border rounded-lg px-3 py-2 text-stone-800"
                />
                <input
                  type="text"
                  placeholder="Supplier Name"
                  value={rawSupplier}
                  onChange={(e) => setRawSupplier(e.target.value)}
                  className="bg-white border rounded-lg px-3 py-2 text-stone-800"
                />
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-700 text-white font-bold rounded-lg hover:bg-emerald-800"
                >
                  Save Material Item
                </button>
              </div>
            </form>
          )}

          <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead className="bg-stone-100 text-stone-700 font-bold border-b text-[11px] uppercase">
                <tr>
                  <th className="py-3 px-4">Material Name</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4 text-right">In Stock</th>
                  <th className="py-3 px-4 text-right">Min Threshold</th>
                  <th className="py-3 px-4 text-right">Cost / Unit</th>
                  <th className="py-3 px-4">Supplier</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {state.rawMaterials.map((r) => {
                  const isLow = r.currentQty <= r.minThreshold;
                  return (
                    <tr key={r.id} className="hover:bg-stone-50">
                      <td className="py-3 px-4 font-bold text-stone-900">{r.name}</td>
                      <td className="py-3 px-4 uppercase text-[10px] text-stone-500 font-semibold">{r.category}</td>
                      <td className="py-3 px-4 text-right font-extrabold text-sm font-mono text-stone-900">
                        {r.currentQty} {r.unit}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-stone-500">
                        {r.minThreshold} {r.unit}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-medium">₹{r.costPerUnit}</td>
                      <td className="py-3 px-4 text-stone-600">{r.supplierName || '-'}</td>
                      <td className="py-3 px-4">
                        {isLow ? (
                          <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold text-[10px]">
                            Restock Needed
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                            In Stock
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: FIFO Stock Movements Audit Log */}
      {activeTab === 'movements' && (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-stone-100 flex items-center justify-between">
            <span className="font-bold text-sm text-stone-800 flex items-center gap-2">
              <History className="w-4 h-4 text-emerald-700" />
              Complete FIFO Stock Audit Trail
            </span>
            <span className="text-xs text-stone-500">{state.movements.length} total stock events</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-stone-100 text-stone-700 font-bold border-b text-[11px] uppercase">
                <tr>
                  <th className="py-2.5 px-4">Date</th>
                  <th className="py-2.5 px-4">Movement Type</th>
                  <th className="py-2.5 px-4">Item / Variety</th>
                  <th className="py-2.5 px-4 text-right">Quantity (kg)</th>
                  <th className="py-2.5 px-4">Reason / Linked Order</th>
                  <th className="py-2.5 px-4">Recorded By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {state.movements.map((mov) => (
                  <tr key={mov.id} className="hover:bg-stone-50">
                    <td className="py-2.5 px-4 text-stone-600">{formatDate(mov.date)}</td>
                    <td className="py-2.5 px-4">
                      <span className="inline-flex items-center gap-1.5 font-semibold capitalize text-stone-800">
                        {getMovementIcon(mov.movementType)}
                        {mov.movementType.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 font-bold text-emerald-900">{mov.varietyOrItem}</td>
                    <td className="py-2.5 px-4 text-right font-mono font-bold text-stone-900">
                      {mov.quantityKg.toFixed(2)} kg
                    </td>
                    <td className="py-2.5 px-4 text-stone-600 max-w-xs truncate">{mov.reason}</td>
                    <td className="py-2.5 px-4 text-stone-500">{mov.recordedBy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Adjust Modal */}
      {selectedAdjustVariety && (
        <StockAdjustModal
          variety={selectedAdjustVariety}
          isOpen={true}
          onClose={() => setSelectedAdjustVariety(null)}
        />
      )}
    </div>
  );
};
