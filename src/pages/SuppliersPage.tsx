import React, { useState } from 'react';
import {
  Building2,
  Plus,
  Search,
  Phone,
  MapPin,
  DollarSign,
  Edit2,
  Trash2,
  X,
} from 'lucide-react';
import { useFarm } from '../context/FarmContext';
import { Supplier } from '../types';
import { formatINR, formatDate } from '../services/i18n';

export const SuppliersPage: React.FC = () => {
  const { state, lang, t, addSupplier, updateSupplier, deleteSupplier } = useFarm();

  const [search, setSearch] = useState('');
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [showModal, setShowModal] = useState(false);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [supplyCategory, setSupplyCategory] = useState('');
  const [notes, setNotes] = useState('');

  const filteredSuppliers = state.suppliers.filter((s) => {
    return (
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.supplyCategory.toLowerCase().includes(search.toLowerCase()) ||
      s.address.toLowerCase().includes(search.toLowerCase())
    );
  });

  const openAddModal = () => {
    setEditingSupplier(null);
    setName('');
    setPhone('');
    setEmail('');
    setAddress('');
    setSupplyCategory('Spawn Laboratory');
    setNotes('');
    setShowModal(true);
  };

  const openEditModal = (s: Supplier) => {
    setEditingSupplier(s);
    setName(s.name);
    setPhone(s.phone);
    setEmail(s.email || '');
    setAddress(s.address);
    setSupplyCategory(s.supplyCategory);
    setNotes(s.notes || '');
    setShowModal(true);
  };

  const handleSaveSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    if (editingSupplier) {
      updateSupplier({
        ...editingSupplier,
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        address: address.trim(),
        supplyCategory: supplyCategory.trim(),
        notes: notes.trim(),
      });
    } else {
      addSupplier({
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        address: address.trim(),
        supplyCategory: supplyCategory.trim(),
        notes: notes.trim(),
      });
    }

    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight flex items-center gap-2">
            <Building2 className="w-6 h-6 text-emerald-700" />
            {lang === 'hi' ? 'कच्चा माल सप्लायर प्रबंधन' : 'Raw Material Suppliers Directory'}
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            {lang === 'hi'
              ? 'स्पॉन लैब, पुआल विक्रेता, बैग व केमिकल सप्लायर, खरीद इतिहास व बकाया देय'
              : 'Certified spawn labs, straw farmers, PP bag manufacturers and payment accounts'}
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-emerald-800/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          {lang === 'hi' ? '+ नया सप्लायर जोड़ें' : '+ Add Supplier'}
        </button>
      </div>

      {/* Search Input */}
      <div className="bg-white p-3.5 rounded-xl border border-stone-200">
        <div className="relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder={lang === 'hi' ? 'सप्लायर नाम, श्रेणी, पता द्वारा खोजें...' : 'Search supplier name, category, location...'}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-stone-50 border border-stone-200 rounded-lg pl-9 pr-3 py-1.5 text-xs text-stone-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Suppliers Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-stone-100 text-stone-700 font-bold border-b border-stone-200 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Supplier Name & Category</th>
                <th className="py-3 px-4">Contact Information</th>
                <th className="py-3 px-4 text-right">Total Purchased</th>
                <th className="py-3 px-4 text-right">Total Paid</th>
                <th className="py-3 px-4 text-right">Payable Balance</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredSuppliers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-stone-400">
                    No suppliers found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredSuppliers.map((s) => (
                  <tr key={s.id} className="hover:bg-stone-50 transition-colors">
                    <td className="py-3 px-4">
                      <span className="font-bold text-stone-900 block text-xs">{s.name}</span>
                      <span className="text-[11px] text-emerald-800 font-medium">{s.supplyCategory}</span>
                    </td>

                    <td className="py-3 px-4">
                      <span className="text-stone-800 font-medium block">📞 {s.phone}</span>
                      <span className="text-stone-500 text-[11px] block truncate max-w-xs">
                        📍 {s.address}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right font-bold text-stone-900 font-mono">
                      {formatINR(s.totalPurchased)}
                    </td>

                    <td className="py-3 px-4 text-right font-mono font-semibold text-emerald-800">
                      {formatINR(s.totalPaid)}
                    </td>

                    <td className="py-3 px-4 text-right font-mono">
                      {s.balancePayable > 0 ? (
                        <span className="font-extrabold text-amber-700 text-xs">
                          {formatINR(s.balancePayable)}
                        </span>
                      ) : (
                        <span className="font-bold text-emerald-700 text-[11px]">Clear</span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => openEditModal(s)}
                          className="p-1.5 hover:bg-stone-100 text-stone-600 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Delete supplier ${s.name}?`)) {
                              deleteSupplier(s.id);
                            }
                          }}
                          className="p-1.5 hover:bg-rose-50 text-stone-400 hover:text-rose-600 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-stone-200 overflow-hidden my-6">
            <div className="px-5 py-4 bg-emerald-800 text-white flex items-center justify-between">
              <h3 className="font-bold text-base">
                {editingSupplier ? 'Edit Supplier' : 'Add New Raw Material Supplier'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-emerald-200 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSupplier} className="p-5 space-y-3.5 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Company / Person Name *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-800"
                    required
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-800"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Supply Category *</label>
                  <input
                    type="text"
                    value={supplyCategory}
                    onChange={(e) => setSupplyCategory(e.target.value)}
                    placeholder="e.g. Certified Spawn, Straw, Bags"
                    className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-800"
                    required
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Email (Optional)</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">Address / Depot Location</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-800"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-stone-100 text-stone-700 rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 text-white rounded-xl font-bold hover:bg-emerald-800"
                >
                  Save Supplier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
