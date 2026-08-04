import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Image as ImageIcon, Search, X, Edit, Trash2 } from 'lucide-react';
import { authFetch } from '../../../../lib/services/authFetch';

export default function GalleryTab({ data, editingRow, setEditingRow, businessId, refreshData }: any) {
  const [isAdding, setIsAdding] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [title, setTitle] = useState('');
  const [isEditing, setIsEditing] = useState<any>(null);

  useEffect(() => {
    if (isEditing) {
      setImageUrl(isEditing.col4 || isEditing.image_url || '');
      setTitle(isEditing.col1 || isEditing.title || '');
    } else {
      setImageUrl('');
      setTitle('');
    }
  }, [isEditing]);

  const handleAddSubmit = async () => {
    if (!imageUrl) return;
    try {
      const payload = { image_url: imageUrl, title, category: 'General' };
      const url = isEditing ? `/api/owner/${businessId}/gallery/${isEditing.id}` : `/api/owner/${businessId}/gallery`;
      const method = isEditing ? 'PUT' : 'POST';
      
      const res = await authFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setIsAdding(false);
        setIsEditing(null);
        setImageUrl('');
        setTitle('');
        refreshData();
      }
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
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Gallery</h2>
          <p className="text-sm text-slate-500 mt-1">Manage and view your business photos here.</p>
        </div>
        <button 
          onClick={() => { setIsAdding(true); setIsEditing(null); }}
          className="shrink-0 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm"
        >
          <Plus size={16} /> Upload Media
        </button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {data.length > 0 ? data.map((item: any, i: number) => (
          <div key={item.id} className="group relative bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-xl transition-all duration-500 flex flex-col">
            <div className="h-48 overflow-hidden relative">
              <span className={`absolute top-3 left-3 z-10 text-[10px] font-bold px-2 py-1 rounded-md text-white shadow-sm ${i % 2 === 0 ? 'bg-blue-500' : 'bg-amber-500'}`}>
                {item.col2 || 'General'}
              </span>
              <img src={item.col4 || item.image_url || 'https://via.placeholder.com/500'} alt={item.col1 || item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
            </div>
            <div className="p-4 border-t border-slate-100 flex-1 flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-slate-900 text-sm truncate">{item.col1 || item.title || `Photo ${i + 1}`}</h4>
                <div className="flex justify-between items-center mt-2 text-xs font-medium text-slate-500">
                  <span className="flex items-center gap-1"><Search size={12}/> {item.col3 || item.category || 'General'}</span>
                  <span className={`font-bold ${item.status === 'Verified' ? 'text-green-600' : 'text-slate-500'}`}>{item.status || 'Active'}</span>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-50 flex gap-2">
                <button 
                  onClick={() => setIsEditing(item)} 
                  className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg text-xs font-bold transition-colors"
                >
                  <Edit size={14} /> Edit
                </button>
                <button 
                  onClick={() => {
                    if(window.confirm('Are you sure you want to delete this image?')) {
                      authFetch(`/api/owner/${businessId}/gallery/${item.id}`, { method: 'DELETE' }).then(() => refreshData());
                    }
                  }} 
                  className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-bold transition-colors"
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>
          </div>
        )) : (
           <div className="col-span-full py-12 text-center bg-slate-50 rounded-2xl border border-slate-200 border-dashed">
              <ImageIcon className="mx-auto h-12 w-12 text-slate-300 mb-3" />
              <h3 className="text-sm font-medium text-slate-900">No images found</h3>
              <p className="text-xs text-slate-500 mt-1">Upload your first photo to get started.</p>
           </div>
        )}
      </div>

      <AnimatePresence>
        {(isAdding || isEditing) && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => { setIsAdding(false); setIsEditing(null); }}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-3xl shadow-2xl p-6 max-w-md w-full"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black text-slate-900">{isEditing ? 'Edit Image' : 'Upload Image'}</h3>
                <button onClick={() => { setIsAdding(false); setIsEditing(null); }} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Select Image</label>
                  <input 
                    type="file" 
                    accept="image/*"
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 outline-none text-sm text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" 
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setImageUrl(reader.result as string);
                        };
                        reader.readAsDataURL(file);
                      }
                    }} 
                  />
                  {imageUrl && <img src={imageUrl} alt="preview" className="mt-3 h-20 w-auto rounded-md shadow-sm border border-slate-200 object-cover" />}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Title (Optional)</label>
                  <input type="text" placeholder="e.g. Front Store" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 outline-none text-sm text-slate-600" value={title} onChange={e => setTitle(e.target.value)} />
                </div>
              </div>
              <div className="mt-8 flex gap-3">
                <button onClick={() => { setIsAdding(false); setIsEditing(null); }} className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors text-sm">Cancel</button>
                <button onClick={handleAddSubmit} disabled={!imageUrl} className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-xl transition-colors shadow-sm text-sm">Save Image</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
