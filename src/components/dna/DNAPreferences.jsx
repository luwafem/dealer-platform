import React from 'react';
import { useDNA } from '../../hooks/useDNA';
import { Brain, MapPin, Calendar, DollarSign, XCircle, CheckCircle } from 'lucide-react';

const DNAPreferences = () => {
  const { dna, loading } = useDNA();

  if (loading) {
    return (
      <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6">
        <div className="animate-pulse flex space-x-4">
          <div className="border-2 border-black bg-gray-200 h-12 w-12"></div>
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-gray-200 border-2 border-black w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 border-2 border-black"></div>
              <div className="h-4 bg-gray-200 border-2 border-black w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!dna) {
    return (
      <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6 text-center">
        <Brain size={48} strokeWidth={2} className="mx-auto mb-3 text-black" />
        <h3 className="text-lg font-black uppercase tracking-tighter">No preferences yet</h3>
        <p className="font-bold mt-1">
          As you search and interact with listings, we'll learn your preferences.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6">
      <div className="flex items-center gap-2 mb-4">
        <Brain size={20} strokeWidth={2} className="text-black" />
        <h2 className="text-2xl font-black uppercase tracking-tighter">Your Dealer DNA</h2>
      </div>

      <div className="space-y-4">
        {/* Preferred Makes */}
        {dna.preferred_makes?.length > 0 && (
          <div>
            <h3 className="text-sm font-black uppercase mb-2">Preferred Makes</h3>
            <div className="flex flex-wrap gap-2">
              {dna.preferred_makes.map(make => (
                <span key={make} className="px-3 py-1 bg-blue-100 border-2 border-black font-bold text-sm">
                  {make}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Preferred Models */}
        {dna.preferred_models?.length > 0 && (
          <div>
            <h3 className="text-sm font-black uppercase mb-2">Preferred Models</h3>
            <div className="flex flex-wrap gap-2">
              {dna.preferred_models.map(model => (
                <span key={model} className="px-3 py-1 bg-green-100 border-2 border-black font-bold text-sm">
                  {model}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Year Range */}
        {(dna.preferred_years?.min || dna.preferred_years?.max) && (
          <div className="flex items-center gap-2">
            <Calendar size={16} strokeWidth={2} className="text-black" />
            <span className="font-bold text-sm">
              Years: {dna.preferred_years.min || 'Any'} - {dna.preferred_years.max || 'Any'}
            </span>
          </div>
        )}

        {/* Price Range */}
        {(dna.preferred_price_range?.min || dna.preferred_price_range?.max) && (
          <div className="flex items-center gap-2">
            <DollarSign size={16} strokeWidth={2} className="text-black" />
            <span className="font-bold text-sm">
              Price: ₦{dna.preferred_price_range.min?.toLocaleString() || 'Any'} - ₦{dna.preferred_price_range.max?.toLocaleString() || 'Any'}
            </span>
          </div>
        )}

        {/* Preferred Locations */}
        {dna.preferred_locations?.length > 0 && (
          <div className="flex items-start gap-2">
            <MapPin size={16} strokeWidth={2} className="text-black mt-0.5" />
            <div className="flex-1">
              <span className="font-bold text-sm">Locations:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {dna.preferred_locations.map(loc => (
                  <span key={loc} className="px-2 py-0.5 bg-purple-100 border-2 border-black font-bold text-xs">
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
            <h3 className="text-sm font-black uppercase mb-2 flex items-center gap-1">
              <XCircle size={16} strokeWidth={2} /> Deal Breakers
            </h3>
            <div className="flex flex-wrap gap-2">
              {dna.deal_breakers.map(breaker => (
                <span key={breaker} className="px-3 py-1 bg-red-100 border-2 border-black font-bold text-sm">
                  {breaker.replace(/_/g, ' ')}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Must-Haves */}
        {dna.must_haves?.length > 0 && (
          <div>
            <h3 className="text-sm font-black uppercase mb-2 flex items-center gap-1">
              <CheckCircle size={16} strokeWidth={2} /> Must-Haves
            </h3>
            <div className="flex flex-wrap gap-2">
              {dna.must_haves.map(have => (
                <span key={have} className="px-3 py-1 bg-green-100 border-2 border-black font-bold text-sm">
                  {have.replace(/_/g, ' ')}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="text-xs font-bold mt-4">
          Based on your {dna.search_volume || 0} searches
        </div>
      </div>
    </div>
  );
};

export default DNAPreferences;