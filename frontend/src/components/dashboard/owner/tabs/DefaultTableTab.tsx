import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, X, CheckCircle } from 'lucide-react';

export default function DefaultTableTab({ tabName, data, columns, editingRow, setEditingRow }: any) {
  const [isAdding, setIsAdding] = useState(false);

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
                          row.status === 'Active' || row.status === 'Verified' || row.status === 'Completed' 
                            ? 'bg-green-100 text-green-700' 
                            : row.status === 'Pending' 
                            ? 'bg-amber-100 text-amber-700' 
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {row.status}
                        </span>
                      ) : idx === 0 ? row.col1 : idx === 1 ? row.col2 : idx === 2 ? row.col3 : row.col4}
                    </td>
                  ))}
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => setEditingRow(row)} className="text-blue-600 font-medium hover:underline text-xs">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 sm:px-6 py-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <span>Showing 1 to {Math.min(data.length, 8)} of {data.length} entries</span>
          <div className="flex gap-1">
            <button className="px-2.5 py-1 border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-50" disabled>Prev</button>
            <button className="px-2.5 py-1 bg-blue-600 text-white rounded font-medium">1</button>
            <button className="px-2.5 py-1 border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-50" disabled>Next</button>
          </div>
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
              
              <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-5 bg-white">
                {columns.map((col: string, idx: number) => (
                  <div key={idx}>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">{col}</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm text-slate-700 font-medium bg-slate-50 focus:bg-white shadow-sm transition-all"
                      defaultValue={isAdding ? '' : (idx === 0 ? editingRow.col1 : idx === 1 ? editingRow.col2 : idx === 2 ? editingRow.col3 : idx === 3 ? editingRow.col4 : editingRow.status)}
                    />
                  </div>
                ))}
              </div>
              
              <div className="p-5 border-t border-slate-100 flex gap-3 justify-end bg-slate-50/80">
                <button onClick={() => { setEditingRow(null); setIsAdding(false); }} className="px-5 py-2.5 font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 hover:text-slate-900 rounded-xl transition-colors shadow-sm">
                  Cancel
                </button>
                <button onClick={() => { setEditingRow(null); setIsAdding(false); }} className="px-6 py-2.5 font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-lg shadow-blue-600/30 flex items-center gap-2 hover:-translate-y-0.5">
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
