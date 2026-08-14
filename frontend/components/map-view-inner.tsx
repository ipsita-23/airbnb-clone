'use client';

import { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
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
  const sp = useSearchParams();
  const whereQuery = sp.get('where');

  useEffect(() => {
    const validProps = properties.filter(p => p.latitude != null && p.longitude != null);
    if (validProps.length > 0) {
      const bounds = L.latLngBounds(validProps.map((p) => [p.latitude, p.longitude]));
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 13 });
    } else if (whereQuery) {
      // Geocode whereQuery and fly to it
      fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(whereQuery)}&format=json&limit=1`, {
        headers: { 'User-Agent': 'AirbnbClone/1.0' }
      })
        .then(res => res.json())
        .then(data => {
          if (data && data.length > 0) {
            map.flyTo([parseFloat(data[0].lat), parseFloat(data[0].lon)], 12, { animate: true });
          }
        }).catch(() => {});
    }
  }, [properties, map, whereQuery]);

  return null;
}

export default function MapInner({ properties }: { properties: any[] }) {
  const validProps = properties.filter(p => p.latitude != null && p.longitude != null);
  // Center defaults to Chandigarh if no properties
  const center: [number, number] = validProps.length > 0 ? [validProps[0].latitude, validProps[0].longitude] : [30.7333, 76.7794];

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
        
        {validProps.map((property) => (
          <Marker
            key={property.id}
            position={[property.latitude, property.longitude]}
            icon={createCustomIcon(String(property.price))}
          />
        ))}
        
        <MapBounds properties={properties} />
      </MapContainer>
    </div>
  );
}
