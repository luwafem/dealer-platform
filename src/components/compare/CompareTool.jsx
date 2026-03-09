import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Eye, ChevronRight, ArrowLeftRight } from 'lucide-react';
import { useCompare } from '../../context/CompareContext';

const CompareTool = () => {
  const { selectedListings, removeFromList, clearList, count, maxCompare } = useCompare();
  const [isExpanded, setIsExpanded] = useState(true);
  const navigate = useNavigate();

  if (count === 0) return null;

  const handleCompare = () => {
    // Navigate to compare page with selected IDs in URL
    const ids = selectedListings.map(l => l.id).join(',');
    navigate(`/compare?ids=${ids}`);
  };

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-2xl px-4">
      <div className="bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 text-white px-4 py-2 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ArrowLeftRight size={18} />
            <span className="font-semibold">Compare Cars ({count}/{maxCompare})</span>
          </div>
          <button onClick={() => setIsExpanded(!isExpanded)} className="text-white hover:text-blue-100">
            {isExpanded ? <X size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {/* Expanded content */}
        {isExpanded && (
          <>
            <div className="p-4 grid grid-cols-4 gap-2">
              {selectedListings.map(listing => (
                <div key={listing.id} className="relative bg-gray-50 rounded-lg p-2">
                  <button
                    onClick={() => removeFromList(listing.id)}
                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600"
                  >
                    <X size={14} />
                  </button>
                  {listing.photos && listing.photos[0] ? (
                    <img src={listing.photos[0]} alt={listing.make} className="w-full h-16 object-cover rounded" />
                  ) : (
                    <div className="w-full h-16 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">
                      No image
                    </div>
                  )}
                  <p className="text-xs font-medium mt-1 truncate">{listing.make} {listing.model}</p>
                  <p className="text-xs text-gray-600">{listing.year}</p>
                </div>
              ))}
              {/* Empty slots */}
              {[...Array(maxCompare - count)].map((_, i) => (
                <div key={i} className="bg-gray-100 rounded-lg p-2 flex items-center justify-center h-24 border-2 border-dashed border-gray-300">
                  <span className="text-xs text-gray-400">Empty</span>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="bg-gray-50 px-4 py-3 flex justify-between">
              <button onClick={clearList} className="text-sm text-red-600 hover:text-red-700">
                Clear all
              </button>
              <button
                onClick={handleCompare}
                disabled={count < 2}
                className="bg-blue-600 text-white px-4 py-1 rounded-md text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
              >
                <span>Compare</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CompareTool;