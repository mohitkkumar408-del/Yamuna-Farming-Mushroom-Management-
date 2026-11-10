import React from 'react';
import { formatINR, formatKg } from '../../services/i18n';

interface TrendDataPoint {
  label: string;
  harvestKg: number;
  salesKg: number;
}

export const HarvestSalesTrendChart: React.FC<{ data: TrendDataPoint[] }> = ({ data }) => {
  if (!data || data.length === 0) {
    return <div className="text-stone-400 text-sm py-8 text-center">No trend data available</div>;
  }

  const maxVal = Math.max(...data.map((d) => Math.max(d.harvestKg, d.salesKg)), 10);
  const chartHeight = 160;
  const chartWidth = 500;
  const padding = 30;
  const usableWidth = chartWidth - padding * 2;
  const usableHeight = chartHeight - padding * 2;

  const pointsHarvest = data.map((d, i) => {
    const x = padding + (i / Math.max(1, data.length - 1)) * usableWidth;
    const y = chartHeight - padding - (d.harvestKg / maxVal) * usableHeight;
    return { x, y, val: d.harvestKg, label: d.label };
  });

  const pointsSales = data.map((d, i) => {
    const x = padding + (i / Math.max(1, data.length - 1)) * usableWidth;
    const y = chartHeight - padding - (d.salesKg / maxVal) * usableHeight;
    return { x, y, val: d.salesKg, label: d.label };
  });

  const pathHarvest = pointsHarvest.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const pathSales = pointsSales.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  const areaHarvest = `${pathHarvest} L ${pointsHarvest[pointsHarvest.length - 1]?.x || 0} ${chartHeight - padding} L ${pointsHarvest[0]?.x || 0} ${chartHeight - padding} Z`;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between text-xs mb-3 text-stone-600">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 font-medium text-emerald-800">
            <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
            Harvest (kg)
          </span>
          <span className="flex items-center gap-1.5 font-medium text-amber-800">
            <span className="w-3 h-3 rounded-full bg-amber-500 inline-block"></span>
            Sales (kg)
          </span>
        </div>
        <span className="text-stone-500 font-mono">Max: {formatKg(maxVal)}</span>
      </div>

      <div className="relative w-full overflow-hidden">
        <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-44 overflow-visible">
          <defs>
            <linearGradient id="harvestGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 0.5, 1].map((ratio) => {
            const y = chartHeight - padding - ratio * usableHeight;
            return (
              <g key={ratio}>
                <line x1={padding} y1={y} x2={chartWidth - padding} y2={y} stroke="#e7e5e4" strokeDasharray="3 3" />
                <text x={padding - 6} y={y + 3} textAnchor="end" fontSize="9" fill="#a8a29e">
                  {Math.round(ratio * maxVal)}
                </text>
              </g>
            );
          })}

          {/* Harvest Area and Line */}
          <path d={areaHarvest} fill="url(#harvestGrad)" />
          <path d={pathHarvest} fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

          {/* Sales Line */}
          <path d={pathSales} fill="none" stroke="#d97706" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

          {/* Harvest dots */}
          {pointsHarvest.map((p, i) => (
            <circle key={`h_${i}`} cx={p.x} cy={p.y} r="3.5" fill="#059669" stroke="#ffffff" strokeWidth="1.5" />
          ))}

          {/* Sales dots */}
          {pointsSales.map((p, i) => (
            <circle key={`s_${i}`} cx={p.x} cy={p.y} r="3.5" fill="#d97706" stroke="#ffffff" strokeWidth="1.5" />
          ))}

          {/* Labels */}
          {pointsHarvest.map((p, i) => (
            <text key={`l_${i}`} x={p.x} y={chartHeight - 10} textAnchor="middle" fontSize="10" fill="#78716c">
              {p.label}
            </text>
          ))}
        </svg>
      </div>
    </div>
  );
};

export const CategoryBarChart: React.FC<{
  data: { label: string; amount: number; color?: string }[];
  valueFormatter?: (n: number) => string;
}> = ({ data, valueFormatter = formatINR }) => {
  if (!data || data.length === 0) {
    return <div className="text-stone-400 text-sm py-4 text-center">No category data</div>;
  }

  const maxVal = Math.max(...data.map((d) => d.amount), 1);

  return (
    <div className="space-y-3">
      {data.map((item, idx) => {
        const pct = Math.min(100, Math.round((item.amount / maxVal) * 100));
        return (
          <div key={idx} className="space-y-1">
            <div className="flex justify-between items-center text-xs">
              <span className="font-medium text-stone-700 capitalize">{item.label}</span>
              <span className="font-semibold text-stone-900">{valueFormatter(item.amount)}</span>
            </div>
            <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500 ease-out"
                style={{
                  width: `${pct}%`,
                  backgroundColor: item.color || '#10b981',
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export const VarietyDonutChart: React.FC<{
  items: { variety: string; qtyKg: number; color: string }[];
}> = ({ items }) => {
  const total = items.reduce((sum, item) => sum + item.qtyKg, 0);

  if (total === 0) {
    return <div className="text-stone-400 text-sm py-6 text-center">No variety data recorded yet</div>;
  }

  let accumulated = 0;
  const slices = items.map((item) => {
    const fraction = item.qtyKg / total;
    const startAngle = accumulated * 2 * Math.PI;
    accumulated += fraction;
    const endAngle = accumulated * 2 * Math.PI;

    const x1 = Math.cos(startAngle) * 40;
    const y1 = Math.sin(startAngle) * 40;
    const x2 = Math.cos(endAngle) * 40;
    const y2 = Math.sin(endAngle) * 40;

    const largeArc = fraction > 0.5 ? 1 : 0;
    const pathData = `M 0 0 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`;

    return { ...item, pathData, fraction };
  });

  return (
    <div className="flex items-center gap-6">
      <div className="relative w-32 h-32 flex-shrink-0">
        <svg viewBox="-50 -50 100 100" className="w-full h-full -rotate-90">
          {slices.map((slice, i) => (
            <path key={i} d={slice.pathData} fill={slice.color} stroke="#ffffff" strokeWidth="2" />
          ))}
          {/* Inner cutout for donut effect */}
          <circle cx="0" cy="0" r="24" fill="#ffffff" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-[10px] text-stone-500 font-medium uppercase">Total</span>
          <span className="text-xs font-bold text-stone-900">{formatKg(total)}</span>
        </div>
      </div>

      <div className="flex-1 space-y-1.5 text-xs">
        {items.map((item, i) => {
          const pct = Math.round((item.qtyKg / total) * 100) || 0;
          return (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-stone-700 truncate max-w-[120px]">{item.variety}</span>
              </div>
              <span className="font-semibold text-stone-900">
                {formatKg(item.qtyKg)} <span className="text-stone-500 font-normal">({pct}%)</span>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
