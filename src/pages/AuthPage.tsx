import React, { useState } from 'react';
import {
  Lock,
  KeyRound,
  ShieldCheck,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useFarm } from '../context/FarmContext';
import { UserRole } from '../types';

export const AuthPage: React.FC = () => {
  const { state, lang, t, currentUser, setCurrentUser, updateSettings } = useFarm();

  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [message, setMessage] = useState<{ text: string; error?: boolean } | null>(null);
  const [showPin, setShowPin] = useState(false);

  const handlePinChange = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!currentUser) return;

    if (currentUser.pin !== currentPin) {
      setMessage({ text: 'Current PIN is incorrect.', error: true });
      return;
    }
    if (newPin.length < 4) {
      setMessage({ text: 'New PIN must be at least 4 digits.', error: true });
      return;
    }
    if (newPin !== confirmPin) {
      setMessage({ text: 'New PINs do not match.', error: true });
      return;
    }

    // Update user PIN
    currentUser.pin = newPin;
    setMessage({ text: 'Security PIN updated successfully!' });
    setCurrentPin('');
    setNewPin('');
    setConfirmPin('');
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight flex items-center gap-2">
          <Lock className="w-6 h-6 text-emerald-700" />
          {lang === 'hi' ? 'उपयोगकर्ता सुरक्षा एवं लॉगिन पिन' : 'User Security & PIN Authentication'}
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
          {lang === 'hi'
            ? 'मालिक सुरक्षा, भूमिका आधारित अभिगम (RBAC) व 4-अंकीय त्वरित सुरक्षा पिन प्रबंधन'
            : 'Owner credentials, session security, multi-role privileges and PIN authorization'}
        </p>
      </div>

      {message && (
        <div
          className={`p-3.5 rounded-xl text-xs flex items-center gap-2 ${
            message.error
              ? 'bg-rose-50 border border-rose-200 text-rose-800'
              : 'bg-emerald-50 border border-emerald-200 text-emerald-900'
          }`}
        >
          {message.error ? <AlertCircle className="w-4 h-4 text-rose-600" /> : <CheckCircle2 className="w-4 h-4 text-emerald-700" />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Active User Card */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-2xl bg-emerald-900 text-amber-300 font-extrabold text-xl flex items-center justify-center shadow-md">
            MK
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold text-stone-900">{currentUser?.name}</h2>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase">
                {currentUser?.role}
              </span>
            </div>
            <p className="text-xs text-stone-500 font-mono mt-0.5">{currentUser?.email}</p>
            <p className="text-[11px] text-stone-400 mt-0.5">
              Phone: {currentUser?.phone} • Last Authorized: Just now
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-1 text-right self-stretch sm:self-auto border-t sm:border-0 pt-3 sm:pt-0">
          <span className="text-[11px] font-semibold text-stone-500">Security Clearance:</span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 text-emerald-800 font-bold text-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Full Owner Access
          </span>
        </div>
      </div>

      {/* Role Switcher (Simulation) */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-3">
        <h3 className="font-bold text-sm text-stone-900">
          {lang === 'hi' ? 'भूमिका अनुसार अनुमतियां (Role-Based Access Control)' : 'Multi-Role Access Control (RBAC)'}
        </h3>
        <p className="text-xs text-stone-500">
          Switch user profile to test permissions across roles:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          {state.users.map((u) => {
            const isSelected = currentUser?.id === u.id;
            return (
              <div
                key={u.id}
                onClick={() => setCurrentUser(u)}
                className={`p-3.5 rounded-xl border text-xs cursor-pointer transition-all ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50/60 shadow-xs'
                    : 'border-stone-200 hover:border-stone-300 bg-stone-50/50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-stone-900 capitalize">{u.role}</span>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                </div>
                <p className="text-stone-700 font-medium">{u.name}</p>
                <p className="text-[11px] text-stone-500 mt-1">Default PIN: {u.pin}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Change Security PIN Form */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b pb-3">
          <KeyRound className="w-4 h-4 text-emerald-700" />
          <h3 className="font-extrabold text-sm text-stone-900">
            {lang === 'hi' ? 'सुरक्षा पिन बदलें' : 'Update 4-Digit Quick Access PIN'}
          </h3>
        </div>

        <form onSubmit={handlePinChange} className="space-y-3.5 text-xs sm:text-sm">
          <div>
            <label className="block text-stone-700 font-semibold mb-1">Current PIN *</label>
            <input
              type={showPin ? 'text' : 'password'}
              maxLength={6}
              value={currentPin}
              onChange={(e) => setCurrentPin(e.target.value)}
              placeholder="Enter current PIN (Default: 1234)"
              className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-stone-800 font-mono focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-stone-700 font-semibold mb-1">New PIN *</label>
              <input
                type={showPin ? 'text' : 'password'}
                maxLength={6}
                value={newPin}
                onChange={(e) => setNewPin(e.target.value)}
                placeholder="4 to 6 digit code"
                className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-stone-800 font-mono focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-stone-700 font-semibold mb-1">Confirm New PIN *</label>
              <input
                type={showPin ? 'text' : 'password'}
                maxLength={6}
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value)}
                placeholder="Re-enter new PIN"
                className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-stone-800 font-mono focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={() => setShowPin(!showPin)}
              className="text-stone-500 text-xs flex items-center gap-1 hover:text-stone-800"
            >
              {showPin ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span>{showPin ? 'Hide PIN characters' : 'Show PIN characters'}</span>
            </button>

            <button
              type="submit"
              className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
            >
              Update Security PIN
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
