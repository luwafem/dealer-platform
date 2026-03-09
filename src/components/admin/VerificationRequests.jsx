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
      <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-300 border-2 border-black w-1/4"></div>
          <div className="h-10 bg-gray-300 border-2 border-black"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
      <div className="px-6 py-4 border-b-2 border-black">
        <h2 className="text-2xl font-black uppercase tracking-tighter">Verification Requests</h2>
      </div>

      {requests.length === 0 ? (
        <div className="p-6 text-center font-bold">No pending requests</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y-2 divide-black">
            <thead className="bg-black text-white">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-black uppercase tracking-wider">Business</th>
                <th className="px-6 py-3 text-left text-xs font-black uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-black uppercase tracking-wider">Paid Deals</th>
                <th className="px-6 py-3 text-left text-xs font-black uppercase tracking-wider">Documents</th>
                <th className="px-6 py-3 text-left text-xs font-black uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y-2 divide-black">
              {requests.map((request) => (
                <tr key={request.id} className="hover:bg-yellow-100 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="font-black uppercase">{request.dealer?.business_name}</p>
                    <p className="text-sm font-bold">{request.dealer?.email}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-bold">
                    {request.dealer?.phone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="border-2 border-black px-2 py-1 font-bold text-sm">
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
                        className="font-bold underline hover:no-underline mr-2"
                      >
                        Doc {idx + 1}
                      </a>
                    ))}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleAction(request.id, true)}
                        className="border-2 border-black p-1 hover:bg-black hover:text-white transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                        title="Approve"
                      >
                        <CheckCircle size={18} strokeWidth={2} />
                      </button>
                      <button
                        onClick={() => handleAction(request.id, false)}
                        className="border-2 border-black p-1 hover:bg-black hover:text-white transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                        title="Reject"
                      >
                        <XCircle size={18} strokeWidth={2} />
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