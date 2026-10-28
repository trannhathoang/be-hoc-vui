// Kiểm tra luật chọn câu hỏi (không cần trình duyệt).  Chạy:  node tools/test-logic.js
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
let failures = 0;
function check(ok, msg) {
  console.log((ok ? '  ✓ ' : '  ✗ ') + msg);
  if (!ok) failures++;
}

// Nạp game vào một "trình duyệt giả" có localStorage để thử cả việc nhớ giữa các lần mở.
function loadGames(storage) {
  const localStorage = {
    getItem: (k) => (k in storage ? storage[k] : null),
    setItem: (k, v) => { storage[k] = String(v); }
  };
  const ctx = vm.createContext({ Math, JSON, localStorage });
  for (const f of ['js/art.js', 'js/games.js']) {
    vm.runInContext(fs.readFileSync(path.join(ROOT, f), 'utf8'), ctx, { filename: f });
  }
  return vm.runInContext('Games', ctx);
}

const key = (r) => r.item.name + ' ' + r.word + ' #' + r.id;

console.log('Trò 1 — bộ câu hỏi:');
{
  const storage = {};
  let G = loadGames(storage);
  const seq = [];
  const N = 600;
  for (let i = 0; i < N; i++) {
    if (i === 250) G = loadGames(storage); // giả lập thoát app rồi mở lại giữa chừng
    seq.push(G.opposite.make());
  }
  const ids = seq.map((r) => r.id);

  // 1. Không lặp câu hỏi (cùng tên đồ vật + cùng tính từ) trong 20 câu liên tiếp bất kỳ,
  //    kể cả chỗ nối bộ và lúc mở lại app.
  const texts = seq.map((r) => r.item.name + ' ' + r.word);
  let repeat = null, minTextGap = Infinity;
  for (let i = 0; i < texts.length; i++) {
    const j = texts.indexOf(texts[i], i + 1);
    if (j > 0) minTextGap = Math.min(minTextGap, j - i);
    if (j > 0 && j - i < 20 && !repeat) repeat = `"${texts[i]}" lặp sau ${j - i} câu`;
  }
  check(!repeat, `${N} câu: không câu hỏi nào lặp lại trong 20 câu (gần nhất cách ${minTextGap} câu)` + (repeat ? ' — ' + repeat : ''));

  // 2. Mỗi bộ (mọi cặp tranh × 2 tính từ) hỏi đủ, mỗi câu đúng một lần.
  const deckSize = new Set(ids).size;
  let fullDecks = true;
  for (let s = 0; s + deckSize <= ids.length; s += deckSize) {
    if (new Set(ids.slice(s, s + deckSize)).size !== deckSize) fullDecks = false;
  }
  check(fullDecks, `Mỗi bộ ${deckSize} câu hỏi đủ cả 2 tính từ của mọi cặp tranh (${deckSize / 2} cặp tranh)`);

  // 3. Không hai câu liền cùng cặp tính từ.
  let sameCat = 0;
  for (let i = 1; i < seq.length; i++) if (seq[i].item.words.join() === seq[i - 1].item.words.join()) sameCat++;
  check(sameCat === 0, `Không có 2 câu liền cùng cặp tính từ (gặp ${sameCat} lần)`);

  // 4. Hai câu của cùng một cặp tranh cách nhau xa.
  let minGap = Infinity;
  for (let s = 0; s + deckSize <= ids.length; s += deckSize) {
    const pos = {};
    ids.slice(s, s + deckSize).forEach((id, i) => { (pos[id.split(':')[0]] = pos[id.split(':')[0]] || []).push(i); });
    Object.values(pos).forEach((p) => { if (p.length === 2) minGap = Math.min(minGap, Math.abs(p[1] - p[0])); });
  }
  check(minGap >= 4, `Hai câu của cùng một cặp tranh cách nhau ít nhất ${minGap} câu`);

  // 5. Tranh đúng không nằm cùng một bên quá 2 lần liền (trong một lần chơi).
  let streak = 1, maxStreak = 1;
  for (let i = 1; i < seq.length; i++) {
    const side = (r) => r.options.findIndex((o) => o.correct);
    streak = i !== 250 && side(seq[i]) === side(seq[i - 1]) ? streak + 1 : 1;
    maxStreak = Math.max(maxStreak, streak);
  }
  check(maxStreak <= 2, `Tranh đúng nằm cùng một bên tối đa ${maxStreak} lần liền`);

  // 6. Các cặp tính từ xuất hiện đều nhau.
  const perCat = {};
  seq.forEach((r) => { const c = r.item.words.join(' – '); perCat[c] = (perCat[c] || 0) + 1; });
  const counts = Object.values(perCat);
  check(Math.min(...counts) / Math.max(...counts) > 0.6,
    `${Object.keys(perCat).length} cặp tính từ, số câu mỗi cặp từ ${Math.min(...counts)} đến ${Math.max(...counts)}`);

  console.log('    20 câu đầu tiên:');
  seq.slice(0, 20).forEach((r, i) => console.log(`      ${String(i + 1).padStart(2)}. ${r.speech}`));
}

console.log('\nTrò 3 — bố trí 4 tranh:');
{
  const G = loadGames({});
  const k = (o) => o.type.key + o.color;
  const seen = {};
  let bad = 0, sameTypeRepeat = 0, prev = null;
  for (let i = 0; i < 6000; i++) {
    const r = G.findpair.make(prev);
    if (prev && prev.baseType === r.baseType) sameTypeRepeat++;
    prev = r;
    const cnt = {};
    r.options.forEach((o) => { cnt[k(o)] = (cnt[k(o)] || 0) + 1; });
    const shape = Object.values(cnt).sort().join('');
    const expected = { AABC: '112', AABB: '22', AAAB: '13' }[r.layout];
    if (r.options.length !== 4 || shape !== expected) bad++;
    // Đếm số cặp được tính đúng.
    let right = 0;
    for (let a = 0; a < 4; a++) for (let b = a + 1; b < 4; b++) if (G.findpair.check(r, r.options[a], r.options[b])) right++;
    const name = `${r.mode === 'same' ? 'Tìm giống' : 'Tìm khác'} ${r.layout}`;
    seen[name] = seen[name] || { n: 0, right };
    seen[name].n++;
  }
  check(bad === 0, `6000 lượt: bố trí luôn đúng kiểu (sai ${bad})`);
  check(sameTypeRepeat === 0, 'Không hai lượt liền cùng loại đồ vật');
  Object.keys(seen).sort().forEach((n) => console.log(`      ${n}: ${seen[n].n} lượt, ${seen[n].right}/6 cặp được tính đúng`));
  check(Object.keys(seen).length === 6, `Có đủ 6 kiểu (tìm giống: AABC, AABB, AAAB; tìm khác: AAAB, AABC, AABB)`);
}

console.log(failures ? `\n${failures} kiểm tra KHÔNG ĐẠT` : '\nTất cả kiểm tra đều ĐẠT');
process.exit(failures ? 1 : 0);
