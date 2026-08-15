import { cookies } from 'next/headers';
import { Navbar } from "@/components/navbar";
import { PropertySection } from "@/components/property-section";
import { FloatingPriceToggle } from "@/components/floating-price-toggle";
import { FilterBar } from "@/components/filter-bar";
import { MapView } from "@/components/map-view";
import { PropertyCard } from "@/components/property-card";
import Link from "next/link";

const BACKEND = process.env.BACKEND_URL || 'http://localhost:8000'

async function fetchListings() {
  try {
    const res = await fetch(`${BACKEND}/listings`, { cache: 'no-store' })
    if (!res.ok) return null
    return await res.json()
  } catch (e) {
    return null
  }
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ where?: string; checkin?: string; checkout?: string; guests?: string }>;
}) {
  const params = await searchParams;
  const { where, checkin, checkout, guests } = params;

  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;
  let userEmail = undefined;
  if (token) {
    try {
      const authRes = await fetch(`${BACKEND}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store',
      });
      if (authRes.ok) {
        const json = await authRes.json();
        userEmail = json.email;
      }
    } catch (e) {}
  }
  const isSearching = !!(where || checkin || guests);
  const listings = await fetchListings()
  const ALL_PROPERTIES = listings && Array.isArray(listings) ? listings.map(l => ({
    id: l.id,
    title: l.title,
    location: l.city || l.address || 'Unknown',
    price: `₹${l.price} per night`,
    rating: '4.9',
    image: l.image ? (l.image.startsWith('http') ? l.image : `${BACKEND}${l.image}`) : 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
    description: l.description || '',
    latitude: l.latitude,
    longitude: l.longitude,
  })) : []

  const filtered = isSearching && where
    ? ALL_PROPERTIES.filter(p => p.location.toLowerCase().includes(where.toLowerCase()))
    : isSearching
    ? ALL_PROPERTIES
    : null;

  const chandigarhHomes = ALL_PROPERTIES.filter(p => p.location.toLowerCase().includes('chandigarh'));
  const kasauliHomes    = ALL_PROPERTIES.filter(p => ['kasauli','dharmpur','solan'].some(k => p.location.toLowerCase().includes(k)));
  const zirakpurHomes   = ALL_PROPERTIES.filter(p => p.location.toLowerCase().includes('zirakpur'));

  return (
    <div className="min-h-screen bg-white">
      <Navbar userEmail={userEmail} />

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
