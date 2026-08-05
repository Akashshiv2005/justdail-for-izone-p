import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Loader2, Navigation } from 'lucide-react';
import { useLocationContext } from '../../lib/context/LocationContext';
import { motion, AnimatePresence } from 'framer-motion';

const BASE = '';

interface Suggestion {
  type: 'category' | 'business';
  text: string;
}

export default function SearchBar() {
  const { location, detectLocation, setCustomLocation } = useLocationContext();
  
  const [query, setQuery] = useState('');
  const [cityInput, setCityInput] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (location.city && !location.isCustom) {
      setCityInput(location.city);
    }
  }, [location.city, location.isCustom]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  // Fetch suggestions
  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }
    
    const fetchSuggestions = async () => {
      setLoadingSuggestions(true);
      try {
        const res = await fetch(`${BASE}/api/search/suggestions?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          setSuggestions(data);
        }
      } catch (err) {
        console.error(err);
      }
      setLoadingSuggestions(false);
    };

    const debounce = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  const handleSearch = () => {
    // If the user typed a different city, set it as custom
    if (cityInput && cityInput !== location.city) {
      setCustomLocation(cityInput);
    }
    
    // Redirect to search results
    let url = `/search?q=${encodeURIComponent(query)}`;
    if (cityInput) url += `&city=${encodeURIComponent(cityInput)}`;
    window.location.href = url;
  };

  const handleSuggestionClick = (text: string) => {
    setQuery(text);
    setShowSuggestions(false);
    // trigger search immediately
    setTimeout(() => {
      let url = `/search?q=${encodeURIComponent(text)}`;
      if (cityInput) url += `&city=${encodeURIComponent(cityInput)}`;
      window.location.href = url;
    }, 50);
  };

  return (
    <div ref={wrapperRef} className="relative z-50">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.6, delay: 0.4 }} 
        className="bg-white/90 backdrop-blur-2xl p-2.5 rounded-[1.5rem] shadow-2xl shadow-blue-900/10 border border-white/60 flex flex-col md:flex-row items-center gap-2 max-w-4xl mx-auto w-full hover:bg-white transition-all duration-500 relative z-20"
      >
        {/* Keyword Search */}
        <div className="flex-1 flex items-center gap-3 px-4 py-3 border-b md:border-b-0 md:border-r border-slate-300/30 w-full hover:bg-slate-50 transition-colors rounded-xl relative">
          <Search size={22} className="text-blue-600 shrink-0" />
          <div className="flex flex-col w-full text-left">
            <span className="text-[11px] font-bold text-slate-800">What are you looking for?</span>
            <input 
              type="text" 
              value={query}
              onChange={(e) => { setQuery(e.target.value); setShowSuggestions(true); }}
              onFocus={() => { if (query.length >= 2) setShowSuggestions(true); }}
              placeholder="E.g. Restaurants, Mobile Shops" 
              className="w-full outline-none text-sm text-slate-900 bg-transparent placeholder-slate-500 font-semibold mt-0.5" 
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          
          {loadingSuggestions && <Loader2 className="animate-spin text-slate-400 absolute right-4 top-1/2 -translate-y-1/2" size={16} />}
        </div>

        {/* Location Search */}
        <div className="flex-1 flex items-center gap-3 px-4 py-3 w-full hover:bg-slate-50 transition-colors rounded-xl">
          <MapPin size={22} className="text-orange-500 shrink-0" />
          <div className="flex flex-col w-full text-left">
            <span className="text-[11px] font-bold text-slate-800">Location</span>
            <input 
              type="text" 
              value={cityInput}
              onChange={(e) => setCityInput(e.target.value)}
              placeholder="Enter city or area" 
              className="w-full outline-none text-sm text-slate-900 bg-transparent placeholder-slate-500 font-semibold mt-0.5" 
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
        </div>

        {/* Search Buttons */}
        <div className="w-full md:w-auto flex flex-col sm:flex-row items-center gap-2 shrink-0">
          <button 
            onClick={() => detectLocation()}
            className="w-full sm:w-auto px-4 py-4 bg-white border border-slate-200 hover:bg-orange-50 hover:border-orange-200 hover:text-orange-600 text-slate-700 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            {location.loading ? <Loader2 size={18} className="animate-spin" /> : <Navigation size={18} />} Near Me
          </button>
          <button 
            onClick={handleSearch}
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30"
          >
            <Search size={18} /> Search
          </button>
        </div>
      </motion.div>

      {/* Auto-suggest Dropdown */}
      <AnimatePresence>
        {showSuggestions && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-slate-100 overflow-hidden z-50 max-w-xl mx-auto md:ml-4"
          >
            <ul className="py-2">
              {suggestions.map((s, idx) => (
                <li 
                  key={idx}
                  onClick={() => handleSuggestionClick(s.text)}
                  className="px-4 py-2 hover:bg-blue-50 cursor-pointer flex items-center gap-3 transition-colors"
                >
                  <Search size={14} className="text-slate-400" />
                  <span className="text-sm font-semibold text-slate-800">{s.text}</span>
                  <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded ml-auto">
                    {s.type}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
