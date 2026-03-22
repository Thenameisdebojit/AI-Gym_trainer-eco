export async function GET() {
  try {
    const res = await fetch('http://localhost:8000/workout/stats');
    const data = await res.json();
    return Response.json(data);
  } catch {
    return Response.json({ error: 'Backend unreachable' }, { status: 503 });
  }
}
