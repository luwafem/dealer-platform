import React, { useEffect, useState } from 'react';
import { feedbackService } from '../../services/feedbackService';
import { MessageSquare, CheckCircle, XCircle } from 'lucide-react';
import { timeAgo } from '../../utils/formatters';
import toast from 'react-hot-toast';

const AdminFeedback = () => {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeedback();
  }, []);

  const loadFeedback = async () => {
    try {
      const data = await feedbackService.getFeedback();
      setFeedback(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await feedbackService.updateFeedbackStatus(id, newStatus);
      setFeedback(prev =>
        prev.map(f => (f.id === id ? { ...f, status: newStatus } : f))
      );
      toast.success(`Feedback marked as ${newStatus}`);
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (loading) {
    return (
      <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6">
        <div className="text-center font-bold">Loading...</div>
      </div>
    );
  }

  return (
    <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b-2 border-black flex items-center">
        <MessageSquare size={20} strokeWidth={2} className="mr-2" />
        <h2 className="text-2xl font-black uppercase tracking-tighter">User Feedback</h2>
      </div>

      {feedback.length === 0 ? (
        <div className="p-6 text-center font-bold">No feedback yet</div>
      ) : (
        <div className="divide-y-2 divide-black">
          {feedback.map(item => (
            <div key={item.id} className="p-4 hover:bg-yellow-100 transition-colors">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                {/* Content */}
                <div className="flex-1">
                  <span className={`inline-block border-2 border-black px-2 py-1 text-xs font-black uppercase ${
                    item.type === 'bug' ? 'bg-red-100 text-black' :
                    item.type === 'feature' ? 'bg-green-100 text-black' :
                    item.type === 'suggestion' ? 'bg-blue-100 text-black' :
                    'bg-gray-100 text-black'
                  }`}>
                    {item.type}
                  </span>
                  <p className="mt-2 font-bold">{item.message}</p>
                  <div className="mt-2 text-xs font-medium">
                    {item.name && <span>{item.name} • </span>}
                    {timeAgo(item.created_at)}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2 md:flex-shrink-0">
                  <button
                    onClick={() => handleStatusChange(item.id, 'addressed')}
                    className="border-2 border-black p-1.5 hover:bg-black hover:text-white transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                    title="Mark as addressed"
                  >
                    <CheckCircle size={18} strokeWidth={2} />
                  </button>
                  <button
                    onClick={() => handleStatusChange(item.id, 'read')}
                    className="border-2 border-black p-1.5 hover:bg-black hover:text-white transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                    title="Mark as read"
                  >
                    <MessageSquare size={18} strokeWidth={2} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminFeedback;