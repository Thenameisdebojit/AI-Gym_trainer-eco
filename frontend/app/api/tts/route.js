export async function POST(request) {
  try {
    const body = await request.json();
    const { text = '', language = 'en' } = body;
    const res = await fetch('http://localhost:8000/chat/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, language }),
    });
    if (!res.ok) {
      return new Response(null, { status: 503 });
    }
    const audioBuffer = await res.arrayBuffer();
    return new Response(audioBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'no-store',
      },
    });
  } catch {
    return new Response(null, { status: 503 });
  }
}
