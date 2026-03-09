import React, { useState } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { feedbackService } from '../../services/feedbackService';
import toast from 'react-hot-toast';

const FeedbackButton = () => {
  const { user, dealer } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    type: 'suggestion',
    message: '',
    name: dealer?.business_name || '',
    email: user?.email || '',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.message.trim()) {
      toast.error('Please enter your feedback');
      return;
    }
    setSubmitting(true);
    try {
      await feedbackService.submitFeedback({
        ...formData,
        user_id: user?.id || null,
      });
      toast.success('Thank you for your feedback!');
      setIsOpen(false);
      setFormData({
        type: 'suggestion',
        message: '',
        name: dealer?.business_name || '',
        email: user?.email || '',
      });
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 z-40"
        title="Give Feedback"
      >
        <MessageSquare size={24} />
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
            <h2 className="text-xl font-bold mb-4">Send Feedback</h2>
            <p className="text-sm text-gray-600 mb-4">
              Help us improve by sharing your ideas, reporting bugs, or suggesting new features.
            </p>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Feedback Type</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="suggestion">Suggestion</option>
                  <option value="feature">Feature Request</option>
                  <option value="bug">Bug Report</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  name="message"
                  rows="4"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Tell us what you think..."
                />
              </div>
              {!user && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Your Name (optional)</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              )}
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center"
              >
                <Send size={18} className="mr-2" />
                {submitting ? 'Submitting...' : 'Send Feedback'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default FeedbackButton;