import React from 'react';
import { useDNA } from '../../hooks/useDNA';
import { Brain, MapPin, Calendar, DollarSign, XCircle, CheckCircle } from 'lucide-react';

const DNAPreferences = () => {
  const { dna, loading } = useDNA();

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse flex space-x-4">
          <div className="rounded-full bg-gray-200 h-12 w-12"></div>
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!dna) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <Brain className="w-12 h-12 text-gray-400 mx-auto mb-3" />
        <h3 className="text-lg font-medium text-gray-900">No preferences yet</h3>
        <p className="text-sm text-gray-500 mt-1">
          As you search and interact with listings, we'll learn your preferences.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Brain className="w-5 h-5 text-blue-600" />
        <h2 className="text-lg font-semibold">Your Dealer DNA</h2>
      </div>

      <div className="space-y-4">
        {/* Preferred Makes */}
        {dna.preferred_makes?.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Preferred Makes</h3>
            <div className="flex flex-wrap gap-2">
              {dna.preferred_makes.map(make => (
                <span key={make} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {make}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Preferred Models */}
        {dna.preferred_models?.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Preferred Models</h3>
            <div className="flex flex-wrap gap-2">
              {dna.preferred_models.map(model => (
                <span key={model} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  {model}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Year Range */}
        {(dna.preferred_years?.min || dna.preferred_years?.max) && (
          <div className="flex items-center space-x-2">
            <Calendar size={16} className="text-gray-400" />
            <span className="text-sm">
              Years: {dna.preferred_years.min || 'Any'} - {dna.preferred_years.max || 'Any'}
            </span>
          </div>
        )}

        {/* Price Range */}
        {(dna.preferred_price_range?.min || dna.preferred_price_range?.max) && (
          <div className="flex items-center space-x-2">
            <DollarSign size={16} className="text-gray-400" />
            <span className="text-sm">
              Price: ₦{dna.preferred_price_range.min?.toLocaleString() || 'Any'} - ₦{dna.preferred_price_range.max?.toLocaleString() || 'Any'}
            </span>
          </div>
        )}

        {/* Preferred Locations */}
        {dna.preferred_locations?.length > 0 && (
          <div className="flex items-start space-x-2">
            <MapPin size={16} className="text-gray-400 mt-0.5" />
            <div className="flex-1">
              <span className="text-sm font-medium">Locations:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {dna.preferred_locations.map(loc => (
                  <span key={loc} className="px-2 py-0.5 bg-purple-100 text-purple-800 rounded text-xs">
                    {loc}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Deal Breakers */}
        {dna.deal_breakers?.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
              <XCircle size={16} className="mr-1 text-red-500" /> Deal Breakers
            </h3>
            <div className="flex flex-wrap gap-2">
              {dna.deal_breakers.map(breaker => (
                <span key={breaker} className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                  {breaker.replace(/_/g, ' ')}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Must-Haves */}
        {dna.must_haves?.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
              <CheckCircle size={16} className="mr-1 text-green-500" /> Must-Haves
            </h3>
            <div className="flex flex-wrap gap-2">
              {dna.must_haves.map(have => (
                <span key={have} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  {have.replace(/_/g, ' ')}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="text-xs text-gray-400 mt-4">
          Based on your {dna.search_volume || 0} searches
        </div>
      </div>
    </div>
  );
};

export default DNAPreferences;