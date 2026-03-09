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
        className="flex items-center gap-1 text-sm font-bold uppercase hover:text-red-600 transition-colors border-2 border-transparent hover:border-red-600 px-2 py-1"
      >
        <Flag size={16} strokeWidth={2} />
        Report
      </button>

      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-black bg-opacity-70" onClick={() => setShowModal(false)} />
            <div className="relative bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] max-w-md w-full p-6">
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 border-2 border-black p-1 hover:bg-black hover:text-white transition-colors"
              >
                <X size={20} strokeWidth={2} />
              </button>

              <h2 className="text-2xl font-black uppercase tracking-tighter mb-4 border-b-2 border-black pb-2">
                Report Listing
              </h2>

              <form onSubmit={handleReport}>
                <div className="mb-4">
                  <label className="block text-sm font-black uppercase mb-1">
                    Reason *
                  </label>
                  <select
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    required
                    className="w-full border-2 border-black p-3 font-medium bg-white focus:outline-none focus:border-yellow-400 focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
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
                  <label className="block text-sm font-black uppercase mb-1">
                    Description (optional)
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows="3"
                    className="w-full border-2 border-black p-3 font-medium bg-white focus:outline-none focus:border-yellow-400 focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                    placeholder="Provide more details..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting || !reason}
                  className="w-full border-2 border-black bg-yellow-400 text-black px-4 py-3 font-black uppercase hover:bg-black hover:text-white transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50 disabled:cursor-not-allowed"
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