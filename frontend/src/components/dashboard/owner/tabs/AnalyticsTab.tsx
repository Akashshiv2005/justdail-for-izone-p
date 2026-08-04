import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, BarChart as RechartsBarChart, Bar, Legend
} from 'recharts';

export default function AnalyticsTab() {
  const [loading, setLoading] = useState(true);
  const [weeklyData, setWeeklyData] = useState<any[]>([]);
  const [sourceData, setSourceData] = useState<any[]>([]);
  const [kpiData, setKpiData] = useState<any[]>([]);

  useEffect(() => {
    // Simulate fetching dynamic data, default to 0s for now as requested
    setTimeout(() => {
      setWeeklyData([
        { name: 'Mon', views: 0, clicks: 0, leads: 0 },
        { name: 'Tue', views: 0, clicks: 0, leads: 0 },
        { name: 'Wed', views: 0, clicks: 0, leads: 0 },
        { name: 'Thu', views: 0, clicks: 0, leads: 0 },
        { name: 'Fri', views: 0, clicks: 0, leads: 0 },
        { name: 'Sat', views: 0, clicks: 0, leads: 0 },
        { name: 'Sun', views: 0, clicks: 0, leads: 0 },
      ]);
      setSourceData([
        { name: 'Organic Search', value: 0, color: '#3B82F6' },
        { name: 'Direct Traffic', value: 0, color: '#F59E0B' },
        { name: 'Social Media', value: 0, color: '#10B981' },
        { name: 'Referrals', value: 0, color: '#8B5CF6' },
      ]);
      setKpiData([
        { label: 'Total Visitors', val: '0', prev: '0', change: '0%' },
        { label: 'Click Through Rate', val: '0%', prev: '0%', change: '0%' },
        { label: 'Lead Conversion', val: '0%', prev: '0%', change: '0%' },
        { label: 'Avg Time on Profile', val: '0m 0s', prev: '0m 0s', change: '0%' },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="p-4 sm:p-8"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Analytics Overview</h2>
          <p className="text-sm text-slate-500 mt-1">Detailed breakdown of your profile performance.</p>
        </div>
        <select className="bg-white border border-slate-200 text-sm font-medium rounded-lg px-4 py-2 outline-none shadow-sm">
          <option>Last 7 Days</option>
          <option>Last 30 Days</option>
          <option>This Year</option>
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64 text-slate-500">Loading dynamic data...</div>
      ) : (
        <>
          {/* Top KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {kpiData.map((kpi, i) => (
              <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                <p className="text-sm font-bold text-slate-500">{kpi.label}</p>
                <div className="mt-4 flex items-end justify-between">
                  <div>
                    <h3 className="text-2xl font-black text-slate-900">{kpi.val}</h3>
                    <p className="text-xs text-slate-400 mt-1">vs {kpi.prev} prev</p>
                  </div>
                  <span className="bg-slate-100 text-slate-500 font-bold text-xs px-2 py-1 rounded-md mb-1">{kpi.change}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Bar Chart */}
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-900 mb-6">Traffic & Engagement (Weekly)</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart data={weeklyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} dx={-10} />
                    <RechartsTooltip cursor={{ fill: '#F1F5F9' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '12px' }} />
                    <Bar dataKey="views" name="Profile Views" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="clicks" name="Interactions" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Traffic Sources Pie Chart */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
              <h3 className="font-bold text-slate-900 mb-2">Traffic Sources</h3>
              <p className="text-xs text-slate-500 mb-6">Where your customers are coming from</p>
              <div className="h-[220px] flex-1">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={sourceData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {sourceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 space-y-3">
                {sourceData.map((src, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: src.color }}></div>
                      <span className="font-medium text-slate-600">{src.name}</span>
                    </div>
                    <span className="font-bold text-slate-900">{src.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
}
