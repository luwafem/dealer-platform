import React from 'react';
import { Check, X, Minus } from 'lucide-react';
import { formatNaira } from '../../utils/formatters';

const CompareTable = ({ listings }) => {
  if (!listings || listings.length < 2) return null;

  // Helper to determine cell color based on values (kept for visual cues)
  const getCellClass = (value, compareValues) => {
    if (typeof value === 'boolean') {
      return value ? 'bg-green-100' : 'bg-red-100';
    }
    if (typeof value === 'number') {
      const otherValues = compareValues.filter(v => v !== value);
      if (otherValues.length === 0) return '';
      const avg = otherValues.reduce((a, b) => a + b, 0) / otherValues.length;
      if (value > avg) return 'bg-green-100';
      if (value < avg) return 'bg-red-100';
      return 'bg-yellow-100';
    }
    return '';
  };

  const fields = [
    { key: 'make', label: 'Make' },
    { key: 'model', label: 'Model' },
    { key: 'year', label: 'Year' },
    { key: 'price', label: 'Price', format: (v) => formatNaira(v) },
    { key: 'mileage', label: 'Mileage (km)', format: (v) => v?.toLocaleString() || 'N/A' },
    { key: 'engine_type', label: 'Engine' },
    { key: 'transmission', label: 'Transmission' },
    { key: 'fuel_type', label: 'Fuel Type' },
    { key: 'location', label: 'Location' },
    { key: 'color', label: 'Color' },
    { key: 'condition', label: 'Condition' },
    { key: 'accident_history', label: 'Accident History' },
    { key: 'customs_status', label: 'Customs' },
    { key: 'sunroof', label: 'Sunroof', format: (v) => v ? <Check className="text-black" strokeWidth={2} /> : <X className="text-black" strokeWidth={2} /> },
    { key: 'leather', label: 'Leather Seats', format: (v) => v ? <Check className="text-black" strokeWidth={2} /> : <X className="text-black" strokeWidth={2} /> },
    { key: 'navigation', label: 'Navigation', format: (v) => v ? <Check className="text-black" strokeWidth={2} /> : <X className="text-black" strokeWidth={2} /> },
    { key: 'backup_camera', label: 'Backup Camera', format: (v) => v ? <Check className="text-black" strokeWidth={2} /> : <X className="text-black" strokeWidth={2} /> },
  ];

  return (
    <div className="overflow-x-auto border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      <table className="min-w-full divide-y-2 divide-black">
        <thead>
          <tr className="bg-black text-white">
            <th className="px-4 py-3 text-left text-xs font-black uppercase tracking-wider border-r-2 border-black">
              Feature
            </th>
            {listings.map((listing, idx) => (
              <th key={idx} className="px-4 py-3 text-center text-sm font-black uppercase tracking-wider border-r-2 border-black last:border-r-0">
                {listing.make} {listing.model} {listing.year}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y-2 divide-black">
          {fields.map((field) => {
            const values = listings.map(l => l[field.key]);
            return (
              <tr key={field.key}>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-black uppercase border-r-2 border-black bg-gray-100">
                  {field.label}
                </td>
                {listings.map((listing, idx) => {
                  const rawValue = listing[field.key];
                  const displayValue = field.format ? field.format(rawValue) : rawValue ?? '—';
                  const cellClass = getCellClass(rawValue, values);
                  return (
                    <td key={idx} className={`px-4 py-3 text-center text-sm font-bold border-r-2 border-black last:border-r-0 ${cellClass}`}>
                      {displayValue}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default CompareTable;