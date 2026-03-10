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
  PLAN_DETAILS,
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
    is_distress: false,

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
      setFormData(prev => ({ ...prev, ...initialData }));
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
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto p-4 bg-[#f4f4f2] text-[#1a1a1a] selection:bg-yellow-300">
      {/* Basic Info */}
      <section className="bg-white border-2 border-black p-6">
        <h2 className="text-2xl font-black uppercase tracking-tighter mb-6 border-b-2 border-black pb-2">
          Basic Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold uppercase mb-1">Make *</label>
            <select
              name="make"
              value={formData.make}
              onChange={handleChange}
              className="w-full border-2 border-black p-3 font-medium bg-white focus:outline-none focus:border-yellow-400 transition-all"
              required
            >
              <option value="">Select Make</option>
              {CAR_MAKES.map(make => (
                <option key={make} value={make}>{make}</option>
              ))}
            </select>
            {errors.make && <p className="text-red-600 text-xs mt-1 font-bold">{errors.make}</p>}
          </div>
          <div>
            <label className="block text-sm font-bold uppercase mb-1">Model *</label>
            <input
              type="text"
              name="model"
              value={formData.model}
              onChange={handleChange}
              className="w-full border-2 border-black p-3 font-medium bg-white focus:outline-none focus:border-yellow-400 transition-all"
              required
            />
            {errors.model && <p className="text-red-600 text-xs mt-1 font-bold">{errors.model}</p>}
          </div>
          <div>
            <label className="block text-sm font-bold uppercase mb-1">Year *</label>
            <input
              type="number"
              name="year"
              value={formData.year}
              onChange={handleChange}
              min="1900"
              max={new Date().getFullYear() + 1}
              className="w-full border-2 border-black p-3 font-medium bg-white focus:outline-none focus:border-yellow-400 transition-all"
              required
            />
            {errors.year && <p className="text-red-600 text-xs mt-1 font-bold">{errors.year}</p>}
          </div>
          <div>
            <label className="block text-sm font-bold uppercase mb-1">Price (₦) *</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              min="0"
              step="1000"
              className="w-full border-2 border-black p-3 font-medium bg-white focus:outline-none focus:border-yellow-400 transition-all"
              required
            />
            {errors.price && <p className="text-red-600 text-xs mt-1 font-bold">{errors.price}</p>}
          </div>
          <div className="flex items-center space-x-4">
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="negotiable"
                checked={formData.negotiable}
                onChange={handleChange}
                className="w-5 h-5 border-2 border-black checked:bg-yellow-400 focus:ring-0 focus:outline-none"
              />
              <span className="ml-2 text-sm font-bold uppercase">Price Negotiable</span>
            </label>
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="is_distress"
                checked={formData.is_distress}
                onChange={handleChange}
                className="w-5 h-5 border-2 border-black checked:bg-yellow-400 focus:ring-0 focus:outline-none"
              />
              <span className="ml-2 text-sm font-bold uppercase">Distress Sale</span>
            </label>
          </div>
          <div>
            <label className="block text-sm font-bold uppercase mb-1">Location (State) *</label>
            <select
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full border-2 border-black p-3 font-medium bg-white focus:outline-none focus:border-yellow-400 transition-all"
              required
            >
              <option value="">Select State</option>
              {NIGERIAN_STATES.map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
            {errors.location && <p className="text-red-600 text-xs mt-1 font-bold">{errors.location}</p>}
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-bold uppercase mb-1">Exact Address (Optional)</label>
            <input
              type="text"
              name="exact_address"
              value={formData.exact_address}
              onChange={handleChange}
              className="w-full border-2 border-black p-3 font-medium bg-white focus:outline-none focus:border-yellow-400 transition-all"
            />
          </div>
        </div>
      </section>

      {/* Category Selection */}
      <section className="bg-white border-2 border-black p-6">
        <h2 className="text-2xl font-black uppercase tracking-tighter mb-6 border-b-2 border-black pb-2">
          Category
        </h2>
        <div className="flex flex-wrap gap-4">
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="radio"
              name="category"
              value={CAR_CATEGORIES.NIGERIAN_USED}
              checked={formData.category === CAR_CATEGORIES.NIGERIAN_USED}
              onChange={() => handleCategoryChange(CAR_CATEGORIES.NIGERIAN_USED)}
              className="w-5 h-5 border-2 border-black text-yellow-400 focus:ring-0 focus:outline-none"
            />
            <span className="ml-2 text-sm font-bold uppercase">Nigerian Used</span>
          </label>
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="radio"
              name="category"
              value={CAR_CATEGORIES.TOKUNBO}
              checked={formData.category === CAR_CATEGORIES.TOKUNBO}
              onChange={() => handleCategoryChange(CAR_CATEGORIES.TOKUNBO)}
              className="w-5 h-5 border-2 border-black text-yellow-400 focus:ring-0 focus:outline-none"
            />
            <span className="ml-2 text-sm font-bold uppercase">Tokunbo (Foreign Used)</span>
          </label>
        </div>
      </section>

      {/* Conditional: Tokunbo fields */}
      {formData.category === CAR_CATEGORIES.TOKUNBO && (
        <section className="bg-white border-2 border-black p-6">
          <h2 className="text-2xl font-black uppercase tracking-tighter mb-6 border-b-2 border-black pb-2">
            Tokunbo Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold uppercase mb-1">Country of Origin</label>
              <select
                name="country_origin"
                value={formData.country_origin}
                onChange={handleChange}
                className="w-full border-2 border-black p-3 font-medium bg-white focus:outline-none focus:border-yellow-400 transition-all"
              >
                <option value="">Select Country</option>
                {TOKUNBO_COUNTRIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold uppercase mb-1">Year of Import</label>
              <input
                type="number"
                name="year_imported"
                value={formData.year_imported}
                onChange={handleChange}
                min="1900"
                max={new Date().getFullYear()}
                className="w-full border-2 border-black p-3 font-medium bg-white focus:outline-none focus:border-yellow-400 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-bold uppercase mb-1">Customs Status</label>
              <select
                name="customs_status"
                value={formData.customs_status}
                onChange={handleChange}
                className="w-full border-2 border-black p-3 font-medium bg-white focus:outline-none focus:border-yellow-400 transition-all"
              >
                <option value="">Select</option>
                {CUSTOMS_STATUS.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold uppercase mb-1">Customs Document</label>
              <select
                name="customs_document"
                value={formData.customs_document}
                onChange={handleChange}
                className="w-full border-2 border-black p-3 font-medium bg-white focus:outline-none focus:border-yellow-400 transition-all"
              >
                <option value="">Select</option>
                {CUSTOMS_DOCUMENT.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold uppercase mb-1">Mileage at Import (km)</label>
              <input
                type="number"
                name="mileage_at_import"
                value={formData.mileage_at_import}
                onChange={handleChange}
                min="0"
                className="w-full border-2 border-black p-3 font-medium bg-white focus:outline-none focus:border-yellow-400 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-bold uppercase mb-1">Shipping Damage</label>
              <select
                name="shipping_damage"
                value={formData.shipping_damage}
                onChange={handleChange}
                className="w-full border-2 border-black p-3 font-medium bg-white focus:outline-none focus:border-yellow-400 transition-all"
              >
                {SHIPPING_DAMAGE.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold uppercase mb-1">Port of Clearing</label>
              <select
                name="port_clearing"
                value={formData.port_clearing}
                onChange={handleChange}
                className="w-full border-2 border-black p-3 font-medium bg-white focus:outline-none focus:border-yellow-400 transition-all"
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
        <section className="bg-white border-2 border-black p-6">
          <h2 className="text-2xl font-black uppercase tracking-tighter mb-6 border-b-2 border-black pb-2">
            Nigerian Used Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold uppercase mb-1">Number of Nigerian Owners</label>
              <select
                name="owner_count"
                value={formData.owner_count}
                onChange={handleChange}
                className="w-full border-2 border-black p-3 font-medium bg-white focus:outline-none focus:border-yellow-400 transition-all"
              >
                <option value="">Select</option>
                {OWNER_COUNT.map(o => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold uppercase mb-1">Usage History</label>
              <select
                name="usage_history"
                value={formData.usage_history}
                onChange={handleChange}
                className="w-full border-2 border-black p-3 font-medium bg-white focus:outline-none focus:border-yellow-400 transition-all"
              >
                <option value="">Select</option>
                {USAGE_HISTORY.map(u => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold uppercase mb-1">Service History</label>
              <select
                name="service_history"
                value={formData.service_history}
                onChange={handleChange}
                className="w-full border-2 border-black p-3 font-medium bg-white focus:outline-none focus:border-yellow-400 transition-all"
              >
                {SERVICE_HISTORY.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold uppercase mb-1">Accident History in Nigeria</label>
              <select
                name="accident_nigeria"
                value={formData.accident_nigeria}
                onChange={handleChange}
                className="w-full border-2 border-black p-3 font-medium bg-white focus:outline-none focus:border-yellow-400 transition-all"
              >
                {ACCIDENT_NIGERIA.map(a => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold uppercase mb-1">Roadworthiness</label>
              <select
                name="roadworthiness"
                value={formData.roadworthiness}
                onChange={handleChange}
                className="w-full border-2 border-black p-3 font-medium bg-white focus:outline-none focus:border-yellow-400 transition-all"
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
      <section className="bg-white border-2 border-black p-6">
        <h2 className="text-2xl font-black uppercase tracking-tighter mb-6 border-b-2 border-black pb-2">
          Engine & Transmission
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-bold uppercase mb-1">Engine Type</label>
            <select
              name="engine_type"
              value={formData.engine_type}
              onChange={handleChange}
              className="w-full border-2 border-black p-3 font-medium bg-white focus:outline-none focus:border-yellow-400 transition-all"
            >
              {ENGINE_TYPES.map(e => (
                <option key={e} value={e}>{e}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold uppercase mb-1">Engine Condition</label>
            <select
              name="engine_condition"
              value={formData.engine_condition}
              onChange={handleChange}
              className="w-full border-2 border-black p-3 font-medium bg-white focus:outline-none focus:border-yellow-400 transition-all"
            >
              {ENGINE_CONDITION.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold uppercase mb-1">Engine Size (e.g., 2.4L)</label>
            <input
              type="text"
              name="engine_size"
              value={formData.engine_size}
              onChange={handleChange}
              placeholder="e.g., 2.4L"
              className="w-full border-2 border-black p-3 font-medium bg-white focus:outline-none focus:border-yellow-400 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-bold uppercase mb-1">Transmission</label>
            <select
              name="transmission"
              value={formData.transmission}
              onChange={handleChange}
              className="w-full border-2 border-black p-3 font-medium bg-white focus:outline-none focus:border-yellow-400 transition-all"
            >
              {TRANSMISSION_TYPES.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold uppercase mb-1">Transmission Condition</label>
            <select
              name="transmission_condition"
              value={formData.transmission_condition}
              onChange={handleChange}
              className="w-full border-2 border-black p-3 font-medium bg-white focus:outline-none focus:border-yellow-400 transition-all"
            >
              {TRANSMISSION_CONDITION.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold uppercase mb-1">Mileage (km)</label>
            <input
              type="number"
              name="mileage"
              value={formData.mileage}
              onChange={handleChange}
              min="0"
              className="w-full border-2 border-black p-3 font-medium bg-white focus:outline-none focus:border-yellow-400 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-bold uppercase mb-1">Mileage Accuracy</label>
            <select
              name="mileage_accuracy"
              value={formData.mileage_accuracy}
              onChange={handleChange}
              className="w-full border-2 border-black p-3 font-medium bg-white focus:outline-none focus:border-yellow-400 transition-all"
            >
              <option value="Exact">Exact</option>
              <option value="Approximate">Approximate</option>
              <option value="Unknown">Unknown</option>
            </select>
          </div>
        </div>
      </section>

      {/* Body & Interior */}
      <section className="bg-white border-2 border-black p-6">
        <h2 className="text-2xl font-black uppercase tracking-tighter mb-6 border-b-2 border-black pb-2">
          Body & Interior
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-bold uppercase mb-1">Paint</label>
            <select
              name="paint"
              value={formData.paint}
              onChange={handleChange}
              className="w-full border-2 border-black p-3 font-medium bg-white focus:outline-none focus:border-yellow-400 transition-all"
            >
              {PAINT.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold uppercase mb-1">Rust</label>
            <select
              name="rust"
              value={formData.rust}
              onChange={handleChange}
              className="w-full border-2 border-black p-3 font-medium bg-white focus:outline-none focus:border-yellow-400 transition-all"
            >
              {RUST.map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold uppercase mb-1">Interior Condition</label>
            <select
              name="interior_condition"
              value={formData.interior_condition}
              onChange={handleChange}
              className="w-full border-2 border-black p-3 font-medium bg-white focus:outline-none focus:border-yellow-400 transition-all"
            >
              {INTERIOR_CONDITION.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold uppercase mb-1">Air Conditioning</label>
            <select
              name="ac"
              value={formData.ac}
              onChange={handleChange}
              className="w-full border-2 border-black p-3 font-medium bg-white focus:outline-none focus:border-yellow-400 transition-all"
            >
              {AC_CONDITION.map(a => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              name="sunroof"
              checked={formData.sunroof}
              onChange={handleChange}
              className="w-5 h-5 border-2 border-black checked:bg-yellow-400 focus:ring-0 focus:outline-none"
            />
            <span className="ml-2 text-sm font-bold uppercase">Sunroof</span>
          </label>
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              name="leather"
              checked={formData.leather}
              onChange={handleChange}
              className="w-5 h-5 border-2 border-black checked:bg-yellow-400 focus:ring-0 focus:outline-none"
            />
            <span className="ml-2 text-sm font-bold uppercase">Leather Seats</span>
          </label>
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              name="navigation"
              checked={formData.navigation}
              onChange={handleChange}
              className="w-5 h-5 border-2 border-black checked:bg-yellow-400 focus:ring-0 focus:outline-none"
            />
            <span className="ml-2 text-sm font-bold uppercase">Navigation</span>
          </label>
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              name="backup_camera"
              checked={formData.backup_camera}
              onChange={handleChange}
              className="w-5 h-5 border-2 border-black checked:bg-yellow-400 focus:ring-0 focus:outline-none"
            />
            <span className="ml-2 text-sm font-bold uppercase">Backup Camera</span>
          </label>
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              name="third_row"
              checked={formData.third_row}
              onChange={handleChange}
              className="w-5 h-5 border-2 border-black checked:bg-yellow-400 focus:ring-0 focus:outline-none"
            />
            <span className="ml-2 text-sm font-bold uppercase">Third Row Seats</span>
          </label>
        </div>
      </section>

      {/* Photos */}
      <section className="bg-white border-2 border-black p-6">
        <h2 className="text-2xl font-black uppercase tracking-tighter mb-6 border-b-2 border-black pb-2">
          Photos
        </h2>
        <PhotoUploader
          dealerId={dealer?.id}
          onUploadComplete={(urls) => setFormData(prev => ({ ...prev, photos: [...prev.photos, ...urls] }))}
          maxPhotos={20}
        />
      </section>

      {/* Seller Notes */}
      <section className="bg-white border-2 border-black p-6">
        <h2 className="text-2xl font-black uppercase tracking-tighter mb-6 border-b-2 border-black pb-2">
          Seller Notes
        </h2>
        <textarea
          name="seller_notes"
          rows="4"
          value={formData.seller_notes}
          onChange={handleChange}
          placeholder="Any additional information for buyers..."
          className="w-full border-2 border-black p-3 font-medium bg-white focus:outline-none focus:border-yellow-400 transition-all"
        />
      </section>

      {/* Submit Buttons */}
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="px-8 py-3 border-2 border-black bg-white font-black uppercase hover:bg-black hover:text-white transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-8 py-3 border-2 border-black bg-yellow-400 font-black uppercase hover:bg-black hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Saving...' : isEditing ? 'Update Listing' : 'Create Listing'}
        </button>
      </div>
    </form>
  );
};

export default ListingForm;