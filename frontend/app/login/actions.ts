'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

const BACKEND = process.env.BACKEND_URL || 'http://localhost:8000'

export async function login(formData: FormData) {
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const res = await fetch(`${BACKEND}/auth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    redirect(`/login?message=${err.detail || 'Login failed'}`)
  }

  const json = await res.json()
  // set HttpOnly cookie for frontend using Next.js cookies API
  try {
    const cookieStore = await cookies();
    cookieStore.set({ name: 'access_token', value: json.access_token, httpOnly: true, path: '/' })
  } catch (e) {
    // best-effort; continue
  }

  revalidatePath('/', 'layout')
  redirect('/private')
}

export async function signup(formData: FormData) {
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const res = await fetch(`${BACKEND}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    redirect(`/login?message=${err.detail || 'Signup failed'}`)
  }

  // auto-login after signup
  const tokenRes = await fetch(`${BACKEND}/auth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (tokenRes.ok) {
    const json = await tokenRes.json()
    try {
      const cookieStore = await cookies();
      cookieStore.set({ name: 'access_token', value: json.access_token, httpOnly: true, path: '/' })
    } catch {}
  }

  revalidatePath('/', 'layout')
  redirect('/private')
}
