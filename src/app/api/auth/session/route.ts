// app/api/auth/session/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();

    // Get auth cookies
    const authToken = cookieStore.get('auth_token')?.value;
    const authUser = cookieStore.get('auth_user')?.value;

    console.log(
      'Session API - Token exists:',
      !!authToken,
      'User exists:',
      !!authUser
    );

    if (!authToken || !authUser) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    try {
      // Parse user data from cookie
      const userData = JSON.parse(authUser);

      // Validate required fields
      if (!userData?.id || !userData?.email || !userData?.role) {
        console.log('Invalid user data structure:', userData);
        return NextResponse.json(
          { error: 'Invalid user data' },
          { status: 401 }
        );
      }

      // Return session data
      return NextResponse.json({
        user: userData,
        access_token: authToken,
      });
    } catch (parseError) {
      console.error('Failed to parse user data:', parseError);
      return NextResponse.json(
        { error: 'Invalid user data format' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Session API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
