"use client";

import React, { Suspense } from 'react';
import { Link } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
import { 
  Home, Building2, Users, UserSquare2, Tags, MapPin, 
  CreditCard, IndianRupee, Megaphone, Target, 
  Star, HelpCircle, Bell, FileText, 
  BarChart3, FileBarChart, Settings, Activity, LogOut,
  Search, ChevronDown, ChevronRight, X, CheckCircle2, Globe, Code, ShieldCheck, Layers, Briefcase, Folders, Database, LayoutDashboard
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MENU_ITEMS = [
  { group: 'Operations', icon: Briefcase, items: [
    { id: 'verification-management', label: 'Verification Panel', icon: ShieldCheck },
    { id: 'business-approvals', label: 'Business Approvals', icon: CheckCircle2 },
    { id: 'business-management', label: 'Business Directory', icon: Building2 },
    { id: 'business-owners', label: 'Business Owners', icon: UserSquare2 },
    { id: 'reviews', label: 'Review Moderation', icon: Star },
  ]},
  { group: 'Taxonomy', icon: Folders, items: [
    { id: 'categories', label: 'Categories', icon: Tags },
    { id: 'locations', label: 'Locations', icon: MapPin },
  ]},
  { group: 'Automatic SEO (Global)', icon: Target, items: [
    { id: 'seo-dashboard', label: 'SEO Dashboard', icon: Globe },
    { id: 'meta-templates', label: 'Programmatic Templates', icon: FileText },
    { id: 'seo-keywords', label: 'Global Keywords', icon: Target },
    { id: 'city-seo', label: 'City SEO', icon: MapPin },
    { id: 'category-seo', label: 'Category SEO', icon: Tags },
    { id: 'schema-generator', label: 'Schema Generator', icon: Code },
    { id: 'sitemap', label: 'Sitemap Manager', icon: Layers },
    { id: 'robots', label: 'Robots.txt', icon: ShieldCheck },
    { id: 'canonical-urls', label: 'Canonical URLs', icon: CheckCircle2 },
    { id: 'redirects', label: 'Redirects Manager', icon: Activity },
  ]},
  { group: 'Manual SEO (Overrides)', icon: Building2, items: [
    { id: 'business-seo', label: 'Business SEO', icon: Building2 },
  ]},
  { group: 'Content & CMS', icon: LayoutDashboard, items: [
    { id: 'cms', label: 'CMS Management', icon: FileText },
  ]},
  { group: 'System & Analytics', icon: Database, items: [
    { id: 'search-analytics', label: 'Search Analytics', icon: BarChart3 },
    { id: 'analytics', label: 'Performance Reports', icon: FileBarChart },
    { id: 'support', label: 'Support Center', icon: HelpCircle },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'search-config', label: 'Search Engine Config', icon: Search },
  ]}
];

function SidebarContent({ isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: (val: boolean) => void }) {
  const [searchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') || 'dashboard';

  // Find which group contains the current active tab
  const initialOpenGroup = MENU_ITEMS.find(group => 
    group.items.some(item => item.id === currentTab)
  )?.group || 'Operations';

  const [openSections, setOpenSections] = React.useState<Record<string, boolean>>({
    [initialOpenGroup]: true
  });

  const toggleSection = (group: string) => {
    setOpenSections(prev => ({ ...prev, [group]: !prev[group] }));
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-slate-900/50 z-40 md:hidden backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      <aside className={`w-64 bg-white border-r border-slate-200 text-slate-600 flex flex-col h-screen fixed md:sticky top-0 z-50 transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
              <Search className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-wide">BizDial</span>
          </div>
          <button className="md:hidden text-slate-400 hover:text-slate-600" onClick={() => setIsOpen(false)}>
            <X size={24} />
          </button>
        </div>

      <div className="flex-1 py-6 px-3 space-y-8 overflow-y-auto custom-scrollbar">
        
        {/* Main Dashboard Link */}
        <div>
          <Link to="/super-admin?tab=dashboard" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${currentTab === 'dashboard' ? 'bg-blue-50 text-blue-700' : 'hover:bg-slate-50 text-slate-600 hover:text-slate-900'}`}>
            <Home className="w-5 h-5" />
            <span>Dashboard</span>
          </Link>
        </div>

        {MENU_ITEMS.map((section, idx) => {
          const isOpen = openSections[section.group];
          const hasActiveItem = section.items.some(item => item.id === currentTab);
          
          return (
            <div key={idx} className="space-y-1">
              <button 
                onClick={() => toggleSection(section.group)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-bold transition-colors ${hasActiveItem && !isOpen ? 'text-blue-600 bg-blue-50/50' : 'text-slate-700 hover:bg-slate-50'}`}
              >
                <div className="flex items-center gap-3">
                  <section.icon className={`w-5 h-5 ${hasActiveItem && !isOpen ? 'text-blue-600' : 'text-slate-400'}`} />
                  {section.group}
                </div>
                {isOpen ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
              </button>
              
              <AnimatePresence>
                {isOpen && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-1 pb-2 space-y-1 pl-11 relative before:absolute before:left-5 before:top-2 before:bottom-2 before:w-px before:bg-slate-200">
                      {section.items.map(item => {
                        const isActive = currentTab === item.id;
                        return (
                          <Link 
                            key={item.id} 
                            to={`/super-admin?tab=${item.id}`} 
                            className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors relative ${isActive ? 'bg-blue-50 text-blue-700 font-semibold' : 'hover:bg-slate-50 text-slate-600 hover:text-slate-900 font-medium'}`}
                          >
                            {isActive && <div className="absolute -left-[19px] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-blue-600"></div>}
                            <div className="flex items-center gap-3">
                              <span>{item.label}</span>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* User Profile */}
      <div className="p-4 border-t border-slate-100 shrink-0">
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold shrink-0">
            SA
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-slate-900 truncate">Super Admin</p>
            <p className="text-xs text-slate-500 truncate">admin@bizdial.com</p>
          </div>
        </div>
        <Link to="/" className="mt-2 flex items-center justify-center gap-2 w-full py-2 text-sm font-medium text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
          <LogOut size={16} />
          Logout
        </Link>
      </div>
      </aside>
    </>
  );
}

export default function Sidebar({ isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: (val: boolean) => void }) {
  return (
    <Suspense fallback={<aside className="w-64 bg-white h-screen hidden md:block"></aside>}>
      <SidebarContent isOpen={isOpen} setIsOpen={setIsOpen} />
    </Suspense>
  );
}
