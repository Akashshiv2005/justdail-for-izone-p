import React, { useState, useEffect } from 'react';
import { FileText, Plus, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { authFetch } from '../../../../lib/services/authFetch';
import { getMediaUrl } from '../../../../lib/services/api';

export default function DocumentsTab({ businessId }: { businessId: string }) {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadType, setUploadType] = useState('Business Logo');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  
  const [editingDoc, setEditingDoc] = useState<any>(null);

  const docTypes = ['Business Logo', 'Cover Banner', 'Registration Certificate / License', 'GST Certificate', 'PAN Card'];

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const res = await authFetch(`/api/owner/${businessId}/documents`);
      if (res.ok) {
        const data = await res.json();
        setDocuments(data);
      } else {
        setError('Failed to fetch documents');
      }
    } catch (e) {
      setError('An error occurred while fetching documents');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [businessId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUploadSubmit = async () => {
    if (!selectedFile) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);
    
    try {
      const url = editingDoc 
        ? `/api/owner/${businessId}/documents/${editingDoc.id}?doc_type=${encodeURIComponent(uploadType)}`
        : `/api/owner/${businessId}/documents?doc_type=${encodeURIComponent(uploadType)}`;
      
      const res = await authFetch(url, {
        method: editingDoc ? 'PUT' : 'POST',
        body: formData,
      });

      if (res.ok) {
        await fetchDocuments();
        closeModal();
      } else {
        alert('Upload failed');
      }
    } catch (e) {
      console.error(e);
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const closeModal = () => {
    setShowUploadModal(false);
    setSelectedFile(null);
    setUploadType('Business Logo');
    setEditingDoc(null);
  };

  const openEditModal = (doc: any) => {
    setEditingDoc(doc);
    setUploadType(doc.doc_type);
    setShowUploadModal(true);
  };

  const handleDeleteDocument = async (docId: number) => {
    if (!confirm('Are you sure you want to delete this document?')) return;
    
    try {
      const res = await authFetch(`/api/owner/${businessId}/documents/${docId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        await fetchDocuments();
      } else {
        alert('Failed to delete document');
      }
    } catch (e) {
      console.error(e);
      alert('Error deleting document');
    }
  };

  const getStatusIcon = (status: string) => {
    if (status === 'Verified') return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
    if (status === 'Rejected') return <AlertCircle className="w-5 h-5 text-red-500" />;
    return <Clock className="w-5 h-5 text-amber-500" />;
  };

  return (
    <div className="p-4 sm:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Verification Documents</h2>
          <p className="text-sm text-slate-500 mt-1">Manage your business verification documents</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button 
            onClick={() => setShowUploadModal(true)}
            className="shrink-0 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus size={16} /> Upload Document
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500">Loading documents...</div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">{error}</div>
        ) : documents.length === 0 ? (
          <div className="p-12 flex flex-col items-center justify-center text-center">
            <FileText className="w-12 h-12 text-slate-300 mb-4" />
            <h3 className="text-lg font-bold text-slate-700">No Documents Uploaded</h3>
            <p className="text-slate-500 mt-2 max-w-sm">Upload your verification documents to get your business profile verified and unlock premium features.</p>
            <button 
              onClick={() => setShowUploadModal(true)}
              className="mt-6 px-6 py-2 bg-blue-50 text-blue-600 font-semibold rounded-lg hover:bg-blue-100 transition"
            >
              Upload First Document
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-sm text-slate-600 whitespace-nowrap">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500 font-bold border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Document Type</th>
                  <th className="px-6 py-4">Uploaded At</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {documents.map((doc, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">
                      {doc.doc_type}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {doc.uploaded_at ? new Date(doc.uploaded_at).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        doc.status === 'Verified' 
                          ? 'bg-green-100 text-green-700' 
                          : doc.status === 'Pending' 
                          ? 'bg-amber-100 text-amber-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right flex justify-end gap-3">
                      {doc.document_url && (
                        <a 
                          href={getMediaUrl(doc.document_url)} 
                          target="_blank" 
                          rel="noreferrer"
                          className="text-blue-600 font-medium hover:underline text-xs"
                        >
                          View
                        </a>
                      )}
                      <button 
                        onClick={() => openEditModal(doc)}
                        className="text-blue-600 font-medium hover:underline text-xs"
                      >
                        Re-upload
                      </button>
                      <button 
                        onClick={() => handleDeleteDocument(doc.id)}
                        className="text-red-600 font-medium hover:underline text-xs"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={closeModal} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold text-slate-900 mb-4">
              {editingDoc ? 'Re-upload Document' : 'Upload Document'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Document Type</label>
                <select 
                  value={uploadType}
                  onChange={(e) => setUploadType(e.target.value)}
                  disabled={!!editingDoc}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-slate-100 disabled:text-slate-500"
                >
                  {editingDoc ? (
                    <option value={uploadType}>{uploadType}</option>
                  ) : (
                    docTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))
                  )}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Select File (PDF, JPG, PNG)</label>
                <input 
                  type="file" 
                  accept=".pdf,image/*"
                  onChange={handleFileChange}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button 
                onClick={closeModal}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 font-medium"
              >
                Cancel
              </button>
              <button 
                onClick={handleUploadSubmit}
                disabled={!selectedFile || uploading}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium disabled:opacity-50 flex items-center gap-2"
              >
                {uploading ? 'Uploading...' : 'Upload'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
