import React, { useEffect, useState, useRef } from 'react'; // 👈 added useRef
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { listingService } from '../../services/listingService';
import {
  MapPin, Calendar, Gauge, Fuel, Cpu, Settings, Check, X,
  ChevronLeft, Edit, Trash2, Share2, Star, Camera, Eye
} from 'lucide-react';
import { formatNaira, timeAgo } from '../../utils/formatters';
import WhatsAppContact from './WhatsAppContact';
import MarkAsSoldButton from './MarkAsSoldButton';
import ReportButton from './ReportButton';
import toast from 'react-hot-toast';

const ListingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, dealer } = useAuth();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const hasIncremented = useRef(false); // 👈 prevent multiple increments

  useEffect(() => {
    loadListing();
  }, [id]);

  const loadListing = async () => {
    try {
      setLoading(true);
      const data = await listingService.getListingById(id);
      setListing(data);
      if (data.photos && data.photos.length > 0) {
        setSelectedPhoto(data.photos[0]);
      }

      // Increment view count only once per session
      if (!hasIncremented.current) {
        hasIncremented.current = true;
        // Call increment and update UI optimistically
        await listingService.incrementViews(id);
        setListing(prev => prev ? { ...prev, views: (prev.views || 0) + 1 } : prev);
      }
    } catch (error) {
      toast.error('Failed to load listing');
      navigate('/search');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;
    try {
      await listingService.deleteListing(id);
      toast.success('Listing deleted');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!listing) return null;

  const isOwner = user && dealer && listing.dealer_id === dealer.id;
  const mainPhoto = selectedPhoto || (listing.photos?.[0] || null);

  // Helper to render checkmark for boolean features
  const renderFeature = (condition, label) => (
    <div className="flex items-center space-x-2">
      {condition ? (
        <Check className="w-5 h-5 text-green-600" />
      ) : (
        <X className="w-5 h-5 text-red-400" />
      )}
      <span className="text-gray-700">{label}</span>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Navigation */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
      >
        <ChevronLeft size={20} />
        <span>Back</span>
      </button>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Photos */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Main Photo */}
            <div className="aspect-w-16 aspect-h-9 bg-gray-100">
              {mainPhoto ? (
                <img
                  src={mainPhoto}
                  alt={`${listing.make} ${listing.model}`}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Camera className="w-16 h-16 text-gray-400" />
                </div>
              )}
            </div>
            {/* Thumbnails */}
            {listing.photos && listing.photos.length > 1 && (
              <div className="grid grid-cols-6 gap-2 p-4">
                {listing.photos.map((photo, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedPhoto(photo)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 ${
                      selectedPhoto === photo ? 'border-blue-600' : 'border-transparent'
                    }`}
                  >
                    <img src={photo} alt={`Thumbnail ${index}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Details & Actions */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4">
            {/* Price & Title */}
            <h1 className="text-2xl font-bold text-gray-900">
              {listing.make} {listing.model} {listing.year}
            </h1>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-3xl font-bold text-blue-600">{formatNaira(listing.price)}</span>
              {listing.negotiable && (
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">Negotiable</span>
              )}
            </div>

            {/* Dealer Info */}
            {listing.dealer && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-bold text-lg">
                        {listing.dealer.business_name?.charAt(0)}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold">{listing.dealer.business_name}</p>
                    <div className="flex items-center mt-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="ml-1 text-sm">{listing.dealer.rating || 'New'}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Location */}
            <div className="mt-4 flex items-center text-gray-600">
              <MapPin size={18} className="mr-2" />
              <span>{listing.location}</span>
            </div>

            {/* Quick Specs */}
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div className="bg-gray-50 p-2 rounded flex items-center">
                <Calendar size={16} className="mr-2 text-gray-500" />
                <span>{listing.year}</span>
              </div>
              {listing.mileage && (
                <div className="bg-gray-50 p-2 rounded flex items-center">
                  <Gauge size={16} className="mr-2 text-gray-500" />
                  <span>{listing.mileage.toLocaleString()} km</span>
                </div>
              )}
              <div className="bg-gray-50 p-2 rounded flex items-center">
                <Fuel size={16} className="mr-2 text-gray-500" />
                <span>{listing.engine_type || 'N/A'}</span>
              </div>
              <div className="bg-gray-50 p-2 rounded flex items-center">
                <Settings size={16} className="mr-2 text-gray-500" />
                <span>{listing.transmission || 'N/A'}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 space-y-3">
              {!isOwner && listing.status === 'available' && listing.dealer && (
                <WhatsAppContact seller={listing.dealer} listing={listing} />
              )}

              {isOwner && (
                <>
                  <Link
                    to={`/edit-listing/${listing.id}`}
                    className="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <Edit className="w-5 h-5 mr-2" />
                    Edit Listing
                  </Link>
                  
                  {/* View count for owner */}
                  <div className="mt-2 p-3 bg-gray-50 rounded-lg text-sm text-gray-700 flex items-center">
                    <Eye size={16} className="mr-2 text-gray-500" />
                    <span className="font-medium">Total views:</span>
                    <span className="ml-1">{listing.views || 0}</span>
                  </div>
                  
                  {listing.status === 'available' && (
                    <MarkAsSoldButton listing={listing} />
                  )}
                  <button
                    onClick={handleDelete}
                    className="w-full flex items-center justify-center px-4 py-3 border border-red-300 rounded-md shadow-sm text-base font-medium text-red-700 bg-white hover:bg-red-50"
                  >
                    <Trash2 className="w-5 h-5 mr-2" />
                    Delete Listing
                  </button>
                </>
              )}

              <button
                onClick={() => {/* share logic */}}
                className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <Share2 className="w-5 h-5 mr-2" />
                Share
              </button>
              {!isOwner && (
                <div className="mt-3 border-t pt-3">
                  <ReportButton listingId={listing.id} />
                </div>
              )}
              
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Specifications */}
      <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4">Detailed Specifications</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Engine & Transmission */}
          <div>
            <h3 className="font-semibold text-gray-700 mb-2 flex items-center">
              <Cpu size={18} className="mr-2" /> Engine & Transmission
            </h3>
            <dl className="space-y-1 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-500">Engine Type:</dt>
                <dd className="font-medium">{listing.engine_type || 'N/A'}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Engine Condition:</dt>
                <dd className="font-medium">{listing.engine_condition || 'N/A'}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Engine Size:</dt>
                <dd className="font-medium">{listing.engine_size || 'N/A'}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Transmission:</dt>
                <dd className="font-medium">{listing.transmission || 'N/A'}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Transmission Condition:</dt>
                <dd className="font-medium">{listing.transmission_condition || 'N/A'}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Mileage:</dt>
                <dd className="font-medium">{listing.mileage ? listing.mileage.toLocaleString() + ' km' : 'N/A'}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Mileage Accuracy:</dt>
                <dd className="font-medium">{listing.mileage_accuracy || 'N/A'}</dd>
              </div>
            </dl>
          </div>

          {/* Body & Interior */}
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Body & Interior</h3>
            <dl className="space-y-1 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-500">Paint:</dt>
                <dd className="font-medium">{listing.paint || 'N/A'}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Rust:</dt>
                <dd className="font-medium">{listing.rust || 'None'}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Interior Condition:</dt>
                <dd className="font-medium">{listing.interior_condition || 'N/A'}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Air Conditioning:</dt>
                <dd className="font-medium">{listing.ac || 'N/A'}</dd>
              </div>
            </dl>
          </div>

          {/* Features */}
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Features</h3>
            <div className="space-y-1">
              {renderFeature(listing.sunroof, 'Sunroof')}
              {renderFeature(listing.leather, 'Leather Seats')}
              {renderFeature(listing.navigation, 'Navigation')}
              {renderFeature(listing.backup_camera, 'Backup Camera')}
              {renderFeature(listing.third_row, 'Third Row Seats')}
            </div>
          </div>

          {/* Category Specifics */}
          {listing.category === 'tokunbo' && (
            <div className="lg:col-span-3 mt-4">
              <h3 className="font-semibold text-gray-700 mb-2">Tokunbo Details</h3>
              <dl className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <dt className="text-gray-500">Country of Origin:</dt>
                  <dd className="font-medium">{listing.country_origin || 'N/A'}</dd>
                </div>
                <div>
                  <dt className="text-gray-500">Year Imported:</dt>
                  <dd className="font-medium">{listing.year_imported || 'N/A'}</dd>
                </div>
                <div>
                  <dt className="text-gray-500">Customs Status:</dt>
                  <dd className="font-medium">{listing.customs_status || 'N/A'}</dd>
                </div>
                <div>
                  <dt className="text-gray-500">Customs Document:</dt>
                  <dd className="font-medium">{listing.customs_document || 'N/A'}</dd>
                </div>
                <div>
                  <dt className="text-gray-500">Mileage at Import:</dt>
                  <dd className="font-medium">{listing.mileage_at_import ? listing.mileage_at_import.toLocaleString() + ' km' : 'N/A'}</dd>
                </div>
                <div>
                  <dt className="text-gray-500">Shipping Damage:</dt>
                  <dd className="font-medium">{listing.shipping_damage || 'None'}</dd>
                </div>
                <div>
                  <dt className="text-gray-500">Port of Clearing:</dt>
                  <dd className="font-medium">{listing.port_clearing || 'N/A'}</dd>
                </div>
              </dl>
            </div>
          )}

          {listing.category === 'nigerian_used' && (
            <div className="lg:col-span-3 mt-4">
              <h3 className="font-semibold text-gray-700 mb-2">Nigerian Used Details</h3>
              <dl className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <dt className="text-gray-500">Number of Owners:</dt>
                  <dd className="font-medium">{listing.owner_count || 'N/A'}</dd>
                </div>
                <div>
                  <dt className="text-gray-500">Usage History:</dt>
                  <dd className="font-medium">{listing.usage_history || 'N/A'}</dd>
                </div>
                <div>
                  <dt className="text-gray-500">Service History:</dt>
                  <dd className="font-medium">{listing.service_history || 'N/A'}</dd>
                </div>
                <div>
                  <dt className="text-gray-500">Accident History:</dt>
                  <dd className="font-medium">{listing.accident_nigeria || 'None'}</dd>
                </div>
                <div>
                  <dt className="text-gray-500">Roadworthiness:</dt>
                  <dd className="font-medium">{listing.roadworthiness || 'N/A'}</dd>
                </div>
              </dl>
            </div>
          )}
        </div>

        {/* Seller Notes */}
        {listing.seller_notes && (
          <div className="mt-6">
            <h3 className="font-semibold text-gray-700 mb-2">Seller Notes</h3>
            <p className="text-gray-600 bg-gray-50 p-4 rounded">{listing.seller_notes}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListingDetail;