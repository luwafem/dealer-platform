import React, { useState, useEffect } from 'react';
import { X, ChevronDown, ChevronUp } from 'lucide-react';
import { useSearch } from '../../context/SearchContext';
import FilterSection from './FilterSection';
import Select from 'react-select';
import {
  CAR_MAKES,
  ENGINE_TYPES,
  TRANSMISSION_TYPES,
  NIGERIAN_STATES,
  CAR_CATEGORIES,
  DEAL_BREAKERS,
  MUST_HAVES,
} from '../../utils/constants';

const AdvancedFilters = ({ isOpen, onClose }) => {
  const { filters, setFilters, executeSearch } = useSearch();
  const [localFilters, setLocalFilters] = useState(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleChange = (key, value) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleCheckboxChange = (key, checked) => {
    setLocalFilters(prev => ({ ...prev, [key]: checked }));
  };

  const handleApply = () => {
    setFilters(localFilters);
    executeSearch(localFilters);
    onClose();
  };

  const handleReset = () => {
    const resetFilters = {
      make: '',
      model: '',
      minYear: '',
      maxYear: '',
      minPrice: '',
      maxPrice: '',
      location: '',
      category: '',
      distressOnly: false, // 👈 new filter
      dealBreakers: [],
      mustHaves: [],
      trim: '',
      engineType: '',
      transmission: '',
      mileageMax: '',
      accidentHistory: '',
      customsStatus: '',
    };
    setLocalFilters(resetFilters);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl transform transition-transform">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Advanced Filters</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X size={20} />
          </button>
        </div>

        <div className="p-4 overflow-y-auto h-full pb-24">
          {/* Basic Filters */}
          <FilterSection title="Basic" defaultOpen>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Make</label>
                <select
                  value={localFilters.make}
                  onChange={(e) => handleChange('make', e.target.value)}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Any Make</option>
                  {CAR_MAKES.map(make => (
                    <option key={make} value={make}>{make}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
                <input
                  type="text"
                  value={localFilters.model}
                  onChange={(e) => handleChange('model', e.target.value)}
                  placeholder="e.g., Camry"
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Min Year</label>
                  <input
                    type="number"
                    value={localFilters.minYear}
                    onChange={(e) => handleChange('minYear', e.target.value)}
                    placeholder="2000"
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Year</label>
                  <input
                    type="number"
                    value={localFilters.maxYear}
                    onChange={(e) => handleChange('maxYear', e.target.value)}
                    placeholder="2024"
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Min Price (₦)</label>
                  <input
                    type="number"
                    value={localFilters.minPrice}
                    onChange={(e) => handleChange('minPrice', e.target.value)}
                    placeholder="500000"
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Price (₦)</label>
                  <input
                    type="number"
                    value={localFilters.maxPrice}
                    onChange={(e) => handleChange('maxPrice', e.target.value)}
                    placeholder="5000000"
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <select
                  value={localFilters.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Any Location</option>
                  {NIGERIAN_STATES.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={localFilters.category}
                  onChange={(e) => handleChange('category', e.target.value)}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">All</option>
                  <option value={CAR_CATEGORIES.NIGERIAN_USED}>Nigerian Used</option>
                  <option value={CAR_CATEGORIES.TOKUNBO}>Tokunbo</option>
                </select>
              </div>

              {/* 👇 Distress Only Checkbox */}
              <div className="flex items-center pt-2">
                <input
                  type="checkbox"
                  id="distressOnly"
                  checked={localFilters.distressOnly || false}
                  onChange={(e) => handleCheckboxChange('distressOnly', e.target.checked)}
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                />
                <label htmlFor="distressOnly" className="ml-2 block text-sm text-gray-900">
                  🚨 Distress sales only (urgent)
                </label>
              </div>
            </div>
          </FilterSection>

          {/* Deal Breakers (Exclude) */}
          <FilterSection title="Deal Breakers (Exclude)">
            <Select
              isMulti
              options={DEAL_BREAKERS.map(option => ({ value: option, label: option.replace(/_/g, ' ') }))}
              value={localFilters.dealBreakers.map(val => ({ value: val, label: val.replace(/_/g, ' ') }))}
              onChange={(selected) => handleChange('dealBreakers', selected.map(s => s.value))}
              className="react-select-container"
              classNamePrefix="react-select"
              placeholder="Select deal breakers..."
            />
          </FilterSection>

          {/* Must-Haves (Require) */}
          <FilterSection title="Must-Haves">
            <Select
              isMulti
              options={MUST_HAVES.map(option => ({ value: option, label: option.replace(/_/g, ' ') }))}
              value={localFilters.mustHaves.map(val => ({ value: val, label: val.replace(/_/g, ' ') }))}
              onChange={(selected) => handleChange('mustHaves', selected.map(s => s.value))}
              className="react-select-container"
              classNamePrefix="react-select"
              placeholder="Select must-haves..."
            />
          </FilterSection>

          {/* Engine & Transmission */}
          <FilterSection title="Engine & Transmission">
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Engine Type</label>
                <select
                  value={localFilters.engineType}
                  onChange={(e) => handleChange('engineType', e.target.value)}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Any</option>
                  {ENGINE_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Transmission</label>
                <select
                  value={localFilters.transmission}
                  onChange={(e) => handleChange('transmission', e.target.value)}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Any</option>
                  {TRANSMISSION_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Mileage (km)</label>
                <input
                  type="number"
                  value={localFilters.mileageMax}
                  onChange={(e) => handleChange('mileageMax', e.target.value)}
                  placeholder="100000"
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
          </FilterSection>

          {/* Accident History */}
          <FilterSection title="Accident History">
            <select
              value={localFilters.accidentHistory}
              onChange={(e) => handleChange('accidentHistory', e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Any</option>
              <option value="None">None</option>
              <option value="Minor">Minor</option>
              <option value="Major">Major</option>
              <option value="Wreck rebuild">Wreck rebuild</option>
            </select>
          </FilterSection>

          {/* Customs Status (Tokunbo) */}
          <FilterSection title="Customs Status (Tokunbo)">
            <select
              value={localFilters.customsStatus}
              onChange={(e) => handleChange('customsStatus', e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Any</option>
              <option value="Paid">Paid</option>
              <option value="Partially paid">Partially paid</option>
              <option value="Not paid">Not paid</option>
              <option value="Under dispute">Under dispute</option>
            </select>
          </FilterSection>
        </div>

        <div className="absolute bottom-0 left-0 right-0 border-t bg-white p-4 flex space-x-3">
          <button
            onClick={handleReset}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Reset
          </button>
          <button
            onClick={handleApply}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdvancedFilters;