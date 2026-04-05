export async function POST(request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token') || '';
    if (token) {
      await fetch(`http://localhost:8000/auth/logout?token=${token}`, { method: 'POST' });
    }
  } catch {}
  return Response.json({ message: 'Logged out' });
}
