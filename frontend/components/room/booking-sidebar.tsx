"use client";

import { ChevronDown, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface BookingSidebarProps {
  pricePerNight: number;
  listingId: number;
}

export function BookingSidebar({ pricePerNight, listingId }: BookingSidebarProps) {
  const [checkin, setCheckin] = useState('2026-08-21')
  const [checkout, setCheckout] = useState('2026-08-23')
  const [guests, setGuests] = useState(1)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  // Format price
  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(pricePerNight);

  return (
    <div className="sticky top-24">
      {/* Discount Banner */}
      <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-4 mb-6 flex items-center justify-between">
        <div className="flex gap-4">
          <Tag className="w-6 h-6 text-green-600 mt-1" />
          <div>
            <p className="font-semibold text-[15px]">Take 10% off your next stay.</p>
            <p className="text-[14px] text-neutral-500 underline">Terms apply</p>
          </div>
        </div>
        <Button variant="outline" className="bg-neutral-100 border-none font-medium h-8">
          Claim
        </Button>
      </div>

      {/* Booking Widget */}
      <div className="bg-white rounded-xl border border-neutral-200 shadow-xl p-6">
        <div className="mb-6">
          <span className="text-[22px] font-semibold">{formattedPrice}</span>
          <span className="text-neutral-500 ml-1">for 2 nights</span>
        </div>

        <div className="border border-neutral-400 rounded-lg mb-4 overflow-hidden">
          <div className="flex border-b border-neutral-400">
            <div className="w-1/2 p-3 border-r border-neutral-400">
              <div className="text-[10px] font-bold uppercase">Check-in</div>
              <div className="text-[14px] text-neutral-600">8/21/2026</div>
            </div>
            <div className="w-1/2 p-3">
              <div className="text-[10px] font-bold uppercase">Checkout</div>
              <div className="text-[14px] text-neutral-600">8/23/2026</div>
            </div>
          </div>
          <div className="p-3 flex justify-between items-center">
            <div>
              <div className="text-[10px] font-bold uppercase">Guests</div>
              <div className="text-[14px] text-neutral-600">1 guest</div>
            </div>
            <ChevronDown className="w-5 h-5 text-neutral-600" />
          </div>
        </div>

        <div className="bg-neutral-100 p-3 rounded-lg text-center text-[14px] text-neutral-800 mb-4">
          Free cancellation <span className="font-semibold">before 20 August</span>
        </div>

        <div className="grid gap-2 mb-4">
          <label className="text-sm">Check-in</label>
          <input type="date" value={checkin} onChange={e => setCheckin(e.target.value)} className="p-2 border rounded" />
          <label className="text-sm">Checkout</label>
          <input type="date" value={checkout} onChange={e => setCheckout(e.target.value)} className="p-2 border rounded" />
          <label className="text-sm">Guests</label>
          <input type="number" value={guests} min={1} onChange={e => setGuests(Number(e.target.value))} className="p-2 border rounded" />
        </div>

        <Button disabled={loading} onClick={async () => {
          setLoading(true)
          try {
            const nights = Math.max(1, Math.round((new Date(checkout).getTime() - new Date(checkin).getTime()) / (1000*60*60*24)))
            const total = pricePerNight * nights
            const bookingRes = await fetch(process.env.BACKEND_URL ? `${process.env.BACKEND_URL}/bookings/` : 'http://localhost:8000/bookings/', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include',
              body: JSON.stringify({ listing_id: listingId, start_date: checkin, end_date: checkout, total_price: total })
            })
            if (!bookingRes.ok) {
              const err = await bookingRes.json().catch(() => ({}))
              alert(err.detail || 'Booking failed')
              setLoading(false)
              return
            }
            // mock charge
            const payRes = await fetch(process.env.BACKEND_URL ? `${process.env.BACKEND_URL}/payments/mock-charge` : 'http://localhost:8000/payments/mock-charge', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include',
              body: JSON.stringify({ amount: total })
            })
            if (!payRes.ok) {
              alert('Payment failed')
              setLoading(false)
              return
            }
            const payJson = await payRes.json()
            alert(`Booking succeeded: ${payJson.transaction_id}`)
            router.push('/')
          } catch (e) {
            alert('Error creating booking')
          } finally {
            setLoading(false)
          }
        }} className="w-full bg-[#E31C5F] hover:bg-[#D70466] text-white py-6 text-[16px] font-semibold rounded-lg mb-4">
          {loading ? 'Processing…' : 'Reserve'}
        </Button>

        <div className="text-center text-neutral-500 text-[14px]">
          You won't be charged yet
        </div>
      </div>
      
      <div className="flex justify-center mt-6">
        <button className="flex items-center gap-2 text-neutral-500 hover:text-neutral-800 text-[14px] underline">
          <span className="text-lg pb-1">⚑</span> Report this listing
        </button>
      </div>
    </div>
  );
}
