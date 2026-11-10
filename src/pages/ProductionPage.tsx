import React, { useState } from 'react';
import {
  Sprout,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Trash2,
  Eye,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { useFarm } from '../context/FarmContext';
import { ProductionBatch, BatchStatus, MushroomVariety } from '../types';
import { formatINR, formatKg, formatDate } from '../services/i18n';

interface ProductionPageProps {
  onOpenNewBatch: () => void;
  onOpenLogHarvestForBatch: (batchId: string) => void;
}

export const ProductionPage: React.FC<ProductionPageProps> = ({
  onOpenNewBatch,
  onOpenLogHarvestForBatch,
}) => {
  const { state, lang, t, updateBatch, deleteBatch } = useFarm();

  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterVariety, setFilterVariety] = useState<string>('all');
  const [selectedBatch, setSelectedBatch] = useState<ProductionBatch | null>(null);

  const filteredBatches = state.batches.filter((b) => {
    const matchesSearch =
      b.batchCode.toLowerCase().includes(search.toLowerCase()) ||
      b.variety.toLowerCase().includes(search.toLowerCase()) ||
      b.roomNumber.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === 'all' || b.status === filterStatus;
    const matchesVariety = filterVariety === 'all' || b.variety === filterVariety;
    return matchesSearch && matchesStatus && matchesVariety;
  });

  const getStatusBadge = (status: BatchStatus) => {
    switch (status) {
      case 'inoculation':
        return <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold uppercase">1. Inoculation</span>;
      case 'spawn_run':
        return <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-bold uppercase">2. Spawn Run</span>;
      case 'pinheading':
        return <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold uppercase">3. Pinheading</span>;
      case 'harvesting':
        return <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase animate-pulse">4. Harvesting Active</span>;
      case 'completed':
        return <span className="px-2 py-0.5 rounded-full bg-stone-200 text-stone-800 text-[10px] font-bold uppercase">Completed</span>;
      case 'cancelled':
        return <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold uppercase">Cancelled</span>;
      default:
        return null;
    }
  };

  const handleStatusChange = (batch: ProductionBatch, newStatus: BatchStatus) => {
    updateBatch({ ...batch, status: newStatus });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight flex items-center gap-2">
            <Sprout className="w-6 h-6 text-emerald-700" />
            {lang === 'hi' ? 'मशरूम उत्पादन बैच प्रबंधन' : 'Mushroom Production Management'}
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            {lang === 'hi'
              ? 'बैच लागत, स्पॉन, पुआल, लेबर, कक्ष तापमान व तुड़ाई लक्ष्य ट्रैक करें'
              : 'Track bag inoculation, colonization, grow rooms, total batch costs and harvest yields'}
          </p>
        </div>

        <button
          onClick={onOpenNewBatch}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-emerald-800/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          {t.newBatch}
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-3.5 rounded-xl border border-stone-200 flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder={lang === 'hi' ? 'बैच कोड, कक्ष, किस्म द्वारा खोजें...' : 'Search by batch code, room, variety...'}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-stone-50 border border-stone-200 rounded-lg pl-9 pr-3 py-1.5 text-xs text-stone-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1.5 text-xs text-stone-700 focus:outline-hidden"
          >
            <option value="all">All Statuses ({state.batches.length})</option>
            <option value="inoculation">Inoculation</option>
            <option value="spawn_run">Spawn Run</option>
            <option value="pinheading">Pinheading</option>
            <option value="harvesting">Harvesting</option>
            <option value="completed">Completed</option>
          </select>

          <select
            value={filterVariety}
            onChange={(e) => setFilterVariety(e.target.value)}
            className="bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1.5 text-xs text-stone-700 focus:outline-hidden"
          >
            <option value="all">All Varieties</option>
            <option value="Oyster">Oyster</option>
            <option value="Button">Button</option>
            <option value="Milky">Milky</option>
            <option value="Shiitake">Shiitake</option>
            <option value="Paddy Straw">Paddy Straw</option>
          </select>
        </div>
      </div>

      {/* Batches Grid */}
      {filteredBatches.length === 0 ? (
        <div className="bg-white p-8 rounded-2xl border border-stone-200 text-center space-y-2">
          <Sprout className="w-12 h-12 text-stone-300 mx-auto" />
          <p className="text-sm font-bold text-stone-700">{t.noRecordsFound}</p>
          <p className="text-xs text-stone-400">Click '+ New Production Batch' above to register a new growing cycle.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBatches.map((batch) => {
            const harvestRecords = state.harvests.filter((h) => h.batchId === batch.id);
            const avgYieldPerBag = batch.bagCount > 0 ? (batch.totalHarvestedKg / batch.bagCount) : 0;
            const costPerKgYield = batch.totalHarvestedKg > 0 ? (batch.totalCost / batch.totalHarvestedKg) : 0;

            return (
              <div
                key={batch.id}
                className="bg-white rounded-2xl border border-stone-200 shadow-xs hover:shadow-md transition-all p-5 flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-mono font-extrabold text-sm text-stone-900 block">
                        {batch.batchCode}
                      </span>
                      <span className="text-xs font-semibold text-emerald-800">
                        {batch.variety} Mushroom
                      </span>
                    </div>
                    {getStatusBadge(batch.status)}
                  </div>

                  <div className="mt-3.5 space-y-1.5 text-xs text-stone-600 bg-stone-50 p-3 rounded-xl border border-stone-100">
                    <div className="flex justify-between">
                      <span>Bags / Growing Units:</span>
                      <strong className="text-stone-900">{batch.bagCount} units</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Location / Chamber:</span>
                      <span className="font-medium text-stone-800">{batch.roomNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Inoculation Date:</span>
                      <span>{formatDate(batch.startDate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Target Harvest Date:</span>
                      <strong className="text-amber-800">{formatDate(batch.targetHarvestDate)}</strong>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-stone-200">
                      <span>Total Production Cost:</span>
                      <strong className="text-stone-900 font-mono">{formatINR(batch.totalCost)}</strong>
                    </div>
                  </div>

                  {/* Harvest Yield Progress */}
                  <div className="mt-3 space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-stone-700">Harvest Yield:</span>
                      <span className="text-emerald-800 font-bold">{formatKg(batch.totalHarvestedKg)}</span>
                    </div>
                    <div className="flex justify-between text-[11px] text-stone-500">
                      <span>Avg per bag: {avgYieldPerBag.toFixed(2)} kg</span>
                      <span>{harvestRecords.length} flushes logged</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onOpenLogHarvestForBatch(batch.id)}
                    className="flex-1 py-1.5 px-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors text-center"
                  >
                    + Log Harvest
                  </button>
                  <button
                    onClick={() => setSelectedBatch(batch)}
                    className="p-1.5 bg-stone-100 hover:bg-stone-200 rounded-lg text-stone-700 transition-colors"
                    title="View batch cost breakdown & details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Are you sure you want to delete batch ${batch.batchCode}?`)) {
                        deleteBatch(batch.id);
                      }
                    }}
                    className="p-1.5 hover:bg-rose-50 rounded-lg text-stone-400 hover:text-rose-600 transition-colors"
                    title="Delete batch"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Batch Details Modal */}
      {selectedBatch && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full border border-stone-200 overflow-hidden my-6">
            <div className="px-5 py-4 bg-emerald-900 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base">{selectedBatch.batchCode} Details</h3>
                <p className="text-xs text-emerald-200">{selectedBatch.variety} Mushroom • {selectedBatch.roomNumber}</p>
              </div>
              <button
                onClick={() => setSelectedBatch(null)}
                className="text-emerald-200 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              {/* Cost Breakdown Table */}
              <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200 space-y-2">
                <span className="font-bold text-stone-800 block uppercase tracking-wider text-[11px]">
                  Batch Production Cost Breakdown
                </span>
                <div className="grid grid-cols-2 gap-2 text-stone-700">
                  <div>Spawn ({selectedBatch.spawnQtyKg} kg): <strong className="font-mono">{formatINR(selectedBatch.spawnCost)}</strong></div>
                  <div>Substrate ({selectedBatch.substrateQtyKg} kg): <strong className="font-mono">{formatINR(selectedBatch.substrateCost)}</strong></div>
                  <div>Labour Wages: <strong className="font-mono">{formatINR(selectedBatch.labourCost)}</strong></div>
                  <div>Electricity & Water: <strong className="font-mono">{formatINR(selectedBatch.electricityWaterCost)}</strong></div>
                  <div>Packaging & Bags: <strong className="font-mono">{formatINR(selectedBatch.packagingCost)}</strong></div>
                  <div>Other Overhead: <strong className="font-mono">{formatINR(selectedBatch.otherCosts)}</strong></div>
                </div>
                <div className="pt-2 border-t border-stone-200 flex justify-between font-bold text-stone-900">
                  <span>Total Batch Cost:</span>
                  <span className="font-mono text-sm text-emerald-900">{formatINR(selectedBatch.totalCost)}</span>
                </div>
              </div>

              {/* Status Update Quick Buttons */}
              <div className="space-y-1.5">
                <span className="font-bold text-stone-800 block text-xs">Update Growing Stage:</span>
                <div className="flex flex-wrap gap-1.5">
                  {(['inoculation', 'spawn_run', 'pinheading', 'harvesting', 'completed', 'cancelled'] as BatchStatus[]).map((st) => (
                    <button
                      key={st}
                      onClick={() => handleStatusChange(selectedBatch, st)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold capitalize transition-colors ${
                        selectedBatch.status === st
                          ? 'bg-emerald-700 text-white'
                          : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                      }`}
                    >
                      {st.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {selectedBatch.notes && (
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900">
                  <span className="font-bold block mb-0.5">Batch Notes:</span>
                  <p>{selectedBatch.notes}</p>
                </div>
              )}
            </div>

            <div className="p-3 bg-stone-100 border-t flex justify-end">
              <button
                onClick={() => setSelectedBatch(null)}
                className="px-4 py-1.5 bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold rounded-lg text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
