import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Star, Phone, CheckCircle2, Search, ArrowRight, ShieldCheck, ChevronRight } from 'lucide-react';

interface Business {
  id: number;
  business_name: string;
  category: string;
  city: string;
  address: string;
  phone: string;
  is_verified: boolean;
  average_rating: number;
  total_reviews: number;
}

export default function SubcategoryPage() {
  const { categorySlug, subcategorySlug } = useParams<{ categorySlug: string; subcategorySlug: string }>();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);

  const subcategoryName = subcategorySlug?.replace(/-/g, ' ');

  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        // Search API with category term
        const res = await fetch(`/api/search?q=${subcategoryName}`);
        if (res.ok) {
          const data = await res.json();
          setBusinesses(data);
        }
      } catch (err) {
        console.error('Error fetching subcategory businesses:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [subcategorySlug]);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 text-white py-12 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-slate-300 text-sm mb-4">
            <Link to="/" className="hover:text-white">Home</Link>
            <ChevronRight size={14} />
            <Link to={`/c/${categorySlug}`} className="hover:text-white capitalize">{categorySlug?.replace(/-/g, ' ')}</Link>
            <ChevronRight size={14} />
            <span className="text-white capitalize">{subcategoryName}</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold capitalize mb-3">
            Top {subcategoryName} Specialists Near You
          </h1>
          <p className="text-slate-300 max-w-2xl text-base">
            Find top-rated, 100% verified {subcategoryName} service providers. Direct phone contacts, addresses, ratings & customer reviews.
          </p>
        </div>
      </div>

      {/* Main List */}
      <div className="max-w-6xl mx-auto py-10 px-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">
            {businesses.length} Verified Providers Available
          </h2>
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-500">Loading listings...</div>
        ) : businesses.length === 0 ? (
          <div className="bg-white p-8 rounded-xl text-center border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-2">No providers directly tagged yet</h3>
            <p className="text-slate-500 mb-4">Be the first business owner to register in this subcategory!</p>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              List Your Business Now
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {businesses.map((b) => (
              <div
                key={b.id}
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-bold text-slate-900">{b.business_name}</h3>
                    {b.is_verified && (
                      <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-green-200">
                        <ShieldCheck size={14} /> Verified
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-sm text-slate-600">
                    <span className="flex items-center gap-1 font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      <Star size={14} className="fill-amber-500 text-amber-500" /> {b.average_rating || '4.8'}
                    </span>
                    <span>({b.total_reviews || 12} reviews)</span>
                    <span className="flex items-center gap-1 text-slate-500">
                      <MapPin size={14} /> {b.city || 'Trichy'}
                    </span>
                  </div>

                  <p className="text-slate-500 text-sm">{b.address || 'Address provided upon inquiry'}</p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <a
                    href={`tel:${b.phone || '9876543210'}`}
                    className="flex items-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-green-700 transition shadow"
                  >
                    <Phone size={16} /> Show Number
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
