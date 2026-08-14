import Image from "next/image";
import { Medal } from "lucide-react";

interface MainInfoProps {
  location: string;
  guests: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  rating: number;
  reviews: number;
  hostName: string;
  hostExperience?: string;
  hostAvatar?: string;
}

export function MainInfo({
  location,
  guests,
  bedrooms,
  beds,
  bathrooms,
  rating,
  reviews,
  hostName,
  hostExperience,
  hostAvatar = "/placeholder-avatar.jpg",
}: MainInfoProps) {
  return (
    <div className="flex flex-col gap-6 py-8 border-b border-neutral-200">
      <div>
        <h2 className="text-[26px] font-semibold tracking-tight">{location}</h2>
        <div className="text-neutral-900 mt-1 text-[16px]">
          {guests} guests · {bedrooms} bedrooms · {beds} beds · {bathrooms} bathrooms
        </div>
      </div>

      <div className="flex items-center gap-4 mt-2">
        <div className="relative h-12 w-12 rounded-full">
          <div className="relative h-full w-full rounded-full overflow-hidden bg-neutral-200">
            <Image
              src={hostAvatar}
              alt={hostName}
              fill
              className="object-cover"
            />
          </div>
          {/* Superhost badge */}
          {hostExperience?.toLowerCase().includes("superhost") && (
            <div className="absolute -bottom-1 -right-1 bg-[#E31C5F] text-white rounded-full p-1 border-2 border-white shadow-sm flex items-center justify-center">
              <Medal className="w-3 h-3" />
            </div>
          )}
        </div>
        <div>
          <h3 className="font-semibold text-[16px]">Hosted by {hostName}</h3>
          {hostExperience && (
            <p className="text-neutral-500 text-sm">{hostExperience}</p>
          )}
        </div>
      </div>
    </div>
  );
}
