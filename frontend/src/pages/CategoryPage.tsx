import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Star, Phone, CheckCircle2, Search, ArrowRight, ShieldCheck, ChevronRight } from 'lucide-react';

interface Subcategory {
  id: number;
  name: string;
  slug: string;
  icon: string | null;
  description: string | null;
}

interface CategoryDetail {
  id: number;
  name: string;
  slug: string;
  icon: string | null;
  description: string | null;
  seo_title: string | null;
  seo_description: string | null;
  subcategories: Subcategory[];
}

export default function CategoryPage() {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const [category, setCategory] = useState<CategoryDetail | null>(null);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up dummy data or fetch from backend for category detail
    const fetchCategoryDetails = async () => {
      try {
        setLoading(true);
        // Fetch categories list to match slug
        const res = await fetch('http://127.0.0.1:8000/api/categories');
        if (res.ok) {
          const cats = await res.json();
          const matched = cats.find((c: any) => c.slug === categorySlug);
          if (matched) {
            // Fetch subcategories for matched category
            const subRes = await fetch(`http://127.0.0.1:8000/api/admin/subcategories/?category_id=${matched.id}`);
            const subs = subRes.ok ? await subRes.json() : [];
            setCategory({ ...matched, subcategories: subs });
            setSubcategories(subs);
          }
        }
      } catch (err) {
        console.error('Error fetching category page:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryDetails();
  }, [categorySlug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="text-slate-500 font-medium">Loading category details...</div>
      </div>
    );
  }

  const categoryName = category ? category.name : categorySlug?.replace(/-/g, ' ');

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header / Hero */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white py-12 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-slate-300 text-sm mb-4">
            <Link to="/" className="hover:text-white">Home</Link>
            <ChevronRight size={14} />
            <Link to="/categories" className="hover:text-white">Categories</Link>
            <ChevronRight size={14} />
            <span className="text-white capitalize">{categoryName}</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold capitalize mb-3 flex items-center gap-3">
            <span>{category?.icon && !category.icon.match(/^[a-zA-Z]+$/) ? category.icon : '📦'}</span>
            Best {categoryName} Services Near You
          </h1>
          <p className="text-slate-300 max-w-2xl text-base">
            {category?.description || `Explore verified ${categoryName} listings, ratings, reviews, contact details, and top service providers on BizDial.`}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto py-10 px-6 space-y-10">
        {/* Subcategories Grid */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Popular {categoryName} Subcategories</h2>
          {subcategories.length === 0 ? (
            <p className="text-slate-500">No specific subcategories listed yet. Browse all top listings below.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {subcategories.map((sub) => (
                <Link
                  key={sub.id}
                  to={`/c/${categorySlug}/${sub.slug}`}
                  className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-500 transition group flex flex-col justify-between"
                >
                  <div>
                    <div className="text-2xl mb-2">{sub.icon || ''}</div>
                    <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition">
                      {sub.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                      {sub.description || `Verified ${sub.name} providers.`}
                    </p>
                  </div>
                  <div className="mt-4 flex items-center text-xs font-semibold text-blue-600 group-hover:translate-x-1 transition-transform">
                    Browse Services <ArrowRight size={14} className="ml-1" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Dynamic CTA Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold mb-2">Are you a {categoryName} business owner?</h3>
            <p className="text-blue-100 text-sm">Register your business today on BizDial to get 10x more customer calls & leads!</p>
          </div>
          <Link
            to="/register"
            className="bg-white text-blue-600 px-6 py-3 rounded-xl font-bold hover:bg-blue-50 transition shrink-0 shadow-md"
          >
            Register Business Free
          </Link>
        </div>
      </div>
    </div>
  );
}
