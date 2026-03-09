import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { verificationService } from '../services/verificationService';
import { storageService } from '../services/storageService';
import { Upload, CheckCircle, XCircle, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

const VerificationPage = () => {
  const { dealer, refreshDealer } = useAuth();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [documents, setDocuments] = useState([]);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    loadRequest();
  }, []);

  const loadRequest = async () => {
    try {
      const data = await verificationService.getMyRequest();
      setRequest(data);
    } catch (error) {
      console.error('Error loading request:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    setUploading(true);
    try {
      const urls = [];
      for (const file of files) {
        const url = await storageService.uploadDocument(file, dealer.id);
        urls.push(url);
      }
      setDocuments(prev => [...prev, ...urls]);
      toast.success('Documents uploaded');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (documents.length === 0) {
      toast.error('Please upload at least one document');
      return;
    }
    try {
      await verificationService.createRequest(documents);
      toast.success('Verification request submitted');
      loadRequest();
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f4f4f2] flex justify-center items-center">
        <div className="border-2 border-black p-8 bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="animate-spin rounded-none h-12 w-12 border-2 border-black border-t-transparent"></div>
        </div>
      </div>
    );
  }

  // If already verified
  if (dealer?.verified) {
    return (
      <div className="min-h-screen bg-[#f4f4f2] text-[#1a1a1a] selection:bg-yellow-300 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-8 text-center">
            <CheckCircle size={64} strokeWidth={2} className="mx-auto mb-4" />
            <h1 className="text-3xl font-black uppercase tracking-tighter mb-2">You are Verified!</h1>
            <p className="font-bold">Your account has been verified. You have a verified badge.</p>
          </div>
        </div>
      </div>
    );
  }

  // If request pending
  if (request && request.status === 'pending') {
    return (
      <div className="min-h-screen bg-[#f4f4f2] text-[#1a1a1a] selection:bg-yellow-300 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-8 text-center">
            <Clock size={64} strokeWidth={2} className="mx-auto mb-4" />
            <h1 className="text-3xl font-black uppercase tracking-tighter mb-2">Verification Pending</h1>
            <p className="font-bold">Your verification request is being reviewed by admin.</p>
          </div>
        </div>
      </div>
    );
  }

  // If rejected or no request
  return (
    <div className="min-h-screen bg-[#f4f4f2] text-[#1a1a1a] selection:bg-yellow-300 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8 border-b-2 border-black pb-4">
          <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter leading-none">
            Apply for <br /> Verification
          </h1>
          <p className="text-lg font-medium mt-2 border-l-4 border-black pl-4">
            Get your verified badge
          </p>
        </div>

        <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6">
          <p className="font-bold mb-4">
            To get a verified badge, please upload business documents (CAC, tax ID, etc.).
          </p>

          <div className="mb-6">
            <label className="block text-sm font-black uppercase mb-2">
              Upload Documents
            </label>
            <div className="border-2 border-black p-4 text-center bg-white">
              <input
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileUpload}
                className="hidden"
                id="doc-upload"
              />
              <label htmlFor="doc-upload" className="cursor-pointer block">
                <Upload size={32} strokeWidth={2} className="mx-auto mb-2" />
                <span className="font-black uppercase underline">Click to upload</span>
                <span className="font-bold"> or drag and drop</span>
              </label>
              <p className="text-xs font-bold mt-1">PDF, JPG, PNG (max 5MB each)</p>
            </div>

            {documents.length > 0 && (
              <div className="mt-4">
                <h3 className="font-black uppercase mb-2">Uploaded ({documents.length})</h3>
                <ul className="space-y-1">
                  {documents.map((url, idx) => (
                    <li key={idx} className="text-sm font-bold">
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline hover:no-underline"
                      >
                        Document {idx + 1}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <button
            onClick={handleSubmit}
            disabled={documents.length === 0 || uploading}
            className="w-full border-2 border-black bg-yellow-400 text-black px-4 py-2 font-black uppercase hover:bg-black hover:text-white transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Submit Verification Request
          </button>

          {request && request.status === 'rejected' && (
            <div className="mt-4 p-3 border-2 border-black bg-red-100">
              <p className="font-black uppercase">Previous request rejected</p>
              <p className="text-sm font-bold">{request.admin_notes || 'No notes'}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerificationPage;