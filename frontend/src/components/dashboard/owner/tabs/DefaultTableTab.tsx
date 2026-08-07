import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, X, CheckCircle } from 'lucide-react';
import { authFetch } from '../../../../lib/services/authFetch';

export default function DefaultTableTab({ tabName, data, columns, editingRow, setEditingRow, refreshData, businessId }: any) {
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    if (isAdding) {
      setFormData({ status: 'Active', col2: '5' });
    } else if (editingRow) {
      setFormData({ ...editingRow });
    }
  }, [isAdding, editingRow]);

  const handleSave = async () => {
    const endpoint = tabName.toLowerCase().replace(' ', '');
    const url = isAdding ? `/api/owner/${businessId}/${endpoint}` : `/api/owner/${businessId}/${endpoint}/${editingRow.id}`;
    const method = isAdding ? 'POST' : 'PUT';

    let payload: any = { ...formData };
    
    // Map UI generic cols back to API schema
    if (tabName === 'Leads') {
      payload = {
        customer_name: formData.col1 || '',
        customer_phone: formData.col2 || '',
        service_interest: formData.col3 || '',
        status: formData.status || 'Active'
      };
    } else if (tabName === 'Products') {
      payload = {
        name: formData.col1 || '',
        category: formData.col2 || '',
        price: parseFloat(formData.col3?.toString().replace(/[^0-9.]/g, '')) || 0,
        stock_quantity: parseInt(formData.col4?.toString().replace(/[^0-9]/g, '')) || 0
      };
    } else if (tabName === 'Reviews') {
      payload = {
        customer_name: formData.col1 || '',
        rating: parseInt(formData.col2) || 5,
        comment: formData.col3 || '',
        status: formData.status || 'Active'
      };
    } else if (tabName === 'Manage Staff') {
      payload = {
        name: formData.col1 || '',
        role: formData.col2 || '',
        email: formData.col3 || '',
        phone: formData.col4 || ''
      };
    } else if (tabName === 'Services') {
      payload = {
        master_service_id: formData.master_service_id || null,
        custom_name: formData.col1 || '',
        description: formData.col2 || '',
        price: parseFloat(formData.col3?.toString().replace(/[^0-9.]/g, '')) || 0,
      };
    }

    try {
      const res = await authFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setEditingRow(null);
        setIsAdding(false);
        if (refreshData) refreshData();
      } else {
        alert("Failed to save entry");
      }
    } catch (e) {
      console.error(e);
      alert("Error saving entry");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this entry?')) return;
    const endpoint = tabName.toLowerCase().replace(' ', '');
    try {
      const res = await authFetch(`/api/owner/${businessId}/${endpoint}/${id}`, { method: 'DELETE' });
      if (res.ok && refreshData) refreshData();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="p-4 sm:p-8"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">{tabName}</h2>
          <p className="text-sm text-slate-500 mt-1">Manage and view your {tabName.toLowerCase()} details here.</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <Search size={16} />
            </span>
            <input 
              type="text" 
              placeholder={`Search ${tabName.toLowerCase()}...`} 
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:border-blue-500 outline-none"
            />
          </div>
          <button 
            onClick={() => setIsAdding(true)}
            className="shrink-0 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus size={16} /> Add New
          </button>
        </div>
      </div>
      
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-sm text-slate-600 whitespace-nowrap">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500 font-bold border-b border-slate-200">
              <tr>
                {columns.map((col: string, idx: number) => (
                  <th key={idx} className="px-6 py-4">{col}</th>
                ))}
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.map((row: any) => (
                <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                  {columns.map((col: string, idx: number) => (
                    <td key={idx} className={`px-6 py-4 ${idx === 0 ? 'font-medium text-slate-900' : 'text-slate-600'}`}>
                      {col === 'Status' ? (
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          row.status === 'Active' || row.status === 'Verified' || row.status === 'Completed' || row.status === 'Converted'
                            ? 'bg-green-100 text-green-700' 
                            : row.status === 'Pending' 
                            ? 'bg-amber-100 text-amber-700' 
                            : row.status === 'Contacted'
                            ? 'bg-blue-100 text-blue-700'
                            : row.status === 'Rejected'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {row.status}
                        </span>
                      ) : idx === 0 ? row.col1 : idx === 1 ? row.col2 : idx === 2 ? (
                        typeof row.col3 === 'string' && row.col3.length > 80 ? row.col3.substring(0, 80) + '...' : row.col3
                      ) : (
                        typeof row.col4 === 'string' && row.col4.length > 80 ? row.col4.substring(0, 80) + '...' : row.col4
                      )}
                    </td>
                  ))}
                  <td className="px-6 py-4 text-right flex justify-end gap-3">
                    <button onClick={() => setEditingRow(row)} className="text-blue-600 font-medium hover:underline text-xs">Edit</button>
                    <button onClick={() => handleDelete(row.id)} className="text-red-600 font-medium hover:underline text-xs">Delete</button>
                  </td>
                </tr>
              ))}
              {data.length === 0 && (
                <tr>
                  <td colSpan={columns.length + 1} className="px-6 py-8 text-center text-slate-500">
                    No entries found. Click 'Add New' to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit/Add Modal */}
      <AnimatePresence>
        {(editingRow || isAdding) && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => { setEditingRow(null); setIsAdding(false); }}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-[1.5rem] shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh] border border-slate-100"
            >
              <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-white">
                <h3 className="font-bold text-lg text-slate-900">{isAdding ? `Add New ${tabName}` : `Edit ${tabName} Entry`}</h3>
                <button onClick={() => { setEditingRow(null); setIsAdding(false); }} className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
                  <X size={18} />
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto custom-scrollbar flex-1 bg-slate-50/50">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {columns.map((col: string, idx: number) => {
                    const fieldKey = col === 'Status' ? 'status' : `col${idx + 1}`;
                    const isFullWidth = col === 'Review Snippet' || col === 'Description' || col === 'Comment';
                    return (
                      <div key={idx} className={isFullWidth ? "sm:col-span-2" : ""}>
                        <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">{col}</label>
                        {col === 'Status' && tabName === 'Leads' ? (
                          <select 
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm text-slate-700 font-medium bg-white shadow-sm hover:border-slate-300 transition-all cursor-pointer appearance-none"
                            value={formData[fieldKey] || 'Pending'}
                            onChange={(e) => setFormData({...formData, [fieldKey]: e.target.value})}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Contacted">Contacted</option>
                            <option value="Converted">Converted</option>
                            <option value="Rejected">Rejected</option>
                          </select>
                        ) : col === 'Status' ? (
                          <select 
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm text-slate-700 font-medium bg-white shadow-sm hover:border-slate-300 transition-all cursor-pointer appearance-none"
                            value={formData[fieldKey] || 'Active'}
                            onChange={(e) => setFormData({...formData, [fieldKey]: e.target.value})}
                          >
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                          </select>
                        ) : col === 'Rating' ? (
                          <select 
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm text-slate-700 font-medium bg-white shadow-sm hover:border-slate-300 transition-all cursor-pointer appearance-none"
                            value={parseInt(formData[fieldKey]) || 5}
                            onChange={(e) => setFormData({...formData, [fieldKey]: e.target.value})}
                          >
                            <option value="5">5 Stars</option>
                            <option value="4">4 Stars</option>
                            <option value="3">3 Stars</option>
                            <option value="2">2 Stars</option>
                            <option value="1">1 Star</option>
                          </select>
                        ) : col === 'Date' || col === 'Last Updated' ? (
                          <input 
                            type="date" 
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm text-slate-700 font-medium bg-white shadow-sm hover:border-slate-300 transition-all cursor-pointer"
                            value={formData[fieldKey] || new Date().toISOString().split('T')[0]}
                            onChange={(e) => setFormData({...formData, [fieldKey]: e.target.value})}
                          />
                        ) : isFullWidth ? (
                          <textarea 
                            rows={3}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm text-slate-700 font-medium bg-white shadow-sm hover:border-slate-300 transition-all"
                            value={formData[fieldKey] || ''}
                            onChange={(e) => setFormData({...formData, [fieldKey]: e.target.value})}
                          />
                        ) : (
                          <input 
                            type="text" 
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm text-slate-700 font-medium bg-white shadow-sm hover:border-slate-300 transition-all"
                            value={formData[fieldKey] || ''}
                            onChange={(e) => setFormData({...formData, [fieldKey]: e.target.value})}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div className="p-5 border-t border-slate-100 flex gap-3 justify-end bg-slate-50/80">
                <button onClick={() => { setEditingRow(null); setIsAdding(false); }} className="px-5 py-2.5 font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 hover:text-slate-900 rounded-xl transition-colors shadow-sm">
                  Cancel
                </button>
                <button onClick={handleSave} className="px-6 py-2.5 font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-lg shadow-blue-600/30 flex items-center gap-2 hover:-translate-y-0.5">
                  <CheckCircle size={18} /> {isAdding ? 'Add Entry' : 'Save Changes'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
