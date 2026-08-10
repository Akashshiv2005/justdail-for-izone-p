import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Star, CheckCircle, Phone, MessageCircle, Share2, Edit2, Bookmark, Clock, Award, Check } from 'lucide-react';
import SEOHead from '../components/common/SEOHead';
import { API_BASE } from '../lib/services/api';

export default function BusinessDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Overview');
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [selectedRating, setSelectedRating] = useState(5);
  const [reviewerName, setReviewerName] = useState('');
  const [reviewComment, setReviewComment] = useState('');

  // Enquiry state
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);
  const [enquiryForm, setEnquiryForm] = useState({ name: '', phone: '', service: '' });
  const [enquiryLoading, setEnquiryLoading] = useState(false);
  const [enquirySuccess, setEnquirySuccess] = useState(false);

  const handleEnquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!enquiryForm.name || !enquiryForm.phone || !enquiryForm.service) return;
    setEnquiryLoading(true);
    
    try {
      const response = await fetch(`${API_BASE}/business/${data.business.id}/enquire`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: enquiryForm.name,
          customer_phone: enquiryForm.phone,
          service_interest: enquiryForm.service
        })
      });
      if (response.ok) {
        setEnquirySuccess(true);
        setTimeout(() => {
          setShowEnquiryModal(false);
          setEnquirySuccess(false);
          setEnquiryForm({ name: '', phone: '', service: '' });
        }, 2000);
      }
    } catch (err) {
      console.error("Failed to submit enquiry", err);
    }
    setEnquiryLoading(false);
  };

  useEffect(() => {
    fetch(`${API_BASE}/business/${slug}`)
      .then(res => res.json())
      .then(resData => {
        setData(resData);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!data || !data.business) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
        <div className="text-xl text-slate-500 font-semibold">Business not found</div>
      </div>
    );
  }

  const { business, gallery, services, reviews } = data;

  const tabs = ['Overview', 'Products', 'Photos', 'Services', 'Reviews'];

  return (
    <div className="min-h-screen bg-slate-100 font-sans pb-16">
      <SEOHead 
        title={business.seo_title || `${business.business_name} - Best ${business.category || 'Service'} in ${business.city} | BizDial`} 
        description={business.seo_description || business.description || `Looking for ${business.category} in ${business.city}? Visit ${business.business_name} at ${business.address}. Read reviews and get contact details.`} 
      />

      {/* 
        This is the automated Schema Generator in action!
        The SEO Engine takes the owner's data and translates it into JSON-LD structure.
        Google reads this script tag directly to populate Local Search & Google Maps.
      */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "name": business.business_name,
          "image": business.logo_url || "https://bizdial.com/default-logo.png",
          "url": `https://bizdial.com/business/${slug}`,
          "telephone": business.phone,
          "address": {
            "@type": "PostalAddress",
            "streetAddress": business.address,
            "addressLocality": business.area,
            "addressRegion": business.city,
            "postalCode": business.pincode,
            "addressCountry": "IN"
          },
          "aggregateRating": business.total_reviews > 0 ? {
            "@type": "AggregateRating",
            "ratingValue": business.average_rating || "4.5",
            "reviewCount": business.total_reviews
          } : undefined
        })}
      </script>

      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-2 text-xs text-slate-500 flex items-center gap-2">
          <Link to="/" className="hover:text-blue-600">Home</Link>
          <span>&gt;</span>
          <Link to={`/search?city=${business.city}`} className="hover:text-blue-600">{business.city}</Link>
          <span>&gt;</span>
          <Link to={`/${business.category?.toLowerCase()}/${business.city?.toLowerCase()}`} className="hover:text-blue-600">
            {business.category} in {business.city}
          </Link>
          <span>&gt;</span>
          <span className="text-slate-800 font-medium">{business.business_name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-6">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 relative">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Logo */}
            <div className="w-32 h-32 shrink-0 border border-slate-100 rounded-lg overflow-hidden shadow-sm flex items-center justify-center bg-white p-2">
              <img src={business.logo_url || '/default-logo.png'} alt={business.business_name} className="max-w-full max-h-full object-contain" />
            </div>

            {/* Main Info */}
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                    <span className="bg-slate-800 text-white rounded-full p-1"><Check size={14} /></span>
                    {business.business_name}
                  </h1>
                  
                  <div className="flex items-center gap-3 mt-2 flex-wrap">
                    <span className="bg-green-600 text-white text-sm font-bold px-2 py-0.5 rounded flex items-center">
                      {business.average_rating || 4.5} <Star size={12} className="ml-1 fill-white" />
                    </span>
                    <span className="text-sm text-slate-600">
                      {business.total_reviews || 0} Ratings
                    </span>
                    {business.is_verified && (
                      <span className="flex items-center text-sm font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full">
                        <CheckCircle size={14} className="mr-1 text-slate-700" /> Claimed
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-4 mt-3 text-sm text-slate-600 flex-wrap">
                    <span className="flex items-center gap-1"><MapPin size={16} className="text-slate-400" /> {business.area}, {business.city}</span>
                    <span className="text-slate-300">•</span>
                    <span className="flex items-center gap-1 text-green-600 font-medium"><Clock size={16} /> Open until {business.closing_time || '10:00 pm'}</span>
                    <span className="text-slate-300">•</span>
                    <span className="flex items-center gap-1"><Award size={16} className="text-slate-400" /> 10+ Years in Business</span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 mt-6 flex-wrap">
                    {business.phone && (
                      <a href={`tel:${business.phone}`} className="px-5 py-2.5 bg-green-600 text-white font-bold rounded flex items-center gap-2 hover:bg-green-700 transition">
                        <Phone size={18} fill="currentColor" /> {business.phone}
                      </a>
                    )}
                    <button 
                      onClick={() => setShowEnquiryModal(true)}
                      className="px-5 py-2.5 bg-blue-600 text-white font-bold rounded flex items-center gap-2 hover:bg-blue-700 transition"
                    >
                      <MessageCircle size={18} /> Enquire Now
                    </button>
                    {business.whatsapp && (
                      <a href={`https://wa.me/${business.whatsapp}`} target="_blank" rel="noreferrer" className="px-5 py-2.5 bg-white text-green-600 border border-green-600 font-bold rounded flex items-center gap-2 hover:bg-green-50 transition">
                        <MessageCircle size={18} /> WhatsApp
                      </a>
                    )}
                    <button className="p-2.5 bg-white text-slate-600 border border-slate-300 rounded hover:bg-slate-50 transition">
                      <Share2 size={18} />
                    </button>
                    <button className="p-2.5 bg-white text-slate-600 border border-slate-300 rounded hover:bg-slate-50 transition">
                      <Edit2 size={18} />
                    </button>
                  </div>
                </div>

                {/* Right side interactions */}
                <div className="hidden lg:flex flex-col items-end">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs text-slate-500">{business.category}</span>
                  </div>
                  <button className="p-2 bg-slate-100 rounded text-slate-600 hover:bg-slate-200">
                    <Bookmark size={20} />
                  </button>
                  
                  <div className="mt-8 text-right">
                    <p className="text-sm font-semibold text-slate-700 mb-2">Click to Rate</p>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map(i => (
                        <Star 
                          key={i} 
                          size={28} 
                          className="text-slate-300 hover:text-yellow-400 cursor-pointer transition-colors" 
                          onClick={() => {
                            setSelectedRating(i);
                            setIsRatingModalOpen(true);
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Rating Modal */}
          {isRatingModalOpen && (
            <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
              <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden relative">
                <div className="p-6">
                  {submissionSuccess ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle size={32} className="text-green-500" />
                      </div>
                      <h3 className="text-2xl font-bold text-slate-800 mb-2">Thank You!</h3>
                      <p className="text-slate-500 mb-8">Your review has been successfully submitted and is now pending owner approval.</p>
                      <button 
                        onClick={() => {
                          setIsRatingModalOpen(false);
                          setSubmissionSuccess(false);
                        }}
                        className="w-full py-3 px-4 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
                      >
                        Close
                      </button>
                    </div>
                  ) : (
                    <>
                      <h3 className="text-xl font-bold text-slate-800 mb-1">Rate {business.business_name}</h3>
                      <p className="text-sm text-slate-500 mb-6">Your review will be visible once approved by the owner.</p>
                      
                      <div className="flex justify-center gap-2 mb-6">
                        {[1, 2, 3, 4, 5].map(i => (
                          <Star 
                            key={i} 
                            size={40} 
                            fill={i <= selectedRating ? "#facc15" : "none"}
                            className={`${i <= selectedRating ? "text-yellow-400" : "text-slate-300"} cursor-pointer transition-all hover:scale-110`}
                            onClick={() => setSelectedRating(i)}
                          />
                        ))}
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-1">Your Name</label>
                          <input 
                            type="text" 
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none"
                            placeholder="Enter your name"
                            value={reviewerName}
                            onChange={(e) => setReviewerName(e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-1">Review</label>
                          <textarea 
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none"
                            placeholder="Tell us about your experience..."
                            rows={4}
                            value={reviewComment}
                            onChange={(e) => setReviewComment(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="flex gap-3 mt-8">
                        <button 
                          onClick={() => setIsRatingModalOpen(false)}
                          className="flex-1 py-3 px-4 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-colors"
                        >
                          Cancel
                        </button>
                        <button 
                          onClick={async () => {
                            if (!reviewerName.trim() || !reviewComment.trim()) return;
                            try {
                              const res = await fetch(`${API_BASE}/business/${slug}/rate`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                  customer_name: reviewerName,
                                  rating: selectedRating,
                                  comment: reviewComment
                                })
                              });
                              if (res.ok) {
                                setSubmissionSuccess(true);
                                setReviewComment('');
                                setReviewerName('');
                              } else {
                                alert("Failed to submit review. Please try again.");
                              }
                            } catch (err) {
                              console.error(err);
                              alert("An error occurred connecting to the server.");
                            }
                          }}
                          className="flex-1 py-3 px-4 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
                        >
                          Submit Review
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="mt-8 border-b border-slate-200 flex overflow-x-auto no-scrollbar">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-3 px-6 text-sm font-bold whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            
            {/* Photos Section */}
            {(activeTab === 'Overview' || activeTab === 'Photos') && gallery && gallery.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
                <h2 className="text-xl font-bold text-slate-800 mb-4">Photos</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {gallery.slice(0, activeTab === 'Photos' ? 20 : 4).map((img: any, idx: number) => (
                    <div key={idx} className="aspect-square rounded-lg overflow-hidden bg-slate-100">
                      <img src={img.image_url} alt={img.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Overview / About */}
            {activeTab === 'Overview' && (
              <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
                <h2 className="text-xl font-bold text-slate-800 mb-4">About Us</h2>
                <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                  {business.description || business.short_description || "No description provided."}
                </p>
              </div>
            )}
            
            {/* Products */}
            {(activeTab === 'Overview' || activeTab === 'Products') && data.products && data.products.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
                <h2 className="text-xl font-bold text-slate-800 mb-4">Products</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {data.products.map((prod: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-center p-3 border border-slate-100 rounded-lg bg-slate-50">
                      <span className="font-medium text-slate-700">{prod.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Services */}
            {(activeTab === 'Overview' || activeTab === 'Services') && services && services.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
                <h2 className="text-xl font-bold text-slate-800 mb-4">Services</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {services.map((svc: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-center p-3 border border-slate-100 rounded-lg bg-slate-50">
                      <span className="font-medium text-slate-700">{svc.name}</span>
                      {svc.base_price > 0 && <span className="font-bold text-blue-600">₹{svc.base_price}</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews */}
            {(activeTab === 'Overview' || activeTab === 'Reviews') && reviews && reviews.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
                <h2 className="text-xl font-bold text-slate-800 mb-4">Reviews</h2>
                <div className="space-y-4">
                  {reviews.slice(0, activeTab === 'Reviews' ? 20 : 3).map((r: any, idx: number) => (
                    <div key={idx} className="border-b border-slate-100 pb-4 last:border-0">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                          {r.user.name[0]}
                        </div>
                        <div>
                          <p className="font-bold text-sm text-slate-800">{r.user.name}</p>
                          <div className="flex items-center gap-1">
                            <span className="bg-green-600 text-white text-[10px] px-1 rounded flex items-center">
                              {r.rating} <Star size={8} className="ml-0.5 fill-white" />
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-slate-600">{r.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <h2 className="text-lg font-bold text-slate-800 mb-4">Contact</h2>
              <div className="flex items-start gap-3">
                <Phone className="text-blue-600 mt-1" size={20} />
                <div>
                  <a href={`tel:${business.phone}`} className="text-blue-600 font-medium text-lg hover:underline block">
                    {business.phone}
                  </a>
                  {business.whatsapp && (
                    <a href={`https://wa.me/${business.whatsapp}`} className="text-green-600 font-medium hover:underline block mt-1">
                      WhatsApp: {business.whatsapp}
                    </a>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <h2 className="text-lg font-bold text-slate-800 mb-4">Address</h2>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                {business.address}
                <br />
                {business.area}, {business.city} - {business.pincode}
              </p>
              <div className="w-full h-48 bg-slate-100 rounded-lg overflow-hidden flex items-center justify-center text-slate-400 relative border border-slate-200">
                {business.latitude && business.longitude ? (
                  <iframe 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }} 
                    loading="lazy" 
                    allowFullScreen 
                    src={`https://maps.google.com/maps?q=${business.latitude},${business.longitude}&hl=en&z=14&output=embed`}
                  ></iframe>
                ) : business.google_map_url ? (
                  <div className="flex flex-col items-center justify-center p-4 text-center w-full h-full bg-slate-50">
                    <MapPin size={32} className="text-blue-500 mb-2" />
                    <p className="font-semibold text-slate-700 mb-3 text-sm">Location Map Available</p>
                    <a href={business.google_map_url} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition shadow-sm">View on Google Maps</a>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <MapPin size={24} className="mb-2 opacity-50" />
                    <span className="text-sm">Map Not Provided</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enquiry Modal */}
      {showEnquiryModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden relative animate-in fade-in zoom-in duration-200">
            <button 
              onClick={() => setShowEnquiryModal(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 transition"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
            <div className="p-6 border-b border-slate-100 bg-slate-50">
              <h2 className="text-xl font-bold text-slate-800">Send an Enquiry</h2>
              <p className="text-sm text-slate-500 mt-1">Submit your details and {business.business_name} will get back to you.</p>
            </div>
            
            <form onSubmit={handleEnquirySubmit} className="p-6">
              {enquirySuccess ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">Enquiry Sent!</h3>
                  <p className="text-slate-500">The business owner has received your request.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Your Name <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. John Doe"
                      value={enquiryForm.name}
                      onChange={e => setEnquiryForm({...enquiryForm, name: e.target.value.replace(/[^a-zA-Z\s]/g, '')})}
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Contact Info (Phone) <span className="text-red-500">*</span></label>
                    <input 
                      type="tel" 
                      required
                      placeholder="e.g. 9876543210"
                      value={enquiryForm.phone}
                      onChange={e => setEnquiryForm({...enquiryForm, phone: e.target.value.replace(/\D/g, '').slice(0, 10)})}
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Service Interest <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      required
                      placeholder="What are you looking for?"
                      value={enquiryForm.service}
                      onChange={e => setEnquiryForm({...enquiryForm, service: e.target.value})}
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>
                  
                  <button 
                    type="submit" 
                    disabled={enquiryLoading}
                    className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold mt-2 hover:bg-blue-700 transition disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {enquiryLoading ? 'Submitting...' : 'Submit Enquiry'}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
