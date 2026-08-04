import React from 'react';
import { Mail, MessageCircle, Phone, FileText, HelpCircle, ChevronRight } from 'lucide-react';

export default function SupportTab() {
  const faqs = [
    { question: "How do I verify my business listing?", answer: "Go to the 'My Business' tab and click the verification badge to start the process. You will need to upload valid registration documents." },
    { question: "How long does it take for reviews to appear?", answer: "Once you approve a pending review in the 'Reviews' tab, it appears on your public profile instantly." },
    { question: "Can I hide my profile temporarily?", answer: "Yes, you can toggle your public profile visibility from the 'Settings' > 'Privacy' tab." }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Support Center</h2>
        <p className="text-slate-500 mt-1">Need help? Get in touch with our team or browse our FAQs.</p>
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
            <button className="text-sm font-bold bg-white text-slate-900 px-4 py-2 rounded-lg flex items-center gap-1 hover:bg-slate-100 transition-colors relative z-10">
              <FileText size={16} /> View Guides <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
