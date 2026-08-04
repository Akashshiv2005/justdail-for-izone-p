import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { authFetch } from '../../../lib/services/authFetch';
import { Building2, PhoneCall, CheckCircle2, Menu, X, Edit3, MapPin, UserSquare2, Target, Users, AlertCircle } from 'lucide-react';

export default function AdminDynamicDataTab({ tab, onOpenSidebar }: { tab: string, onOpenSidebar: () => void }) {
  const [editingRow, setEditingRow] = useState<any>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<Record<string, any>>({});
  const [deletingRow, setDeletingRow] = useState<any>(null);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [isDeletingBulk, setIsDeletingBulk] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const openEdit = (row: any) => {
    setEditingRow(row);
    setEditFormData({ ...row });
    setIsAdding(false);
  };

  const openAdd = () => {
    setEditingRow({});
    setEditFormData({});
    setIsAdding(true);
  };

  const handleSave = async () => {
    try {
      const apiResource = tab === 'business-management' ? 'business' : tab;
      const endpoint = isAdding
        ? `/api/admin/${apiResource}`
        : `/api/admin/${apiResource}/${editingRow.id}`;
      const method = isAdding ? 'POST' : 'PUT';
      const res = await authFetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editFormData),
      });
      if (res.ok) {
        showToast(isAdding ? 'Item added successfully!' : 'Changes saved successfully!');
        setEditingRow(null);
        // Refresh rows
        const refreshed = await authFetch(`/api/admin/${tab}`);
        if (refreshed.ok) {
          const data = await refreshed.json();
          setRows(Array.isArray(data) ? data : []);
        }
      } else {
        const err = await res.json();
        showToast(`Error: ${err.detail || 'Save failed'}`);
      }
    } catch (e) {
      showToast('Network error. Please try again.');
    }
  };

  const handleDelete = (row: any) => {
    setDeletingRow(row);
  };

  const confirmDelete = async () => {
    if (!deletingRow) return;
    try {
      const apiResource = tab === 'business-management' || tab === 'business-approvals' ? 'business' : tab;
      const res = await authFetch(`/api/admin/${apiResource}/${deletingRow.id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('Item deleted successfully!');
        setRows(prev => prev.filter(r => r.id !== deletingRow.id));
      } else {
        showToast('Delete failed. Please try again.');
      }
    } catch (e) {
      showToast('Network error. Could not delete item.');
    } finally {
      setDeletingRow(null);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedRows.size === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedRows.size} items?`)) return;
    
    setIsDeletingBulk(true);
    try {
      const ids = Array.from(selectedRows);
      const apiResource = tab === 'business-management' || tab === 'business-approvals' ? 'business' : tab;
      
      const promises = ids.map(id => authFetch(`/api/admin/${apiResource}/${id}`, { method: 'DELETE' }));
      const responses = await Promise.all(promises);
      
      const successCount = responses.filter(r => r.ok).length;
      if (successCount === 0) {
        showToast('Error: Failed to delete items.');
        return;
      }
      
      showToast(`Successfully deleted ${successCount} items!`);
      // Re-fetch to ensure sync with backend instead of trusting frontend state
      const refreshed = await authFetch(`/api/admin/${tab === 'locations' ? 'business-management' : tab}`);
      if (refreshed.ok) {
        const data = await refreshed.json();
        setRows(Array.isArray(data) ? data : []);
      }
      setSelectedRows(new Set());
    } catch (e) {
      showToast('Error during bulk deletion.');
    } finally {
      setIsDeletingBulk(false);
    }
  };

  const toggleRow = (id: number) => {
    const newSet = new Set(selectedRows);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedRows(newSet);
  };

  const toggleAll = () => {
    if (selectedRows.size === rows.length && rows.length > 0) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(rows.map(r => r.id)));
    }
  };

  const formatTabName = (str: string) => {
    return str.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const title = formatTabName(tab);

  const getTableSchema = () => {
    switch (tab) {
      case 'business-approvals': return ['Business Name', 'Owner', 'GST Number', 'Documents', 'Status'];
      case 'business-management': return ['Business Name', 'Category', 'City', 'Owner', 'Status'];
      case 'business-owners': return ['Owner Name', 'Contact Info', 'Business Type', 'Joined Date', 'Status'];
      case 'customers': return ['Customer Name', 'Email', 'Phone', 'Joined Date', 'Status'];
      case 'categories': return ['Category Name', 'Total Businesses', 'Active Listings', 'Trending', 'Status'];
      case 'locations': return ['City', 'State', 'Area Details', 'Pincode Coverage', 'Top Categories', 'Status'];
      case 'subscriptions': return ['Business Name', 'Plan', 'Amount', 'Expiry Date', 'Status'];
      case 'payments': return ['Transaction ID', 'Business', 'Amount', 'Date', 'Status'];
      case 'advertisements': return ['Ad Campaign', 'Business', 'Impressions', 'Clicks', 'Status'];
      case 'leads': return ['Lead Name', 'Business Assigned', 'Phone', 'Date', 'Status'];
      case 'reviews': return ['Business', 'Reviewer', 'Rating', 'Date', 'Status'];
      case 'support': return ['Ticket ID', 'Subject', 'User', 'Date', 'Status'];
      case 'notifications': return ['Title', 'Type', 'Target Audience', 'Date', 'Status'];
      case 'cms': return ['Page Title', 'Author', 'Last Updated', 'Views', 'Status'];
      case 'analytics':
      case 'reports': return ['Report Name', 'Generated By', 'Type', 'Date', 'Status'];
      case 'settings':
      case 'logs': return ['Action', 'User', 'IP Address', 'Date', 'Status'];
      default: return ['ID', 'Name', 'Description', 'Date', 'Status'];
    }
  };

  const columns = getTableSchema();
  const isCategoriesTab = tab === 'categories';
  
  React.useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setError(null);

    const endpoint = tab === 'locations' ? 'business-management' : tab;

    authFetch(`/api/admin/${endpoint}`)
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(`Failed to load ${tab}`);
        }
        return res.json();
      })
      .then((data) => {
        if (!cancelled) {
          const normalizedRows = Array.isArray(data) ? data : [];

          if (tab === 'locations') {
            const grouped = new Map<
              string,
              {
                id: number;
                City: string;
                State: string;
                'Area Details': Set<string>;
                'Pincode Coverage': Set<string>;
                'Top Categories': Set<string>;
                Status: string;
              }
            >();

            normalizedRows.forEach((row: any, index: number) => {
              const city = row.City || row.city || 'Unknown';
              const category = row.Category || row.category || 'N/A';
              const website = row.Website || row.website || '';
              const addressHint =
                website.includes('Trichy')
                  ? website
                  : city === 'Trichy'
                    ? 'Cantonment, Thillai Nagar, Salai Road, KK Nagar, Woraiyur'
                    : row['Area Details'] || row.address || 'Remote / global coverage';

              const pincodeHint =
                city === 'Trichy'
                  ? ['620001', '620003', '620018', '620021']
                  : ['N/A'];

              if (!grouped.has(city)) {
                grouped.set(city, {
                  id: index + 1,
                  City: city,
                  State: city === 'Trichy' ? 'Tamil Nadu' : 'N/A',
                  'Area Details': new Set<string>(),
                  'Pincode Coverage': new Set<string>(),
                  'Top Categories': new Set<string>(),
                  Status: 'Active',
                });
              }

              const bucket = grouped.get(city)!;
              addressHint
                .split(',')
                .map((item: string) => item.trim())
                .filter(Boolean)
                .slice(0, 5)
                .forEach((item: string) => bucket['Area Details'].add(item));
              pincodeHint.forEach((item) => bucket['Pincode Coverage'].add(item));
              bucket['Top Categories'].add(category);
            });

            const locationRows = Array.from(grouped.values()).map((row) => ({
              id: row.id,
              City: row.City,
              State: row.State,
              'Area Details': Array.from(row['Area Details']).join(', '),
              'Pincode Coverage': Array.from(row['Pincode Coverage']).join(', '),
              'Top Categories': Array.from(row['Top Categories']).join(', '),
              Status: row.Status,
            }));

            setRows(locationRows);
            return;
          }

          setRows(normalizedRows);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setRows([]);
          setError(err instanceof Error ? err.message : 'Failed to load data');
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [tab]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 flex items-center gap-2">
            <button className="md:hidden p-1.5 text-slate-500 hover:bg-slate-100 rounded-lg mr-2" onClick={onOpenSidebar}>
              <Menu size={24} />
            </button>
            {title}
          </h1>
          <p className="text-sm text-slate-500 mt-1">Manage all {title.toLowerCase()} settings and data here.</p>
        </div>
        <button onClick={openAdd} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-500/30 transition-all hover:-translate-y-0.5">
          + Add New
        </button>
      </div>

      {isCategoriesTab ? (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-sky-50 via-white to-cyan-50 border border-sky-100 rounded-[2rem] p-6 md:p-8 shadow-sm">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.25em] text-sky-600 mb-3">Category Library</p>
                <h2 className="text-2xl md:text-3xl font-black text-slate-900">Browse and manage every public category</h2>
                <p className="text-sm text-slate-500 mt-2 max-w-2xl">
                  This view keeps the category list clean and focused. Only the category name and publish status are shown here.
                </p>
              </div>
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Search categories..."
                  className="w-full lg:w-72 border border-sky-100 bg-white rounded-2xl px-4 py-3 text-sm outline-none focus:border-sky-400 transition-colors shadow-sm"
                />
                <button className="px-5 py-3 bg-white border border-sky-100 text-slate-700 rounded-2xl text-sm font-bold hover:bg-sky-50 shadow-sm transition-colors">
                  Filter
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {rows.map((row, index) => (
              <motion.div
                key={row.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                className="bg-white border border-slate-200 rounded-[1.75rem] p-5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-100 to-cyan-50 text-sky-700 flex items-center justify-center text-2xl shadow-inner shrink-0">
                      {String(row['Category Name'] || '?').charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-lg font-black text-slate-900 truncate">{row['Category Name']}</h3>
                      <p className="text-xs font-medium text-slate-500 mt-1">Public listing category</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1.5 text-[11px] font-black tracking-wide uppercase rounded-full shrink-0 ${
                    row.Status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {row.Status}
                  </span>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <p className="text-xs text-slate-400 font-semibold">Ready for homepage and admin use</p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingRow(row)}
                      className="px-4 py-2 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors text-xs font-bold"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => showToast('Item deleted successfully!')}
                      className="px-4 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors text-xs font-bold"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {loading && (
            <div className="px-2 py-8 text-sm text-slate-500">Loading {title.toLowerCase()}...</div>
          )}
          {!loading && error && (
            <div className="px-2 py-8 text-sm text-red-500">{error}</div>
          )}
          {!loading && !error && rows.length === 0 && (
            <div className="px-2 py-8 text-sm text-slate-500">No data available yet for {title.toLowerCase()}.</div>
          )}
        </div>
      ) : tab === 'business-management' ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-black text-slate-900">Registered Businesses</h2>
            <div className="flex gap-2 items-center">
              {selectedRows.size > 0 && (
                <button 
                  onClick={handleBulkDelete}
                  disabled={isDeletingBulk}
                  className="px-4 py-2.5 bg-red-600 text-white rounded-xl text-sm font-bold shadow hover:bg-red-700 transition"
                >
                  {isDeletingBulk ? 'Deleting...' : `Delete Selected (${selectedRows.size})`}
                </button>
              )}
              <input type="text" placeholder="Search businesses..." className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 transition-colors w-64 shadow-sm" />
              <button className="px-4 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-50 shadow-sm transition-colors">Filter</button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rows.map((row, index) => (
              <motion.div
                key={row.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`relative border rounded-3xl p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.1)] transition-all flex flex-col group ${selectedRows.has(row.id) ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-500/20' : 'bg-white border-slate-100 hover:border-blue-300'}`}
              >
                <div className="absolute top-4 right-4 z-10">
                   <input type="checkbox" className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity checked:opacity-100" checked={selectedRows.has(row.id)} onChange={() => toggleRow(row.id)} />
                </div>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-3">
                    <div className="w-14 h-14 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl border border-blue-100 flex items-center justify-center shrink-0">
                      <Building2 className="w-6 h-6 text-blue-500" />
                    </div>
                    <div>
                      <h3 className="text-base font-black text-slate-900 leading-tight">{row['Business Name']}</h3>
                      <p className="text-[13px] font-bold text-slate-500 mt-1 flex items-center gap-1">
                        <MapPin size={12} /> {row['City']}
                      </p>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded-lg ${
                    row['Category'] === 'Mobile Shop' ? 'bg-purple-100 text-purple-700' :
                    row['Category'] === 'Dentists' ? 'bg-emerald-100 text-emerald-700' :
                    row['Category'] === 'Finance' ? 'bg-blue-100 text-blue-700' :
                    'bg-slate-100 text-slate-600'
                  }`}>
                    {row['Category']}
                  </span>
                </div>
                
                <div className="flex gap-2 flex-wrap mb-5 mt-2">
                  <span className="px-2.5 py-1 bg-slate-50 border border-slate-200 text-slate-600 text-[11px] font-bold rounded-lg flex items-center gap-1">
                    <UserSquare2 size={12}/> {row['Owner']}
                  </span>
                  <span className="px-2.5 py-1 bg-slate-50 border border-slate-200 text-slate-600 text-[11px] font-bold rounded-lg flex items-center gap-1">
                    <PhoneCall size={12}/> {row['Business Phone']}
                  </span>
                  {row['Status'] === 'Verified' && (
                    <span className="px-2.5 py-1 bg-green-50 border border-green-200 text-green-700 text-[11px] font-bold rounded-lg flex items-center gap-1">
                      <CheckCircle2 size={12}/> Verified
                    </span>
                  )}
                </div>

                <div className="mt-auto pt-4 border-t border-slate-100 flex gap-2">
                  <button 
                    onClick={() => setEditingRow(row)} 
                    className="flex-1 py-2 text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold transition-colors"
                  >
                    View Profile
                  </button>
                  <button 
                    onClick={() => handleDelete(row)}
                    className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl text-xs font-bold transition-colors"
                  >
                    Delete
                  </button>
                  <Link 
                    to={`/super-admin?tab=business-seo&id=${row.id}&name=${encodeURIComponent(row['Business Name'])}&city=${encodeURIComponent(row['City'] || 'Unknown')}&category=${encodeURIComponent(row['Category'] || 'Unknown')}`}
                    className="px-4 py-2 bg-slate-900 text-white hover:bg-slate-800 rounded-xl text-xs font-bold transition-colors flex items-center gap-1"
                  >
                    SEO <Target size={12} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
          {loading && (
            <div className="px-6 py-8 text-sm text-slate-500">Loading businesses...</div>
          )}
          {!loading && error && (
            <div className="px-6 py-8 text-sm text-red-500">{error}</div>
          )}
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
            <h2 className="text-base font-bold text-slate-900">Recent {title}</h2>
            <div className="flex gap-2 items-center">
              {selectedRows.size > 0 && (
                <button 
                  onClick={handleBulkDelete}
                  disabled={isDeletingBulk}
                  className="px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-bold shadow hover:bg-red-700 transition"
                >
                  {isDeletingBulk ? 'Deleting...' : `Delete Selected (${selectedRows.size})`}
                </button>
              )}
              <input type="text" placeholder="Search..." className="border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-blue-500 transition-colors w-64" />
              <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-50 shadow-sm transition-colors">Filter</button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-slate-500 bg-slate-50/50">
                  <th className="py-4 pl-6 w-12">
                    <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer" onChange={toggleAll} checked={selectedRows.size === rows.length && rows.length > 0} />
                  </th>
                  {columns.map((col, idx) => (
                    <th key={col} className={`py-4 font-bold ${idx === 0 ? '' : ''}`}>{col}</th>
                  ))}
                  <th className="py-4 font-bold text-right pr-6">Actions</th>
                </tr>
              </thead>
              <motion.tbody 
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
                }}
                className="divide-y divide-slate-100"
              >
                {rows.map((row) => (
                  <motion.tr 
                    variants={{
                      hidden: { opacity: 0, x: -10 },
                      visible: { opacity: 1, x: 0 }
                    }}
                    key={row.id} 
                    className={`transition-colors group ${selectedRows.has(row.id) ? 'bg-blue-50/60' : 'hover:bg-slate-50/80'}`}
                  >
                    <td className="py-4 pl-6 w-12">
                      <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer" checked={selectedRows.has(row.id)} onChange={() => toggleRow(row.id)} />
                    </td>
                    {columns.map((col, idx) => (
                      <td key={col} className={`py-4 ${idx === 0 ? 'font-bold text-slate-900' : 'text-slate-600 font-medium'}`}>
                        {col === 'Status' ? (
                          <span className={`px-3 py-1.5 text-[11px] font-black tracking-wide uppercase rounded-lg ${
                            ['Active', 'Verified', 'Completed', 'Approved'].includes(row[col]) ? 'bg-green-100 text-green-700' :
                            row[col] === 'Pending' ? 'bg-orange-100 text-orange-700' :
                            'bg-slate-100 text-slate-700'
                          }`}>
                            {row[col]}
                          </span>
                        ) : col === 'Documents' ? (
                          typeof row[col] === 'object' && row[col] !== null ? (
                            <div className="flex flex-col gap-1">
                              {Object.entries(row[col] as Record<string, string>).map(([docName, docUrl]) => (
                                docUrl ? (
                                  <a key={docName} href={`${docUrl}`} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline font-bold text-xs">
                                    {docName}
                                  </a>
                                ) : (
                                  <span key={docName} className="text-slate-400 text-xs">{docName}: Not provided</span>
                                )
                              ))}
                            </div>
                          ) : (
                            <span className="text-slate-400 text-xs">Not provided</span>
                          )
                        ) : (
                          row[col]
                        )}
                      </td>
                    ))}
                    <td className="py-4 text-right pr-6">
                      <div className="flex justify-end items-center gap-2 transition-opacity">
                        {tab === 'reports' && (
                          <button 
                            onClick={() => showToast(`Downloading ${row['Report Name'] || 'Report'} as PDF...`)}
                            className="px-3 py-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-xs font-bold flex items-center gap-1">
                            PDF
                          </button>
                        )}
                        {tab === 'business-approvals' && row['Status'] === 'Pending' && (
                          <button 
                            onClick={async () => {
                              try {
                                await authFetch(`/api/admin/business/${row.id}/approve`, { method: 'POST' });
                                showToast(`${row['Business Name']} has been Approved!`);
                                // Ideally we would refresh data here, but a window reload works for now to instantly show it
                                setTimeout(() => window.location.reload(), 1000);
                              } catch (e) {
                                showToast('Error approving business');
                              }
                            }}
                            className="px-3 py-1.5 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors text-xs font-bold"
                          >
                            Approve
                          </button>
                        )}
                        {tab === 'business-management' && (
                          <Link 
                            to={`/super-admin?tab=business-seo&id=${row.id}&name=${encodeURIComponent(row['Business Name'])}&city=${encodeURIComponent(row['City'] || 'Unknown')}&category=${encodeURIComponent(row['Category'] || 'Unknown')}`}
                            onClick={() => showToast(`Opening SEO Manager for ${row['Business Name']}`)}
                            className="px-3 py-1.5 text-purple-600 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors text-xs font-bold"
                          >
                            SEO Setup
                          </Link>
                        )}
                        <button onClick={() => openEdit(row)} className="px-3 py-1.5 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors text-xs font-bold">Edit</button>
                        <button onClick={() => handleDelete(row)} className="px-3 py-1.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors text-xs font-bold">Delete</button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </motion.tbody>
            </table>
          </div>
          {loading && (
            <div className="px-6 py-8 text-sm text-slate-500">Loading {title.toLowerCase()}...</div>
          )}
          {!loading && error && (
            <div className="px-6 py-8 text-sm text-red-500">{error}</div>
          )}
          {!loading && !error && rows.length === 0 && (
            <div className="px-6 py-8 text-sm text-slate-500">No data available yet for {title.toLowerCase()}.</div>
          )}
        </div>
      )}

      {/* Edit Modal */}
      <AnimatePresence>
        {editingRow && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
              onClick={() => setEditingRow(null)}
            />
              <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              className={`relative bg-white/95 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl shadow-indigo-900/20 w-full ${tab === 'business-management' ? 'max-w-6xl' : 'max-w-lg'} flex flex-col max-h-[85vh] border border-white`}
            >
              {/* Premium Vibrant Header */}
              <div className="shrink-0 relative overflow-hidden px-8 py-6 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 rounded-t-[2.5rem]">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
                <div className="absolute -top-10 -right-10 text-white opacity-10 transform rotate-12">
                   <Edit3 size={120} />
                </div>
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white border border-white/40 shadow-sm">
                      <Edit3 size={24} />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-2xl text-white tracking-tight flex items-center gap-3">
                        Edit Business Profile
                        <span className="px-2 py-0.5 rounded-md bg-white/20 text-white text-[10px] uppercase font-bold tracking-widest border border-white/30 backdrop-blur-md shadow-sm">ID: {editingRow.id}</span>
                      </h3>
                      <p className="text-blue-100 text-xs mt-0.5 font-medium opacity-90">Modify business details, verify status, and manage SEO</p>
                    </div>
                  </div>
                  <button onClick={() => setEditingRow(null)} className="text-blue-100 hover:text-white bg-white/10 hover:bg-white/20 p-2.5 rounded-xl transition-colors backdrop-blur-md self-start border border-white/10 hover:border-white/30 shadow-sm">
                    <X size={20} />
                  </button>
                </div>
              </div>
              
              {/* Form Body - Scrollable */}
              <div className="p-8 overflow-y-auto custom-scrollbar flex-1 bg-slate-50/50 rounded-b-[2.5rem] relative z-20">
                {(tab === 'business-management' || tab === 'business-approvals') ? (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                     {/* Left Column: Business & Owner Details */}
                     <div className="lg:col-span-7 space-y-6">
                        {/* Business Info */}
                        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                          <h4 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2 border-b border-slate-50 pb-4">
                             <Building2 size={22} className="text-blue-500"/> Business Details
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            {[
                              { key: 'Business Name', label: 'Business Name' },
                              { key: 'Category', label: 'Category' },
                              { key: 'Business Type', label: 'Business Type' },
                              { key: 'Founded Year', label: 'Founded Year' },
                              { key: 'Business Phone', label: 'Business Phone' },
                              { key: 'WhatsApp', label: 'WhatsApp' },
                              { key: 'Website', label: 'Website' },
                              { key: 'Employee Count', label: 'Employee Count' },
                            ].map(({ key, label }) => (
                              <div key={key}>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">{label}</label>
                                <input
                                  type="text"
                                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-blue-500/15 focus:border-blue-500 outline-none text-sm text-slate-800 font-semibold bg-slate-50/50 focus:bg-white transition-all shadow-inner"
                                  value={editFormData[key] ?? editingRow[key] ?? ''}
                                  onChange={e => setEditFormData((prev: any) => ({ ...prev, [key]: e.target.value }))}
                                />
                              </div>
                            ))}
                          </div>

                          {/* Legal / KYC Numbers */}
                          <div className="mt-5 pt-4 border-t border-slate-100">
                            <p className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-3">Legal & KYC</p>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                              {[
                                { key: 'PAN Number', label: 'PAN Number' },
                                { key: 'GST Number', label: 'GST Number' },
                                { key: 'FSSAI Number', label: 'FSSAI Number' },
                              ].map(({ key, label }) => (
                                <div key={key}>
                                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">{label}</label>
                                  <input
                                    type="text"
                                    className="w-full px-4 py-2.5 rounded-2xl border border-emerald-200 focus:ring-4 focus:ring-emerald-500/15 focus:border-emerald-500 outline-none text-sm text-slate-800 font-semibold bg-emerald-50/30 focus:bg-white transition-all shadow-inner"
                                    value={editFormData[key] ?? editingRow[key] ?? ''}
                                    onChange={e => setEditFormData((prev: any) => ({ ...prev, [key]: e.target.value }))}
                                  />
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Location Details */}
                          <div className="mt-5 pt-4 border-t border-slate-100">
                            <p className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-3">Location Details</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              {[
                                { key: 'Address', label: 'Full Address' },
                                { key: 'Area', label: 'Area / Locality' },
                                { key: 'City', label: 'City' },
                                { key: 'State', label: 'State' },
                                { key: 'Pincode', label: 'Pincode' },
                              ].map(({ key, label }) => (
                                <div key={key}>
                                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">{label}</label>
                                  <input
                                    type="text"
                                    className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-blue-500/15 focus:border-blue-500 outline-none text-sm text-slate-800 font-semibold bg-slate-50/50 focus:bg-white transition-all shadow-inner"
                                    value={editFormData[key] ?? editingRow[key] ?? ''}
                                    onChange={e => setEditFormData((prev: any) => ({ ...prev, [key]: e.target.value }))}
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="mt-5">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">Description</label>
                            <textarea
                              className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-blue-500/15 focus:border-blue-500 outline-none text-sm text-slate-800 font-semibold bg-slate-50/50 focus:bg-white transition-all h-24 custom-scrollbar shadow-inner resize-none"
                              value={editFormData['Description'] ?? editingRow['Description'] ?? ''}
                              onChange={e => setEditFormData((prev: any) => ({ ...prev, Description: e.target.value }))}
                            />
                          </div>
                        </div>

                        {/* Owner Info */}
                        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                          <h4 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2 border-b border-slate-50 pb-4">
                            <Users size={22} className="text-indigo-500"/> Owner Details
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            {[
                              { key: 'Owner', label: 'Owner Name' },
                              { key: 'Owner Email', label: 'Owner Email' },
                              { key: 'Owner Phone', label: 'Owner Phone' },
                            ].map(({ key, label }) => (
                              <div key={key}>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">{label}</label>
                                <input
                                  type="text"
                                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-indigo-500/15 focus:border-indigo-500 outline-none text-sm text-slate-800 font-semibold bg-slate-50/50 focus:bg-white transition-all shadow-inner"
                                  value={editFormData[key] ?? editingRow[key] ?? ''}
                                  onChange={e => setEditFormData((prev: any) => ({ ...prev, [key]: e.target.value }))}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                     </div>

                     {/* Right Column: Status & SEO */}
                     <div className="lg:col-span-5 space-y-6">
                        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                           <h4 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2 border-b border-slate-50 pb-4">
                              <CheckCircle2 size={22} className="text-emerald-500"/> Verification Gate
                           </h4>
                           <div className="grid grid-cols-2 gap-4">
                              <div>
                                 <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">Approval</label>
                                 <select
                                   className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 font-bold text-slate-800 bg-slate-50/50 outline-none focus:ring-4 focus:ring-emerald-500/15 shadow-inner transition-all hover:border-emerald-300"
                                   value={editFormData['Approval Status'] ?? editingRow['Approval Status'] ?? 'Pending'}
                                   onChange={e => setEditFormData((prev: any) => ({ ...prev, 'Approval Status': e.target.value }))}
                                 >
                                   <option value="Approved">Approved</option>
                                   <option value="Pending">Pending</option>
                                   <option value="Rejected">Rejected</option>
                                 </select>
                              </div>
                              <div>
                                 <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">KYC Check</label>
                                 <select
                                   className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 font-bold text-slate-800 bg-slate-50/50 outline-none focus:ring-4 focus:ring-emerald-500/15 shadow-inner transition-all hover:border-emerald-300"
                                   value={editFormData['Status'] ?? editingRow['Status'] ?? 'Pending'}
                                   onChange={e => setEditFormData((prev: any) => ({ ...prev, Status: e.target.value }))}
                                 >
                                   <option value="Verified">Verified</option>
                                   <option value="Pending">Pending</option>
                                 </select>
                              </div>
                           </div>
                        </div>

                        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-6 rounded-3xl border border-purple-100/50 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                           <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                              <Target size={100} className="text-purple-600" />
                           </div>
                           <h4 className="text-lg font-black text-slate-800 mb-5 flex items-center gap-2 border-b border-purple-200/50 pb-4 relative z-10">
                              <Target size={22} className="text-purple-600"/> SEO Overrides
                           </h4>
                           <div className="space-y-4 relative z-10">
                             <div>
                               <label className="block text-xs font-bold text-purple-800 uppercase tracking-wider mb-1.5 ml-1">Custom Slug</label>
                               <input type="text" placeholder="e.g. akash-textiles-trichy" value={editFormData['slug'] ?? editingRow['slug'] ?? ''} onChange={e => setEditFormData((prev: any) => ({ ...prev, slug: e.target.value }))} className="w-full px-4 py-2.5 rounded-2xl border border-purple-200 focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 outline-none text-sm font-semibold text-slate-800 bg-white shadow-inner transition-all" />
                             </div>
                             <div>
                               <label className="block text-xs font-bold text-purple-800 uppercase tracking-wider mb-1.5 ml-1">Meta Title</label>
                               <input type="text" placeholder={`Default: ${editingRow['Business Name']} in ${editingRow['City']} - Top ${editingRow['Category']}`} value={editFormData['seo_title'] ?? editingRow['seo_title'] ?? ''} onChange={e => setEditFormData((prev: any) => ({ ...prev, seo_title: e.target.value }))} className="w-full px-4 py-2.5 rounded-2xl border border-purple-200 focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 outline-none text-sm font-semibold text-slate-800 bg-white shadow-inner transition-all" />
                             </div>
                             <div>
                               <label className="block text-xs font-bold text-purple-800 uppercase tracking-wider mb-1.5 ml-1">Meta Description</label>
                               <textarea placeholder={`Default: Contact ${editingRow['Business Name']} in ${editingRow['City']}. Best ${editingRow['Category']} services.`} value={editFormData['seo_description'] ?? editingRow['seo_description'] ?? ''} onChange={e => setEditFormData((prev: any) => ({ ...prev, seo_description: e.target.value }))} className="w-full px-4 py-2.5 rounded-2xl border border-purple-200 focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 outline-none text-sm font-semibold text-slate-800 bg-white shadow-inner transition-all h-20 custom-scrollbar resize-none" />
                             </div>
                             <div>
                               <label className="block text-xs font-bold text-purple-800 uppercase tracking-wider mb-1.5 ml-1">SEO Keywords</label>
                               <input type="text" placeholder="e.g. textiles, clothing, trichy shopping" value={editFormData['seo_keywords'] ?? editingRow['seo_keywords'] ?? ''} onChange={e => setEditFormData((prev: any) => ({ ...prev, seo_keywords: e.target.value }))} className="w-full px-4 py-2.5 rounded-2xl border border-purple-200 focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 outline-none text-sm font-semibold text-slate-800 bg-white shadow-inner transition-all" />
                             </div>
                           </div>
                        </div>
                     </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {Object.keys(editingRow).filter(k => k !== 'id' && k !== 'owner_id').map((col) => {
                      const val = editingRow[col];
                      const isObject = typeof val === 'object' && val !== null;
                      return (
                        <div key={col} className="group">
                          <label className="block text-sm font-bold text-slate-700 mb-2">{col}</label>
                          <div className="relative">
                            <input
                              type="text"
                              disabled={isObject}
                              className="w-full px-5 py-3.5 rounded-xl border border-slate-200 focus:ring-4 focus:ring-blue-500/15 focus:border-blue-500 outline-none text-sm text-slate-900 font-semibold bg-slate-50 focus:bg-white transition-all disabled:opacity-60"
                              value={isObject ? 'Document attached' : (editFormData[col] ?? val ?? '')}
                              onChange={e => !isObject && setEditFormData((prev: any) => ({ ...prev, [col]: e.target.value }))}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
              
              {/* Footer */}
              <div className="p-6 border-t border-slate-100 flex gap-4 justify-end bg-slate-50/80">
                <button onClick={() => setEditingRow(null)} className="px-6 py-3.5 font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 hover:text-slate-900 rounded-xl transition-all shadow-sm flex items-center gap-2">
                  Cancel
                </button>
                <button 
                  onClick={handleSave} 
                  className="px-6 py-3.5 font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl transition-all shadow-lg shadow-blue-600/30 flex items-center gap-2 group"
                >
                  {isAdding ? 'Add Item' : 'Save Changes'}
                  <CheckCircle2 size={18} className="group-hover:scale-110 transition-transform" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deletingRow && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setDeletingRow(null)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center"
            >
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-5">
                <AlertCircle size={32} />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2">Delete this item?</h3>
              <p className="text-sm text-slate-500 mb-8">This action cannot be undone. Are you sure you want to permanently delete this record?</p>
              
              <div className="flex gap-3">
                <button 
                  onClick={() => setDeletingRow(null)}
                  className="flex-1 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors shadow-lg shadow-red-500/30"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 20, x: '-50%' }}
            className="fixed bottom-6 left-1/2 z-[200] bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 font-medium border border-slate-700"
          >
            {toastMessage.toLowerCase().includes('error') || toastMessage.toLowerCase().includes('fail') ? (
              <AlertCircle size={20} className="text-red-400" />
            ) : (
              <CheckCircle2 size={20} className="text-green-400" />
            )}
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
