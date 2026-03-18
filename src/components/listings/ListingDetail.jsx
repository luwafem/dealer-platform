import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { listingService } from '../../services/listingService';
import {
  MapPin, Calendar, Gauge, Fuel, Cpu, Settings, Check, X,
  ChevronLeft, Edit, Trash2, Share2, Star, Camera, Eye, AlertCircle
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
  const hasIncremented = useRef(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

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

      if (!hasIncremented.current) {
        hasIncremented.current = true;
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
    if (!window.confirm('PERMANENTLY DELETE THIS ENTRY?')) return;
    try {
      await listingService.deleteListing(id);
      toast.success('Listing expunged');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleShare = async () => {
    const shareUrl = window.location.href;
    const shareTitle = `${listing.make} ${listing.model} ${listing.year} on AutoDealer`;
    const shareText = `Check out this ${listing.make} ${listing.model}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        // User cancelled share
        if (err.name !== 'AbortError') {
          // Fallback to clipboard
          try {
            await navigator.clipboard.writeText(shareUrl);
            toast.success('Link copied to clipboard');
          } catch (clipErr) {
            toast.error('Failed to copy link');
          }
        }
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(shareUrl);
        toast.success('Link copied to clipboard');
      } catch (err) {
        toast.error('Failed to copy link');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-[#f4f4f2]">
        <div className="w-16 h-16 border-8 border-black border-t-yellow-400 animate-spin mb-4" />
        <span className="font-black uppercase tracking-widest text-sm">Accessing Registry...</span>
      </div>
    );
  }

  if (!listing) return null;

  const isOwner = user && dealer && listing.dealer_id === dealer.id;
  const mainPhoto = selectedPhoto || (listing.photos?.[0] || null);

  const renderFeature = (condition, label) => (
    <div className={`flex items-center space-x-2 p-2 border-2 ${condition ? 'border-black bg-emerald-50' : 'border-slate-200 opacity-50'}`}>
      {condition ? (
        <Check className="w-4 h-4 text-emerald-600" strokeWidth={4} />
      ) : (
        <X className="w-4 h-4 text-red-400" strokeWidth={4} />
      )}
      <span className={`text-[10px] font-black uppercase tracking-tighter ${condition ? 'text-black' : 'text-slate-400'}`}>
        {label}
      </span>
    </div>
  );

  return (
    <div className="bg-[#f4f4f2] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Navigation */}
        <button
          onClick={() => navigate(-1)}
          className="group mb-8 flex items-center gap-2 bg-[#f4f4f2] border-2 border-black px-4 py-2 font-black uppercase text-xs hover:bg-yellow-400 transition-colors"
        >
          <ChevronLeft size={18} strokeWidth={3} />
          <span>Return to Registry</span>
        </button>

        {/* Header Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Photos Container */}
          <div className="lg:col-span-2 space-y-4">
            {/* Main photo */}
            <div className="bg-white border-2 border-black relative overflow-hidden">
              {listing.is_distress && (
                <div className="absolute top-0 left-0 z-10 bg-red-600 text-white px-6 py-2 font-black uppercase italic tracking-tighter border-b-2 border-r-2 border-black animate-pulse">
                  DISTRESS SALE
                </div>
              )}
              <div className="aspect-w-16 aspect-h-9 bg-[#f4f4f2] min-h-[400px]">
                {mainPhoto ? (
                  <img src={mainPhoto} alt="Vehicle" className="w-full h-full object-contain p-2" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center"><Camera size={64} opacity={0.1} /></div>
                )}
              </div>
            </div>

            {/* Thumbnails */}
            {listing.photos?.length > 1 && (
              <div className="grid grid-cols-6 gap-3">
                {listing.photos.map((photo, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedPhoto(photo)}
                    className={`aspect-square border-2 transition-all ${
                      selectedPhoto === photo ? 'border-yellow-400' : 'border-black hover:border-yellow-400'
                    }`}
                  >
                    <img src={photo} className="w-full h-full object-cover" alt="" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar Info */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-[#f4f4f2] border-2 border-black p-6 sticky top-8">
              <h1 className="text-3xl font-black uppercase italic tracking-tighter leading-none mb-2">
                {listing.make} {listing.model}
              </h1>
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-black text-white px-3 py-1 font-bold text-sm italic">{listing.year}</span>
                <span className="text-xs font-black uppercase text-slate-400 tracking-widest">{listing.category}</span>
              </div>

              {/* Price section */}
              <div className="border-y-2 border-black py-4 my-6">
                <p className="text-[10px] font-black uppercase text-slate-500 mb-1">Price</p>
                <div className="flex items-baseline justify-between">
                  <span className="text-4xl font-black tracking-tighter">{formatNaira(listing.price)}</span>
                  {listing.negotiable && (
                    <span className="text-[10px] font-black uppercase text-emerald-600">Negotiable</span>
                  )}
                </div>
              </div>

              {/* Dealer Block */}
              {listing.dealer && (
                <div className="mb-6 p-4 border-2 border-black bg-[#f4f4f2] relative">
                  <div className="absolute -top-3 right-4 bg-yellow-400 border-2 border-black px-2 py-0.5 text-[10px] font-black uppercase">Verified Dealer</div>
                  <p className="font-black uppercase text-sm leading-none">{listing.dealer.business_name}</p>
                  <div className="flex items-center mt-2">
                    <Star className="w-3 h-3 text-black fill-current" />
                    <span className="ml-1 text-[10px] font-black">{listing.dealer.rating || 'UNRATED'}</span>
                  </div>
                </div>
              )}

              {/* Location Tag */}
              <div className="flex items-center gap-2 font-black uppercase text-xs mb-8">
                <MapPin size={16} strokeWidth={3} className="text-black" />
                {listing.location}
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                {!isOwner && listing.status === 'available' && listing.dealer && (
                  <WhatsAppContact seller={listing.dealer} listing={listing} className="w-full py-3 bg-black text-white font-black uppercase text-xs hover:bg-yellow-400 hover:text-black transition-colors flex items-center justify-center gap-2" />
                )}

                {isOwner && (
                  <div className="space-y-3 bg-yellow-50 p-4 border-2 border-dashed border-black">
                    <p className="text-[10px] font-black uppercase mb-2">Owner Controls</p>
                    <Link to={`/edit-listing/${listing.id}`} className="w-full flex items-center justify-center gap-2 py-3 bg-black text-white font-black uppercase text-xs hover:bg-yellow-400 hover:text-black transition-colors">
                      <Edit size={16} /> Edit Entry
                    </Link>
                    {listing.status === 'available' && <MarkAsSoldButton listing={listing} />}
                    <button onClick={handleDelete} className="w-full flex items-center justify-center gap-2 py-3 border-2 border-black text-red-600 font-black uppercase text-xs hover:bg-red-600 hover:text-white transition-colors">
                      <Trash2 size={16} /> Delete Registry
                    </button>
                    <div className="flex items-center justify-center gap-2 text-[10px] font-black uppercase pt-2 border-t border-black/10">
                      <Eye size={14} /> Total Impact: {listing.views || 0} views
                    </div>
                  </div>
                )}

                {/* Share button - now functional */}
                <button
                  onClick={handleShare}
                  className="w-full py-3 border-2 border-black font-black uppercase text-xs flex items-center justify-center gap-2 hover:bg-yellow-400 transition-colors"
                >
                  <Share2 size={16} strokeWidth={3} /> Share Data
                </button>
                
                {!isOwner && <ReportButton listingId={listing.id} />}
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Specs Section */}
        <div className="mt-12 bg-[#f4f4f2] border-2 border-black p-8">
          <h2 className="text-2xl font-black uppercase italic tracking-tighter mb-8 border-b-2 border-black pb-2 inline-block">Technical Specifications</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {/* Column 1: Power */}
            <section className="space-y-6">
              <h3 className="font-black uppercase text-xs tracking-[0.2em] flex items-center gap-2 text-black">
                Powertrain
              </h3>
              <div className="space-y-3">
                <SpecRow label="Engine" value={listing.engine_type} />
                <SpecRow label="Capacity" value={listing.engine_size} />
                <SpecRow label="Transmission" value={listing.transmission} />
                <SpecRow label="Mileage" value={listing.mileage ? `${listing.mileage.toLocaleString()} KM` : null} />
                <SpecRow label="Drive Condition" value={listing.engine_condition} />
              </div>
            </section>

            {/* Column 2: Body */}
            <section className="space-y-6">
              <h3 className="font-black uppercase text-xs tracking-[0.2em] flex items-center gap-2 text-black">
                 Chassis & Interior
              </h3>
              <div className="space-y-3">
                <SpecRow label="Paintwork" value={listing.paint} />
                <SpecRow label="Oxidation/Rust" value={listing.rust || 'NONE DETECTED'} />
                <SpecRow label="Interior" value={listing.interior_condition} />
                <SpecRow label="Climate Control" value={listing.ac} />
              </div>
            </section>

            {/* Column 3: Features */}
            <section className="space-y-6">
              <h3 className="font-black uppercase text-xs tracking-[0.2em] flex items-center gap-2 text-black">
                options
              </h3>
              <div className="grid grid-cols-1 gap-2">
                {renderFeature(listing.sunroof, 'Sunroof')}
                {renderFeature(listing.leather, 'Leather Seats')}
                {renderFeature(listing.navigation, 'Navigation')}
                {renderFeature(listing.backup_camera, 'Backup Camera')}
                {renderFeature(listing.third_row, 'Third Row')}
              </div>
            </section>
          </div>

          {/* Dynamic Details divider */}
          <div className="mt-12 pt-8 border-t-2 border-black border-dashed">
            <h3 className="font-black uppercase text-sm mb-6 flex items-center gap-2">
              Detailed overview ({listing.category})
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {listing.category === 'tokunbo' ? (
                <>
                  <SpecRow label="Origin" value={listing.country_origin} />
                  <SpecRow label="Import Year" value={listing.year_imported} />
                  <SpecRow label="Customs" value={listing.customs_status} />
                  <SpecRow label="Clearance Port" value={listing.port_clearing} />
                </>
              ) : (
                <>
                  <SpecRow label="Ownership" value={listing.owner_count ? `${listing.owner_count} PREVIOUS` : null} />
                  <SpecRow label="History" value={listing.usage_history} />
                  <SpecRow label="Accidents" value={listing.accident_nigeria || 'CLEAN'} />
                  <SpecRow label="Roadworthy" value={listing.roadworthiness} />
                </>
              )}
            </div>
          </div>

          {/* Notes */}
          {listing.seller_notes && (
            <div className="mt-12 bg-black p-6">
              <h3 className="text-white font-black uppercase text-[10px] tracking-[0.3em] mb-3 opacity-50">Extra Information</h3>
              <p className="text-white font-bold italic text-lg leading-relaxed">{listing.seller_notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const SpecRow = ({ label, value }) => (
  <div className="border-b-2 border-slate-100 pb-1 flex justify-between items-end">
    <dt className="text-[10px] font-black uppercase text-slate-400 tracking-tighter">{label}:</dt>
    <dd className="font-black uppercase text-xs text-black">{value || 'NOT RECORDED'}</dd>
  </div>
);

export default ListingDetail;