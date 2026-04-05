export async function POST(request) {
  try {
    const body = await request.json();
    const { message = '', language = 'en', userProfile = null } = body;
    const res = await fetch('http://localhost:8000/chat/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, language, userProfile }),
    });
    const data = await res.json();
    return Response.json(data);
  } catch {
    return Response.json({ error: 'Backend unreachable' }, { status: 503 });
  }
}
