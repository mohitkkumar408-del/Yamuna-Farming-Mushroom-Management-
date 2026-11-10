import React, { useState } from 'react';
import {
  Settings,
  Save,
  CheckCircle2,
  Sprout,
  ShieldCheck,
  Building,
  DollarSign,
  Globe,
} from 'lucide-react';
import { useFarm } from '../context/FarmContext';
import { FarmSettings } from '../types';

export const SettingsPage: React.FC = () => {
  const { state, lang, t, updateSettings } = useFarm();

  const [form, setForm] = useState<FarmSettings>({ ...state.settings });
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(form);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight flex items-center gap-2">
          <Settings className="w-6 h-6 text-emerald-700" />
          {lang === 'hi' ? 'फार्म सेटिंग्स एवं प्रोफाइल' : 'Farm Profile & Business Configuration'}
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
          {lang === 'hi'
            ? 'व्यवसाय का नाम, मालिक का नाम, संपर्क, टैक्स/FSSAI नंबर व किस्म अनुसार डिफ़ॉल्ट दरें'
            : 'Configure farm legal identity, pricing defaults, safety inventory thresholds and billing header'}
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 flex-shrink-0" />
          <span>Farm settings successfully updated and saved!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Farm & Owner Identity */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b pb-3">
            <Building className="w-4 h-4 text-emerald-700" />
            <h2 className="font-extrabold text-sm text-stone-900">
              {lang === 'hi' ? 'व्यवसाय पहचान एवं कानूनी विवरण' : 'Business Identity & Legal Info'}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
            <div>
              <label className="block text-stone-700 font-semibold mb-1">
                Farm / Business Name (English) *
              </label>
              <input
                type="text"
                value={form.farmName}
                onChange={(e) => setForm({ ...form, farmName: e.target.value })}
                className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-stone-800 font-bold focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-stone-700 font-semibold mb-1">
                व्यवसाय का नाम (हिन्दी)
              </label>
              <input
                type="text"
                value={form.farmNameHi}
                onChange={(e) => setForm({ ...form, farmNameHi: e.target.value })}
                className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-stone-800 font-bold focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-stone-700 font-semibold mb-1">
                Owner Full Name (English) *
              </label>
              <input
                type="text"
                value={form.ownerName}
                onChange={(e) => setForm({ ...form, ownerName: e.target.value })}
                className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-stone-800 font-bold focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-stone-700 font-semibold mb-1">
                मालिक का नाम (हिन्दी)
              </label>
              <input
                type="text"
                value={form.ownerNameHi}
                onChange={(e) => setForm({ ...form, ownerNameHi: e.target.value })}
                className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-stone-800 font-bold focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-stone-700 font-semibold mb-1">Official Phone *</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-stone-800 focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-stone-700 font-semibold mb-1">Official Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-stone-800 focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-stone-700 font-semibold mb-1">Farm Address / Hub Location *</label>
              <input
                type="text"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-stone-800 focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-stone-700 font-semibold mb-1">FSSAI License Number</label>
              <input
                type="text"
                value={form.fssaiNumber || ''}
                onChange={(e) => setForm({ ...form, fssaiNumber: e.target.value })}
                className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-stone-800 font-mono"
              />
            </div>

            <div>
              <label className="block text-stone-700 font-semibold mb-1">GSTIN Tax Registration</label>
              <input
                type="text"
                value={form.gstin || ''}
                onChange={(e) => setForm({ ...form, gstin: e.target.value })}
                className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-stone-800 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Variety Default Pricing */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b pb-3">
            <DollarSign className="w-4 h-4 text-emerald-700" />
            <h2 className="font-extrabold text-sm text-stone-900">
              {lang === 'hi' ? 'किस्म अनुसार मानक बिक्री दरें (₹ प्रति किग्रा)' : 'Default Mushroom Selling Rates (₹ per kg)'}
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-xs">
            <div>
              <label className="block text-stone-700 font-semibold mb-1">Oyster (ढींगरी)</label>
              <input
                type="number"
                value={form.defaultOysterPrice}
                onChange={(e) => setForm({ ...form, defaultOysterPrice: parseFloat(e.target.value) || 0 })}
                className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-stone-800 font-bold"
              />
            </div>

            <div>
              <label className="block text-stone-700 font-semibold mb-1">Button (बटन)</label>
              <input
                type="number"
                value={form.defaultButtonPrice}
                onChange={(e) => setForm({ ...form, defaultButtonPrice: parseFloat(e.target.value) || 0 })}
                className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-stone-800 font-bold"
              />
            </div>

            <div>
              <label className="block text-stone-700 font-semibold mb-1">Milky (दूधिया)</label>
              <input
                type="number"
                value={form.defaultMilkyPrice}
                onChange={(e) => setForm({ ...form, defaultMilkyPrice: parseFloat(e.target.value) || 0 })}
                className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-stone-800 font-bold"
              />
            </div>

            <div>
              <label className="block text-stone-700 font-semibold mb-1">Shiitake</label>
              <input
                type="number"
                value={form.defaultShiitakePrice}
                onChange={(e) => setForm({ ...form, defaultShiitakePrice: parseFloat(e.target.value) || 0 })}
                className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-stone-800 font-bold"
              />
            </div>

            <div>
              <label className="block text-stone-700 font-semibold mb-1">Paddy Straw (पुआल)</label>
              <input
                type="number"
                value={form.defaultPaddyStrawPrice}
                onChange={(e) => setForm({ ...form, defaultPaddyStrawPrice: parseFloat(e.target.value) || 0 })}
                className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-stone-800 font-bold"
              />
            </div>
          </div>
        </div>

        {/* Inventory Safety & Automation */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b pb-3">
            <Sprout className="w-4 h-4 text-emerald-700" />
            <h2 className="font-extrabold text-sm text-stone-900">
              {lang === 'hi' ? 'इन्वेंटरी सुरक्षा व आरक्षण नियम' : 'Inventory Policies & Automation'}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-stone-700 font-semibold mb-1">
                Global Low-Stock Warning Threshold (kg)
              </label>
              <input
                type="number"
                value={form.lowStockThresholdKg}
                onChange={(e) => setForm({ ...form, lowStockThresholdKg: parseFloat(e.target.value) || 0 })}
                className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-stone-800 font-bold"
              />
              <p className="text-[11px] text-stone-500 mt-1">
                Triggers visual alerts when fresh stock drops below this weight.
              </p>
            </div>

            <div>
              <label className="block text-stone-700 font-semibold mb-1">
                Default Language
              </label>
              <select
                value={form.language}
                onChange={(e) => setForm({ ...form, language: e.target.value as any })}
                className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-stone-800 font-semibold"
              >
                <option value="en">English</option>
                <option value="hi">हिन्दी (Hindi)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-sm font-bold shadow-md shadow-emerald-800/20 transition-all"
          >
            <Save className="w-4 h-4" />
            {t.save}
          </button>
        </div>
      </form>
    </div>
  );
};
