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
  return name.toLowerCase()
    .replace(/[^a-z0-9 ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function tokenize(str) {
  const STOP = new Set(['the','and','with','from','your','each','than','this','that','both',
    'using','use','side','left','right','back','front','low','high','hold','one','two']);
  return normalize(str).split(' ').filter(w => w.length > 2 && !STOP.has(w));
}

function wordsSet(str) {
  return new Set(tokenize(str));
}

// Primary movement words — at least one must match between our name and candidate
const MOVEMENT_WORDS = new Set([
  'press','curl','row','squat','lunge','deadlift','fly','raise','pulldown','pullup',
  'push','dip','extension','flexion','pullover','shrug','crunch','situp','plank',
  'bridge','thrust','kick','swing','snatch','clean','jerk','pull','jump','hop',
  'run','walk','step','skip','climb','drag','carry','throw','slam','roll','twist',
  'rotation','hold','stretch','bend','lift','lower','squeeze','cross',
]);

function primaryWord(name) {
  const toks = tokenize(name);
  return toks.find(t => MOVEMENT_WORDS.has(t)) || null;
}

function score(ourName, theirName) {
  const ourPrimary  = primaryWord(ourName);
  const theirPrimary = primaryWord(theirName);

  // If our name has a movement word, the match MUST share it
  if (ourPrimary && theirPrimary !== ourPrimary) return 0;

  const ow = wordsSet(ourName);
  const tw = wordsSet(theirName);
  if (ow.size === 0) return 0;

  let overlap = 0;
  ow.forEach(w => { if (tw.has(w)) overlap++; });

  // Jaccard similarity
  const union = new Set([...ow, ...tw]).size;
  return overlap / union;
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
    // Require: score ≥ 0.40, must have both image poses
    if (bestScore >= 0.40 && best && best.images && best.images.length >= 2) {
      const id = best.images[0].split('/')[0];
      result[ex.id] = {
        img0: `${FREE_DB_IMAGE_BASE}/${encodeURIComponent(id)}/0.jpg`,
        img1: `${FREE_DB_IMAGE_BASE}/${encodeURIComponent(id)}/1.jpg`,
      };
      matched++;
    }
  }

  fs.writeFileSync(OUTPUT, JSON.stringify(result, null, 2));
  console.log(`✓ Matched ${matched}/${ourExercises.length} exercises → ${OUTPUT}`);
}

main().catch(e => { console.error(e); process.exit(1); });
