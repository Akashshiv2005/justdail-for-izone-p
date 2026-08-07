import React, { useState } from 'react';
import { Mail, MessageCircle, Phone, FileText, HelpCircle, ChevronRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SupportTab() {
  const [showGuideModal, setShowGuideModal] = useState(false);
  const faqs = [
    { question: "How do I verify my business listing?", answer: "Go to the 'My Business' tab and click the verification badge to start the process. You will need to upload valid registration documents." },
    { question: "How long does it take for reviews to appear?", answer: "Once you approve a pending review in the 'Reviews' tab, it appears on your public profile instantly." },
    { question: "Can I hide my profile temporarily?", answer: "Yes, you can toggle your public profile visibility from the 'Settings' > 'Privacy' tab." }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="p-4 sm:p-8 space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Support Center</h2>
          <p className="text-slate-500 mt-1">Need help? Get in touch with our team or browse our FAQs.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contact Cards */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                <MessageCircle className="text-blue-600" size={24} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-800">Live Chat Support</h3>
                <p className="text-slate-500 mt-1 mb-4 text-sm">Chat instantly with our merchant support team. Available Mon-Fri, 9am - 6pm.</p>
                <button 
                  onClick={() => alert('Live chat initiated!')}
                  className="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
                >
                  Start Chat
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center mb-4">
                <Phone className="text-emerald-600" size={20} />
              </div>
              <h3 className="font-bold text-slate-800 mb-1">Call Us</h3>
              <p className="text-slate-500 text-sm mb-4">Urgent issue? Speak to a representative.</p>
              <a href="tel:18001234567" className="text-emerald-600 font-bold hover:underline">1-800-123-4567</a>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center mb-4">
                <Mail className="text-purple-600" size={20} />
              </div>
              <h3 className="font-bold text-slate-800 mb-1">Email Support</h3>
              <p className="text-slate-500 text-sm mb-4">Send us an email and we'll reply within 24h.</p>
              <a href="mailto:support@bizdial.com" className="text-purple-600 font-bold hover:underline">support@bizdial.com</a>
            </div>
          </div>
        </div>

        {/* FAQs & Documentation */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <HelpCircle size={18} className="text-blue-600" /> Frequently Asked Questions
            </h3>
            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <div key={idx} className="border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                  <h4 className="font-semibold text-slate-800 text-sm mb-1">{faq.question}</h4>
                  <p className="text-slate-500 text-sm">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-800 rounded-2xl p-6 text-white shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-8"></div>
            <h3 className="font-bold mb-2 relative z-10">Read the Documentation</h3>
            <p className="text-slate-300 text-sm mb-4 relative z-10">Learn how to maximize your business profile with our comprehensive guides.</p>
            <button 
              onClick={() => setShowGuideModal(true)}
              className="text-sm font-bold bg-white text-slate-900 px-4 py-2 rounded-lg flex items-center gap-1 hover:bg-slate-100 transition-colors relative z-10"
            >
              <FileText size={16} /> View Guides <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showGuideModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setShowGuideModal(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-[1.5rem] shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] border border-slate-100"
            >
              <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-white shrink-0">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                    <FileText size={16} />
                  </div>
                  <h3 className="font-bold text-lg text-slate-900">Platform Guides</h3>
                </div>
                <button onClick={() => setShowGuideModal(false)} className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
                  <X size={18} />
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto custom-scrollbar flex-1 bg-slate-50/50">
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-8">
                  
                  <div>
                    <h3 className="font-bold text-xl text-slate-800">Business Profile Optimization Guide</h3>
                    <p className="text-slate-500 mt-1">Complete guide to maximizing traffic, leads, and SEO ranking on BizDial</p>
                  </div>

                  <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-5">
                    <h4 className="font-bold text-blue-900 flex items-center gap-2 mb-3">
                      🚀 Quick Start Checklist
                    </h4>
                    <p className="text-sm text-blue-800 mb-4 font-medium">Completing these 5 steps boosts profile view rates by over 300%:</p>
                    <ul className="space-y-3 text-sm text-slate-700">
                      <li className="flex items-start gap-3"><span className="text-emerald-500 mt-0.5 shrink-0 bg-emerald-100 rounded-full p-0.5"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg></span> 1. Upload high-res logo and full-width cover banner in <strong>My Business</strong>.</li>
                      <li className="flex items-start gap-3"><span className="text-emerald-500 mt-0.5 shrink-0 bg-emerald-100 rounded-full p-0.5"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg></span> 2. Submit official business registration documents for <strong>Verified Badge</strong> status.</li>
                      <li className="flex items-start gap-3"><span className="text-emerald-500 mt-0.5 shrink-0 bg-emerald-100 rounded-full p-0.5"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg></span> 3. Add at least 5 products/services with pricing & details in <strong>Products & Services</strong>.</li>
                      <li className="flex items-start gap-3"><span className="text-emerald-500 mt-0.5 shrink-0 bg-emerald-100 rounded-full p-0.5"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg></span> 4. Fill in full address, exact map coordinates, and contact options (Phone & WhatsApp).</li>
                      <li className="flex items-start gap-3"><span className="text-emerald-500 mt-0.5 shrink-0 bg-emerald-100 rounded-full p-0.5"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg></span> 5. Create your first promotion discount banner in <strong>Promotions & Offers</strong>.</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-800 text-lg mb-2">1. Verified Business Status</h4>
                    <p className="text-sm text-slate-600 mb-4 leading-relaxed">Verified profiles rank higher in location search results and earn customer trust. To get verified:</p>
                    <ol className="list-decimal list-inside space-y-2 text-sm text-slate-700 ml-2 font-medium">
                      <li>Navigate to <strong>My Business</strong> profile tab.</li>
                      <li>Click on the <strong>Upload Verification Documents</strong> section.</li>
                      <li>Provide your GST, Business Registration certificate, or utility bill for admin approval.</li>
                    </ol>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-800 text-lg mb-2">2. Products & Services Catalog</h4>
                    <p className="text-sm text-slate-600 mb-4 leading-relaxed">Customers on BizDial browse catalog items before placing phone inquiries or requests:</p>
                    <ul className="list-disc list-inside space-y-2 text-sm text-slate-700 ml-2 font-medium">
                      <li>Map your custom services to master platform taxonomy categories for programmatic SEO discovery.</li>
                      <li>Add clear pricing, description details, and images for every offering.</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-800 text-lg mb-2">3. Managing Incoming Customer Leads</h4>
                    <p className="text-sm text-slate-600 mb-4 leading-relaxed">When users click "Call Now", "WhatsApp", or send an inquiry from your business listing:</p>
                    <ul className="list-disc list-inside space-y-2 text-sm text-slate-700 ml-2 font-medium">
                      <li>Leads automatically register in your <strong>Leads</strong> tab.</li>
                      <li>Respond within 15 minutes to increase customer conversion probability.</li>
                      <li>Update lead status flags (New ➔ In Contact ➔ Converted) to keep track of sales pipeline.</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-800 text-lg mb-2">4. Programmatic Local SEO Optimization</h4>
                    <p className="text-sm text-slate-600 mb-4 leading-relaxed">BizDial automatically builds landing pages like "Best Services in [Your City]". To optimize your ranking:</p>
                    <ul className="list-disc list-inside space-y-2 text-sm text-slate-700 ml-2 font-medium">
                      <li>Keep your primary category & subcategory accurate.</li>
                      <li>Ensure your area, city, district, and state fields are precisely defined.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
