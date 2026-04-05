import { BACKEND_URL } from '../../../../lib/backend';

export async function POST(request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token') || '';
    if (token) {
      await fetch(`${BACKEND_URL}/auth/logout?token=${token}`, { method: 'POST' });
    }
  } catch {}
  return Response.json({ message: 'Logged out' });
}
