import { motion, useScroll, useTransform } from 'framer-motion';
import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, MapPin, ChevronDown, Bell, MessageSquare, 
  Star, Phone, CheckCircle, Smartphone, Home as HomeIcon, 
  Briefcase, GraduationCap, Car, Package, Plus, User as UserIcon,
  Building, Users, ShieldCheck, ThumbsUp, ArrowRight,
  Monitor, Headphones, Quote,
  FileText, Zap, BarChart, Settings, Award, TrendingUp, Compass,
  ChevronLeft, ChevronRight, Share2, Heart, Activity, Zap as ZapIcon,
  Menu, X
} from 'lucide-react';
import { useHomeData } from '../lib/hooks/useHomeData';
import SearchBar from '../components/common/SearchBar';
import Navbar from '../components/common/Navbar';

const Home = () => {
  const { data, loading, error } = useHomeData();
  const videoContainerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: videoContainerRef,
    offset: ["start end", "end start"]
  });
  const videoScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1.1, 0.8]);
  const videoOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.4, 1, 1, 0.4]);

  const [showAllCategories, setShowAllCategories] = useState(false);
  const [showAllFeatured, setShowAllFeatured] = useState(false);
  const [userLocation, setUserLocation] = useState('Detecting...');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
            const data = await res.json();
            const city = data.address?.city || data.address?.town || data.address?.village || data.address?.county || 'Unknown Location';
            setUserLocation(city);
          } catch (e) {
            console.error("Error fetching city", e);
            setUserLocation('your area');
          }
        },
        (error) => {
          console.error("Error getting location", error);
          setUserLocation('your area');
        }
      );
    } else {
      setUserLocation('your area');
    }
  }, []);

  const categories = data?.categories ?? [];
  const featuredBusinesses = data?.featured_businesses ?? [];
  const topPicks = data?.top_picks ?? [];
  const testimonials = data?.testimonials ?? [];
  const apiBrands = data?.brands ?? [];
  const brandNames = ["Trichy Saratha's", "Pothys", "The Chennai Silks", "Saravana Stores", "RmKV Silks", "Nalli Silks", "Jayachandran Textiles", "Ramraj Cotton", "Naidu Hall", "Sundari Silks", "Kumaran Silks", "Sri Kumaran Silks", "Sri Ganapathy Silks", "SMR Silks", "Sreeleathers", "Seematti", "Kalyan Silks", "Aachi Apparel & Silks", "Thangamayil Textiles", "RMK Textiles", "Co-optex", "Nallappa Silks", "J V Textiles", "Malar Silks", "Prisma Legwear", "Sri Nachammai Cotton", "Rajapalayam Textile Showrooms", "Vinaayak Fabrics", "Colombo Stores", "KnK Fashions"];
  const colors = ['text-blue-500', 'text-purple-500', 'text-orange-500', 'text-green-500', 'text-pink-500'];
  const defaultBrands = brandNames.map((name, i) => ({ id: i, name, color: colors[i % colors.length] }));
  const brands = apiBrands.length > 0 ? apiBrands : defaultBrands;
  const fallbackStats = { businesses: '15 Lakh', reviews: '10 Lakh', cities: '500', users: '30 Lakh' };
  const stats = (data?.stats && data.stats.businesses > 10) ? data.stats : fallbackStats;

  const staticCategories = [
    { name: 'Shopping', slug: 'shopping', icon: '🛍️' },
    { name: 'Restaurants & Food', slug: 'restaurants-food', icon: '🍔' },
    { name: 'Healthcare', slug: 'healthcare', icon: '🏥' },
    { name: 'Hotels & Travel', slug: 'hotels-travel', icon: '🏨' },
    { name: 'Beauty & Wellness', slug: 'beauty-wellness', icon: '💆' },
    { name: 'Home Services', slug: 'home-services', icon: '🔧' },
    { name: 'Automotive', slug: 'automotive', icon: '🚗' },
    { name: 'Education', slug: 'education', icon: '🎓' },
    { name: 'Real Estate', slug: 'real-estate', icon: '🏢' },
    { name: 'Professional Services', slug: 'professional-services', icon: '💼' },
    { name: 'IT & Software', slug: 'it-software', icon: '💻' },
    { name: 'Electronics', slug: 'electronics', icon: '📱' },
    { name: 'Finance', slug: 'finance', icon: '💰' },
    { name: 'Legal Services', slug: 'legal-services', icon: '⚖️' },
    { name: 'Construction', slug: 'construction', icon: '🏗️' },
    { name: 'Industrial', slug: 'industrial', icon: '🏭' },
    { name: 'Fitness & Sports', slug: 'fitness-sports', icon: '🏋️' },
    { name: 'Event Planning', slug: 'event-planning', icon: '🎉' },
    { name: 'Pet Care', slug: 'pet-care', icon: '🐾' },
    { name: 'Advertising & Media', slug: 'advertising-media', icon: '📢' },
    { name: 'Transport & Logistics', slug: 'transport-logistics', icon: '🚚' },
    { name: 'Agriculture', slug: 'agriculture', icon: '🌱' },
    { name: 'Arts & Entertainment', slug: 'arts-entertainment', icon: '🎨' },
    { name: 'Public Services', slug: 'public-services', icon: '🏛️' },
  ];

  const visibleCategories = showAllCategories ? staticCategories : staticCategories.slice(0, 16);



  return (
    <div className="min-h-screen bg-white font-sans text-slate-800 overflow-x-hidden">
      


      {/* 2. Main Header */}
      <Navbar />

      {/* 3. Hero Section */}
      <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-50px' }} transition={{ duration: 0.5 }} className="relative bg-gradient-to-br from-indigo-50 via-blue-100 to-orange-50 overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-32">
        <div 
          className="absolute inset-0 z-0 opacity-20 mix-blend-overlay"
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1596708688407-7cebc962f9eb?auto=format&fit=crop&w=1920&q=80')",
            backgroundSize: 'cover',
            backgroundPosition: 'center bottom',
          }}
        />
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute top-40 -left-40 w-[500px] h-[500px] bg-orange-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-white to-transparent z-10" />

        <div className="max-w-[1400px] mx-auto px-4 lg:px-8 relative z-20 flex flex-col lg:flex-row items-center justify-between gap-12">
          
          <div className="flex-1 w-full text-center lg:text-left mt-8 lg:mt-0">
            <motion.h1 
              initial={{ opacity: 0, scale: 0.9 }} 
              animate={{ opacity: 1, scale: 1 }} 
              transition={{ duration: 0.7, type: "spring" }} 
              className="text-3xl sm:text-4xl md:text-5xl lg:text-[64px] font-extrabold tracking-tight text-slate-900 mb-6 leading-[1.1] relative z-20 break-words"
            >
              Find. Connect. Grow<br/>
              All Local, All in <span className="text-blue-600 drop-shadow-md">Biz</span><span className="text-orange-500 drop-shadow-md">Dial</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-lg text-slate-700 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed font-semibold relative z-20">
              India's most trusted local search platform to find<br/>the best businesses near you.
            </motion.p>

            {/* Search Box (Dynamic SearchBar Component) */}
            <div className="mb-6 relative z-20 mx-auto lg:mx-0 max-w-3xl">
              <SearchBar />
            </div>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
              <span className="text-[11px] font-bold text-slate-900 mr-2">Popular Searches:</span>
              {['Restaurants', 'Hospitals', 'Mobile Shops', 'Gyms', 'Beauty Salons', 'Electricians', 'More'].map((tag) => (
                <span key={tag} className="px-4 py-1.5 bg-white rounded-full text-[11px] font-semibold text-slate-600 hover:text-blue-600 cursor-pointer transition-colors shadow-sm border border-slate-100">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="hidden lg:flex flex-col gap-5 items-end lg:pr-8 shrink-0 relative z-20">
            <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="bg-white/40 backdrop-blur-xl border border-white/50 px-6 py-4 rounded-2xl shadow-xl shadow-blue-900/10 flex items-center gap-4 w-[280px] animate-float relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent pointer-events-none"></div>
              <div className="w-12 h-12 bg-white/60 text-blue-600 rounded-xl flex items-center justify-center shrink-0 shadow-inner relative z-10 border border-white/40">
                <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}>
                  <Building size={24} strokeWidth={2.5} />
                </motion.div>
              </div>
              <div className="relative z-10">
                <p className="font-extrabold text-lg text-slate-900 leading-none mb-1">15+ Lakh</p>
                <p className="text-xs font-bold text-slate-700">Businesses</p>
              </div>
            </motion.div>
            
            <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.4 }} className="bg-white/40 backdrop-blur-xl border border-white/50 px-6 py-4 rounded-2xl shadow-xl shadow-blue-900/10 flex items-center gap-4 w-[280px] animate-float-delayed relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent pointer-events-none"></div>
              <div className="w-12 h-12 bg-white/60 text-green-600 rounded-xl flex items-center justify-center shrink-0 shadow-inner relative z-10 border border-white/40">
                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}>
                  <Star size={24} strokeWidth={2.5} />
                </motion.div>
              </div>
              <div className="relative z-10">
                <p className="font-extrabold text-lg text-slate-900 leading-none mb-1">10+ Lakh</p>
                <p className="text-xs font-bold text-slate-700">Happy Reviews</p>
              </div>
            </motion.div>
            
            <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.6 }} className="bg-white/40 backdrop-blur-xl border border-white/50 px-6 py-4 rounded-2xl shadow-xl shadow-blue-900/10 flex items-center gap-4 w-[280px] animate-float-slow relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent pointer-events-none"></div>
              <div className="w-12 h-12 bg-white/60 text-orange-600 rounded-xl flex items-center justify-center shrink-0 shadow-inner relative z-10 border border-white/40">
                <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}>
                  <UserIcon size={24} strokeWidth={2.5} />
                </motion.div>
              </div>
              <div className="relative z-10">
                <p className="font-extrabold text-lg text-slate-900 leading-none mb-1">Trusted by</p>
                <p className="text-xs font-bold text-slate-700">30+ Lakh Users</p>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>



      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 pb-20">
        
        {/* 4. Browse by Top Categories */}
        <motion.section id="categories" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-50px' }} transition={{ duration: 0.5 }} className="mb-16 mt-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-[22px] font-bold text-slate-900">Browse by Top Categories</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {visibleCategories.map((cat, i) => (
              <Link 
                key={i} 
                to={`/c/${cat.slug || cat.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`} 
                className="flex items-center gap-4 p-3 bg-white border border-slate-100 rounded-xl hover:shadow-md hover:border-blue-200 transition-all duration-300 cursor-pointer group"
              >
                <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-xl group-hover:scale-110 transition-transform duration-300 shrink-0">
                  {cat.icon && !cat.icon.match(/^[a-zA-Z]+$/) ? cat.icon : '✨'}
                </div>
                <span className="text-sm font-semibold text-slate-700 group-hover:text-blue-600 transition-colors">{cat.name}</span>
              </Link>
            ))}
          </div>
          
          <div className="mt-8 flex justify-center">
            <button 
              onClick={() => setShowAllCategories(!showAllCategories)}
              className="px-6 py-2.5 bg-blue-50 text-blue-600 font-bold rounded-xl hover:bg-blue-100 transition-colors flex items-center gap-2"
            >
              {showAllCategories ? (
                <>Show Less <ChevronDown className="rotate-180 transition-transform" size={16} /></>
              ) : (
                <>Show All Categories <ChevronDown className="transition-transform" size={16} /></>
              )}
            </button>
          </div>
        </motion.section>

        {/* 5. Stats Row (Light Blue) */}
        <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-50px' }} transition={{ duration: 0.5 }} className="bg-slate-50 rounded-2xl p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20 relative overflow-hidden border border-slate-100 hover:shadow-xl transition-shadow duration-500 animate-fade-in-up delay-200">
          <div className="flex items-center gap-4 z-10 hover:scale-105 transition-transform duration-300 cursor-default">
            <div className="w-14 h-14 bg-white shadow-sm text-blue-600 rounded-full flex items-center justify-center shrink-0 border border-slate-100"><Building size={24}/></div>
            <div>
              <p className="font-extrabold text-[22px] text-slate-900 leading-tight">{stats.businesses ? `${stats.businesses}+` : '0'}</p>
              <p className="text-xs font-bold text-slate-800">Businesses</p>
              <p className="text-[10px] text-slate-500">Listed on BizDial</p>
            </div>
          </div>
          <div className="flex items-center gap-4 z-10 md:border-l border-slate-200 md:pl-6 pt-4 md:pt-0">
            <div className="w-14 h-14 bg-white shadow-sm text-blue-500 rounded-full flex items-center justify-center shrink-0 border border-slate-100"><MessageSquare size={24}/></div>
            <div>
              <p className="font-extrabold text-[22px] text-slate-900 leading-tight">{stats.reviews ? `${stats.reviews}+` : '0'}</p>
              <p className="text-xs font-bold text-slate-800">User Reviews</p>
              <p className="text-[10px] text-slate-500">Trusted & Genuine</p>
            </div>
          </div>
          <div className="flex items-center gap-4 z-10 md:border-l border-slate-200 md:pl-6 pt-4 md:pt-0">
            <div className="w-14 h-14 bg-white shadow-sm text-blue-500 rounded-full flex items-center justify-center shrink-0 border border-slate-100"><MapPin size={24}/></div>
            <div>
              <p className="font-extrabold text-[22px] text-slate-900 leading-tight">{stats.cities ? `${stats.cities}+` : '0'}</p>
              <p className="text-xs font-bold text-slate-800">Cities</p>
              <p className="text-[10px] text-slate-500">Across India</p>
            </div>
          </div>
          <div className="flex items-center gap-4 z-10 md:border-l border-slate-200 md:pl-6 pt-4 md:pt-0">
            <div className="w-14 h-14 bg-white shadow-sm text-blue-500 rounded-full flex items-center justify-center shrink-0 border border-slate-100"><Users size={24}/></div>
            <div>
              <p className="font-extrabold text-[22px] text-slate-900 leading-tight">{stats.users ? `${stats.users}+` : '0'}</p>
              <p className="text-xs font-bold text-slate-800">Happy Users</p>
              <p className="text-[10px] text-slate-500">Every Month</p>
            </div>
          </div>
        </motion.section>

        {/* 6. Are You a Business Owner? */}
        <motion.section id="for-business" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-50px' }} transition={{ duration: 0.5 }} className="bg-white rounded-[3rem] p-10 lg:p-14 flex flex-col md:flex-row items-center justify-between gap-12 mb-20 overflow-hidden relative border border-slate-100 shadow-xl shadow-slate-200/50 group mx-4 lg:mx-0">
          {/* Decorative background elements */}
          <div className="absolute -top-32 -right-32 w-[30rem] h-[30rem] bg-blue-100/50 rounded-full mix-blend-multiply filter blur-[80px] group-hover:bg-blue-200/50 transition-colors duration-700"></div>
          <div className="absolute -bottom-32 -left-32 w-[30rem] h-[30rem] bg-orange-100/50 rounded-full mix-blend-multiply filter blur-[80px] group-hover:bg-orange-200/50 transition-colors duration-700"></div>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]"></div>
          
          <div className="flex-1 relative z-10 text-slate-900">
            <div className="inline-block px-4 py-1.5 bg-blue-50 rounded-full text-blue-600 font-bold text-xs mb-6 border border-blue-100">Grow Your Business</div>
            <h2 className="text-4xl md:text-5xl font-black mb-4 leading-tight">Ready to Expand Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-orange-500">Customer Base?</span></h2>
            <p className="text-slate-500 mb-10 max-w-xl text-lg font-medium">Join thousands of local businesses getting more visibility, quality leads, and faster growth on BizDial.</p>
            
            <div className="grid grid-cols-2 gap-y-8 gap-x-6 mb-10">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white text-blue-600 rounded-2xl flex items-center justify-center shrink-0 border border-slate-100 shadow-md"><MapPin size={22}/></div>
                <div>
                  <h4 className="font-bold text-slate-900 text-base">High Visibility</h4>
                  <p className="text-xs text-slate-500 mt-1">Rank higher in search</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white text-green-500 rounded-2xl flex items-center justify-center shrink-0 border border-slate-100 shadow-md"><TrendingUp size={22}/></div>
                <div>
                  <h4 className="font-bold text-slate-900 text-base">Quality Leads</h4>
                  <p className="text-xs text-slate-500 mt-1">Get more real customers</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white text-purple-500 rounded-2xl flex items-center justify-center shrink-0 border border-slate-100 shadow-md"><BarChart size={22}/></div>
                <div>
                  <h4 className="font-bold text-slate-900 text-base">Business Analytics</h4>
                  <p className="text-xs text-slate-500 mt-1">Track & grow business</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white text-orange-500 rounded-2xl flex items-center justify-center shrink-0 border border-slate-100 shadow-md"><Star size={22}/></div>
                <div>
                  <h4 className="font-bold text-slate-900 text-base">Trusted Platform</h4>
                  <p className="text-xs text-slate-500 mt-1">Reach millions of users</p>
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => {
                const el = document.getElementById('categories');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold text-base transition-all shadow-xl shadow-blue-600/30 flex items-center gap-3 hover:scale-105 transform duration-300"
            >
              List Your Business Now <ArrowRight size={20} className="text-white"/>
            </button>
          </div>
          
          <div className="flex-1 relative z-10 hidden md:flex justify-end items-center perspective-1000">
             <motion.div animate={{ y: [0, -15, 0] }} transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }} className="w-full max-w-[450px] aspect-square relative transform rotate-y-[-5deg] rotate-x-[5deg]">
                <div className="absolute inset-0 bg-white/60 backdrop-blur-xl rounded-3xl border border-white shadow-2xl p-6 flex flex-col justify-between">
                   <div className="flex justify-between items-center mb-6">
                      <div className="flex gap-2"><div className="w-3 h-3 rounded-full bg-red-400"></div><div className="w-3 h-3 rounded-full bg-yellow-400"></div><div className="w-3 h-3 rounded-full bg-green-400"></div></div>
                      <div className="w-1/3 h-2 bg-slate-200 rounded-full"></div>
                   </div>
                   <div className="flex-1 flex items-end gap-4">
                      <div className="w-1/4 h-1/3 bg-gradient-to-t from-blue-200 to-blue-400 rounded-t-lg"></div>
                      <div className="w-1/4 h-2/3 bg-gradient-to-t from-purple-200 to-purple-400 rounded-t-lg"></div>
                      <div className="w-1/4 h-1/2 bg-gradient-to-t from-orange-200 to-orange-400 rounded-t-lg"></div>
                      <div className="w-1/4 h-full bg-gradient-to-t from-blue-400 to-blue-600 rounded-t-lg relative shadow-lg shadow-blue-500/30">
                         <div className="absolute -top-10 -right-6 bg-white text-blue-600 font-bold text-xs px-3 py-1.5 rounded-lg shadow-xl border border-slate-50">+245%</div>
                      </div>
                   </div>
                   <div className="w-full h-1/4 mt-6 bg-slate-50 rounded-xl flex items-center justify-around px-4 border border-slate-100">
                      <div className="w-8 h-8 rounded-full bg-blue-200"></div>
                      <div className="w-8 h-8 rounded-full bg-purple-200"></div>
                      <div className="w-8 h-8 rounded-full bg-orange-200"></div>
                   </div>
                </div>
             </motion.div>
          </div>
        </motion.section>

        {/* 5. Featured Businesses Near You */}
        <motion.section id="services" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-50px' }} transition={{ duration: 0.5 }} className="mb-20 relative">
          
          {/* Background Decorative Elements */}
          <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-violet-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-50 rounded-full mix-blend-multiply filter blur-3xl opacity-50 translate-x-1/3 translate-y-1/3 pointer-events-none"></div>
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6 relative z-10">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-[#8b5cf6] text-white px-3.5 py-1.5 rounded-full text-[11px] font-bold shadow-md shadow-violet-500/30 mb-4">
                <Star size={13} className="fill-white" /> TOP PICKS
              </div>
              <h2 className="text-3xl md:text-[42px] font-black text-slate-900 mb-3 tracking-tight">
                Featured Businesses <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-blue-500">in {userLocation}</span>
              </h2>
            </div>
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition-colors shadow-sm shrink-0 text-sm">
              View All Businesses <ArrowRight size={16} />
            </button>
          </div>
          
          <div className="relative z-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
              {(showAllFeatured ? featuredBusinesses : featuredBusinesses.slice(0, 5)).map((bus, i) => {
                const themes = [
                  {
                    cardBg: 'bg-gradient-to-b from-[#f3e8ff] from-[40%] to-white to-[80%]',
                    badge: 'bg-[#8b5cf6]',
                    text: 'text-[#8b5cf6]',
                    btnSolid: 'bg-[#8b5cf6] hover:bg-violet-600 text-white',
                    btnOutline: 'text-[#8b5cf6] hover:bg-violet-50',
                    Icon: Monitor
                  },
                  {
                    cardBg: 'bg-gradient-to-b from-[#dbeafe] from-[40%] to-white to-[80%]',
                    badge: 'bg-[#3b82f6]',
                    text: 'text-[#3b82f6]',
                    btnSolid: 'bg-[#3b82f6] hover:bg-blue-600 text-white',
                    btnOutline: 'text-[#3b82f6] hover:bg-blue-50',
                    Icon: Activity
                  },
                  {
                    cardBg: 'bg-gradient-to-b from-[#ffedd5] from-[40%] to-white to-[80%]',
                    badge: 'bg-[#f97316]',
                    text: 'text-[#f97316]',
                    btnSolid: 'bg-[#f97316] hover:bg-orange-600 text-white',
                    btnOutline: 'text-[#f97316] hover:bg-orange-50',
                    Icon: Star
                  }
                ];
                const theme = themes[i % themes.length];
                const initials = bus.business_name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase();
                return (
                  <div key={bus.id ?? i} className={`relative rounded-[2rem] border border-white shadow-xl shadow-slate-200/50 hover:-translate-y-2 transition-transform duration-300 overflow-hidden ${theme.cardBg}`}>
                    
                    <div className="h-[170px] w-full relative" style={{ clipPath: 'ellipse(130% 100% at 50% 0%)' }}>
                      <img src={bus.logo_url || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&h=300&fit=crop'} alt={bus.business_name} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/10 mix-blend-overlay"></div>
                      
                      <div className={`absolute top-4 left-4 px-2 py-1 rounded-md text-[9px] font-black tracking-widest text-white flex items-center gap-1 shadow-sm ${theme.badge}`}>
                        <Star size={10} className="fill-white" /> FEATURED
                      </div>
                      <div className="absolute top-4 right-4 w-7 h-7 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-sm">
                        <theme.Icon size={14} className={theme.text} />
                      </div>
                    </div>
                    <div className="relative z-10 flex justify-center -mt-8 mb-3">
                      <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-sm border-[4px] border-white">
                        {bus.logo_url && !bus.logo_url.includes('unsplash') ? (
                          <img src={bus.logo_url} className="w-full h-full rounded-full object-cover" alt="logo" />
                        ) : (
                          <span className={`text-lg font-black ${theme.text}`}>
                            {initials}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="px-4 pb-5 text-center">
                      <h3 className="font-extrabold text-[15px] text-slate-900 mb-0.5 truncate">{bus.business_name}</h3>
                      <p className="text-[11px] text-slate-500 font-medium mb-3">{bus.category}</p>
                      <div className="flex items-center justify-center gap-1.5 mb-3">
                        <span className={`font-bold text-[13px] flex items-center gap-1 ${theme.text}`}>
                          {bus.average_rating} <Star size={12} className="fill-current"/>
                        </span>
                        <span className="text-[11px] text-slate-500 font-medium">({bus.total_reviews} Reviews)</span>
                      </div>
                      <div className="flex flex-col items-center gap-2 mb-5">
                        <p className="text-[11px] text-slate-600 flex items-center gap-1 truncate w-full justify-center">
                          <MapPin size={12} className="text-slate-400 shrink-0"/> <span className="truncate">{bus.address || bus.city || 'Location'}</span>
                        </p>
                        <p className="text-[11px] text-slate-600 font-medium flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> <span className="text-green-600 font-bold">Open</span>
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className={`flex-1 py-2.5 rounded-xl font-bold text-[11px] flex items-center justify-center gap-1.5 transition-colors shadow-sm ${theme.btnSolid}`}>
                          <Phone size={14}/> Call Now
                        </button>
                        <button className={`flex-1 py-2.5 rounded-xl font-bold text-[11px] bg-transparent transition-colors ${theme.btnOutline}`}>
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {featuredBusinesses.length > 5 && (
              <div className="mt-10 flex justify-center">
                <button 
                  onClick={() => setShowAllFeatured(!showAllFeatured)}
                  className="px-8 py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-full hover:bg-slate-50 transition-colors flex items-center gap-2 shadow-sm"
                >
                  {showAllFeatured ? (
                    <>Show Less <ChevronDown className="rotate-180 transition-transform" size={16} /></>
                  ) : (
                    <>View All Businesses <ArrowRight size={16} /></>
                  )}
                  {!showAllFeatured && (
                    <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {featuredBusinesses.length - 5} more
                    </span>
                  )}
                </button>
              </div>
            )}
          </div>
        </motion.section>
        
        {/* 8. How BizDial Works */}
        <motion.section id="how-it-works" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-50px' }} transition={{ duration: 0.5 }} className="mb-24 px-4 py-20 bg-[#f8f9fc] rounded-[2rem] border border-slate-100 mx-4 lg:mx-0 overflow-hidden relative">
          <div className="absolute top-10 left-10 w-32 h-32 opacity-40" style={{backgroundImage: "url(\"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8Y2lyY2xlIGN4PSIyIiBjeT0iMiIgcj0iMSIgZmlsbD0iI2QxZDVkYiIvPjwvc3ZnPg==\")"}}></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 opacity-40" style={{backgroundImage: "url(\"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8Y2lyY2xlIGN4PSIyIiBjeT0iMiIgcj0iMSIgZmlsbD0iI2QxZDVkYiIvPjwvc3ZnPg==\")"}}></div>
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white rounded-full mix-blend-overlay filter blur-3xl opacity-60 translate-x-1/3 -translate-y-1/3"></div>
          <div className="text-center mb-16 relative z-10">
            <p className="text-blue-500 text-[11px] font-black tracking-[0.2em] mb-4 flex items-center justify-center gap-3 uppercase">
              <span className="w-6 h-[2px] bg-blue-500"></span> SIMPLE. FAST. EFFECTIVE <span className="w-6 h-[2px] bg-blue-500"></span>
            </p>
            <h2 className="text-4xl md:text-[44px] font-black text-[#1e293b] mb-4 tracking-tight">How BizDial Works?</h2>
            <p className="text-[15px] font-medium text-slate-500 max-w-lg mx-auto">Find, connect, and grow with businesses in just a few simple steps.</p>
            <div className="w-24 h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-transparent mx-auto mt-6 rounded-full flex justify-end items-center pr-0.5">
              <div className="w-1.5 h-1.5 bg-purple-600 rounded-full"></div>
            </div>
          </div>
          <div className="max-w-[1100px] mx-auto relative mt-12 mb-10">
            <div className="relative w-full h-[400px] hidden md:block">
              <svg className="absolute top-0 left-0 w-full h-[150px]" viewBox="0 0 1000 150" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#e2e8f0" />
                    <stop offset="10%" stopColor="#3b82f6" />
                    <stop offset="30%" stopColor="#a855f7" />
                    <stop offset="50%" stopColor="#10b981" />
                    <stop offset="70%" stopColor="#ec4899" />
                    <stop offset="90%" stopColor="#f97316" />
                    <stop offset="100%" stopColor="#e2e8f0" />
                  </linearGradient>
                  <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                    <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
                  </filter>
                </defs>
                <path id="curvePath" d="M 0 100 Q 50 50 100 50 C 170 50 230 90 300 90 C 370 90 430 40 500 40 C 570 40 630 80 700 80 C 770 80 830 50 900 50 Q 950 50 1000 100" fill="none" stroke="url(#lineGrad)" strokeWidth="2.5" />
                <circle r="6" fill="#ffffff" filter="url(#glow)">
                  <animateMotion dur="7s" repeatCount="indefinite"><mpath href="#curvePath" /></animateMotion>
                </circle>
              </svg>
              {[
                { id: '01', title: 'Search', desc: 'Find any business or service you need instantly.', icon: <Search size={28} className="text-white" />, hex: '#3b82f6', yOffset: 50 },
                { id: '02', title: 'Compare', desc: 'Compare ratings, read reviews, and check services.', icon: <FileText size={28} className="text-white" />, hex: '#a855f7', yOffset: 90 },
                { id: '03', title: 'Connect', desc: 'Call, chat or directly visit the business location.', icon: <Phone size={28} className="text-white" />, hex: '#10b981', yOffset: 40 },
                { id: '04', title: 'Visit', desc: 'Get accurate directions & reach the business easily.', icon: <MapPin size={28} className="text-white" />, hex: '#ec4899', yOffset: 80 },
                { id: '05', title: 'Review', desc: 'Share your experience to help others decide.', icon: <Star size={28} className="text-white" />, hex: '#f97316', yOffset: 50 },
              ].map((step, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 30, scale: 0.95 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true, margin: '-50px' }} transition={{ delay: 0.2 + i * 0.15, duration: 0.35, type: "spring", stiffness: 300, damping: 25 }} className="absolute top-0 w-1/5 h-full flex flex-col items-center" style={{ left: `${i * 20}%` }}>
                  <div className="absolute w-3.5 h-3.5 rounded-full z-20 shadow-md border-[2.5px] border-white" style={{ top: `${step.yOffset - 7}px`, backgroundColor: step.hex }}></div>
                  <div className="absolute z-30" style={{ top: `${step.yOffset + 5}px` }}>
                    <div className="w-[84px] h-[84px] rounded-full bg-white flex items-center justify-center p-2 shadow-xl hover:scale-110 transition-transform duration-300" style={{ boxShadow: `0 15px 35px -10px ${step.hex}60` }}>
                      <div className="w-full h-full rounded-full flex items-center justify-center" style={{ backgroundImage: `linear-gradient(135deg, ${step.hex}ee, ${step.hex})` }}>{step.icon}</div>
                    </div>
                  </div>
                  <div className="absolute w-[85%] p-5 pt-16 pb-7 flex flex-col items-center text-center z-20 backdrop-blur-2xl bg-white/60 border border-white/40 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.05),0_4px_20px_-4px_rgba(0,0,0,0.03)] hover:-translate-y-2 hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.08),0_8px_30px_-8px_rgba(0,0,0,0.05)] transition-all duration-300 rounded-3xl" style={{ top: `${step.yOffset + 55}px`, borderBottom: `6px solid ${step.hex}` }}>
                    <span className="font-extrabold text-[15px] mb-1" style={{ color: step.hex }}>{step.id}</span>
                    <h4 className="font-black text-lg text-slate-900 mb-2.5 tracking-tight">{step.title}</h4>
                    <p className="text-[11px] text-slate-500 font-medium leading-relaxed px-1">{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="flex flex-col gap-12 md:hidden w-full relative pt-10">
              <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-400 via-emerald-400 to-orange-400 rounded-full z-0 opacity-20"></div>
              {[
                { id: '01', title: 'Search', desc: 'Find any business or service you need instantly.', icon: <Search size={28} className="text-white" />, hex: '#3b82f6' },
                { id: '02', title: 'Compare', desc: 'Compare ratings, read reviews, and check services.', icon: <FileText size={28} className="text-white" />, hex: '#a855f7' },
                { id: '03', title: 'Connect', desc: 'Call, chat or directly visit the business location.', icon: <Phone size={28} className="text-white" />, hex: '#10b981' },
                { id: '04', title: 'Visit', desc: 'Get accurate directions & reach the business easily.', icon: <MapPin size={28} className="text-white" />, hex: '#ec4899' },
                { id: '05', title: 'Review', desc: 'Share your experience to help others decide.', icon: <Star size={28} className="text-white" />, hex: '#f97316' },
              ].map((step, i) => (
                <div key={i} className="relative z-10 w-[90%] mx-auto p-6 pt-14 flex flex-col items-center text-center backdrop-blur-2xl bg-white/60 border border-white/40 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.05),0_4px_20px_-4px_rgba(0,0,0,0.03)] rounded-3xl" style={{ borderBottom: `6px solid ${step.hex}` }}>
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2">
                    <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center p-[6px] shadow-xl" style={{ boxShadow: `0 10px 25px -5px ${step.hex}50` }}>
                      <div className="w-full h-full rounded-full flex items-center justify-center" style={{ backgroundColor: step.hex }}>{step.icon}</div>
                    </div>
                  </div>
                  <span className="font-extrabold text-[15px] mb-1" style={{ color: step.hex }}>{step.id}</span>
                  <h4 className="font-black text-xl text-slate-900 mb-2">{step.title}</h4>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* 9. Premium Services for Businesses */}
        <motion.section id="pricing" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-50px' }} transition={{ duration: 0.5 }} className="bg-slate-50 border border-slate-100 rounded-[3rem] p-8 lg:p-14 mb-20 flex flex-col lg:flex-row items-center gap-12 overflow-hidden relative mx-4 lg:mx-0">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]"></div>
          
          <div className="flex-1 w-full text-center lg:text-left z-10">
            <h2 className="text-4xl lg:text-5xl font-black text-slate-900 mb-4 leading-tight">
              Premium Services for<br/>Businesses on <span className="text-blue-600">Biz</span><span className="text-orange-500">Dial</span>
            </h2>
            <p className="text-lg text-slate-500 mb-10 max-w-md mx-auto lg:mx-0 font-medium">Upgrade your business visibility and get discovered by millions of customers in a whole new way.</p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold text-base transition-all flex items-center gap-3 mx-auto lg:mx-0 shadow-xl shadow-blue-600/30 hover:scale-105 transform duration-300">
              Explore Premium Plans <ArrowRight size={20}/>
            </button>
          </div>
          
          <div className="flex-[1.2] w-full flex justify-center items-center py-10 lg:py-0 relative z-10">
             <div className="relative w-80 h-80 md:w-[28rem] md:h-[28rem] rounded-full border border-slate-200/60 bg-white/50 flex items-center justify-center shadow-inner">
                {/* Inner decorative orbit */}
                <div className="absolute inset-12 md:inset-16 rounded-full border border-dashed border-slate-300 opacity-70"></div>
                
                {/* Center Logo */}
                <div className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-full shadow-2xl flex items-center justify-center border-4 border-slate-50 z-20 relative">
                   <div className="text-2xl md:text-3xl font-black"><span className="text-blue-600">Biz</span><span className="text-orange-500">Dial</span></div>
                   <div className="absolute inset-0 rounded-full shadow-[0_0_40px_rgba(37,99,235,0.2)]"></div>
                </div>
                
                {/* Orbiting Elements */}
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 40, ease: "linear" }} className="w-full h-full absolute inset-0">
                   {[
                     { icon: <Award size={24}/>, title: 'Premium Listing', desc: 'Stand out with priority listing', color: 'text-blue-500 bg-blue-50 border-blue-200 shadow-blue-500/20' },
                     { icon: <BarChart size={24}/>, title: 'Analytics', desc: 'Track views & actions', color: 'text-green-500 bg-green-50 border-green-200 shadow-green-500/20' },
                     { icon: <Users size={24}/>, title: 'Lead Management', desc: 'Manage & respond to leads', color: 'text-purple-500 bg-purple-50 border-purple-200 shadow-purple-500/20' },
                     { icon: <Monitor size={24}/>, title: 'Banner Ads', desc: 'Promote with banners', color: 'text-pink-500 bg-pink-50 border-pink-200 shadow-pink-500/20' },
                     { icon: <ShieldCheck size={24}/>, title: 'Verified Badge', desc: 'Build customer trust', color: 'text-orange-500 bg-orange-50 border-orange-200 shadow-orange-500/20' },
                   ].map((item, i) => {
                     const angle = (i * 360) / 5;
                     const rad = (angle * Math.PI) / 180;
                     return (
                        <div key={i} className="absolute" style={{ left: `calc(50% + ${Math.sin(rad) * 50}%)`, top: `calc(50% - ${Math.cos(rad) * 50}%)`, transform: 'translate(-50%, -50%)' }}>
                           <motion.div animate={{ rotate: -360 }} transition={{ repeat: Infinity, duration: 40, ease: "linear" }} className="flex flex-col items-center group cursor-pointer relative">
                              <div className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center shadow-xl border-2 ${item.color} group-hover:scale-110 transition-transform duration-300 bg-white relative z-10`}>
                                 {item.icon}
                              </div>
                              <div className="absolute top-full mt-2 bg-white/90 backdrop-blur-md px-3 py-2 rounded-xl shadow-lg border border-slate-100 w-32 md:w-36 text-center pointer-events-none z-20">
                                 <h4 className="text-[10px] md:text-xs font-bold text-slate-900 mb-0.5">{item.title}</h4>
                                 <p className="text-[8px] md:text-[9px] text-slate-500 leading-tight">{item.desc}</p>
                              </div>
                           </motion.div>
                        </div>
                     );
                   })}
                </motion.div>
             </div>
          </div>
        </motion.section>

        {/* 10. Top Picks For You */}
        <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-50px' }} transition={{ duration: 0.5 }} className="mb-20 relative">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-slate-900">Top Picks for You</h2>
            <a href="#" className="text-blue-600 font-bold text-sm hover:underline flex items-center gap-1">View All Collections <ArrowRight size={16}/></a>
          </div>
          <div className="relative">
             <button className="absolute -left-5 top-1/2 -translate-y-1/2 w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center shadow-lg z-10 text-blue-600 hover:bg-slate-50">
              <ChevronLeft size={20} />
            </button>
            <button className="absolute -right-5 top-1/2 -translate-y-1/2 w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center shadow-lg z-10 text-blue-600 hover:bg-slate-50">
              <ChevronRight size={20} />
            </button>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
              {topPicks.map((pick, i) => {
                const themes = [
                  { cardBg: 'bg-gradient-to-b from-[#f3e8ff] from-[40%] to-white to-[80%]', text: 'text-[#8b5cf6]', btnSolid: 'bg-[#8b5cf6] hover:bg-violet-600 text-white' },
                  { cardBg: 'bg-gradient-to-b from-[#dbeafe] from-[40%] to-white to-[80%]', text: 'text-[#3b82f6]', btnSolid: 'bg-[#3b82f6] hover:bg-blue-600 text-white' },
                  { cardBg: 'bg-gradient-to-b from-[#ffedd5] from-[40%] to-white to-[80%]', text: 'text-[#f97316]', btnSolid: 'bg-[#f97316] hover:bg-orange-600 text-white' },
                  { cardBg: 'bg-gradient-to-b from-[#dcfce7] from-[40%] to-white to-[80%]', text: 'text-[#10b981]', btnSolid: 'bg-[#10b981] hover:bg-emerald-600 text-white' },
                  { cardBg: 'bg-gradient-to-b from-[#fce7f3] from-[40%] to-white to-[80%]', text: 'text-[#ec4899]', btnSolid: 'bg-[#ec4899] hover:bg-pink-600 text-white' },
                ];
                const theme = themes[i % themes.length];
                const initials = pick.title.replace('Best ', '').substring(0, 2).toUpperCase();

                return (
                  <div key={i} className={`relative rounded-[2rem] border border-white shadow-xl shadow-slate-200/50 hover:-translate-y-2 transition-transform duration-300 overflow-hidden ${theme.cardBg}`}>
                    <div className="h-[140px] w-full relative" style={{ clipPath: 'ellipse(130% 100% at 50% 0%)' }}>
                      <img src={pick.img} alt={pick.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/10 mix-blend-overlay"></div>
                    </div>
                    
                    <div className="relative z-10 flex justify-center -mt-8 mb-3">
                      <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-sm border-[4px] border-white">
                        <span className={`text-lg font-black ${theme.text}`}>
                          {initials}
                        </span>
                      </div>
                    </div>

                    <div className="px-4 pb-5 text-center">
                      <h3 className="font-extrabold text-[15px] text-slate-900 mb-1 truncate">{pick.title}</h3>
                      <p className="text-[12px] text-slate-500 font-medium mb-4 flex items-center justify-center gap-1">
                        <Building size={12} className={theme.text} /> {pick.listings}
                      </p>
                      <button className={`w-full py-2.5 rounded-xl font-bold text-[12px] flex items-center justify-center gap-1.5 transition-colors shadow-sm ${theme.btnSolid}`}>
                        View Collection <ArrowRight size={14}/>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.section>


        {/* 12. Powerful Growth Tools */}
        <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-50px' }} transition={{ duration: 0.5 }} className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-3xl p-8 lg:p-12 mb-20 flex flex-col md:flex-row items-center justify-between gap-12 border border-blue-100 shadow-inner group hover:shadow-xl transition-shadow duration-500">
          <div className="flex-1 relative w-full max-w-lg mx-auto md:mx-0 group-hover:-translate-y-2 transition-transform duration-700">
             <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl border border-slate-200">
               <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80" alt="Dashboard" className="w-full h-auto object-cover" />
               <div className="absolute -top-4 -right-4 w-20 h-20 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
               <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-700"></div>
             </div>
          </div>
          
          <div className="flex-[1.2] w-full">
            <h2 className="text-3xl font-black text-slate-900 mb-2 leading-tight">Powerful Growth Tools for Your Business</h2>
            <p className="text-sm text-slate-500 mb-8 max-w-md">Everything you need to grow your business and reach the right audience.</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              <div className="flex items-start gap-4 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center shrink-0"><Monitor size={18}/></div>
                <div>
                  <h4 className="font-bold text-xs text-slate-900 mb-1">Business Dashboard</h4>
                  <p className="text-[10px] text-slate-500">Manage your profile, leads & performance</p>
                </div>
              </div>
              <div className="flex items-start gap-4 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                <div className="w-10 h-10 bg-red-50 text-red-500 rounded-lg flex items-center justify-center shrink-0"><BarChart size={18}/></div>
                <div>
                  <h4 className="font-bold text-xs text-slate-900 mb-1">Customer Insights</h4>
                  <p className="text-[10px] text-slate-500">Understand your customers better</p>
                </div>
              </div>
              <div className="flex items-start gap-4 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                <div className="w-10 h-10 bg-green-50 text-green-500 rounded-lg flex items-center justify-center shrink-0"><TrendingUp size={18}/></div>
                <div>
                  <h4 className="font-bold text-xs text-slate-900 mb-1">Marketing Solutions</h4>
                  <p className="text-[10px] text-slate-500">Promote your business with smart marketing</p>
                </div>
              </div>
              <div className="flex items-start gap-4 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-lg flex items-center justify-center shrink-0"><Headphones size={18}/></div>
                <div>
                  <h4 className="font-bold text-xs text-slate-900 mb-1">Dedicated Support</h4>
                  <p className="text-[10px] text-slate-500">Get help from our expert support team</p>
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => {
                const el = document.getElementById('categories');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-[#6366F1] hover:bg-[#4F46E5] text-white px-8 py-3 rounded-lg font-bold text-sm transition-all shadow-lg shadow-indigo-500/30 flex items-center gap-2"
            >
              List Your Business Now <ArrowRight size={16}/>
            </button>
          </div>
        </motion.section>

        {/* 13. What Our Users Say */}
        <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-50px' }} transition={{ duration: 0.5 }} className="mb-20 px-4 xl:px-0">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-slate-900 mb-3">What Our Users Say</h2>
            <p className="text-sm text-slate-500">Real stories from businesses and customers across India</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((t, i) => (
              <div key={t.id ?? i} className="bg-gradient-to-br from-white to-blue-50 border border-blue-100 rounded-3xl p-8 shadow-md hover:shadow-2xl transition-all duration-300 relative group overflow-hidden flex flex-col transform hover:-translate-y-2">
                <div className="absolute -top-6 -right-6 w-32 h-32 bg-blue-600 rounded-full mix-blend-multiply opacity-5 group-hover:scale-150 transition-transform duration-700"></div>
                <Quote className="text-blue-200 mb-6 w-12 h-12 group-hover:text-blue-400 transition-colors shrink-0" />
                <p className="text-slate-700 text-[13px] font-medium leading-relaxed mb-8 italic relative z-10 flex-1">"{t.text}"</p>
                
                <div className="flex items-center justify-between border-t border-blue-100 pt-5 mt-auto relative z-10">
                  <div className="flex items-center gap-3">
                    <img src={t.avatar_url || 'https://i.pravatar.cc/150?img=1'} alt={t.name} className="w-12 h-12 rounded-full border-2 border-white shadow-md object-cover" />
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{t.name}</h4>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{t.role}</p>
                    </div>
                  </div>
                  <div className="flex text-orange-400 gap-0.5 bg-white px-2 py-1 rounded-full shadow-sm border border-slate-100">
                    {[1,2,3,4,5].map(s => <Star key={s} size={10} className="fill-current"/>)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* 16. Logos */}
        <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-50px' }} transition={{ duration: 0.5 }} className="mb-20 overflow-hidden relative">
          <div className="text-center mb-10">
            <h3 className="text-lg font-bold text-slate-800 mb-2">Trusted by 10,000+ businesses across India</h3>
            <div className="w-16 h-1 bg-blue-600 mx-auto rounded-full"></div>
          </div>
          
          <div className="relative w-full flex flex-col gap-6 overflow-x-hidden border-y border-slate-100 py-10 bg-slate-50/50">
            {/* Row 1 */}
            <div className="animate-marquee whitespace-nowrap flex items-center gap-8 px-4">
              {brands.map((brand, i) => (
                <div key={brand.id ?? `r1-${i}`} className="inline-flex gap-3 px-6 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-lg transition-all cursor-pointer h-20 w-60 items-center justify-center group">
                  <div className={`opacity-60 group-hover:opacity-100 transition-opacity ${brand.color}`}><Building size={24}/></div>
                  <span className={`font-black text-lg tracking-tight opacity-70 group-hover:opacity-100 transition-opacity ${brand.color}`}>{brand.name}</span>
                </div>
              ))}
            </div>
            
            {/* Row 2 */}
            <div className="animate-marquee whitespace-nowrap flex items-center gap-8 px-4" style={{ animationDirection: 'reverse' }}>
              {[...brands].reverse().map((brand, i) => (
                <div key={brand.id ?? `r2-${i}`} className="inline-flex gap-3 px-6 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-lg transition-all cursor-pointer h-20 w-60 items-center justify-center group">
                  <div className={`opacity-60 group-hover:opacity-100 transition-opacity ${brand.color}`}><Building size={24}/></div>
                  <span className={`font-black text-lg tracking-tight opacity-70 group-hover:opacity-100 transition-opacity ${brand.color}`}>{brand.name}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

      </div>

      {/* 17. Footer */}
      <footer className="bg-slate-50/50 pt-24 pb-8 mt-12 relative overflow-hidden border-t border-slate-100 rounded-t-[3rem] shadow-[0_-10px_40px_rgba(0,0,0,0.02)]">
        <div className="absolute bottom-0 left-0 w-full h-[400px] pointer-events-none z-0">
          <svg className="absolute bottom-10 w-full opacity-30 text-slate-300" viewBox="0 0 1440 200" fill="none" preserveAspectRatio="none">
            <path d="M0,150 C320,50 420,200 720,150 C1020,100 1120,200 1440,150" stroke="currentColor" strokeWidth="1"/>
            <path d="M0,180 C320,80 420,230 720,180 C1020,130 1120,230 1440,180" stroke="currentColor" strokeWidth="1"/>
          </svg>
          <div className="absolute bottom-0 left-0 lg:left-[5%] w-[400px] h-[200px] opacity-70 lg:opacity-100">
            <div className="absolute bottom-0 left-40 w-48 h-24 bg-gradient-to-t from-orange-100/80 to-orange-50/40 rounded-t-full"></div>
            <div className="absolute bottom-10 left-[180px] w-24 h-12 bg-gradient-to-t from-orange-200/80 to-orange-100/50 rounded-t-full"></div>
            <svg className="absolute bottom-0 left-0 w-[350px] h-[150px] text-slate-300" viewBox="0 0 350 150" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="20" y="80" width="30" height="70" fill="white" /><rect x="25" y="90" width="8" height="8" fill="#f1f5f9"/><rect x="37" y="90" width="8" height="8" fill="#f1f5f9"/><rect x="25" y="110" width="8" height="8" fill="#f1f5f9"/><rect x="37" y="110" width="8" height="8" fill="#f1f5f9"/>
              <path d="M60 80 L75 50 L90 80 Z" fill="white" /><rect x="60" y="80" width="30" height="70" fill="white" /><line x1="75" y1="80" x2="75" y2="150" />
              <rect x="100" y="30" width="40" height="120" fill="white" /><rect x="105" y="40" width="10" height="10" fill="#f1f5f9"/><rect x="125" y="40" width="10" height="10" fill="#f8fafc"/><rect x="105" y="60" width="10" height="10" fill="#f1f5f9"/><rect x="125" y="60" width="10" height="10" fill="#fed7aa"/><rect x="105" y="80" width="10" height="10" fill="#f1f5f9"/><rect x="125" y="80" width="10" height="10" fill="#f1f5f9"/>
              <path d="M150 70 C 160 50, 180 50, 190 70" fill="white" /><rect x="150" y="70" width="40" height="80" fill="white" /><rect x="165" y="90" width="10" height="20" fill="#f1f5f9"/>
              <path d="M230 110 C 220 110, 220 90, 230 80 C 245 70, 255 70, 270 80 C 280 90, 280 110, 270 110 Z" fill="white" /><line x1="250" y1="110" x2="250" y2="150" strokeWidth="2" />
              <path d="M290 120 C 280 120, 280 100, 290 95 C 300 85, 310 85, 320 95 C 330 100, 330 120, 320 120 Z" fill="white" /><line x1="305" y1="120" x2="305" y2="150" strokeWidth="2" />
            </svg>
            <div className="absolute bottom-[105px] left-[106px] w-9 h-9 text-orange-500 drop-shadow-[0_4px_8px_rgba(249,115,22,0.4)]">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
            </div>
          </div>
        </div>
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8 xl:px-12 relative z-10">
          <div className="flex flex-col lg:flex-row gap-12 xl:gap-16 mb-16">
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
              <div className="lg:col-span-1 pr-4">
                <Link to="/" className="text-3xl font-black tracking-tight flex items-center mb-4"><span className="text-[#0B1C47]">Biz</span><span className="text-orange-500">Dial</span></Link>
                <div className="w-8 h-1 bg-orange-500 rounded-full mb-6"></div>
                <p className="text-slate-500 text-[13px] mb-8 leading-relaxed font-medium">India's most trusted local search platform to discover, connect &amp; grow with the best businesses near you.</p>
                <div className="flex items-center gap-4">
                  <a href="#" className="w-10 h-10 bg-white border border-slate-100 shadow-sm rounded-full flex items-center justify-center text-[#1877F2] hover:bg-slate-50 transition-colors"><svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg></a>
                  <a href="#" className="w-10 h-10 bg-white border border-slate-100 shadow-sm rounded-full flex items-center justify-center text-[#1DA1F2] hover:bg-slate-50 transition-colors"><svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg></a>
                  <a href="#" className="w-10 h-10 bg-white border border-slate-100 shadow-sm rounded-full flex items-center justify-center text-[#0A66C2] hover:bg-slate-50 transition-colors"><svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg></a>
                  <a href="#" className="w-10 h-10 bg-white border border-slate-100 shadow-sm rounded-full flex items-center justify-center text-[#FF0000] hover:bg-slate-50 transition-colors"><svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg></a>
                </div>
              </div>
              <div className="lg:col-span-1 pl-0 md:pl-4 lg:border-l border-slate-200">
                <div className="flex items-center gap-3 mb-4"><div className="w-10 h-10 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center shrink-0"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg></div><h4 className="font-extrabold text-slate-900 text-[15px]">Quick Links</h4></div>
                <div className="w-6 h-0.5 bg-orange-500 rounded-full mb-6 ml-[52px]"></div>
                <ul className="space-y-4 text-[13px] text-slate-600 font-semibold ml-[52px]">
                  {[
                    { name: 'Top Categories', href: '#categories' },
                    { name: 'Featured Businesses', href: '#services' },
                    { name: 'How BizDial Works', href: '#how-it-works' },
                    { name: 'Browse Locations', href: '#locations' }
                  ].map((item, idx) => (
                    <li key={idx}>
                      <button onClick={() => {
                        if (item.href === '#locations') {
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        } else {
                          const el = document.getElementById(item.href.substring(1));
                          if (el) el.scrollIntoView({ behavior: 'smooth' });
                        }
                      }} className="flex w-full items-center justify-between hover:text-orange-500 transition-colors group pr-4 text-left">
                        {item.name} <ChevronRight size={14} className="text-orange-400 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="lg:col-span-1 pl-0 md:pl-4 lg:border-l border-slate-200">
                <div className="flex items-center gap-3 mb-4"><div className="w-10 h-10 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center shrink-0"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" /><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" /><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" /><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" /></svg></div><h4 className="font-extrabold text-slate-900 text-[15px]">Grow With Us</h4></div>
                <div className="w-6 h-0.5 bg-orange-500 rounded-full mb-6 ml-[52px]"></div>
                <ul className="space-y-4 text-[13px] text-slate-600 font-semibold ml-[52px]">
                  {[
                    { name: 'Premium Services', href: '#pricing' },
                    { name: 'List Your Business', href: '/register', isRoute: true },
                    { name: 'Business Login', href: '/login', isRoute: true },
                    { name: 'Advertise with Us', href: '#pricing' }
                  ].map((item, idx) => (
                    <li key={idx}>
                      {item.isRoute ? (
                        <Link to={item.href} className="flex items-center justify-between hover:text-orange-500 transition-colors group pr-4 text-left">
                          {item.name} <ChevronRight size={14} className="text-orange-400 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                        </Link>
                      ) : (
                        <button onClick={() => {
                          const el = document.getElementById(item.href.substring(1));
                          if (el) el.scrollIntoView({ behavior: 'smooth' });
                        }} className="flex w-full items-center justify-between hover:text-orange-500 transition-colors group pr-4 text-left">
                          {item.name} <ChevronRight size={14} className="text-orange-400 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="w-full lg:w-[360px] shrink-0 lg:mt-[-40px]">
              <div className="bg-white rounded-3xl p-8 shadow-[0_15px_50px_rgba(0,0,0,0.06)] border border-slate-100 relative overflow-hidden h-full z-20">
                <div className="absolute top-8 right-8 grid grid-cols-4 gap-2 opacity-20">{[...Array(16)].map((_, i) => <div key={i} className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>)}</div>
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-6"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg></div>
                <h4 className="font-extrabold text-slate-900 text-lg mb-2">Stay Updated</h4>
                <div className="w-8 h-1 bg-blue-600 rounded-full mb-6"></div>
                <p className="text-[12px] text-slate-500 font-medium leading-relaxed mb-8 pr-4">Subscribe to get the latest updates and special offers directly to your inbox.</p>
                <div className="relative mb-4">
                  <input type="text" placeholder="Enter your email" className="w-full pl-4 pr-10 py-3.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-blue-500 transition-colors" />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg></div>
                </div>
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all hover:scale-[1.02]"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>Subscribe Now</button>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-[2rem] p-6 lg:p-8 mb-12 shadow-[0_10px_30px_rgba(0,0,0,0.03)] border border-slate-100 flex flex-wrap lg:flex-nowrap items-center justify-between gap-6 relative z-20 mx-0 xl:mx-10">
            <div className="flex items-center gap-4 flex-1 min-w-[200px]"><div className="w-14 h-14 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center shrink-0"><ShieldCheck size={28} strokeWidth={2} /></div><div><h4 className="font-extrabold text-slate-900 text-[15px] mb-1">Trusted by Millions</h4><p className="text-[12px] text-slate-500 font-medium leading-tight">Verified businesses<br/>you can rely on.</p></div></div>
            <div className="hidden lg:block w-px h-12 bg-slate-200"></div>
            <div className="flex items-center gap-4 flex-1 min-w-[200px]"><div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0"><Search size={28} strokeWidth={2} /></div><div><h4 className="font-extrabold text-slate-900 text-[15px] mb-1">Smart Search</h4><p className="text-[12px] text-slate-500 font-medium leading-tight">Find the best businesses<br/>near you instantly.</p></div></div>
            <div className="hidden lg:block w-px h-12 bg-slate-200"></div>
            <div className="flex items-center gap-4 flex-1 min-w-[200px]"><div className="w-14 h-14 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center shrink-0"><Headphones size={28} strokeWidth={2} /></div><div><h4 className="font-extrabold text-slate-900 text-[15px] mb-1">24/7 Support</h4><p className="text-[12px] text-slate-500 font-medium leading-tight">We're here to help<br/>you anytime.</p></div></div>
            <div className="hidden lg:block w-px h-12 bg-slate-200"></div>
            <div className="flex items-center gap-4 flex-1 min-w-[200px]"><div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0"><TrendingUp size={28} strokeWidth={2} /></div><div><h4 className="font-extrabold text-slate-900 text-[15px] mb-1">Grow Your Business</h4><p className="text-[12px] text-slate-500 font-medium leading-tight">Connect with more customers<br/>and grow your brand.</p></div></div>
          </div>
          <div className="border-t border-slate-200 pt-8 flex flex-col md:flex-row items-center justify-between gap-6 relative z-20 mx-0 xl:mx-10">
            <p className="text-[12px] text-slate-500 font-medium">© 2025 BizDial Media Pvt. Ltd. All Rights Reserved.</p>
            <div className="flex gap-6 text-[12px] text-slate-500 font-medium">
              <a href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</a>
              <span className="text-slate-300">•</span>
              <a href="#" className="hover:text-blue-600 transition-colors">Terms of Use</a>
              <span className="text-slate-300">•</span>
              <a href="#" className="hover:text-blue-600 transition-colors">Sitemap</a>
            </div>
            <div className="flex items-center gap-2 cursor-pointer bg-white px-4 py-2 rounded-full hover:bg-slate-50 transition-colors border border-slate-200 shadow-sm">
              <img src="https://flagcdn.com/24x18/in.png" alt="India Flag" className="rounded-sm w-4" />
              <span className="text-slate-700 text-xs font-bold">India</span>
              <ChevronDown size={14} className="text-slate-400 ml-1" />
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Home;
