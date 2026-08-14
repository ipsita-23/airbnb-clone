import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface Amenity {
  icon: LucideIcon;
  name: string;
  crossedOut?: boolean;
}

interface AmenitiesProps {
  amenities: Amenity[];
}

export function Amenities({ amenities }: AmenitiesProps) {
  return (
    <div className="py-8 border-b border-neutral-200">
      <h2 className="text-[22px] font-semibold mb-6">What this place offers</h2>
      
      <div className="grid grid-cols-2 gap-y-4 gap-x-2">
        {amenities.slice(0, 10).map((amenity, index) => {
          const Icon = amenity.icon;
          return (
            <div key={index} className="flex items-center gap-4">
              <Icon className="w-6 h-6 text-neutral-800" strokeWidth={1.5} />
              <span className={`text-[16px] text-neutral-800 ${amenity.crossedOut ? 'line-through text-neutral-500' : ''}`}>
                {amenity.name}
              </span>
            </div>
          );
        })}
      </div>
      
      {amenities.length > 10 && (
        <Button variant="outline" className="mt-8 font-medium border-neutral-800 px-6 py-3 h-12 text-[16px] rounded-lg">
          Show all {amenities.length} amenities
        </Button>
      )}
    </div>
  );
}
