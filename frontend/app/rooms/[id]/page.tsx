import { Navbar } from "@/components/navbar";
import { RoomHeader } from "@/components/room/room-header";
import { ImageGallery } from "@/components/room/image-gallery";
import { MainInfo } from "@/components/room/main-info";
import { FeaturesList } from "@/components/room/features-list";
import { RoomDescription } from "@/components/room/room-description";
import { Amenities } from "@/components/room/amenities";
import { BookingSidebar } from "@/components/room/booking-sidebar";
import { ReviewsSection } from "@/components/room/reviews-section";
import { MapSection } from "@/components/room/map-section";
import { RoomCalendar } from "@/components/room/room-calendar";
import { Fan, KeyRound, Home, MapPin, CircleParking, Medal } from "lucide-react";
import { Utensils, Wifi, Car, Tv, WashingMachine, Snowflake, Ban } from "lucide-react";

import { cookies } from 'next/headers';

export default async function RoomPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;
  const listingRes = await fetch(process.env.BACKEND_URL ? `${process.env.BACKEND_URL}/listings/${id}` : `http://localhost:8000/listings/${id}`, { cache: 'no-store' })
  if (!listingRes.ok) return (<div>Listing not found</div>)
  const listing = await listingRes.json()

  // determine current user to show host controls
  let currentUser = null
  if (token) {
    try {
      const meRes = await fetch(process.env.BACKEND_URL ? `${process.env.BACKEND_URL}/auth/me` : 'http://localhost:8000/auth/me', { 
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store' 
      })
      if (meRes.ok) currentUser = await meRes.json()
    } catch {}
  }

  // Mock Data fallback
  const mockFeatures = [
    {
      icon: MapPin,
      title: "Beautiful area",
      description: "Guests love this home’s scenic location.",
    },
    {
      icon: CircleParking,
      title: "Park for free",
      description: "This is one of the few places in the area with free parking.",
    },
    {
      icon: Medal,
      title: "Nidhi is a Superhost",
      description: "Superhosts are experienced, highly rated hosts.",
    }
  ];

  const mockDescription = `This beautiful stay is located in Chandigarh.
It is just 2 kms away from International Cricket Stadium Mullanpur, 2kms away from PGIMER and Punjab University, 4kms away from sector 17, and Elante Mall is just few miles away from our location.
You can stay here with your friends and family to spending quality time. Fully independent 2 bhk apartment with lots of amenities.

Do expect power cuts due to increasing temperatures💡. (Battery backup Inverter ...`;

  const mockAmenities = [
    { icon: Utensils, name: "Kitchen" },
    { icon: Wifi, name: "Wifi – 16 Mbps" },
    { icon: Car, name: "Free on-street parking" },
    { icon: Tv, name: "TV" },
    { icon: WashingMachine, name: "Washing machine" },
    { icon: Snowflake, name: "Air conditioning" },
    { icon: Home, name: "Shared patio or balcony" }, // Assuming a generic home icon for patio
    { icon: Snowflake, name: "LG refrigerator" }, // Reuse for fridge
    { icon: Ban, name: "Carbon monoxide alarm", crossedOut: true },
    { icon: Ban, name: "Smoke alarm", crossedOut: true },
  ];

  const mockReviews = [
    {
      id: "1",
      authorName: "Shweta",
      timeOnAirbnb: "6 years on Airbnb",
      rating: 5,
      date: "5 days ago",
      text: "Had a wonderful stay! The place was spotless, cozy, and very well maintained. Everything was just perfect, and the host was extremely helpful and responsive. Highly recommended!"
    },
    {
      id: "2",
      authorName: "Gourav",
      timeOnAirbnb: "New to Airbnb",
      rating: 5,
      date: "1 week ago",
      text: "We had a great stay! The place was exactly as described—clean, comfortable, and well-maintained. The host was friendly, responsive, and made the entire experience smooth..."
    },
    {
      id: "3",
      authorName: "Bbl",
      timeOnAirbnb: "3 years on Airbnb",
      rating: 5,
      date: "1 week ago",
      text: "Liked there stay they were very understanding and helpful and place was clean"
    },
    {
      id: "4",
      authorName: "Akshit",
      timeOnAirbnb: "New to Airbnb",
      rating: 5,
      date: "3 days ago",
      text: "Worth the money"
    },
    {
      id: "5",
      authorName: "Himanshu",
      timeOnAirbnb: "11 months on Airbnb",
      rating: 4,
      date: "July 2026",
      text: "Friendly and responsive host, and the property was clean and well-maintained throughout. The one thing to flag is the location..."
    },
    {
      id: "6",
      authorName: "Prerna",
      timeOnAirbnb: "1 year on Airbnb",
      rating: 5,
      date: "1 week ago",
      text: "We had a wonderful stay !! It felt like home .\nThe place is really neat and well furnished with all the amenities..."
    }
  ];

  const reviewCategories = [
    { name: "Cleanliness", score: 5.0, icon: "🧹" },
    { name: "Accuracy", score: 4.9, icon: "✓" },
    { name: "Check-in", score: 5.0, icon: "🔑" },
    { name: "Communication", score: 5.0, icon: "💬" },
    { name: "Location", score: 4.6, icon: "🗺️" },
    { name: "Value", score: 4.8, icon: "🏷️" },
  ];

  return (
    <>
      <Navbar userEmail={currentUser?.email} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-20 pb-12">
        <RoomHeader title={listing.title} />
        <ImageGallery images={listing.image ? [listing.image, listing.image, listing.image, listing.image, listing.image] : ["/placeholder.jpg", "/placeholder.jpg", "/placeholder.jpg", "/placeholder.jpg", "/placeholder.jpg"]} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-4 relative">
          {/* Main Content Column */}
          <div className="lg:col-span-2">
            <MainInfo 
              location={`Entire home in ${listing.city || 'Unknown'}, ${listing.country || 'Unknown'}`}
              guests={4}
              bedrooms={2}
              beds={4}
              bathrooms={2.5}
              rating={4.89}
              reviews={85}
              hostName="Nidhi"
              hostExperience="Superhost · 5 months hosting"
            />
            <FeaturesList features={mockFeatures} />
            <RoomDescription description={mockDescription} />
            
            {/* Where you'll sleep - static mock for now */}
            <div className="py-8 border-b border-neutral-200">
                <h2 className="text-[22px] font-semibold mb-6">Where you'll sleep</h2>
                {/* Simplified version */}
                <div className="p-6 border border-neutral-200 rounded-xl w-64">
                    <Home className="w-8 h-8 mb-4" />
                    <div className="font-semibold text-lg">Bedroom</div>
                    <div className="text-sm text-neutral-600">1 double bed</div>
                </div>
            </div>
            
            <Amenities amenities={mockAmenities} />
            
            <RoomCalendar />
          </div>
          
          {/* Sticky Sidebar Column */}
          <div className="relative">
            <div className="sticky top-24 pt-8">
              <BookingSidebar pricePerNight={listing.price} listingId={Number(id)} token={token} />
              {currentUser && currentUser.id === listing.host_id && (
                <div className="mt-4">
                  <a href={`/rooms/${id}/edit`} className="block bg-gray-200 px-3 py-2 rounded mb-2">Edit listing</a>
                  <form action={async () => {
                    'use server'
                    const token = null
                    await fetch(process.env.BACKEND_URL ? `${process.env.BACKEND_URL}/listings/${id}` : `http://localhost:8000/listings/${id}`, {
                      method: 'DELETE',
                    })
                    // redirect (client will navigate)
                    window.location.href = '/'
                  }}>
                    <button type="button" onClick={async () => { if (confirm('Delete listing?')) { const res = await fetch(process.env.BACKEND_URL ? `${process.env.BACKEND_URL}/listings/${id}` : `http://localhost:8000/listings/${id}`, { method: 'DELETE', credentials: 'include' }); if (res.ok) window.location.href = '/'; else alert('Delete failed') } }} className="w-full bg-red-600 text-white px-3 py-2 rounded">Delete listing</button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Full width reviews section */}
        <ReviewsSection 
            overallRating={4.89}
            totalReviews={85}
            categories={reviewCategories}
            reviews={mockReviews}
        />
        
        {/* Full width map section */}
        <MapSection 
          location={`${listing.city || 'Unknown'}, ${listing.country || 'Unknown'}`}
          latitude={listing.latitude}
          longitude={listing.longitude}
        />
      </main>
    </>
  );
}
