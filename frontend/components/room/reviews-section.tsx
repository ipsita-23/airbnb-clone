import Image from "next/image";
import { Badge } from "@/components/ui/badge";

export interface Review {
  id: string;
  authorName: string;
  authorAvatar?: string;
  timeOnAirbnb: string;
  rating: number;
  date: string;
  text: string;
}

export interface RatingCategory {
  name: string;
  score: number;
  icon?: React.ReactNode;
}

interface ReviewsSectionProps {
  overallRating: number;
  totalReviews: number;
  categories: RatingCategory[];
  reviews: Review[];
}

export function ReviewsSection({ overallRating, totalReviews, categories, reviews }: ReviewsSectionProps) {
  return (
    <div className="py-8 border-b border-neutral-200">
      {/* Categories header could go here, but omitted for brevity and based on screenshot layout */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
        {/* Simplified mock up of the category ratings based on screenshot 4 */}
        <div className="col-span-1 border-r border-neutral-200">
            <div className="text-sm">Overall rating</div>
            {/* mock bar charts */}
            <div className="flex flex-col gap-1 mt-2">
                <div className="w-full bg-neutral-200 h-1.5 rounded-full"><div className="bg-black h-1.5 rounded-full w-full"></div></div>
                <div className="w-full bg-neutral-200 h-1.5 rounded-full"><div className="bg-black h-1.5 rounded-full w-[80%]"></div></div>
                <div className="w-full bg-neutral-200 h-1.5 rounded-full"><div className="bg-black h-1.5 rounded-full w-[10%]"></div></div>
            </div>
        </div>
        {categories.map((cat, i) => (
            <div key={i} className={`col-span-1 ${i < categories.length - 1 ? 'border-r border-neutral-200' : ''} px-4`}>
                <div className="text-sm">{cat.name}</div>
                <div className="font-semibold">{cat.score.toFixed(1)}</div>
                <div className="mt-2 text-2xl text-neutral-700">{cat.icon || '✦'}</div>
            </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
          <Badge variant="outline" className="px-4 py-2 rounded-full border-neutral-300 font-normal shadow-sm">Cleanliness 36</Badge>
          <Badge variant="outline" className="px-4 py-2 rounded-full border-neutral-300 font-normal shadow-sm">Condition 12</Badge>
          <Badge variant="outline" className="px-4 py-2 rounded-full border-neutral-300 font-normal shadow-sm">Hospitality 44</Badge>
          <Badge variant="outline" className="px-4 py-2 rounded-full border-neutral-300 font-normal shadow-sm">Comfort 15</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10">
        {reviews.map((review) => (
          <div key={review.id} className="flex flex-col">
            <div className="flex items-center gap-4 mb-3">
              <div className="relative h-12 w-12 rounded-full overflow-hidden bg-neutral-200 flex items-center justify-center text-xl font-semibold">
                {review.authorAvatar ? (
                    <Image src={review.authorAvatar} alt={review.authorName} fill className="object-cover" />
                ) : (
                    review.authorName.charAt(0)
                )}
              </div>
              <div>
                <h4 className="font-semibold text-[16px]">{review.authorName}</h4>
                <p className="text-neutral-500 text-sm">{review.timeOnAirbnb}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex text-[10px]">
                {/* Mocking stars */}
                ★★★★★
              </div>
              <span className="text-neutral-800 text-sm font-semibold">·</span>
              <span className="text-neutral-500 text-sm">{review.date}</span>
            </div>
            <p className="text-neutral-800 leading-relaxed text-[16px]">
              {review.text}
            </p>
            <button className="text-left font-semibold underline decoration-solid mt-2 hover:text-neutral-600 w-fit">
              Show more
            </button>
          </div>
        ))}
      </div>
      
      <button className="mt-10 px-6 py-3 border border-neutral-800 rounded-lg font-semibold hover:bg-neutral-100 transition">
        Show all {totalReviews} reviews
      </button>
    </div>
  );
}
