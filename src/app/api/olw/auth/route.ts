import { NextRequest, NextResponse } from 'next/server';

const OLW_PASSWORD = process.env.OLW_PASSWORD || 'victory2026';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { password } = body;

  if (password === OLW_PASSWORD) {
    const response = NextResponse.json({ success: true });
    response.cookies.set('olw-auth', 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
    });
    return response;
  }

  return NextResponse.json({ success: false, error: 'Invalid password' }, { status: 401 });
}
