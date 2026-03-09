import React from 'react';
import { Bell, Trash2, Play } from 'lucide-react';
import { formatDate } from '../../utils/formatters';

const SavedSearchCard = ({ search, onApply, onDelete, onToggleAlert }) => {
  const { id, name, criteria, alerts_enabled, last_match_at, created_at } = search;

  const filterCount = Object.values(criteria.filters || {}).filter(v => v && v.length > 0).length;

  return (
    <div className="bg-white rounded-lg shadow p-4 hover:shadow-md transition">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-gray-900">{name}</h3>
          <p className="text-sm text-gray-500 mt-1">
            {filterCount} filters • Last match: {last_match_at ? formatDate(last_match_at) : 'Never'}
          </p>
          <p className="text-xs text-gray-400 mt-1">Created {formatDate(created_at)}</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onToggleAlert(id, !alerts_enabled)}
            className={`p-2 rounded-full ${
              alerts_enabled ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'
            } hover:bg-blue-200`}
            title={alerts_enabled ? 'Disable alerts' : 'Enable alerts'}
          >
            <Bell size={16} />
          </button>
          <button
            onClick={() => onApply(criteria)}
            className="p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200"
            title="Run search"
          >
            <Play size={16} />
          </button>
          <button
            onClick={() => onDelete(id)}
            className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SavedSearchCard;