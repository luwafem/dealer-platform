import React, { useEffect, useState } from 'react';
import { verificationService } from '../../services/verificationService';
import { CheckCircle, XCircle, Eye } from 'lucide-react';
import toast from 'react-hot-toast';

const VerificationRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      const data = await verificationService.getAllRequests('pending');
      setRequests(data);
    } catch (error) {
      console.error('Error loading verification requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (requestId, approve) => {
    try {
      await verificationService.updateRequestStatus(
        requestId,
        approve ? 'approved' : 'rejected',
        approve ? 'Approved by admin' : 'Rejected by admin'
      );
      toast.success(`Request ${approve ? 'approved' : 'rejected'}`);
      loadRequests();
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b">
        <h2 className="text-lg font-semibold">Verification Requests</h2>
      </div>

      {requests.length === 0 ? (
        <div className="p-6 text-center text-gray-500">No pending requests</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Business</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Paid Deals</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Documents</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {requests.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="font-medium">{request.dealer?.business_name}</p>
                    <p className="text-sm text-gray-500">{request.dealer?.email}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p>{request.dealer?.phone}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                      {request.dealer?.paid_deals || 0}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {request.document_urls?.map((url, idx) => (
                      <a
                        key={idx}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline mr-2"
                      >
                        Doc {idx + 1}
                      </a>
                    ))}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleAction(request.id, true)}
                        className="text-green-600 hover:text-green-800"
                        title="Approve"
                      >
                        <CheckCircle size={20} />
                      </button>
                      <button
                        onClick={() => handleAction(request.id, false)}
                        className="text-red-600 hover:text-red-800"
                        title="Reject"
                      >
                        <XCircle size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default VerificationRequests;