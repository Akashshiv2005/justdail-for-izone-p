import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { Search, MapPin, Star, CheckCircle, Phone, MessageCircle, ArrowRight, HelpCircle, Globe, ChevronRight, ThumbsUp, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import SEOHead from '../components/common/SEOHead';

export default function LandingPage() {
  const { category, city, area } = useParams<{ category?: string; city?: string; area?: string }>();
  const [searchParams] = useSearchParams();

  const qCategory = category || searchParams.get('category') || 'Restaurants';
  const qCity = city || searchParams.get('city') || 'Trichy';
  const qArea = area || searchParams.get('area') || '';

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({
      category: qCategory,
      city: qCity,
    });
    if (qArea) params.append('area', qArea);

    fetch(`/api/seo/landing-page?${params.toString()}`)
      .then(res => res.json())
      .then(resData => {
        setData(resData);
        setLoading(false);
        setData(resData);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [qCategory, qCity, qArea]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const meta = data?.meta || {};
  const businesses = data?.businesses || [];
  const faqs = meta.faqs || [];
  const breadcrumbs = data?.breadcrumbs || [];
  const schemas = data?.schemas || [];
  const related_searches = data?.related_searches || [];
  const nearby_areas = data?.nearby_areas || [];

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-16">
      <SEOHead 
        title={meta.title} 
        description={meta.description} 
        canonical={meta.canonical}
        ogTitle={meta.og_title}
        ogDescription={meta.og_description}
        schemas={schemas}
      />
      {/* Header / Hero Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-slate-900 text-white py-12 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumb Navigation */}
          <nav className="text-xs text-blue-200 mb-4 flex items-center gap-2 flex-wrap">
            {breadcrumbs.map((bc: any, idx: number) => (
              <React.Fragment key={idx}>
                <Link to={bc.url} className="hover:underline hover:text-white transition-colors">{bc.name}</Link>
                {idx < breadcrumbs.length - 1 && <ChevronRight size={12} className="opacity-50" />}
              </React.Fragment>
            ))}
          </nav>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
            {meta.heading || `Top ${qCategory} in ${qCity}`}
          </h1>
          <p className="text-blue-100 max-w-3xl text-sm sm:text-base leading-relaxed">
            {meta.description}
          </p>

          <div className="mt-6 flex flex-wrap gap-4 text-xs font-semibold">
            <span className="bg-blue-800/80 px-3 py-1.5 rounded-full border border-blue-600/50">
              Verified Listings: {businesses.length}
            </span>
            <span className="bg-blue-800/80 px-3 py-1.5 rounded-full border border-blue-600/50">
              ⚡ Instant Contact Options
            </span>
            <span className="bg-blue-800/80 px-3 py-1.5 rounded-full border border-blue-600/50">
              â­ Ratings & User Reviews
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Listings Section */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Popular {qCategory} in {qCity}
          </h2>

          {/* Filter Bar */}
          <div className="flex gap-3 mb-6 overflow-x-auto pb-2 no-scrollbar">
            <button className="px-4 py-1.5 border border-slate-300 rounded-full text-sm font-medium whitespace-nowrap hover:bg-slate-50 flex items-center gap-1">Sort by <span className="text-xs">▼</span></button>
            <button className="px-4 py-1.5 border border-slate-300 rounded-full text-sm font-medium whitespace-nowrap hover:bg-slate-50 flex items-center gap-1"><Zap size={14} className="fill-current text-slate-700"/> Quick Response</button>
            <button className="px-4 py-1.5 border border-slate-300 rounded-full text-sm font-medium whitespace-nowrap hover:bg-slate-50 flex items-center gap-1"><Star size={14} className="fill-current"/> Top Rated</button>
            <button className="px-4 py-1.5 border border-blue-200 bg-blue-50 text-blue-700 rounded-full text-sm font-bold whitespace-nowrap hover:bg-blue-100 flex items-center gap-1">✓ Jd Verified</button>
            <button className="px-4 py-1.5 border border-blue-200 text-blue-600 rounded-full text-sm font-bold whitespace-nowrap hover:bg-blue-50 flex items-center gap-1">% Deals</button>
            <button className="px-4 py-1.5 border border-yellow-200 text-yellow-600 rounded-full text-sm font-bold whitespace-nowrap hover:bg-yellow-50 flex items-center gap-1">ðŸ† Jd Trust</button>
            <button className="px-4 py-1.5 border border-slate-300 rounded-full text-sm font-medium whitespace-nowrap hover:bg-slate-50 flex items-center gap-1">Ratings <span className="text-xs">▼</span></button>
            <button className="px-4 py-1.5 border border-slate-300 rounded-full text-sm font-medium whitespace-nowrap hover:bg-slate-50 flex items-center gap-1">â˜· All Filters</button>
          </div>

          {businesses.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-500">
              No matching listings found for this search.
            </div>
          ) : (
            businesses.map((b: any) => (
              <motion.div 
                key={b.id} 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm hover:shadow-md transition-all relative overflow-hidden"
              >
                <div className="absolute top-2 right-4 text-xs text-slate-500 flex items-center gap-1">
                  Previously Connected â“˜
                </div>

                <div className="flex flex-col md:flex-row gap-6 mt-4">
                  {/* Left: Image Carousel Placeholder */}
                  <div className="w-full md:w-56 h-40 bg-slate-200 rounded shrink-0 relative overflow-hidden flex items-center justify-center">
                    {b.logo_url ? (
                      <img src={b.logo_url} alt={b.business_name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-slate-400 font-medium">No Image</div>
                    )}
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1 rounded">
                      <ChevronRight size={16} />
                    </div>
                  </div>

                  {/* Right: Info */}
                  <div className="flex-1">
                    <Link to={`/business/${b.slug || b.id}`} className="text-xl font-bold text-slate-900 hover:text-blue-600 flex items-center gap-2">
                      <span className="bg-slate-800 text-white rounded-full p-1"><ThumbsUp size={14} /></span>
                      {b.business_name}
                    </Link>

                    <div className="flex items-center gap-3 mt-2 flex-wrap">
                      <span className="bg-green-600 text-white text-sm font-bold px-2 py-0.5 rounded flex items-center">
                        {b.average_rating || 4.5} <Star size={12} className="ml-1 fill-white" />
                      </span>
                      <span className="text-sm text-slate-600">
                        {b.total_reviews || 12} Ratings
                      </span>
                      <span className="flex items-center text-xs font-semibold text-orange-500 bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                        <Search size={10} className="mr-1" /> Top Search
                      </span>
                    </div>

                    <p className="text-sm text-slate-700 mt-3 flex items-center gap-1">
                      <MapPin size={14} className="text-slate-400" /> {b.address || `${b.area}, ${b.city}`}
                    </p>

                    <div className="flex gap-2 mt-2 flex-wrap">
                      <span className="text-xs text-slate-600 bg-slate-100 px-2 py-1 rounded">{qCategory}-Samsung</span>
                      <span className="text-xs text-slate-600 bg-slate-100 px-2 py-1 rounded">{qCategory}</span>
                    </div>

                    <div className="mt-3 text-orange-600 text-sm font-semibold flex items-center gap-1">
                      <Zap size={14} className="fill-current" /> High call pick up rate
                    </div>

                    <div className="flex flex-wrap items-center gap-3 mt-4">
                      {b.phone && (
                        <a href={`tel:${b.phone}`} className="px-4 py-2 bg-green-600 text-white text-sm font-bold rounded flex items-center gap-2 hover:bg-green-700">
                          <Phone size={16} fill="currentColor" /> {b.phone}
                        </a>
                      )}
                      {b.whatsapp && (
                        <a href={`https://wa.me/${b.whatsapp}`} target="_blank" rel="noreferrer" className="px-4 py-2 bg-white border border-green-500 text-green-600 text-sm font-bold rounded flex items-center gap-2 hover:bg-green-50">
                          <MessageCircle size={16} /> WhatsApp
                        </a>
                      )}
                      <button className="px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded flex items-center gap-2 hover:bg-blue-700 ml-auto md:ml-0">
                        <MessageCircle size={16} /> Get Best Deal
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}

          {/* Dynamic FAQ Section for SEO Schema */}
          {faqs.length > 0 && (
            <div className="mt-12 bg-white rounded-2xl p-6 border border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <HelpCircle className="text-blue-600" size={20} /> Frequently Asked Questions
              </h3>
              <div className="space-y-4">
                {faqs.map((faq: any, idx: number) => (
                  <div key={idx} className="border-b border-slate-100 pb-3 last:border-0">
                    <h4 className="text-sm font-bold text-slate-800 mb-1">{faq.question}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Internal Linking */}
        <div className="space-y-6">
          {/* Lead Gen Sidebar */}
          <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm sticky top-6">
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Get the List of Top <span className="text-blue-600">{qCategory}</span>
            </h3>
            <p className="text-xs text-slate-500 mb-6">We'll send you contact details in seconds for free</p>

            <form className="space-y-4" onSubmit={e => e.preventDefault()}>
              <div>
                <p className="text-sm font-semibold text-slate-800 mb-3">Which type of Phone are you looking for?</p>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="radio" name="phone_type" className="text-blue-600" defaultChecked />
                    Android
                  </label>
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="radio" name="phone_type" className="text-blue-600" />
                    Iphone
                  </label>
                </div>
              </div>

              <div className="pt-2 relative">
                <input type="text" placeholder="Name" className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded text-sm focus:outline-none focus:border-blue-500" />
                <span className="absolute left-3 top-4.5 text-slate-400"></span>
              </div>
              
              <div className="relative">
                <input type="tel" placeholder="Mobile Number" className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded text-sm focus:outline-none focus:border-blue-500" />
                <span className="absolute left-3 top-2.5 text-slate-400"></span>
              </div>

              <button className="w-full bg-blue-600 text-white font-bold py-3 rounded mt-2 hover:bg-blue-700 transition">
                Send Enquiry
              </button>
            </form>
          </div>

          {related_searches.length > 0 && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 text-blue-600">
                Related Searches in {qCity}
              </h3>
              <div className="flex flex-wrap gap-2">
                {related_searches.map((rs: any, idx: number) => (
                  <Link 
                    key={idx}
                    to={rs.url} 
                    className="text-xs bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-700 px-3 py-1.5 rounded-lg font-medium transition-colors"
                  >
                    {rs.text}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {nearby_areas.length > 0 && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 text-purple-600">
                Nearby Areas
              </h3>
              <div className="flex flex-wrap gap-2">
                {nearby_areas.map((na: any, idx: number) => (
                  <Link 
                    key={idx}
                    to={na.url} 
                    className="text-xs bg-slate-100 hover:bg-purple-50 hover:text-purple-600 text-slate-700 px-3 py-1.5 rounded-lg font-medium transition-colors"
                  >
                    {na.text}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
