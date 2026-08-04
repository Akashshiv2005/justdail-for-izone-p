import React from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, Users, IndianRupee, PhoneCall, Star, Crown, 
  MoreVertical, CheckCircle2, Menu 
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { authFetch } from '../../../lib/services/authFetch';

// Static definitions replaced with dynamic data from API
export default function AdminDashboardTab({ onOpenSidebar }: { onOpenSidebar: () => void }) {
  const [registrations, setRegistrations] = React.useState<any[]>([]);
  const [stats, setStats] = React.useState<any>(null);
  const [selectedReg, setSelectedReg] = React.useState<any>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  React.useEffect(() => {
    authFetch('/api/admin/registrations')
      .then((res: any) => res.json())
      .then((data: any) => {
        if (Array.isArray(data)) setRegistrations(data);
        else console.error('Registrations API returned non-array:', data);
      })
      .catch(console.error);

    authFetch('/api/admin/stats')
      .then((res: any) => res.json())
      .then((data: any) => setStats(data))
      .catch(console.error);
  }, []);

  const handleVerify = async (id: number, newStatus: string) => {
    try {
      const action = newStatus === 'Verified' ? 'approve' : 'reject';
      await authFetch(`/api/admin/business/${id}/${action}`, { method: 'POST' });
      setRegistrations(prev => prev.map(reg => reg.id === id ? { ...reg, status: newStatus, approval_status: newStatus === 'Verified' ? 'Approved' : 'Rejected' } : reg));
    } catch (err) {
      console.error('Failed to update business status:', err);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <button className="md:hidden p-1.5 text-slate-500 hover:bg-slate-100 rounded-lg mr-2" onClick={onOpenSidebar}>
              <Menu size={24} />
            </button>
            Welcome back, Admin! 
          </h1>
          <p className="text-sm text-slate-500 mt-1">Here's what's happening with your platform today.</p>
        </div>
        <div className="bg-white border border-slate-200 px-4 py-2 rounded-lg text-sm font-medium text-slate-600 shadow-sm w-fit">
          22 July 2026, Wednesday 
        </div>
      </div>

      {/* Metrics Grid */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4"
      >
        {[
          { title: "Total Businesses", value: stats && stats.total_businesses !== undefined ? stats.total_businesses.toLocaleString() : "...", change: "+ 152 today", icon: Building2, border: "border-blue-500", bg: "bg-blue-100", text: "text-blue-600", lightBg: "bg-blue-50" },
          { title: "Total Users", value: stats && stats.total_users !== undefined ? stats.total_users.toLocaleString() : "...", change: "+ 420 today", icon: Users, border: "border-green-500", bg: "bg-green-100", text: "text-green-600", lightBg: "bg-green-50" },
          { title: "Total Revenue", value: stats && stats.total_revenue !== undefined ? `₹${stats.total_revenue.toLocaleString()}` : "...", change: "+ 8% this month", icon: IndianRupee, border: "border-purple-500", bg: "bg-purple-100", text: "text-purple-600", lightBg: "bg-purple-50" },
          { title: "Total Leads", value: stats && stats.total_leads !== undefined ? stats.total_leads.toLocaleString() : "...", change: "+ 68 today", icon: PhoneCall, border: "border-orange-500", bg: "bg-orange-100", text: "text-orange-600", lightBg: "bg-orange-50" },
          { title: "Total Reviews", value: stats && stats.total_reviews !== undefined ? stats.total_reviews.toLocaleString() : "...", change: "+ 354 today", icon: Star, border: "border-teal-500", bg: "bg-teal-100", text: "text-teal-600", lightBg: "bg-teal-50" },
          { title: "Premium Listings", value: stats && stats.premium_listings !== undefined ? stats.premium_listings.toLocaleString() : "...", change: "+ 95 this month", icon: Crown, border: "border-pink-500", bg: "bg-pink-100", text: "text-pink-600", lightBg: "bg-pink-50" },
        ].map((metric, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ scale: 1.05, translateY: -5 }}
            className={`bg-white rounded-2xl p-5 border-b-4 ${metric.border} shadow-sm hover:shadow-xl transition-all cursor-pointer relative overflow-hidden group`}
          >
            <div className={`absolute -right-4 -top-4 w-20 h-20 ${metric.lightBg} rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500`}></div>
            <div className="flex flex-col gap-3 relative z-10">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${metric.bg} ${metric.text}`}>
                <metric.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-500 mb-1 uppercase tracking-wider">{metric.title}</p>
                <h3 className="text-2xl font-black text-slate-900">{metric.value}</h3>
                <div className="flex items-center gap-1 mt-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-50 text-green-600`}>
                    {metric.change}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Middle Charts Section */}
      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Growth Chart */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-base font-bold text-slate-900">Business & User Growth</h2>
            <select className="text-sm border-slate-200 rounded-md bg-slate-50 py-1.5 pl-3 pr-8 outline-none">
              <option>This Month</option>
              <option>Last Month</option>
            </select>
          </div>
          <div className="flex items-center gap-6 mb-6">
            <div className="flex items-center gap-2 text-sm font-medium"><div className="w-4 h-2 bg-blue-600 rounded"></div> Businesses</div>
            <div className="flex items-center gap-2 text-sm font-medium"><div className="w-4 h-2 bg-orange-500 rounded"></div> Users</div>
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats?.growth_data || []}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12}} tickFormatter={(value) => `${value/1000}K`} />
                <RechartsTooltip />
                <Line type="monotone" dataKey="Businesses" stroke="#0B5FFF" strokeWidth={3} dot={false} />
                <Line type="monotone" dataKey="Users" stroke="#F97316" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-100">
            <div>
              <p className="text-xs font-medium text-slate-500 mb-1">Businesses Added</p>
              <div className="flex items-end gap-2">
                <span className="text-xl font-bold text-slate-900">1,245</span>
                <span className="text-xs font-medium text-green-600 mb-1">↑ 18.5%</span>
              </div>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 mb-1">Users Added</p>
              <div className="flex items-end gap-2">
                <span className="text-xl font-bold text-slate-900">8,542</span>
                <span className="text-xs font-medium text-green-600 mb-1">↑ 22.6%</span>
              </div>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 mb-1">Premium Businesses</p>
              <div className="flex items-end gap-2">
                <span className="text-xl font-bold text-slate-900">325</span>
                <span className="text-xs font-medium text-green-600 mb-1">↑ 15.3%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Categories Pie Chart */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 flex flex-col">
          <h2 className="text-base font-bold text-slate-900 mb-6">Top Categories</h2>
          <div className="flex-1 flex flex-col items-center justify-center relative">
            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={stats?.category_data || []} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={2} dataKey="value" stroke="none">
                    {(stats?.category_data || []).map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-2">
              <span className="text-xs text-slate-500 font-medium">Total</span>
              <span className="text-lg font-bold text-slate-900">58,423</span>
            </div>
          </div>
          <div className="mt-4 space-y-3">
            {(stats?.category_data || []).map((cat: any, i: number) => (
              <div key={i} className="flex items-center justify-between text-xs font-medium">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }}></div>
                  <span className="text-slate-600">{cat.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-900">{cat.value.toLocaleString()}</span>
                  <span className="text-slate-400">({((cat.value / (stats?.total_businesses || 1)) * 100).toFixed(1)}%)</span>
                </div>
              </div>
            ))}
          </div>
          <button className="text-blue-600 text-xs font-semibold mt-6 text-center w-full hover:underline">View all categories →</button>
        </div>

      </div>

      {/* Bottom Section */}
      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Recent Activities */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-base font-bold text-slate-900">Recent Activities</h2>
            <button className="text-blue-600 text-xs font-semibold hover:underline">View All</button>
          </div>
          <div className="space-y-6">
            {(stats?.recent_activities || []).map((act: any) => (
              <div key={act.id} className="flex items-start gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${act.bg} ${act.color}`}>
                  <act.icon className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-800 leading-snug">{act.title}</p>
                </div>
                <span className="text-[11px] font-medium text-slate-400 shrink-0 mt-0.5">{act.time}</span>
              </div>
            ))}
            {(!stats?.recent_activities || stats.recent_activities.length === 0) && (
              <div className="text-sm text-slate-500 text-center py-4">No recent activities</div>
            )}
          </div>
        </div>

        {/* Data Table */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 overflow-hidden">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-base font-bold text-slate-900">Recent Business Registrations</h2>
              <button className="text-blue-600 text-xs font-semibold hover:underline">View All</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-500">
                    <th className="pb-3 font-medium">Business Name</th>
                    <th className="pb-3 font-medium">Owner Name</th>
                    <th className="pb-3 font-medium">Category</th>
                    <th className="pb-3 font-medium">City</th>
                    <th className="pb-3 font-medium">Primary Contact</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {registrations.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-4 font-semibold text-slate-900 flex items-center gap-3">
                        <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-xl shrink-0">🏢</div>
                        {row.business}
                      </td>
                      <td className="py-4 text-slate-600">{row.owner}</td>
                      <td className="py-4 text-slate-600">{row.category}</td>
                      <td className="py-4 text-slate-600">{row.city}</td>
                      <td className="py-4 text-slate-600 font-medium">{row.primary_contact || '-'}</td>
                      <td className="py-4">
                        <span className={`px-2.5 py-1 text-[11px] font-bold rounded-full ${
                          row.status === 'Verified' ? 'bg-green-100 text-green-700' :
                          row.status === 'Premium' ? 'bg-blue-100 text-blue-700' :
                          'bg-orange-100 text-orange-700'
                        }`}>
                          {row.status}
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        {row.status === 'Pending' ? (
                          <button 
                            onClick={() => { setSelectedReg(row); setIsModalOpen(true); }}
                            className="text-xs font-semibold text-blue-600 hover:underline">
                            Review
                          </button>
                        ) : (
                          <button className="p-1.5 text-slate-400 hover:bg-slate-100 rounded transition-colors"><MoreVertical className="w-4 h-4" /></button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>

      {isModalOpen && selectedReg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Verify Registration</h3>
            <div className="space-y-3 mb-6 text-sm">
              <p><span className="font-semibold text-slate-700">Business:</span> {selectedReg.business}</p>
              <p><span className="font-semibold text-slate-700">Owner:</span> {selectedReg.owner}</p>
              <p><span className="font-semibold text-slate-700">Category:</span> {selectedReg.category}</p>
              <p><span className="font-semibold text-slate-700">City:</span> {selectedReg.city}</p>
              <p><span className="font-semibold text-slate-700">Primary Contact:</span> {selectedReg.primary_contact || '-'}</p>
              <p><span className="font-semibold text-slate-700">Secondary Contact:</span> {selectedReg.secondary_contact || '-'}</p>
              <p><span className="font-semibold text-slate-700">Website / Notes:</span> {selectedReg.website || '-'}</p>
              <p><span className="font-semibold text-slate-700">Approval Status:</span> {selectedReg.approval_status || selectedReg.status}</p>
              <p><span className="font-semibold text-slate-700">Description:</span> {selectedReg.description || '-'}</p>
              <p>
                <span className="font-semibold text-slate-700">Document:</span>{' '}
                {selectedReg.document ? (
                  <a href={`${selectedReg.document}`} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                    View Document
                  </a>
                ) : '-'}
              </p>
            </div>
            <div className="flex gap-3 justify-end">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-50 rounded-lg transition-colors mr-auto">
                Cancel
              </button>
              <button 
                onClick={() => handleVerify(selectedReg.id, 'Suspended')}
                className="px-4 py-2 bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-100 transition-colors">
                Reject
              </button>
              <button 
                onClick={() => handleVerify(selectedReg.id, 'Verified')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                Approve
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
