import React, { useState } from 'react';
import ProductsAndServicesTab from '../../../components/dashboard/owner/tabs/ProductsAndServicesTab';
import DocumentsTab from '../../../components/dashboard/owner/tabs/DocumentsTab';
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
  const [stats, setStats] = useState<any>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [helpSubject, setHelpSubject] = useState('');
  const [helpMessage, setHelpMessage] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  
  const TABS = ['Dashboard', 'My Business', 'Products & Services', 'Gallery', 'Leads', 'Reviews', 'Analytics', 'Settings', 'Support', 'Rate BizDial'];
  const filteredTabs = TABS.filter(tab => tab.toLowerCase().includes(searchQuery.toLowerCase()));

  React.useEffect(() => {
    authFetch(`/api/owner/${businessId}/profile`)
      .then((res) => res.json())
      .then((data) => setProfile(data && Object.keys(data).length ? data : null))
      .catch((err) => {
        console.error('Failed to fetch profile:', err);
        setProfile(null);
      });
      
    authFetch(`/api/owner/${businessId}/stats`)
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch(console.error);
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
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 shrink-0 z-50 shadow-sm relative">
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
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearchDropdown(true);
                }}
                onFocus={() => setShowSearchDropdown(true)}
                onBlur={() => setTimeout(() => setShowSearchDropdown(false), 200)}
                placeholder="Search for settings, tabs, features..." 
                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-sm outline-none focus:border-blue-500 focus:bg-white transition-colors"
              />
              {showSearchDropdown && searchQuery && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-50 py-1">
                  {filteredTabs.length > 0 ? (
                    filteredTabs.map(tab => (
                      <div 
                        key={tab} 
                        className="px-4 py-2 hover:bg-blue-50 text-sm cursor-pointer text-slate-700"
                        onMouseDown={(e) => { e.preventDefault(); setActiveTab(tab); setShowSearchDropdown(false); setSearchQuery(''); }}
                      >
                        {tab}
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-sm text-slate-500">No results found</div>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 sm:gap-4 border-r border-slate-200 pr-4 sm:pr-6">
              <button 
                onClick={() => setShowHelpModal(true)}
                className="hidden sm:flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                <HelpCircle className="w-4 h-4" /> Help Center
              </button>
              <div className="relative">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 text-slate-400 hover:bg-slate-50 rounded-full transition-colors"
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>
                {showNotifications && (
                  <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 z-50 py-2">
                    <div className="px-4 py-2 border-b border-slate-100 font-bold text-slate-800 flex justify-between items-center">
                      Notifications
                      {((stats?.new_inquiries_count || 0) + (stats?.new_reviews_count || 0)) > 0 && (
                        <span className="bg-red-100 text-red-600 text-[10px] px-2 py-0.5 rounded-full">
                          {(stats?.new_inquiries_count || 0) + (stats?.new_reviews_count || 0)} New
                        </span>
                      )}
                    </div>
                    {stats?.new_inquiries_count > 0 && (
                      <div className="px-4 py-3 text-sm text-slate-600 hover:bg-slate-50 cursor-pointer border-b border-slate-50" onClick={() => setActiveTab('Leads')}>
                        You have <span className="font-bold text-slate-900">{stats.new_inquiries_count}</span> new customer inquiries.
                      </div>
                    )}
                    {stats?.new_reviews_count > 0 && (
                      <div className="px-4 py-3 text-sm text-slate-600 hover:bg-slate-50 cursor-pointer border-b border-slate-50" onClick={() => setActiveTab('Reviews')}>
                        You have <span className="font-bold text-slate-900">{stats.new_reviews_count}</span> new reviews pending.
                      </div>
                    )}
                    {(!stats?.new_inquiries_count && !stats?.new_reviews_count) && (
                      <div className="px-4 py-6 text-sm text-slate-500 text-center">
                        You're all caught up!
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="relative">
              <div 
                className="flex items-center gap-3 cursor-pointer group"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
              >
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-blue-100 text-blue-700 overflow-hidden border border-blue-200 group-hover:border-blue-400 transition-colors shrink-0 flex items-center justify-center font-bold">
                  {profile?.owner_name ? profile.owner_name.charAt(0).toUpperCase() : 'O'}
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-bold text-slate-900 leading-none">{profile?.owner_name || 'Owner'}</p>
                  <p className="text-[11px] font-medium text-slate-500 mt-1">{profile?.business_name || profile?.category || 'Business'}</p>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block" />
              </div>

              {showProfileMenu && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 z-50 p-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xl">
                      {profile?.owner_name ? profile.owner_name.charAt(0).toUpperCase() : 'O'}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">{profile?.owner_name || 'Owner'}</h4>
                      <p className="text-xs text-slate-500">{profile?.business_name || 'Business Name'}</p>
                    </div>
                  </div>
                  <div className="text-sm text-slate-600 mb-2 truncate">
                    <span className="font-semibold">Email:</span> {profile?.owner_email || 'owner@example.com'}
                  </div>
                  <button 
                    onClick={() => { setShowProfileMenu(false); setActiveTab('Settings'); }}
                    className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg mt-2 font-medium"
                  >
                    View Settings
                  </button>
                </div>
              )}
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
          
          <DashboardOverviewTab profile={profile} />
          </motion.div>
          </AnimatePresence>
          ) : activeTab === 'Products & Services' ? (
            <AnimatePresence mode="wait">
              <ProductsAndServicesTab key={`ps-${businessId}`} businessId={businessId} profile={profile} />
            </AnimatePresence>
          ) : activeTab === 'Documents' ? (
            <AnimatePresence mode="wait">
              <DocumentsTab key={`doc-${businessId}`} businessId={businessId.toString()} />
            </AnimatePresence>
          ) : (
            <AnimatePresence mode="wait">
              <DynamicDataTab key={`${activeTab}-${businessId}`} tabName={activeTab} businessId={businessId} profile={profile} />
            </AnimatePresence>
          )}
        </div>
      </main>

      {/* Help Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowHelpModal(false)} />
          <div className="relative bg-white rounded-[1.5rem] shadow-2xl w-full max-w-md p-6">
            <h3 className="font-bold text-xl text-slate-900 mb-2">Help Center</h3>
            <p className="text-sm text-slate-500 mb-4">How can we help you today? Describe your issue and we will send a notification to the Super Admin.</p>
            <div className="flex gap-3 mb-3">
              <input 
                type="text"
                value={profile?.owner_name || 'Unknown User'}
                readOnly
                className="w-1/2 px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 outline-none text-sm"
              />
              <input 
                type="text"
                value={new Date().toISOString().split('T')[0]}
                readOnly
                className="w-1/2 px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 outline-none text-sm"
              />
            </div>
            <input 
              type="text"
              value={helpSubject}
              onChange={e => setHelpSubject(e.target.value)}
              placeholder="Subject..."
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none text-sm mb-3"
            />
            <textarea 
              rows={4}
              value={helpMessage}
              onChange={e => setHelpMessage(e.target.value)}
              placeholder="Type your message here..."
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none text-sm resize-none mb-4"
            />
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setShowHelpModal(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200"
              >
                Cancel
              </button>
              <button 
                onClick={async () => {
                  if (helpSubject.trim() && helpMessage.trim()) {
                    try {
                      const res = await authFetch(`/api/owner/${businessId}/support-ticket`, {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ subject: helpSubject, message: helpMessage })
                      });
                      const data = await res.json();
                      alert(`Message successfully sent to Super Admin! Ticket ID: SUP-100${data.id}`);
                      setHelpSubject('');
                      setHelpMessage('');
                      setShowHelpModal(false);
                    } catch(err) {
                      console.error("Failed to send ticket", err);
                      alert("Failed to send message. Please try again.");
                    }
                  } else {
                    alert("Please enter both a subject and a message.");
                  }
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
              >
                Send Message
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
