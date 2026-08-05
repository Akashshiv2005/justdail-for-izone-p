"use client";
import React, { Suspense, useState } from 'react';
import { authFetch } from '../../lib/services/authFetch';
import { useSearchParams, Link } from 'react-router-dom';
import Sidebar from './Sidebar';
import SEODashboard from './seo/SEODashboard';
import SEOKeywords from './seo/SEOKeywords';
import SEOModuleContainer from './seo/SEOModuleContainer';
import VerificationPanel from './verification/VerificationPanel';
import CategoryManagement from './CategoryManagement';
import LocationManager from './LocationManager';
import SearchConfigManager from './SearchConfigManager';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, Users, IndianRupee, PhoneCall, Star, Crown, 
  MoreVertical, CheckCircle2, AlertCircle, Clock, Check, Menu, X, Edit3, MapPin, UserSquare2, Target, ShieldCheck, Code
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';

import AdminDashboardTab from '../../components/dashboard/admin/AdminDashboardTab';
import AdminDynamicDataTab from '../../components/dashboard/admin/AdminDynamicDataTab';
import AdminAnalyticsTab from '../../components/dashboard/admin/AdminAnalyticsTab';
import AdminSettingsTab from '../../components/dashboard/admin/AdminSettingsTab';
import AdminPlatformReviewsTab from '../../components/dashboard/admin/AdminPlatformReviewsTab';

function DashboardContent({ onOpenSidebar }: { onOpenSidebar: () => void }) {
  const [searchParams] = useSearchParams();
  const tab = searchParams.get('tab') || 'dashboard';

  if (tab === 'dashboard') {
    return <AdminDashboardTab onOpenSidebar={onOpenSidebar} />;
  }

  if (tab === 'verification-management') {
    return <VerificationPanel />;
  }

  if (tab === 'categories') {
    return <CategoryManagement />;
  }

  if (tab === 'locations') {
    return <LocationManager onOpenSidebar={onOpenSidebar} />;
  }

  if (tab === 'search-config') {
    return <SearchConfigManager />;
  }

  if (tab === 'seo-dashboard') {
    return <SEODashboard />;
  }

  if (tab === 'seo-keywords') {
    return <SEOKeywords />;
  }

  if (['city-seo', 'category-seo', 'business-seo', 'meta-templates', 'url-generator', 'schema-generator', 'robots', 'sitemap', 'canonical-urls', 'redirects', 'search-analytics'].includes(tab)) {
    return <SEOModuleContainer moduleName={tab} />;
  }

  if (tab === 'analytics') {
    return <AdminAnalyticsTab onOpenSidebar={onOpenSidebar} />;
  }

  if (tab === 'platform-reviews') {
    return <AdminPlatformReviewsTab onOpenSidebar={onOpenSidebar} />;
  }

  if (tab === 'settings') {
    return <AdminSettingsTab onOpenSidebar={onOpenSidebar} />;
  }

  return <AdminDynamicDataTab tab={tab} onOpenSidebar={onOpenSidebar} />;
}

export default function SuperAdminDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden relative">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <Suspense fallback={<div className="p-8 text-center text-slate-500 font-medium">Loading Dashboard...</div>}>
          <DashboardContent onOpenSidebar={() => setIsSidebarOpen(true)} />
        </Suspense>
      </main>
    </div>
  );
}
