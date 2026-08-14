'use server'

import { cookies } from 'next/headers'

const BACKEND = process.env.BACKEND_URL || 'http://localhost:8000'

export async function createBooking(listingId: number, checkin: string, checkout: string, total: number) {
  const cookieStore = await cookies()
  const token = cookieStore.get('access_token')?.value

  if (!token) {
    return { success: false, error: 'Not authenticated' }
  }

  try {
    // Create booking
    const bookingRes = await fetch(`${BACKEND}/bookings/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        listing_id: listingId,
        start_date: checkin,
        end_date: checkout,
        total_price: total
      })
    })

    if (!bookingRes.ok) {
      const err = await bookingRes.json().catch(() => ({}))
      return { success: false, error: err.detail || 'Booking failed' }
    }

    const bookingData = await bookingRes.json()

    // Mock charge (passing amount as query param since backend expects it there)
    const payRes = await fetch(`${BACKEND}/payments/mock-charge?amount=${total}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    if (!payRes.ok) {
      return { success: false, error: 'Payment failed' }
    }

    const payData = await payRes.json()
    return { success: true, transaction_id: payData.transaction_id, booking: bookingData }
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : String(e) }
  }
}
