export async function POST(request) {
  try {
    const body = await request.json();
    const { message = '', language = 'en' } = body;
    const res = await fetch(
      `http://localhost:8000/chat/?message=${encodeURIComponent(message)}&language=${encodeURIComponent(language)}`,
      { method: 'POST' }
    );
    const data = await res.json();
    return Response.json(data);
  } catch {
    return Response.json({ error: 'Backend unreachable' }, { status: 503 });
  }
}
