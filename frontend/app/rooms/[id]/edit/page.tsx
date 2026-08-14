import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function EditListingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value
  const res = await fetch(process.env.BACKEND_URL ? `${process.env.BACKEND_URL}/listings/${id}` : `http://localhost:8000/listings/${id}`, { cache: 'no-store' })
  if (!res.ok) redirect('/')
  const listing = await res.json()

  'use server'
  async function save(formData: FormData) {
    const data = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      price: Number(formData.get('price')) || 0,
      address: formData.get('address') as string,
      city: formData.get('city') as string,
      country: formData.get('country') as string,
    }
    // upload image if provided
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

    await fetch(process.env.BACKEND_URL ? `${process.env.BACKEND_URL}/listings/${id}` : `http://localhost:8000/listings/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: JSON.stringify(data),
    })
    redirect(`/rooms/${id}`)
  }

  return (
    <div className="max-w-3xl mx-auto py-12">
      <h1 className="text-2xl font-semibold mb-6">Edit listing</h1>
      <form action={save} className="grid grid-cols-1 gap-4">
        <input name="title" defaultValue={listing.title} placeholder="Title" required className="p-3 border rounded" />
        <textarea name="description" defaultValue={listing.description} placeholder="Description" required className="p-3 border rounded h-32" />
        <input name="price" defaultValue={listing.price} placeholder="Price (decimal)" required inputMode="numeric" className="p-3 border rounded" />
        <input name="address" defaultValue={listing.address} placeholder="Address" className="p-3 border rounded" />
        <input name="city" defaultValue={listing.city} placeholder="City" className="p-3 border rounded" />
        <input name="country" defaultValue={listing.country} placeholder="Country" className="p-3 border rounded" />
        <input name="image" type="file" accept="image/*" className="p-3" />
        <div className="pt-4">
          <button type="submit" className="bg-gray-900 text-white px-4 py-2 rounded">Save</button>
        </div>
      </form>
    </div>
  )
}
