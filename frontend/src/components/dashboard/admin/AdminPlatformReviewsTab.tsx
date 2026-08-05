import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, Star, CheckCircle, XCircle, Trash2, Search, Filter } from 'lucide-react';
import { authFetch } from '../../../lib/services/authFetch';

interface PlatformReview {
  id: number;
  name: string;
  role: string;
  text: string;
  rating: number;
  status: 'pending' | 'approved' | 'rejected';
  is_active: boolean;
  business_name: string;
  business_id: number | null;
}

export default function AdminPlatformReviewsTab({ onOpenSidebar }: { onOpenSidebar: () => void }) {
  const [reviews, setReviews] = useState<PlatformReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await authFetch('/api/admin/platform-reviews');
      if (res.ok) {
        const data = await res.json();
        setReviews(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Failed to fetch platform reviews', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAction = async (id: number, action: 'approve' | 'reject' | 'delete') => {
    if (action === 'delete' && !confirm('Are you sure you want to delete this review?')) return;
    
    try {
      const method = action === 'delete' ? 'DELETE' : 'POST';
      const endpoint = action === 'delete' ? `/api/admin/platform-reviews/${id}` : `/api/admin/platform-reviews/${id}/${action}`;
      const res = await authFetch(endpoint, { method });
      
      if (res.ok) {
        showToast(`Review ${action}d successfully`);
        fetchReviews(); // Refresh the list
      } else {
        showToast(`Failed to ${action} review`);
      }
    } catch (err) {
      showToast(`Error performing ${action}`);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-bold flex items-center gap-1"><CheckCircle size={12}/> Approved</span>;
      case 'rejected':
        return <span className="px-3 py-1 bg-red-50 text-red-600 border border-red-200 rounded-full text-xs font-bold flex items-center gap-1"><XCircle size={12}/> Rejected</span>;
      default:
        return <span className="px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-xs font-bold flex items-center gap-1"><span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></span> Pending</span>;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <button onClick={onOpenSidebar} className="md:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-xl transition-colors">
            <Menu size={20} />
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">Platform Reviews</h1>
            <p className="text-sm text-slate-500 font-medium mt-1">Manage testimonials from business owners for the BizDial platform.</p>
          </div>
        </div>
      </div>

      {/* Stats/Filters Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-4 text-sm font-medium text-slate-600">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span> Total: {reviews.length}
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Approved: {reviews.filter(r => r.status === 'approved').length}
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span> Pending: {reviews.filter(r => r.status === 'pending').length}
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {loading ? (
          <div className="p-8 text-center text-slate-500 font-medium bg-white rounded-2xl border border-slate-200">Loading platform reviews...</div>
        ) : reviews.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 shadow-sm">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star size={24} className="text-slate-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-1">No reviews yet</h3>
            <p className="text-sm text-slate-500">When business owners rate BizDial, they will appear here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {reviews.map((review) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all flex flex-col relative overflow-hidden group"
              >
                {/* Decorative background element */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-blue-50 to-purple-50 rounded-full blur-2xl opacity-50 pointer-events-none group-hover:opacity-100 transition-opacity" />

                <div className="flex items-start justify-between gap-4 mb-4 relative z-10">
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg">{review.name}</h3>
                    <p className="text-xs text-slate-500 font-medium">{review.role}</p>
                    {review.business_name && review.business_name !== '—' && (
                      <p className="text-[11px] text-blue-600 font-bold mt-1 bg-blue-50 px-2 py-0.5 rounded-full inline-block">
                        {review.business_name}
                      </p>
                    )}
                  </div>
                  <div>
                    {getStatusBadge(review.status)}
                  </div>
                </div>

                <div className="flex items-center gap-1 mb-3 relative z-10">
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star
                      key={star}
                      size={14}
                      className={star <= review.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-200'}
                    />
                  ))}
                  <span className="ml-1 text-xs font-black text-slate-700">{review.rating}.0</span>
                </div>

                <div className="flex-1 mb-6 relative z-10">
                  <p className="text-sm text-slate-700 leading-relaxed italic border-l-2 border-slate-100 pl-3">
                    "{review.text}"
                  </p>
                </div>

                <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 relative z-10">
                  {review.status !== 'approved' && (
                    <button
                      onClick={() => handleAction(review.id, 'approve')}
                      className="px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-xs rounded-xl transition-colors flex items-center gap-1"
                    >
                      <CheckCircle size={14} /> Approve
                    </button>
                  )}
                  {review.status !== 'rejected' && (
                    <button
                      onClick={() => handleAction(review.id, 'reject')}
                      className="px-3 py-1.5 bg-amber-50 text-amber-700 hover:bg-amber-100 font-bold text-xs rounded-xl transition-colors flex items-center gap-1"
                    >
                      <XCircle size={14} /> Reject
                    </button>
                  )}
                  <button
                    onClick={() => handleAction(review.id, 'delete')}
                    className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 font-bold text-xs rounded-xl transition-colors flex items-center gap-1"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 20, x: '-50%' }}
            className="fixed bottom-6 left-1/2 z-[200] bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 font-medium border border-slate-700"
          >
            <CheckCircle size={20} className="text-emerald-400" />
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
