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
    is_distress,  // 👈 add this field
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
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
        <div className="aspect-w-16 aspect-h-9 bg-gray-200 relative">
          {mainPhoto ? (
            <img
              src={mainPhoto}
              alt={`${make} ${model}`}
              className="w-full h-48 object-cover group-hover:scale-105 transition duration-300"
            />
          ) : (
            <div className="w-full h-48 flex items-center justify-center bg-gray-100">
              <Camera className="w-12 h-12 text-gray-400" />
            </div>
          )}
          {/* Distress badge */}
          {is_distress && (
            <div className="absolute top-2 left-2 z-10">
              <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-full flex items-center">
                <AlertTriangle size={12} className="mr-1" />
                Distress
              </span>
            </div>
          )}
          {status === 'sold' && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="bg-red-600 text-white px-4 py-2 rounded-full font-bold">SOLD</span>
            </div>
          )}
          {/* Compare Button – only for available listings */}
          {status === 'available' && (
            <button
              onClick={handleCompareClick}
              className={`absolute top-2 right-2 p-2 rounded-full ${
                selected ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'
              } shadow-md hover:shadow-lg z-10 transition`}
              title={selected ? 'Remove from compare' : 'Add to compare'}
            >
              <ArrowLeftRight size={16} />
            </button>
          )}
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 truncate">
            {make} {model} {year}
          </h3>
          <div className="mt-1 flex items-center text-gray-600">
            <MapPin size={16} className="mr-1" />
            <span className="text-sm truncate">{location}</span>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-xl font-bold text-blue-600">{formatNaira(price)}</span>
            {negotiable && (
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Negotiable</span>
            )}
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
            {isOwner ? (
              <span className="flex items-center">
                <Eye size={14} className="mr-1" />
                {views} views
              </span>
            ) : (
              <span></span>
            )}
            <span>{timeAgo(created_at)}</span>
          </div>
          <div className="mt-2 flex justify-end">
            <span className="inline-flex items-center text-blue-600 text-sm font-medium group-hover:underline">
              View Details <ChevronRight size={16} />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ListingCard;