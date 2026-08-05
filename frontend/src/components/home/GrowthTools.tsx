import React from 'react';
import { ArrowRight, BarChart3, Users, Rocket, Headphones } from 'lucide-react';
import { Link } from 'react-router-dom';

const GrowthTools = () => {
  return (
    <section className="py-24 bg-gradient-to-br from-[#FAFBFF] to-white relative overflow-hidden">
      {/* Floating decorative elements */}
      <div className="absolute top-20 left-[10%] w-12 h-12 bg-blue-500 rounded-full opacity-80 mix-blend-multiply blur-sm shadow-xl shadow-blue-500/50"></div>
      <div className="absolute bottom-40 right-[45%] w-6 h-6 bg-purple-500 rounded-full opacity-80 mix-blend-multiply blur-[2px] shadow-lg shadow-purple-500/50"></div>
      <div className="absolute top-[40%] right-10 w-[400px] h-[400px] bg-orange-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>
      
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 relative z-10 flex flex-col lg:flex-row items-center gap-16">
        
        {/* Left Side - The Dashboard Blob */}
        <div className="flex-1 relative w-full max-w-lg mx-auto lg:max-w-none perspective-1000">
          <div className="absolute -top-10 -left-10 w-full h-full bg-blue-50 rounded-[40%_60%_70%_30%/40%_50%_60%_50%] z-0 blur-3xl opacity-60"></div>
          
          <div className="relative z-10 bg-[#0B1121] rounded-[6rem_12rem_10rem_6rem] w-[500px] h-[550px] shadow-2xl overflow-hidden flex items-center justify-center p-8 transform rotate-y-[5deg] rotate-x-[5deg]">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2000&auto=format&fit=crop')] opacity-30 mix-blend-overlay"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 to-transparent mix-blend-overlay"></div>
            
            {/* Fake Dashboard UI */}
            <div className="relative w-full h-full bg-[#1A2235]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col scale-[0.85] -ml-8 -mt-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h4 className="text-white font-bold text-sm">Business Growth</h4>
                  <p className="text-slate-400 text-[10px]">Overview</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500"></div>
              </div>
              
              {/* Fake Graph */}
              <div className="flex-1 w-full bg-gradient-to-b from-blue-500/10 to-transparent border-b border-blue-500/30 rounded-xl relative overflow-hidden mb-6 flex items-end">
                <svg className="w-full h-24" viewBox="0 0 100 30" preserveAspectRatio="none">
                  <path d="M0,30 L0,20 C10,25 20,10 30,15 C40,20 50,5 60,10 C70,15 80,0 90,5 L100,2 L100,30 Z" fill="url(#blue-grad)" opacity="0.2"/>
                  <path d="M0,20 C10,25 20,10 30,15 C40,20 50,5 60,10 C70,15 80,0 90,5 L100,2" fill="none" stroke="#3b82f6" strokeWidth="1.5"/>
                  <defs>
                    <linearGradient id="blue-grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6"/>
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity="0"/>
                    </linearGradient>
                  </defs>
                </svg>
                {/* Data points */}
                <div className="absolute top-[30%] left-[20%] w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_8px_2px_rgba(59,130,246,0.8)]"></div>
                <div className="absolute top-[10%] left-[50%] w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_8px_2px_rgba(59,130,246,0.8)]"></div>
                <div className="absolute top-[-5%] left-[90%] w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_8px_2px_rgba(59,130,246,0.8)]"></div>
              </div>
              
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                  <p className="text-slate-400 text-[10px] mb-1">Revenue</p>
                  <p className="text-white font-bold text-sm">$24,550</p>
                  <p className="text-emerald-400 text-[8px] mt-1">↑ 12%</p>
                </div>
                <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                  <p className="text-slate-400 text-[10px] mb-1">Leads</p>
                  <p className="text-white font-bold text-sm">1,250</p>
                  <p className="text-emerald-400 text-[8px] mt-1">↑ 8%</p>
                </div>
                <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                  <p className="text-slate-400 text-[10px] mb-1">Conversion</p>
                  <p className="text-white font-bold text-sm">15%</p>
                  <p className="text-emerald-400 text-[8px] mt-1">↑ 2%</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Floating Badge */}
          <div className="absolute -bottom-6 -left-12 bg-white rounded-2xl p-4 pr-10 shadow-2xl flex items-center gap-4 z-20 border border-slate-100">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-blue-600/30">
              <Rocket size={20} />
            </div>
            <div>
              <p className="font-black text-slate-900 text-sm leading-tight">Grow Smarter.<br/>Scale Faster.</p>
              <div className="w-6 h-0.5 bg-blue-600 mt-1"></div>
            </div>
          </div>
        </div>
        
        {/* Right Side - Features Content */}
        <div className="flex-1 w-full max-w-xl mx-auto lg:max-w-none">
          <div className="mb-2">
            <span className="text-[10px] font-bold text-purple-600 uppercase tracking-[0.2em]">ALL-IN-ONE PLATFORM</span>
          </div>
          <h2 className="text-4xl lg:text-[44px] font-black text-[#0B1121] leading-[1.15] mb-6">
            Powerful Growth<br/>Tools for Your Business
          </h2>
          <p className="text-slate-500 text-base font-medium mb-12 max-w-md">
            Everything you need to grow your business and reach the right audience.
          </p>

          <div className="relative">
            {/* Connecting dotted lines in background */}
            <svg className="absolute inset-0 w-full h-full -z-10" style={{ pointerEvents: 'none' }}>
              <path d="M 120 40 Q 200 40, 250 80 T 350 120" fill="none" stroke="#e2e8f0" strokeWidth="2" strokeDasharray="4 4" />
              <path d="M 120 160 Q 200 160, 250 120 T 350 120" fill="none" stroke="#e2e8f0" strokeWidth="2" strokeDasharray="4 4" />
            </svg>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Feature 1 */}
              <div className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100/60 hover:-translate-y-1 transition-transform relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center text-white mb-4 shadow-lg shadow-purple-500/30">
                  <BarChart3 size={18} />
                </div>
                <h3 className="font-bold text-slate-900 text-[15px] mb-2">Business Dashboard</h3>
                <p className="text-xs text-slate-500 font-medium">Manage your profile, leads & performance.</p>
              </div>

              {/* Feature 2 */}
              <div className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100/60 hover:-translate-y-1 transition-transform relative overflow-hidden group mt-4 md:mt-12">
                 <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center text-white mb-4 shadow-lg shadow-orange-500/30">
                  <Users size={18} />
                </div>
                <h3 className="font-bold text-slate-900 text-[15px] mb-2">Customer Insights</h3>
                <p className="text-xs text-slate-500 font-medium">Understand your customers better.</p>
              </div>

              {/* Feature 3 */}
              <div className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100/60 hover:-translate-y-1 transition-transform relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center text-white mb-4 shadow-lg shadow-blue-500/30">
                  <Rocket size={18} />
                </div>
                <h3 className="font-bold text-slate-900 text-[15px] mb-2">Marketing Solutions</h3>
                <p className="text-xs text-slate-500 font-medium">Promote your business with smart marketing.</p>
              </div>

              {/* Feature 4 */}
              <div className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100/60 hover:-translate-y-1 transition-transform relative overflow-hidden group mt-4 md:mt-12">
                 <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center text-white mb-4 shadow-lg shadow-indigo-500/30">
                  <Headphones size={18} />
                </div>
                <h3 className="font-bold text-slate-900 text-[15px] mb-2">Dedicated Support</h3>
                <p className="text-xs text-slate-500 font-medium">Get help from our expert support team.</p>
                <div className="w-6 h-0.5 bg-indigo-500 mt-4"></div>
              </div>
            </div>
          </div>
          
          <div className="mt-12">
            <Link to="/register" className="inline-flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 rounded-full shadow-lg shadow-blue-600/30 transition-all hover:scale-105 group text-sm">
              <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center"><ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" /></div>
              List Your Business Now →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GrowthTools;
