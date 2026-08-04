import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, Plus, Edit3, Trash2, Download, RefreshCw, Search,
  ChevronRight, Check, X, Globe, Building2, LayoutGrid, Map, Menu
} from 'lucide-react';
import { authFetch } from '../../lib/services/authFetch';

const BASE = 'http://127.0.0.1:8000';

type Tab = 'overview' | 'districts' | 'cities' | 'areas';

interface District { id: number; name: string; slug: string; is_active: boolean; state_name: string; }
interface City { id: number; name: string; slug: string; district_id: number; type: string; is_active: boolean; }
interface Area { id: number; name: string; slug: string; city_id: number; is_active: boolean; }
interface Stats { countries: number; states: number; districts: number; cities: number; areas: number; localities: number; seo_pages: number; slugs: number; }

function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, x: '-50%' }}
      animate={{ opacity: 1, y: 0, x: '-50%' }}
      exit={{ opacity: 0, y: 20, x: '-50%' }}
      className="fixed bottom-6 left-1/2 z-[200] bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 font-medium border border-slate-700"
    >
      <Check size={18} className="text-green-400" />
      {message}
    </motion.div>
  );
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 bg-slate-900/50 z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg"
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">{title}</h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100 text-slate-500"><X size={20} /></button>
        </div>
        <div className="p-6">{children}</div>
      </motion.div>
    </div>
  );
}

