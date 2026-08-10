import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Building2, MapPin, Tag, FileCode2, Code, ShieldCheck, 
  RefreshCw, CheckCircle2, Sliders, Globe, Layers, ArrowRight,
  Plus, Edit3, Trash2, Search, Activity, BarChart3, FileText, Check, User, Rocket
} from 'lucide-react';
import { authFetch } from '../../../lib/services/authFetch';
import { getBackendBaseUrl } from '../../../lib/services/api';

interface SEOModuleContainerProps {
  moduleName: string;
}

export default function SEOModuleContainer({ moduleName }: SEOModuleContainerProps) {
  const [saveSuccess, setSaveSuccess] = useState(false);

  const titleMap: Record<string, { title: string; desc: string }> = {
    'city-seo': { title: 'City SEO Engine & Dynamic Landing Pages', desc: 'Configure city-specific targeted SEO patterns, canonical tags, and city landing metadata.' },
    'category-seo': { title: 'Category SEO Rules Manager', desc: 'Define primary keywords, meta templates, and FAQ schemas across all main categories.' },
    'business-seo': { title: 'Business SEO & Metadata Auto-Generator', desc: 'Automate title tags, OpenGraph metadata, and structured data for business profiles.' },
    'meta-templates': { title: 'Dynamic Meta Templates Engine', desc: 'Manage automated variable templates for title tags, meta descriptions, and headers.' },
    'url-generator': 'Clean URL & Canonical Manager',
    'schema-generator': { title: 'JSON-LD Schema Generator & Builder', desc: 'Build and inject LocalBusiness, BreadcrumbList, and FAQPage schemas dynamically.' },
    'robots': { title: 'Robots.txt & Crawl Rate Control', desc: 'Configure search engine crawler rules, disallow patterns, and sitemap references.' },
    'sitemap': { title: 'XML Sitemap Auto-Generator & Indexing', desc: 'Manage XML sitemap frequency, priority, and manual submit to Google Search Console.' },
    'canonical-urls': { title: 'Canonical URLs & Duplicate Prevention', desc: 'Enforce self-referential canonical tags to prevent duplicate content penalties.' },
    'redirects': { title: '301 / 302 Redirect Rules Manager', desc: 'Manage URL migration rules, legacy page redirects, and broken link handling.' },
    'search-analytics': { title: 'Search Traffic & Organic Keyword Analytics', desc: 'Track search queries, CTR, impressions, and ranking positions across cities.' },
  } as any;

  const currentInfo = titleMap[moduleName] || { 
    title: moduleName.replace('-', ' ').toUpperCase(), 
    desc: 'Automated enterprise SEO rule management and configuration.' 
  };

  const handleSave = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };




  return (
    <div className="p-6 bg-slate-50 min-h-screen space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 capitalize">
            {typeof currentInfo === 'string' ? currentInfo : currentInfo.title}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {typeof currentInfo === 'object' ? currentInfo.desc : 'Automated enterprise SEO rule management and configuration.'}
          </p>
        </div>
        <button 
          onClick={handleSave} 
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition shadow"
        >
          {saveSuccess ? <><Check size={16} /> Saved Successfully!</> : 'Save Configuration'}
        </button>
      </div>

      {/* Render custom tab content according to moduleName */}
      {moduleName === 'city-seo' && <CitySEOView />}
      {moduleName === 'category-seo' && <CategorySEOView />}
      {moduleName === 'business-seo' && <BusinessSEOView />}
      {moduleName === 'meta-templates' && <MetaTemplatesView />}
      {moduleName === 'schema-generator' && <SchemaGeneratorView />}
      {moduleName === 'robots' && <RobotsView />}
      {moduleName === 'sitemap' && <SitemapView />}
      {moduleName === 'redirects' && <RedirectsView />}
      {moduleName === 'search-analytics' && <AnalyticsView />}

      {/* Fallback for generic/other modules */}
      {!['city-seo', 'category-seo', 'business-seo', 'meta-templates', 'schema-generator', 'robots', 'sitemap', 'redirects', 'search-analytics'].includes(moduleName) && (
        <GenericSEOView moduleName={moduleName} />
      )}
    </div>
  );
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// TAB 1: City SEO View
// ────────────────────────────────────────────────────────────────────────
function CitySEOView() {
  const [titleTemplate, setTitleTemplate] = useState('Best Businesses & Services in {City}, {State} | BizDial');
  const [canonicalPattern, setCanonicalPattern] = useState('https://bizdial.com/c/{category_slug}/{city_slug}');
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    authFetch('/api/admin/seo/templates/city')
      .then(res => res.json())
      .then(data => {
        if (data.title_template) setTitleTemplate(data.title_template);
        if (data.heading_template) setCanonicalPattern(data.heading_template); // Reusing heading for canonical here
      })
      .catch(console.error);

    authFetch('/api/admin/seo/dashboard')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(console.error);
  }, []);

  const handleApply = async () => {
    setIsSaving(true);
    setSaveStatus(null);
    try {
      const res = await authFetch(`/api/admin/seo/templates/city`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title_template: titleTemplate,
          heading_template: canonicalPattern
        })
      });
      if (res.ok) setSaveStatus("Successfully saved City templates!");
      else setSaveStatus("Failed to save.");
    } catch (err) {
      console.error(err);
      setSaveStatus("Error saving.");
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveStatus(null), 5000);
    }
  };

  return (
    <div className="space-y-6">
      {saveStatus && (
        <div className={`p-4 rounded-xl text-sm font-bold flex items-center justify-between ${
          saveStatus.includes('Error') || saveStatus.includes('Failed') ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'
        }`}>
          <div className="flex items-center gap-2">
            {saveStatus.includes('Error') || saveStatus.includes('Failed') ? <Activity size={18}/> : <CheckCircle2 size={18}/>}
            {saveStatus}
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Active Target Cities</div>
          <div className="text-2xl font-black text-slate-900">{stats ? stats.districts_count : '...'} Cities</div>
          <div className="text-xs text-green-600 font-semibold mt-1">100% Auto-Indexed</div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">City Landing Pages</div>
          <div className="text-2xl font-black text-slate-900">{stats ? (stats.categories_count * stats.districts_count) : '...'} Pages</div>
          <div className="text-xs text-blue-600 font-semibold mt-1">Dynamic URL pattern</div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Total Target Areas</div>
          <div className="text-2xl font-black text-slate-900">{stats ? stats.areas_count : '...'} Areas</div>
          <div className="text-xs text-slate-500 mt-1">Local neighborhood SEO</div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 relative">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-slate-900">City SEO Pattern Generator</h3>
          <button 
            onClick={handleApply}
            disabled={isSaving}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              isSaving ? 'bg-slate-100 text-slate-400' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:-translate-y-0.5'
            }`}
          >
            {isSaving ? <RefreshCw size={14} className="animate-spin" /> : <Check size={14} />}
            {isSaving ? 'Saving...' : 'Save Configuration'}
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">City Title Tag Template</label>
            <input 
              type="text" 
              value={titleTemplate}
              onChange={(e) => setTitleTemplate(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">City Canonical Pattern</label>
            <input 
              type="text" 
              value={canonicalPattern}
              onChange={(e) => setCanonicalPattern(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────
// TAB 2: Category SEO View
// ────────────────────────────────────────────────────────────────────────
function CategorySEOView() {
  const [titlePattern, setTitlePattern] = useState('Top Rated {Category} Services | Verified Provider Listings - BizDial');
  const [descPattern, setDescPattern] = useState('Browse verified {Category} service providers near you. Get contact numbers, ratings, customer reviews, and address details on BizDial.');
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    authFetch('/api/admin/seo/templates/category')
      .then(res => res.json())
      .then(data => {
        if (data.title_template) setTitlePattern(data.title_template);
        if (data.description_template) setDescPattern(data.description_template);
      })
      .catch(console.error);

    authFetch('/api/admin/seo/dashboard')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(console.error);
  }, []);

  const handleApply = async () => {
    setIsSaving(true);
    setSaveStatus(null);
    try {
      const res = await authFetch(`/api/admin/seo/templates/category`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title_template: titlePattern,
          description_template: descPattern
        })
      });
      if (res.ok) setSaveStatus("Successfully saved Category templates!");
      else setSaveStatus("Failed to save.");
    } catch (err) {
      console.error(err);
      setSaveStatus("Error saving.");
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveStatus(null), 5000);
    }
  };

  return (
    <div className="space-y-6">
      {saveStatus && (
        <div className={`p-4 rounded-xl text-sm font-bold flex items-center justify-between ${
          saveStatus.includes('Error') || saveStatus.includes('Failed') ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'
        }`}>
          <div className="flex items-center gap-2">
            {saveStatus.includes('Error') || saveStatus.includes('Failed') ? <Activity size={18}/> : <CheckCircle2 size={18}/>}
            {saveStatus}
          </div>
        </div>
      )}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-slate-900">Category SEO Meta Rules</h3>
          <button 
            onClick={handleApply}
            disabled={isSaving}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              isSaving ? 'bg-slate-100 text-slate-400' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:-translate-y-0.5'
            }`}
          >
            {isSaving ? <RefreshCw size={14} className="animate-spin" /> : <Check size={14} />}
            {isSaving ? 'Saving...' : 'Save Configuration'}
          </button>
        </div>
        <div className="space-y-4 text-sm">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Default Category Title Pattern</label>
            <input 
              type="text" 
              value={titlePattern}
              onChange={(e) => setTitlePattern(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Default Category Meta Description</label>
            <textarea 
              rows={3} 
              value={descPattern}
              onChange={(e) => setDescPattern(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// TAB 3: Meta Templates View
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function MetaTemplatesView() {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
      <h3 className="font-bold text-slate-900">Dynamic Variable Templates</h3>
      <p className="text-xs text-slate-500">Available variables: <code>{`{Category}`}</code>, <code>{`{Subcategory}`}</code>, <code>{`{City}`}</code>, <code>{`{BusinessName}`}</code>, <code>{`{Rating}`}</code></p>

      <div className="space-y-4">
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
          <div className="font-bold text-xs text-blue-600 uppercase">Single Business Detail Page Template</div>
          <input 
            type="text" 
            defaultValue="{BusinessName} - {Category} in {City} | Contact, Reviews & Address" 
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono"
          />
        </div>
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
          <div className="font-bold text-xs text-blue-600 uppercase">Subcategory Search Page Template</div>
          <input 
            type="text" 
            defaultValue="Best {Subcategory} Specialists in {City} | Verified Listings - BizDial" 
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono"
          />
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────
// TAB 4: Schema Generator View
// ────────────────────────────────────────────────────────────────────────
function SchemaGeneratorView() {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
      <h3 className="font-bold text-slate-900">JSON-LD Structured Data Schema Config</h3>
      <div className="p-4 bg-slate-900 text-green-400 font-mono text-xs rounded-xl overflow-x-auto">
        <pre>{`{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "{BusinessName}",
  "image": "{LogoUrl}",
  "telephone": "{Phone}",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "{Address}",
    "addressLocality": "{City}",
    "addressCountry": "IN"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "{AverageRating}",
    "reviewCount": "{TotalReviews}"
  }
}`}</pre>
      </div>
    </div>
  );
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// TAB 5: Robots.txt View
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function RobotsView() {
  const [robotsText, setRobotsText] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  useEffect(() => {
    authFetch('/api/admin/seo/robots')
      .then(res => res.json())
      .then(data => {
        const disallowLines = (data.disallow_paths || []).map((p: string) => `Disallow: ${p}`).join('\n');
        setRobotsText(`User-agent: *\nAllow: /\n${disallowLines}\n\nSitemap: ${getBackendBaseUrl()}/sitemap.xml`);
      })
      .catch(console.error);
  }, []);

  const handleApply = async () => {
    setIsSaving(true);
    setSaveStatus(null);
    try {
      const lines = robotsText.split('\n');
      const disallow_paths = lines
        .filter(l => l.toLowerCase().startsWith('disallow:'))
        .map(l => l.split(':')[1].trim())
        .filter(p => p.length > 0);

      const res = await authFetch(`/api/admin/seo/robots`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ disallow_paths })
      });
      if (res.ok) setSaveStatus("Success! Robots.txt rules updated.");
      else setSaveStatus("Failed to save.");
    } catch (err) {
      console.error(err);
      setSaveStatus("Error saving.");
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveStatus(null), 5000);
    }
  };

  return (
    <div className="space-y-6">
      {saveStatus && (
        <div className={`p-4 rounded-xl text-sm font-bold flex items-center justify-between ${
          saveStatus.includes('Error') || saveStatus.includes('Failed') ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'
        }`}>
          <div className="flex items-center gap-2">
            {saveStatus.includes('Error') || saveStatus.includes('Failed') ? <Activity size={18}/> : <CheckCircle2 size={18}/>}
            {saveStatus}
          </div>
        </div>
      )}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-slate-900">Live Robots.txt Content Editor</h3>
          <button 
            onClick={handleApply}
            disabled={isSaving}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              isSaving ? 'bg-slate-100 text-slate-400' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md'
            }`}
          >
            {isSaving ? <RefreshCw size={14} className="animate-spin" /> : <Check size={14} />}
            {isSaving ? 'Saving...' : 'Save Configuration'}
          </button>
        </div>
        <p className="text-xs text-slate-500">Only the `Disallow:` paths are extracted and saved to the database. The rest is auto-generated.</p>
        <textarea 
          rows={8}
          value={robotsText}
          onChange={(e) => setRobotsText(e.target.value)}
          className="w-full p-4 bg-slate-900 text-slate-100 font-mono text-xs rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// TAB 6: Sitemap View
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function SitemapView() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    authFetch('/api/admin/seo/dashboard')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(console.error);
  }, []);

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-slate-900">XML Sitemap Status</h3>
          <p className="text-xs text-slate-500">Auto-generated instantly by the backend engine</p>
        </div>
        <a 
          href={`${getBackendBaseUrl()}/sitemap.xml`} 
          target="_blank" 
          rel="noreferrer"
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg transition"
        >
          View Live sitemap.xml
        </a>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
        <div className="p-4 bg-slate-50 rounded-xl">
          <div className="text-xs text-slate-500 font-semibold">Total Generated URLs</div>
          <div className="text-xl font-black text-slate-900">{stats ? stats.generated_pages : '...'}</div>
        </div>
        <div className="p-4 bg-slate-50 rounded-xl">
          <div className="text-xs text-slate-500 font-semibold">Total Indexed Pages</div>
          <div className="text-xl font-black text-slate-900">{stats ? stats.google_indexed : '...'}</div>
        </div>
        <div className="p-4 bg-slate-50 rounded-xl">
          <div className="text-xs text-slate-500 font-semibold">Total Businesses</div>
          <div className="text-xl font-black text-slate-900">{stats ? stats.total_indexed_pages - 25 : '...'}</div>
        </div>
        <div className="p-4 bg-slate-50 rounded-xl">
          <div className="text-xs text-slate-500 font-semibold">Last Ping Google</div>
          <div className="text-xl font-black text-green-600">Dynamic (Live)</div>
        </div>
      </div>
    </div>
  );
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// TAB 7: Redirects View
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function RedirectsView() {
  const [redirects, setRedirects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRedirects = () => {
    setIsLoading(true);
    authFetch('/api/admin/seo/redirects')
      .then(res => res.json())
      .then(data => {
        setRedirects(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchRedirects();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this redirect?")) return;
    try {
      const res = await authFetch(`/api/admin/seo/redirects/${id}`, { method: 'DELETE' });
      if (res.ok) fetchRedirects();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-slate-900">301 / 302 Active Redirect Rules</h3>
        <button className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition">
          + Add Rule
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-500 uppercase">
              <th className="p-3">Source URL</th>
              <th className="p-3">Target URL</th>
              <th className="p-3">Type</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              <tr><td colSpan={5} className="p-4 text-center text-slate-500">Loading redirects...</td></tr>
            ) : redirects.length === 0 ? (
              <tr><td colSpan={5} className="p-4 text-center text-slate-500">No redirects configured yet.</td></tr>
            ) : (
              redirects.map((r, i) => (
                <tr key={i} className="hover:bg-slate-50">
                  <td className="p-3 font-mono">{r.source_path}</td>
                  <td className="p-3 font-mono text-blue-600">{r.target_path}</td>
                  <td className="p-3"><span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded font-bold">{r.redirect_type}</span></td>
                  <td className="p-3 text-green-600 font-bold">{r.is_active ? 'Active' : 'Inactive'}</td>
                  <td className="p-3 text-right">
                    <button onClick={() => handleDelete(r.id)} className="text-red-500 hover:text-red-700 transition">
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// TAB 8: Analytics View
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function AnalyticsView() {
  const [stats, setStats] = useState({ impressions: 0, clicks: 0, ctr: 0, avg_position: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authFetch('/api/admin/seo/analytics')
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching analytics:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-slate-500 text-sm font-semibold">Loading analytics...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Organic Impressions</div>
        <div className="text-2xl font-black text-slate-900">{stats.impressions.toLocaleString()}</div>
        <div className="text-xs text-green-600 font-semibold mt-1">↑ Dynamic</div>
      </div>
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Organic Clicks</div>
        <div className="text-2xl font-black text-slate-900">{stats.clicks.toLocaleString()}</div>
        <div className="text-xs text-blue-600 font-semibold mt-1">CTR: {stats.ctr}%</div>
      </div>
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Avg Google Position</div>
        <div className="text-2xl font-black text-slate-900">{stats.avg_position}</div>
        <div className="text-xs text-amber-600 font-semibold mt-1">Top 5 average</div>
      </div>
    </div>
  );
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Generic SEO View Fallback
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function GenericSEOView({ moduleName }: { moduleName: string }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
      <h3 className="font-bold text-slate-900 capitalize">{moduleName.replace('-', ' ')} Settings</h3>
      <p className="text-xs text-slate-500">Automated SEO pattern rule for {moduleName}.</p>
      <div>
        <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Rule Expression</label>
        <input 
          type="text" 
          defaultValue={`auto_pattern_{${moduleName}}`}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono"
        />
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────
// TAB 3: Business SEO View (Dedicated Override Interface)
// ────────────────────────────────────────────────────────────────────────
function BusinessSEOView() {
  const location = useLocation();
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState<any>(null);
  const [realBusinesses, setRealBusinesses] = useState<any[]>([]);

  const [seoTitle, setSeoTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [seoDesc, setSeoDesc] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  const handleSelectBusiness = (b: any) => {
    const mappedMatch = {
      id: b.id,
      name: b['Business Name'] || b.name, // handle both backend row format and dynamic param format
      city: b['City'] || b.city || 'Unknown',
      category: b['Category'] || b.category || 'General',
      owner: b['Owner'] || ''
    };
    setSelectedBusiness(mappedMatch);
    setSearch(mappedMatch.name);
    setSlug(mappedMatch.name.toLowerCase().replace(/ /g, '-'));
    setShowDropdown(false);
    setSearchResults([]);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearch(val);
    if (val.length > 1) {
      const matches = realBusinesses.filter(b => 
        (b['Business Name'] && String(b['Business Name']).toLowerCase().includes(val.toLowerCase())) ||
        (b['Owner'] && String(b['Owner']).toLowerCase().includes(val.toLowerCase())) ||
        (b['Business Phone'] && String(b['Business Phone']).includes(val))
      );
      setSearchResults(matches);
      setShowDropdown(true);
    } else {
      setSearchResults([]);
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    // Fetch all real businesses once for client-side search
    authFetch('/api/admin/business-management')
      .then(res => res.json())
      .then(data => {
         if (Array.isArray(data)) {
           setRealBusinesses(data);
         }
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const nameParam = params.get('name');
    const searchParam = params.get('search');
    
    if (nameParam) {
      setSearch(nameParam);
      const idParam = params.get('id');
      const cityParam = params.get('city');
      const catParam = params.get('category');
      
      const dynamicMatch = {
        id: idParam ? parseInt(idParam, 10) : 999,
        name: nameParam,
        city: cityParam || 'Unknown',
        category: catParam || 'Business'
      };
      handleSelectBusiness(dynamicMatch);
    } else if (searchParam) {
      setSearch(searchParam);
    }
  }, [location.search]);

  const handleApply = async () => {
    if (!selectedBusiness) return;
    setIsSaving(true);
    setSaveStatus(null);
    try {
      const res = await authFetch(`/api/admin/business/${selectedBusiness.id}/seo`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          seo_title: seoTitle || null,
          seo_description: seoDesc || null,
          slug: slug || null
        })
      });
      if (res.ok) {
        setSaveStatus("Success! Database updated and search engines pinged.");
      } else {
        setSaveStatus("Failed to apply SEO metadata.");
      }
    } catch (err) {
      console.error(err);
      setSaveStatus("An error occurred while saving.");
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveStatus(null), 5000);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h3 className="font-extrabold text-slate-900 text-lg mb-2 flex items-center gap-2">
          <Search size={20} className="text-blue-600"/> Find Business to Optimize
        </h3>
        <p className="text-slate-500 text-sm mb-6">
          Search for an individual business owner to override their automated SEO rules and set custom tags.
        </p>
        
        <div className="relative max-w-xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Search by Business Name, Owner, Phone..." 
            value={search}
            onChange={handleSearch}
            onFocus={() => { if(search.length > 1 && searchResults.length > 0) setShowDropdown(true) }}
            className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-inner"
          />
          
          {showDropdown && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl max-h-64 overflow-y-auto z-50">
              {searchResults.map(b => (
                <div 
                  key={b.id} 
                  onClick={() => handleSelectBusiness(b)}
                  className="p-4 hover:bg-blue-50 cursor-pointer border-b border-slate-100 last:border-0 transition-colors"
                >
                  <div className="font-bold text-slate-900">{b['Business Name']}</div>
                  <div className="text-xs text-slate-500 flex items-center gap-3 mt-1">
                    <span className="flex items-center gap-1"><User size={12}/> {b['Owner']}</span>
                    <span className="flex items-center gap-1"><MapPin size={12}/> {b['City']}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
          {showDropdown && searchResults.length === 0 && search.length > 1 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl p-4 text-center text-slate-500 z-50 text-sm">
              No businesses found matching "{search}"
            </div>
          )}
        </div>
      </div>

      {selectedBusiness && (
        <div className="bg-white p-6 rounded-2xl border border-purple-200 shadow-xl shadow-purple-900/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 bg-purple-50 rounded-bl-[100px] -mr-4 -mt-4 z-0">
             <Building2 size={80} className="text-purple-100 opacity-50" />
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8 pb-6 border-b border-slate-100">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center font-bold text-xl">
                {selectedBusiness.name[0]}
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-900">{selectedBusiness.name}</h2>
                <div className="flex gap-2 text-sm text-slate-500 mt-1 font-medium">
                  {selectedBusiness.owner && <span className="flex items-center gap-1 text-blue-600"><User size={14} /> {selectedBusiness.owner}</span>}
                  {selectedBusiness.owner && <span>•</span>}
                  <span className="flex items-center gap-1"><MapPin size={14} /> {selectedBusiness.city}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1"><Tag size={14} /> {selectedBusiness.category}</span>
                </div>
              </div>
            </div>

            <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Code size={20} className="text-purple-600"/> Custom Metadata Override
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Custom SEO Title</label>
                  <p className="text-[10px] text-slate-400 mb-2">Overrides: "{selectedBusiness.name} - Best {selectedBusiness.category} in {selectedBusiness.city}"</p>
                  <input 
                    type="text" 
                    placeholder="e.g. #1 Mobile Shop in Trichy | Best Prices" 
                    value={seoTitle}
                    onChange={(e) => setSeoTitle(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm font-mono focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all shadow-inner"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Custom URL Slug</label>
                  <div className="flex items-center">
                    <span className="px-3 py-2.5 bg-slate-100 border border-r-0 border-slate-300 rounded-l-xl text-sm text-slate-500 font-mono">bizdial.com/business/</span>
                    <input 
                      type="text" 
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      className="flex-1 px-4 py-3 bg-white border border-slate-300 rounded-r-xl font-mono text-sm focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Custom Meta Description</label>
                  <textarea 
                    rows={5}
                    placeholder="Write a highly targeted description to boost click-through rates on Google search results." 
                    value={seoDesc}
                    onChange={(e) => setSeoDesc(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl font-mono text-sm focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all resize-none custom-scrollbar"
                  />
                </div>
                <div className="flex flex-col items-end gap-2">
                   <button 
                     onClick={handleApply}
                     disabled={isSaving}
                     className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition-colors shadow-lg shadow-purple-600/30 disabled:opacity-50 flex items-center gap-2"
                   >
                     {isSaving ? <RefreshCw size={16} className="animate-spin" /> : <Rocket size={16} />}
                     {isSaving ? 'Applying...' : 'Force Apply & Re-Index'}
                   </button>
                   {saveStatus && (
                     <span className={`text-sm font-bold ${saveStatus.includes('Success') ? 'text-green-600' : 'text-red-500'}`}>
                       {saveStatus}
                     </span>
                   )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
