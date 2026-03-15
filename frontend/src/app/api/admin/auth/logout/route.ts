import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;
const SESSION_COOKIE = 'ota_admin_session';

export async function POST() {
  await fetch(`${BACKEND_URL}/api/admin/auth/logout`, { method: 'POST' });

  const res = NextResponse.json({ success: true });
  res.cookies.delete(SESSION_COOKIE);
  return res;
}