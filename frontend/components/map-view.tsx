'use client';

import dynamic from 'next/dynamic';
import { useMemo } from 'react';

// Dynamically import the inner map component, disabling SSR because leaflet uses window
const MapInner = dynamic(() => import('./map-view-inner'), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-gray-100 rounded-2xl animate-pulse" />
});

interface MapViewProps {
  properties: any[] | null;
}

export function MapView({ properties }: MapViewProps) {
  // Memoize properties to prevent unnecessary re-renders of the map
  const memoizedProperties = useMemo(() => properties ?? [], [properties]);

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-sm border border-gray-200">
      <MapInner properties={memoizedProperties} />
    </div>
  );
}
