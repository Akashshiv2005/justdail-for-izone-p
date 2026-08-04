import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Building2, ShieldCheck, CheckCircle2, AlertCircle, Phone, Mail, Lock, 
  MapPin, Clock, Award, FileText, Upload, CreditCard, ChevronRight, ChevronLeft, Check, Sparkles, Globe, DollarSign, Image
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function EnterpriseRegister() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(() => {
    const savedStep = localStorage.getItem('enterpriseRegisterStep');
    return savedStep ? parseInt(savedStep, 10) : 1;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [categories, setCategories] = useState<{id: number, name: string}[]>([]);
  const [subCategories, setSubCategories] = useState<{id: number, name: string}[]>([]);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/admin/categories/')
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error("Error fetching categories:", err));
  }, []);



  // Default Form State matching all 12 Steps
  const defaultFormData = {
    // Step 1: Account Information & OTP
    fullName: '',
    email: '',
    phone: '',
    whatsapp: '',
    password: '',
    confirmPassword: '',
    referralCode: '',
    emailOtp: '',
    mobileOtp: '',
    isEmailVerified: false,
    isMobileVerified: false,
    otpMsg: '',

    // Step 2: Business Information
    businessName: '',
    displayName: '',
    businessType: '',
    category: '',
    subCategory: '',
    description: '',
    tags: '',
    foundedYear: '',
    employeeCount: '',
    businessSize: '',
    annualTurnover: '',
    isGstRegistered: false,
    hasPan: false,
    regNumber: '',
    licenseNumber: '',
    panNumber: '',
    gstNumber: '',

    // Step 3: Location Details
    country: '',
    state: '',
    district: '',
    city: '',
    area: '',
    locality: '',
    address: '',
    landmark: '',
    street: '',
    building: '',
    doorNumber: '',
    postalCode: '',
    latitude: '',
    longitude: '',
    serviceRadius: '',
    locationType: '',
    mapLink: '',

    // Step 4: Contact Details & Social Links
    primaryMobile: '',
    secondaryMobile: '',
    landline: '',
    contactWhatsapp: '',
    contactEmail: '',
    website: '',
    facebook: '',
    instagram: '',
    linkedin: '',
    twitter: '',
    youtube: '',
    telegram: '',

    // Step 5: Working Hours
    mondayHours: '',
    tuesdayHours: '',
    wednesdayHours: '',
    thursdayHours: '',
    fridayHours: '',
    saturdayHours: '',
    sundayHours: '',
    is24x7: false,
    hasEmergency: false,
    requiresAppointment: false,

    // Step 6: Services, Products & Brands
    servicesOffered: '',
    productsList: '',
    brandsHandled: '',
    priceRange: '',
    languagesSpoken: '',
    paymentMethods: [] as string[],
    hasHomeDelivery: false,
    hasPickup: false,
    hasOnlineConsultation: false,
    hasWarranty: false,

    // Step 7: Media & Branding
    logoFile: null as File | null,
    coverFile: null as File | null,
    galleryFiles: [] as File[],
    brochureFile: null as File | null,

    // Step 8: Document Verification
    docReg: null as File | null,
    docPan: null as File | null,
    docGst: null as File | null,
    docFssai: null as File | null,
    docAadhaar: null as File | null,

    // Step 9: Bank Details & UPI
    accountHolder: '',
    bankName: '',
    branchName: '',
    ifscCode: '',
    accountNumber: '',
    upiId: '',
    qrFile: null as File | null,

    // Step 10: Features & Amenities
    featuresList: [] as string[],

    // Step 11: SEO Metadata
    seoTitle: '',
    seoDescription: '',
    seoKeywords: '',
    seoSlug: '',
    schemaType: '',
  };

  const [formData, setFormData] = useState(() => {
    const savedData = localStorage.getItem('enterpriseRegisterDraft');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        return {
          ...defaultFormData,
          ...parsed,
          // Reset file fields since they cannot be JSON serialized
          logoFile: null,
          coverFile: null,
          galleryFiles: [],
          brochureFile: null,
          docReg: null,
          docPan: null,
          docGst: null,
          docFssai: null,
          docAadhaar: null,
          qrFile: null,
        };
      } catch (e) {
        console.error("Failed to parse saved draft", e);
      }
    }
    return defaultFormData;
  });

  useEffect(() => {
    const dataToSave = { ...formData };
    delete (dataToSave as any).logoFile;
    delete (dataToSave as any).coverFile;
    delete (dataToSave as any).galleryFiles;
    delete (dataToSave as any).brochureFile;
    delete (dataToSave as any).docReg;
    delete (dataToSave as any).docPan;
    delete (dataToSave as any).docGst;
    delete (dataToSave as any).docFssai;
    delete (dataToSave as any).docAadhaar;
    delete (dataToSave as any).qrFile;
    localStorage.setItem('enterpriseRegisterDraft', JSON.stringify(dataToSave));
  }, [formData]);

  useEffect(() => {
    localStorage.setItem('enterpriseRegisterStep', currentStep.toString());
  }, [currentStep]);

  useEffect(() => {
    const selectedCat = categories.find(c => c.name === formData.category);
    if (selectedCat) {
      fetch(`http://127.0.0.1:8000/api/admin/subcategories/?category_id=${selectedCat.id}`)
        .then(res => res.json())
        .then(data => setSubCategories(data))
        .catch(err => console.error("Error fetching subcategories:", err));
    } else {
      setSubCategories([]);
    }
  }, [categories, formData.category]); // Re-fetch if category changes

  const steps = [
    'Account & OTP', 'Business Info', 'Location', 'Contact Details', 
    'Working Hours', 'Services Offered', 'Media & Logos', 'Documents', 
    'SEO Setup', 'Review & Submit'
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const toggleArrayItem = (field: 'paymentMethods' | 'featuresList', item: string) => {
    setFormData((prev: any) => {
      const arr = prev[field] as string[];
      const updated = arr.includes(item) ? arr.filter(i => i !== item) : [...arr, item];
      return { ...prev, [field]: updated };
    });
  };

  const sendOtp = async (destination: string, type: 'email' | 'mobile') => {
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ destination, type })
      });
      const data = await res.json();
      setFormData((prev: any) => ({ ...prev, otpMsg: `Demo OTP for ${type} (${destination}) is 123456` }));
    } catch (e) {
      console.error(e);
    }
  };

  const verifyOtp = (type: 'email' | 'mobile') => {
    const code = type === 'email' ? formData.emailOtp : formData.mobileOtp;
    if (code === '123456' || code === '999999') {
      setFormData((prev: any) => ({
        ...prev,
        isEmailVerified: type === 'email' ? true : prev.isEmailVerified,
        isMobileVerified: type === 'mobile' ? true : prev.isMobileVerified,
        otpMsg: `${type.toUpperCase()} Verified Successfully!`
      }));
    } else {
      alert('Invalid OTP code. Please enter 123456 for testing.');
    }
  };

  const handleNext = () => {
    if (currentStep < 10) setCurrentStep(prev => prev + 1);
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = new FormData();
      data.append('full_name', formData.fullName || 'Business Owner');
      data.append('email', formData.email);
      data.append('phone', formData.phone);
      data.append('password', formData.password);
      data.append('business_name', formData.businessName);
      data.append('business_type', formData.businessType);
      data.append('category', formData.category);
      data.append('city', formData.city);
      data.append('address', formData.address || `${formData.doorNumber}, ${formData.street}, ${formData.area}`);
      data.append('pan_number', formData.panNumber);
      data.append('gst_number', formData.gstNumber);
      data.append('description', formData.description);

      if (formData.docReg) data.append('business_reg_doc', formData.docReg);
      if (formData.docPan) data.append('pan_doc', formData.docPan);
      if (formData.docGst) data.append('gstin_doc', formData.docGst);
      if (formData.logoFile) data.append('logo_file', formData.logoFile);
      if (formData.coverFile) data.append('cover_file', formData.coverFile);

      const res = await fetch('/api/auth/register-enterprise', {
        method: 'POST',
        body: data,
      });

      const result = await res.json();
      if (!res.ok) {
        let errMsg = 'Registration failed';
        if (result.detail) {
          if (Array.isArray(result.detail)) {
            errMsg = result.detail.map((d: any) => `${d.loc ? d.loc[d.loc.length - 1] + ': ' : ''}${d.msg}`).join(', ');
          } else {
            errMsg = typeof result.detail === 'string' ? result.detail : JSON.stringify(result.detail);
          }
        }
        throw new Error(errMsg);
      }

      localStorage.removeItem('enterpriseRegisterDraft');
      localStorage.removeItem('enterpriseRegisterStep');
      setShowSuccessModal(true);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-16">
      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 py-4 px-6 sticky top-0 z-40 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-2xl font-black text-slate-900">
            <span className="text-blue-600">Biz</span><span className="text-orange-500">Dial</span>
            <span className="text-xs bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-extrabold uppercase ml-2 border border-blue-200">Enterprise Onboarding</span>
          </Link>
          <div className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
            Step <span className="text-blue-600 font-black">{currentStep}</span> of 10: <span className="text-slate-900 font-extrabold">{steps[currentStep - 1]}</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-5xl mx-auto px-4 mt-6">
        {/* Progress Bar Header */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 mb-6 shadow-sm overflow-x-auto">
          <div className="flex items-center min-w-max gap-3 text-xs font-bold text-slate-500">
            {steps.map((stepName, idx) => {
              const stepNum = idx + 1;
              const isDone = currentStep > stepNum;
              const isCurrent = currentStep === stepNum;
              return (
                <div key={stepName} className="flex items-center gap-1.5">
                  <button 
                    type="button" 
                    onClick={() => setCurrentStep(stepNum)}
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-extrabold text-[11px] transition-all ${
                      isDone ? 'bg-green-600 text-white' :
                      isCurrent ? 'bg-blue-600 text-white shadow-md ring-4 ring-blue-100' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                    }`}
                  >
                    {isDone ? <Check size={14} /> : stepNum}
                  </button>
                  <span className={isCurrent ? 'text-blue-600 font-black' : isDone ? 'text-slate-800 font-semibold' : ''}>{stepName}</span>
                  {idx < steps.length - 1 && <ChevronRight size={14} className="text-slate-300 mx-1" />}
                </div>
              );
            })}
          </div>
        </div>

        {/* Card Body */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xl">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-sm font-bold rounded-xl flex items-center gap-2">
              <AlertCircle size={18} /> {error}
            </div>
          )}

          <form autoComplete="off" onSubmit={currentStep === 10 ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }}>
            
            {/* ================= STEP 1: ACCOUNT & OTP ================= */}
            {currentStep === 1 && (
              <div className="space-y-5">
                <div className="border-b border-slate-100 pb-3">
                  <h2 className="text-xl font-black text-slate-900">Step 1: Account Information & Verification</h2>
                  <p className="text-xs text-slate-500 mt-1">Create your master business owner credentials and verify email & mobile numbers.</p>
                </div>

                {formData.otpMsg && (
                  <div className="p-3 bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold rounded-xl">
                    {formData.otpMsg}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Owner Full Name *</label>
                  <input autoComplete="off" type="text" required value={formData.fullName} onChange={(e) => handleInputChange('fullName', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. Dr. Kiruthiga Manohar" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-xs font-bold text-slate-700">Business Email Address *</label>
                    </div>
                    <div className="flex gap-2">
                      <input autoComplete="off" type="email" required value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)} className="flex-1 px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-blue-500" placeholder="owner@business.com" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-xs font-bold text-slate-700">Mobile Number *</label>
                      {formData.isMobileVerified ? (
                        <span className="text-[11px] font-bold text-green-600 flex items-center gap-1"><CheckCircle2 size={12} /> Verified</span>
                      ) : (
                        <button type="button" onClick={() => sendOtp(formData.phone || '9876543210', 'mobile')} className="text-[11px] font-bold text-blue-600 hover:underline">Send OTP</button>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <input autoComplete="off" type="tel" required value={formData.phone} onChange={(e) => handleInputChange('phone', e.target.value)} className="flex-1 px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-blue-500" placeholder="+91 98765 43210" />
                    </div>
                    {!formData.isMobileVerified && (
                      <div className="flex gap-2 mt-2">
                        <input autoComplete="off" type="text" placeholder="Enter OTP" value={formData.mobileOtp} onChange={(e) => handleInputChange('mobileOtp', e.target.value)} className="flex-1 px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
                        <button type="button" onClick={() => verifyOtp('mobile')} className="px-5 py-2 bg-blue-50 text-blue-600 border border-blue-200 rounded-xl text-xs font-bold hover:bg-blue-100">Verify</button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Password *</label>
                    <input autoComplete="new-password" type="password" required value={formData.password} onChange={(e) => handleInputChange('password', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-blue-500" placeholder="••••••••" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Confirm Password *</label>
                    <input autoComplete="new-password" type="password" required value={formData.confirmPassword} onChange={(e) => handleInputChange('confirmPassword', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-blue-500" placeholder="••••••••" />
                  </div>
                </div>
              </div>
            )}

            {/* ================= STEP 2: BUSINESS INFORMATION ================= */}
            {currentStep === 2 && (
              <div className="space-y-5">
                <div className="border-b border-slate-100 pb-3">
                  <h2 className="text-xl font-black text-slate-900">Step 2: Business & Legal Details</h2>
                  <p className="text-xs text-slate-500 mt-1">Specify legal entity structure, tax numbers, category, and scale.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Business Registered Name *</label>
                    <input type="text" required value={formData.businessName} onChange={(e) => handleInputChange('businessName', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none" placeholder="Kings Dental Academy Pvt Ltd" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Display Name (Brand Name)</label>
                    <input type="text" value={formData.displayName} onChange={(e) => handleInputChange('displayName', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none" placeholder="Kings Dental Clinic" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Primary Category *</label>
                    <select required value={formData.category} onChange={(e) => {
                      const newCategory = e.target.value;
                      setFormData((prev: any) => ({ ...prev, category: newCategory, subCategory: '' })); // Reset subcategory on category change
                    }} className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none bg-white">
                      <option value="" disabled>Select a Category</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.name}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Sub Category</label>
                    <select value={formData.subCategory} onChange={(e) => handleInputChange('subCategory', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none bg-white" disabled={!formData.category}>
                      <option value="" disabled>Select a Sub Category</option>
                      {subCategories.map(sub => (
                        <option key={sub.id} value={sub.name}>{sub.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">PAN Card Number</label>
                    <input type="text" value={formData.panNumber} onChange={(e) => handleInputChange('panNumber', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none" placeholder="ABCDE1234F" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">GSTIN Number (Optional)</label>
                    <input type="text" value={formData.gstNumber} onChange={(e) => handleInputChange('gstNumber', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none" placeholder="33ABCDE1234F1Z5" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Business Description</label>
                  <textarea rows={3} value={formData.description} onChange={(e) => handleInputChange('description', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none" placeholder="Describe your services, specialties, experience, and customer value..." />
                </div>
              </div>
            )}

            {/* ================= STEP 3: LOCATION DETAILS ================= */}
            {currentStep === 3 && (
              <div className="space-y-5">
                <div className="border-b border-slate-100 pb-3">
                  <h2 className="text-xl font-black text-slate-900">Step 3: Location & Geolocation Coordinates</h2>
                  <p className="text-xs text-slate-500 mt-1">Set physical address, landmark, store type, and service delivery radius.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">City *</label>
                    <input type="text" required value={formData.city} onChange={(e) => handleInputChange('city', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none" placeholder="Trichy" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Area / Locality *</label>
                    <input type="text" required value={formData.area} onChange={(e) => handleInputChange('area', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none" placeholder="Thillai Nagar" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Postal / Zip Code</label>
                    <input type="text" value={formData.postalCode} onChange={(e) => handleInputChange('postalCode', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none" placeholder="620018" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Door Number / Building / Street Address *</label>
                  <textarea rows={2} required value={formData.address} onChange={(e) => handleInputChange('address', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none" placeholder="No. 45, 10th Cross Street, Thillai Nagar, Trichy" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Service Radius (km)</label>
                    <input type="number" value={formData.serviceRadius} onChange={(e) => handleInputChange('serviceRadius', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none" placeholder="15" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Location Type</label>
                    <select value={formData.locationType} onChange={(e) => handleInputChange('locationType', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none">
                      <option value="">Select Location Type</option>
                      <option>Store / Retail</option>
                      <option>Office</option>
                      <option>Home Service</option>
                      <option>Online Only</option>
                      <option>Training Center</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Google Maps Link</label>
                    <input type="url" value={formData.mapLink} onChange={(e) => handleInputChange('mapLink', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none" placeholder="https://maps.app.goo.gl/..." />
                  </div>
                </div>
              </div>
            )}

            {/* ================= STEP 4: CONTACT & SOCIAL ================= */}
            {currentStep === 4 && (
              <div className="space-y-5">
                <div className="border-b border-slate-100 pb-3">
                  <h2 className="text-xl font-black text-slate-900">Step 4: Contact Details & Social Handles</h2>
                  <p className="text-xs text-slate-500 mt-1">Provide secondary contact lines, website, and social profile links.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">WhatsApp Line</label>
                    <input type="tel" value={formData.contactWhatsapp} onChange={(e) => handleInputChange('contactWhatsapp', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none" placeholder="+91 98765 43210" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Landline Number</label>
                    <input type="text" value={formData.landline} onChange={(e) => handleInputChange('landline', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none" placeholder="0431 274000" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Official Website</label>
                    <input type="url" value={formData.website} onChange={(e) => handleInputChange('website', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none" placeholder="https://www.business.com" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Facebook Profile</label>
                    <input type="text" value={formData.facebook} onChange={(e) => handleInputChange('facebook', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none" placeholder="https://facebook.com/mybusiness" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Instagram Handle</label>
                    <input type="text" value={formData.instagram} onChange={(e) => handleInputChange('instagram', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none" placeholder="https://instagram.com/mybusiness" />
                  </div>
                </div>
              </div>
            )}

            {/* ================= STEP 5: WORKING HOURS ================= */}
            {currentStep === 5 && (
              <div className="space-y-5">
                <div className="border-b border-slate-100 pb-3">
                  <h2 className="text-xl font-black text-slate-900">Step 5: Business Working Hours</h2>
                  <p className="text-xs text-slate-500 mt-1">Configure operating hours, 24x7 availability, and appointment requirements.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Monday - Saturday Hours</label>
                    <input type="text" value={formData.mondayHours} onChange={(e) => handleInputChange('mondayHours', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Sunday Hours</label>
                    <input type="text" value={formData.sundayHours} onChange={(e) => handleInputChange('sundayHours', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none" />
                  </div>
                </div>

                <div className="flex flex-wrap gap-6 pt-2">
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                    <input type="checkbox" checked={formData.is24x7} onChange={(e) => handleInputChange('is24x7', e.target.checked)} className="w-4 h-4 text-blue-600 rounded" />
                    Open 24 Hours (24x7)
                  </label>
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                    <input type="checkbox" checked={formData.hasEmergency} onChange={(e) => handleInputChange('hasEmergency', e.target.checked)} className="w-4 h-4 text-blue-600 rounded" />
                    Emergency Services Available
                  </label>
                </div>
              </div>
            )}

            {/* ================= STEP 6: SERVICES & PRODUCTS ================= */}
            {currentStep === 6 && (
              <div className="space-y-5">
                <div className="border-b border-slate-100 pb-3">
                  <h2 className="text-xl font-black text-slate-900">Step 6: Offered Services & Products</h2>
                  <p className="text-xs text-slate-500 mt-1">Detail main services, products, pricing tiers, and delivery options.</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Services Offered (Comma Separated)</label>
                  <textarea rows={2} value={formData.servicesOffered} onChange={(e) => handleInputChange('servicesOffered', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none" />
                </div>


              </div>
            )}

            {/* ================= STEP 7: MEDIA & LOGOS ================= */}
            {currentStep === 7 && (
              <div className="space-y-5">
                <div className="border-b border-slate-100 pb-3">
                  <h2 className="text-xl font-black text-slate-900">Step 7: Media, Logos & Gallery</h2>
                  <p className="text-xs text-slate-500 mt-1">Upload brand logo, cover banner, and storefront images.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="p-5 border border-dashed border-slate-300 rounded-2xl text-center space-y-2">
                    <Image className="mx-auto text-blue-600" size={32} />
                    <p className="text-sm font-bold text-slate-800">Business Logo</p>
                    <input type="file" onChange={(e) => handleInputChange('logoFile', e.target.files?.[0] || null)} className="text-xs text-slate-500 mx-auto" />
                  </div>
                  <div className="p-5 border border-dashed border-slate-300 rounded-2xl text-center space-y-2">
                    <Image className="mx-auto text-purple-600" size={32} />
                    <p className="text-sm font-bold text-slate-800">Cover Banner</p>
                    <input type="file" onChange={(e) => handleInputChange('coverFile', e.target.files?.[0] || null)} className="text-xs text-slate-500 mx-auto" />
                  </div>
                </div>
              </div>
            )}

            {/* ================= STEP 8: DOCUMENT VERIFICATION ================= */}
            {currentStep === 8 && (
              <div className="space-y-5">
                <div className="border-b border-slate-100 pb-3">
                  <h2 className="text-xl font-black text-slate-900">Step 8: Official Verification Documents</h2>
                  <p className="text-xs text-slate-500 mt-1">Upload official business registration certificates to qualify for Verified Badges.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 border border-dashed border-slate-300 rounded-2xl text-center space-y-2">
                    <Upload className="mx-auto text-blue-600" size={28} />
                    <p className="text-sm font-bold text-slate-800">Registration Certificate / License (Mandatory)</p>
                    <input type="file" onChange={(e) => handleInputChange('docReg', e.target.files?.[0] || null)} className="text-xs text-slate-500 mx-auto" />
                  </div>

                  <div className="p-4 border border-dashed border-slate-300 rounded-2xl text-center space-y-2">
                    <Upload className="mx-auto text-green-600" size={28} />
                    <p className="text-sm font-bold text-slate-800">GST Certificate (Mandatory)</p>
                    <input type="file" onChange={(e) => handleInputChange('docGst', e.target.files?.[0] || null)} className="text-xs text-slate-500 mx-auto" />
                  </div>
                </div>
              </div>
            )}



            {/* ================= STEP 9: SEO METADATA ================= */}
            {currentStep === 9 && (
              <div className="space-y-5">
                <div className="border-b border-slate-100 pb-3">
                  <h2 className="text-xl font-black text-slate-900">Step 9: Search Engine Optimization (SEO)</h2>
                  <p className="text-xs text-slate-500 mt-1">Custom meta tags for ranking in Google and BizDial search.</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Custom SEO Title</label>
                  <input type="text" value={formData.seoTitle} onChange={(e) => handleInputChange('seoTitle', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none" placeholder="Best Dentist in Trichy | Kings Dental Academy" />
                </div>
              </div>
            )}

            {/* ================= STEP 10: REVIEW & SUBMIT ================= */}
            {currentStep === 10 && (
              <div className="space-y-6">
                <div className="text-center border-b border-slate-100 pb-4">
                  <Sparkles className="mx-auto text-blue-600 mb-2" size={40} />
                  <h2 className="text-2xl font-black text-slate-900">Review & Submit Profile</h2>
                  <p className="text-xs text-slate-500 mt-1">Review your business information before submitting for Verification.</p>
                </div>

                {/* Account Info */}
                <div>
                  <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-2">Account Information</h3>
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2 text-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <p><span className="font-bold text-slate-600">Full Name:</span> {formData.fullName || <span className="text-red-400 italic">Not filled</span>}</p>
                      <p><span className="font-bold text-slate-600">Email:</span> {formData.email || <span className="text-red-400 italic">Not filled</span>}</p>
                      <p><span className="font-bold text-slate-600">Mobile:</span> {formData.phone || <span className="text-red-400 italic">Not filled</span>}</p>
                    </div>
                  </div>
                </div>

                {/* Business Info */}
                <div>
                  <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-2">Business Information</h3>
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2 text-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <p><span className="font-bold text-slate-600">Business Name:</span> {formData.businessName || <span className="text-red-400 italic">Not filled</span>}</p>
                      <p><span className="font-bold text-slate-600">Category:</span> {formData.category || <span className="text-red-400 italic">Not filled</span>}</p>
                      <p><span className="font-bold text-slate-600">Business Type:</span> {formData.businessType || <span className="text-red-400 italic">Not filled</span>}</p>
                      <p><span className="font-bold text-slate-600">Founded Year:</span> {formData.foundedYear || 'N/A'}</p>
                      <p><span className="font-bold text-slate-600">PAN:</span> {formData.panNumber || 'N/A'}</p>
                      <p><span className="font-bold text-slate-600">GST:</span> {formData.gstNumber || 'N/A'}</p>
                    </div>
                    {formData.description && <p><span className="font-bold text-slate-600">Description:</span> {formData.description}</p>}
                  </div>
                </div>

                {/* Location */}
                <div>
                  <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-2">Location</h3>
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2 text-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <p><span className="font-bold text-slate-600">City:</span> {formData.city || <span className="text-red-400 italic">Not filled</span>}</p>
                      <p><span className="font-bold text-slate-600">Area:</span> {formData.area || 'N/A'}</p>
                      <p><span className="font-bold text-slate-600">State:</span> {formData.state || 'N/A'}</p>
                      <p><span className="font-bold text-slate-600">Postal Code:</span> {formData.postalCode || 'N/A'}</p>
                    </div>
                    {formData.address && <p><span className="font-bold text-slate-600">Address:</span> {formData.address}</p>}
                  </div>
                </div>

                {/* Contact */}
                <div>
                  <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-2">Contact & Social</h3>
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2 text-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <p><span className="font-bold text-slate-600">Primary Mobile:</span> {formData.primaryMobile || formData.phone || 'N/A'}</p>
                      <p><span className="font-bold text-slate-600">Contact Email:</span> {formData.contactEmail || formData.email || 'N/A'}</p>
                      <p><span className="font-bold text-slate-600">Website:</span> {formData.website || 'N/A'}</p>
                      <p><span className="font-bold text-slate-600">WhatsApp:</span> {formData.contactWhatsapp || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {/* Services */}
                {formData.servicesOffered && (
                  <div>
                    <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-2">Services</h3>
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-sm">
                      <p>{formData.servicesOffered}</p>
                    </div>
                  </div>
                )}
                {/* Working Hours & More */}
                <div>
                  <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-2">Additional Info</h3>
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2 text-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <p><span className="font-bold text-slate-600">Location Type:</span> {formData.locationType || 'N/A'}</p>
                      <p><span className="font-bold text-slate-600">Mon-Sat Hours:</span> {formData.mondayHours || 'N/A'}</p>
                      <p><span className="font-bold text-slate-600">Sunday Hours:</span> {formData.sundayHours || 'N/A'}</p>
                      <p><span className="font-bold text-slate-600">24x7:</span> {formData.is24x7 ? 'Yes' : 'No'}</p>
                      <p><span className="font-bold text-slate-600">Doc Reg:</span> {formData.docReg ? 'Uploaded' : <span className="text-red-400 italic">Missing</span>}</p>
                      <p><span className="font-bold text-slate-600">Doc GST:</span> {formData.docGst ? 'Uploaded' : <span className="text-red-400 italic">Missing</span>}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Navigation Buttons */}
            <div className="mt-8 flex justify-between gap-4 pt-6 border-t border-slate-100">
              {currentStep > 1 && (
                <button type="button" onClick={handlePrev} className="px-6 py-3 bg-slate-100 text-slate-700 text-sm font-bold rounded-xl hover:bg-slate-200 transition-colors flex items-center gap-1">
                  <ChevronLeft size={16} /> Back
                </button>
              )}
              {currentStep < 10 ? (
                <button type="button" onClick={handleNext} className="ml-auto px-6 py-3 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-1">
                  Next Step <ChevronRight size={16} />
                </button>
              ) : (
                <button type="submit" disabled={loading} className="ml-auto px-8 py-3 bg-green-600 hover:bg-green-700 text-white text-sm font-extrabold rounded-xl transition-colors shadow-lg shadow-green-600/30">
                  {loading ? 'Submitting...' : 'Submit Enterprise Profile'}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      <AnimatePresence>
        {showSuccessModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl border border-slate-100">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={32} className="text-green-600" />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2">Profile Submitted!</h3>
              <p className="text-sm text-slate-500 mb-6">Your enterprise business profile has been successfully submitted for approval.</p>
              <p className="text-xs font-bold text-blue-600 animate-pulse">Redirecting to login...</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
