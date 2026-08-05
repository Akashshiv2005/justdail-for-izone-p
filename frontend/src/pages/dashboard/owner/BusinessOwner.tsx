import React, { useState } from 'react';
import ProductsTab from '../../../components/dashboard/owner/tabs/ProductsTab';
import ServicesTab from '../../../components/dashboard/owner/tabs/ServicesTab';
import MyBusinessTab from '../../../components/dashboard/owner/tabs/MyBusinessTab';
import GalleryTab from '../../../components/dashboard/owner/tabs/GalleryTab';
import OwnerSidebar from '../../../components/dashboard/owner/OwnerSidebar';
import AnalyticsTab from '../../../components/dashboard/owner/tabs/AnalyticsTab';
import DynamicDataTab from '../../../components/dashboard/owner/tabs/DynamicDataTab';
import DefaultTableTab from '../../../components/dashboard/owner/tabs/DefaultTableTab';
import DashboardOverviewTab from '../../../components/dashboard/owner/tabs/DashboardOverviewTab';
import MapView from '../../../components/common/MapView';
import { authFetch } from '../../../lib/services/authFetch';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Building2, Package, Briefcase, Image as ImageIcon, 
  Target, Star, BarChart, Tag, Users, CreditCard, Receipt, Settings, 
  Headphones, LogOut, Search, Bell, HelpCircle, ChevronDown, CheckCircle2, CheckCircle,
  TrendingUp, Phone, MessageCircle, MapPin, Globe, UserPlus, 
  ChevronRight, Megaphone, Plus, Menu, X, Clock, Calendar, ArrowUpRight, ArrowRight
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, BarChart as RechartsBarChart, Bar, Legend
} from 'recharts';
import { Link, useSearchParams } from 'react-router-dom';

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
// DynamicDataTab has been moved to its own component

export default function BusinessOwnerDashboard() {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const businessId = Number(searchParams.get('businessId') || '1');
  const [profile, setProfile] = useState<OwnerProfile | null>(null);

  React.useEffect(() => {
    authFetch(`/api/owner/${businessId}/profile`)
      .then((res) => res.json())
      .then((data) => setProfile(data && Object.keys(data).length ? data : null))
      .catch((err) => {
        console.error('Failed to fetch profile:', err);
        setProfile(null);
      });
  }, [businessId]);
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans overflow-hidden relative">
      <OwnerSidebar 
        profile={profile}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 shrink-0 z-10 shadow-sm relative">
          <div className="flex items-center gap-3 text-slate-900 font-medium text-lg">
            <button className="md:hidden p-1.5 text-slate-500 hover:bg-slate-100 rounded-lg" onClick={() => setIsSidebarOpen(true)}>
              <Menu size={20} />
            </button>
            <LayoutDashboard className="w-5 h-5 text-slate-400 hidden md:block" />
            <span className="hidden sm:inline-block">Dashboard</span>
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            <div className="relative hidden lg:block w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Search for businesses, owners, users..." 
                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-sm outline-none focus:border-blue-500 focus:bg-white transition-colors"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1 text-[10px] text-slate-400 font-medium">
                <span className="bg-white border border-slate-200 rounded px-1.5 py-0.5 shadow-sm">Ctrl</span>
                <span className="bg-white border border-slate-200 rounded px-1.5 py-0.5 shadow-sm">/</span>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-4 border-r border-slate-200 pr-4 sm:pr-6">
              <button className="hidden sm:flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700">
                <HelpCircle className="w-4 h-4" /> Help Center
              </button>
              <button className="relative p-2 text-slate-400 hover:bg-slate-50 rounded-full transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
            </div>

            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-200 overflow-hidden border border-slate-300 group-hover:border-blue-400 transition-colors shrink-0">
                <img src={profile?.logo_url ? `${import.meta.env.VITE_API_URL?.replace('/api', '') || ''}${profile.logo_url}` : "https://ui-avatars.com/api/?name=Rajesh+Kumar&background=0D8ABC&color=fff"} alt="User" className="w-full h-full object-cover" />
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-bold text-slate-900 leading-none">{profile?.owner_name || 'Owner'}</p>
                <p className="text-[11px] font-medium text-slate-500 mt-1">{profile?.category || 'Business Owner'}</p>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block" />
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'Dashboard' ? (
            <AnimatePresence mode="wait">
            <motion.div 
              key="dashboard"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
          
          {/* Yellow Banner */}
          <div className="bg-amber-50 border-b border-amber-100 px-4 sm:px-8 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-amber-800">
              <span className="shrink-0"></span> 
              <span>Your Premium Plan will expire on 15 Aug 2026. <Link to="#" className="text-blue-600 hover:underline">Renew Now &rarr;</Link></span>
            </div>
            <button className="bg-blue-600 text-white px-4 py-1.5 rounded text-sm font-bold shadow-sm hover:bg-blue-700 flex items-center justify-center gap-1 shrink-0">
              <Plus className="w-4 h-4" /> Add New <ChevronDown className="w-3 h-3 ml-1" />
            </button>
          </div>

          <DashboardOverviewTab profile={profile} />
          </motion.div>
          </AnimatePresence>
          ) : (
            <AnimatePresence mode="wait">
              <DynamicDataTab key={`${activeTab}-${businessId}`} tabName={activeTab} businessId={businessId} profile={profile} />
            </AnimatePresence>
          )}
        </div>
      </main>
    </div>
  );
}
