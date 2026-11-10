import React, { useState } from 'react';
import {
  Users,
  Plus,
  Search,
  Phone,
  Mail,
  MapPin,
  FileText,
  DollarSign,
  Edit2,
  Trash2,
  X,
} from 'lucide-react';
import { useFarm } from '../context/FarmContext';
import { Customer, CustomerType } from '../types';
import { formatINR, formatKg, formatDate } from '../services/i18n';
import { CustomerStatementModal } from '../components/modals/CustomerStatementModal';

export const CustomersPage: React.FC = () => {
  const { state, lang, t, addCustomer, updateCustomer, deleteCustomer } = useFarm();

  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [statementCustomer, setStatementCustomer] = useState<Customer | null>(null);

  // Add / Edit Modal state
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [type, setType] = useState<CustomerType>('retail');
  const [gstNumber, setGstNumber] = useState('');
  const [notes, setNotes] = useState('');

  const filteredCustomers = state.customers.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.toLowerCase().includes(search.toLowerCase()) ||
      c.address.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === 'all' || c.type === filterType;
    return matchesSearch && matchesType;
  });

  const openAddModal = () => {
    setEditingCustomer(null);
    setName('');
    setPhone('');
    setEmail('');
    setAddress('');
    setType('retail');
    setGstNumber('');
    setNotes('');
    setShowModal(true);
  };

  const openEditModal = (c: Customer) => {
    setEditingCustomer(c);
    setName(c.name);
    setPhone(c.phone);
    setEmail(c.email || '');
    setAddress(c.address);
    setType(c.type);
    setGstNumber(c.gstNumber || '');
    setNotes(c.notes || '');
    setShowModal(true);
  };

  const handleSaveCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    if (editingCustomer) {
      updateCustomer({
        ...editingCustomer,
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        address: address.trim(),
        type,
        gstNumber: gstNumber.trim(),
        notes: notes.trim(),
      });
    } else {
      addCustomer({
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        address: address.trim(),
        type,
        gstNumber: gstNumber.trim(),
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
            <Users className="w-6 h-6 text-emerald-700" />
            {lang === 'hi' ? 'ग्राहक डेटाबेस एवं खाता बही' : 'Customer Directory & Accounts'}
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            {lang === 'hi'
              ? 'होटल, सब्जी मंडी व्यापारी, खुदरा खरीदार, कुल बिक्री, बकाया देय एवं खाता स्टेटमेंट'
              : 'Client contact directory, purchase totals, payment ledger and downloadable statements'}
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-emerald-800/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          {lang === 'hi' ? '+ नया ग्राहक जोड़ें' : '+ Add Customer'}
        </button>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-3.5 rounded-xl border border-stone-200 flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder={lang === 'hi' ? 'नाम, फोन, पता द्वारा खोजें...' : 'Search by name, phone, address...'}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-stone-50 border border-stone-200 rounded-lg pl-9 pr-3 py-1.5 text-xs text-stone-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1.5 text-xs text-stone-700 focus:outline-hidden w-full sm:w-auto"
        >
          <option value="all">All Customer Types</option>
          <option value="hotel">Hotels & Restaurants</option>
          <option value="wholesale">Sabzi Mandi Wholesalers</option>
          <option value="retail">Retail / Household</option>
          <option value="mandi_trader">Mandi Traders</option>
        </select>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-stone-100 text-stone-700 font-bold border-b border-stone-200 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Customer Name & Type</th>
                <th className="py-3 px-4">Contact Info</th>
                <th className="py-3 px-4 text-center">Orders</th>
                <th className="py-3 px-4 text-right">Total Purchased</th>
                <th className="py-3 px-4 text-right">Total Paid</th>
                <th className="py-3 px-4 text-right">Balance Due</th>
                <th className="py-3 px-4 text-center">Statement</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-stone-400">
                    No customers found matching the search.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((c) => (
                  <tr key={c.id} className="hover:bg-stone-50 transition-colors">
                    <td className="py-3 px-4">
                      <span className="font-bold text-stone-900 block text-xs">{c.name}</span>
                      <span className="inline-block mt-0.5 px-2 py-0.2 rounded-full text-[10px] font-bold uppercase bg-stone-100 text-stone-700">
                        {c.type}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <span className="text-stone-800 font-medium block">📞 {c.phone}</span>
                      <span className="text-stone-500 text-[11px] block truncate max-w-xs">
                        📍 {c.address}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-center">
                      <span className="font-bold text-stone-800">{c.totalOrders}</span>
                      <span className="text-[10px] text-stone-400 block">({c.totalKgPurchased} kg)</span>
                    </td>

                    <td className="py-3 px-4 text-right font-bold text-stone-900 font-mono">
                      {formatINR(c.totalBilledAmount)}
                    </td>

                    <td className="py-3 px-4 text-right font-mono font-semibold text-emerald-800">
                      {formatINR(c.totalPaidAmount)}
                    </td>

                    <td className="py-3 px-4 text-right font-mono">
                      {c.balanceDue > 0 ? (
                        <span className="font-extrabold text-rose-700 text-xs">
                          {formatINR(c.balanceDue)}
                        </span>
                      ) : (
                        <span className="font-bold text-emerald-700 text-[11px]">Clear (₹0)</span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => setStatementCustomer(c)}
                        className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-xs font-semibold inline-flex items-center gap-1 transition-colors"
                        title="Download / Print Statement"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Ledger</span>
                      </button>
                    </td>

                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => openEditModal(c)}
                          className="p-1.5 hover:bg-stone-100 text-stone-600 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Delete customer ${c.name}?`)) {
                              deleteCustomer(c.id);
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

      {/* Add / Edit Customer Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-stone-200 overflow-hidden my-6">
            <div className="px-5 py-4 bg-emerald-800 text-white flex items-center justify-between">
              <h3 className="font-bold text-base">
                {editingCustomer ? 'Edit Customer Details' : 'Add New Customer'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-emerald-200 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCustomer} className="p-5 space-y-3.5 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Customer Full Name *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-800 focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-800 focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Customer Category</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as CustomerType)}
                    className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-800 focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="retail">Retail / Household</option>
                    <option value="wholesale">Wholesale Mandi Buyer</option>
                    <option value="hotel">Hotel / Restaurant</option>
                    <option value="mandi_trader">Mandi Yard Trader</option>
                  </select>
                </div>

                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Email (Optional)</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-800 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">Address / Shop Location *</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-800 focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">GSTIN (Optional)</label>
                  <input
                    type="text"
                    value={gstNumber}
                    onChange={(e) => setGstNumber(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-800 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Special Notes</label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Regular buyer on Tuesdays"
                    className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-800 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
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
                  Save Customer Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable Statement Modal */}
      {statementCustomer && (
        <CustomerStatementModal
          customer={statementCustomer}
          isOpen={true}
          onClose={() => setStatementCustomer(null)}
        />
      )}
    </div>
  );
};
