import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ChevronDown, User as UserIcon, Menu, X } from 'lucide-react';

export default function MainHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
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
            { name: 'Categories', id: 'categories', hasDropdown: false },
            { name: 'How it Works', id: 'how-it-works', hasDropdown: false },
            { name: 'Pricing', id: 'pricing', hasDropdown: false },
            { name: 'For Business', id: 'for-business', hasDropdown: false },
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

        {/* Mobile Menu Toggle */}
        <button 
          className="lg:hidden p-2 text-slate-600 hover:text-blue-600 transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-100 p-4 absolute top-full left-0 right-0 shadow-lg flex flex-col gap-4 z-50">
          <div className="flex items-center bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 mb-2">
            <MapPin size={18} className="text-blue-600 mr-2" />
            <span className="text-sm font-semibold text-blue-700 mr-1 flex-1">Trichy</span>
            <ChevronDown size={16} className="text-blue-500" />
          </div>
          <nav className="flex flex-col gap-2">
            {[
              { name: 'Categories', id: 'categories' },
              { name: 'How it Works', id: 'how-it-works' },
              { name: 'Pricing', id: 'pricing' },
              { name: 'For Business', id: 'for-business' },
            ].map((item) => (
              <button 
                key={item.name}
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  const el = document.getElementById(item.id);
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-left py-3 px-4 rounded-xl text-sm font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
              >
                {item.name}
              </button>
            ))}
          </nav>
          <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-slate-100">
            <Link 
              to="/login" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 text-blue-600 font-bold border-2 border-blue-600 px-6 py-3 rounded-xl hover:bg-blue-50 transition-colors"
            >
              <UserIcon size={18} strokeWidth={2.5} /> Login
            </Link>
            <Link 
              to="/dashboard/owner" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-md shadow-blue-600/20"
            >
              List Your Business
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
