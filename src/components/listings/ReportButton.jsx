import React, { useState } from 'react';
import { Flag, X } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { reportService } from '../../services/reportService';
import toast from 'react-hot-toast';

const ReportButton = ({ listingId }) => {
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleReport = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to report');
      return;
    }
    setSubmitting(true);
    try {
      await reportService.createReport(listingId, reason, description);
      toast.success('Report submitted. Admin will review it.');
      setShowModal(false);
      setReason('');
      setDescription('');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center text-gray-500 hover:text-red-600 text-sm"
      >
        <Flag size={16} className="mr-1" />
        Report
      </button>

      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowModal(false)} />
            <div className="relative bg-white rounded-lg max-w-md w-full p-6">
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>

              <h2 className="text-xl font-bold mb-4">Report Listing</h2>

              <form onSubmit={handleReport}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reason *
                  </label>
                  <select
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    required
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">Select a reason</option>
                    <option value="spam">Spam</option>
                    <option value="fake">Fake listing</option>
                    <option value="wrong_category">Wrong category</option>
                    <option value="fraud">Fraudulent</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description (optional)
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows="3"
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Provide more details..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting || !reason}
                  className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Submit Report'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ReportButton;