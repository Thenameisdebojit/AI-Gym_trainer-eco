import exercisesAll from '../../../lib/exercises-all.json';
import exerciseImages from '../../../lib/exercise-images.json';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const domain = searchParams.get('domain') || '';
    const base = domain
      ? exercisesAll.filter(e => e.domain === domain)
      : exercisesAll;
    const data = base.map(e => {
      const imgs = exerciseImages[e.id];
      return imgs ? { ...e, img0: imgs.img0, img1: imgs.img1 } : e;
    });
    return Response.json(data);
  } catch {
    return Response.json([], { status: 200 });
  }
}
