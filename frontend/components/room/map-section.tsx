import { ChevronRight } from "lucide-react";

interface MapSectionProps {
  location: string;
}

export function MapSection({ location }: MapSectionProps) {
  return (
    <div className="py-12 border-b border-neutral-200">
      <h2 className="text-[22px] font-semibold mb-6">Where you'll be</h2>
      <p className="mb-6">{location}</p>
      
      {/* Map Placeholder based on screenshot */}
      <div className="w-full h-[480px] bg-neutral-200 rounded-xl relative overflow-hidden flex items-center justify-center">
        {/* We would use react-leaflet or google maps here. 
            For now, showing a visual placeholder as requested. */}
        <div className="absolute inset-0 bg-[#e5e3df]">
            {/* Fake map lines */}
            <div className="absolute top-1/4 left-0 w-full h-1 bg-white opacity-50 rotate-12"></div>
            <div className="absolute top-1/2 left-0 w-full h-2 bg-white opacity-70 -rotate-6"></div>
            <div className="absolute left-1/3 top-0 h-full w-2 bg-white opacity-60"></div>
            
            {/* Center pin area */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                <div className="w-32 h-32 bg-black/10 rounded-full flex items-center justify-center">
                    <div className="w-12 h-12 bg-black rounded-full text-white flex items-center justify-center shadow-lg">
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                        </svg>
                    </div>
                </div>
            </div>
        </div>
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
