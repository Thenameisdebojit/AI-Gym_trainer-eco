#!/usr/bin/env node
const https = require('https');
const fs = require('fs');
const path = require('path');

const FREE_DB_URL =
  'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/dist/exercises.json';
const FREE_DB_IMAGE_BASE =
  'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises';
const OUR_JSON = path.join(__dirname, '../lib/exercises-all.json');
const OUTPUT  = path.join(__dirname, '../lib/exercise-images.json');

function get(url) {
  return new Promise((res, rej) => {
    https.get(url, (r) => {
      let d = '';
      r.on('data', c => (d += c));
      r.on('end', () => res(d));
    }).on('error', rej);
  });
}

function normalize(name) {
  return name.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
}

function words(str) {
  return new Set(normalize(str).split(' ').filter(w => w.length > 2));
}

function score(ourName, theirName) {
  const ow = words(ourName);
  const tw = words(theirName);
  if (ow.size === 0) return 0;
  let overlap = 0;
  ow.forEach(w => { if (tw.has(w)) overlap++; });
  return overlap / Math.max(ow.size, tw.size);
}

async function main() {
  console.log('Fetching free-exercise-db…');
  const raw = await get(FREE_DB_URL);
  const freeDb = JSON.parse(raw);
  console.log(`Got ${freeDb.length} exercises from free-exercise-db`);

  const ourExercises = JSON.parse(fs.readFileSync(OUR_JSON, 'utf8'));
  console.log(`Matching ${ourExercises.length} exercises…`);

  const result = {};
  let matched = 0;

  for (const ex of ourExercises) {
    let best = null, bestScore = 0;
    for (const free of freeDb) {
      const s = score(ex.name, free.name);
      if (s > bestScore) { bestScore = s; best = free; }
    }
    if (bestScore >= 0.35 && best && best.images && best.images.length >= 2) {
      const id = best.images[0].split('/')[0];
      result[ex.id] = {
        img0: `${FREE_DB_IMAGE_BASE}/${encodeURIComponent(id)}/0.jpg`,
        img1: `${FREE_DB_IMAGE_BASE}/${encodeURIComponent(id)}/1.jpg`,
        match: best.name,
        score: Math.round(bestScore * 100),
      };
      matched++;
    } else if (bestScore >= 0.25 && best && best.images && best.images.length >= 1) {
      const id = best.images[0].split('/')[0];
      result[ex.id] = {
        img0: `${FREE_DB_IMAGE_BASE}/${encodeURIComponent(id)}/0.jpg`,
        img1: best.images.length >= 2
          ? `${FREE_DB_IMAGE_BASE}/${encodeURIComponent(id)}/1.jpg`
          : `${FREE_DB_IMAGE_BASE}/${encodeURIComponent(id)}/0.jpg`,
        match: best.name,
        score: Math.round(bestScore * 100),
      };
      matched++;
    }
  }

  fs.writeFileSync(OUTPUT, JSON.stringify(result, null, 2));
  console.log(`✓ Matched ${matched}/${ourExercises.length} exercises → ${OUTPUT}`);
}

main().catch(e => { console.error(e); process.exit(1); });
