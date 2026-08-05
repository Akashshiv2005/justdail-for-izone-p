import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Send, CheckCircle, Clock, XCircle, Sparkles, Quote, Award, Globe } from 'lucide-react';
import { authFetch } from '../../../../lib/services/authFetch';

interface PlatformReview {
  id: number;
  rating: number;
  review_text: string;
  role: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface Props {
  businessId: number;
  profile: any;
}

export default function ReviewBizDialTab({ businessId, profile }: Props) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [title, setTitle] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [pastReviews, setPastReviews] = useState<PlatformReview[]>([]);
  const [loadingPast, setLoadingPast] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    authFetch(`/api/owner/${businessId}/platform-reviews`)
      .then(r => r.json())
      .then(data => setPastReviews(Array.isArray(data) ? data : []))
      .catch(() => setPastReviews([]))
      .finally(() => setLoadingPast(false));
  }, [businessId, submitted]);

  const handleSubmit = async () => {
    if (!reviewText.trim() || reviewText.trim().length < 10) {
      setError('Please write at least 10 characters in your review.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      const res = await authFetch(`/api/owner/${businessId}/platform-review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, review_text: reviewText, title: title || undefined }),
      });
      if (res.ok) {
        setSubmitted(true);
        setReviewText('');
        setTitle('');
        setRating(5);
        setTimeout(() => setSubmitted(false), 4000);
      } else {
        setError('Failed to submit. Please try again.');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const ratingLabels = ['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent'];

  const statusConfig = {
    pending: { label: 'Under Review', icon: Clock, color: 'amber', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
    approved: { label: 'Live on Homepage', icon: CheckCircle, color: 'emerald', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
    rejected: { label: 'Not Approved', icon: XCircle, color: 'red', bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200' },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 sm:p-8 space-y-8 max-w-4xl"
    >
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 rounded-3xl p-8 text-white shadow-2xl shadow-purple-500/30">
        {/* Decorative blobs */}
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/5 rounded-full blur-xl pointer-events-none" />
        <div className="relative z-10 flex items-start gap-5">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30 shrink-0 shadow-lg">
            <Sparkles size={30} className="text-yellow-300" />
          </div>
          <div>
            <p className="text-purple-200 text-xs font-black uppercase tracking-[0.2em] mb-1">Share Your Experience</p>
            <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">Rate BizDial Platform</h2>
            <p className="text-purple-200 text-sm mt-2 max-w-lg">
              Your feedback matters! Help us improve and inspire other businesses.
              Approved reviews appear on our homepage "What Our Users Say" section.
            </p>
          </div>
        </div>
        {/* Stat pills */}
        <div className="relative z-10 flex flex-wrap gap-3 mt-6">
          <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
            <Globe size={14} className="text-blue-200" />
            <span className="text-white text-xs font-bold">Shown to Thousands of Visitors</span>
          </div>
          <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
            <Award size={14} className="text-yellow-300" />
            <span className="text-white text-xs font-bold">Verified Business Owner Badge</span>
          </div>
        </div>
      </div>

      {/* Success Banner */}
      <AnimatePresence>
        {submitted && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-2xl p-5 shadow-sm"
          >
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shrink-0">
              <CheckCircle size={20} className="text-white" />
            </div>
            <div>
              <p className="font-bold text-emerald-800">Review Submitted!</p>
              <p className="text-sm text-emerald-600">Your review is under admin review. Once approved, it'll appear on our homepage.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Review Form */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
          <Quote size={20} className="text-purple-500" /> Write Your Review
        </h3>

        {/* Star Rating */}
        <div>
          <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-3">Your Rating</label>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
                className="transition-transform hover:scale-125 focus:outline-none"
              >
                <Star
                  size={36}
                  className={`transition-colors ${
                    star <= (hoverRating || rating)
                      ? 'text-amber-400 fill-amber-400 drop-shadow-sm'
                      : 'text-slate-200 fill-slate-200'
                  }`}
                />
              </button>
            ))}
            {(hoverRating || rating) > 0 && (
              <span className="ml-2 text-sm font-black text-slate-700">
                {ratingLabels[hoverRating || rating]}
              </span>
            )}
          </div>
        </div>

        {/* Title / Role (optional) */}
        <div>
          <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2">
            Your Title <span className="font-normal text-slate-400 normal-case">(optional)</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder={`e.g. "Owner at ${profile?.business_name || 'My Business'}"`}
            className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 outline-none text-sm text-slate-800 font-medium bg-slate-50/50 focus:bg-white transition-all"
          />
        </div>

        {/* Review Text */}
        <div>
          <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2">Your Review</label>
          <textarea
            rows={5}
            value={reviewText}
            onChange={e => { setReviewText(e.target.value); setError(''); }}
            placeholder="Tell us what you love about BizDial, how it helped your business, and any suggestions for improvement..."
            className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 outline-none text-sm text-slate-800 font-medium bg-slate-50/50 focus:bg-white transition-all resize-none"
          />
          <div className="flex items-center justify-between mt-1">
            {error ? (
              <p className="text-xs text-red-500 font-medium">{error}</p>
            ) : (
              <p className="text-xs text-slate-400">{reviewText.length} characters</p>
            )}
            <p className="text-xs text-slate-400">Min 10 characters</p>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={submitting || !reviewText.trim()}
          className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black rounded-2xl shadow-lg shadow-purple-500/30 transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2"
        >
          {submitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Send size={16} />
              Submit Review
            </>
          )}
        </button>
      </div>

      {/* Past Submissions */}
      {!loadingPast && pastReviews.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-base font-black text-slate-800">Your Submitted Reviews</h3>
          <div className="space-y-3">
            {pastReviews.map(review => {
              const st = statusConfig[review.status] || statusConfig.pending;
              const StatusIcon = st.icon;
              return (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`bg-white border rounded-2xl p-5 shadow-sm ${st.border}`}
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex items-center gap-1.5">
                      {[1,2,3,4,5].map(s => (
                        <Star key={s} size={14} className={s <= review.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-200'} />
                      ))}
                      <span className="ml-1 text-xs font-bold text-slate-600">{review.rating}/5</span>
                    </div>
                    <span className={`flex items-center gap-1.5 px-3 py-1 text-xs font-black rounded-full ${st.bg} ${st.text} border ${st.border}`}>
                      <StatusIcon size={12} />
                      {st.label}
                    </span>
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed">{review.review_text}</p>
                  {review.role && <p className="text-xs text-slate-400 font-medium mt-2 italic">— {review.role}</p>}

                  {review.status === 'pending' && (
                    <p className="text-xs text-amber-600 bg-amber-50 rounded-xl px-3 py-2 mt-3 font-medium">
                      ⏳ Your review is being reviewed by the admin and will appear on the homepage once approved.
                    </p>
                  )}
                  {review.status === 'approved' && (
                    <p className="text-xs text-emerald-600 bg-emerald-50 rounded-xl px-3 py-2 mt-3 font-medium">
                      ✅ Your review is live on the BizDial homepage!
                    </p>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </motion.div>
  );
}
