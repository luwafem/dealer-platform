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

  if (loading) return <div className="text-center py-8">Loading...</div>;

  // If already verified
  if (dealer?.verified) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-green-800 mb-2">You are Verified!</h1>
          <p className="text-green-700">Your account has been verified. You have a verified badge.</p>
        </div>
      </div>
    );
  }

  // If request pending
  if (request && request.status === 'pending') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <Clock className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-yellow-800 mb-2">Verification Pending</h1>
          <p className="text-yellow-700">Your verification request is being reviewed by admin.</p>
        </div>
      </div>
    );
  }

  // If rejected or no request
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Apply for Verification</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600 mb-4">
          To get a verified badge, please upload business documents (CAC, tax ID, etc.).
        </p>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Documents
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
            <input
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileUpload}
              className="hidden"
              id="doc-upload"
            />
            <label htmlFor="doc-upload" className="cursor-pointer">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <span className="text-blue-600 hover:underline">Click to upload</span>
              <span className="text-gray-500"> or drag and drop</span>
            </label>
            <p className="text-xs text-gray-400 mt-1">PDF, JPG, PNG (max 5MB each)</p>
          </div>

          {documents.length > 0 && (
            <div className="mt-4">
              <h3 className="font-medium mb-2">Uploaded ({documents.length})</h3>
              <ul className="space-y-1">
                {documents.map((url, idx) => (
                  <li key={idx} className="text-sm text-gray-600">
                    <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
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
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          Submit Verification Request
        </button>

        {request && request.status === 'rejected' && (
          <div className="mt-4 p-3 bg-red-50 text-red-700 rounded">
            <p className="font-medium">Previous request rejected</p>
            <p className="text-sm">{request.admin_notes || 'No notes'}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerificationPage;