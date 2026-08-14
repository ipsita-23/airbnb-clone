import { Share, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RoomHeaderProps {
  title: string;
}

export function RoomHeader({ title }: RoomHeaderProps) {
  return (
    <div className="flex items-center justify-between py-4">
      <h1 className="text-[26px] font-semibold">{title}</h1>
      <div className="flex items-center">
        <Button variant="ghost" className="flex items-center gap-2 underline decoration-solid font-medium rounded-md px-3 h-9 hover:bg-neutral-100">
          <Share className="h-4 w-4" />
          <span>Share</span>
        </Button>
        <Button variant="ghost" className="flex items-center gap-2 underline decoration-solid font-medium rounded-md px-3 h-9 hover:bg-neutral-100">
          <Heart className="h-4 w-4" />
          <span>Save</span>
        </Button>
      </div>
    </div>
  );
}
