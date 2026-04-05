export async function POST(request) {
  try {
    const body = await request.json();
    const { exercise = '', phase = 'exercise', language = 'en', userProfile = null } = body;
    const res = await fetch('http://localhost:8000/chat/workout-tip', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ exercise, phase, language, userProfile }),
    });
    const data = await res.json();
    return Response.json(data);
  } catch {
    return Response.json({ tip: '' }, { status: 503 });
  }
}
