import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, FileText, CheckCircle2, XCircle, AlertTriangle, 
  Eye, Award, Star, Filter, RefreshCw, Search, ShieldAlert 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { authFetch } from '../../../../lib/services/authFetch';

export default function VerificationPanel() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBiz, setSelectedBiz] = useState<any>(null);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [isDeletingBulk, setIsDeletingBulk] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const fetchRequests = () => {
    setLoading(true);
    authFetch('/api/admin/verification/list')
      .then(res => res.json())
      .then(data => {
        setRequests(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleApproveDoc = (docId: number) => {
    fetch(`/api/admin/verification/approve-doc?doc_id=${docId}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => res.json())
      .then(() => {
        showToast('Document Approved and Quality Score Updated!');
        fetchRequests();
        if (selectedBiz) {
          setSelectedBiz({
            ...selectedBiz,
            documents: selectedBiz.documents.map((d: any) => d.id === docId ? { ...d, status: 'Verified' } : d)
          });
        }
      });
  };

  const handleApproveBusiness = (bizId: number) => {
    fetch(`/api/admin/business/${bizId}/approve`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => res.json())
      .then(() => {
        showToast('Business Successfully Approved!');
        setSelectedBiz(null);
        fetchRequests();
      })
      .catch(err => {
        console.error(err);
        showToast('Failed to approve business');
      });
  };

  const handleBulkDelete = async () => {
    if (selectedRows.size === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedRows.size} verification requests (and their businesses)?`)) return;
    
    setIsDeletingBulk(true);
    try {
      const ids = Array.from(selectedRows);
      const promises = ids.map(id => fetch(`/api/admin/business/${id}`, { 
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      }));
      await Promise.all(promises);
      
      showToast(`Successfully deleted ${ids.length} requests!`);
      setRequests(prev => prev.filter(r => !selectedRows.has(r.business_id)));
      setSelectedRows(new Set());
    } catch (e) {
      showToast('Error during bulk deletion.');
    } finally {
      setIsDeletingBulk(false);
    }
  };

  const toggleRow = (id: number) => {
    const newSet = new Set(selectedRows);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedRows(newSet);
  };

  const toggleAll = () => {
    if (selectedRows.size === requests.length && requests.length > 0) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(requests.map(r => r.business_id)));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <ShieldCheck className="text-blue-600" /> Document Verification & Quality Score Engine
          </h1>
          <p className="text-sm text-slate-500 mt-1">Review uploaded GST, PAN, and License documents, verify businesses, and assign badges.</p>
        </div>
        {selectedRows.size > 0 && (
          <button 
            onClick={handleBulkDelete}
            disabled={isDeletingBulk}
            className="px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-bold shadow hover:bg-red-700 transition"
          >
            {isDeletingBulk ? 'Deleting...' : `Delete Selected (${selectedRows.size})`}
          </button>
        )}
      </div>

      {/* Verification Queue Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-700 text-xs uppercase font-extrabold border-b border-slate-200">
              <tr>
                <th className="py-4 px-6 w-12">
                   <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer" onChange={toggleAll} checked={selectedRows.size === requests.length && requests.length > 0} />
                </th>
                <th className="py-4 px-6">Business & Owner</th>
                <th className="py-4 px-6">Category / City</th>
                <th className="py-4 px-6">Quality Score</th>
                <th className="py-4 px-6">Documents</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {requests.map(req => (
                <tr key={req.business_id} className={`transition-colors ${selectedRows.has(req.business_id) ? 'bg-blue-50/60' : 'hover:bg-slate-50/50'}`}>
                  <td className="py-4 px-6 w-12">
                    <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer" checked={selectedRows.has(req.business_id)} onChange={() => toggleRow(req.business_id)} />
                  </td>
                  <td className="py-4 px-6 font-bold text-slate-900">
                    <div>{req.business_name}</div>
                    <div className="text-xs font-normal text-slate-500">{req.owner_name} ({req.owner_email})</div>
                  </td>
                  <td className="py-4 px-6 text-xs text-slate-600">
                    <span className="font-semibold">{req.category}</span> • {req.city}
                  </td>
                  <td className="py-4 px-6">
                    <span className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-xs font-extrabold flex items-center gap-1 w-fit">
                      <Star size={12} className="fill-blue-700" /> {req.quality_score} / 100
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-xs font-bold text-slate-700">
                      {req.documents.length} Docs Uploaded
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`text-[10px] px-2 py-0.5 rounded font-extrabold border ${req.approval_status === 'Approved' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-orange-50 text-orange-700 border-orange-200'}`}>
                      {req.approval_status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button 
                      onClick={() => setSelectedBiz(req)}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors"
                    >
                      Review Docs
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Modal */}
      {selectedBiz && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full border border-slate-200 shadow-2xl space-y-4">
            <h3 className="text-xl font-bold text-slate-900">Review Documents - {selectedBiz.business_name}</h3>
            
            <div className="space-y-3">
              {selectedBiz.documents.length === 0 ? (
                <p className="text-xs text-slate-500">No documents uploaded for this business yet.</p>
              ) : (
                selectedBiz.documents.map((doc: any) => (
                  <div key={doc.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-800">{doc.doc_type}</p>
                      <a href={doc.document_url} target="_blank" rel="noreferrer" className="text-[11px] text-blue-600 hover:underline">View File</a>
                    </div>
                    {doc.status === 'Verified' ? (
                      <span className="text-xs font-bold text-green-600 flex items-center gap-1"><CheckCircle2 size={14} /> Approved</span>
                    ) : (
                      <button 
                        onClick={() => handleApproveDoc(doc.id)}
                        className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded-lg"
                      >
                        Approve Doc
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-slate-100">
              {selectedBiz.approval_status !== 'Approved' && (
                <button 
                  onClick={() => handleApproveBusiness(selectedBiz.business_id)} 
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-green-600/30"
                >
                  Approve Entire Business
                </button>
              )}
              <button onClick={() => setSelectedBiz(null)} className="px-4 py-2 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl ml-auto">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 20, x: '-50%' }}
            className="fixed bottom-6 left-1/2 z-[200] bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 font-medium border border-slate-700"
          >
            {toastMessage.toLowerCase().includes('error') || toastMessage.toLowerCase().includes('fail') ? (
              <AlertTriangle size={20} className="text-red-400" />
            ) : (
              <CheckCircle2 size={20} className="text-green-400" />
            )}
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
