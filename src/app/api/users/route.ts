import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Create basic user profile
    const userProfile = {
      id: data.address.toLowerCase(),
      address: data.address,
      name: `User_${data.address.substring(2, 8)}`,
      username: `user_${data.address.substring(2, 8)}`.toLowerCase(),
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.address}`,
      verified: false,
      posts: 0,
      bio: '',
      joinedDate: new Date().toISOString()
    };

    // For now, we'll just return the profile
    // In production, you'd want to store this in your database
    return NextResponse.json(userProfile);
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Failed to create user profile' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get('address');

  if (!address) {
    return NextResponse.json({ error: 'Address is required' }, { status: 400 });
  }

  // For now, return a mock profile
  // In production, you'd want to fetch this from your database
  const userProfile = {
    id: address.toLowerCase(),
    address: address,
    name: `User_${address.substring(2, 8)}`,
    username: `user_${address.substring(2, 8)}`.toLowerCase(),
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${address}`,
    verified: false,
    posts: 0,
    bio: '',
    joinedDate: new Date().toISOString()
  };

  return NextResponse.json(userProfile);
}