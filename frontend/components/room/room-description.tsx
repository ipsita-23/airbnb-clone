import { ChevronRight } from "lucide-react";

interface RoomDescriptionProps {
  description: string;
}

export function RoomDescription({ description }: RoomDescriptionProps) {
  return (
    <div className="py-8 border-b border-neutral-200">
      <div 
        className="text-[16px] text-neutral-800 leading-relaxed whitespace-pre-wrap line-clamp-6"
      >
        {description}
      </div>
      <button className="flex items-center gap-1 mt-4 font-semibold underline decoration-solid decoration-1 underline-offset-2 hover:text-neutral-600 transition">
        Show more <ChevronRight className="w-4 h-4 mt-0.5" />
      </button>
    </div>
  );
}
