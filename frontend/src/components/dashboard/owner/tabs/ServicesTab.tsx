import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Briefcase, ChevronRight, X, CheckCircle } from 'lucide-react';
import { authFetch } from '../../../../lib/services/authFetch';

export default function ServicesTab({ data, editingRow, setEditingRow, profile, businessId, refreshData }: any) {
  // Category Mapper State
  const [showCategoryMapper, setShowCategoryMapper] = useState(false);
  const [categoriesList, setCategoriesList] = useState<any[]>([]);
  const [subCategoriesList, setSubCategoriesList] = useState<any[]>([]);
  const [selectedCatId, setSelectedCatId] = useState<number | ''>('');
  const [selectedSubCatId, setSelectedSubCatId] = useState<number | ''>('');
  const [isMapping, setIsMapping] = useState(false);
  const [masterServices, setMasterServices] = useState<any[]>([]);

  useEffect(() => {
    if (profile?.primary_subcategory_id) {
       authFetch(`/api/admin/services/?subcategory_id=${profile.primary_subcategory_id}`)
         .then(res => res.ok ? res.json() : [])
         .then(data => setMasterServices(data))
         .catch(err => console.error(err));
    }
  }, [profile]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="p-4 sm:p-8"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Store Services</h2>
          {profile?.primary_category_id && profile?.primary_subcategory_id ? (
            <p className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full inline-flex mt-2">
              {profile.category} <ChevronRight size={14} className="mx-1 mt-0.5" /> {profile.subcategory}
            </p>
          ) : (
            <div className="mt-2 flex flex-col gap-3">
              <p className="text-sm text-red-500 font-medium">Please map your Category and Subcategory to add services.</p>
              
              {!showCategoryMapper ? (
                <button 
                  onClick={() => {
                     setShowCategoryMapper(true);
                     authFetch('/api/admin/categories/').then(r => r.json()).then(d => setCategoriesList(d));
                  }} 
                  className="self-start px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors"
                >
                  Setup Category Now
                </button>
              ) : (
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-end gap-4 max-w-2xl">
                  <div className="flex-1 w-full">
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Primary Category</label>
                    <select 
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none text-sm"
                      value={selectedCatId}
                      onChange={(e) => {
                         const cId = Number(e.target.value);
                         setSelectedCatId(cId);
                         const cat = categoriesList.find(c => c.id === cId);
                         setSubCategoriesList(cat?.subcategories || []);
                         setSelectedSubCatId('');
                      }}
                    >
                      <option value="" disabled>Select Category</option>
                      {categoriesList.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div className="flex-1 w-full">
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Subcategory</label>
                    <select 
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none text-sm"
                      value={selectedSubCatId}
                      onChange={(e) => setSelectedSubCatId(Number(e.target.value))}
                      disabled={!selectedCatId}
                    >
                      <option value="" disabled>Select Subcategory</option>
                      {(subCategoriesList || []).map(sc => <option key={sc.id} value={sc.id}>{sc.name}</option>)}
                    </select>
                  </div>
                  <button 
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 w-full sm:w-auto shrink-0 disabled:opacity-50"
                    disabled={!selectedSubCatId || isMapping}
                    onClick={() => {
                       setIsMapping(true);
                       authFetch(`/api/owner/${businessId}/profile/category`, {
                          method: 'PUT',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ category_id: selectedCatId, subcategory_id: selectedSubCatId })
                       }).then(() => { setIsMapping(false); refreshData(); });
                    }}
                  >
                    {isMapping ? 'Saving...' : 'Save Mapping'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        <button 
           onClick={() => setEditingRow({ isNew: true })}
           disabled={!profile?.primary_subcategory_id}
           className="shrink-0 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus size={16} /> Add Service
        </button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.map((service: any) => (
          <div key={service.id} onClick={() => setEditingRow(service)} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:border-indigo-300 hover:shadow-md transition-all flex items-center justify-between group cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                <Briefcase size={22} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">{service.col1}</h3>
                <p className="text-xs font-semibold text-slate-500 mt-1">{service.col3}</p>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
              <ChevronRight size={18} />
            </div>
          </div>
        ))}
      </div>
      {/* Edit Modal */}
      <AnimatePresence>
        {editingRow && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" 
              onClick={() => setEditingRow(null)} 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }} 
              className="relative bg-white rounded-[1.5rem] shadow-2xl w-full max-w-md overflow-hidden flex flex-col border border-slate-100"
            >
              <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-white">
                <h3 className="font-bold text-lg text-slate-900">{editingRow.isNew ? 'Add' : 'Edit'} Service</h3>
                <button onClick={() => setEditingRow(null)} className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
                  <X size={18} />
                </button>
              </div>
              
              <div className="p-6 bg-white space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Service Name</label>
                  {masterServices.length > 0 ? (
                    <select 
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none transition-all text-slate-700 font-medium bg-slate-50 shadow-sm disabled:opacity-70 mb-3" 
                      value={editingRow.master_service_id || ""} 
                      disabled={!editingRow.isNew}
                      onChange={e => {
                         const val = e.target.value;
                         setEditingRow({...editingRow, master_service_id: val, custom_name: ""});
                      }}
                    >
                      <option value="">-- Or enter custom name below --</option>
                      {masterServices.map(ms => (
                        <option key={ms.id} value={ms.id}>{ms.name}</option>
                      ))}
                    </select>
                  ) : null}
                  
                  {(!editingRow.master_service_id || editingRow.master_service_id === "") && (
                     <input 
                       type="text" 
                       placeholder="e.g. Standard Consultation"
                       className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none transition-all text-slate-700 font-medium bg-slate-50 focus:bg-white shadow-sm" 
                       value={editingRow.custom_name || ""} 
                       onChange={e => setEditingRow({...editingRow, custom_name: e.target.value})}
                       disabled={!editingRow.isNew}
                     />
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Custom Price</label>
                  <input 
                    type="number" 
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none transition-all text-slate-700 font-medium bg-slate-50 focus:bg-white shadow-sm" 
                    defaultValue={editingRow.col3 ? String(editingRow.col3).replace('₹','') : 0} 
                    onChange={e => setEditingRow({...editingRow, col3: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Custom Description</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none transition-all text-slate-700 font-medium bg-slate-50 focus:bg-white shadow-sm" 
                    defaultValue={editingRow.col2 || ""} 
                    onChange={e => setEditingRow({...editingRow, col2: e.target.value})}
                  />
                </div>
              </div>

              <div className="p-5 border-t border-slate-100 flex gap-3 justify-end bg-slate-50/80">
                {editingRow.isNew ? null : (
                   <button onClick={() => {
                      authFetch(`/api/owner/${businessId}/services/${editingRow.id}`, { method: 'DELETE' })
                        .then(() => {
                           setEditingRow(null);
                           refreshData();
                        });
                   }} className="mr-auto px-4 py-2.5 font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors shadow-sm">
                     Delete
                   </button>
                )}
                <button onClick={() => setEditingRow(null)} className="px-5 py-2.5 font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 hover:text-slate-900 rounded-xl transition-colors shadow-sm">
                  Cancel
                </button>
                <button 
                   onClick={() => {
                      const payload = {
                         master_service_id: editingRow.master_service_id || null,
                         custom_name: editingRow.custom_name || null,
                         price: Number(editingRow.col3 ? String(editingRow.col3).replace('₹','') : 0),
                         description: editingRow.col2
                      };
                      const url = editingRow.isNew ? `/api/owner/${businessId}/services` : `/api/owner/${businessId}/services/${editingRow.id}`;
                      const method = editingRow.isNew ? 'POST' : 'PUT';
                      authFetch(url, {
                         method,
                         headers: { 'Content-Type': 'application/json' },
                         body: JSON.stringify(payload)
                      }).then(() => {
                         setEditingRow(null);
                         refreshData();
                      });
                   }}
                   className="px-6 py-2.5 font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-lg shadow-blue-600/30 flex items-center gap-2 hover:-translate-y-0.5"
                >
                  <CheckCircle size={18} /> Save Changes
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
