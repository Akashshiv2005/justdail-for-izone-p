import React from 'react';
import { Search, FileText, Phone, MapPin, Star } from 'lucide-react';
import { motion } from 'framer-motion';

const HowItWorks = () => {
  return (
    <motion.section id="how-it-works" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-50px' }} transition={{ duration: 0.5 }} className="mb-24 px-4 py-20 bg-[#f8f9fc] rounded-[2rem] border border-slate-100 mx-4 lg:mx-0 overflow-hidden relative">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8Y2lyY2xlIGN4PSIyIiBjeT0iMiIgcj0iMSIgZmlsbD0iI2QxZDVkYiIvPjwvc3ZnPg==')] opacity-40"></div>
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8Y2lyY2xlIGN4PSIyIiBjeT0iMiIgcj0iMSIgZmlsbD0iI2QxZDVkYiIvPjwvc3ZnPg==')] opacity-40"></div>
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
        
        {/* Desktop Layout with SVG Line */}
        <div className="relative w-full h-[400px] hidden md:block">
          {/* The SVG Line */}
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
                 <feMerge>
                   <feMergeNode in="coloredBlur"/>
                   <feMergeNode in="SourceGraphic"/>
                 </feMerge>
               </filter>
             </defs>
             
             {/* The background static path */}
             <path id="curvePath" d="M 0 100 Q 50 50 100 50 C 170 50 230 90 300 90 C 370 90 430 40 500 40 C 570 40 630 80 700 80 C 770 80 830 50 900 50 Q 950 50 1000 100" fill="none" stroke="url(#lineGrad)" strokeWidth="2.5" />
             
             {/* The traveling glowing dot */}
             <circle r="6" fill="#ffffff" filter="url(#glow)">
               <animateMotion dur="7s" repeatCount="indefinite">
                 <mpath href="#curvePath" />
               </animateMotion>
             </circle>
          </svg>
          
          {[
            { id: '01', title: 'Search', desc: 'Find any business or service you need instantly.', icon: <Search size={28} className="text-white" />, hex: '#3b82f6', yOffset: 50 },
            { id: '02', title: 'Compare', desc: 'Compare ratings, read reviews, and check services.', icon: <FileText size={28} className="text-white" />, hex: '#a855f7', yOffset: 90 },
            { id: '03', title: 'Connect', desc: 'Call, chat or directly visit the business location.', icon: <Phone size={28} className="text-white" />, hex: '#10b981', yOffset: 40 },
            { id: '04', title: 'Visit', desc: 'Get accurate directions & reach the business easily.', icon: <MapPin size={28} className="text-white" />, hex: '#ec4899', yOffset: 80 },
            { id: '05', title: 'Review', desc: 'Share your experience to help others decide.', icon: <Star size={28} className="text-white" />, hex: '#f97316', yOffset: 50 },
          ].map((step, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: 0.2 + i * 0.15, duration: 0.35, type: "spring", stiffness: 300, damping: 25 }}
              className="absolute top-0 w-1/5 h-full flex flex-col items-center" 
              style={{ left: `${i * 20}%` }}
            >
               
               {/* Small Dot */}
               <div className="absolute w-3.5 h-3.5 rounded-full z-20 shadow-md border-[2.5px] border-white" style={{ top: `${step.yOffset - 7}px`, backgroundColor: step.hex }}></div>
               {/* Icon Circle */}
               <div className="absolute z-30" style={{ top: `${step.yOffset + 5}px` }}>
                  <div className="w-[84px] h-[84px] rounded-full bg-white flex items-center justify-center p-2 shadow-xl hover:scale-110 transition-transform duration-300" style={{ boxShadow: `0 15px 35px -10px ${step.hex}60` }}>
                     <div className="w-full h-full rounded-full flex items-center justify-center bg-gradient-to-br" style={{ backgroundImage: `linear-gradient(135deg, ${step.hex}ee, ${step.hex})` }}>
                        {step.icon}
                     </div>
                  </div>
               </div>
               {/* Card - Glass Effect */}
               <div className="absolute w-[85%] p-5 pt-16 pb-7 flex flex-col items-center text-center z-20 backdrop-blur-2xl bg-white/60 border border-white/40 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.05),0_4px_20px_-4px_rgba(0,0,0,0.03)] hover:-translate-y-2 hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.08),0_8px_30px_-8px_rgba(0,0,0,0.05)] transition-all duration-300 rounded-3xl" style={{ top: `${step.yOffset + 55}px`, borderBottom: `6px solid ${step.hex}` }}>
                   <span className="font-extrabold text-[15px] mb-1" style={{ color: step.hex }}>{step.id}</span>
                   <h4 className="font-black text-lg text-slate-900 mb-2.5 tracking-tight">{step.title}</h4>
                   <p className="text-[11px] text-slate-500 font-medium leading-relaxed px-1">{step.desc}</p>
               </div>
            </motion.div>
          ))}
        </div>
        {/* Mobile Layout */}
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
                         <div className="w-full h-full rounded-full flex items-center justify-center" style={{ backgroundColor: step.hex }}>
                            {step.icon}
                         </div>
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
  );
};

export default HowItWorks;
