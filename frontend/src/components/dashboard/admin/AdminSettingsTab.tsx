import React from 'react';
import { Menu } from 'lucide-react';

export default function AdminSettingsTab({ onOpenSidebar }: { onOpenSidebar: () => void }) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <button className="md:hidden p-1.5 text-slate-500 hover:bg-slate-100 rounded-lg mr-2" onClick={onOpenSidebar}>
              <Menu size={24} />
            </button>
            Platform Settings
          </h1>
          <p className="text-sm text-slate-500 mt-1">Configure global application preferences and rules.</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
          Save Changes
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
            <h2 className="text-base font-bold text-slate-900 mb-4">General Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Platform Name</label>
                <input type="text" defaultValue="BizDial" className="w-full border border-slate-200 rounded-lg px-4 py-2 text-sm outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Support Email</label>
                <input type="email" defaultValue="support@bizdial.com" className="w-full border border-slate-200 rounded-lg px-4 py-2 text-sm outline-none focus:border-blue-500" />
              </div>
            </div>
          </div>
          
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
            <h2 className="text-base font-bold text-slate-900 mb-4">Security Policies</h2>
            <div className="space-y-4">
              <label className="flex items-center gap-3">
                <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded border-slate-300" />
                <span className="text-sm text-slate-700 font-medium">Require Two-Factor Authentication for Admins</span>
              </label>
              <label className="flex items-center gap-3">
                <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded border-slate-300" />
                <span className="text-sm text-slate-700 font-medium">Enforce Password Changes every 90 Days</span>
              </label>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 h-fit">
          <h2 className="text-base font-bold text-slate-900 mb-4">Maintenance Mode</h2>
          <p className="text-sm text-slate-500 mb-4">Turn on maintenance mode to prevent users from accessing the platform during updates.</p>
          <button className="w-full py-2 bg-orange-100 text-orange-700 rounded-lg text-sm font-bold hover:bg-orange-200 transition-colors">
            Enable Maintenance Mode
          </button>
        </div>
      </div>
    </div>
  );
}
