// app/api/auth/me/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const authToken = cookieStore.get('auth_token')?.value;
    const authUser = cookieStore.get('auth_user')?.value;

    if (!authToken || !authUser) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    try {
      const user = JSON.parse(authUser);

      // Validate user structure
      if (!user || !user.id || !user.email || !user.role) {
        return NextResponse.json(
          { error: 'Invalid user data' },
          { status: 401 }
        );
      }

      return NextResponse.json({
        user,
        access_token: authToken,
      });
    } catch (parseError) {
      return NextResponse.json({ error: 'Invalid user data' }, { status: 401 });
    }
  } catch (error) {
    console.error('Auth me error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
