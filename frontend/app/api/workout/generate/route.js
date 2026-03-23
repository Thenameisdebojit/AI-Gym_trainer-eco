export async function POST(request) {
  try {
    const body = await request.json();
    const { goal = 'general', equipment = 'none', level = 'beginner', duration = 30 } = body;
    const res = await fetch('http://localhost:8000/workout/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ goal, equipment, level, duration }),
    });
    const data = await res.json();
    return Response.json(data);
  } catch {
    return Response.json({ exercises: [] }, { status: 200 });
  }
}
