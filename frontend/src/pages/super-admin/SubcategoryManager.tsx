import React, { useEffect, useState } from 'react';
import { Plus, Edit3, Trash2, Search, Layers, Filter } from 'lucide-react';
import { authFetch } from '../../lib/services/authFetch';

interface Category {
  id: number;
  name: string;
}

interface Subcategory {
  id: number;
  category_id: number;
  name: string;
  icon: string | null;
  slug: string;
  description: string | null;
  seo_title: string | null;
  seo_description: string | null;
  seo_keywords: string | null;
  is_active: boolean;
  display_order: number;
}

export default function SubcategoryManager() {
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<number | 'all'>('all');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubcategory, setEditingSubcategory] = useState<Subcategory | null>(null);

  const [formData, setFormData] = useState({
    category_id: 0,
    name: '',
    icon: '',
    slug: '',
    description: '',
    seo_title: '',
    seo_description: '',
    seo_keywords: '',
    is_active: true,
    display_order: 0,
  });

  const fetchCategories = async () => {
    try {
      const res = await authFetch('/api/admin/categories/');
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
        if (data.length > 0 && formData.category_id === 0) {
          setFormData((prev) => ({ ...prev, category_id: data[0].id }));
        }
      }
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  const fetchSubcategories = async () => {
    try {
      setLoading(true);
      let url = '/api/admin/subcategories/';
      if (selectedCategoryFilter !== 'all') {
        url += `?category_id=${selectedCategoryFilter}`;
      }
      const res = await authFetch(url);
      if (res.ok) {
        const data = await res.json();
        setSubcategories(data);
      }
    } catch (err) {
      console.error('Failed to fetch subcategories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchSubcategories();
  }, [selectedCategoryFilter]);

  const handleOpenModal = (sub: Subcategory | null = null) => {
    if (sub) {
      setEditingSubcategory(sub);
      setFormData({
        category_id: sub.category_id,
        name: sub.name,
        icon: sub.icon || '',
        slug: sub.slug,
        description: sub.description || '',
        seo_title: sub.seo_title || '',
        seo_description: sub.seo_description || '',
        seo_keywords: sub.seo_keywords || '',
        is_active: sub.is_active,
        display_order: sub.display_order,
      });
    } else {
      setEditingSubcategory(null);
      setFormData({
        category_id: categories.length > 0 ? categories[0].id : 0,
        name: '',
        icon: '',
        slug: '',
        description: '',
        seo_title: '',
        seo_description: '',
        seo_keywords: '',
        is_active: true,
        display_order: 0,
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingSubcategory
        ? `/api/admin/subcategories/${editingSubcategory.id}`
        : '/api/admin/subcategories/';
      const method = editingSubcategory ? 'PUT' : 'POST';

      const res = await authFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchSubcategories();
      } else {
        const errData = await res.json();
        alert(errData.detail || 'Failed to save subcategory');
      }
    } catch (err) {
      console.error('Error saving subcategory:', err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this subcategory?')) return;
    try {
      const res = await authFetch(`/api/admin/subcategories/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        fetchSubcategories();
      }
    } catch (err) {
      console.error('Error deleting subcategory:', err);
    }
  };

  const getCategoryName = (catId: number) => {
    const cat = categories.find((c) => c.id === catId);
    return cat ? cat.name : 'Unknown';
  };

  const filteredSubcategories = subcategories.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Layers className="text-blue-600" /> Subcategory Management
          </h1>
          <p className="text-slate-500 text-sm">Manage dynamic child categories mapped to parent categories.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition shadow"
        >
          <Plus size={18} /> Add New Subcategory
        </button>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6 flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search subcategories by name or slug..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter size={18} className="text-slate-400" />
          <select
            value={selectedCategoryFilter}
            onChange={(e) =>
              setSelectedCategoryFilter(e.target.value === 'all' ? 'all' : parseInt(e.target.value))
            }
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Parent Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="text-sm font-medium text-slate-600 whitespace-nowrap">
          Total: {filteredSubcategories.length}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500">Loading subcategories...</div>
        ) : filteredSubcategories.length === 0 ? (
          <div className="p-8 text-center text-slate-500">No subcategories found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="p-4">ID</th>
                  <th className="p-4">Subcategory Name</th>
                  <th className="p-4">Parent Category</th>
                  <th className="p-4">Slug</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Order</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-sm">
                {filteredSubcategories.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-50 transition">
                    <td className="p-4 font-mono text-slate-500">#{sub.id}</td>
                    <td className="p-4 font-semibold text-slate-900">{sub.name}</td>
                    <td className="p-4 text-slate-700">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                        {getCategoryName(sub.category_id)}
                      </span>
                    </td>
                    <td className="p-4 text-slate-600 font-mono text-xs">{sub.slug}</td>
                    <td className="p-4">
                      {sub.is_active ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-slate-600">{sub.display_order}</td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenModal(sub)}
                        className="p-1 text-slate-500 hover:text-blue-600 rounded transition"
                        title="Edit Subcategory"
                      >
                        <Edit3 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(sub.id)}
                        className="p-1 text-slate-500 hover:text-red-600 rounded transition"
                        title="Delete Subcategory"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <h3 className="text-lg font-bold text-slate-900">
                {editingSubcategory ? 'Edit Subcategory' : 'Create New Subcategory'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                ?
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Parent Category *
                </label>
                <select
                  required
                  value={formData.category_id}
                  onChange={(e) => setFormData({ ...formData, category_id: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Subcategory Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Dental Care"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Icon (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    placeholder="e.g. "
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={formData.display_order}
                    onChange={(e) =>
                      setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Custom Slug (Optional)
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="Auto-generated if left empty"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Short description for display..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  Active Status
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition shadow text-sm"
                >
                  Save Subcategory
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
