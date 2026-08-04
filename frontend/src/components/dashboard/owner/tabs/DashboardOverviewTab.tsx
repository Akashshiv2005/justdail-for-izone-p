import React from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, Globe, Target, MessageCircle, Star, ArrowUpRight, ArrowRight, Megaphone 
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, 
  ResponsiveContainer
} from 'recharts';

interface OwnerProfile {
  business_id: number;
  owner_id: number;
  owner_name: string;
  owner_email: string;
  owner_phone: string;
  business_name: string;
  category: string;
  primary_category_id: number | null;
  subcategory: string;
  primary_subcategory_id: number | null;
  address: string;
  city: string;
  pincode: string;
  phone: string;
  whatsapp: string;
  website: string;
  is_verified: boolean;
  average_rating: number;
  total_reviews: number;
  latitude?: number;
  longitude?: number;
  logo_url?: string;
  cover_image_url?: string;
}

const profileActivityData = [
  { name: 'Mon', views: 4000, clicks: 2400 },
  { name: 'Tue', views: 3000, clicks: 1398 },
  { name: 'Wed', views: 2000, clicks: 9800 },
  { name: 'Thu', views: 2780, clicks: 3908 },
  { name: 'Fri', views: 1890, clicks: 4800 },
  { name: 'Sat', views: 2390, clicks: 3800 },
  { name: 'Sun', views: 3490, clicks: 4300 },
];

