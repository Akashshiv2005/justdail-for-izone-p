import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Package } from 'lucide-react';
import { authFetch } from '../../../../lib/services/authFetch';

export default function ProductsTab({ data, editingRow, setEditingRow, businessId }: any) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="p-4 sm:p-8"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Products Catalog</h2>
          <p className="text-sm text-slate-500 mt-1">Manage your product offerings and categories.</p>
        </div>
        <button onClick={() => setEditingRow({ isNew: true })} className="shrink-0 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2">
          <Plus size={16} /> Add Product
        </button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {data.map((product: any) => (
          <div key={product.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all relative group">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                <Package size={24} />
              </div>
              <button onClick={() => setEditingRow(product)} className="text-slate-400 hover:text-blue-600 transition-colors p-2 opacity-0 group-hover:opacity-100 bg-slate-50 rounded-lg">
                <span className="text-xs font-semibold">Edit</span>
              </button>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2 truncate">{product.col1}</h3>
            <span className="inline-block px-3 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-full">
              {product.col2}
            </span>
          </div>
        ))}
      </div>
      {/* Edit Modal Reference for Custom Views */}
      <AnimatePresence>
        {editingRow && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setEditingRow(null)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
              <h3 className="font-bold text-lg mb-4">{editingRow.isNew ? 'Add' : 'Edit'} Products</h3>
              <input type="text" placeholder="Product Name" className="w-full px-4 py-2 border rounded-lg mb-4" value={editingRow.col1 || ''} onChange={e => setEditingRow({...editingRow, col1: e.target.value})} />
              <input type="text" placeholder="Product Category" className="w-full px-4 py-2 border rounded-lg mb-4" value={editingRow.col2 || ''} onChange={e => setEditingRow({...editingRow, col2: e.target.value})} />
              <div className="flex justify-between mt-2">
                {!editingRow.isNew ? (
                   <button onClick={() => {
                      authFetch(`/api/owner/${businessId}/products/${editingRow.id}`, { method: 'DELETE' })
                        .then(() => window.location.reload());
                   }} className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg font-medium">Delete</button>
                ) : <div></div>}
                <div className="flex gap-2">
                  <button onClick={() => setEditingRow(null)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
                  <button onClick={() => {
                      const payload = {
                          name: editingRow.col1,
                          category: editingRow.col2
                      };
                      const url = editingRow.isNew ? `/api/owner/${businessId}/products` : `/api/owner/${businessId}/products/${editingRow.id}`;
                      const method = editingRow.isNew ? 'POST' : 'PUT';
                      authFetch(url, {
                          method,
                          headers: {'Content-Type': 'application/json'},
                          body: JSON.stringify(payload)
                      }).then(() => window.location.reload());
                  }} className="px-4 py-2 bg-blue-600 text-white rounded-lg">Save</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
