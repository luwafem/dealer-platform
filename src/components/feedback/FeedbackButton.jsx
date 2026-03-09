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
        className="fixed bottom-4 right-4 border-2 border-black bg-yellow-400 text-black p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-black hover:text-white transition-colors z-40"
        title="Give Feedback"
      >
        <MessageSquare size={24} strokeWidth={2} />
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <div className="bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] max-w-md w-full p-6 relative">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 border-2 border-black p-1 hover:bg-black hover:text-white transition-colors"
            >
              <X size={20} strokeWidth={2} />
            </button>
            <h2 className="text-2xl font-black uppercase tracking-tighter mb-2 border-b-2 border-black pb-2">
              Send Feedback
            </h2>
            <p className="font-bold mb-4">
              Help us improve by sharing your ideas, reporting bugs, or suggesting new features.
            </p>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-black uppercase mb-1">Feedback Type</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full border-2 border-black p-3 font-medium bg-white focus:outline-none focus:border-yellow-400 focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                >
                  <option value="suggestion">Suggestion</option>
                  <option value="feature">Feature Request</option>
                  <option value="bug">Bug Report</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-black uppercase mb-1">Message</label>
                <textarea
                  name="message"
                  rows="4"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="w-full border-2 border-black p-3 font-medium bg-white focus:outline-none focus:border-yellow-400 focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                  placeholder="Tell us what you think..."
                />
              </div>
              {!user && (
                <div className="mb-4">
                  <label className="block text-sm font-black uppercase mb-1">Your Name (optional)</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full border-2 border-black p-3 font-medium bg-white focus:outline-none focus:border-yellow-400 focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                  />
                </div>
              )}
              <button
                type="submit"
                disabled={submitting}
                className="w-full border-2 border-black bg-yellow-400 text-black px-4 py-3 font-black uppercase hover:bg-black hover:text-white transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <Send size={18} className="mr-2" strokeWidth={2} />
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