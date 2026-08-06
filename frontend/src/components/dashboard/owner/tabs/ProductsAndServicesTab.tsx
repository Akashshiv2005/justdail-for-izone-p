import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Package, Briefcase } from 'lucide-react';
import { authFetch } from '../../../../lib/services/authFetch';

export default function ProductsAndServicesTab({ businessId, profile }: any) {
  const [products, setProducts] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [editingService, setEditingService] = useState<any>(null);
  const [refreshCount, setRefreshCount] = useState(0);

  useEffect(() => {
    // Fetch Products
    authFetch(`/api/owner/${businessId}/products`)
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        setProducts(data.map((item: any) => ({ ...item, col1: item.name })));
      })
      .catch(console.error);

    // Fetch Services
    authFetch(`/api/owner/${businessId}/services`)
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        setServices(data.map((item: any) => ({ ...item, col1: item.name })));
      })
      .catch(console.error);
  }, [businessId, refreshCount]);

  const refreshData = () => setRefreshCount(prev => prev + 1);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="p-4 sm:p-8 space-y-12"
    >
      {/* SERVICES SECTION */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Store Services</h2>
            <p className="text-sm text-slate-500 mt-1">Manage the services you offer.</p>
          </div>
          <button onClick={() => setEditingService({ isNew: true })} className="shrink-0 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2">
            <Plus size={16} /> Add Service
          </button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((service: any) => (
            <div key={service.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:border-indigo-300 hover:shadow-md transition-all flex items-center justify-between group relative">
              <div className="flex items-center gap-4 w-full pr-12">
                <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 shrink-0">
                  <Briefcase size={22} />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-slate-900 truncate">{service.col1}</h3>
                </div>
              </div>
              
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                 <button 
                    onClick={() => setEditingService(service)}
                    className="p-2 text-slate-400 hover:text-blue-600 bg-slate-50 hover:bg-blue-50 rounded-lg transition-colors text-xs font-semibold"
                 >
                    Edit
                 </button>
              </div>
            </div>
          ))}
          {services.length === 0 && (
            <div className="col-span-full py-12 flex flex-col items-center justify-center text-slate-400 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
               <Briefcase size={40} className="mb-3 opacity-20" />
               <p>No services added yet.</p>
            </div>
          )}
        </div>
      </div>

      {/* PRODUCTS SECTION */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4 pt-8 border-t border-slate-200">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Products</h2>
            <p className="text-sm text-slate-500 mt-1">Manage your physical products.</p>
          </div>
          <button onClick={() => setEditingProduct({ isNew: true })} className="shrink-0 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2">
            <Plus size={16} /> Add Product
          </button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product: any) => (
            <div key={product.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all relative group">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                  <Package size={24} />
                </div>
                <button onClick={() => setEditingProduct(product)} className="text-slate-400 hover:text-blue-600 transition-colors p-2 opacity-0 group-hover:opacity-100 bg-slate-50 rounded-lg">
                  <span className="text-xs font-semibold">Edit</span>
                </button>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2 truncate">{product.col1}</h3>
            </div>
          ))}
          {products.length === 0 && (
            <div className="col-span-full py-12 flex flex-col items-center justify-center text-slate-400 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
               <Package size={40} className="mb-3 opacity-20" />
               <p>No products added yet.</p>
            </div>
          )}
        </div>
      </div>

      {/* Edit Service Modal */}
      <AnimatePresence>
        {editingService && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setEditingService(null)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
              <h3 className="font-bold text-lg mb-4">{editingService.isNew ? 'Add' : 'Edit'} Service</h3>
              <input type="text" placeholder="Service Name (e.g. Standard Consultation)" className="w-full px-4 py-3 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all rounded-lg mb-4 font-medium" value={editingService.col1 || ''} onChange={e => setEditingService({...editingService, col1: e.target.value})} />
              
              <div className="flex justify-between mt-2">
                {!editingService.isNew ? (
                   <button onClick={() => {
                      authFetch(`/api/owner/${businessId}/services/${editingService.id}`, { method: 'DELETE' })
                        .then(() => {
                            setEditingService(null);
                            refreshData();
                        });
                   }} className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors">Delete</button>
                ) : <div></div>}
                <div className="flex gap-2">
                  <button onClick={() => setEditingService(null)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors font-medium">Cancel</button>
                  <button onClick={() => {
                      if (!editingService.col1 || editingService.col1.trim() === '') {
                          alert('Service name is required');
                          return;
                      }
                      const payload = {
                          custom_name: editingService.col1,
                          master_service_id: null,
                          price: 0,
                          description: null
                      };
                      const url = editingService.isNew ? `/api/owner/${businessId}/services` : `/api/owner/${businessId}/services/${editingService.id}`;
                      const method = editingService.isNew ? 'POST' : 'PUT';
                      authFetch(url, {
                          method,
                          headers: {'Content-Type': 'application/json'},
                          body: JSON.stringify(payload)
                      }).then(() => {
                          setEditingService(null);
                          refreshData();
                      });
                  }} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">Save</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Product Modal */}
      <AnimatePresence>
        {editingProduct && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setEditingProduct(null)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
              <h3 className="font-bold text-lg mb-4">{editingProduct.isNew ? 'Add' : 'Edit'} Product</h3>
              <input type="text" placeholder="Product Name" className="w-full px-4 py-2 border rounded-lg mb-4" value={editingProduct.col1 || ''} onChange={e => setEditingProduct({...editingProduct, col1: e.target.value})} />
              
              <div className="flex justify-between mt-2">
                {!editingProduct.isNew ? (
                   <button onClick={() => {
                      authFetch(`/api/owner/${businessId}/products/${editingProduct.id}`, { method: 'DELETE' })
                        .then(() => {
                          setEditingProduct(null);
                          refreshData();
                        });
                   }} className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg font-medium">Delete</button>
                ) : <div></div>}
                <div className="flex gap-2">
                  <button onClick={() => setEditingProduct(null)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
                  <button onClick={() => {
                      const payload = {
                          name: editingProduct.col1,
                          category: "General"
                      };
                      const url = editingProduct.isNew ? `/api/owner/${businessId}/products` : `/api/owner/${businessId}/products/${editingProduct.id}`;
                      const method = editingProduct.isNew ? 'POST' : 'PUT';
                      authFetch(url, {
                          method,
                          headers: {'Content-Type': 'application/json'},
                          body: JSON.stringify(payload)
                      }).then(() => {
                        setEditingProduct(null);
                        refreshData();
                      });
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
