import React, { useEffect, useState } from 'react';
import { reportService } from '../../services/reportService';
import { AlertTriangle, CheckCircle, XCircle, Eye } from 'lucide-react';
import { formatNaira, timeAgo } from '../../utils/formatters';
import toast from 'react-hot-toast';

const FlaggedListings = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      const data = await reportService.getReports('pending');
      setReports(data);
    } catch (error) {
      console.error('Error loading reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async (reportId, listingId, action) => {
    try {
      if (action === 'approve') {
        // Optionally delete the listing or just mark as flagged
        await reportService.updateReportStatus(reportId, 'resolved');
        toast.success('Report resolved');
      } else if (action === 'dismiss') {
        await reportService.updateReportStatus(reportId, 'dismissed');
        toast.success('Report dismissed');
      }
      loadReports();
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
      <div className="px-6 py-4 border-b flex items-center">
        <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
        <h2 className="text-lg font-semibold">Flagged Listings</h2>
        <span className="ml-2 bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
          {reports.length} pending
        </span>
      </div>

      {reports.length === 0 ? (
        <div className="p-6 text-center text-gray-500">No pending reports</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Listing</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reporter</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reason</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reports.map((report) => (
                <tr key={report.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p className="font-medium">
                        {report.listing?.make} {report.listing?.model} {report.listing?.year}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatNaira(report.listing?.price)}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="font-medium">{report.reporter?.business_name}</p>
                    <p className="text-sm text-gray-500">{report.reporter?.phone}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium">{report.reason}</p>
                    {report.description && (
                      <p className="text-sm text-gray-500">{report.description}</p>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {timeAgo(report.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => window.open(`/listings/${report.listing_id}`, '_blank')}
                        className="text-blue-600 hover:text-blue-800"
                        title="View"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => handleResolve(report.id, report.listing_id, 'approve')}
                        className="text-green-600 hover:text-green-800"
                        title="Resolve (keep listing)"
                      >
                        <CheckCircle size={18} />
                      </button>
                      <button
                        onClick={() => handleResolve(report.id, report.listing_id, 'dismiss')}
                        className="text-red-600 hover:text-red-800"
                        title="Dismiss report"
                      >
                        <XCircle size={18} />
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

export default FlaggedListings;