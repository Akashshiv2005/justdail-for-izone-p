import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, MessageCircle, Clock, Globe } from 'lucide-react';
import MapView from '../../../common/MapView';
import { authFetch } from '../../../../lib/services/authFetch';

export default function MyBusinessTab({ profile, businessId, refreshData }: any) {
  const [formData, setFormData] = useState({
    address: '',
    google_map_url: '',
    phone: '',
    whatsapp: ''
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData({
        address: `${profile.address || ''}${profile.pincode ? `, ${profile.pincode}` : ''}`,
        google_map_url: profile.google_map_url || '',
        phone: profile.phone || '',
        whatsapp: profile.whatsapp || ''
      });
    }
  }, [profile]);

  const handleChange = (e: any) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    if (!businessId) return;
    setIsSaving(true);
    try {
      const res = await authFetch(`/api/owner/${businessId}/profile/contact`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        if (refreshData) refreshData();
      }
    } catch (e) {
      console.error("Failed to save contact info", e);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="p-4 sm:p-8"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Store Profile & Contact</h2>
          <p className="text-sm text-slate-500 mt-1">Manage your store's public details, location, and customer contact options.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="shrink-0 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50"
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Fields */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2"><MapPin size={18} className="text-blue-600" /> Location Details</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Store Address</label>
                <textarea name="address" value={formData.address} onChange={handleChange} rows={3} className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-sm text-slate-600" placeholder="Address pending"></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Google Maps Link</label>
                <input type="url" name="google_map_url" value={formData.google_map_url} onChange={handleChange} placeholder="https://maps.google.com/..." className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 outline-none text-sm text-slate-600" />
              </div>
              <div className="h-64 rounded-lg overflow-hidden border border-slate-200 relative z-0">
                 {profile && profile.latitude && profile.longitude ? (
                   <MapView businesses={[profile]} />
                 ) : (
                   <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400">
                      <div className="flex flex-col items-center gap-2"><Globe size={24} /> <span>Location coordinates not available</span></div>
                   </div>
                 )}
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2"><Phone size={18} className="text-blue-600" /> Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Primary Phone Number</label>
                <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 outline-none text-sm text-slate-600" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">WhatsApp Number</label>
                <input type="text" name="whatsapp" value={formData.whatsapp} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 outline-none text-sm text-slate-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2"><Clock size={18} className="text-blue-600" /> Business Timings</h3>
            <div className="space-y-3">
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day, idx) => (
                <div key={day} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sm border-b border-slate-50 pb-2 last:border-0 last:pb-0">
                  <span className="font-medium text-slate-700 w-24">{day}</span>
                  <div className="flex items-center gap-2 flex-1">
                    <input type="time" defaultValue={idx === 6 ? "" : "09:00"} disabled={idx === 6} className={`border border-slate-200 rounded px-3 py-1 outline-none focus:border-blue-500 ${idx === 6 ? 'bg-slate-50 text-slate-400' : 'text-slate-600'}`} />
                    <span className="text-slate-400 font-medium">to</span>
                    <input type="time" defaultValue={idx === 6 ? "" : "21:00"} disabled={idx === 6} className={`border border-slate-200 rounded px-3 py-1 outline-none focus:border-blue-500 ${idx === 6 ? 'bg-slate-50 text-slate-400' : 'text-slate-600'}`} />
                  </div>
                  <div className="flex items-center gap-2 sm:justify-end">
                    <input type="checkbox" defaultChecked={idx !== 6} className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer" />
                    <span className={`text-xs font-bold ${idx === 6 ? 'text-red-500' : 'text-green-600'}`}>{idx === 6 ? 'Closed' : 'Open'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Customer Menu Preview */}
        <div className="space-y-6">
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
            <h3 className="font-semibold text-slate-900 mb-2">Customer Action Menu Preview</h3>
            <p className="text-xs text-slate-500 mb-6">This is what customers see when they visit your profile on mobile.</p>
            
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-slate-100">
              <div className="p-4 border-b border-slate-100">
                <h4 className="font-bold text-slate-900">{profile?.business_name || 'Business'}</h4>
                <p className="text-xs text-slate-500 mt-1"><MapPin size={12} className="inline mr-1" /> {formData.address || 'Address pending'}</p>
              </div>
              <div className="p-4 flex gap-3">
                <button className="flex-1 bg-blue-600 text-white rounded-lg py-2.5 flex flex-col items-center justify-center gap-1 hover:bg-blue-700 transition-colors">
                  <Phone size={18} />
                  <span className="text-xs font-medium">Call Now</span>
                </button>
                <button className="flex-1 bg-green-500 text-white rounded-lg py-2.5 flex flex-col items-center justify-center gap-1 hover:bg-green-600 transition-colors">
                  <MessageCircle size={18} />
                  <span className="text-xs font-medium">WhatsApp</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
