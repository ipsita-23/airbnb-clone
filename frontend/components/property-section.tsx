'use client';

import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { PropertyCard } from "./property-card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useRef, useState } from "react";

interface PropertySectionProps {
  title: string;
  properties: any[];
}

export function PropertySection({ title, properties }: PropertySectionProps) {
  return (
    <div className="py-6">
      {/* Header row: title left, arrow buttons right (like real Airbnb) */}
      <div className="mb-5 px-6 xl:px-10 max-w-[1280px] mx-auto flex items-center justify-between">
        <h2 className="text-[22px] font-semibold text-gray-900 flex items-center gap-2 cursor-pointer hover:underline">
          {title}
          <ArrowRight className="h-5 w-5 mt-0.5" />
        </h2>
      </div>

      {/* Carousel — arrows positioned properly via shadcn defaults inside relative container */}
      <div className="max-w-[1280px] mx-auto px-8 xl:px-12">
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-3">
            {properties.map((property) => (
              <CarouselItem key={property.id} className="pl-3 basis-[78%] sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-[18.5%]">
                <PropertyCard {...property} />
              </CarouselItem>
            ))}
          </CarouselContent>
          {/* Shadcn buttons default to absolute -left-12/-right-12, top-1/2 — keep those defaults and just style */}
          <CarouselPrevious className="bg-white hover:bg-gray-50 border border-gray-300 shadow-md h-9 w-9 text-gray-700" />
          <CarouselNext    className="bg-white hover:bg-gray-50 border border-gray-300 shadow-md h-9 w-9 text-gray-700" />
        </Carousel>
      </div>
    </div>
  );
}
