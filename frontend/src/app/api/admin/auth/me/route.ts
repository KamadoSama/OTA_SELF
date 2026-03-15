import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;
const SESSION_COOKIE = 'ota_admin_session';

export async function GET(req: NextRequest) {
  const email = req.cookies.get(SESSION_COOKIE)?.value;

  if (!email) {
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  }

  // Forward to backend with the email as a header so backend can verify
  const backendRes = await fetch(`${BACKEND_URL}/api/admin/auth/me`, {
    headers: {
      'Cookie': req.headers.get('cookie') ?? '',
    },
  });

  const data = await backendRes.json();
  return NextResponse.json(data, { status: backendRes.status });
}
