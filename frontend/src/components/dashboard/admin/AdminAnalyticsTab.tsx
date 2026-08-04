import React from 'react';
import { Menu } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function AdminAnalyticsTab({ onOpenSidebar }: { onOpenSidebar: () => void }) {
  const trafficData = [
    { name: 'Mon', Direct: 4000, Organic: 2400, Paid: 2400 },
    { name: 'Tue', Direct: 3000, Organic: 1398, Paid: 2210 },
    { name: 'Wed', Direct: 2000, Organic: 9800, Paid: 2290 },
    { name: 'Thu', Direct: 2780, Organic: 3908, Paid: 2000 },
    { name: 'Fri', Direct: 1890, Organic: 4800, Paid: 2181 },
    { name: 'Sat', Direct: 2390, Organic: 3800, Paid: 2500 },
    { name: 'Sun', Direct: 3490, Organic: 4300, Paid: 2100 },
  ];

  const deviceData = [
    { name: 'Mobile', value: 75, color: '#0B5FFF' },
    { name: 'Desktop', value: 20, color: '#F59E0B' },
    { name: 'Tablet', value: 5, color: '#22C55E' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <button className="md:hidden p-1.5 text-slate-500 hover:bg-slate-100 rounded-lg mr-2" onClick={onOpenSidebar}>
              <Menu size={24} />
            </button>
            Analytics Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-1">Deep dive into platform traffic and user behavior.</p>
        </div>
        <div className="bg-white border border-slate-200 px-4 py-2 rounded-lg text-sm font-medium text-slate-600 shadow-sm">
          Last 7 Days
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Traffic Chart */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-base font-bold text-slate-900">Platform Traffic Sources</h2>
          </div>
          <div className="flex items-center gap-6 mb-6">
            <div className="flex items-center gap-2 text-sm font-medium"><div className="w-4 h-2 bg-blue-600 rounded"></div> Organic</div>
            <div className="flex items-center gap-2 text-sm font-medium"><div className="w-4 h-2 bg-orange-500 rounded"></div> Direct</div>
            <div className="flex items-center gap-2 text-sm font-medium"><div className="w-4 h-2 bg-green-500 rounded"></div> Paid</div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trafficData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12}} tickFormatter={(value) => `${value/1000}k`} />
                <RechartsTooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                  cursor={{stroke: '#E2E8F0', strokeWidth: 2}}
                />
                <Area type="monotone" dataKey="Organic" stackId="1" stroke="#0B5FFF" fill="#0B5FFF" fillOpacity={0.2} strokeWidth={2} />
                <Area type="monotone" dataKey="Direct" stackId="1" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.2} strokeWidth={2} />
                <Area type="monotone" dataKey="Paid" stackId="1" stroke="#22C55E" fill="#22C55E" fillOpacity={0.2} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Device Chart */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
          <h2 className="text-base font-bold text-slate-900 mb-6">Device Breakdown</h2>
          <div className="h-[250px] w-full mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={deviceData} innerRadius={70} outerRadius={100} paddingAngle={2} dataKey="value" stroke="none">
                  {deviceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-4">
            {deviceData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-sm font-medium text-slate-700">{item.name}</span>
                </div>
                <span className="text-sm font-bold text-slate-900">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
