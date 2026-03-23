export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const domain = searchParams.get('domain') || '';
    const url = domain
      ? `http://localhost:8000/exercises?domain=${encodeURIComponent(domain)}`
      : 'http://localhost:8000/exercises';
    const res = await fetch(url);
    const data = await res.json();
    return Response.json(data);
  } catch {
    return Response.json([], { status: 200 });
  }
}