export default function DashboardOverviewTab({ profile }: { profile: OwnerProfile | null }) {
  return (
    <div className="p-4 sm:p-8 space-y-8 bg-slate-50/50 min-h-screen">
      {/* Welcome & Date with Rich Gradient */}
      <div 
        className="relative overflow-hidden rounded-3xl p-8 sm:p-10 shadow-2xl border border-white/10"
        style={{ 
          background: profile?.cover_image_url 
            ? `linear-gradient(to right, rgba(15, 23, 42, 0.9), rgba(15, 23, 42, 0.4)), url('http://localhost:8000${profile.cover_image_url}')` 
            : 'linear-gradient(to bottom right, #312E81, #1E3A8A, #0F172A)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight"
            >
              Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">{profile?.owner_name?.split(' ')[0] || 'Owner'}</span>! 
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-blue-100/80 text-sm sm:text-base mt-2 max-w-xl font-medium"
            >
              Here is what is happening with {profile?.business_name || 'your business'} today. Keep pushing those metrics!
            </motion.p>
          </div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-5 py-2.5 rounded-xl text-sm font-semibold text-white shadow-xl w-fit"
          >
            <Calendar className="w-4 h-4 text-blue-300" />
            <span>{new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', weekday: 'long' })}</span>
          </motion.div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Total Profile Views', value: '1,248', change: '+12%', color: 'from-blue-500 to-cyan-400', icon: Globe, shadow: 'shadow-blue-500/20' },
          { title: 'Leads Generated', value: '342', change: '+24%', color: 'from-emerald-500 to-teal-400', icon: Target, shadow: 'shadow-emerald-500/20' },
          { title: 'Customer Messages', value: '89', change: '+5%', color: 'from-amber-500 to-orange-400', icon: MessageCircle, shadow: 'shadow-amber-500/20' },
          { title: 'Profile Rating', value: '4.8', change: 'Top 5%', color: 'from-purple-500 to-pink-400', icon: Star, shadow: 'shadow-purple-500/20' },
        ].map((stat, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.1 }}
            key={i} 
            className="relative group bg-white p-6 rounded-3xl border border-slate-200/60 shadow-xl shadow-slate-200/40 hover:shadow-2xl transition-all duration-300 overflow-hidden"
          >
            <div className={`absolute -right-6 -top-6 w-24 h-24 bg-gradient-to-br ${stat.color} opacity-10 rounded-full group-hover:scale-150 transition-transform duration-500`}></div>
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-gradient-to-br ${stat.color} text-white shadow-lg ${stat.shadow}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                  <ArrowUpRight className="w-3 h-3" /> {stat.change}
                </span>
              </div>
              <div>
                <h3 className="text-3xl font-black text-slate-900 tracking-tight">{stat.value}</h3>
                <p className="text-sm font-semibold text-slate-500 mt-1">{stat.title}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/60 shadow-xl shadow-slate-200/40 overflow-hidden flex flex-col"
        >
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Profile Engagement</h3>
              <p className="text-sm text-slate-500 font-medium">Views vs Interactions over time</p>
            </div>
            <div className="flex bg-slate-100 p-1 rounded-xl w-fit">
              {['7D', '1M', '3M', '1Y'].map((range, idx) => (
                <button key={range} className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${idx === 0 ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                  {range}
                </button>
              ))}
            </div>
          </div>
          <div className="p-6 h-[350px] flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={profileActivityData}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94A3B8', fontWeight: 600 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94A3B8', fontWeight: 600 }} dx={-10} />
                <RechartsTooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)', padding: '12px 16px', fontWeight: 'bold' }}
                  cursor={{ stroke: '#CBD5E1', strokeWidth: 1, strokeDasharray: '4 4' }}
                />
                <Line type="monotone" dataKey="views" name="Profile Views" stroke="#3B82F6" strokeWidth={4} dot={{ r: 4, strokeWidth: 3, fill: '#fff' }} activeDot={{ r: 8, strokeWidth: 0 }} />
                <Line type="monotone" dataKey="clicks" name="Interactions" stroke="#F43F5E" strokeWidth={4} dot={{ r: 4, strokeWidth: 3, fill: '#fff' }} activeDot={{ r: 8, strokeWidth: 0 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Action Center */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-3xl border border-slate-200/60 shadow-xl shadow-slate-200/40 flex flex-col overflow-hidden"
        >
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Action Required</h3>
              <p className="text-sm text-slate-500 font-medium">Tasks needing attention</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold text-xs">
              3
            </div>
          </div>
          <div className="p-2 flex-1 overflow-y-auto">
            
            <div className="p-4 m-2 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 hover:shadow-md transition-all cursor-pointer group border border-blue-100/50">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shrink-0 shadow-lg shadow-blue-600/30 group-hover:scale-110 transition-transform">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-slate-900">3 New Customer Inquiries</p>
                  <p className="text-xs font-medium text-slate-600 mt-1 leading-relaxed">Respond quickly to convert them to sales.</p>
                  <button className="mt-3 text-xs font-bold text-blue-600 flex items-center gap-1 group-hover:gap-2 transition-all">Reply Now <ArrowRight className="w-3 h-3" /></button>
                </div>
              </div>
            </div>

            <div className="p-4 m-2 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 hover:shadow-md transition-all cursor-pointer group border border-amber-100/50">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/30 group-hover:scale-110 transition-transform">
                  <Star className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-slate-900">2 New Reviews</p>
                  <p className="text-xs font-medium text-slate-600 mt-1 leading-relaxed">Acknowledge reviews to build trust.</p>
                  <button className="mt-3 text-xs font-bold text-amber-600 flex items-center gap-1 group-hover:gap-2 transition-all">View Reviews <ArrowRight className="w-3 h-3" /></button>
                </div>
              </div>
            </div>

            <div className="p-4 m-2 rounded-2xl bg-gradient-to-r from-purple-50 to-pink-50 hover:shadow-md transition-all cursor-pointer group border border-purple-100/50">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center shrink-0 shadow-lg shadow-purple-600/30 group-hover:scale-110 transition-transform">
                  <Megaphone className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-slate-900">Boost Your Visibility</p>
                  <p className="text-xs font-medium text-slate-600 mt-1 leading-relaxed">Run an ad campaign for the upcoming festival.</p>
                  <button className="mt-3 text-xs font-bold text-purple-600 flex items-center gap-1 group-hover:gap-2 transition-all">Start Campaign <ArrowRight className="w-3 h-3" /></button>
                </div>
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </div>
  );
}
