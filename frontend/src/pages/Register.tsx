import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
import { apiClient } from '../lib/api';

  Building2, User, Mail, Lock, Phone, MapPin,
  FileText, CheckCircle2, ArrowRight, ArrowLeft,
  Briefcase, ShieldCheck, FileCheck2, Target, TrendingUp, X, File
} from 'lucide-react';

const Register = () => {
  const [step, setStep] = useState(() => {
    const saved = localStorage.getItem('registerStep');
    return saved ? parseInt(saved, 10) : 1;
  });
  const navigate = useNavigate();

  // Form field states
  const [name, setName] = useState(() => localStorage.getItem('registerName') || '');
  const [phone, setPhone] = useState(() => localStorage.getItem('registerPhone') || '');
  const [email, setEmail] = useState(() => localStorage.getItem('registerEmail') || '');
  const [password, setPassword] = useState(() => localStorage.getItem('registerPassword') || '');
  const [businessName, setBusinessName] = useState(() => localStorage.getItem('registerBusinessName') || '');
  const [category, setCategory] = useState(() => localStorage.getItem('registerCategory') || '');
  const [address, setAddress] = useState(() => localStorage.getItem('registerAddress') || '');
  const [city, setCity] = useState(() => localStorage.getItem('registerCity') || '');

  React.useEffect(() => {
    localStorage.setItem('registerStep', step.toString());
    localStorage.setItem('registerName', name);
    localStorage.setItem('registerPhone', phone);
    localStorage.setItem('registerEmail', email);
    localStorage.setItem('registerPassword', password);
    localStorage.setItem('registerBusinessName', businessName);
    localStorage.setItem('registerCategory', category);
    localStorage.setItem('registerAddress', address);
    localStorage.setItem('registerCity', city);
  }, [step, name, phone, email, password, businessName, category, address, city]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [businessRegFile, setBusinessRegFile] = useState<File | null>(null);
  const [panFile, setPanFile] = useState<File | null>(null);
  const [gstFile, setGstFile] = useState<File | null>(null);

  const nextStep = () => setStep(s => Math.min(s + 1, 4));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('password', password);
      formData.append('phone', phone);
      formData.append('business_name', businessName);
      formData.append('category', category);
      formData.append('address', address);
      formData.append('city', city);
      if (businessRegFile) formData.append('business_reg_doc', businessRegFile);
      if (panFile) formData.append('pan_doc', panFile);
      if (gstFile) formData.append('gstin_doc', gstFile);

      const res = await apiClient('/api/auth/register', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || 'Registration failed');
      }
      
      // Clear localStorage on success
      ['registerStep', 'registerName', 'registerPhone', 'registerEmail', 'registerPassword', 'registerBusinessName', 'registerCategory', 'registerAddress', 'registerCity'].forEach(key => localStorage.removeItem(key));
      
      setStep(4); // Success step
    } catch (err: any) {
      setSubmitError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Pane - Visual & Marketing (Hidden on mobile) */}
      <div className="hidden lg:flex w-[45%] bg-slate-900 relative flex-col justify-between overflow-hidden">
        {/* Background Image & Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1556761175-5973dc0f32d7?auto=format&fit=crop&q=80&w=2000"
            alt="Business Background"
            className="w-full h-full object-cover opacity-30 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-slate-900/40"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-orange-500/20 mix-blend-color"></div>
        </div>

        {/* Logo area */}
        <div className="relative z-10 p-12">
          <Link to="/" className="inline-block">
            <h1 className="text-4xl font-black tracking-tight text-white drop-shadow-md">
              <span className="text-blue-500">Biz</span><span className="text-orange-400">Dial</span>
            </h1>
          </Link>
        </div>

        {/* Main Marketing Copy */}
        <div className="relative z-10 p-12 mb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <span className="px-4 py-1.5 rounded-full bg-blue-500/20 text-blue-300 text-sm font-bold border border-blue-500/30 mb-6 inline-block backdrop-blur-md">
              Partner with the Best
            </span>
            <h2 className="text-5xl font-black text-white leading-[1.1] mb-6">
              Grow Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-orange-400">
                Business
              </span> Online
            </h2>
            <p className="text-lg text-slate-300 max-w-md leading-relaxed">
              Join thousands of businesses that use BizDial to attract more customers, manage appointments, and increase their revenue.
            </p>
          </motion.div>

          <div className="mt-12 space-y-6">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-white backdrop-blur-md border border-white/10">
                <Target size={24} />
              </div>
              <div>
                <h4 className="text-white font-bold">Reach more local customers</h4>
                <p className="text-slate-400 text-sm">Target customers specifically in your city area.</p>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }} className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-white backdrop-blur-md border border-white/10">
                <TrendingUp size={24} />
              </div>
              <div>
                <h4 className="text-white font-bold">Boost your daily revenue</h4>
                <p className="text-slate-400 text-sm">Partners see an average 40% increase in sales.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Right Pane - Form Area */}
      <div className="w-full lg:w-[55%] flex flex-col justify-center relative bg-slate-50 overflow-y-auto">
        <div className="absolute top-8 right-8 z-10">
          <p className="text-sm font-medium text-slate-500">
            Already a partner? <Link to="/login" className="text-blue-600 font-bold hover:underline">Sign In</Link>
          </p>
        </div>

        <div className="w-full max-w-2xl mx-auto p-8 sm:p-12 lg:p-16 my-auto">

          {/* Header & Progress Indicator */}
          <div className="mb-10">
            <h2 className="text-3xl font-black text-slate-900">Create your Account</h2>
            <p className="text-slate-500 mt-2 text-lg">Let's get your store set up and verified.</p>

            {/* Progress Bar */}
            {step < 4 && (
              <div className="flex items-center gap-3 mt-10 max-w-md">
                {[1, 2, 3].map((s) => (
                  <React.Fragment key={s}>
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-sm transition-all duration-300 shadow-sm ${step === s ? 'bg-blue-600 text-white scale-110 shadow-blue-500/30' :
                        step > s ? 'bg-slate-900 text-white' : 'bg-white text-slate-400 border border-slate-200'
                      }`}>
                      {step > s ? <CheckCircle2 size={20} /> : s}
                    </div>
                    {s < 3 && (
                      <div className={`flex-1 h-1.5 rounded-full transition-colors duration-500 ${step > s ? 'bg-slate-900' : 'bg-slate-200'
                        }`} />
                    )}
                  </React.Fragment>
                ))}
              </div>
            )}
            {step < 4 && (
              <div className="flex justify-between max-w-md mt-4 text-xs font-bold text-slate-500 px-1">
                <span className={step >= 1 ? 'text-slate-900' : ''}>Account Setup</span>
                <span className={step >= 2 ? 'text-slate-900' : ''}>Business Info</span>
                <span className={step >= 3 ? 'text-slate-900' : ''}>Verification</span>
              </div>
            )}
          </div>

          {/* Form Container */}
          <div className="relative min-h-[500px]">
            <AnimatePresence mode="wait">

              {/* STEP 1: Account Details */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-white rounded-[2rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100"
                >
                  <div className="mb-8 border-b border-slate-100 pb-6">
                    <h3 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center"><User size={20} /></div>
                      Owner Details
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><User size={18} /></span>
                        <input type="text" placeholder="Rajesh Kumar" value={name} onChange={e => setName(e.target.value.replace(/[^a-zA-Z\s]/g, ''))} className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none bg-slate-50 focus:bg-white transition-all font-medium" required />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Phone Number</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><Phone size={18} /></span>
                        <input type="tel" placeholder="+91 98765 43210" value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))} className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none bg-slate-50 focus:bg-white transition-all font-medium" required />
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><Mail size={18} /></span>
                        <input type="email" placeholder="owner@business.com" value={email} onChange={e => setEmail(e.target.value)} pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$" title="Please enter a valid email address (e.g. username@gmail.com)" className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none bg-slate-50 focus:bg-white transition-all font-medium" required />
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-slate-700 mb-2">Create Password</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><Lock size={18} /></span>
                        <input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none bg-slate-50 focus:bg-white transition-all font-medium" required />
                      </div>
                    </div>
                  </div>

                  <div className="mt-10">
                    <button onClick={nextStep} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 group">
                      Continue to Business Details <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: Business Details */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-white rounded-[2rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100"
                >
                  <div className="mb-8 border-b border-slate-100 pb-6">
                    <h3 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center"><Building2 size={20} /></div>
                      Store Information
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-slate-700 mb-2">Registered Business Name</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><Briefcase size={18} /></span>
                        <input type="text" placeholder="e.g. Shree Mobile Store" value={businessName} onChange={e => setBusinessName(e.target.value)} className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none bg-slate-50 focus:bg-white transition-all font-medium" required />
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-slate-700 mb-2">Business Category</label>
                      <div className="relative">
                        <select value={category} onChange={e => setCategory(e.target.value)} className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none bg-slate-50 focus:bg-white transition-all font-medium appearance-none" required>
                          <option value="">Select a category</option>
                          <option>Car Hire</option>
                          <option>Caterers</option>
                          <option>Chartered Accountant</option>
                          <option>Computer Training Institutes</option>
                          <option>Courier Services</option>
                          <option>Computer & Laptop Repair</option>
                          <option>Car Repair & Services</option>
                          <option>Dermatologists</option>
                          <option>Dentists</option>
                          <option>Electricians</option>
                          <option>Event Organizer</option>
                          <option>Real Estate</option>
                          <option>Fabricators</option>
                          <option>Furniture Repair Services</option>
                          <option>Hospitals</option>
                          <option>House keeping Services</option>
                          <option>Hobbies</option>
                          <option>Interior Designers</option>
                          <option>Internet Website Designers</option>
                          <option>Jewellery Showrooms</option>
                          <option>Lawyers</option>
                          <option>Transporters</option>
                          <option>Photographers</option>
                          <option>Nursing Services</option>
                          <option>Printing & Publishing</option>
                          <option>Placement Services</option>
                          <option>Pest Control Services</option>
                          <option>Painting Contractors</option>
                          <option>Packers & Movers</option>
                          <option>Scrap Dealers</option>
                          <option>Scrap Buyers</option>
                          <option>Registration Consultants</option>
                          <option>Security System</option>
                          <option>Coaching</option>
                          <option>Vocational training</option>
                          <option>Home Services</option>
                          <option>Beauty Salons</option>
                          <option>Photography Studio</option>
                          <option>Finance</option>
                          <option>HVAC Services</option>
                          <option>Other Services</option>
                        </select>
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">▼</span>
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-slate-700 mb-2">City</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><MapPin size={18} /></span>
                        <input type="text" placeholder="e.g. Trichy" value={city} onChange={e => setCity(e.target.value)} className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none bg-slate-50 focus:bg-white transition-all font-medium" required />
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-slate-700 mb-2">Store Address</label>
                      <div className="relative">
                        <span className="absolute left-4 top-4 text-slate-400"><MapPin size={18} /></span>
                        <textarea rows={3} placeholder="123 Tech Market, Station Road..." value={address} onChange={e => setAddress(e.target.value)} className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none bg-slate-50 focus:bg-white transition-all font-medium"></textarea>
                      </div>
                    </div>
                  </div>

                  <div className="mt-10 flex gap-4">
                    <button onClick={prevStep} className="px-6 py-4 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors flex items-center gap-2">
                      <ArrowLeft size={18} />
                    </button>
                    <button onClick={nextStep} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 group">
                      Continue to Verification <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: Legal Documents */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-white rounded-[2rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100"
                >
                  <div className="mb-6 border-b border-slate-100 pb-6 flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center shrink-0">
                      <ShieldCheck size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">Mandatory Verification</h3>
                      <p className="text-sm text-slate-500 mt-1">Upload clear copies of the following legal documents. This is required to keep our platform secure.</p>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Upload 1 */}
                    <div className="relative">
                      <input
                        type="file"
                        id="business-reg-upload"
                        className="hidden"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setBusinessRegFile(e.target.files[0]);
                          }
                        }}
                      />
                      {businessRegFile ? (
                        <div className="border border-green-200 bg-green-50/30 rounded-2xl p-5 flex items-center gap-4">
                          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600">
                            <File size={24} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-slate-900 text-sm truncate">{businessRegFile.name}</h4>
                            <p className="text-xs text-slate-500 mt-0.5">{(businessRegFile.size / 1024 / 1024).toFixed(2)} MB • Ready to upload</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => setBusinessRegFile(null)}
                            className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
                          >
                            <X size={18} />
                          </button>
                        </div>
                      ) : (
                        <label
                          htmlFor="business-reg-upload"
                          className="border-2 border-dashed border-slate-200 rounded-2xl p-5 hover:border-blue-500 hover:bg-blue-50/50 transition-all group cursor-pointer flex items-center gap-4"
                        >
                          <div className="w-12 h-12 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-blue-600 shadow-sm group-hover:scale-110 transition-transform">
                            <FileCheck2 size={24} />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-slate-900 text-sm">Business Registration</h4>
                            <p className="text-xs text-slate-500 mt-0.5">Shop Act / Trade License / Incorporation</p>
                          </div>
                          <div className="px-4 py-2 bg-white border border-slate-200 group-hover:border-blue-300 group-hover:text-blue-600 rounded-lg text-sm font-bold text-slate-600 shadow-sm transition-colors">
                            Upload
                          </div>
                        </label>
                      )}
                    </div>

                    {/* Upload 2 */}
                    <div className="relative">
                      <input
                        type="file"
                        id="pan-upload"
                        className="hidden"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setPanFile(e.target.files[0]);
                          }
                        }}
                      />
                      {panFile ? (
                        <div className="border border-green-200 bg-green-50/30 rounded-2xl p-5 flex items-center gap-4">
                          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600">
                            <File size={24} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-slate-900 text-sm truncate">{panFile.name}</h4>
                            <p className="text-xs text-slate-500 mt-0.5">{(panFile.size / 1024 / 1024).toFixed(2)} MB • Ready to upload</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => setPanFile(null)}
                            className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
                          >
                            <X size={18} />
                          </button>
                        </div>
                      ) : (
                        <label
                          htmlFor="pan-upload"
                          className="border-2 border-dashed border-slate-200 rounded-2xl p-5 hover:border-blue-500 hover:bg-blue-50/50 transition-all group cursor-pointer flex items-center gap-4"
                        >
                          <div className="w-12 h-12 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-blue-600 shadow-sm group-hover:scale-110 transition-transform">
                            <FileText size={24} />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-slate-900 text-sm">PAN Card</h4>
                            <p className="text-xs text-slate-500 mt-0.5">Business or Owner Tax ID</p>
                          </div>
                          <div className="px-4 py-2 bg-white border border-slate-200 group-hover:border-blue-300 group-hover:text-blue-600 rounded-lg text-sm font-bold text-slate-600 shadow-sm transition-colors">
                            Upload
                          </div>
                        </label>
                      )}
                    </div>

                    {/* Upload 3 */}
                    <div className="relative">
                      <input
                        type="file"
                        id="gst-upload"
                        className="hidden"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setGstFile(e.target.files[0]);
                          }
                        }}
                      />
                      {gstFile ? (
                        <div className="border border-green-200 bg-green-50/30 rounded-2xl p-5 flex items-center gap-4">
                          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600">
                            <File size={24} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-slate-900 text-sm truncate">{gstFile.name}</h4>
                            <p className="text-xs text-slate-500 mt-0.5">{(gstFile.size / 1024 / 1024).toFixed(2)} MB • Ready to upload</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => setGstFile(null)}
                            className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
                          >
                            <X size={18} />
                          </button>
                        </div>
                      ) : (
                        <label
                          htmlFor="gst-upload"
                          className="border-2 border-dashed border-slate-200 rounded-2xl p-5 hover:border-blue-500 hover:bg-blue-50/50 transition-all group cursor-pointer flex items-center gap-4"
                        >
                          <div className="w-12 h-12 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-blue-600 shadow-sm group-hover:scale-110 transition-transform">
                            <FileText size={24} />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-slate-900 text-sm">GSTIN Certificate <span className="font-normal text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded ml-1 text-[10px]">Optional</span></h4>
                            <p className="text-xs text-slate-500 mt-0.5">If applicable for your category</p>
                          </div>
                          <div className="px-4 py-2 bg-white border border-slate-200 group-hover:border-blue-300 group-hover:text-blue-600 rounded-lg text-sm font-bold text-slate-600 shadow-sm transition-colors">
                            Upload
                          </div>
                        </label>
                      )}
                    </div>

                    {submitError && (
                      <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 font-medium">
                        {submitError}
                      </div>
                    )}
                    <div className="mt-8 flex gap-4 pt-4 border-t border-slate-100">
                      <button type="button" onClick={prevStep} className="px-6 py-4 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors flex items-center gap-2">
                        <ArrowLeft size={18} />
                      </button>
                      <button type="submit" disabled={isSubmitting} className="flex-1 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-slate-900/20 flex items-center justify-center gap-2">
                        {isSubmitting ? (
                          <>Processing securely...</>
                        ) : (
                          <>Submit Application <CheckCircle2 size={18} /></>
                        )}
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* STEP 4: Success / Pending */}
              {step === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-[2rem] p-12 shadow-xl shadow-slate-200/50 border border-slate-100 text-center flex flex-col items-center justify-center"
                >
                  <div className="w-28 h-28 bg-gradient-to-tr from-green-400 to-green-500 text-white rounded-full flex items-center justify-center mb-8 relative shadow-lg shadow-green-500/30">
                    <CheckCircle2 size={56} strokeWidth={2.5} />
                    <motion.div
                      animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="absolute inset-0 border-4 border-green-400 rounded-full"
                    />
                  </div>

                  <h3 className="text-3xl font-black text-slate-900 mb-4">Application Received!</h3>
                  <p className="text-slate-600 text-lg mb-8 max-w-sm mx-auto leading-relaxed">
                    Your details have been securely sent to our team. <strong className="text-slate-900">Your account is currently Pending Approval.</strong>
                  </p>

                  <div className="bg-orange-50 border border-orange-100 rounded-2xl p-6 w-full mb-8 text-left flex gap-4">
                    <ShieldCheck className="text-orange-500 shrink-0 mt-0.5" size={24} />
                    <p className="text-sm text-slate-700 font-medium leading-relaxed">
                      We'll review your documents within 24-48 hours. You will receive an email once your business is verified and live.
                    </p>
                  </div>

                  <Link to="/login" className="w-full inline-block bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-slate-900/20">
                    Return to Login
                  </Link>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Register;
