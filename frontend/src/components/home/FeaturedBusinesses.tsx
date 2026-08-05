import React from 'react';
import { Star, MapPin, Phone, Monitor, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

const FeaturedBusinesses = ({ businesses }: { businesses: any[] }) => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <div>
            <div className="inline-block px-4 py-1.5 bg-blue-600 text-white font-bold text-[10px] uppercase tracking-wider rounded-full mb-4">★ Top Picks</div>
            <h2 className="text-4xl lg:text-5xl font-black text-slate-900 mb-2">Featured Businesses <span className="text-blue-500">in Trichy</span></h2>
            <p className="text-slate-500 text-base font-medium">Handpicked trusted businesses delivering excellence in Trichy</p>
          </div>
          <Link to="/search" className="hidden md:flex items-center gap-2 border border-slate-200 px-6 py-3 rounded-full font-bold text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-all shadow-sm">
            View All Businesses →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {businesses.slice(0,5).map((bus, i) => {
            const initials = bus.business_name.split(' ').map((w: string) => w[0]).join('').substring(0, 2).toUpperCase();
            
            // Generate some random gradient colors based on index to match design
            const bgColors = [
              "bg-gradient-to-b from-purple-100/50 to-white",
              "bg-gradient-to-b from-blue-100/50 to-white",
              "bg-gradient-to-b from-orange-100/50 to-white",
              "bg-gradient-to-b from-purple-100/50 to-white",
              "bg-gradient-to-b from-blue-100/50 to-white"
            ];
            
            const tagColors = [
              "bg-purple-600", "bg-blue-500", "bg-orange-500", "bg-purple-500", "bg-blue-500"
            ];
            const textColors = [
              "text-purple-600", "text-blue-600", "text-orange-500", "text-purple-600", "text-blue-600"
            ];
            
            const icons = [Monitor, Activity, Star, Monitor, Activity];
            const Icon = icons[i % 5];

            return (
              <div key={bus.id || i} className={`rounded-[2.5rem] overflow-hidden border-2 border-transparent hover:border-slate-100 shadow-xl shadow-slate-200/40 hover:shadow-2xl transition-all duration-300 ${bgColors[i % 5]}`}>
                <div className="relative h-[220px] w-full">
                  <img src={bus.logo_url || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&h=300&fit=crop'} alt={bus.business_name} className="w-full h-full object-cover" />
                  
                  {/* Top Badges */}
                  <div className="absolute top-4 left-4 flex gap-2 z-10">
                    <span className={`px-3 py-1.5 text-[10px] font-black text-white rounded-lg uppercase tracking-wide shadow-md ${tagColors[i % 5]}`}>★ Featured</span>
                  </div>
                  <div className="absolute top-4 right-4 z-10">
                    <div className="w-8 h-8 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-md text-slate-500 border border-white/50">
                      <Icon size={14} />
                    </div>
                  </div>

                  {/* Wave Overlay */}
                  <div className="absolute bottom-[-2px] left-0 w-full overflow-hidden leading-none">
                    <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-[60px]" style={{ transform: 'rotate(180deg)' }}>
                       <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-white/80 backdrop-blur-3xl"></path>
                    </svg>
                  </div>
                  
                  {/* Initials Circle */}
                  <div className="absolute bottom-[-24px] left-1/2 -translate-x-1/2 w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-xl shadow-slate-200/50 font-black text-lg border-4 border-white/80 z-20 backdrop-blur-md">
                    <span className={textColors[i % 5]}>{initials}</span>
                  </div>
                </div>

                <div className="pt-10 px-5 pb-6 text-center">
                  <h3 className="font-extrabold text-[16px] text-slate-900 mb-1 truncate">{bus.business_name}</h3>
                  <p className="text-[12px] text-slate-500 font-medium mb-3">{bus.category}</p>
                  
                  <div className="flex items-center justify-center gap-1.5 mb-4">
                    <span className={`font-bold ${textColors[i % 5]}`}>{bus.average_rating || '4.8'}</span>
                    <Star size={12} className={`fill-current ${textColors[i % 5]}`} />
                    <span className="text-[11px] font-semibold text-slate-500">({bus.total_reviews || '85'} Reviews)</span>
                  </div>
                  
                  <div className="space-y-1.5 mb-6">
                    <p className="text-[11px] text-slate-500 flex items-center justify-center gap-1.5 font-medium truncate">
                      <MapPin size={12} className="text-slate-400 shrink-0" />
                      {bus.address || bus.city || 'Trichy, Tamil Nadu'}
                    </p>
                    <p className="text-[11px] font-bold text-green-600 flex items-center justify-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-sm shadow-green-500/50"></span> Open
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button className={`flex-1 py-3 text-white rounded-2xl font-bold text-xs shadow-lg shadow-current/20 transition-transform hover:scale-105 ${tagColors[i % 5]}`}>
                      <Phone size={14} className="inline mr-1"/> Call Now
                    </button>
                    <button className={`flex-1 py-3 rounded-2xl font-bold text-xs transition-colors hover:bg-slate-50 ${textColors[i % 5]}`}>
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturedBusinesses;
