import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { dealerService } from '../services/dealerService';
import { ratingService } from '../services/ratingService';
import { storageService } from '../services/storageService';
import { 
  Star, MapPin, Phone, Mail, Calendar, Edit2, Save, X, Camera, 
  Globe, Instagram, Twitter, Facebook, Briefcase, Calendar as CalendarIcon 
} from 'lucide-react';
import { formatDate } from '../utils/formatters';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const { dealer, refreshDealer } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [formData, setFormData] = useState({
    business_name: dealer?.business_name || '',
    phone: dealer?.phone || '',
    alternate_phone: dealer?.alternate_phone || '',
    location: dealer?.location || '',
    address: dealer?.address || '',
    bank_name: dealer?.bank_name || '',
    bank_account_name: dealer?.bank_account_name || '',
    bank_account_number: dealer?.bank_account_number || '',
    business_description: dealer?.business_description || '',
    established_year: dealer?.established_year || '',
    business_type: dealer?.business_type || '',
    website: dealer?.website || '',
    instagram: dealer?.instagram || '',
    twitter: dealer?.twitter || '',
    facebook: dealer?.facebook || '',
    avatar_url: dealer?.avatar_url || '',
  });
  const [loading, setLoading] = useState(false);
  const [trustScore, setTrustScore] = useState(null);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (dealer?.id) {
      ratingService.computeTrustScore(dealer.id)
        .then(setTrustScore)
        .catch(console.error);
    }
  }, [dealer]);

  if (!dealer) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result);
    };
    reader.readAsDataURL(file);

    // Upload
    setUploadingAvatar(true);
    try {
      const url = await storageService.uploadAvatar(file, dealer.id);
      setFormData(prev => ({ ...prev, avatar_url: url }));
      toast.success('Avatar uploaded');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await dealerService.updateDealer(dealer.id, formData);
      await refreshDealer();
      toast.success('Profile updated successfully');
      setIsEditing(false);
      setAvatarPreview(null);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      business_name: dealer.business_name || '',
      phone: dealer.phone || '',
      alternate_phone: dealer.alternate_phone || '',
      location: dealer.location || '',
      address: dealer.address || '',
      bank_name: dealer.bank_name || '',
      bank_account_name: dealer.bank_account_name || '',
      bank_account_number: dealer.bank_account_number || '',
      business_description: dealer.business_description || '',
      established_year: dealer.established_year || '',
      business_type: dealer.business_type || '',
      website: dealer.website || '',
      instagram: dealer.instagram || '',
      twitter: dealer.twitter || '',
      facebook: dealer.facebook || '',
      avatar_url: dealer.avatar_url || '',
    });
    setAvatarPreview(null);
    setIsEditing(false);
  };

  const avatarSrc = avatarPreview || formData.avatar_url || null;

  return (
    <div className="min-h-screen bg-[#f4f4f2] text-[#1a1a1a] selection:bg-yellow-300 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8 border-b-2 border-black pb-4">
          <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter leading-none">
            Profile
          </h1>
          <p className="text-lg font-medium mt-2 border-l-4 border-black pl-4">
            Manage your dealer profile
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-white border-2 border-black">
          {/* Top bar */}
          <div className="bg-black h-16 relative flex items-center justify-end px-6">
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="border-2 border-black bg-white text-black px-4 py-2 font-black uppercase text-sm hover:bg-yellow-400 hover:text-black transition-colors flex items-center"
              >
                <Edit2 size={16} className="mr-2" strokeWidth={2} />
                Edit Profile
              </button>
            )}
          </div>

          {/* Avatar section */}
          <div className="px-6 pb-6">
            <div className="flex justify-center -mt-12">
              <div className="relative">
                <div className="w-24 h-24 bg-white border-2 border-black flex items-center justify-center overflow-hidden">
                  {avatarSrc ? (
                    <img src={avatarSrc} alt={dealer.business_name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-3xl font-black text-black">
                      {dealer.business_name?.charAt(0)}
                    </span>
                  )}
                </div>
                {isEditing && (
                  <label
                    htmlFor="avatar-upload"
                    className="absolute bottom-0 right-0 border-2 border-black bg-white text-black p-1 cursor-pointer hover:bg-yellow-400 transition-colors"
                  >
                    <Camera size={16} strokeWidth={2} />
                    <input
                      type="file"
                      id="avatar-upload"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                      disabled={uploadingAvatar}
                    />
                  </label>
                )}
              </div>
            </div>

            {!isEditing ? (
              // View Mode
              <>
                <h1 className="text-2xl font-black uppercase tracking-tighter text-center mt-4">
                  {dealer.business_name}
                </h1>
                <div className="flex justify-center items-center mt-2 space-x-1">
                  {[1,2,3,4,5].map((star) => (
                    <Star
                      key={star}
                      size={20}
                      strokeWidth={2}
                      className={star <= (dealer.rating || 0) ? 'text-black fill-current' : 'text-gray-300'}
                    />
                  ))}
                  <span className="ml-2 font-bold">({dealer.deals_count || 0} deals)</span>
                </div>

                {/* Trust Score */}
                {trustScore !== null && (
                  <div className="mt-4 p-3 border-2 border-black bg-white">
                    <div className="flex justify-between items-center">
                      <span className="font-black uppercase text-sm">Trust Score</span>
                      <span className="text-lg font-black">{trustScore}%</span>
                    </div>
                    <div className="w-full bg-gray-300 h-4 mt-1 border-2 border-black">
                      <div
                        className="bg-black h-full"
                        style={{ width: `${trustScore}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Business Description */}
                {dealer.business_description && (
                  <div className="mt-4 p-3 border-2 border-black bg-white">
                    <p className="font-bold">{dealer.business_description}</p>
                  </div>
                )}

                <div className="mt-6 space-y-3">
                  <div className="flex items-center font-bold">
                    <MapPin size={18} className="mr-3" strokeWidth={2} />
                    <span>{dealer.location || 'Location not set'}</span>
                  </div>
                  {dealer.address && (
                    <div className="flex items-center font-bold">
                      <MapPin size={18} className="mr-3" strokeWidth={2} />
                      <span>{dealer.address}</span>
                    </div>
                  )}
                  <div className="flex items-center font-bold">
                    <Phone size={18} className="mr-3" strokeWidth={2} />
                    <span>{dealer.phone}</span>
                  </div>
                  {dealer.alternate_phone && (
                    <div className="flex items-center font-bold">
                      <Phone size={18} className="mr-3" strokeWidth={2} />
                      <span>{dealer.alternate_phone}</span>
                    </div>
                  )}
                  <div className="flex items-center font-bold">
                    <Mail size={18} className="mr-3" strokeWidth={2} />
                    <span>{dealer.email}</span>
                  </div>

                  {/* Business details */}
                  {dealer.business_type && (
                    <div className="flex items-center font-bold">
                      <Briefcase size={18} className="mr-3" strokeWidth={2} />
                      <span>{dealer.business_type}</span>
                    </div>
                  )}
                  {dealer.established_year && (
                    <div className="flex items-center font-bold">
                      <CalendarIcon size={18} className="mr-3" strokeWidth={2} />
                      <span>Est. {dealer.established_year}</span>
                    </div>
                  )}

                  {/* Social links */}
                  <div className="flex space-x-4 mt-2">
                    {dealer.website && (
                      <a href={dealer.website} target="_blank" rel="noopener noreferrer" className="border-2 border-black p-1 hover:bg-yellow-400 transition-colors">
                        <Globe size={20} strokeWidth={2} />
                      </a>
                    )}
                    {dealer.instagram && (
                      <a href={`https://instagram.com/${dealer.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="border-2 border-black p-1 hover:bg-yellow-400 transition-colors">
                        <Instagram size={20} strokeWidth={2} />
                      </a>
                    )}
                    {dealer.twitter && (
                      <a href={`https://twitter.com/${dealer.twitter.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="border-2 border-black p-1 hover:bg-yellow-400 transition-colors">
                        <Twitter size={20} strokeWidth={2} />
                      </a>
                    )}
                    {dealer.facebook && (
                      <a href={`https://facebook.com/${dealer.facebook}`} target="_blank" rel="noopener noreferrer" className="border-2 border-black p-1 hover:bg-yellow-400 transition-colors">
                        <Facebook size={20} strokeWidth={2} />
                      </a>
                    )}
                  </div>

                  <div className="flex items-center font-bold">
                    <Calendar size={18} className="mr-3" strokeWidth={2} />
                    <span>Joined {formatDate(dealer.joined_date)}</span>
                  </div>
                </div>

                {dealer.verified && (
                  <div className="mt-4 inline-flex items-center border-2 border-black bg-black text-white px-3 py-1 font-black uppercase text-xs">
                    <Star size={14} className="mr-1" strokeWidth={2} /> Verified Dealer
                  </div>
                )}
              </>
            ) : (
              // Edit Mode
              <form onSubmit={handleSubmit} className="mt-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-black uppercase mb-1">Business Name</label>
                    <input
                      type="text"
                      name="business_name"
                      value={formData.business_name}
                      onChange={handleChange}
                      required
                      className="w-full border-2 border-black p-3 font-medium bg-white focus:outline-none focus:border-yellow-400 transition-all"
                    />
                  </div>

                  {/* Business Description */}
                  <div>
                    <label className="block text-sm font-black uppercase mb-1">Business Description</label>
                    <textarea
                      name="business_description"
                      rows="3"
                      value={formData.business_description}
                      onChange={handleChange}
                      className="w-full border-2 border-black p-3 font-medium bg-white focus:outline-none focus:border-yellow-400 transition-all"
                      placeholder="Tell buyers about your business..."
                    />
                  </div>

                  {/* Business Type */}
                  <div>
                    <label className="block text-sm font-black uppercase mb-1">Business Type</label>
                    <select
                      name="business_type"
                      value={formData.business_type}
                      onChange={handleChange}
                      className="w-full border-2 border-black p-3 font-medium bg-white focus:outline-none focus:border-yellow-400 transition-all"
                    >
                      <option value="">Select type</option>
                      <option value="Dealership">Dealership</option>
                      <option value="Car Mart">Car Mart</option>
                      <option value="Individual">Individual</option>
                      <option value="Fleet Owner">Fleet Owner</option>
                      <option value="Importer">Importer</option>
                    </select>
                  </div>

                  {/* Established Year */}
                  <div>
                    <label className="block text-sm font-black uppercase mb-1">Year Established</label>
                    <input
                      type="number"
                      name="established_year"
                      value={formData.established_year}
                      onChange={handleChange}
                      min="1900"
                      max={new Date().getFullYear()}
                      className="w-full border-2 border-black p-3 font-medium bg-white focus:outline-none focus:border-yellow-400 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-black uppercase mb-1">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full border-2 border-black p-3 font-medium bg-white focus:outline-none focus:border-yellow-400 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-black uppercase mb-1">Alternate Phone</label>
                    <input
                      type="tel"
                      name="alternate_phone"
                      value={formData.alternate_phone}
                      onChange={handleChange}
                      className="w-full border-2 border-black p-3 font-medium bg-white focus:outline-none focus:border-yellow-400 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-black uppercase mb-1">Location (State)</label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="w-full border-2 border-black p-3 font-medium bg-white focus:outline-none focus:border-yellow-400 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-black uppercase mb-1">Address</label>
                    <textarea
                      name="address"
                      rows="2"
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full border-2 border-black p-3 font-medium bg-white focus:outline-none focus:border-yellow-400 transition-all"
                    />
                  </div>

                  {/* Social Links */}
                  <h3 className="text-xl font-black uppercase tracking-tighter pt-4 border-t-2 border-black">
                    Social Links
                  </h3>
                  <div>
                    <label className="block text-sm font-black uppercase mb-1">Website</label>
                    <input
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      placeholder="https://..."
                      className="w-full border-2 border-black p-3 font-medium bg-white focus:outline-none focus:border-yellow-400 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-black uppercase mb-1">Instagram</label>
                    <input
                      type="text"
                      name="instagram"
                      value={formData.instagram}
                      onChange={handleChange}
                      placeholder="@username or full URL"
                      className="w-full border-2 border-black p-3 font-medium bg-white focus:outline-none focus:border-yellow-400 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-black uppercase mb-1">Twitter</label>
                    <input
                      type="text"
                      name="twitter"
                      value={formData.twitter}
                      onChange={handleChange}
                      placeholder="@username or full URL"
                      className="w-full border-2 border-black p-3 font-medium bg-white focus:outline-none focus:border-yellow-400 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-black uppercase mb-1">Facebook</label>
                    <input
                      type="text"
                      name="facebook"
                      value={formData.facebook}
                      onChange={handleChange}
                      placeholder="username or full URL"
                      className="w-full border-2 border-black p-3 font-medium bg-white focus:outline-none focus:border-yellow-400 transition-all"
                    />
                  </div>

                  {/* Bank details (optional) */}
                  <h3 className="text-xl font-black uppercase tracking-tighter pt-4 border-t-2 border-black">
                    Bank Details (for payouts)
                  </h3>
                  <div>
                    <label className="block text-sm font-black uppercase mb-1">Bank Name</label>
                    <input
                      type="text"
                      name="bank_name"
                      value={formData.bank_name}
                      onChange={handleChange}
                      className="w-full border-2 border-black p-3 font-medium bg-white focus:outline-none focus:border-yellow-400 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-black uppercase mb-1">Account Name</label>
                    <input
                      type="text"
                      name="bank_account_name"
                      value={formData.bank_account_name}
                      onChange={handleChange}
                      className="w-full border-2 border-black p-3 font-medium bg-white focus:outline-none focus:border-yellow-400 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-black uppercase mb-1">Account Number</label>
                    <input
                      type="text"
                      name="bank_account_number"
                      value={formData.bank_account_number}
                      onChange={handleChange}
                      className="w-full border-2 border-black p-3 font-medium bg-white focus:outline-none focus:border-yellow-400 transition-all"
                    />
                  </div>
                </div>

                <div className="mt-6 flex space-x-3">
                  <button
                    type="submit"
                    disabled={loading || uploadingAvatar}
                    className="flex-1 border-2 border-black bg-yellow-400 text-black px-4 py-2 font-black uppercase hover:bg-black hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    <Save size={18} className="mr-2" strokeWidth={2} />
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex-1 border-2 border-black bg-white text-black px-4 py-2 font-black uppercase hover:bg-black hover:text-white transition-colors flex items-center justify-center"
                  >
                    <X size={18} className="mr-2" strokeWidth={2} />
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;