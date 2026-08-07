import React, { useState, useEffect } from 'react';
import { authFetch } from '../../../lib/services/authFetch';
import { HelpCircle, CheckCircle2 } from 'lucide-react';

export default function AdminNotificationsTab({ onOpenSidebar }: { onOpenSidebar: () => void }) {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authFetch('/api/admin/support-tickets')
      .then(res => res.json())
      .then(data => {
        setTickets(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch tickets", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <button className="md:hidden p-1.5 text-slate-500 hover:bg-slate-100 rounded-lg mr-2" onClick={onOpenSidebar}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
            </button>
            Notifications
          </h1>
          <p className="text-sm text-slate-500 mt-1">Review help center requests and alerts.</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500">Loading...</div>
        ) : tickets.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center">
            <CheckCircle2 className="w-12 h-12 text-green-400 mb-3" />
            <p className="font-bold text-slate-800 text-lg">No Notifications</p>
            <p className="text-slate-500 text-sm mt-1">You are all caught up!</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {tickets.map(ticket => (
              <div key={ticket.id} className="p-6 hover:bg-slate-50 transition-colors flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-bold text-slate-900">{ticket.business_name}</h4>
                    <span className="text-xs text-slate-400 font-medium">
                      {ticket.created_at ? new Date(ticket.created_at).toLocaleString() : 'Recently'}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-slate-700 mb-1">{ticket.subject}</p>
                  <p className="text-sm text-slate-600 bg-white p-3 rounded-lg border border-slate-100 mt-2 shadow-sm whitespace-pre-wrap">{ticket.message}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
