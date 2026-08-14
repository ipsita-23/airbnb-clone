import Image from "next/image";
import { Grid } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageGalleryProps {
  images: string[];
}

export function ImageGallery({ images }: ImageGalleryProps) {
  // Assuming images has at least 5 photos for this layout
  const displayImages = images.slice(0, 5);
  
  return (
    <div className="relative pt-2">
      <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[450px] md:h-[500px] lg:h-[600px] rounded-xl overflow-hidden">
        {/* Main large image */}
        <div className="col-span-2 row-span-2 relative h-full w-full group cursor-pointer">
          <Image
            src={displayImages[0] || "/placeholder.jpg"}
            alt="Room main photo"
            fill
            className="object-cover group-hover:brightness-90 transition"
          />
        </div>
        
        {/* Top right images */}
        <div className="col-span-1 row-span-1 relative h-full w-full group cursor-pointer">
          <Image
            src={displayImages[1] || "/placeholder.jpg"}
            alt="Room photo 2"
            fill
            className="object-cover group-hover:brightness-90 transition"
          />
        </div>
        <div className="col-span-1 row-span-1 relative h-full w-full group cursor-pointer">
          <Image
            src={displayImages[2] || "/placeholder.jpg"}
            alt="Room photo 3"
            fill
            className="object-cover group-hover:brightness-90 transition"
          />
        </div>

        {/* Bottom right images */}
        <div className="col-span-1 row-span-1 relative h-full w-full group cursor-pointer">
          <Image
            src={displayImages[3] || "/placeholder.jpg"}
            alt="Room photo 4"
            fill
            className="object-cover group-hover:brightness-90 transition"
          />
        </div>
        <div className="col-span-1 row-span-1 relative h-full w-full group cursor-pointer">
          <Image
            src={displayImages[4] || "/placeholder.jpg"}
            alt="Room photo 5"
            fill
            className="object-cover group-hover:brightness-90 transition"
          />
        </div>
      </div>
      
      {/* Show all photos button */}
      <Button
        variant="outline"
        className="absolute bottom-4 right-4 bg-white hover:bg-neutral-100 border border-neutral-800 font-medium px-4 py-1.5 flex items-center gap-2 rounded-lg"
      >
        <Grid className="w-4 h-4" />
        Show all photos
      </Button>
    </div>
  );
}
