import React, { useState } from 'react';
import { X, Boxes, AlertCircle } from 'lucide-react';
import { useFarm } from '../../context/FarmContext';
import { MushroomVariety } from '../../types';

interface StockAdjustModalProps {
  variety: MushroomVariety;
  isOpen: boolean;
  onClose: () => void;
}

export const StockAdjustModal: React.FC<StockAdjustModalProps> = ({ variety, isOpen, onClose }) => {
  const { state, lang, t, adjustStock } = useFarm();

  const currentStock = state.stocks.find(
    (s) => s.variety.toLowerCase() === variety.toLowerCase()
  );
  const currentAvailable = currentStock ? currentStock.availableKg : 0;

  const [newAvailableKg, setNewAvailableKg] = useState<number>(currentAvailable);
  const [reason, setReason] = useState<string>('Physical weigh-in inventory audit');
  const [error, setError] = useState<string>('');

  if (!isOpen) return null;

  const diff = (Number(newAvailableKg) || 0) - currentAvailable;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newAvailableKg < 0) {
      setError('Available stock cannot be negative.');
      return;
    }
    if (!reason.trim()) {
      setError('Audit reason is required for inventory adjustments.');
      return;
    }

    adjustStock(variety, Number(newAvailableKg), reason.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-stone-200 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-150">
        <div className="px-5 py-4 bg-emerald-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Boxes className="w-5 h-5 text-emerald-200" />
            <h2 className="text-base sm:text-lg font-bold">
              {lang === 'hi' ? `${variety} स्टॉक समायोजन` : `Adjust Stock – ${variety}`}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-emerald-100 hover:text-white hover:bg-emerald-700"
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

          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
            <span className="text-stone-500 text-xs block">Current Recorded Available Stock:</span>
            <span className="text-xl font-bold text-stone-900">{currentAvailable.toFixed(2)} kg</span>
          </div>

          <div>
            <label className="block text-stone-700 font-semibold mb-1">
              {lang === 'hi' ? 'वास्तविक उपलब्ध वजन (किग्रा)' : 'New Actual Available Stock (kg)'} *
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              value={newAvailableKg}
              onChange={(e) => setNewAvailableKg(parseFloat(e.target.value) || 0)}
              className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-800 font-bold text-base focus:ring-2 focus:ring-emerald-500"
              required
            />
            <p className="text-[11px] mt-1 text-stone-500">
              Adjustment Difference:{' '}
              <strong className={diff >= 0 ? 'text-emerald-700' : 'text-rose-700'}>
                {diff >= 0 ? `+${diff.toFixed(2)}` : diff.toFixed(2)} kg
              </strong>
            </p>
          </div>

          <div>
            <label className="block text-stone-700 font-semibold mb-1">
              {lang === 'hi' ? 'समायोजन का कारण' : 'Audit Reason / Note'} *
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-800 focus:ring-2 focus:ring-emerald-500 mb-2"
            >
              <option value="Physical weigh-in inventory audit">Physical weigh-in audit</option>
              <option value="Moisture evaporation loss write-off">Moisture weight loss</option>
              <option value="Damaged / Spoiled during grading">Damaged / Spoiled stock write-off</option>
              <option value="Farm gate gift / tasting sample">Farm gate sample / promo</option>
              <option value="Other manual correction">Other manual adjustment</option>
            </select>
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
              {lang === 'hi' ? 'स्टॉक अपडेट करें' : 'Update & Audit Stock'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
