import { Navbar } from "@/components/navbar";
import { PropertySection } from "@/components/property-section";
import { FloatingPriceToggle } from "@/components/floating-price-toggle";
import { FilterBar } from "@/components/filter-bar";
import { MapView } from "@/components/map-view";
import { PropertyCard } from "@/components/property-card";
import Link from "next/link";

const ALL_PROPERTIES = [
  { id: 1,  lat: 30.7333, lng: 76.7794, title: 'Home in Chandigarh',                 location: 'Home in Chandigarh',                 price: '₹8,330 for 2 nights',  rating: '4.89', image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80', isGuestFavorite: true,  description: 'Elegant retreat in the heart of the city with modern amenities.', beds: '3 bedrooms · 4 beds · 2 bathrooms' },
  { id: 2,  lat: 30.7380, lng: 76.7820, title: 'Home in Chandigarh',                 location: 'Home in Chandigarh',                 price: '₹20,998 for 2 nights', rating: '4.95', image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80', isGuestFavorite: true,  description: 'Luxury villa with a private garden and swimming pool.', beds: '4 bedrooms · 5 beds · 3 bathrooms' },
  { id: 3,  lat: 30.7250, lng: 76.7650, title: 'Home in Chandigarh',                 location: 'Home in Chandigarh',                 price: '₹17,808 for 2 nights', rating: '5.0',  image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80', isGuestFavorite: true,  description: 'Serene family home with lush greenery and peaceful surroundings.', beds: '3 bedrooms · 3 beds · 2 bathrooms' },
  { id: 4,  lat: 30.7420, lng: 76.7900, title: 'Home in Chandigarh',                 location: 'Home in Chandigarh',                 price: '₹11,742 for 2 nights', rating: '4.95', image: 'https://images.unsplash.com/photo-1502672260266-1c1de2d93688?w=800&q=80', isGuestFavorite: true,  description: 'Stylish home near Sukhna Lake with open balcony views.', beds: '2 bedrooms · 3 beds · 2 bathrooms' },
  { id: 5,  lat: 30.7046, lng: 76.7179, title: 'Home in Sahibzada Ajit Singh Nagar', location: 'Home in Sahibzada Ajit Singh Nagar', price: '₹9,760 for 2 nights',  rating: '5.0',  image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80', isGuestFavorite: true,  description: 'Newly built home in a quiet gated community.', beds: '3 bedrooms · 4 beds · 2 bathrooms' },
  { id: 6,  lat: 30.7300, lng: 76.7750, title: 'Room in Chandigarh',                 location: 'Room in Chandigarh',                 price: '₹5,079 for 2 nights',  rating: '4.97', image: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800&q=80', isGuestFavorite: true,  description: 'Private en-suite room in a beautiful shared home.', beds: '1 bedroom · 1 bed · 1 bathroom' },
  { id: 7,  lat: 30.7100, lng: 76.7200, title: 'Home in Sahibzada Ajit Singh Nagar', location: 'Home in Sahibzada Ajit Singh Nagar', price: '₹14,488 for 2 nights', rating: '4.97', image: 'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=800&q=80', isGuestFavorite: true,  description: 'Spacious contemporary home with rooftop terrace.', beds: '4 bedrooms · 5 beds · 3 bathrooms' },
  { id: 8,  lat: 30.9031, lng: 76.9741, title: 'Home in Kasauli',                    location: 'Home in Kasauli',                    price: '₹27,389 for 2 nights', rating: '4.97', image: 'https://images.unsplash.com/photo-1613545325278-f24b0cae1224?w=800&q=80', isGuestFavorite: true,  description: 'Charming mountain cottage with panoramic valley views.', beds: '3 bedrooms · 4 beds · 2 bathrooms' },
  { id: 9,  lat: 30.8900, lng: 77.0100, title: 'Home in Dharmpur',                   location: 'Home in Dharmpur',                   price: '₹16,061 for 2 nights', rating: '5.0',  image: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?w=800&q=80', isGuestFavorite: false, description: 'Peaceful forest retreat with a natural stream nearby.', beds: '2 bedrooms · 2 beds · 1 bathroom' },
  { id: 10, lat: 30.9100, lng: 76.9800, title: 'Flat in Kasauli',                    location: 'Flat in Kasauli',                    price: '₹11,981 for 2 nights', rating: '4.8',  image: 'https://images.unsplash.com/photo-1502672023488-70e25813eb80?w=800&q=80', isGuestFavorite: true,  description: 'Cozy apartment with pine tree views and crisp mountain air.', beds: '2 bedrooms · 2 beds · 1 bathroom' },
  { id: 11, lat: 30.9045, lng: 77.0967, title: 'Flat in Solan',                      location: 'Flat in Solan',                      price: '₹10,500 for 2 nights', rating: '4.83', image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&q=80', isGuestFavorite: true,  description: 'Modern flat in a quiet hill town with apple orchards nearby.', beds: '2 bedrooms · 3 beds · 1 bathroom' },
  { id: 12, lat: 30.9000, lng: 76.9700, title: 'Cottage in Kasauli',                 location: 'Cottage in Kasauli',                 price: '₹19,765 for 2 nights', rating: '5.0',  image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80', isGuestFavorite: false, description: 'British-era stone cottage with original wooden floors.', beds: '2 bedrooms · 2 beds · 1 bathroom' },
  { id: 13, lat: 30.8950, lng: 76.9650, title: 'Flat in Kasauli',                    location: 'Flat in Kasauli',                    price: '₹27,342 for 2 nights', rating: '4.79', image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80', isGuestFavorite: false, description: 'Premium duplex flat with valley-facing balcony.', beds: '3 bedrooms · 4 beds · 2 bathrooms' },
  { id: 14, lat: 30.6442, lng: 76.8171, title: 'Apartment in Zirakpur',              location: 'Apartment in Zirakpur',              price: '₹4,200 for 2 nights',  rating: '4.88', image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80', isGuestFavorite: true,  description: 'Smart studio apartment in a well-connected locality.', beds: '1 bedroom · 1 bed · 1 bathroom' },
  { id: 15, lat: 30.6500, lng: 76.8200, title: 'Home in Zirakpur',                   location: 'Home in Zirakpur',                   price: '₹7,800 for 2 nights',  rating: '4.92', image: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&q=80', isGuestFavorite: false, description: 'Family home near NH-44 with ample parking.', beds: '3 bedrooms · 4 beds · 2 bathrooms' },
  { id: 16, lat: 30.6350, lng: 76.8150, title: 'Flat in Zirakpur',                   location: 'Flat in Zirakpur',                   price: '₹5,500 for 2 nights',  rating: '4.75', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80', isGuestFavorite: true,  description: 'Affordable flat with all modern amenities included.', beds: '2 bedrooms · 2 beds · 1 bathroom' },
  { id: 17, lat: 30.6400, lng: 76.8100, title: 'Studio in Zirakpur',                 location: 'Studio in Zirakpur',                 price: '₹3,900 for 2 nights',  rating: '4.82', image: 'https://images.unsplash.com/photo-1560185007-5f0bb1866cab?w=800&q=80', isGuestFavorite: false, description: 'Compact studio great for solo travellers or couples.', beds: 'Studio · 1 bed · 1 bathroom' },
  { id: 18, lat: 30.6480, lng: 76.8250, title: 'Villa in Zirakpur',                  location: 'Villa in Zirakpur',                  price: '₹12,400 for 2 nights', rating: '4.96', image: 'https://images.unsplash.com/photo-1600047509358-9dc75507daeb?w=800&q=80', isGuestFavorite: true,  description: 'Spacious independent villa with garden, terrace and garage.', beds: '4 bedrooms · 6 beds · 3 bathrooms' },
];

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ where?: string; checkin?: string; checkout?: string; guests?: string }>;
}) {
  const params = await searchParams;
  const { where, checkin, checkout, guests } = params;
  const isSearching = !!(where || checkin || guests);

  const filtered = isSearching && where
    ? ALL_PROPERTIES.filter(p =>
        p.location.toLowerCase().includes(where.toLowerCase())
      )
    : isSearching
    ? ALL_PROPERTIES
    : null;

  const chandigarhHomes = ALL_PROPERTIES.filter(p => p.location.toLowerCase().includes('chandigarh'));
  const kasauliHomes    = ALL_PROPERTIES.filter(p => ['kasauli','dharmpur','solan'].some(k => p.location.toLowerCase().includes(k)));
  const zirakpurHomes   = ALL_PROPERTIES.filter(p => p.location.toLowerCase().includes('zirakpur'));

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {isSearching && <FilterBar />}

      {isSearching ? (
        /* ─── Search Results: split card list + map ─── */
        <div className="flex h-[calc(100vh-130px)]">

          {/* Left: scrollable card list */}
          <div className="flex-1 overflow-y-auto px-6 xl:px-10 py-5 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-semibold text-gray-900">
                {filtered && filtered.length > 0
                  ? `${filtered.length} home${filtered.length !== 1 ? 's' : ''}${where ? ` in ${where}` : ''}`
                  : `No homes found${where ? ` in "${where}"` : ''}`}
              </h1>
              <div className="flex items-center gap-2 text-sm text-[#FF385C] font-semibold">
                <svg className="h-4 w-4 fill-[#FF385C]" viewBox="0 0 32 32"><path d="M16 1C10.3 1 5.1 5.3 3.3 11.1c-1 3.4-.4 7 1.6 9.9 1.6 2.3 3.8 4.2 5.7 6.1 1.2 1.2 2.4 2.5 3.3 3.9.4.6.7 1.2 1.1 1.8.1.2.4.2.6 0 .4-.6.7-1.2 1.1-1.8.9-1.4 2.1-2.7 3.3-3.9 1.9-1.9 4.1-3.8 5.7-6.1 2-2.9 2.6-6.5 1.6-9.9C25 5.3 19.7 1 16 1z"/></svg>
                Prices include all fees
              </div>
            </div>

            {filtered && filtered.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-10 pr-2">
                {filtered.map(p => (
                  <PropertyCard key={p.id} {...p} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="text-6xl mb-4">🔍</div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">No exact matches</h2>
                <p className="text-gray-500 max-w-xs mb-6">Try a different destination or adjust your dates.</p>
                <Link href="/" className="bg-gray-900 text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-gray-700 transition">
                  Browse all homes
                </Link>
              </div>
            )}
          </div>

          {/* Right: sticky map */}
          <div className="hidden lg:block w-[45%] xl:w-[50%] flex-shrink-0 sticky top-0 h-full p-4 pl-0">
            <MapView properties={filtered} />
          </div>
        </div>
      ) : (
        /* ─── Default discovery view ─── */
        <main className="pb-36 pt-6">
          <PropertySection title="Popular homes in Chandigarh"       properties={chandigarhHomes} />
          <PropertySection title="Available in Kasauli this weekend" properties={kasauliHomes} />
          <PropertySection title="Stay in Zirakpur"                  properties={zirakpurHomes} />
          <FloatingPriceToggle />
        </main>
      )}
    </div>
  );
}
