export async function POST(request) {
  try {
    const body = await request.json();
    const { weight = 70, height = 170, goal = 'gain' } = body;
    const res = await fetch(
      `http://localhost:8000/diet/?weight=${weight}&height=${height}&goal=${goal}`,
      { method: 'POST' }
    );
    const data = await res.json();
    return Response.json(data);
  } catch {
    return Response.json({ error: 'Backend unreachable' }, { status: 503 });
  }
}
