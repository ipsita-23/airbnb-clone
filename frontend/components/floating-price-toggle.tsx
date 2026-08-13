import { Tag } from "lucide-react";

export function FloatingPriceToggle() {
  return (
    <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-white px-6 py-4 rounded-full shadow-lg border border-gray-200 flex items-center gap-3 cursor-pointer hover:scale-105 hover:shadow-xl transition-all duration-300">
        <Tag className="h-5 w-5 text-rose-500 fill-rose-500" />
        <span className="font-semibold text-gray-900 text-[15px]">Prices include all fees</span>
      </div>
    </div>
  );
}
