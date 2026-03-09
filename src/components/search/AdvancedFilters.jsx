import React, { useState, useEffect } from 'react';
import { X, RotateCcw, Check } from 'lucide-react';
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
      distressOnly: false,
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

  // Neo-Brutalist Select Styles
  const selectStyles = {
    control: (base) => ({
      ...base,
      borderRadius: '0px',
      border: '2px solid black',
      boxShadow: 'none',
      '&:hover': { border: '2px solid black' },
      padding: '2px',
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected ? 'black' : state.isFocused ? '#facc15' : 'white',
      color: state.isSelected ? 'white' : 'black',
      fontWeight: '800',
      textTransform: 'uppercase',
      fontSize: '11px',
    }),
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Dimmed Overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={onClose} />
      
      {/* Panel */}
      <div className="relative h-full w-full max-w-md bg-[#f4f4f2] border-l-4 border-black shadow-[-8px_0px_0px_0px_rgba(0,0,0,1)] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b-4 border-black bg-white">
          <h2 className="text-xl font-black uppercase tracking-tighter italic">Advanced Filters</h2>
          <button onClick={onClose} className="p-2 border-2 border-black hover:bg-yellow-400 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none">
            <X size={20} strokeWidth={3} />
          </button>
        </div>

        {/* Scrollable Area */}
        <div className="p-6 overflow-y-auto h-full pb-32 space-y-6">
          
          {/* Basic Filters */}
          <FilterSection title="Vehicle Core" defaultOpen>
            <div className="space-y-4 pt-2">
              <InputGroup label="Make">
                <select
                  value={localFilters.make}
                  onChange={(e) => handleChange('make', e.target.value)}
                  className="brutalist-select"
                >
                  <option value="">Any Make</option>
                  {CAR_MAKES.map(make => (
                    <option key={make} value={make}>{make}</option>
                  ))}
                </select>
              </InputGroup>

              <InputGroup label="Model">
                <input
                  type="text"
                  value={localFilters.model}
                  onChange={(e) => handleChange('model', e.target.value)}
                  placeholder="e.g., Camry"
                  className="brutalist-input"
                />
              </InputGroup>

              <div className="grid grid-cols-2 gap-4">
                <InputGroup label="Min Year">
                  <input
                    type="number"
                    value={localFilters.minYear}
                    onChange={(e) => handleChange('minYear', e.target.value)}
                    placeholder="2000"
                    className="brutalist-input"
                  />
                </InputGroup>
                <InputGroup label="Max Year">
                  <input
                    type="number"
                    value={localFilters.maxYear}
                    onChange={(e) => handleChange('maxYear', e.target.value)}
                    placeholder="2024"
                    className="brutalist-input"
                  />
                </InputGroup>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <InputGroup label="Min Price (₦)">
                  <input
                    type="number"
                    value={localFilters.minPrice}
                    onChange={(e) => handleChange('minPrice', e.target.value)}
                    placeholder="500000"
                    className="brutalist-input"
                  />
                </InputGroup>
                <InputGroup label="Max Price (₦)">
                  <input
                    type="number"
                    value={localFilters.maxPrice}
                    onChange={(e) => handleChange('maxPrice', e.target.value)}
                    placeholder="5000000"
                    className="brutalist-input"
                  />
                </InputGroup>
              </div>

              <InputGroup label="Location">
                <select
                  value={localFilters.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  className="brutalist-select"
                >
                  <option value="">Any Location</option>
                  {NIGERIAN_STATES.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </InputGroup>

              <InputGroup label="Category">
                <select
                  value={localFilters.category}
                  onChange={(e) => handleChange('category', e.target.value)}
                  className="brutalist-select"
                >
                  <option value="">All</option>
                  <option value={CAR_CATEGORIES.NIGERIAN_USED}>Nigerian Used</option>
                  <option value={CAR_CATEGORIES.TOKUNBO}>Tokunbo</option>
                </select>
              </InputGroup>

              {/* Distress Only Checkbox */}
              <div 
                className={`flex items-center p-3 border-2 border-black cursor-pointer transition-colors ${localFilters.distressOnly ? 'bg-red-500 text-white' : 'bg-white'}`}
                onClick={() => handleCheckboxChange('distressOnly', !localFilters.distressOnly)}
              >
                <div className={`w-5 h-5 border-2 border-black mr-3 flex items-center justify-center bg-white`}>
                    {localFilters.distressOnly && <Check size={14} className="text-black" strokeWidth={4} />}
                </div>
                <label className="text-xs font-black uppercase tracking-tight cursor-pointer">
                  🚨 Distress sales only (urgent)
                </label>
              </div>
            </div>
          </FilterSection>

          {/* Deal Breakers */}
          <FilterSection title="Exclusion List">
            <div className="pt-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1 block">Deal Breakers (Exclude)</label>
                <Select
                  isMulti
                  styles={selectStyles}
                  options={DEAL_BREAKERS.map(option => ({ value: option, label: option.replace(/_/g, ' ') }))}
                  value={localFilters.dealBreakers.map(val => ({ value: val, label: val.replace(/_/g, ' ') }))}
                  onChange={(selected) => handleChange('dealBreakers', selected.map(s => s.value))}
                  placeholder="Select deal breakers..."
                />
            </div>
          </FilterSection>

          {/* Must-Haves */}
          <FilterSection title="Requirements">
            <div className="pt-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1 block">Must-Haves (Require)</label>
                <Select
                  isMulti
                  styles={selectStyles}
                  options={MUST_HAVES.map(option => ({ value: option, label: option.replace(/_/g, ' ') }))}
                  value={localFilters.mustHaves.map(val => ({ value: val, label: val.replace(/_/g, ' ') }))}
                  onChange={(selected) => handleChange('mustHaves', selected.map(s => s.value))}
                  placeholder="Select must-haves..."
                />
            </div>
          </FilterSection>

          {/* Engine & Transmission */}
          <FilterSection title="Mechanicals">
            <div className="space-y-4 pt-2">
              <InputGroup label="Engine Type">
                <select
                  value={localFilters.engineType}
                  onChange={(e) => handleChange('engineType', e.target.value)}
                  className="brutalist-select"
                >
                  <option value="">Any</option>
                  {ENGINE_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </InputGroup>
              <InputGroup label="Transmission">
                <select
                  value={localFilters.transmission}
                  onChange={(e) => handleChange('transmission', e.target.value)}
                  className="brutalist-select"
                >
                  <option value="">Any</option>
                  {TRANSMISSION_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </InputGroup>
              <InputGroup label="Max Mileage (km)">
                <input
                  type="number"
                  value={localFilters.mileageMax}
                  onChange={(e) => handleChange('mileageMax', e.target.value)}
                  placeholder="100000"
                  className="brutalist-input"
                />
              </InputGroup>
            </div>
          </FilterSection>

          {/* Accident History */}
          <FilterSection title="History">
            <div className="pt-2">
                <InputGroup label="Accident Record">
                    <select
                      value={localFilters.accidentHistory}
                      onChange={(e) => handleChange('accidentHistory', e.target.value)}
                      className="brutalist-select"
                    >
                      <option value="">Any</option>
                      <option value="None">None</option>
                      <option value="Minor">Minor</option>
                      <option value="Major">Major</option>
                      <option value="Wreck rebuild">Wreck rebuild</option>
                    </select>
                </InputGroup>
            </div>
          </FilterSection>

          {/* Customs Status */}
          <FilterSection title="Documentation">
            <div className="pt-2 pb-6">
                <InputGroup label="Customs Status (Tokunbo)">
                    <select
                      value={localFilters.customsStatus}
                      onChange={(e) => handleChange('customsStatus', e.target.value)}
                      className="brutalist-select"
                    >
                      <option value="">Any</option>
                      <option value="Paid">Paid</option>
                      <option value="Partially paid">Partially paid</option>
                      <option value="Not paid">Not paid</option>
                      <option value="Under dispute">Under dispute</option>
                    </select>
                </InputGroup>
            </div>
          </FilterSection>
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 border-t-4 border-black bg-white p-6 flex space-x-4">
          <button
            onClick={handleReset}
            className="flex-1 px-4 py-3 border-2 border-black font-black uppercase text-xs flex items-center justify-center gap-2 hover:bg-slate-100 transition-colors"
          >
            <RotateCcw size={14} /> Reset
          </button>
          <button
            onClick={handleApply}
            className="flex-1 px-4 py-3 bg-black text-white font-black uppercase text-xs shadow-[4px_4px_0px_0px_rgba(250,204,21,1)] hover:bg-yellow-400 hover:text-black transition-all"
          >
            Apply Filters
          </button>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .brutalist-input {
          width: 100%;
          border: 2px solid black;
          padding: 10px;
          font-weight: 800;
          text-transform: uppercase;
          font-size: 12px;
          outline: none;
        }
        .brutalist-input:focus {
          background-color: #facc15;
        }
        .brutalist-select {
          width: 100%;
          border: 2px solid black;
          padding: 10px;
          font-weight: 800;
          text-transform: uppercase;
          font-size: 12px;
          background: white;
          border-radius: 0;
          appearance: none;
        }
      `}} />
    </div>
  );
};

const InputGroup = ({ label, children }) => (
    <div className="flex flex-col mb-2">
      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">{label}</label>
      {children}
    </div>
);

export default AdvancedFilters;