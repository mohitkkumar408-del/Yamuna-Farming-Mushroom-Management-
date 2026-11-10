import React, { useState } from 'react';
import { X, Sprout, AlertCircle, Calculator } from 'lucide-react';
import { useFarm } from '../../context/FarmContext';
import { MushroomVariety, BatchStatus } from '../../types';
import { formatINR } from '../../services/i18n';

interface NewBatchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewBatchModal: React.FC<NewBatchModalProps> = ({ isOpen, onClose }) => {
  const { state, t, lang, addBatch } = useFarm();

  const nextNum = state.batches.length + 1;
  const todayStr = new Date().toISOString().split('T')[0];

  const [batchCode, setBatchCode] = useState(`BATCH-MUSH-${String(nextNum).padStart(3, '0')}`);
  const [startDate, setStartDate] = useState(todayStr);
  const [variety, setVariety] = useState<MushroomVariety>('Oyster');
  const [bagCount, setBagCount] = useState<number>(150);
  const [roomNumber, setRoomNumber] = useState('Grow Room 1');
  const [substrateType, setSubstrateType] = useState('Wheat Straw (Pasteurized)');
  const [substrateQtyKg, setSubstrateQtyKg] = useState<number>(450);
  const [substrateCost, setSubstrateCost] = useState<number>(3600);
  const [spawnQtyKg, setSpawnQtyKg] = useState<number>(12);
  const [spawnCost, setSpawnCost] = useState<number>(1800);
  const [labourCost, setLabourCost] = useState<number>(2500);
  const [electricityWaterCost, setElectricityWaterCost] = useState<number>(800);
  const [packagingCost, setPackagingCost] = useState<number>(600);
  const [otherCosts, setOtherCosts] = useState<number>(200);

  // Default target date is 20 days for Oyster/Milky, 25 for Button
  const defaultTargetDays = variety === 'Button' ? 25 : 20;
  const initialTargetDate = new Date();
  initialTargetDate.setDate(initialTargetDate.getDate() + defaultTargetDays);
  const [targetHarvestDate, setTargetHarvestDate] = useState(
    initialTargetDate.toISOString().split('T')[0]
  );
  const [status, setStatus] = useState<BatchStatus>('inoculation');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const totalCost =
    (Number(spawnCost) || 0) +
    (Number(substrateCost) || 0) +
    (Number(labourCost) || 0) +
    (Number(electricityWaterCost) || 0) +
    (Number(packagingCost) || 0) +
    (Number(otherCosts) || 0);

  const costPerBag = bagCount > 0 ? totalCost / bagCount : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!batchCode.trim()) {
      setError('Batch Code is required.');
      return;
    }
    if (bagCount <= 0) {
      setError('Number of bags must be greater than 0.');
      return;
    }

    addBatch({
      batchCode: batchCode.trim(),
      startDate,
      variety,
      bagCount: Number(bagCount),
      roomNumber,
      spawnQtyKg: Number(spawnQtyKg) || 0,
      spawnCost: Number(spawnCost) || 0,
      substrateType,
      substrateQtyKg: Number(substrateQtyKg) || 0,
      substrateCost: Number(substrateCost) || 0,
      labourCost: Number(labourCost) || 0,
      electricityWaterCost: Number(electricityWaterCost) || 0,
      packagingCost: Number(packagingCost) || 0,
      otherCosts: Number(otherCosts) || 0,
      totalCost,
      targetHarvestDate,
      status,
      notes,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-stone-200 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-150">
        <div className="px-5 py-4 bg-emerald-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sprout className="w-5 h-5 text-emerald-200" />
            <h2 className="text-base sm:text-lg font-bold">
              {lang === 'hi' ? 'नया उत्पादन बैच शुरू करें' : 'Start New Production Batch'}
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

          {/* Batch Code, Date & Variety */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-stone-700 font-semibold mb-1">
                {lang === 'hi' ? 'बैच कोड' : 'Batch Code'} *
              </label>
              <input
                type="text"
                value={batchCode}
                onChange={(e) => setBatchCode(e.target.value)}
                className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-800 font-mono font-bold focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-stone-700 font-semibold mb-1">
                {lang === 'hi' ? 'प्रारंभ तिथि' : 'Inoculation Date'} *
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-800 focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-stone-700 font-semibold mb-1">
                {lang === 'hi' ? 'मशरूम किस्म' : 'Mushroom Variety'} *
              </label>
              <select
                value={variety}
                onChange={(e) => setVariety(e.target.value as MushroomVariety)}
                className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-800 focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Oyster">Oyster (ढींगरी)</option>
                <option value="Button">Button (बटन)</option>
                <option value="Milky">Milky (दूधिया)</option>
                <option value="Shiitake">Shiitake</option>
                <option value="Paddy Straw">Paddy Straw (पुआल)</option>
              </select>
            </div>
          </div>

          {/* Bags & Room */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-stone-700 font-semibold mb-1">
                {lang === 'hi' ? 'बैगों की संख्या' : 'Total Bags / Units'} *
              </label>
              <input
                type="number"
                min="1"
                value={bagCount}
                onChange={(e) => setBagCount(parseInt(e.target.value, 10) || 0)}
                className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-800 font-bold focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-stone-700 font-semibold mb-1">
                {lang === 'hi' ? 'ग्रो रूम / कक्ष' : 'Room / Polyhouse'}
              </label>
              <input
                type="text"
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
                className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-800 focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-stone-700 font-semibold mb-1">
                {lang === 'hi' ? 'अपेक्षित तुड़ाई तारीख' : 'Target Harvest Date'}
              </label>
              <input
                type="date"
                value={targetHarvestDate}
                onChange={(e) => setTargetHarvestDate(e.target.value)}
                className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-800 focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Substrate & Spawn Details */}
          <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200 space-y-3">
            <span className="font-bold text-stone-800 block">
              {lang === 'hi' ? 'कच्चा माल एवं लागत विवरण (₹)' : 'Raw Materials & Batch Costing (₹)'}
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-stone-700 mb-0.5">
                  Substrate Type & Qty (kg)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={substrateType}
                    onChange={(e) => setSubstrateType(e.target.value)}
                    placeholder="Substrate type"
                    className="flex-1 bg-white border border-stone-300 rounded-lg px-2.5 py-1.5 text-xs text-stone-800"
                  />
                  <input
                    type="number"
                    value={substrateQtyKg}
                    onChange={(e) => setSubstrateQtyKg(parseFloat(e.target.value) || 0)}
                    placeholder="kg"
                    className="w-20 bg-white border border-stone-300 rounded-lg px-2.5 py-1.5 text-xs text-stone-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-700 mb-0.5">
                  Substrate Cost (₹)
                </label>
                <input
                  type="number"
                  value={substrateCost}
                  onChange={(e) => setSubstrateCost(parseFloat(e.target.value) || 0)}
                  className="w-full bg-white border border-stone-300 rounded-lg px-2.5 py-1.5 text-xs text-stone-800"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-stone-700 mb-0.5">
                  Spawn Quantity (kg)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={spawnQtyKg}
                  onChange={(e) => setSpawnQtyKg(parseFloat(e.target.value) || 0)}
                  className="w-full bg-white border border-stone-300 rounded-lg px-2.5 py-1.5 text-xs text-stone-800"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-700 mb-0.5">
                  Spawn Cost (₹)
                </label>
                <input
                  type="number"
                  value={spawnCost}
                  onChange={(e) => setSpawnCost(parseFloat(e.target.value) || 0)}
                  className="w-full bg-white border border-stone-300 rounded-lg px-2.5 py-1.5 text-xs text-stone-800"
                />
              </div>
            </div>

            {/* Other Cost inputs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
              <div>
                <label className="block text-[11px] font-semibold text-stone-700 mb-0.5">
                  Labour (₹)
                </label>
                <input
                  type="number"
                  value={labourCost}
                  onChange={(e) => setLabourCost(parseFloat(e.target.value) || 0)}
                  className="w-full bg-white border border-stone-300 rounded-lg px-2 py-1 text-xs text-stone-800"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-700 mb-0.5">
                  Power/Water (₹)
                </label>
                <input
                  type="number"
                  value={electricityWaterCost}
                  onChange={(e) => setElectricityWaterCost(parseFloat(e.target.value) || 0)}
                  className="w-full bg-white border border-stone-300 rounded-lg px-2 py-1 text-xs text-stone-800"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-700 mb-0.5">
                  Bags/Pack (₹)
                </label>
                <input
                  type="number"
                  value={packagingCost}
                  onChange={(e) => setPackagingCost(parseFloat(e.target.value) || 0)}
                  className="w-full bg-white border border-stone-300 rounded-lg px-2 py-1 text-xs text-stone-800"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-700 mb-0.5">
                  Other Cost (₹)
                </label>
                <input
                  type="number"
                  value={otherCosts}
                  onChange={(e) => setOtherCosts(parseFloat(e.target.value) || 0)}
                  className="w-full bg-white border border-stone-300 rounded-lg px-2 py-1 text-xs text-stone-800"
                />
              </div>
            </div>

            {/* Total Batch Cost Summary */}
            <div className="p-2.5 bg-emerald-100/70 rounded-lg flex items-center justify-between text-xs text-emerald-950 font-bold">
              <span>Total Batch Production Investment:</span>
              <div className="text-right">
                <span className="text-sm font-extrabold text-emerald-900 block">{formatINR(totalCost)}</span>
                <span className="text-[10px] text-emerald-800 font-normal">
                  (~{formatINR(costPerBag)} / bag)
                </span>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-stone-700 font-semibold mb-1">
              {lang === 'hi' ? 'बैच नोट्स' : 'Batch Notes'}
            </label>
            <input
              type="text"
              placeholder="e.g. Inoculated with pure laboratory spawn, sterilized at 15 PSI"
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
              {lang === 'hi' ? 'बैच प्रारंभ करें' : 'Create & Start Batch'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
