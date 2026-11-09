import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const backendUrl = process.env.INTERNAL_API_URL || 'http://ota_backend:3001';
  try {
    const res = await fetch(`${backendUrl}/api/auth/setup/status`, {
      cache: 'no-store',
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error: any) {
    return NextResponse.json(
      { needsSetup: true, error: error.message },
      { status: 500 },
    );
  }
}

