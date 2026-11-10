import React, { useState } from 'react';
import { X, Sprout, AlertCircle } from 'lucide-react';
import { useFarm } from '../../context/FarmContext';
import { MushroomVariety } from '../../types';

interface LogHarvestModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedBatchId?: string;
}

export const LogHarvestModal: React.FC<LogHarvestModalProps> = ({
  isOpen,
  onClose,
  preselectedBatchId,
}) => {
  const { state, t, lang, addHarvest, currentUser } = useFarm();

  const initialBatch =
    state.batches.find((b) => b.id === preselectedBatchId) ||
    state.batches.find((b) => b.status === 'harvesting' || b.status === 'pinheading') ||
    state.batches[0];

  const [batchId, setBatchId] = useState<string>(initialBatch?.id || '');
  const [harvestDate, setHarvestDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [flushNumber, setFlushNumber] = useState<number>(1);
  const [gradeAKg, setGradeAKg] = useState<number>(20);
  const [gradeBKg, setGradeBKg] = useState<number>(5);
  const [gradeCKg, setGradeCKg] = useState<number>(0);
  const [spoiledKg, setSpoiledKg] = useState<number>(0);
  const [harvesterName, setHarvesterName] = useState<string>(currentUser?.name || 'Mohit Kumar Mahato');
  const [notes, setNotes] = useState<string>('');
  const [error, setError] = useState<string>('');

  if (!isOpen) return null;

  const currentBatch = state.batches.find((b) => b.id === batchId);
  const variety: MushroomVariety = currentBatch ? currentBatch.variety : 'Oyster';

  const netFreshQtyKg = (Number(gradeAKg) || 0) + (Number(gradeBKg) || 0) + (Number(gradeCKg) || 0);
  const grossQtyKg = netFreshQtyKg + (Number(spoiledKg) || 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!batchId) {
      setError('Please select a production batch.');
      return;
    }
    if (netFreshQtyKg <= 0 && spoiledKg <= 0) {
      setError('Total harvested quantity must be greater than 0 kg.');
      return;
    }

    addHarvest({
      batchId,
      batchCode: currentBatch?.batchCode || 'BATCH-UNKNOWN',
      harvestDate,
      variety,
      flushNumber: Number(flushNumber),
      grossQtyKg,
      gradeA_QtyKg: Number(gradeAKg) || 0,
      gradeB_QtyKg: Number(gradeBKg) || 0,
      gradeC_QtyKg: Number(gradeCKg) || 0,
      spoiledQtyKg: Number(spoiledKg) || 0,
      netFreshQtyKg,
      harvestedBy: harvesterName,
      notes,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full border border-stone-200 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-150">
        <div className="px-5 py-4 bg-emerald-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sprout className="w-5 h-5 text-emerald-200" />
            <h2 className="text-base sm:text-lg font-bold">
              {lang === 'hi' ? 'ताजा मशरूम तुड़ाई दर्ज करें' : 'Record Fresh Mushroom Harvest'}
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

          {/* Batch Selector */}
          <div>
            <label className="block text-stone-700 font-semibold mb-1">
              {lang === 'hi' ? 'उत्पादन बैच चुनें' : 'Select Production Batch'} *
            </label>
            <select
              value={batchId}
              onChange={(e) => setBatchId(e.target.value)}
              className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-800 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              required
            >
              {state.batches.length === 0 ? (
                <option value="">No production batches found. Create a batch first.</option>
              ) : (
                state.batches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.batchCode} — {b.variety} ({b.roomNumber}) [{b.status.toUpperCase()}]
                  </option>
                ))
              )}
            </select>
            {currentBatch && (
              <p className="text-[11px] text-stone-500 mt-1">
                Started: {currentBatch.startDate} | Bags: {currentBatch.bagCount} | Previous Harvested: {currentBatch.totalHarvestedKg.toFixed(1)} kg
              </p>
            )}
          </div>

          {/* Date & Flush */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-stone-700 font-semibold mb-1">
                {lang === 'hi' ? 'तुड़ाई दिनांक' : 'Harvest Date'} *
              </label>
              <input
                type="date"
                value={harvestDate}
                onChange={(e) => setHarvestDate(e.target.value)}
                className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-800 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                required
              />
            </div>

            <div>
              <label className="block text-stone-700 font-semibold mb-1">
                {lang === 'hi' ? 'फ्लश संख्या (Flush #)' : 'Harvest Flush Number'}
              </label>
              <select
                value={flushNumber}
                onChange={(e) => setFlushNumber(parseInt(e.target.value, 10))}
                className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-800 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              >
                <option value={1}>Flush 1 (Primary / Highest Yield)</option>
                <option value={2}>Flush 2 (Secondary Flush)</option>
                <option value={3}>Flush 3 (Late Flush)</option>
                <option value={4}>Flush 4 / Residual Flush</option>
              </select>
            </div>
          </div>

          {/* Quality Grades & Spoiled Breakdown */}
          <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200 space-y-3">
            <span className="font-bold text-stone-800 block">
              {lang === 'hi' ? 'गुणवत्ता ग्रेड अनुसार वजन (किग्रा)' : 'Quality Grade Breakdown (kg)'}
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div>
                <label className="block text-[11px] font-semibold text-emerald-800 mb-0.5">
                  Grade A (Premium)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={gradeAKg}
                  onChange={(e) => setGradeAKg(parseFloat(e.target.value) || 0)}
                  className="w-full bg-white border border-stone-300 rounded-lg px-2.5 py-1.5 text-stone-900 font-bold focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-700 mb-0.5">
                  Grade B (Standard)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={gradeBKg}
                  onChange={(e) => setGradeBKg(parseFloat(e.target.value) || 0)}
                  className="w-full bg-white border border-stone-300 rounded-lg px-2.5 py-1.5 text-stone-900 focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-700 mb-0.5">
                  Grade C (Process)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={gradeCKg}
                  onChange={(e) => setGradeCKg(parseFloat(e.target.value) || 0)}
                  className="w-full bg-white border border-stone-300 rounded-lg px-2.5 py-1.5 text-stone-900 focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-rose-700 mb-0.5">
                  Spoiled / Damaged
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={spoiledKg}
                  onChange={(e) => setSpoiledKg(parseFloat(e.target.value) || 0)}
                  className="w-full bg-white border border-rose-200 rounded-lg px-2.5 py-1.5 text-rose-900 focus:ring-2 focus:ring-rose-500"
                />
              </div>
            </div>

            <div className="p-2.5 bg-emerald-100/70 rounded-lg flex items-center justify-between text-xs text-emerald-950 font-bold">
              <span>Net Fresh Yield to Inventory:</span>
              <span className="text-sm font-extrabold text-emerald-900">{netFreshQtyKg.toFixed(2)} kg</span>
            </div>
          </div>

          {/* Harvester & Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-stone-700 font-semibold mb-1">
                {lang === 'hi' ? 'तुड़ाई कर्ता' : 'Harvested By'}
              </label>
              <input
                type="text"
                value={harvesterName}
                onChange={(e) => setHarvesterName(e.target.value)}
                className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-800 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-stone-700 font-semibold mb-1">
                {lang === 'hi' ? 'टिप्पणी' : 'Notes / Remarks'}
              </label>
              <input
                type="text"
                placeholder="e.g. Clean white caps, harvested 7 AM"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-800 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
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
              {lang === 'hi' ? 'स्टॉक में जोड़ें' : 'Add to Fresh Stock'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
