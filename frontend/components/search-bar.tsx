import { Search } from 'lucide-react';
import { Separator } from "@/components/ui/separator";

export function SearchBar() {
  return (
    <div className="flex justify-center mt-6 z-40 px-4">
      <div className="w-full max-w-[850px] bg-white rounded-full border border-gray-200 shadow-lg shadow-black/5 hover:shadow-xl transition-shadow flex items-center h-[66px] overflow-hidden">
        
        {/* Where */}
        <div className="flex-1 h-full px-8 flex flex-col justify-center hover:bg-gray-100 rounded-full cursor-pointer transition">
          <span className="text-xs font-bold text-gray-900 tracking-wide">Where</span>
          <input 
            type="text" 
            placeholder="Search destinations" 
            className="w-full bg-transparent text-sm text-gray-600 outline-none placeholder-gray-400 mt-0.5 truncate"
          />
        </div>

        <Separator orientation="vertical" className="h-8 bg-gray-200" />

        {/* When */}
        <div className="flex-[0.8] h-full px-6 flex flex-col justify-center hover:bg-gray-100 rounded-full cursor-pointer transition">
          <span className="text-xs font-bold text-gray-900 tracking-wide">When</span>
          <span className="text-sm text-gray-400 mt-0.5">Add dates</span>
        </div>

        <Separator orientation="vertical" className="h-8 bg-gray-200" />

        {/* Who */}
        <div className="flex-1 h-full pl-6 pr-2 flex items-center justify-between hover:bg-gray-100 rounded-full cursor-pointer transition">
          <div className="flex flex-col justify-center">
            <span className="text-xs font-bold text-gray-900 tracking-wide">Who</span>
            <span className="text-sm text-gray-400 mt-0.5">Add guests</span>
          </div>
          
          <button className="bg-rose-600 hover:bg-rose-700 transition p-4 rounded-full text-white flex-shrink-0">
            <Search className="h-4 w-4 stroke-[3]" />
          </button>
        </div>

      </div>
    </div>
  );
}
