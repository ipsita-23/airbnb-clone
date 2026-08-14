import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { Navbar } from "@/components/navbar";
import { PropertyCard } from "@/components/property-card";

export default async function TripsPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get('access_token')?.value

  if (!token) {
    redirect('/login')
  }

  let userEmail = undefined
  let userName = undefined
  let bookings = []

  try {
    // Fetch user details
    const userRes = await fetch(process.env.BACKEND_URL ? `${process.env.BACKEND_URL}/auth/me` : 'http://localhost:8000/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    })
    if (!userRes.ok) redirect('/login')
    const userJson = await userRes.json()
    userEmail = userJson.email
    userName = userJson.name

    // Fetch user's bookings
    const bookingsRes = await fetch(process.env.BACKEND_URL ? `${process.env.BACKEND_URL}/bookings/me` : 'http://localhost:8000/bookings/me', {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    })
    if (bookingsRes.ok) {
      bookings = await bookingsRes.json()
    }
  } catch (e) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar userEmail={userEmail} />
      <main className="max-w-7xl mx-auto px-6 xl:px-10 py-10">
        <div className="mb-10">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">Welcome back, {userName || userEmail}!</h1>
          <p className="text-gray-500">Manage your profile and upcoming trips here.</p>
        </div>

        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Your Trips</h2>

        {bookings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {bookings.map((booking: any) => (
              <div key={booking.id} className="flex flex-col gap-2">
                <PropertyCard 
                  id={booking.listing.id}
                  image={booking.listing.image?.startsWith('http') ? booking.listing.image : `${process.env.BACKEND_URL || 'http://localhost:8000'}${booking.listing.image}`}
                  location={`${booking.listing.city || 'Unknown'}, ${booking.listing.country || 'Unknown'}`}
                  title={booking.listing.title}
                  price={`Total: ₹${booking.total_price}`}
                  rating="4.9"
                  isGuestFavorite={true}
                />
                <div className="text-sm text-gray-600 px-1">
                  <p className="font-medium">Booked Dates:</p>
                  <p>{booking.start_date} to {booking.end_date}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 border-t">
            <p className="text-gray-500">You don't have any trips booked yet.</p>
            <a href="/" className="inline-block mt-4 bg-[#FF385C] text-white px-6 py-3 rounded-md font-semibold hover:bg-[#D90B38] transition">
              Start exploring
            </a>
          </div>
        )}
      </main>
    </div>
  );
}
