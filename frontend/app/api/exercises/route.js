import exercisesAll from '../../../lib/exercises-all.json';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const domain = searchParams.get('domain') || '';
    const data = domain
      ? exercisesAll.filter(e => e.domain === domain)
      : exercisesAll;
    return Response.json(data);
  } catch {
    return Response.json([], { status: 200 });
  }
}
