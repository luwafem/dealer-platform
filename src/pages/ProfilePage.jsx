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
    // New fields
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
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="bg-blue-600 h-32 relative">
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="absolute top-4 right-4 bg-white text-blue-600 px-3 py-1 rounded-md text-sm font-medium hover:bg-gray-100 flex items-center"
            >
              <Edit2 size={16} className="mr-1" />
              Edit Profile
            </button>
          )}
        </div>

        <div className="px-6 pb-6">
          <div className="flex justify-center -mt-16">
            <div className="relative">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center border-4 border-white shadow overflow-hidden">
                {avatarSrc ? (
                  <img src={avatarSrc} alt={dealer.business_name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl font-bold text-blue-600">
                    {dealer.business_name?.charAt(0)}
                  </span>
                )}
              </div>
              {isEditing && (
                <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 bg-blue-600 text-white p-1 rounded-full cursor-pointer hover:bg-blue-700">
                  <Camera size={16} />
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
              <h1 className="text-2xl font-bold text-center mt-4">{dealer.business_name}</h1>
              <div className="flex justify-center items-center mt-2 space-x-1">
                {[1,2,3,4,5].map((star) => (
                  <Star key={star} className={`w-5 h-5 ${star <= (dealer.rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                ))}
                <span className="ml-2 text-gray-600">({dealer.deals_count || 0} deals)</span>
              </div>

              {/* Trust Score */}
              {trustScore !== null && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-blue-800">Trust Score</span>
                    <span className="text-lg font-bold text-blue-600">{trustScore}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${trustScore}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Business Description */}
              {dealer.business_description && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-gray-700">{dealer.business_description}</p>
                </div>
              )}

              <div className="mt-6 space-y-3">
                <div className="flex items-center text-gray-700">
                  <MapPin size={18} className="mr-3 text-gray-400" />
                  <span>{dealer.location || 'Location not set'}</span>
                </div>
                {dealer.address && (
                  <div className="flex items-center text-gray-700">
                    <MapPin size={18} className="mr-3 text-gray-400" />
                    <span>{dealer.address}</span>
                  </div>
                )}
                <div className="flex items-center text-gray-700">
                  <Phone size={18} className="mr-3 text-gray-400" />
                  <span>{dealer.phone}</span>
                </div>
                {dealer.alternate_phone && (
                  <div className="flex items-center text-gray-700">
                    <Phone size={18} className="mr-3 text-gray-400" />
                    <span>{dealer.alternate_phone}</span>
                  </div>
                )}
                <div className="flex items-center text-gray-700">
                  <Mail size={18} className="mr-3 text-gray-400" />
                  <span>{dealer.email}</span>
                </div>

                {/* Business details */}
                {dealer.business_type && (
                  <div className="flex items-center text-gray-700">
                    <Briefcase size={18} className="mr-3 text-gray-400" />
                    <span>{dealer.business_type}</span>
                  </div>
                )}
                {dealer.established_year && (
                  <div className="flex items-center text-gray-700">
                    <CalendarIcon size={18} className="mr-3 text-gray-400" />
                    <span>Est. {dealer.established_year}</span>
                  </div>
                )}

                {/* Social links */}
                <div className="flex space-x-4 mt-2">
                  {dealer.website && (
                    <a href={dealer.website} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-600">
                      <Globe size={20} />
                    </a>
                  )}
                  {dealer.instagram && (
                    <a href={`https://instagram.com/${dealer.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-pink-600">
                      <Instagram size={20} />
                    </a>
                  )}
                  {dealer.twitter && (
                    <a href={`https://twitter.com/${dealer.twitter.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-400">
                      <Twitter size={20} />
                    </a>
                  )}
                  {dealer.facebook && (
                    <a href={`https://facebook.com/${dealer.facebook}`} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-700">
                      <Facebook size={20} />
                    </a>
                  )}
                </div>

                <div className="flex items-center text-gray-700">
                  <Calendar size={18} className="mr-3 text-gray-400" />
                  <span>Joined {formatDate(dealer.joined_date)}</span>
                </div>
              </div>

              {dealer.verified && (
                <div className="mt-4 inline-flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full">
                  <Star size={14} className="mr-1" /> Verified Dealer
                </div>
              )}
            </>
          ) : (
            // Edit Mode
            <form onSubmit={handleSubmit} className="mt-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Business Name</label>
                  <input
                    type="text"
                    name="business_name"
                    value={formData.business_name}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                {/* Business Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Business Description</label>
                  <textarea
                    name="business_description"
                    rows="3"
                    value={formData.business_description}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Tell buyers about your business..."
                  />
                </div>

                {/* Business Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Business Type</label>
                  <select
                    name="business_type"
                    value={formData.business_type}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
                  <label className="block text-sm font-medium text-gray-700">Year Established</label>
                  <input
                    type="number"
                    name="established_year"
                    value={formData.established_year}
                    onChange={handleChange}
                    min="1900"
                    max={new Date().getFullYear()}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Alternate Phone</label>
                  <input
                    type="tel"
                    name="alternate_phone"
                    value={formData.alternate_phone}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Location (State)</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Address</label>
                  <textarea
                    name="address"
                    rows="2"
                    value={formData.address}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                {/* Social Links */}
                <h3 className="text-lg font-medium pt-4 border-t">Social Links</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Website</label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    placeholder="https://..."
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Instagram</label>
                  <input
                    type="text"
                    name="instagram"
                    value={formData.instagram}
                    onChange={handleChange}
                    placeholder="@username or full URL"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Twitter</label>
                  <input
                    type="text"
                    name="twitter"
                    value={formData.twitter}
                    onChange={handleChange}
                    placeholder="@username or full URL"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Facebook</label>
                  <input
                    type="text"
                    name="facebook"
                    value={formData.facebook}
                    onChange={handleChange}
                    placeholder="username or full URL"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                {/* Bank details (optional) */}
                <h3 className="text-lg font-medium pt-4 border-t">Bank Details (for payouts)</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Bank Name</label>
                  <input
                    type="text"
                    name="bank_name"
                    value={formData.bank_name}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Account Name</label>
                  <input
                    type="text"
                    name="bank_account_name"
                    value={formData.bank_account_name}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Account Number</label>
                  <input
                    type="text"
                    name="bank_account_number"
                    value={formData.bank_account_number}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="mt-6 flex space-x-3">
                <button
                  type="submit"
                  disabled={loading || uploadingAvatar}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center"
                >
                  <Save size={18} className="mr-2" />
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 flex items-center justify-center"
                >
                  <X size={18} className="mr-2" />
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;