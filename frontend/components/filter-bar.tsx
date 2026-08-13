'use client';

import { SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';

const FILTERS = [
  'Kitchen', 'Washing machine', 'Wifi', 'Allows pets', 'TV',
  'Air conditioning', '1+ bathrooms', 'Instant Book', 'Free parking',
  'Dedicated workspace', 'Pool', 'Hot tub', 'EV charger',
];

export function FilterBar() {
  const [active, setActive] = useState<string[]>([]);

  function toggle(f: string) {
    setActive(prev => prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f]);
  }

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-[1280px] mx-auto px-6 py-3 flex items-center gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {/* Filters button */}
        <button className="flex-shrink-0 flex items-center gap-2 border border-gray-300 rounded-full px-4 py-2.5 text-sm font-medium hover:bg-gray-50 transition">
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </button>

        <div className="w-px h-7 bg-gray-200 flex-shrink-0 mx-1" />

        {/* Scrollable filter chips */}
        {FILTERS.map(f => (
          <button
            key={f}
            onClick={() => toggle(f)}
            className={`flex-shrink-0 px-4 py-2.5 rounded-full text-[13px] font-medium border transition-all
              ${active.includes(f)
                ? 'bg-gray-900 text-white border-gray-900'
                : 'border-gray-200 text-gray-700 hover:border-gray-900 hover:bg-gray-50'}`}
          >
            {f}
          </button>
        ))}
      </div>
    </div>
  );
}
