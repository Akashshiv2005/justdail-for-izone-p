import React from 'react';
import { ChevronLeft, ChevronRight, ArrowRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const CategorySlider = ({ categories }: { categories: any[] }) => {
  // Using static sample categories for the exact visual from screenshot
  const sliderCategories = [
    { id: '01', name: 'Best Beauty Salons', image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=500&h=600&fit=crop', count: '1+' },
    { id: '02', name: 'Best Real Estate', image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=500&h=600&fit=crop', count: '1+' },
    { id: '03', name: 'Best Finance', image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=500&h=600&fit=crop', count: '1+' },
    { id: '04', name: 'Best HVAC Services', image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=500&h=600&fit=crop', count: '1+' },
    { id: '05', name: 'Best Photography Studio', image: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=500&h=600&fit=crop', count: '1+', active: true },
  ];

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-xl">
            <h2 className="text-4xl lg:text-[44px] font-black leading-tight text-slate-900 mb-4">
              Discover the Best<br/>
              <span className="text-orange-500">Businesses</span> <span className="text-blue-600">Near You</span>
            </h2>
            <p className="text-slate-500 text-lg font-medium">Handpicked services and top-rated businesses trusted by people like you.</p>
          </div>
          <Link to="/search" className="inline-flex items-center gap-3 border border-slate-200 px-6 py-3 rounded-full font-bold text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-all shrink-0">
            View All Categories <div className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center"><ArrowRight size={14}/></div>
          </Link>
        </div>

        {/* Custom Slider Implementation to match the overlapping perspective look */}
        <div className="relative h-[480px] flex items-center justify-center max-w-5xl mx-auto">
          
          <button className="absolute left-0 z-20 w-12 h-12 bg-white rounded-full border border-slate-100 shadow-xl flex items-center justify-center text-slate-600 hover:text-orange-500 hover:scale-110 transition-all">
            <ChevronLeft size={24} />
          </button>

          <button className="absolute right-0 z-20 w-12 h-12 bg-white rounded-full border border-slate-100 shadow-xl flex items-center justify-center text-slate-600 hover:text-orange-500 hover:scale-110 transition-all">
            <ChevronRight size={24} />
          </button>

          <div className="flex items-center justify-center relative w-full h-full">
            {sliderCategories.map((cat, i) => {
              // Creating a staggered 3D perspective effect
              const isActive = cat.active;
              const isLeft = i === 2 || i === 3;
              const isRight = i === 0;
              
              let zIndex = isActive ? 10 : 5;
              let scale = isActive ? 1 : 0.85;
              let translateX = isActive ? 0 : (isLeft ? (i===2?-250:-120) : (isRight?250:120));
              let opacity = isActive ? 1 : 0.6;
              let blur = isActive ? 'none' : 'blur(2px)';

              // Hardcoding the exact visual offsets for the mockup
              if(i === 2) { translateX = -320; scale = 0.7; zIndex = 3; opacity = 0.4; } // 03 Finance
              if(i === 3) { translateX = -160; scale = 0.85; zIndex = 5; opacity = 0.8; blur = 'blur(1px)'; } // 04 HVAC
              if(i === 0) { translateX = 240; scale = 0.85; zIndex = 5; opacity = 0.9; blur = 'blur(1px)'; } // 01 Beauty

              // Hidden ones
              if(i === 1) return null; // Hide 02 for this specific preview

              return (
                <div 
                  key={cat.id} 
                  className={`absolute top-1/2 -translate-y-1/2 transition-all duration-500 ease-out rounded-3xl overflow-hidden bg-white shadow-2xl`}
                  style={{
                    width: isActive ? '320px' : '260px',
                    height: isActive ? '420px' : '340px',
                    transform: `translate(-50%, -50%) translateX(${translateX}px) scale(${scale})`,
                    left: '50%',
                    zIndex: zIndex,
                    opacity: opacity,
                    filter: blur,
                    boxShadow: isActive ? '0 25px 50px -12px rgba(249, 115, 22, 0.25)' : '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <div className="h-[65%] relative w-full overflow-hidden rounded-b-[2rem]">
                    <img src={cat.image} className="w-full h-full object-cover" alt={cat.name} />
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="absolute top-4 left-4 text-white font-black text-2xl tracking-tighter drop-shadow-md">
                      {cat.id}
                    </div>
                    {/* The orange icon circle sitting on the border */}
                    <div className={`absolute -bottom-6 left-6 w-14 h-14 rounded-2xl bg-orange-500 text-white flex items-center justify-center shadow-lg shadow-orange-500/40 z-10 ${isActive ? 'scale-100' : 'scale-0'} transition-transform delay-300`}>
                      <Star size={24} fill="currentColor" />
                    </div>
                  </div>
                  <div className="pt-10 px-6 pb-6 bg-white h-[35%] flex flex-col justify-center">
                    <h3 className={`font-black ${isActive ? 'text-xl' : 'text-lg'} text-blue-900 mb-1`}>{cat.name}</h3>
                    <div className="flex items-center justify-between">
                      <p className="text-orange-500 font-bold text-xs">{cat.count} Listings</p>
                      {isActive && <ArrowRight size={18} className="text-orange-500" />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
};

export default CategorySlider;
