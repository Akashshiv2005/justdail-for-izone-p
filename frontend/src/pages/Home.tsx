import { motion, useScroll, useTransform } from 'framer-motion';
import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, MapPin, ChevronDown, Bell, MessageSquare, 
  Star, Phone, CheckCircle, Smartphone, Home as HomeIcon, 
  Briefcase, GraduationCap, Car, Package, Plus, User as UserIcon,
  Building, Users, ShieldCheck, ThumbsUp, ArrowRight,
  Monitor, Headphones, Quote,
  FileText, Zap, BarChart, Settings, Award, TrendingUp, Compass,
  ChevronLeft, ChevronRight, Share2, Heart, Activity, Zap as ZapIcon
} from 'lucide-react';
import { useHomeData } from '../lib/hooks/useHomeData';
import SearchBar from '../components/common/SearchBar';

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

  const categories = data?.categories ?? [];
  const featuredBusinesses = data?.featured_businesses ?? [];
  const topPicks = data?.top_picks ?? [];
  const testimonials = data?.testimonials ?? [];
  const brands = data?.brands ?? [];
  const stats = data?.stats ?? { businesses: 0, reviews: 0, cities: 0, users: 0 };

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
    <div className="min-h-screen bg-white font-sans text-slate-800">
      


      {/* 2. Main Header */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-4 flex items-center justify-between">
          
          <div className="flex items-center gap-6">
            <Link to="/" className="text-3xl font-black tracking-tight shrink-0 flex items-center">
              <span className="text-blue-600">Biz</span>
              <span className="text-orange-500">Dial</span>
            </Link>
            <div className="hidden md:flex items-center bg-blue-50 border border-blue-100 rounded-full px-4 py-2 cursor-pointer hover:bg-blue-100 transition-colors">
              <MapPin size={16} className="text-blue-600 mr-2" />
              <span className="text-sm font-semibold text-blue-700 mr-1">Trichy</span>
              <ChevronDown size={14} className="text-blue-500" />
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
            {[
              { name: 'Categories', id: 'categories', hasDropdown: true },
              { name: 'Services', id: 'services', hasDropdown: true },
              { name: 'How it Works', id: 'how-it-works', hasDropdown: false },
              { name: 'Pricing', id: 'pricing', hasDropdown: false },
              { name: 'For Business', id: 'for-business', hasDropdown: true },
            ].map((item) => (
              <button 
                key={item.name}
                onClick={() => {
                  const el = document.getElementById(item.id);
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="flex items-center gap-1 text-sm font-bold text-slate-700 hover:text-blue-600 cursor-pointer transition-colors bg-transparent border-none p-0"
              >
                {item.name} {item.hasDropdown && <ChevronDown size={14} />}
              </button>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-4 ml-8">
            <Link to="/login" className="flex items-center gap-2 text-blue-600 font-bold border-2 border-blue-600 px-6 py-2 rounded-full hover:bg-blue-50 transition-colors shadow-sm">
              <UserIcon size={18} strokeWidth={2.5} /> Login
            </Link>
            <Link to="/dashboard/owner" className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-full transition-all shadow-lg shadow-blue-600/30">
              List Your Business
            </Link>
          </div>

        </div>
      </header>

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
              className="text-5xl md:text-6xl lg:text-[64px] font-extrabold tracking-tight text-slate-900 mb-6 leading-[1.1] relative z-20"
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
              {['Restaurants', 'Hospitals', 'Mobile Shops', 'Gyms', 'Beauty Salons', 'Electricians', 'More âŒ„'].map((tag) => (
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
              <p className="font-extrabold text-[22px] text-slate-900 leading-tight">{stats.businesses > 0 ? `${stats.businesses}+` : '0'}</p>
              <p className="text-xs font-bold text-slate-800">Businesses</p>
              <p className="text-[10px] text-slate-500">Listed on BizDial</p>
            </div>
          </div>
          <div className="flex items-center gap-4 z-10 border-l border-slate-200 pl-6">
            <div className="w-14 h-14 bg-white shadow-sm text-blue-500 rounded-full flex items-center justify-center shrink-0 border border-slate-100"><MessageSquare size={24}/></div>
            <div>
              <p className="font-extrabold text-[22px] text-slate-900 leading-tight">{stats.reviews > 0 ? `${stats.reviews}+` : '0'}</p>
              <p className="text-xs font-bold text-slate-800">User Reviews</p>
              <p className="text-[10px] text-slate-500">Trusted & Genuine</p>
            </div>
          </div>
          <div className="flex items-center gap-4 z-10 border-l border-slate-200 pl-6">
            <div className="w-14 h-14 bg-white shadow-sm text-blue-500 rounded-full flex items-center justify-center shrink-0 border border-slate-100"><MapPin size={24}/></div>
            <div>
              <p className="font-extrabold text-[22px] text-slate-900 leading-tight">{stats.cities > 0 ? `${stats.cities}+` : '0'}</p>
              <p className="text-xs font-bold text-slate-800">Cities</p>
              <p className="text-[10px] text-slate-500">Across India</p>
            </div>
          </div>
          <div className="flex items-center gap-4 z-10 border-l border-slate-200 pl-6">
            <div className="w-14 h-14 bg-white shadow-sm text-blue-500 rounded-full flex items-center justify-center shrink-0 border border-slate-100"><Users size={24}/></div>
            <div>
              <p className="font-extrabold text-[22px] text-slate-900 leading-tight">{stats.users > 0 ? `${stats.users}+` : '0'}</p>
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
            
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold text-base transition-all shadow-xl shadow-blue-600/30 flex items-center gap-3 hover:scale-105 transform duration-300">
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
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-slate-900">Featured Businesses in Trichy</h2>
            <a href="#" className="text-blue-600 font-bold text-sm hover:underline flex items-center gap-1">View All Businesses <ArrowRight size={16}/></a>
          </div>
          
          <div className="relative">
            <button className="absolute -left-5 top-1/2 -translate-y-1/2 w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center shadow-lg z-10 text-blue-600 hover:bg-slate-50">
              <ChevronLeft size={20} />
            </button>
            <button className="absolute -right-5 top-1/2 -translate-y-1/2 w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center shadow-lg z-10 text-blue-600 hover:bg-slate-50">
              <ChevronRight size={20} />
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {featuredBusinesses.map((bus, i) => (
                <div key={bus.id ?? i} className="bg-white p-3 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group">
                  <div className="h-40 relative rounded-2xl overflow-hidden mb-4">
                    {bus.is_verified && (
                      <span className="absolute top-3 left-3 z-10 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full shadow-lg backdrop-blur-md">Featured</span>
                    )}
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors z-0"></div>
                    <img src={bus.logo_url || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&h=300&fit=crop'} alt={bus.business_name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  </div>
                  <div className="px-2 pb-2">
                    <h3 className="font-extrabold text-[15px] text-slate-900 mb-1 truncate">{bus.business_name}</h3>
                    <p className="text-[11px] text-slate-500 font-medium mb-3">{bus.category}</p>
                    
                    <div className="flex items-center gap-1.5 mb-3 bg-slate-50 w-max px-2.5 py-1 rounded-full border border-slate-100">
                      <div className="flex items-center gap-1 text-orange-500 font-bold text-xs">
                        {bus.average_rating} <Star size={12} className="fill-current"/>
                      </div>
                      <span className="text-[10px] text-slate-500 font-semibold">({bus.total_reviews} Reviews)</span>
                    </div>
                    
                    <div className="space-y-1.5 mb-5">
                      <p className="text-[11px] text-slate-600 font-medium flex items-center gap-1"><MapPin size={12} className="text-slate-400"/> {bus.address || bus.city || 'Location'}</p>
                      <p className="text-[11px] text-slate-600 font-medium flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> <span className="text-green-600 font-bold">Open</span>
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-blue-50 text-blue-700 rounded-xl font-bold text-xs hover:bg-blue-600 hover:text-white transition-colors">
                        <Phone size={14}/> Call
                      </button>
                      <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-slate-50 text-slate-700 rounded-xl font-bold text-xs hover:bg-slate-200 transition-colors">
                        Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Dots */}
            <div className="flex items-center justify-center gap-2 mt-6">
              <div className="w-2 h-2 rounded-full bg-blue-600"></div>
              <div className="w-2 h-2 rounded-full bg-slate-200"></div>
              <div className="w-2 h-2 rounded-full bg-slate-200"></div>
              <div className="w-2 h-2 rounded-full bg-slate-200"></div>
            </div>
          </div>
        </motion.section>
        
        {/* 8. How BizDial Works */}
        <motion.section id="how-it-works" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-50px' }} transition={{ duration: 0.5 }} className="mb-24 px-4 py-16 bg-gradient-to-b from-white to-slate-50 rounded-[3rem] border border-slate-100 mx-4 lg:mx-0">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-slate-900 mb-3">How BizDial Works?</h2>
            <p className="text-sm font-medium text-slate-500">It's simple, fast & effective</p>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between max-w-5xl mx-auto relative px-4">
            <div className="hidden md:block absolute top-12 left-12 right-12 h-1 bg-gradient-to-r from-blue-100 via-purple-100 to-orange-100 z-0 rounded-full"></div>
            {[
              { i: <Search size={32}/>, t: '1. Search', p: 'Find any business or service you need instantly.', c: 'text-blue-600 bg-blue-50 border-blue-200 shadow-blue-500/20' },
              { i: <FileText size={32}/>, t: '2. Compare', p: 'Compare ratings, read reviews, and check services.', c: 'text-purple-600 bg-purple-50 border-purple-200 shadow-purple-500/20' },
              { i: <Phone size={32}/>, t: '3. Connect', p: 'Call, chat or directly visit the business location.', c: 'text-green-600 bg-green-50 border-green-200 shadow-green-500/20' },
              { i: <MapPin size={32}/>, t: '4. Visit', p: 'Get accurate directions & reach the business easily.', c: 'text-pink-600 bg-pink-50 border-pink-200 shadow-pink-500/20' },
              { i: <Star size={32}/>, t: '5. Review', p: 'Share your experience to help others decide.', c: 'text-orange-600 bg-orange-50 border-orange-200 shadow-orange-500/20' },
            ].map((s, i) => (
              <div key={i} className="flex flex-col items-center text-center relative z-10 mb-10 md:mb-0 w-48 hover:-translate-y-3 transition-transform duration-500 group">
                <div className={`w-24 h-24 rounded-3xl flex items-center justify-center mb-6 border-2 shadow-xl group-hover:shadow-2xl transition-all duration-500 transform group-hover:rotate-6 bg-white backdrop-blur-xl ${s.c}`}>
                  {s.i}
                </div>
                <h4 className="font-extrabold text-base text-slate-900 mb-2">{s.t}</h4>
                <p className="text-xs text-slate-500 font-medium leading-relaxed px-2">{s.p}</p>
              </div>
            ))}
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
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {topPicks.map((pick, i) => (
                <div key={i} className="rounded-2xl overflow-hidden h-44 relative group cursor-pointer shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-500">
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors z-10 duration-500"></div>
                  <img src={pick.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute bottom-3 left-3 right-3 z-20">
                    <h4 className="font-bold text-white text-sm leading-tight mb-0.5">{pick.title}</h4>
                    <p className="text-[10px] text-white/80 font-medium">{pick.listings}</p>
                  </div>
                </div>
              ))}
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
            
            <button className="bg-[#6366F1] hover:bg-[#4F46E5] text-white px-8 py-3 rounded-lg font-bold text-sm transition-all shadow-lg shadow-indigo-500/30 flex items-center gap-2">
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
      <footer className="bg-[#050B14] text-white pt-24 pb-8 rounded-t-[3rem] mt-12 mx-2">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 mb-16">
            <div className="lg:col-span-2">
              <Link to="/" className="text-4xl font-black tracking-tight flex items-center mb-8">
                <span className="text-white">Biz</span>
                <span className="text-orange-500">Dial</span>
              </Link>
              <p className="text-slate-400 text-sm mb-10 max-w-sm leading-relaxed">
                India's most trusted local search platform to discover, connect & grow with the best businesses near you.
              </p>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-full flex items-center justify-center hover:bg-blue-600 hover:scale-110 cursor-pointer transition-all duration-300"><svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg></div>
                <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-full flex items-center justify-center hover:bg-blue-400 hover:scale-110 cursor-pointer transition-all duration-300"><svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg></div>
                <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-full flex items-center justify-center hover:bg-blue-700 hover:scale-110 cursor-pointer transition-all duration-300"><svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg></div>
                <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-full flex items-center justify-center hover:bg-red-600 hover:scale-110 cursor-pointer transition-all duration-300"><svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg></div>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold text-white mb-6 text-xl">Quick Links</h4>
              <ul className="space-y-4 text-sm text-slate-400 font-medium">
                <li><button onClick={() => document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-blue-400 hover:translate-x-1 inline-block transition-all bg-transparent border-none p-0">Top Categories</button></li>
                <li><button onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-blue-400 hover:translate-x-1 inline-block transition-all bg-transparent border-none p-0">Featured Businesses</button></li>
                <li><button onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-blue-400 hover:translate-x-1 inline-block transition-all bg-transparent border-none p-0">How BizDial Works</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-6 text-xl">Grow With Us</h4>
              <ul className="space-y-4 text-sm text-slate-400 font-medium">
                <li><button onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-blue-400 hover:translate-x-1 inline-block transition-all bg-transparent border-none p-0">Premium Services</button></li>
                <li><button onClick={() => document.getElementById('for-business')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-blue-400 hover:translate-x-1 inline-block transition-all bg-transparent border-none p-0">List Your Business</button></li>
                <li><a href="#!" onClick={(e)=>e.preventDefault()} className="hover:text-blue-400 hover:translate-x-1 inline-block transition-all">Business Login</a></li>
                <li><a href="#!" onClick={(e)=>e.preventDefault()} className="hover:text-blue-400 hover:translate-x-1 inline-block transition-all">Advertise with Us</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-6 text-xl">Company</h4>
              <ul className="space-y-4 text-sm text-slate-400 font-medium">
                <li><a href="#!" onClick={(e)=>e.preventDefault()} className="hover:text-blue-400 hover:translate-x-1 inline-block transition-all">About Us</a></li>
                <li><a href="#!" onClick={(e)=>e.preventDefault()} className="hover:text-blue-400 hover:translate-x-1 inline-block transition-all">Careers</a></li>
                <li><a href="#!" onClick={(e)=>e.preventDefault()} className="hover:text-blue-400 hover:translate-x-1 inline-block transition-all">Newsroom</a></li>
                <li><a href="#!" onClick={(e)=>e.preventDefault()} className="hover:text-blue-400 hover:translate-x-1 inline-block transition-all">Contact Us</a></li>
              </ul>
            </div>
            
            <div className="lg:col-span-1 border-t border-slate-800 pt-8 mt-8 lg:border-t-0 lg:pt-0 lg:mt-0">
              <h4 className="font-bold text-white text-lg mb-3">Newsletter</h4>
              <p className="text-xs text-slate-400 mb-6 leading-relaxed">Subscribe to get the latest updates and special offers directly to your inbox.</p>
              <div className="flex flex-col gap-3">
                <input type="text" placeholder="Enter your email" className="w-full px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white outline-none focus:border-blue-500 focus:bg-white/10 transition-colors placeholder:text-slate-500" />
                <button className="bg-blue-600 hover:bg-blue-700 w-full px-5 py-3 rounded-xl text-sm font-bold shadow-lg shadow-blue-600/20 transition-all hover:scale-[1.02]">Subscribe Now</button>
              </div>
            </div>
          </div>
          
          <div className="border-t border-white/10 pt-8 pb-4 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-500 font-medium">
            <p>Â© 2025 BizDial Media Pvt. Ltd. All Rights Reserved.</p>
            <div className="flex gap-6">
              <a href="#!" className="hover:text-white transition-colors">Privacy</a>
              <a href="#!" className="hover:text-white transition-colors">Terms</a>
              <a href="#!" className="hover:text-white transition-colors">Sitemap</a>
            </div>
            <div className="flex items-center gap-2 cursor-pointer bg-white/5 px-4 py-2 rounded-full hover:bg-white/10 transition-colors border border-white/5">
              <img src="https://flagcdn.com/24x18/in.png" alt="India Flag" className="rounded-sm w-4" />
              <span className="text-slate-300">India</span>
              <ChevronDown size={14} className="text-slate-400 ml-1" />
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Home;
