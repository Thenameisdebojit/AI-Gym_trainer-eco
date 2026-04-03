export async function POST(request) {
  try {
    const body = await request.json();
    const res = await fetch('http://localhost:8000/sessions/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return Response.json(data);
  } catch {
    return Response.json({ error: 'Backend unreachable' }, { status: 503 });
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') || 20;
    const type = searchParams.get('type') || 'history';
    const endpoint = type === 'stats' ? '/sessions/stats' : `/sessions/history?limit=${limit}`;
    const res = await fetch(`http://localhost:8000${endpoint}`);
    const data = await res.json();
    return Response.json(data);
  } catch {
    return Response.json({ error: 'Backend unreachable' }, { status: 503 });
  }
}
