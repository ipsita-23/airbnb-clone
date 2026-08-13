import Image from "next/image";
import { Heart, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PropertyCardProps {
  image: string;
  location: string;
  title: string;
  price: string;
  rating: string;
  isGuestFavorite?: boolean;
}

export function PropertyCard({ image, location, title, price, rating, isGuestFavorite = true }: PropertyCardProps) {
  return (
    <div className="group cursor-pointer flex flex-col gap-3">
      {/* Image Container */}
      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-gray-200">
        <Image
          src={image}
          alt={location}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
          {isGuestFavorite ? (
            <div className="bg-white px-3 py-1 rounded-full text-xs font-bold text-gray-900 shadow-sm shadow-black/10">
              Guest favourite
            </div>
          ) : (
            <div />
          )}
          
          <button className="text-white hover:scale-105 active:scale-95 transition">
            <Heart className="h-6 w-6 drop-shadow-md stroke-[1.5] hover:fill-black/30" />
          </button>
        </div>
      </div>

      {/* Details */}
      <div className="flex flex-col gap-0.5 px-0.5">
        <div className="flex justify-between items-start">
          <span className="font-semibold text-gray-900 truncate">{location}</span>
          <div className="flex items-center gap-1 text-sm text-gray-900">
            <Star className="h-3 w-3 fill-current" />
            <span>{rating}</span>
          </div>
        </div>
        <span className="text-gray-500 text-sm truncate">{title}</span>
        <span className="text-gray-900 text-sm font-semibold mt-1">{price}</span>
      </div>
    </div>
  );
}
