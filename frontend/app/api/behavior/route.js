export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const days_missed = searchParams.get('days_missed') || 2;
    const consistency = searchParams.get('consistency') || 60;
    const res = await fetch(
      `http://localhost:8000/behavior/?days_missed=${days_missed}&consistency=${consistency}`
    );
    const data = await res.json();
    return Response.json(data);
  } catch {
    return Response.json({ error: 'Backend unreachable' }, { status: 503 });
  }
}
