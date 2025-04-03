import { NextResponse } from 'next/server';
import { PointsService } from '@/services/points-service';
import { cookies } from 'next/headers';

async function getAuthenticatedUser() {
  const sessionCookie = cookies().get('auth-session');
  if (!sessionCookie) {
    return null;
  }

  try {
    const session = JSON.parse(sessionCookie.value);
    return session.address ? { id: session.address.toLowerCase() } : null;
  } catch {
    return null;
  }
}

export async function POST(req: Request) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { action, postId } = await req.json();
    
    if (!['LIKE', 'COMMENT', 'POST', 'SHARE'].includes(action)) {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    const result = await PointsService.addPoints(
      user.id,
      postId,
      action
    );
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Points API error:', error);
    return NextResponse.json(
      { error: 'Failed to process points' },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(req.url);
    const view = url.searchParams.get('view');
    
    switch (view) {
      case 'leaderboard':
        const limit = parseInt(url.searchParams.get('limit') || '10');
        const leaderboard = await PointsService.getLeaderboard(limit);
        return NextResponse.json({ leaderboard });
        
      case 'history':
        const action = url.searchParams.get('action') || undefined;
        const history = await PointsService.getUserActionHistory(user.id, action);
        return NextResponse.json({ history });
        
      default:
        const points = await PointsService.getUserPoints(user.id);
        return NextResponse.json({ points });
    }
  } catch (error) {
    console.error('Points API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch points' },
      { status: 500 }
    );
  }
}