import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET() {
  const sessionCookie = cookies().get('auth-session')
  
  if (!sessionCookie) {
    return NextResponse.json({ 
      authenticated: false 
    })
  }

  try {
    const session = JSON.parse(sessionCookie.value)
    return NextResponse.json({
      authenticated: true,
      address: session.address
    })
  } catch (error) {
    return NextResponse.json({ 
      authenticated: false 
    })
  }
}