import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function NewListingPage() {
  async function createListing(formData: FormData) {
    'use server'
    const city = formData.get('city') as string;
    const country = formData.get('country') as string;
    let latitude: number | undefined;
    let longitude: number | undefined;

    if (city && country) {
      try {
        const nomRes = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city + ', ' + country)}&format=json&limit=1`, {
          headers: { 'User-Agent': 'AirbnbClone/1.0' }
        })
        const nomData = await nomRes.json()
        if (nomData && nomData.length > 0) {
          latitude = parseFloat(nomData[0].lat)
          longitude = parseFloat(nomData[0].lon)
        }
      } catch (e) {}
    }

    const data: any = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      price: Number(formData.get('price')) || 0,
      address: formData.get('address') as string,
      city,
      country,
    }
    if (latitude !== undefined) data.latitude = latitude;
    if (longitude !== undefined) data.longitude = longitude;

    const cookieStore = await cookies();
    const token = cookieStore.get('access_token')?.value

    // handle image upload if present
    const imageFile = formData.get('image') as File | null
    if (imageFile && imageFile.size > 0) {
      const uploadForm = new FormData()
      uploadForm.append('file', imageFile, (imageFile as any).name || 'upload.jpg')
      const uploadRes = await fetch(process.env.BACKEND_URL ? `${process.env.BACKEND_URL}/upload/image` : 'http://localhost:8000/upload/image', {
        method: 'POST',
        body: uploadForm,
      })
      if (uploadRes.ok) {
        const up = await uploadRes.json().catch(() => null)
        if (up && up.url) data.image = up.url
      }
    }

    const res = await fetch(process.env.BACKEND_URL ? `${process.env.BACKEND_URL}/listings/` : 'http://localhost:8000/listings/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(data),
    })

    if (!res.ok) {
      // simple error handling: redirect back with message
      const err = await res.json().catch(() => ({}))
      redirect(`/rooms/new?error=${encodeURIComponent(err.detail || 'Failed to create')}`)
    }

    // created — go to home for now
    redirect('/')
  }

  return (
    <div className="max-w-3xl mx-auto py-12">
      <h1 className="text-2xl font-semibold mb-6">Create a new listing</h1>
      <form action={createListing} className="grid grid-cols-1 gap-4">
        <input name="title" placeholder="Title" required className="p-3 border rounded" />
        <textarea name="description" placeholder="Description" required className="p-3 border rounded h-32" />
        <input name="price" placeholder="Price (decimal)" required inputMode="numeric" className="p-3 border rounded" />
        <input name="address" placeholder="Address" className="p-3 border rounded" />
        <input name="city" placeholder="City" className="p-3 border rounded" />
        <input name="country" placeholder="Country" className="p-3 border rounded" />
        <input name="image" type="file" accept="image/*" className="p-3" />
        <div className="pt-4">
          <button type="submit" className="bg-gray-900 text-white px-4 py-2 rounded">Create listing</button>
        </div>
      </form>
    </div>
  )
}
