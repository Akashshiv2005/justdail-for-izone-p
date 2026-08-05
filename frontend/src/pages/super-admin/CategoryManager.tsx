import React, { useEffect, useState } from 'react';
import { Plus, Edit3, Trash2, Check, X, Search, Tags } from 'lucide-react';
import { authFetch } from '../../lib/services/authFetch';

interface Category {
  id: number;
  name: string;
  icon: string | null;
  slug: string;
  description: string | null;
  seo_title: string | null;
  seo_description: string | null;
  seo_keywords: string | null;
  is_featured: boolean;
  is_active: boolean;
  display_order: number;
}

export default function CategoryManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    icon: '',
    slug: '',
    description: '',
    seo_title: '',
    seo_description: '',
    seo_keywords: '',
    is_featured: false,
    is_active: true,
    display_order: 0,
  });

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await authFetch('/api/admin/categories/');
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenModal = (cat: Category | null = null) => {
    if (cat) {
      setEditingCategory(cat);
      setFormData({
        name: cat.name,
        icon: cat.icon || '',
        slug: cat.slug,
        description: cat.description || '',
        seo_title: cat.seo_title || '',
        seo_description: cat.seo_description || '',
        seo_keywords: cat.seo_keywords || '',
        is_featured: cat.is_featured,
        is_active: cat.is_active,
        display_order: cat.display_order,
      });
    } else {
      setEditingCategory(null);
      setFormData({
        name: '',
        icon: '',
        slug: '',
        description: '',
        seo_title: '',
        seo_description: '',
        seo_keywords: '',
        is_featured: false,
        is_active: true,
        display_order: 0,
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingCategory
        ? `/api/admin/categories/${editingCategory.id}`
        : '/api/admin/categories/';
      const method = editingCategory ? 'PUT' : 'POST';

      const res = await authFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchCategories();
      } else {
        const errData = await res.json();
        alert(errData.detail || 'Failed to save category');
      }
    } catch (err) {
      console.error('Error saving category:', err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this category? All subcategories under it may be affected.')) return;
    try {
      const res = await authFetch(`/api/admin/categories/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        fetchCategories();
      }
    } catch (err) {
      console.error('Error deleting category:', err);
    }
  };

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Tags className="text-blue-600" /> Category Management
          </h1>
          <p className="text-slate-500 text-sm">Manage dynamic parent categories for BizDial enterprise listing engine.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition shadow"
        >
          <Plus size={18} /> Add New Category
        </button>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6 flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search categories by name or slug..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="text-sm font-medium text-slate-600">Total Categories: {filteredCategories.length}</div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500">Loading categories...</div>
        ) : filteredCategories.length === 0 ? (
          <div className="p-8 text-center text-slate-500">No categories found. Click "Add New Category" to create one.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="p-4">Icon / ID</th>
                  <th className="p-4">Category Name</th>
                  <th className="p-4">Slug</th>
                  <th className="p-4">Featured</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Order</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-sm">
                {filteredCategories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-slate-50 transition">
                    <td className="p-4 font-mono text-slate-500">
                      <span className="mr-2 text-base">{cat.icon || 'ðŸ“'}</span>#{cat.id}
                    </td>
                    <td className="p-4 font-semibold text-slate-900">{cat.name}</td>
                    <td className="p-4 text-slate-600 font-mono text-xs">{cat.slug}</td>
                    <td className="p-4">
                      {cat.is_featured ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800">Featured</span>
                      ) : (
                        <span className="text-slate-400 text-xs">Standard</span>
                      )}
                    </td>
                    <td className="p-4">
                      {cat.is_active ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Active</span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Inactive</span>
                      )}
                    </td>
                    <td className="p-4 text-slate-600">{cat.display_order}</td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenModal(cat)}
                        className="p-1 text-slate-500 hover:text-blue-600 rounded transition"
                        title="Edit Category"
                      >
                        <Edit3 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id)}
                        className="p-1 text-slate-500 hover:text-red-600 rounded transition"
                        title="Delete Category"
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
                {editingCategory ? 'Edit Category' : 'Create New Category'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Healthcare & Medical"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Icon (Emoji / Class)</label>
                  <input
                    type="text"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    placeholder="e.g. ðŸ¥ or Stethoscope"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Display Order</label>
                  <input
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Custom Slug (Optional)</label>
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

              <div className="border-t border-slate-100 pt-4">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">SEO Optimization</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">SEO Title</label>
                    <input
                      type="text"
                      value={formData.seo_title}
                      onChange={(e) => setFormData({ ...formData, seo_title: e.target.value })}
                      placeholder="Meta title tag"
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">SEO Description</label>
                    <textarea
                      rows={2}
                      value={formData.seo_description}
                      onChange={(e) => setFormData({ ...formData, seo_description: e.target.value })}
                      placeholder="Meta description tag"
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_featured}
                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  Featured Category
                </label>
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
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