// â”€â”€â”€â”€â”€â”€â”€ Overview â”€â”€â”€â”€â”€â”€â”€
function OverviewTab({ stats }: { stats: Stats | null }) {
  const cards = [
    { label: 'Countries', value: stats?.countries ?? '—', icon: Globe, color: 'bg-blue-100 text-blue-700' },
    { label: 'States', value: stats?.states ?? '—', icon: Map, color: 'bg-indigo-100 text-indigo-700' },
    { label: 'Districts', value: stats?.districts ?? '—', icon: LayoutGrid, color: 'bg-purple-100 text-purple-700' },
    { label: 'Cities', value: stats?.cities ?? '—', icon: Building2, color: 'bg-emerald-100 text-emerald-700' },
    { label: 'Areas', value: stats?.areas ?? '—', icon: MapPin, color: 'bg-orange-100 text-orange-700' },
    { label: 'SEO Pages', value: stats?.seo_pages ?? '—', icon: Globe, color: 'bg-teal-100 text-teal-700' },
    { label: 'URL Slugs', value: stats?.slugs ?? '—', icon: ChevronRight, color: 'bg-pink-100 text-pink-700' },
  ];
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map(c => (
          <div key={c.label} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex items-center gap-4">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${c.color}`}>
              <c.icon size={18} />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{c.value}</p>
              <p className="text-xs text-slate-500 font-medium">{c.label}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-6">
        <h3 className="font-bold text-slate-900 mb-2">Tamil Nadu SEO Coverage</h3>
        <p className="text-sm text-slate-600 mb-4">All 38 districts seeded. Dynamic SEO pages, slugs, and sitemaps are live.</p>
        <div className="flex flex-wrap gap-2 text-xs font-semibold">
          {['state-sitemap.xml', 'district-sitemap.xml', 'city-sitemap.xml', 'area-sitemap.xml', 'category-sitemap.xml', 'business-sitemap.xml'].map(sm => (
            <a key={sm} href={`http://127.0.0.1:8000/${sm}`} target="_blank" rel="noreferrer"
              className="bg-white border border-blue-200 rounded-lg px-3 py-1.5 text-blue-700 hover:bg-blue-50 transition-colors">
              {sm}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

// â”€â”€â”€â”€â”€â”€â”€ Districts â”€â”€â”€â”€â”€â”€â”€
function DistrictsTab({ onToast }: { onToast: (msg: string) => void }) {
  const [districts, setDistricts] = useState<District[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<'add' | 'edit' | null>(null);
  const [editing, setEditing] = useState<District | null>(null);
  const [form, setForm] = useState({ name: '', slug: '' });

  const load = useCallback(async () => {
    setLoading(true);
    const r = await authFetch(`${BASE}/api/admin/locations/districts`);
    if (r.ok) setDistricts(await r.json());
    setLoading(false);
  }, []);
  useEffect(() => { load(); }, [load]);

  const filtered = districts.filter(d => d.name.toLowerCase().includes(search.toLowerCase()));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editing ? 'PUT' : 'POST';
    const url = editing ? `${BASE}/api/admin/locations/districts/${editing.id}` : `${BASE}/api/admin/locations/districts`;
    const r = await authFetch(url, {
      method, headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, state_id: 1 })
    });
    if (r.ok) { onToast(editing ? 'District updated!' : 'District added!'); setModal(null); load(); }
  };

  const handleExport = () => { window.open(`${BASE}/api/admin/locations/export/districts`, '_blank'); };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search districts..."
            className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-400" />
        </div>
        <button onClick={() => { setEditing(null); setForm({ name: '', slug: '' }); setModal('add'); }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors">
          <Plus size={16} /> Add District
        </button>
        <button onClick={handleExport}
          className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-50 transition-colors">
          <Download size={16} /> Export CSV
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600 font-semibold text-xs uppercase tracking-wider">
            <tr>
              <th className="text-left px-5 py-3">District</th>
              <th className="text-left px-5 py-3">Slug</th>
              <th className="text-left px-5 py-3">State</th>
              <th className="text-left px-5 py-3">Status</th>
              <th className="text-left px-5 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr><td colSpan={5} className="text-center py-8 text-slate-400">Loading...</td></tr>
            ) : filtered.map(d => (
              <tr key={d.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-5 py-3 font-medium text-slate-900">{d.name}</td>
                <td className="px-5 py-3 text-slate-500 font-mono text-xs">{d.slug}</td>
                <td className="px-5 py-3 text-slate-600">{d.state_name}</td>
                <td className="px-5 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${d.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {d.is_active ? 'Active' : 'Disabled'}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <button onClick={() => { setEditing(d); setForm({ name: d.name, slug: d.slug }); setModal('edit'); }}
                      className="p-1.5 rounded-lg hover:bg-blue-50 text-slate-500 hover:text-blue-600 transition-colors"><Edit3 size={15} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {modal && (
          <Modal title={modal === 'edit' ? 'Edit District' : 'Add District'} onClose={() => setModal(null)}>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">District Name</label>
                <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Slug (auto-generated if blank)</label>
                <input value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400" />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setModal(null)}
                  className="px-5 py-2.5 border border-slate-200 rounded-xl text-sm font-medium hover:bg-slate-50">Cancel</button>
                <button type="submit"
                  className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700">Save</button>
              </div>
            </form>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}

// â”€â”€â”€â”€â”€â”€â”€ Cities â”€â”€â”€â”€â”€â”€â”€
function CitiesTab({ onToast }: { onToast: (msg: string) => void }) {
  const [cities, setCities] = useState<City[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<'add' | 'edit' | null>(null);
  const [editing, setEditing] = useState<City | null>(null);
  const [form, setForm] = useState({ name: '', slug: '', district_id: '', type: 'Major City' });

  const load = useCallback(async () => {
    setLoading(true);
    const [cr, dr] = await Promise.all([
      authFetch(`${BASE}/api/admin/locations/cities`),
      authFetch(`${BASE}/api/admin/locations/districts`)
    ]);
    if (cr.ok) setCities(await cr.json());
    if (dr.ok) setDistricts(await dr.json());
    setLoading(false);
  }, []);
  useEffect(() => { load(); }, [load]);

  const filtered = cities.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editing ? 'PUT' : 'POST';
    const url = editing ? `${BASE}/api/admin/locations/cities/${editing.id}` : `${BASE}/api/admin/locations/cities`;
    const r = await authFetch(url, {
      method, headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, district_id: Number(form.district_id) })
    });
    if (r.ok) { onToast(editing ? 'City updated!' : 'City added!'); setModal(null); load(); }
  };

  const handleExport = () => { window.open(`${BASE}/api/admin/locations/export/cities`, '_blank'); };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search cities..."
            className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-400" />
        </div>
        <button onClick={() => { setEditing(null); setForm({ name: '', slug: '', district_id: '', type: 'Major City' }); setModal('add'); }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700">
          <Plus size={16} /> Add City
        </button>
        <button onClick={handleExport}
          className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-50">
          <Download size={16} /> Export CSV
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600 font-semibold text-xs uppercase tracking-wider">
            <tr>
              <th className="text-left px-5 py-3">City</th>
              <th className="text-left px-5 py-3">Type</th>
              <th className="text-left px-5 py-3">Slug</th>
              <th className="text-left px-5 py-3">Status</th>
              <th className="text-left px-5 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr><td colSpan={5} className="text-center py-8 text-slate-400">Loading...</td></tr>
            ) : filtered.slice(0, 50).map(c => (
              <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-5 py-3 font-medium text-slate-900">{c.name}</td>
                <td className="px-5 py-3">
                  <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">{c.type}</span>
                </td>
                <td className="px-5 py-3 text-slate-500 font-mono text-xs">{c.slug}</td>
                <td className="px-5 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${c.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {c.is_active ? 'Active' : 'Disabled'}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <button onClick={() => { setEditing(c); setForm({ name: c.name, slug: c.slug, district_id: String(c.district_id), type: c.type }); setModal('edit'); }}
                    className="p-1.5 rounded-lg hover:bg-blue-50 text-slate-500 hover:text-blue-600 transition-colors"><Edit3 size={15} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length > 50 && <p className="text-center text-xs text-slate-400 py-3">Showing first 50 of {filtered.length} cities</p>}
      </div>

      <AnimatePresence>
        {modal && (
          <Modal title={editing ? 'Edit City' : 'Add City'} onClose={() => setModal(null)}>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">City Name</label>
                <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">District</label>
                <select required value={form.district_id} onChange={e => setForm(f => ({ ...f, district_id: e.target.value }))}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400">
                  <option value="">Select District</option>
                  {districts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400">
                  {['Major City', 'Municipality', 'Town Panchayat', 'Popular Area', 'Locality', 'Neighbourhood'].map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setModal(null)}
                  className="px-5 py-2.5 border border-slate-200 rounded-xl text-sm font-medium hover:bg-slate-50">Cancel</button>
                <button type="submit"
                  className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700">Save</button>
              </div>
            </form>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}

// â”€â”€â”€â”€â”€â”€â”€ Areas â”€â”€â”€â”€â”€â”€â”€
function AreasTab({ onToast }: { onToast: (msg: string) => void }) {
  const [areas, setAreas] = useState<Area[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<'add' | 'edit' | null>(null);
  const [editing, setEditing] = useState<Area | null>(null);
  const [form, setForm] = useState({ name: '', slug: '', city_id: '' });

  const load = useCallback(async () => {
    setLoading(true);
    const [ar, cr] = await Promise.all([
      authFetch(`${BASE}/api/admin/locations/areas`),
      authFetch(`${BASE}/api/admin/locations/cities`),
    ]);
    if (ar.ok) setAreas(await ar.json());
    if (cr.ok) setCities(await cr.json());
    setLoading(false);
  }, []);
  useEffect(() => { load(); }, [load]);

  const filtered = areas.filter(a => a.name.toLowerCase().includes(search.toLowerCase()));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editing ? 'PUT' : 'POST';
    const url = editing ? `${BASE}/api/admin/locations/areas/${editing.id}` : `${BASE}/api/admin/locations/areas`;
    const r = await authFetch(url, {
      method, headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, city_id: Number(form.city_id) })
    });
    if (r.ok) { onToast(editing ? 'Area updated!' : 'Area added!'); setModal(null); load(); }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search areas..."
            className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-400" />
        </div>
        <button onClick={() => { setEditing(null); setForm({ name: '', slug: '', city_id: '' }); setModal('add'); }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700">
          <Plus size={16} /> Add Area
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600 font-semibold text-xs uppercase tracking-wider">
            <tr>
              <th className="text-left px-5 py-3">Area</th>
              <th className="text-left px-5 py-3">Slug</th>
              <th className="text-left px-5 py-3">Status</th>
              <th className="text-left px-5 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr><td colSpan={4} className="text-center py-8 text-slate-400">Loading...</td></tr>
            ) : filtered.slice(0, 50).map(a => (
              <tr key={a.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-5 py-3 font-medium text-slate-900">{a.name}</td>
                <td className="px-5 py-3 text-slate-500 font-mono text-xs">{a.slug}</td>
                <td className="px-5 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${a.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {a.is_active ? 'Active' : 'Disabled'}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <button onClick={() => { setEditing(a); setForm({ name: a.name, slug: a.slug, city_id: String(a.city_id) }); setModal('edit'); }}
                    className="p-1.5 rounded-lg hover:bg-blue-50 text-slate-500 hover:text-blue-600 transition-colors"><Edit3 size={15} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length > 50 && <p className="text-center text-xs text-slate-400 py-3">Showing first 50 of {filtered.length} areas</p>}
      </div>

      <AnimatePresence>
        {modal && (
          <Modal title={editing ? 'Edit Area' : 'Add Area'} onClose={() => setModal(null)}>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Area Name</label>
                <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Parent City</label>
                <select required value={form.city_id} onChange={e => setForm(f => ({ ...f, city_id: e.target.value }))}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400">
                  <option value="">Select City</option>
                  {cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setModal(null)}
                  className="px-5 py-2.5 border border-slate-200 rounded-xl text-sm font-medium hover:bg-slate-50">Cancel</button>
                <button type="submit"
                  className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700">Save</button>
              </div>
            </form>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}

// â”€â”€â”€â”€â”€â”€â”€ Main Component â”€â”€â”€â”€â”€â”€â”€
export default function LocationManager({ onOpenSidebar }: { onOpenSidebar?: () => void }) {
  const [tab, setTab] = useState<Tab>('overview');
  const [stats, setStats] = useState<Stats | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    authFetch(`${BASE}/api/admin/locations/stats`)
      .then(r => r.ok ? r.json() : null)
      .then(d => d && setStats(d));
  }, []);

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: 'overview', label: 'Overview', icon: Globe },
    { id: 'districts', label: 'Districts', icon: LayoutGrid },
    { id: 'cities', label: 'Cities', icon: Building2 },
    { id: 'areas', label: 'Areas', icon: MapPin },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            {onOpenSidebar && (
              <button className="md:hidden p-1.5 text-slate-500 hover:bg-slate-100 rounded-lg mr-2" onClick={onOpenSidebar}>
                <Menu size={24} />
              </button>
            )}
            <MapPin className="text-blue-600" size={24} />
            Location Management
          </h1>
          <p className="text-sm text-slate-500 mt-1">Manage India → Tamil Nadu → Districts → Cities → Areas hierarchy</p>
        </div>
        <button onClick={() => authFetch(`${BASE}/api/admin/locations/stats`).then(r => r.json()).then(setStats)}
          className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-50">
          <RefreshCw size={15} /> Refresh
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${tab === t.id ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}>
            <t.icon size={15} />
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.15 }}>
          {tab === 'overview' && <OverviewTab stats={stats} />}
          {tab === 'districts' && <DistrictsTab onToast={setToast} />}
          {tab === 'cities' && <CitiesTab onToast={setToast} />}
          {tab === 'areas' && <AreasTab onToast={setToast} />}
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {toast && <Toast message={toast} onClose={() => setToast(null)} />}
      </AnimatePresence>
    </div>
  );
}
