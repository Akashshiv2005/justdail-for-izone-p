import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Tag, TrendingUp, CheckCircle, BarChart, Trash2, Edit3, Sparkles, MapPin, Building2, X } from 'lucide-react';
import { authFetch } from '../../../lib/services/authFetch';

interface BusinessOption {
  id: number;
  business_name: string;
  category: string | null;
  city: string | null;
  keyword_count: number;
}

interface Keyword {
  id: number;
  business_id: number;
  keyword: string;
  category: string | null;
  city: string | null;
  priority: string;
  monthly_search_volume: number | null;
  difficulty: number | null;
  status: string;
}

export default function SEOKeywords() {
  // --- Business picker state ---
  const [businessQuery, setBusinessQuery] = useState('');
  const [businessResults, setBusinessResults] = useState<BusinessOption[]>([]);
  const [selectedBusiness, setSelectedBusiness] = useState<BusinessOption | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [searching, setSearching] = useState(false);

  // --- Keyword list/form state ---
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [loading, setLoading] = useState(false);
  const [newKeyword, setNewKeyword] = useState('');
  const [newPriority, setNewPriority] = useState('Medium');
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Search businesses as the admin types
  useEffect(() => {
    setSearching(true);
    const handle = setTimeout(() => {
      authFetch(`/api/admin/seo/keywords/businesses?q=${encodeURIComponent(businessQuery)}`)
        .then(res => res.json())
        .then(data => {
          setBusinessResults(Array.isArray(data) ? data : []);
          setSearching(false);
        })
        .catch(() => setSearching(false));
    }, 300);
    return () => clearTimeout(handle);
  }, [businessQuery]);

  const fetchKeywords = useCallback((businessId: number) => {
    setLoading(true);
    authFetch(`/api/admin/seo/keywords?business_id=${businessId}`)
      .then(res => res.json())
      .then(data => {
        setKeywords(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (selectedBusiness) fetchKeywords(selectedBusiness.id);
  }, [selectedBusiness, fetchKeywords]);

  const handleSelectBusiness = (b: BusinessOption) => {
    setSelectedBusiness(b);
    setPickerOpen(false);
    setBusinessQuery('');
    setEditingId(null);
    setNewKeyword('');
  };

  const handleDeleteKeyword = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this keyword?')) return;
    try {
      const res = await authFetch(`/api/admin/seo/keywords/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        alert('Failed to delete this keyword.');
        return;
      }
      if (selectedBusiness) fetchKeywords(selectedBusiness.id);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditClick = (kw: Keyword) => {
    setEditingId(kw.id);
    setNewKeyword(kw.keyword);
    setNewPriority(kw.priority || 'Medium');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddKeyword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyword || !selectedBusiness) return;
    setIsAdding(true);

    const url = editingId ? `/api/admin/seo/keywords/${editingId}` : '/api/admin/seo/keywords';
    const method = editingId ? 'PUT' : 'POST';

    authFetch(url, {
      method,
      body: JSON.stringify({
        business_id: selectedBusiness.id,
        keyword: newKeyword,
        priority: newPriority,
      }),
    })
      .then(res => res.json())
      .then(() => {
        setNewKeyword('');
        setNewPriority('Medium');
        setIsAdding(false);
        setEditingId(null);
        fetchKeywords(selectedBusiness.id);
      })
      .catch(() => setIsAdding(false));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-blue-900 to-slate-900 p-8 rounded-[2rem] shadow-2xl border border-white/10"
      >
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <TrendingUp size={120} className="text-white" />
        </div>
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-blue-200 text-xs font-bold uppercase tracking-wider mb-4 backdrop-blur-md">
            <Sparkles size={14} className="text-blue-300" /> Enterprise SEO
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white mb-2 tracking-tight">Business Keywords Manager</h1>
          <p className="text-blue-200/80 max-w-xl text-sm md:text-base font-medium">
            Pick a business, then target it with keywords that map directly to its real category and city — no unlinked global entries.
          </p>
        </div>
      </motion.div>

      {/* Business Picker */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-200/50 relative"
      >
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
            <Building2 size={16} />
          </div>
          <h3 className="text-lg font-bold text-slate-900">1. Select a Business</h3>
        </div>

        {selectedBusiness ? (
          <div className="flex items-center justify-between bg-indigo-50 border border-indigo-200 rounded-xl px-4 py-3">
            <div>
              <div className="font-black text-slate-900">{selectedBusiness.business_name}</div>
              <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                <span className="flex items-center gap-1"><Tag size={11} /> {selectedBusiness.category || 'General'}</span>
                <span className="flex items-center gap-1"><MapPin size={11} /> {selectedBusiness.city || 'Unknown'}</span>
              </div>
            </div>
            <button
              onClick={() => { setSelectedBusiness(null); setKeywords([]); }}
              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Change business"
            >
              <X size={18} />
            </button>
          </div>
        ) : (
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
              <Search size={18} />
            </div>
            <input
              type="text"
              placeholder="Search a business by name..."
              value={businessQuery}
              onChange={(e) => { setBusinessQuery(e.target.value); setPickerOpen(true); }}
              onFocus={() => setPickerOpen(true)}
              className="w-full pl-11 pr-4 py-3.5 bg-slate-50 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 placeholder:font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
            <AnimatePresence>
              {pickerOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.15 }}
                  className="absolute z-20 mt-2 w-full bg-white rounded-xl border border-slate-200 shadow-2xl max-h-72 overflow-y-auto"
                >
                  {searching ? (
                    <div className="p-4 text-center text-sm text-slate-400">Searching...</div>
                  ) : businessResults.length === 0 ? (
                    <div className="p-4 text-center text-sm text-slate-400">No businesses found.</div>
                  ) : (
                    businessResults.map(b => (
                      <button
                        key={b.id}
                        onClick={() => handleSelectBusiness(b)}
                        className="w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors flex items-center justify-between border-b border-slate-50 last:border-0"
                      >
                        <div>
                          <div className="font-bold text-sm text-slate-900">{b.business_name}</div>
                          <div className="text-xs text-slate-500">{b.category || 'General'} · {b.city || 'Unknown'}</div>
                        </div>
                        <span className="text-[10px] font-bold text-slate-400">{b.keyword_count} kw</span>
                      </button>
                    ))
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </motion.div>

      {/* Add Keyword Form + Table — only once a business is selected */}
      <AnimatePresence>
        {selectedBusiness && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35 }}
            className="space-y-8 overflow-hidden"
          >
            <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-200/50">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <TrendingUp size={16} />
                </div>
                <h3 className="text-lg font-bold text-slate-900">2. Target a Keyword for {selectedBusiness.business_name}</h3>
              </div>

              <form onSubmit={handleAddKeyword} className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                    <TrendingUp size={18} />
                  </div>
                  <input
                    type="text"
                    placeholder="e.g., Best dentist near Thillai Nagar"
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 placeholder:font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    required
                  />
                </div>

                <select
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value)}
                  className="w-full lg:w-44 px-4 py-3.5 bg-slate-50 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                >
                  <option value="High">High Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="Low">Low Priority</option>
                </select>

                <button
                  type="submit"
                  disabled={isAdding}
                  className="px-8 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-sm rounded-xl transition-all shadow-lg shadow-blue-600/30 shrink-0 flex items-center justify-center gap-2 hover:-translate-y-1 hover:shadow-xl disabled:opacity-50 disabled:hover:translate-y-0"
                >
                  {isAdding ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Plus size={18} />}
                  {isAdding ? (editingId ? 'Updating...' : 'Adding...') : (editingId ? 'Update Keyword' : 'Add Keyword')}
                </button>
              </form>
            </div>

            <div className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-xl shadow-slate-200/50">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <BarChart size={20} className="text-indigo-600" /> Keywords for this Business
                </h3>
                <span className="px-3 py-1 bg-slate-100 text-slate-600 font-bold text-xs rounded-full">
                  {keywords.length} Tracked
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="bg-slate-50/50 text-slate-500 text-xs uppercase font-extrabold border-b border-slate-100">
                    <tr>
                      <th className="py-5 px-6">Target Keyword</th>
                      <th className="py-5 px-6">Category / City</th>
                      <th className="py-5 px-6">Priority</th>
                      <th className="py-5 px-6">Status</th>
                      <th className="py-5 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {loading ? (
                      <tr><td colSpan={5} className="py-12 text-center text-slate-400">Loading keywords...</td></tr>
                    ) : keywords.length === 0 ? (
                      <tr><td colSpan={5} className="py-12 text-center text-slate-400">No keywords yet for this business. Add one above.</td></tr>
                    ) : (
                      <AnimatePresence>
                        {keywords.map(kw => (
                          <motion.tr
                            key={kw.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="hover:bg-blue-50/30 transition-colors group"
                          >
                            <td className="py-4 px-6 font-black text-slate-900 group-hover:text-blue-700 transition-colors">
                              {kw.keyword}
                            </td>
                            <td className="py-4 px-6">
                              <div className="flex items-center gap-2 text-xs">
                                <span className="px-2.5 py-1 bg-slate-100 text-slate-700 font-bold rounded-md flex items-center gap-1">
                                  <Tag size={10} /> {kw.category || 'General'}
                                </span>
                                <span className="px-2.5 py-1 bg-slate-100 text-slate-700 font-bold rounded-md flex items-center gap-1">
                                  <MapPin size={10} /> {kw.city || 'Unknown'}
                                </span>
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <span className={`px-3 py-1 text-[10px] uppercase tracking-wider font-black rounded-full ${
                                kw.priority === 'High' ? 'bg-rose-100 text-rose-700 border border-rose-200' :
                                kw.priority === 'Medium' ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                                'bg-emerald-100 text-emerald-700 border border-emerald-200'
                              }`}>
                                {kw.priority}
                              </span>
                            </td>
                            <td className="py-4 px-6">
                              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50/50 px-3 py-1.5 rounded-lg w-fit border border-emerald-100">
                                <CheckCircle size={14} /> {kw.status}
                              </div>
                            </td>
                            <td className="py-4 px-6 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button onClick={() => handleEditClick(kw)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                  <Edit3 size={16} />
                                </button>
                                <button onClick={() => handleDeleteKeyword(kw.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
