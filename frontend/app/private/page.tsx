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

  const BACKEND = process.env.BACKEND_URL || 'http://localhost:8000';
  let ALL_PROPERTIES: any[] = [];
  try {
    const listingsRes = await fetch(`${BACKEND}/listings`, { cache: 'no-store' });
    if (listingsRes.ok) {
      const listings = await listingsRes.json();
      if (Array.isArray(listings)) {
        ALL_PROPERTIES = listings.map((l: any) => ({
          id: l.id,
          title: l.title,
          location: l.city || l.address || 'Unknown',
          price: `₹${l.price} per night`,
          rating: '4.9',
          image: l.image ? (l.image.startsWith('http') ? l.image : `${BACKEND}${l.image}`) : 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
          description: l.description || '',
        }));
      }
    }
  } catch(e) {}

  const chandigarhHomes = ALL_PROPERTIES.filter(p => p.location.toLowerCase().includes('chandigarh'));
  const kasauliHomes    = ALL_PROPERTIES.filter(p => ['kasauli','dharmpur','solan'].some(k => p.location.toLowerCase().includes(k)));
  const zirakpurHomes   = ALL_PROPERTIES.filter(p => p.location.toLowerCase().includes('zirakpur'));

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
