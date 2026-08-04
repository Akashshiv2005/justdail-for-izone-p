import React from 'react';
import { Smartphone, Briefcase, MessageSquare, ChevronDown } from 'lucide-react';

export default function TopPromoBar() {
  return (
    <div className="bg-[#0B1C47] text-white py-2 px-4 md:px-8 flex flex-col md:flex-row items-center justify-between text-xs font-medium">
      <div className="flex items-center gap-2 mb-2 md:mb-0">
        <span className="text-blue-300"></span>
        <span>Grow your business on BizDial and reach millions of customers across India.</span>
      </div>
      <div className="flex items-center gap-6">
        <a href="#" className="hover:text-blue-300 flex items-center gap-1"><Smartphone size={14}/> Download BizDial App</a>
        <a href="#" className="hover:text-blue-300 flex items-center gap-1"><Briefcase size={14}/> Advertise with us</a>
        <a href="#" className="hover:text-blue-300 flex items-center gap-1"><MessageSquare size={14}/> Help & Support</a>
        <div className="flex items-center gap-1 cursor-pointer hover:text-blue-300">
          English <ChevronDown size={14} />
        </div>
      </div>
    </div>
  );
}
