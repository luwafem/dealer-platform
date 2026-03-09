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
      <div className="px-6 py-4 border-b-2 border-black flex items-center">
        <AlertTriangle size={20} strokeWidth={2} className="mr-2" />
        <h2 className="text-2xl font-black uppercase tracking-tighter">Flagged Listings</h2>
        <span className="ml-2 border-2 border-black bg-white px-2 py-1 text-xs font-bold">
          {reports.length} pending
        </span>
      </div>

      {reports.length === 0 ? (
        <div className="p-6 text-center font-bold">No pending reports</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y-2 divide-black">
            <thead className="bg-black text-white">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-black uppercase tracking-wider">Listing</th>
                <th className="px-6 py-3 text-left text-xs font-black uppercase tracking-wider">Reporter</th>
                <th className="px-6 py-3 text-left text-xs font-black uppercase tracking-wider">Reason</th>
                <th className="px-6 py-3 text-left text-xs font-black uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-black uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y-2 divide-black">
              {reports.map((report) => (
                <tr key={report.id} className="hover:bg-yellow-100 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p className="font-black uppercase">
                        {report.listing?.make} {report.listing?.model} {report.listing?.year}
                      </p>
                      <p className="text-sm font-bold">
                        {formatNaira(report.listing?.price)}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="font-black uppercase">{report.reporter?.business_name}</p>
                    <p className="text-sm font-bold">{report.reporter?.phone}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-black uppercase">{report.reason}</p>
                    {report.description && (
                      <p className="text-sm font-bold">{report.description}</p>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold">
                    {timeAgo(report.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => window.open(`/listings/${report.listing_id}`, '_blank')}
                        className="border-2 border-black p-1 hover:bg-black hover:text-white transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                        title="View"
                      >
                        <Eye size={16} strokeWidth={2} />
                      </button>
                      <button
                        onClick={() => handleResolve(report.id, report.listing_id, 'approve')}
                        className="border-2 border-black p-1 hover:bg-black hover:text-white transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                        title="Resolve (keep listing)"
                      >
                        <CheckCircle size={16} strokeWidth={2} />
                      </button>
                      <button
                        onClick={() => handleResolve(report.id, report.listing_id, 'dismiss')}
                        className="border-2 border-black p-1 hover:bg-black hover:text-white transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                        title="Dismiss report"
                      >
                        <XCircle size={16} strokeWidth={2} />
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