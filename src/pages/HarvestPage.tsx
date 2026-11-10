import React, { useState } from 'react';
import {
  Scissors,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  Award,
} from 'lucide-react';
import { useFarm } from '../context/FarmContext';
import { formatKg, formatDate } from '../services/i18n';

interface HarvestPageProps {
  onOpenLogHarvest: () => void;
}

export const HarvestPage: React.FC<HarvestPageProps> = ({ onOpenLogHarvest }) => {
  const { state, lang, t, metrics } = useFarm();

  const [search, setSearch] = useState('');
  const [filterVariety, setFilterVariety] = useState('all');

  const filteredHarvests = state.harvests.filter((h) => {
    const matchesSearch =
      h.batchCode.toLowerCase().includes(search.toLowerCase()) ||
      h.variety.toLowerCase().includes(search.toLowerCase()) ||
      h.harvestedBy.toLowerCase().includes(search.toLowerCase());
    const matchesVariety = filterVariety === 'all' || h.variety === filterVariety;
    return matchesSearch && matchesVariety;
  });

  const totalHarvestNet = filteredHarvests.reduce((sum, h) => sum + h.netFreshQtyKg, 0);
  const totalGradeA = filteredHarvests.reduce((sum, h) => sum + h.gradeA_QtyKg, 0);
  const totalSpoiled = filteredHarvests.reduce((sum, h) => sum + h.spoiledQtyKg, 0);
  const gradeARatio = totalHarvestNet > 0 ? (totalGradeA / totalHarvestNet) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight flex items-center gap-2">
            <Scissors className="w-6 h-6 text-emerald-700" />
            {lang === 'hi' ? 'ताजा मशरूम तुड़ाई प्रबंधन (Harvest Logs)' : 'Fresh Mushroom Harvest Management'}
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            {lang === 'hi'
              ? 'फ्लश 1, 2, 3 तुड़ाई, ग्रेडिंग (Grade A, B, C), खराबी व इन्वेंटरी स्टॉक में स्वतः प्रविष्टि'
              : 'Log daily flush harvests, quality grade sorting (Grade A, B, C) and automatic stock intake'}
          </p>
        </div>

        <button
          onClick={onOpenLogHarvest}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-emerald-800/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          {t.logHarvest}
        </button>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white p-4 rounded-xl border border-stone-200">
          <span className="text-xs font-semibold text-stone-500 block">Total Net Harvested</span>
          <span className="text-xl font-black text-stone-900 mt-1 block font-mono">
            {formatKg(totalHarvestNet)}
          </span>
          <span className="text-[11px] text-emerald-700 font-medium">Added to fresh stock</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200">
          <span className="text-xs font-semibold text-stone-500 block">Grade A (Premium)</span>
          <span className="text-xl font-black text-emerald-800 mt-1 block font-mono">
            {formatKg(totalGradeA)}
          </span>
          <span className="text-[11px] text-stone-500 font-medium">
            {gradeARatio.toFixed(1)}% of total yield
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200">
          <span className="text-xs font-semibold text-stone-500 block">Spoiled / Damaged</span>
          <span className="text-xl font-black text-rose-700 mt-1 block font-mono">
            {formatKg(totalSpoiled)}
          </span>
          <span className="text-[11px] text-stone-400">Discarded at grading</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200">
          <span className="text-xs font-semibold text-stone-500 block">Today's Fresh Harvest</span>
          <span className="text-xl font-black text-amber-800 mt-1 block font-mono">
            {formatKg(metrics.todayHarvestKg)}
          </span>
          <span className="text-[11px] text-stone-500">Recorded for today</span>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-3.5 rounded-xl border border-stone-200 flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder={lang === 'hi' ? 'बैच कोड, किस्म, तुड़ाईकर्ता द्वारा खोजें...' : 'Search by batch code, variety, harvester...'}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-stone-50 border border-stone-200 rounded-lg pl-9 pr-3 py-1.5 text-xs text-stone-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <select
          value={filterVariety}
          onChange={(e) => setFilterVariety(e.target.value)}
          className="bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1.5 text-xs text-stone-700 focus:outline-hidden w-full sm:w-auto"
        >
          <option value="all">All Varieties</option>
          <option value="Oyster">Oyster (ढींगरी)</option>
          <option value="Button">Button (बटन)</option>
          <option value="Milky">Milky (दूधिया)</option>
          <option value="Shiitake">Shiitake</option>
        </select>
      </div>

      {/* Harvest Records Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-stone-100 text-stone-700 font-bold border-b border-stone-200 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Batch Code</th>
                <th className="py-3 px-4">Variety</th>
                <th className="py-3 px-4 text-center">Flush #</th>
                <th className="py-3 px-4 text-right">Net Fresh (kg)</th>
                <th className="py-3 px-4 text-right">Grade A</th>
                <th className="py-3 px-4 text-right">Grade B</th>
                <th className="py-3 px-4 text-right">Grade C</th>
                <th className="py-3 px-4 text-right">Spoiled</th>
                <th className="py-3 px-4">Harvester</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredHarvests.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-stone-400">
                    No harvest records found. Record a harvest to populate this table.
                  </td>
                </tr>
              ) : (
                filteredHarvests.map((h) => (
                  <tr key={h.id} className="hover:bg-stone-50 transition-colors">
                    <td className="py-3 px-4 font-medium text-stone-800">
                      {formatDate(h.harvestDate)}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-stone-900">
                      {h.batchCode}
                    </td>
                    <td className="py-3 px-4 font-semibold text-emerald-900">
                      {h.variety}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="px-2 py-0.5 rounded-full bg-stone-200 text-stone-800 font-bold text-[10px]">
                        Flush {h.flushNumber}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-extrabold text-sm text-emerald-900 font-mono">
                      {h.netFreshQtyKg.toFixed(2)} kg
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-emerald-800">
                      {h.gradeA_QtyKg.toFixed(1)} kg
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-stone-600">
                      {h.gradeB_QtyKg.toFixed(1)} kg
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-stone-500">
                      {h.gradeC_QtyKg.toFixed(1)} kg
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-rose-600 font-semibold">
                      {h.spoiledQtyKg > 0 ? `${h.spoiledQtyKg.toFixed(1)} kg` : '-'}
                    </td>
                    <td className="py-3 px-4 text-stone-600 truncate max-w-[140px]">
                      {h.harvestedBy}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
