'use client';

import dynamic from 'next/dynamic';
import { ChevronRight } from "lucide-react";

// Dynamically import the map component, disabling SSR because leaflet uses window
const MapInner = dynamic(() => import('./map-section-inner'), {
  ssr: false,
  loading: () => <div className="w-full h-[480px] bg-gray-100 rounded-2xl animate-pulse" />
});

interface MapSectionProps {
  location: string;
  latitude?: number;
  longitude?: number;
}

export function MapSection({ location, latitude, longitude }: MapSectionProps) {
  return (
    <div className="py-12 border-b border-neutral-200">
      <h2 className="text-[22px] font-semibold mb-6">Where you'll be</h2>
      <p className="mb-6">{location}</p>
      
      {/* Real Map */}
      <div className="w-full h-[480px] rounded-xl overflow-hidden shadow-sm border border-gray-200">
        {latitude && longitude ? (
          <MapInner latitude={latitude} longitude={longitude} />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <p className="text-gray-500">Location not available</p>
          </div>
        )}
      </div>
      
      <div className="mt-6">
        <h3 className="font-semibold text-[16px] mb-2">Exact location will be provided after booking.</h3>
        
        <div className="mt-8">
            <h3 className="font-semibold text-[18px] mb-4">Neighbourhood highlights</h3>
            <p className="text-neutral-700">Please do not park your vehicle in front of neighbour's gate as it can cause trouble to them.</p>
            
            <button className="flex items-center gap-1 mt-4 font-semibold underline decoration-solid decoration-1 underline-offset-2 hover:text-neutral-600 transition">
                Show more <ChevronRight className="w-4 h-4 mt-0.5" />
            </button>
        </div>
      </div>
    </div>
  );
}
