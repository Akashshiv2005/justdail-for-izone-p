import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { searchBusinesses } from '../lib/services/api';
import { Star, CheckCircle, Navigation, Phone, Filter, Map, LayoutList, MapPin, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import SearchBar from '../components/common/SearchBar';
import MapView from '../components/common/MapView';
import { useLocationContext } from '../lib/context/LocationContext';

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const cityParam = searchParams.get('city') || '';
  
  const { location } = useLocationContext();
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  // Filters state
  const [maxDistance, setMaxDistance] = useState<number>(50); // Default up to 50km
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  useEffect(() => {
    // Only search after location context has loaded (or failed to load)
    if (location.loading) return;

    setLoading(true);
    const params = new URLSearchParams();
    if (query) params.append('q', query);
    
    // Prioritize context location if it matches the cityParam or if cityParam is empty
    if (location.lat && location.lng && (!cityParam || location.city === cityParam || location.isCustom)) {
      params.append('lat', location.lat.toString());
      params.append('lng', location.lng.toString());
      params.append('radius', maxDistance.toString());
    } else if (cityParam) {
      params.append('city', cityParam);
    } else if (location.city) {
      params.append('city', location.city);
    }

    // Inside useEffect
    const loadResults = async () => {
      try {
        const queryParams: any = {};
        if (query) queryParams.q = query;
        if (location.lat && location.lng && (!cityParam || location.city === cityParam || location.isCustom)) {
          queryParams.lat = location.lat;
          queryParams.lng = location.lng;
          queryParams.radius = maxDistance;
          if (cityParam || location.city) {
             queryParams.city = cityParam || location.city;
          }
        } else if (cityParam) {
          queryParams.city = cityParam;
        } else if (location.city) {
          queryParams.city = location.city;
        }

        const data = await searchBusinesses(queryParams);
        
        let filtered = Array.isArray(data) ? data : [];
        if (verifiedOnly) {
          filtered = filtered.filter((b: any) => b.is_verified);
        }
        setResults(filtered);
      } catch (err) {
        console.error(err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };
    
    loadResults();
  }, [query, cityParam, location.lat, location.lng, location.loading, maxDistance, verifiedOnly]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header / Search Bar */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm py-4">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-4 lg:gap-8">
          <Link to="/" className="text-2xl font-black tracking-tight shrink-0">
            <span className="text-blue-600">Biz</span><span className="text-orange-500">Dial</span>
          </Link>
          <div className="flex-1 w-full max-w-4xl">
            <SearchBar />
          </div>
          <div className="hidden lg:flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
            <button 
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors ${viewMode === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
            >
              <LayoutList size={16} /> List
            </button>
            <button 
              onClick={() => setViewMode('map')}
              className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors ${viewMode === 'map' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
            >
              <Map size={16} /> Map
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex gap-8 h-full">
        
        {/* Filters Sidebar */}
        <div className="hidden xl:block w-64 shrink-0 space-y-6 h-[calc(100vh-140px)] sticky top-[120px] overflow-y-auto custom-scrollbar">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 font-bold text-slate-900 mb-4 pb-4 border-b border-slate-100">
              <Filter size={18} /> Smart Filters
            </div>
            
            <div className="space-y-6">
              {/* Distance Slider */}
              {location.lat && location.lng && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-sm text-slate-800">Distance</h4>
                    <span className="text-xs font-bold text-blue-600">{maxDistance} km</span>
                  </div>
                  <input 
                    type="range" 
                    min="1" 
                    max="50" 
                    value={maxDistance} 
                    onChange={(e) => setMaxDistance(Number(e.target.value))}
                    className="w-full accent-blue-600"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-medium mt-1">
                    <span>1 km</span>
                    <span>50 km</span>
                  </div>
                </div>
              )}
              
              <div className="pt-4 border-t border-slate-100">
                <h4 className="font-semibold text-sm mb-3 text-slate-800">Verified & Premium</h4>
                <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={verifiedOnly} 
                    onChange={(e) => setVerifiedOnly(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500" 
                  />
                  Show Verified Only
                </label>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <h4 className="font-semibold text-sm mb-3 text-slate-800">Sort Priority</h4>
                <div className="text-xs text-slate-500 bg-blue-50 p-3 rounded-lg border border-blue-100 leading-relaxed">
                  Results are intelligently ranked based on <strong>Distance</strong>, <strong>Relevance</strong>, <strong>Ratings</strong>, and <strong>Profile Completion</strong>.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results & Map Container */}
        <div className={`flex-1 flex gap-6 ${viewMode === 'map' ? 'flex-col lg:flex-row-reverse' : 'flex-col'}`}>
          
          {/* Map View */}
          {viewMode === 'map' && (
            <div className="lg:w-1/2 xl:w-7/12 h-[50vh] lg:h-[calc(100vh-140px)] sticky top-[120px] rounded-2xl overflow-hidden shrink-0">
               {loading ? (
                 <div className="w-full h-full bg-slate-200 animate-pulse rounded-2xl flex items-center justify-center text-slate-400">Loading Map...</div>
               ) : (
                 <MapView businesses={results} />
               )}
            </div>
          )}

          {/* Results Feed */}
          <div className={`${viewMode === 'map' ? 'lg:w-1/2 xl:w-5/12 h-[calc(100vh-140px)] overflow-y-auto custom-scrollbar pr-2' : 'w-full'}`}>
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  {loading ? "Detecting location & searching..." : `Top places near you for "${query || cityParam || 'everything'}"`}
                </h1>
                {!loading && (
                  <p className="text-slate-500 mt-1 flex items-center gap-2">
                    Found {results.length} results 
                    {location.city && <span>in <strong className="text-slate-700">{location.city}</strong></span>}
                  </p>
                )}
              </div>
              
              {/* Mobile View Toggle */}
              <div className="lg:hidden flex items-center gap-2 bg-slate-100 p-1 rounded-xl w-fit">
                <button onClick={() => setViewMode('list')} className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors ${viewMode === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}><LayoutList size={16} /></button>
                <button onClick={() => setViewMode('map')} className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors ${viewMode === 'map' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}><Map size={16} /></button>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : results.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                  <Search size={32} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">No results found nearby</h3>
                <p className="text-slate-500 mb-6">We expanded the search radius but couldn't find matching businesses.</p>
                <button onClick={() => setMaxDistance(50)} className="bg-blue-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-blue-700">Search Wider Area</button>
              </div>
            ) : (
              <div className="space-y-4 pb-12">
                {results.map((biz, index) => (
                  <motion.div 
                    key={biz.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-lg transition-all flex flex-col sm:flex-row gap-5 relative overflow-hidden group"
                  >
                    {/* Verified Highlight */}
                    {biz.is_verified && <div className="absolute top-0 left-0 w-1.5 h-full bg-green-500"></div>}
                    
                    {/* Logo Image */}
                    <div className="w-full sm:w-40 h-40 rounded-xl overflow-hidden shrink-0 border border-slate-100 bg-slate-50 flex items-center justify-center relative">
                      {biz.logo_url ? (
                        <img src={biz.logo_url} alt={biz.business_name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <span className="text-slate-300 font-bold text-3xl">{biz.business_name.charAt(0)}</span>
                      )}
                      
                      {biz.distance !== null && biz.distance !== undefined && (
                        <div className="absolute bottom-2 left-2 right-2 bg-white/90 backdrop-blur-sm rounded-lg py-1 px-2 text-center shadow-sm border border-slate-100">
                          <span className="text-xs font-black text-blue-700">{biz.distance} km</span> <span className="text-[10px] font-semibold text-slate-500">away</span>
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 flex flex-col">
                      <div className="flex items-start justify-between mb-2 gap-4">
                        <div>
                          <Link to={`/business/${biz.slug || biz.id}`} className="text-lg font-bold text-slate-900 flex flex-wrap items-center gap-2 group-hover:text-blue-600 transition-colors leading-tight mb-1.5">
                            {biz.business_name}
                            {biz.is_verified && <span title="Verified Business"><CheckCircle size={16} className="text-green-500 fill-green-50" /></span>}
                          </Link>
                          <div className="flex flex-wrap items-center gap-2 text-xs">
                            <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-semibold">{biz.category}</span>
                            <span className="text-slate-500 flex items-center gap-1 font-medium"><MapPin size={12} className="text-slate-400" /> {biz.address || biz.area || biz.city}</span>
                          </div>
                        </div>
                        
                        {/* Rating Badge */}
                        <div className="flex flex-col items-end shrink-0">
                          <div className="flex items-center gap-1 bg-green-600 text-white px-2 py-1 rounded-md font-bold text-sm shadow-sm">
                            {biz.average_rating} <Star size={12} className="fill-current" />
                          </div>
                          <span className="text-[10px] text-slate-500 mt-1 font-semibold">{biz.total_reviews} Reviews</span>
                        </div>
                      </div>

                      <p className="text-slate-600 text-xs mt-2 line-clamp-2 leading-relaxed">
                        {biz.description}
                      </p>

                      <div className="mt-auto pt-4 flex flex-wrap items-center gap-2">
                        <button className="flex-1 min-w-[120px] bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm">
                          <Phone size={14} /> Call Now
                        </button>
                        {(biz.google_map_url || (biz.latitude && biz.longitude)) && (
                          <a 
                            href={biz.google_map_url || `https://www.google.com/maps/search/?api=1&query=${biz.latitude},${biz.longitude}`}
                            target="_blank"
                            rel="noreferrer"
                            className="flex-1 min-w-[120px] bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                          >
                            <Navigation size={14} className="text-blue-500" /> Directions
                          </a>
                        )}
                        <Link to={`/business/${biz.slug || biz.id}`} className="flex-1 min-w-[120px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-colors">
                          View Details
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
