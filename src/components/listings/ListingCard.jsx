import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { MapPin, Eye, Camera, ChevronRight, ArrowLeftRight, AlertTriangle } from 'lucide-react';
import { formatNaira, timeAgo } from '../../utils/formatters';
import { useCompare } from '../../context/CompareContext';

const ListingCard = ({ listing }) => {
  const { user, dealer } = useAuth();
  const {
    id,
    dealer_id,
    make,
    model,
    year,
    price,
    negotiable,
    location,
    photos,
    views,
    created_at,
    status,
    is_distress,
  } = listing;

  const { addToList, removeFromList, isSelected } = useCompare();
  const selected = isSelected(id);
  const isOwner = dealer && dealer_id === dealer.id;

  const mainPhoto = photos && photos.length > 0 ? photos[0] : null;

  const handleCompareClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (selected) {
      removeFromList(id);
    } else {
      addToList(listing);
    }
  };

  return (
    <Link to={`/listings/${id}`} className="block group">
      <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] group-hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] group-hover:-translate-x-1 group-hover:-translate-y-1 transition-all duration-200 overflow-hidden relative">
        
        {/* Image Container */}
        <div className="aspect-w-16 aspect-h-9 bg-slate-200 relative border-b-4 border-black">
          {mainPhoto ? (
            <img
              src={mainPhoto}
              alt={`${make} ${model}`}
              className="w-full h-52 object-cover grayscale-[0.2] group-hover:grayscale-0 transition duration-300"
            />
          ) : (
            <div className="w-full h-52 flex flex-col items-center justify-center bg-slate-100">
              <Camera className="w-12 h-12 text-black/20" />
              <span className="text-[10px] font-black uppercase mt-2">No Visual Data</span>
            </div>
          )}

          {/* Distress Badge - Loud & Aggressive */}
          {is_distress && (
            <div className="absolute top-0 left-0 z-10">
              <span className="bg-yellow-400 text-black border-r-4 border-b-4 border-black text-[10px] font-black px-3 py-1 flex items-center gap-1 uppercase italic tracking-tighter">
                
                Distress Sale
              </span>
            </div>
          )}

          {/* Sold Overlay */}
          {status === 'sold' && (
            <div className="absolute inset-0 bg-red-600/90 flex items-center justify-center z-20">
              <span className="border-4 border-white text-white px-6 py-2 font-black text-2xl uppercase italic tracking-widest -rotate-12">
                Sold Out
              </span>
            </div>
          )}

          {/* Compare Button */}
          {status === 'available' && (
            <button
              onClick={handleCompareClick}
              className={`absolute top-2 right-2 p-2 border-2 border-black transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 z-30 ${
                selected ? 'bg-yellow-400 text-black' : 'bg-white text-black'
              }`}
              title={selected ? 'Remove from compare' : 'Add to compare'}
            >
              <ArrowLeftRight size={18} strokeWidth={3} />
            </button>
          )}
        </div>

        {/* Content Area */}
        <div className="p-5">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-black uppercase italic tracking-tighter leading-none truncate max-w-[70%]">
              {make} {model}
            </h3>
            <span className="bg-black text-white text-[10px] font-bold px-2 py-0.5">
              {year}
            </span>
          </div>

          <div className="flex items-center text-slate-500 mb-4">
            <MapPin size={14} strokeWidth={3} className="mr-1 text-black" />
            <span className="text-[10px] font-black uppercase tracking-widest truncate">{location}</span>
          </div>

          <div className="flex flex-col gap-1 mb-4">
            <span className="text-2xl font-black tracking-tighter text-black leading-none">
              {formatNaira(price)}
            </span>
            {negotiable && (
              <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600">
                // Price Negotiable
              </span>
            )}
          </div>

          <div className="flex items-center justify-between border-t-2 border-black pt-4 mt-2">
            <div className="flex items-center gap-4">
               {isOwner && (
                <span className="flex items-center text-[10px] font-black uppercase">
                  <Eye size={12} className="mr-1" strokeWidth={3} /> {views}
                </span>
              )}
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-tighter">
                {timeAgo(created_at)}
              </span>
            </div>
            
            <div className="flex items-center font-black uppercase text-[11px] tracking-tighter group-hover:text-yellow-500 transition-colors">
              Inspect <ChevronRight size={16} strokeWidth={4} />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ListingCard;