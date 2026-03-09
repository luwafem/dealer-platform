import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import PhotoUploader from './PhotoUploader';
import {
  CAR_MAKES,
  CAR_CATEGORIES,
  ENGINE_TYPES,
  TRANSMISSION_TYPES,
  TOKUNBO_COUNTRIES,
  CUSTOMS_STATUS,
  CUSTOMS_DOCUMENT,
  SHIPPING_DAMAGE,
  PORTS,
  OWNER_COUNT,
  USAGE_HISTORY,
  SERVICE_HISTORY,
  ACCIDENT_NIGERIA,
  ROADWORTHINESS,
  ENGINE_CONDITION,
  TRANSMISSION_CONDITION,
  PAINT,
  RUST,
  INTERIOR_CONDITION,
  AC_CONDITION,
  NIGERIAN_STATES,
  PLAN_DETAILS, // 👈 import plan details for max listings
} from '../../utils/constants';
import { validateListingBasic } from '../../utils/validators';
import { listingService } from '../../services/listingService';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const ListingForm = ({ initialData, isEditing = false }) => {
  const { user, dealer } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    // Basic
    make: '',
    model: '',
    year: new Date().getFullYear(),
    price: '',
    negotiable: false,
    location: '',
    exact_address: '',
    category: CAR_CATEGORIES.NIGERIAN_USED,

    // Engine & Transmission
    engine_type: 'Petrol',
    engine_condition: 'Original',
    engine_size: '',
    transmission: 'Automatic',
    transmission_condition: 'Original',
    mileage: '',
    mileage_accuracy: 'Exact',

    // Body & Interior
    paint: 'Original',
    rust: 'None',
    interior_condition: 'Good',
    ac: 'Working',
    sunroof: false,
    leather: false,
    navigation: false,
    backup_camera: false,
    third_row: false,

    // Tokunbo specific
    country_origin: '',
    year_imported: '',
    customs_status: '',
    customs_document: '',
    mileage_at_import: '',
    shipping_damage: 'None',
    port_clearing: '',

    // Nigerian Used specific
    owner_count: '',
    usage_history: '',
    service_history: 'None',
    accident_nigeria: 'None',
    roadworthiness: '',

    // Media
    photos: [],

    // Notes
    seller_notes: '',
  });

  // Load initial data if editing
  useEffect(() => {
    if (initialData) {
      setFormData({ ...formData, ...initialData });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleCategoryChange = (category) => {
    setFormData(prev => ({ ...prev, category }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || !dealer) {
      toast.error('You must be logged in');
      return;
    }

    // Basic validation
    const basicErrors = validateListingBasic(formData);
    if (Object.keys(basicErrors).length > 0) {
      setErrors(basicErrors);
      toast.error('Please fill all required fields');
      return;
    }

    // For new listings, check the dealer's active listing limit
    if (!isEditing) {
      try {
        const canCreate = await listingService.canCreateListing(dealer.id);
        if (!canCreate) {
          const plan = PLAN_DETAILS[dealer.subscription_plan || 'basic'];
          const maxListings = plan.maxListings === Infinity ? 'unlimited' : plan.maxListings;
          toast.error(`You have reached your maximum active listings (${maxListings}). Please upgrade to add more.`);
          return;
        }
      } catch (error) {
        toast.error('Unable to verify listing limit. Please try again.');
        return;
      }
    }

    setLoading(true);
    try {
      const listingData = {
        ...formData,
        dealer_id: dealer.id,
        price: parseInt(formData.price),
        year: parseInt(formData.year),
        mileage: formData.mileage ? parseInt(formData.mileage) : null,
        year_imported: formData.year_imported ? parseInt(formData.year_imported) : null,
        mileage_at_import: formData.mileage_at_import ? parseInt(formData.mileage_at_import) : null,
      };

      let result;
      if (isEditing && initialData?.id) {
        result = await listingService.updateListing(initialData.id, listingData);
        toast.success('Listing updated successfully');
      } else {
        result = await listingService.createListing(listingData);
        toast.success('Listing created successfully');
      }
      navigate(`/listings/${result.id}`);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto p-4">
      {/* Basic Info */}
      <section className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Basic Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Make *</label>
            <select
              name="make"
              value={formData.make}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            >
              <option value="">Select Make</option>
              {CAR_MAKES.map(make => (
                <option key={make} value={make}>{make}</option>
              ))}
            </select>
            {errors.make && <p className="text-red-500 text-xs mt-1">{errors.make}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Model *</label>
            <input
              type="text"
              name="model"
              value={formData.model}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
            {errors.model && <p className="text-red-500 text-xs mt-1">{errors.model}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Year *</label>
            <input
              type="number"
              name="year"
              value={formData.year}
              onChange={handleChange}
              min="1900"
              max={new Date().getFullYear() + 1}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
            {errors.year && <p className="text-red-500 text-xs mt-1">{errors.year}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Price (₦) *</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              min="0"
              step="1000"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
            {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              name="negotiable"
              id="negotiable"
              checked={formData.negotiable}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="negotiable" className="ml-2 block text-sm text-gray-900">
              Price is negotiable
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Location (State) *</label>
            <select
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            >
              <option value="">Select State</option>
              {NIGERIAN_STATES.map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
            {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Exact Address (Optional)</label>
            <input
              type="text"
              name="exact_address"
              value={formData.exact_address}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
      </section>

      {/* Category Selection */}
      <section className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Category</h2>
        <div className="flex space-x-4">
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="category"
              value={CAR_CATEGORIES.NIGERIAN_USED}
              checked={formData.category === CAR_CATEGORIES.NIGERIAN_USED}
              onChange={() => handleCategoryChange(CAR_CATEGORIES.NIGERIAN_USED)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <span className="ml-2">Nigerian Used</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="category"
              value={CAR_CATEGORIES.TOKUNBO}
              checked={formData.category === CAR_CATEGORIES.TOKUNBO}
              onChange={() => handleCategoryChange(CAR_CATEGORIES.TOKUNBO)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <span className="ml-2">Tokunbo (Foreign Used)</span>
          </label>
        </div>
      </section>

      {/* Conditional: Tokunbo fields */}
      {formData.category === CAR_CATEGORIES.TOKUNBO && (
        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Tokunbo Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Country of Origin</label>
              <select
                name="country_origin"
                value={formData.country_origin}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Select Country</option>
                {TOKUNBO_COUNTRIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Year of Import</label>
              <input
                type="number"
                name="year_imported"
                value={formData.year_imported}
                onChange={handleChange}
                min="1900"
                max={new Date().getFullYear()}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Customs Status</label>
              <select
                name="customs_status"
                value={formData.customs_status}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Select</option>
                {CUSTOMS_STATUS.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Customs Document</label>
              <select
                name="customs_document"
                value={formData.customs_document}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Select</option>
                {CUSTOMS_DOCUMENT.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Mileage at Import (km)</label>
              <input
                type="number"
                name="mileage_at_import"
                value={formData.mileage_at_import}
                onChange={handleChange}
                min="0"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Shipping Damage</label>
              <select
                name="shipping_damage"
                value={formData.shipping_damage}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                {SHIPPING_DAMAGE.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Port of Clearing</label>
              <select
                name="port_clearing"
                value={formData.port_clearing}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Select Port</option>
                {PORTS.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>
        </section>
      )}

      {/* Conditional: Nigerian Used fields */}
      {formData.category === CAR_CATEGORIES.NIGERIAN_USED && (
        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Nigerian Used Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Number of Nigerian Owners</label>
              <select
                name="owner_count"
                value={formData.owner_count}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Select</option>
                {OWNER_COUNT.map(o => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Usage History</label>
              <select
                name="usage_history"
                value={formData.usage_history}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Select</option>
                {USAGE_HISTORY.map(u => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Service History</label>
              <select
                name="service_history"
                value={formData.service_history}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                {SERVICE_HISTORY.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Accident History in Nigeria</label>
              <select
                name="accident_nigeria"
                value={formData.accident_nigeria}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                {ACCIDENT_NIGERIA.map(a => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Roadworthiness</label>
              <select
                name="roadworthiness"
                value={formData.roadworthiness}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Select</option>
                {ROADWORTHINESS.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
          </div>
        </section>
      )}

      {/* Engine & Transmission */}
      <section className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Engine & Transmission</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Engine Type</label>
            <select
              name="engine_type"
              value={formData.engine_type}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {ENGINE_TYPES.map(e => (
                <option key={e} value={e}>{e}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Engine Condition</label>
            <select
              name="engine_condition"
              value={formData.engine_condition}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {ENGINE_CONDITION.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Engine Size (e.g., 2.4L)</label>
            <input
              type="text"
              name="engine_size"
              value={formData.engine_size}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="e.g., 2.4L"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Transmission</label>
            <select
              name="transmission"
              value={formData.transmission}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {TRANSMISSION_TYPES.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Transmission Condition</label>
            <select
              name="transmission_condition"
              value={formData.transmission_condition}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {TRANSMISSION_CONDITION.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Mileage (km)</label>
            <input
              type="number"
              name="mileage"
              value={formData.mileage}
              onChange={handleChange}
              min="0"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Mileage Accuracy</label>
            <select
              name="mileage_accuracy"
              value={formData.mileage_accuracy}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="Exact">Exact</option>
              <option value="Approximate">Approximate</option>
              <option value="Unknown">Unknown</option>
            </select>
          </div>
        </div>
      </section>

      {/* Body & Interior */}
      <section className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Body & Interior</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Paint</label>
            <select
              name="paint"
              value={formData.paint}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {PAINT.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Rust</label>
            <select
              name="rust"
              value={formData.rust}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {RUST.map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Interior Condition</label>
            <select
              name="interior_condition"
              value={formData.interior_condition}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {INTERIOR_CONDITION.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Air Conditioning</label>
            <select
              name="ac"
              value={formData.ac}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {AC_CONDITION.map(a => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              name="sunroof"
              checked={formData.sunroof}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm">Sunroof</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              name="leather"
              checked={formData.leather}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm">Leather Seats</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              name="navigation"
              checked={formData.navigation}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm">Navigation</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              name="backup_camera"
              checked={formData.backup_camera}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm">Backup Camera</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              name="third_row"
              checked={formData.third_row}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm">Third Row Seats</span>
          </label>
        </div>
      </section>

      {/* Photos */}
      <section className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Photos</h2>
        <PhotoUploader
          dealerId={dealer?.id}
          onUploadComplete={(urls) => setFormData(prev => ({ ...prev, photos: [...prev.photos, ...urls] }))}
          maxPhotos={20}
        />
      </section>

      {/* Seller Notes */}
      <section className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Seller Notes</h2>
        <textarea
          name="seller_notes"
          rows="4"
          value={formData.seller_notes}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="Any additional information for buyers..."
        />
      </section>

      {/* Submit Buttons */}
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading ? 'Saving...' : isEditing ? 'Update Listing' : 'Create Listing'}
        </button>
      </div>
    </form>
  );
};

export default ListingForm;