import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FilterSection = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b-2 border-black py-3">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-left font-black uppercase tracking-tighter hover:bg-yellow-100 px-2 py-1 transition-colors"
      >
        <span>{title}</span>
        {isOpen ? 
          <ChevronUp size={18} strokeWidth={2} /> : 
          <ChevronDown size={18} strokeWidth={2} />
        }
      </button>
      {isOpen && <div className="mt-3 px-2">{children}</div>}
    </div>
  );
};

export default FilterSection;