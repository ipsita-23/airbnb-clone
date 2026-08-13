'use client';

import { useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default Leaflet marker icons not loading correctly in some setups
// Though we are creating custom DivIcons, it's good practice.
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// A component to automatically adjust the map bounds based on markers
function MapBounds({ properties }: { properties: any[] }) {
  const map = useMap();

  useEffect(() => {
    if (properties.length > 0) {
      const bounds = L.latLngBounds(properties.map((p) => [p.lat, p.lng]));
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 13 });
    }
  }, [properties, map]);

  return null;
}

export default function MapInner({ properties }: { properties: any[] }) {
  // Center defaults to Chandigarh if no properties
  const center: [number, number] = properties.length > 0 ? [properties[0].lat, properties[0].lng] : [30.7333, 76.7794];

  // We need to create a custom DivIcon for each property price tag
  const createCustomIcon = (price: string) => {
    return L.divIcon({
      className: 'custom-price-marker',
      html: `<div class="bg-white text-gray-900 text-sm font-bold px-3 py-1.5 rounded-full shadow-md hover:bg-gray-900 hover:text-white transition-colors whitespace-nowrap border border-gray-200" style="transform: translate(-50%, -50%); transform-origin: top left;">
              ${price.split(' ')[0]}
             </div>`,
      iconSize: [0, 0], // use 0,0 and let the div style position it
      iconAnchor: [0, 0],
    });
  };

  return (
    <div className="w-full h-full relative">
      <MapContainer
        center={center}
        zoom={12}
        scrollWheelZoom={true}
        className="w-full h-full z-0"
        zoomControl={false} // We will use default zoom but we can customize position if we want
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        
        {properties.map((property) => (
          <Marker
            key={property.id}
            position={[property.lat, property.lng]}
            icon={createCustomIcon(property.price)}
          />
        ))}
        
        <MapBounds properties={properties} />
      </MapContainer>
    </div>
  );
}
