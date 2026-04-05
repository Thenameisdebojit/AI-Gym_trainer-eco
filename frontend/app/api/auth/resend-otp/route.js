export async function POST(request) {
  try {
    const body = await request.json();
    const res = await fetch('http://localhost:8000/auth/resend-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return Response.json(data, { status: res.status });
  } catch {
    return Response.json({ detail: 'Backend unreachable' }, { status: 503 });
  }
}
