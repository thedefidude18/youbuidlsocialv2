import { NextResponse } from 'next/server'
import { generateNonce } from 'siwe'

export async function GET() {
  const nonce = generateNonce()
  return new NextResponse(nonce)
}