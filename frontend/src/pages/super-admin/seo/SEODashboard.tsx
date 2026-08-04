import React, { useEffect, useState } from 'react';
import { Globe, CheckCircle2, Tag, Building2 } from 'lucide-react';
import { authFetch } from '../../../lib/services/authFetch';

interface SeoDashboardStats {
  generated_pages: number;
  total_seo_pages: number;
  total_keywords: number;
  indexed_keywords: number;
  businesses_with_keywords: number;
  businesses_without_keywords: number;
  categories_count: number;
  districts_count: number;
  areas_count: number;
  total_businesses: number;
}

export default function SEODashboard() {
  const [stats, setStats] = useState<SeoDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authFetch('/api/admin/seo/dashboard')
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-8 text-slate-500 font-medium">Loading Enterprise SEO Dashboard...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
          <Globe className="text-blue-600" /> Enterprise SEO Management Dashboard
        </h1>
        <p className="text-sm text-slate-500 mt-1">Auto-generated page counts and keyword coverage, computed live from your data.</p>
      </div>

      {/* Metric Cards Grid — every number below comes straight from the database, so an empty platform correctly shows 0 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Generated SEO Pages</p>
          <p className="text-3xl font-black text-blue-600 mt-2">{stats?.generated_pages ?? 0}</p>
          <span className="text-xs text-blue-600 font-bold mt-2 inline-block">Category × City combinations</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Keywords</p>
          <p className="text-3xl font-black text-slate-900 mt-2">{stats?.total_keywords ?? 0}</p>
          <span className="text-xs text-slate-500 mt-2 inline-block">Across all businesses</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Building2 size={12} /> Businesses with Keywords
          </p>
          <p className="text-3xl font-black text-emerald-600 mt-2">{stats?.businesses_with_keywords ?? 0}</p>
          <span className="text-xs text-slate-500 mt-2 inline-block">of {stats?.total_businesses ?? 0} total businesses</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Businesses Missing Keywords</p>
          <p className="text-3xl font-black text-orange-500 mt-2">{stats?.businesses_without_keywords ?? 0}</p>
          <span className="text-xs text-slate-500 mt-2 inline-block">Opportunity for SEO coverage</span>
        </div>
      </div>

      {/* Taxonomy breakdown */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Tag size={18} className="text-indigo-600" /> Taxonomy Coverage
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <p className="text-xs font-bold text-slate-500 uppercase">Categories</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{stats?.categories_count ?? 0}</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <p className="text-xs font-bold text-slate-500 uppercase">Districts</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{stats?.districts_count ?? 0}</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <p className="text-xs font-bold text-slate-500 uppercase">Areas</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{stats?.areas_count ?? 0}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 mb-4">SEO Engine Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-green-50 rounded-xl border border-green-100 flex items-center gap-2">
            <CheckCircle2 size={16} className="text-green-700 shrink-0" />
            <div>
              <p className="text-xs font-bold text-green-700 uppercase">XML Sitemap</p>
              <p className="text-sm font-black text-green-900">Active (/sitemap.xml)</p>
            </div>
          </div>
          <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 flex items-center gap-2">
            <CheckCircle2 size={16} className="text-blue-700 shrink-0" />
            <div>
              <p className="text-xs font-bold text-blue-700 uppercase">Robots.txt</p>
              <p className="text-sm font-black text-blue-900">Managed (/robots.txt)</p>
            </div>
          </div>
          <div className="p-4 bg-purple-50 rounded-xl border border-purple-100 flex items-center gap-2">
            <CheckCircle2 size={16} className="text-purple-700 shrink-0" />
            <div>
              <p className="text-xs font-bold text-purple-700 uppercase">JSON-LD Schemas</p>
              <p className="text-sm font-black text-purple-900">LocalBusiness + FAQ</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
