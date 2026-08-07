import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, Building2, Package, Briefcase, Image as ImageIcon, 
  Target, Star, BarChart, Settings, Headphones, LogOut, CheckCircle2, X, MessageSquarePlus, FileText
} from 'lucide-react';

interface OwnerProfile {
  business_name?: string;
  is_verified?: boolean;
}

const navItems = [
  { name: 'Dashboard', icon: LayoutDashboard },
  { name: 'My Business', icon: Building2 },
  { name: 'Products & Services', icon: Briefcase },
  { name: 'Gallery', icon: ImageIcon },
  { name: 'Leads', icon: Target },
  { name: 'Reviews', icon: Star },
  { name: 'Analytics', icon: BarChart },
  { name: 'Documents', icon: FileText },
  { name: 'Settings', icon: Settings },
  { name: 'Support', icon: Headphones },
  { name: 'Rate BizDial', icon: MessageSquarePlus, highlight: true },
];

export default function OwnerSidebar({ 
  profile, 
  activeTab, 
  setActiveTab, 
  isSidebarOpen, 
  setIsSidebarOpen 
}: { 
  profile: OwnerProfile | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
}) {
  return (
    <>
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/50 z-40 md:hidden backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`w-[280px] bg-white border-r border-slate-200 flex flex-col h-screen overflow-y-auto shrink-0 shadow-xl md:shadow-sm fixed md:relative z-50 transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>

        {/* Profile Card */}
        <div className="p-4 pt-6 shrink-0 flex items-center justify-between md:block">
          <div className="bg-[#0B1C47] rounded-xl p-4 text-white relative overflow-hidden shadow-md flex-1 md:flex-none">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center shrink-0 border-2 border-white/20">
                <span className="font-bold text-sm">{(profile?.business_name || 'SM').slice(0, 2).toUpperCase()}</span>
              </div>
              <div>
                <h3 className="font-semibold text-sm leading-tight text-white/90">{profile?.business_name || 'Business Owner'}</h3>
                <div className="flex items-center gap-1 mt-1 bg-green-500/20 text-green-400 w-fit px-1.5 py-0.5 rounded text-[10px] font-bold border border-green-500/30">
                  <CheckCircle2 className="w-3 h-3" />
                  {profile?.is_verified ? 'Verified' : 'Pending'}
                </div>
              </div>
            </div>
          </div>
          <button className="md:hidden ml-4 p-2 text-slate-500 hover:bg-slate-100 rounded-lg shrink-0" onClick={() => setIsSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto pb-6 custom-scrollbar">
          {navItems.map((item) => (
            <button
              key={item.name}
              onClick={() => { setActiveTab(item.name); setIsSidebarOpen(false); }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === item.name
                  ? item.highlight
                    ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-purple-500/30'
                    : 'bg-blue-50 text-blue-700'
                  : item.highlight
                    ? 'bg-gradient-to-r from-violet-50 to-purple-50 text-violet-700 border border-violet-100 hover:from-violet-100 hover:to-purple-100'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon className={`w-4 h-4 ${
                  activeTab === item.name
                    ? item.highlight ? 'text-white' : 'text-blue-600'
                    : item.highlight ? 'text-violet-500' : 'text-slate-400'
                }`} />
                {item.name}
              </div>
            </button>
          ))}
          
          <div className="pt-4 mt-4 border-t border-slate-100">
            <Link to="/" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-red-600 transition-colors">
              <LogOut className="w-4 h-4 text-slate-400" />
              Logout
            </Link>
          </div>
        </nav>
      </aside>
    </>
  );
}
