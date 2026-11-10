import React, { useState } from 'react';
import {
  Database,
  Download,
  Upload,
  RefreshCw,
  Copy,
  Check,
  AlertTriangle,
  FileCode,
  ShieldCheck,
  Server,
} from 'lucide-react';
import { useFarm } from '../context/FarmContext';
import { StorageService } from '../services/storage';

export const BackupPage: React.FC = () => {
  const { state, lang, t, resetToCleanData, loadDemoData, importBackup } = useFarm();

  const [copiedSQL, setCopiedSQL] = useState(false);
  const [importMessage, setImportMessage] = useState<{ text: string; error?: boolean } | null>(null);

  const handleDownloadBackup = () => {
    const jsonString = StorageService.exportJSON(state);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Yamuna_Farming_Backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = importBackup(content);
      if (success) {
        setImportMessage({ text: 'Database restored successfully from backup file!' });
      } else {
        setImportMessage({ text: 'Failed to restore: Invalid backup file format.', error: true });
      }
    };
    reader.readAsText(file);
  };

  const handleCopySQL = () => {
    const sql = StorageService.generateSQLSchema();
    navigator.clipboard.writeText(sql);
    setCopiedSQL(true);
    setTimeout(() => setCopiedSQL(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight flex items-center gap-2">
          <Database className="w-6 h-6 text-emerald-700" />
          {lang === 'hi' ? 'डेटा बैकअप, रिस्टोर एवं क्लाउड डेटाबेस' : 'Data Backup, Restore & Cloud Database'}
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
          {lang === 'hi'
            ? 'संपूर्ण फार्म डेटा बैकअप डाउनलोड करें, रिस्टोर करें या Supabase/PostgreSQL स्कीमा एक्सपोर्ट करें'
            : 'Download JSON snapshots, restore files, switch demo data, and view Supabase PostgreSQL migration scripts'}
        </p>
      </div>

      {importMessage && (
        <div
          className={`p-3.5 rounded-xl text-xs flex items-center gap-2 ${
            importMessage.error
              ? 'bg-rose-50 border border-rose-200 text-rose-800'
              : 'bg-emerald-50 border border-emerald-200 text-emerald-900'
          }`}
        >
          {importMessage.error ? <AlertTriangle className="w-4 h-4 text-rose-600" /> : <Check className="w-4 h-4 text-emerald-700" />}
          <span>{importMessage.text}</span>
        </div>
      )}

      {/* Snapshot Backup & Restore Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Export JSON */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3">
              <Download className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-sm text-stone-900">Download Full JSON Backup</h3>
            <p className="text-xs text-stone-500 mt-1">
              Exports all {state.orders.length} orders, {state.batches.length} batches, {state.customers.length} customers, stocks, payments and expenses into an offline JSON backup file.
            </p>
          </div>
          <button
            onClick={handleDownloadBackup}
            className="w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors"
          >
            <Download className="w-4 h-4" />
            Download Backup File (.json)
          </button>
        </div>

        {/* Restore JSON */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center mb-3">
              <Upload className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-sm text-stone-900">Restore from Backup</h3>
            <p className="text-xs text-stone-500 mt-1">
              Upload a previously saved Yamuna Farming JSON backup file to instantly restore all business records.
            </p>
          </div>
          <div>
            <label className="w-full py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors">
              <Upload className="w-4 h-4 text-stone-600" />
              <span>Select Backup File...</span>
              <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>
        </div>
      </div>

      {/* Demo Data vs Clean Database Toggle */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-3">
        <h3 className="font-extrabold text-sm text-stone-900 flex items-center gap-2">
          <RefreshCw className="w-4 h-4 text-emerald-700" />
          Database State & Sample Data Management
        </h3>
        <p className="text-xs text-stone-500">
          Current State: <strong>{state.isDemoData ? 'Preloaded Demo Farm Records Active' : 'Clean Farm Records Active'}</strong>
        </p>

        <div className="flex flex-wrap gap-3 pt-2">
          <button
            onClick={() => {
              if (confirm('Load pre-populated demo records for Yamuna Farming? (Includes batches, harvests, orders, and payments)')) {
                loadDemoData();
              }
            }}
            className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold transition-colors"
          >
            Load Realistic Demo Data
          </button>

          <button
            onClick={() => {
              if (confirm('WARNING: Are you sure you want to reset to a clean empty database? All test batches and orders will be cleared.')) {
                resetToCleanData();
              }
            }}
            className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-800 rounded-xl text-xs font-bold transition-colors"
          >
            Reset to Clean Empty Farm Database
          </button>
        </div>
      </div>

      {/* PostgreSQL / Supabase Schema Exporter */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3">
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-emerald-700" />
            <div>
              <h3 className="font-extrabold text-sm text-stone-900">
                PostgreSQL & Supabase Production Schema Script
              </h3>
              <p className="text-xs text-stone-500">
                Ready-to-run DDL migration script with all 11 relational tables and constraints
              </p>
            </div>
          </div>

          <button
            onClick={handleCopySQL}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold self-start sm:self-auto transition-colors"
          >
            {copiedSQL ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedSQL ? 'SQL Copied!' : 'Copy Schema SQL'}</span>
          </button>
        </div>

        <div className="relative">
          <pre className="bg-stone-900 text-stone-300 p-4 rounded-xl text-[11px] font-mono max-h-64 overflow-y-auto leading-relaxed border border-stone-800">
            {StorageService.generateSQLSchema()}
          </pre>
        </div>

        <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-600 space-y-1">
          <span className="font-bold text-stone-800 block">
            🚀 Supabase Cloud Deployment Instructions:
          </span>
          <p>
            1. Create a free project at <strong>supabase.com</strong> or your cloud PostgreSQL host.
          </p>
          <p>
            2. Open the <strong>SQL Editor</strong> in Supabase dashboard and paste the copied SQL schema above.
          </p>
          <p>
            3. Run the script to initialize all production tables (users, batches, harvests, stocks, orders, deliveries, payments, expenses).
          </p>
        </div>
      </div>
    </div>
  );
};
