import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Users, ShieldCheck, Search, Headphones, TrendingUp, ChevronDown } from 'lucide-react';

const NewFooter = () => {
  return (
    <footer className="bg-slate-50/50 pt-24 pb-8 mt-12 relative overflow-hidden border-t border-slate-100 rounded-t-[3rem] shadow-[0_-10px_40px_rgba(0,0,0,0.02)]">
      
      {/* Background Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-full h-[400px] pointer-events-none z-0">
         {/* Abstract wavy lines */}
         <svg className="absolute bottom-10 w-full opacity-30 text-slate-300" viewBox="0 0 1440 200" fill="none" preserveAspectRatio="none">
           <path d="M0,150 C320,50 420,200 720,150 C1020,100 1120,200 1440,150" stroke="currentColor" strokeWidth="1"/>
           <path d="M0,180 C320,80 420,230 720,180 C1020,130 1120,230 1440,180" stroke="currentColor" strokeWidth="1"/>
         </svg>
         
         {/* City Skyline & Pin */}
         <div className="absolute bottom-0 left-0 lg:left-[5%] w-[400px] h-[200px] opacity-70 lg:opacity-100">
            {/* Sun/Hill */}
            <div className="absolute bottom-0 left-40 w-48 h-24 bg-gradient-to-t from-orange-100/80 to-orange-50/40 rounded-t-full"></div>
            <div className="absolute bottom-10 left-[180px] w-24 h-12 bg-gradient-to-t from-orange-200/80 to-orange-100/50 rounded-t-full"></div>
            
            {/* Buildings SVG */}
            <svg className="absolute bottom-0 left-0 w-[350px] h-[150px] text-slate-300" viewBox="0 0 350 150" fill="none" stroke="currentColor" strokeWidth="1.5">
               {/* Building 1 */}
               <rect x="20" y="80" width="30" height="70" fill="white" />
               <rect x="25" y="90" width="8" height="8" fill="#f1f5f9"/>
               <rect x="37" y="90" width="8" height="8" fill="#f1f5f9"/>
               <rect x="25" y="110" width="8" height="8" fill="#f1f5f9"/>
               <rect x="37" y="110" width="8" height="8" fill="#f1f5f9"/>
               
               {/* Building 2 (Pointy) */}
               <path d="M60 80 L75 50 L90 80 Z" fill="white" />
               <rect x="60" y="80" width="30" height="70" fill="white" />
               <line x1="75" y1="80" x2="75" y2="150" />
               
               {/* Building 3 (Tall) */}
               <rect x="100" y="30" width="40" height="120" fill="white" />
               <rect x="105" y="40" width="10" height="10" fill="#f1f5f9"/>
               <rect x="125" y="40" width="10" height="10" fill="#f8fafc"/>
               <rect x="105" y="60" width="10" height="10" fill="#f1f5f9"/>
               <rect x="125" y="60" width="10" height="10" fill="#fed7aa"/>
               <rect x="105" y="80" width="10" height="10" fill="#f1f5f9"/>
               <rect x="125" y="80" width="10" height="10" fill="#f1f5f9"/>
               
               {/* Building 4 (Dome) */}
               <path d="M150 70 C 160 50, 180 50, 190 70" fill="white" />
               <rect x="150" y="70" width="40" height="80" fill="white" />
               <rect x="165" y="90" width="10" height="20" fill="#f1f5f9"/>
               
               {/* Trees */}
               <path d="M230 110 C 220 110, 220 90, 230 80 C 245 70, 255 70, 270 80 C 280 90, 280 110, 270 110 Z" fill="white" />
               <line x1="250" y1="110" x2="250" y2="150" strokeWidth="2" />
               
               <path d="M290 120 C 280 120, 280 100, 290 95 C 300 85, 310 85, 320 95 C 330 100, 330 120, 320 120 Z" fill="white" />
               <line x1="305" y1="120" x2="305" y2="150" strokeWidth="2" />
            </svg>
            {/* Orange Pin */}
            <div className="absolute bottom-[105px] left-[106px] w-9 h-9 text-orange-500 drop-shadow-[0_4px_8px_rgba(249,115,22,0.4)]">
               <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
            </div>
         </div>
      </div>
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 xl:px-12 relative z-10">
        <div className="flex flex-col lg:flex-row gap-12 xl:gap-16 mb-16">
          
          {/* Left Column (Brand + Links) */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
            
            {/* Branding */}
            <div className="lg:col-span-1 pr-4">
              <Link to="/" className="text-3xl font-black tracking-tight flex items-center mb-4">
                <span className="text-[#0B1C47]">Biz</span>
                <span className="text-orange-500">Dial</span>
              </Link>
              <div className="w-8 h-1 bg-orange-500 rounded-full mb-6"></div>
              <p className="text-slate-500 text-[13px] mb-8 leading-relaxed font-medium">
                India's most trusted local search platform to discover, connect & grow with the best businesses near you.
              </p>
              <div className="flex items-center gap-4">
                <a href="#" className="w-10 h-10 bg-white border border-slate-100 shadow-sm rounded-full flex items-center justify-center text-[#1877F2] hover:bg-slate-50 transition-colors">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
                <a href="#" className="w-10 h-10 bg-white border border-slate-100 shadow-sm rounded-full flex items-center justify-center text-[#1DA1F2] hover:bg-slate-50 transition-colors">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                </a>
                <a href="#" className="w-10 h-10 bg-white border border-slate-100 shadow-sm rounded-full flex items-center justify-center text-[#0A66C2] hover:bg-slate-50 transition-colors">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </a>
                <a href="#" className="w-10 h-10 bg-white border border-slate-100 shadow-sm rounded-full flex items-center justify-center text-[#FF0000] hover:bg-slate-50 transition-colors">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                </a>
              </div>
            </div>
            {/* Quick Links */}
            <div className="lg:col-span-1 pl-0 md:pl-4 lg:border-l border-slate-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center shrink-0">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>
                </div>
                <h4 className="font-extrabold text-slate-900 text-[15px]">Quick Links</h4>
              </div>
              <div className="w-6 h-0.5 bg-orange-500 rounded-full mb-6 ml-[52px]"></div>
              <ul className="space-y-4 text-[13px] text-slate-600 font-semibold ml-[52px]">
                {['Top Categories', 'Featured Businesses', 'How BizDial Works', 'Browse Locations'].map((item, idx) => (
                  <li key={idx}><a href="#" className="flex items-center justify-between hover:text-orange-500 transition-colors group pr-4">{item} <ChevronRight size={14} className="text-orange-400 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" /></a></li>
                ))}
              </ul>
            </div>
            {/* Grow With Us */}
            <div className="lg:col-span-1 pl-0 md:pl-4 lg:border-l border-slate-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center shrink-0">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" /><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" /><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" /><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" /></svg>
                </div>
                <h4 className="font-extrabold text-slate-900 text-[15px]">Grow With Us</h4>
              </div>
              <div className="w-6 h-0.5 bg-orange-500 rounded-full mb-6 ml-[52px]"></div>
              <ul className="space-y-4 text-[13px] text-slate-600 font-semibold ml-[52px]">
                {['Premium Services', 'List Your Business', 'Business Login', 'Advertise with Us'].map((item, idx) => (
                  <li key={idx}><a href="#" className="flex items-center justify-between hover:text-orange-500 transition-colors group pr-4">{item} <ChevronRight size={14} className="text-orange-400 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" /></a></li>
                ))}
              </ul>
            </div>
            {/* Company */}
            <div className="lg:col-span-1 pl-0 md:pl-4 lg:border-l border-slate-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center shrink-0">
                  <Users size={18} strokeWidth={2.5} />
                </div>
                <h4 className="font-extrabold text-slate-900 text-[15px]">Company</h4>
              </div>
              <div className="w-6 h-0.5 bg-orange-500 rounded-full mb-6 ml-[52px]"></div>
              <ul className="space-y-4 text-[13px] text-slate-600 font-semibold ml-[52px]">
                {['About Us', 'Careers', 'Newsroom', 'Contact Us'].map((item, idx) => (
                  <li key={idx}><a href="#" className="flex items-center justify-between hover:text-orange-500 transition-colors group pr-4">{item} <ChevronRight size={14} className="text-orange-400 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" /></a></li>
                ))}
              </ul>
            </div>
          </div>
          {/* Right Column (Newsletter Card) */}
          <div className="w-full lg:w-[360px] shrink-0 lg:mt-[-40px]">
            <div className="bg-white rounded-3xl p-8 shadow-[0_15px_50px_rgba(0,0,0,0.06)] border border-slate-100 relative overflow-hidden h-full z-20">
              {/* Dotted top right */}
              <div className="absolute top-8 right-8 grid grid-cols-4 gap-2 opacity-20">
                {[...Array(16)].map((_, i) => <div key={i} className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>)}
              </div>
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-6">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
              </div>
              <h4 className="font-extrabold text-slate-900 text-lg mb-2">Stay Updated</h4>
              <div className="w-8 h-1 bg-blue-600 rounded-full mb-6"></div>
              <p className="text-[12px] text-slate-500 font-medium leading-relaxed mb-8 pr-4">
                Subscribe to get the latest updates and special offers directly to your inbox.
              </p>
              <div className="relative mb-4">
                <input type="text" placeholder="Enter your email" className="w-full pl-4 pr-10 py-3.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-blue-500 transition-colors" />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                </div>
              </div>
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all hover:scale-[1.02]">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
                Subscribe Now
              </button>
            </div>
          </div>
        </div>
        {/* Features Bar */}
        <div className="bg-white rounded-[2rem] p-6 lg:p-8 mb-12 shadow-[0_10px_30px_rgba(0,0,0,0.03)] border border-slate-100 flex flex-wrap lg:flex-nowrap items-center justify-between gap-6 relative z-20 mx-0 xl:mx-10">
          {/* Feature 1 */}
          <div className="flex items-center gap-4 flex-1 min-w-[200px]">
            <div className="w-14 h-14 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center shrink-0">
              <ShieldCheck size={28} strokeWidth={2} />
            </div>
            <div>
              <h4 className="font-extrabold text-slate-900 text-[15px] mb-1">Trusted by Millions</h4>
              <p className="text-[12px] text-slate-500 font-medium leading-tight">Verified businesses<br/>you can rely on.</p>
            </div>
          </div>
          {/* Divider */}
          <div className="hidden lg:block w-px h-12 bg-slate-200"></div>
          
          {/* Feature 2 */}
          <div className="flex items-center gap-4 flex-1 min-w-[200px]">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Search size={28} strokeWidth={2} />
            </div>
            <div>
              <h4 className="font-extrabold text-slate-900 text-[15px] mb-1">Smart Search</h4>
              <p className="text-[12px] text-slate-500 font-medium leading-tight">Find the best businesses<br/>near you instantly.</p>
            </div>
          </div>
          {/* Divider */}
          <div className="hidden lg:block w-px h-12 bg-slate-200"></div>
          {/* Feature 3 */}
          <div className="flex items-center gap-4 flex-1 min-w-[200px]">
            <div className="w-14 h-14 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center shrink-0">
              <Headphones size={28} strokeWidth={2} />
            </div>
            <div>
              <h4 className="font-extrabold text-slate-900 text-[15px] mb-1">24/7 Support</h4>
              <p className="text-[12px] text-slate-500 font-medium leading-tight">We're here to help<br/>you anytime.</p>
            </div>
          </div>
          {/* Divider */}
          <div className="hidden lg:block w-px h-12 bg-slate-200"></div>
          {/* Feature 4 */}
          <div className="flex items-center gap-4 flex-1 min-w-[200px]">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <TrendingUp size={28} strokeWidth={2} />
            </div>
            <div>
              <h4 className="font-extrabold text-slate-900 text-[15px] mb-1">Grow Your Business</h4>
              <p className="text-[12px] text-slate-500 font-medium leading-tight">Connect with more customers<br/>and grow your brand.</p>
            </div>
          </div>
        </div>
        {/* Bottom Footer (Copyright) */}
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
  );
};

export default NewFooter;
