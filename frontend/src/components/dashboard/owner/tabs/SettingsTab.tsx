import React, { useState } from 'react';
import { Bell, Lock, Globe, Shield, Save } from 'lucide-react';
import { motion } from 'framer-motion';
import { authFetch } from '../../../../lib/services/authFetch';

export default function SettingsTab({ profile }: { profile: any }) {
  const [activeSettingTab, setActiveSettingTab] = useState('notifications');
  const [settings, setSettings] = useState({
    emailAlerts: true,
    smsAlerts: false,
    publicProfile: true,
    twoFactorAuth: false,
  });

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handlePasswordUpdate = async () => {
    if (!currentPassword || !newPassword) {
      alert("Please enter both current and new passwords.");
      return;
    }
    
    try {
      const res = await authFetch(`/api/owner/${profile.business_id}/password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ current_password: currentPassword, new_password: newPassword })
      });
      
      const data = await res.json();
      if (res.ok) {
        alert(data.message || "Password updated successfully!");
        setCurrentPassword('');
        setNewPassword('');
      } else {
        alert(data.detail || "Failed to update password");
      }
    } catch (e) {
      console.error(e);
      alert("An error occurred while updating the password.");
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="p-4 sm:p-8 space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Account Settings</h2>
          <p className="text-slate-500 mt-1">Manage your preferences, security, and notifications.</p>
        </div>
        <button 
          onClick={() => alert("Settings saved successfully!")}
          className="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm"
        >
          <Save size={18} /> Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
        {/* Settings Navigation */}
        <div className="md:col-span-1 bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-2 space-y-1">
            <button
              onClick={() => setActiveSettingTab('notifications')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-colors ${
                activeSettingTab === 'notifications' 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Bell size={18} /> Notifications
            </button>
            <button
              onClick={() => setActiveSettingTab('security')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-colors ${
                activeSettingTab === 'security' 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Lock size={18} /> Security
            </button>
            <button
              onClick={() => setActiveSettingTab('privacy')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-colors ${
                activeSettingTab === 'privacy' 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Shield size={18} /> Privacy
            </button>
          </div>
        </div>

        {/* Settings Content */}
        <div className="md:col-span-3 space-y-6">
          {activeSettingTab === 'notifications' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Bell size={20} className="text-blue-600" /> Communication Preferences
              </h3>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-6 border-b border-slate-100">
                  <div>
                    <h4 className="font-semibold text-slate-800">Email Notifications</h4>
                    <p className="text-sm text-slate-500 mt-1">Receive daily digests and lead alerts via email.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={settings.emailAlerts} onChange={() => toggleSetting('emailAlerts')} />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-slate-800">SMS Alerts</h4>
                    <p className="text-sm text-slate-500 mt-1">Get instant text messages for urgent inquiries.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={settings.smsAlerts} onChange={() => toggleSetting('smsAlerts')} />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeSettingTab === 'security' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Lock size={20} className="text-blue-600" /> Account Security
              </h3>
              
              <div className="space-y-6">
                <div className="pb-6 border-b border-slate-100">
                  <h4 className="font-semibold text-slate-800 mb-4">Change Password</h4>
                  <div className="space-y-4 max-w-md">
                    <input 
                      type="password" 
                      placeholder="Current Password" 
                      value={currentPassword}
                      onChange={e => setCurrentPassword(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none text-sm" 
                    />
                    <input 
                      type="password" 
                      placeholder="New Password" 
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none text-sm" 
                    />
                    <button 
                      onClick={handlePasswordUpdate}
                      className="px-5 py-2.5 bg-slate-100 text-slate-700 font-medium rounded-xl hover:bg-slate-200 transition-colors text-sm"
                    >
                      Update Password
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-slate-800">Two-Factor Authentication</h4>
                    <p className="text-sm text-slate-500 mt-1">Add an extra layer of security to your account.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={settings.twoFactorAuth} onChange={() => toggleSetting('twoFactorAuth')} />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeSettingTab === 'privacy' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Shield size={20} className="text-blue-600" /> Privacy & Visibility
              </h3>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-6 border-b border-slate-100">
                  <div>
                    <h4 className="font-semibold text-slate-800">Public Profile Visibility</h4>
                    <p className="text-sm text-slate-500 mt-1">Allow customers to find your business in search results.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={settings.publicProfile} onChange={() => toggleSetting('publicProfile')} />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
