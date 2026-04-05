export async function POST(request) {
  try {
    const body = await request.json();
    const {
      exercise = '',
      phase = 'exercise',
      language = 'en',
      userProfile = null,
      workoutHistory = null,
    } = body;

    let history = workoutHistory;
    if (!history) {
      try {
        const sessRes = await fetch('http://localhost:8000/sessions/history?limit=5');
        if (sessRes.ok) {
          const sessData = await sessRes.json();
          history = Array.isArray(sessData) ? sessData : (sessData.sessions || null);
        }
      } catch {}
    }

    const res = await fetch('http://localhost:8000/chat/workout-tip', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        exercise,
        phase,
        language,
        userProfile,
        workoutHistory: history,
      }),
    });
    const data = await res.json();
    return Response.json(data);
  } catch {
    return Response.json({ tip: '' }, { status: 503 });
  }
}
