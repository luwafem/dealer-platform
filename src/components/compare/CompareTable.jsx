import React from 'react';
import { Check, X, Minus } from 'lucide-react';
import { formatNaira } from '../../utils/formatters';

const CompareTable = ({ listings }) => {
  if (!listings || listings.length < 2) return null;

  // Helper to determine cell color based on values
  const getCellClass = (value, compareValues) => {
    // For boolean or simple comparison
    if (typeof value === 'boolean') {
      return value ? 'bg-green-50' : 'bg-red-50';
    }
    if (typeof value === 'number') {
      // Compare with other listings' same field
      const otherValues = compareValues.filter(v => v !== value);
      if (otherValues.length === 0) return '';
      const avg = otherValues.reduce((a, b) => a + b, 0) / otherValues.length;
      if (value > avg) return 'bg-green-50';
      if (value < avg) return 'bg-red-50';
      return 'bg-yellow-50';
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
    { key: 'sunroof', label: 'Sunroof', format: (v) => v ? <Check className="text-green-600" /> : <X className="text-red-400" /> },
    { key: 'leather', label: 'Leather Seats', format: (v) => v ? <Check className="text-green-600" /> : <X className="text-red-400" /> },
    { key: 'navigation', label: 'Navigation', format: (v) => v ? <Check className="text-green-600" /> : <X className="text-red-400" /> },
    { key: 'backup_camera', label: 'Backup Camera', format: (v) => v ? <Check className="text-green-600" /> : <X className="text-red-400" /> },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Feature
            </th>
            {listings.map((listing, idx) => (
              <th key={idx} className="px-4 py-3 bg-gray-50 text-center text-sm font-semibold text-gray-900">
                {listing.make} {listing.model} {listing.year}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {fields.map((field) => {
            const values = listings.map(l => l[field.key]);
            return (
              <tr key={field.key}>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                  {field.label}
                </td>
                {listings.map((listing, idx) => {
                  const rawValue = listing[field.key];
                  const displayValue = field.format ? field.format(rawValue) : rawValue ?? '—';
                  const cellClass = getCellClass(rawValue, values);
                  return (
                    <td key={idx} className={`px-4 py-3 text-center text-sm ${cellClass}`}>
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