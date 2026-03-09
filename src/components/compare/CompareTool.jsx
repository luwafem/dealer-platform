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
      <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        {/* Header */}
        <div className="bg-black text-white px-4 py-2 flex items-center justify-between border-b-2 border-black">
          <div className="flex items-center space-x-2">
            <ArrowLeftRight size={18} strokeWidth={2} />
            <span className="font-black uppercase text-sm">Compare Cars ({count}/{maxCompare})</span>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="hover:bg-white hover:text-black p-1 transition-colors border-2 border-transparent hover:border-black"
          >
            {isExpanded ? <X size={18} strokeWidth={2} /> : <Eye size={18} strokeWidth={2} />}
          </button>
        </div>

        {/* Expanded content */}
        {isExpanded && (
          <>
            <div className="p-4 grid grid-cols-4 gap-3">
              {selectedListings.map(listing => (
                <div key={listing.id} className="relative bg-white border-2 border-black p-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <button
                    onClick={() => removeFromList(listing.id)}
                    className="absolute -top-2 -right-2 bg-white border-2 border-black text-black hover:bg-black hover:text-white transition-colors p-0.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  >
                    <X size={12} strokeWidth={2} />
                  </button>
                  {listing.photos && listing.photos[0] ? (
                    <img src={listing.photos[0]} alt={listing.make} className="w-full h-16 object-cover border-2 border-black" />
                  ) : (
                    <div className="w-full h-16 border-2 border-black bg-gray-100 flex items-center justify-center text-xs font-bold">
                      No image
                    </div>
                  )}
                  <p className="text-xs font-black uppercase mt-1 truncate">{listing.make} {listing.model}</p>
                  <p className="text-xs font-bold">{listing.year}</p>
                </div>
              ))}
              {/* Empty slots */}
              {[...Array(maxCompare - count)].map((_, i) => (
                <div key={i} className="border-2 border-black bg-gray-100 p-2 flex items-center justify-center h-28 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <span className="text-xs font-bold text-gray-500">Empty</span>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="border-t-2 border-black bg-gray-100 px-4 py-3 flex justify-between">
              <button
                onClick={clearList}
                className="border-2 border-black bg-white text-black px-4 py-1 font-black uppercase text-sm hover:bg-black hover:text-white transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              >
                Clear all
              </button>
              <button
                onClick={handleCompare}
                disabled={count < 2}
                className="border-2 border-black bg-yellow-400 text-black px-4 py-1 font-black uppercase text-sm hover:bg-black hover:text-white transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
              >
                <span>Compare</span>
                <ChevronRight size={16} strokeWidth={2} />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CompareTool;