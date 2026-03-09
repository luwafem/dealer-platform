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

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b flex items-center">
        <MessageSquare className="w-5 h-5 text-blue-500 mr-2" />
        <h2 className="text-lg font-semibold">User Feedback</h2>
      </div>
      {feedback.length === 0 ? (
        <div className="p-6 text-center text-gray-500">No feedback yet</div>
      ) : (
        <div className="divide-y">
          {feedback.map(item => (
            <div key={item.id} className="p-4 hover:bg-gray-50">
              <div className="flex justify-between items-start">
                <div>
                  <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                    item.type === 'bug' ? 'bg-red-100 text-red-800' :
                    item.type === 'feature' ? 'bg-green-100 text-green-800' :
                    item.type === 'suggestion' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {item.type}
                  </span>
                  <p className="mt-2 text-gray-800">{item.message}</p>
                  <div className="mt-2 text-xs text-gray-500">
                    {item.name && <span>{item.name} • </span>}
                    {timeAgo(item.created_at)}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleStatusChange(item.id, 'addressed')}
                    className="text-green-600 hover:text-green-800"
                    title="Mark as addressed"
                  >
                    <CheckCircle size={18} />
                  </button>
                  <button
                    onClick={() => handleStatusChange(item.id, 'read')}
                    className="text-blue-600 hover:text-blue-800"
                    title="Mark as read"
                  >
                    <MessageSquare size={18} />
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