import React from 'react';
import { motion } from 'framer-motion';
import { Building, Star, User as UserIcon } from 'lucide-react';
import SearchBar from '../common/SearchBar';

export default function HeroSection() {
  return (
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
            {['Restaurants', 'Hospitals', 'Mobile Shops', 'Gyms', 'Beauty Salons', 'Electricians', 'More ⌄'].map((tag) => (
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
  );
}
