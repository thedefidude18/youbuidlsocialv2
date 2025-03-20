import { NextResponse } from 'next/server'
import { SiweMessage } from 'siwe'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  try {
    const { message, signature } = await request.json()
    
    const siweMessage = new SiweMessage(message)
    const fields = await siweMessage.verify({ signature })
    
    if (fields.success) {
      // Store session
      cookies().set('auth-session', JSON.stringify({
        address: fields.data.address,
        chainId: fields.data.chainId,
        issuedAt: fields.data.issuedAt
      }), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/'
      })

      return NextResponse.json({ success: true })
    }
    
    return NextResponse.json({ success: false, error: 'Invalid signature' })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Verification failed' })
  }
}