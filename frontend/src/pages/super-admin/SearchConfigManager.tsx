import React, { useState, useEffect } from 'react';
import { Search, Save, CheckCircle, Sliders, AlertCircle } from 'lucide-react';
import { authFetch } from '../../lib/services/authFetch';
import { motion } from 'framer-motion';

const BASE = '';

export default function SearchConfigManager({ onOpenSidebar }: { onOpenSidebar?: () => void }) {
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    authFetch(`${BASE}/api/admin/search/config`)
      .then(res => res.json())
      .then(data => {
        setConfig(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await authFetch(`${BASE}/api/admin/search/config`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (err) {
      console.error(err);
    }
    setSaving(false);
  };

  const handleChange = (field: string, value: string) => {
    setConfig({ ...config, [field]: parseFloat(value) || 0 });
  };

  if (loading) return <div className="p-12 text-center text-slate-500 font-bold">Loading Configuration...</div>;

  const totalWeight = 
    config.weight_distance + 
    config.weight_category_match + 
    config.weight_business_name + 
    config.weight_rating + 
    config.weight_reviews + 
    config.weight_verified + 
    config.weight_premium + 
    config.weight_profile_completion;

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Search className="text-blue-600" size={24} />
            Search Engine Configuration
          </h1>
          <p className="text-sm text-slate-500 mt-1">Configure the BizDial geospatial search algorithm and ranking weights.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-600 text-white font-bold px-6 py-2.5 rounded-xl hover:bg-blue-700 flex items-center gap-2 transition-colors disabled:opacity-50"
        >
          {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Save size={18} />}
          {saved ? 'Saved!' : 'Save Config'}
        </button>
      </div>

      {saved && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl flex items-center gap-2 font-semibold">
          <CheckCircle size={18} /> Configuration successfully updated!
        </motion.div>
      )}

      {totalWeight !== 100 && (
        <div className="bg-orange-50 border border-orange-200 text-orange-700 px-4 py-3 rounded-xl flex items-center gap-2 font-semibold text-sm">
          <AlertCircle size={18} /> Total weights sum to {totalWeight}. For best results, we recommend adjusting them to sum exactly to 100.
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radius Settings */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center gap-2 font-bold text-slate-900 mb-6 pb-4 border-b border-slate-100">
            <Sliders size={20} className="text-blue-600" /> Radius Settings
          </div>
          
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Default Search Radius (km)</label>
              <p className="text-xs text-slate-500 mb-3">Initial radius applied when a user detects their location.</p>
              <input 
                type="number" 
                value={config.default_radius_km} 
                onChange={e => handleChange('default_radius_km', e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-4 py-2 text-sm font-medium focus:border-blue-500 outline-none" 
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Maximum Fallback Radius (km)</label>
              <p className="text-xs text-slate-500 mb-3">If no results are found, the engine will automatically expand the radius up to this limit.</p>
              <input 
                type="number" 
                value={config.max_fallback_radius_km} 
                onChange={e => handleChange('max_fallback_radius_km', e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-4 py-2 text-sm font-medium focus:border-blue-500 outline-none" 
              />
            </div>
          </div>
        </div>

        {/* Ranking Weights */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm row-span-2">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <Sliders size={20} className="text-purple-600" /> Ranking Weights
            </div>
            <span className={`text-xs font-bold px-2 py-1 rounded-md ${totalWeight === 100 ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
              Total: {totalWeight} / 100
            </span>
          </div>

          <div className="space-y-6">
            {[
              { id: 'weight_distance', label: 'Distance Score', desc: 'Prioritize businesses closer to the user.' },
              { id: 'weight_category_match', label: 'Category Match', desc: 'Relevance score based on searched category.' },
              { id: 'weight_business_name', label: 'Business Name Match', desc: 'Relevance score based on exact name match.' },
              { id: 'weight_rating', label: 'Average Rating', desc: 'Prioritize highly rated businesses (out of 5).' },
              { id: 'weight_reviews', label: 'Total Reviews', desc: 'Score based on review volume (caps at 500).' },
              { id: 'weight_verified', label: 'Verified Status', desc: 'Bonus points for Verified businesses.' },
              { id: 'weight_premium', label: 'Premium Status', desc: 'Bonus points for Premium listings.' },
              { id: 'weight_profile_completion', label: 'Profile Completion', desc: 'Score based on filled details (logo, hours, etc).' },
            ].map(w => (
              <div key={w.id}>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-sm font-semibold text-slate-800">{w.label}</label>
                  <span className="text-sm font-bold text-blue-600">{config[w.id]}</span>
                </div>
                <p className="text-xs text-slate-500 mb-2">{w.desc}</p>
                <input 
                  type="range" 
                  min="0" max="100" 
                  value={config[w.id]} 
                  onChange={e => handleChange(w.id, e.target.value)}
                  className="w-full accent-blue-600 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer" 
                />
              </div>
            ))}
          </div>
        </div>

        {/* Algorithm Summary */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-6">
          <h3 className="font-bold text-slate-900 mb-2">How Ranking Works</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            The BizDial search engine calculates a composite score for every matching business using the formula:
            <br/><br/>
            <code className="bg-white px-2 py-1 rounded border border-blue-200 text-blue-700 block text-xs font-mono mb-3">
              Score = (Distance_Score * W) + (Relevance * W) + ...
            </code>
            Businesses are then sorted in descending order of this score. 
            If a user enters a custom location (e.g., searches for a city they are not currently in), distance is calculated relative to the exact center coordinates of that specific city or area.
          </p>
        </div>
      </div>
    </div>
  );
}
