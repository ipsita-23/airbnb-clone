import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { Navbar } from "@/components/navbar";
import { PropertySection } from "@/components/property-section";
import { FloatingPriceToggle } from "@/components/floating-price-toggle";

export default async function PrivatePage() {
  const cookieStore = await cookies()
  const token = cookieStore.get('access_token')?.value
  let userEmail = undefined
  if (!token) {
    redirect('/login')
  }
  try {
    const res = await fetch(process.env.BACKEND_URL ? `${process.env.BACKEND_URL}/auth/me` : 'http://localhost:8000/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    })
    if (!res.ok) redirect('/login')
    const json = await res.json()
    userEmail = json.email
  } catch (e) {
    redirect('/login')
  }

  async function signOut() {
    'use server'
    const supabase = await createClient()
    await supabase.auth.signOut()
    revalidatePath('/', 'layout')
    redirect('/')
  }

  const chandigarhHomes = [
    { id: 1,  title: 'Home in Chandigarh',                 location: 'Home in Chandigarh',                 price: '₹8,330 for 2 nights',  rating: '4.89', image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80', isGuestFavorite: true },
    { id: 2,  title: 'Home in Chandigarh',                 location: 'Home in Chandigarh',                 price: '₹20,998 for 2 nights', rating: '4.95', image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80', isGuestFavorite: true },
    { id: 3,  title: 'Home in Chandigarh',                 location: 'Home in Chandigarh',                 price: '₹17,808 for 2 nights', rating: '5.0',  image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80', isGuestFavorite: true },
    { id: 4,  title: 'Home in Chandigarh',                 location: 'Home in Chandigarh',                 price: '₹11,742 for 2 nights', rating: '4.95', image: 'https://images.unsplash.com/photo-1502672260266-1c1de2d93688?w=800&q=80', isGuestFavorite: true },
    { id: 5,  title: 'Home in Sahibzada Ajit Singh Nagar', location: 'Home in Sahibzada Ajit Singh Nagar', price: '₹9,760 for 2 nights',  rating: '5.0',  image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80', isGuestFavorite: true },
    { id: 6,  title: 'Room in Chandigarh',                 location: 'Room in Chandigarh',                 price: '₹5,079 for 2 nights',  rating: '4.97', image: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800&q=80', isGuestFavorite: true },
    { id: 7,  title: 'Home in Sahibzada Ajit Singh Nagar', location: 'Home in Sahibzada Ajit Singh Nagar', price: '₹14,488 for 2 nights', rating: '4.97', image: 'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=800&q=80', isGuestFavorite: true },
  ];

  const kasauliHomes = [
    { id: 8,  title: 'Home in Kasauli',    location: 'Home in Kasauli',    price: '₹27,389 for 2 nights', rating: '4.97', image: 'https://images.unsplash.com/photo-1613545325278-f24b0cae1224?w=800&q=80', isGuestFavorite: true },
    { id: 9,  title: 'Home in Dharmpur',   location: 'Home in Dharmpur',   price: '₹16,061 for 2 nights', rating: '5.0',  image: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?w=800&q=80', isGuestFavorite: false },
    { id: 10, title: 'Flat in Kasauli',    location: 'Flat in Kasauli',    price: '₹11,981 for 2 nights', rating: '4.8',  image: 'https://images.unsplash.com/photo-1502672023488-70e25813eb80?w=800&q=80', isGuestFavorite: true },
    { id: 11, title: 'Flat in Solan',      location: 'Flat in Solan',      price: '₹10,500 for 2 nights', rating: '4.83', image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&q=80', isGuestFavorite: true },
    { id: 12, title: 'Cottage in Kasauli', location: 'Cottage in Kasauli', price: '₹19,765 for 2 nights', rating: '5.0',  image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80', isGuestFavorite: false },
    { id: 13, title: 'Flat in Kasauli',    location: 'Flat in Kasauli',    price: '₹27,342 for 2 nights', rating: '4.79', image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80', isGuestFavorite: false },
  ];

  const zirakpurHomes = [
    { id: 14, title: 'Apartment in Zirakpur', location: 'Apartment in Zirakpur', price: '₹4,200 for 2 nights',  rating: '4.88', image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80', isGuestFavorite: true },
    { id: 15, title: 'Home in Zirakpur',      location: 'Home in Zirakpur',      price: '₹7,800 for 2 nights',  rating: '4.92', image: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&q=80', isGuestFavorite: false },
    { id: 16, title: 'Flat in Zirakpur',      location: 'Flat in Zirakpur',      price: '₹5,500 for 2 nights',  rating: '4.75', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80', isGuestFavorite: true },
    { id: 17, title: 'Studio in Zirakpur',    location: 'Studio in Zirakpur',    price: '₹3,900 for 2 nights',  rating: '4.82', image: 'https://images.unsplash.com/photo-1560185007-5f0bb1866cab?w=800&q=80', isGuestFavorite: false },
    { id: 18, title: 'Villa in Zirakpur',     location: 'Villa in Zirakpur',     price: '₹12,400 for 2 nights', rating: '4.96', image: 'https://images.unsplash.com/photo-1600047509358-9dc75507daeb?w=800&q=80', isGuestFavorite: true },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar userEmail={userEmail} />
      <main className="pb-36 pt-6">
        <PropertySection title="Popular homes in Chandigarh"        properties={chandigarhHomes} />
        <PropertySection title="Available in Kasauli this weekend"  properties={kasauliHomes} />
        <PropertySection title="Stay in Zirakpur"                   properties={zirakpurHomes} />
      </main>
      <FloatingPriceToggle />
    </div>
  );
}
