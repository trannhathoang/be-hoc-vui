// Kiểm tra tự động trên WebKit (bộ máy của Safari) với thao tác chạm thật.
// Chạy:  cd tools && npm test        Ảnh chụp lưu ở tools/test-output/
const http = require('http');
const fs = require('fs');
const path = require('path');
const acorn = require('acorn');
const { webkit, devices } = require('playwright');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(__dirname, 'test-output');
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'application/javascript',
  '.json': 'application/json', '.png': 'image/png', '.mp3': 'audio/mpeg'
};

const IOS12_UA = 'Mozilla/5.0 (iPad; CPU OS 12_5_8 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.1.2 Mobile/15E148 Safari/604.1';
const DEVICES = [
  { name: 'iPhone 15 Pro Max', opts: devices['iPhone 15 Pro Max'] },
  { name: 'iPhone 15 Pro Max ngang', opts: devices['iPhone 15 Pro Max landscape'] },
  { name: 'iPhone 11', opts: devices['iPhone 11'] },
  { name: 'iPhone 11 ngang', opts: devices['iPhone 11 landscape'] },
  { name: 'iPad Air', opts: { viewport: { width: 768, height: 1024 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, userAgent: IOS12_UA } },
  { name: 'iPad Air ngang', opts: { viewport: { width: 1024, height: 768 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, userAgent: IOS12_UA } }
];

let failures = 0;
function check(ok, msg) {
  console.log((ok ? '  ✓ ' : '  ✗ ') + msg);
  if (!ok) failures++;
}

// Safari iOS 12 hiểu được tới ES2017 — báo lỗi nếu mã dùng cú pháp mới hơn.
function checkSyntax() {
  console.log('Cú pháp ES2017 (Safari iOS 12):');
  for (const f of fs.readdirSync(path.join(ROOT, 'js')).concat(['../sw.js'])) {
    const file = path.join(ROOT, 'js', f);
    try {
      acorn.parse(fs.readFileSync(file, 'utf8'), { ecmaVersion: 2017 });
      check(true, path.relative(ROOT, file));
    } catch (e) {
      check(false, `${path.relative(ROOT, file)}: ${e.message}`);
    }
  }
}

function startServer() {
  const server = http.createServer((req, res) => {
    let p = decodeURIComponent(req.url.split('?')[0]);
    if (p.endsWith('/')) p += 'index.html';
    const file = path.join(ROOT, p);
    if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
      res.writeHead(404); res.end(); return;
    }
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' });
    fs.createReadStream(file).pipe(res);
  });
  return new Promise((resolve) => server.listen(0, '127.0.0.1', () => resolve(server)));
}

const roundId = (page) => page.evaluate(() => KidGame.state.roundId);
const stars = (page) => page.evaluate(() => KidGame.state.stars);

async function waitNextRound(page, before) {
  await page.waitForFunction((b) => KidGame.state.roundId !== b && !KidGame.state.locked, before, { timeout: 8000 });
}

// Mọi thẻ/nút phải nằm trọn trong màn hình.
async function checkInside(page, selector, label) {
  const vp = page.viewportSize();
  const boxes = await page.$$eval(selector, (els) => els.map((e) => {
    const r = e.getBoundingClientRect();
    return { l: r.left, t: r.top, r: r.right, b: r.bottom, w: r.width };
  }));
  const bad = boxes.filter((b) => b.l < -1 || b.t < -1 || b.r > vp.width + 1 || b.b > vp.height + 1);
  check(boxes.length > 0 && bad.length === 0, `${label}: ${boxes.length} phần tử nằm trong màn hình (thẻ ${Math.round(boxes[0] ? boxes[0].w : 0)}px)`);
}

// Trả về chỉ số thẻ cần chạm cho câu đúng hoặc câu sai.
function answerFor(right) {
  const r = KidGame.state.round;
  if (r.kind === 'pick1') {
    return [r.options.findIndex((o) => o.correct === right)];
  }
  const oddIdx = r.options.findIndex((o) => o.odd);
  const others = [0, 1, 2].filter((i) => i !== oddIdx);
  const wantSame = (r.mode === 'same') === right;
  return wantSame ? others : [oddIdx, others[0]];
}

async function tapCards(page, idxs) {
  for (const i of idxs) await page.tap(`#stage .card:nth-child(${i + 1})`);
}

async function playGame(page, key, label, dev) {
  await page.tap(`.menu-card[data-game="${key}"]`);
  await page.waitForFunction(() => KidGame.state.round, null, { timeout: 3000 });
  await page.waitForTimeout(600); // chờ hiệu ứng hiện thẻ
  await checkInside(page, '#stage .card', `${label} — thẻ`);
  if (key === 'samediff') await checkInside(page, '.answer-btn', `${label} — nút Giống/Khác`);
  await page.screenshot({ path: path.join(OUT, `${dev} - ${key}.png`) });

  // Trả lời sai: không được sao, được chọn lại.
  const id0 = await roundId(page);
  if (key === 'samediff') {
    const ans = await page.evaluate(() => KidGame.state.round.answer);
    await page.tap(ans === 'same' ? '.answer-btn.diff' : '.answer-btn.same');
  } else {
    await tapCards(page, await page.evaluate(answerFor, false));
  }
  await page.waitForTimeout(300);
  const wrongShown = await page.$('.wrong');
  check(wrongShown && (await stars(page)) === 0 && (await roundId(page)) === id0, `${label} — trả lời sai: rung lắc, không cộng sao, giữ câu hỏi`);
  await page.waitForFunction(() => !KidGame.state.locked, null, { timeout: 3000 });

  // Trả lời đúng hai lượt liền.
  for (let n = 1; n <= 2; n++) {
    const before = await roundId(page);
    if (key === 'samediff') {
      const ans = await page.evaluate(() => KidGame.state.round.answer);
      await page.tap(`.answer-btn.${ans}`);
    } else {
      await tapCards(page, await page.evaluate(answerFor, true));
    }
    await page.waitForTimeout(250);
    if (n === 1) await page.screenshot({ path: path.join(OUT, `${dev} - ${key} - dung.png`) });
    check((await stars(page)) === n && (await page.$('.card.correct')), `${label} — trả lời đúng lượt ${n}: viền xanh, ${n} sao`);
    await waitNextRound(page, before);
  }

  await page.tap('#btn-home');
  await page.waitForSelector('#home.active');
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  checkSyntax();

  const server = await startServer();
  const base = `http://127.0.0.1:${server.address().port}/`;
  const browser = await webkit.launch();

  for (const dev of DEVICES) {
    console.log(`\n${dev.name} (${dev.opts.viewport.width}x${dev.opts.viewport.height}):`);
    const context = await browser.newContext(dev.opts);
    const page = await context.newPage();
    const errors = [];
    const voiceFiles = new Set();
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
    page.on('response', (r) => {
      if (/audio\/voice\/.+\.mp3$/.test(r.url()) && r.status() === 200) voiceFiles.add(r.url());
    });

    await page.goto(base);
    // Ghi lại mọi câu game đọc ra để đối chiếu với giọng thu sẵn.
    await page.evaluate(() => {
      window.__spoken = [];
      const speak = Voice.speak;
      Voice.speak = (t, cb) => { window.__spoken.push(t); return speak(t, cb); };
    });
    await page.waitForTimeout(1500);
    await page.screenshot({ path: path.join(OUT, `${dev.name} - home.png`) });
    await checkInside(page, '.menu-card', 'Trang chủ — 3 thẻ trò chơi');

    await playGame(page, 'opposite', 'Trò 1 (trái nghĩa)', dev.name);
    await playGame(page, 'samediff', 'Trò 2 (giống/khác)', dev.name);
    await playGame(page, 'findpair', 'Trò 3 (tìm 2 đồ vật)', dev.name);

    const missing = await page.evaluate(() => fetch('audio/voice/manifest.json').then((r) => r.json())
      .then((m) => window.__spoken.filter((t) => !m[t])));
    const spokenCount = await page.evaluate(() => window.__spoken.length);
    check(spokenCount > 0 && missing.length === 0,
      `Mọi câu đã đọc (${spokenCount} câu) đều có giọng thu sẵn` + (missing.length ? ': thiếu ' + missing.join(' | ') : ''));

    const total = await page.evaluate(() => fetch('audio/voice/manifest.json').then((r) => r.json()).then((m) => Object.keys(m).length));
    const hasWebAudio = await page.evaluate(() => !!(window.AudioContext || window.webkitAudioContext));
    if (hasWebAudio) {
      check(voiceFiles.size === total, `Giọng thu sẵn: tải được ${voiceFiles.size}/${total} tệp`);
    } else {
      // Bản WebKit của Playwright trên Windows không có Web Audio (Safari thật thì có).
      console.log(`  – Giọng thu sẵn: bỏ qua (WebKit này không có Web Audio; game đã tự dùng giọng của máy)`);
    }
    check(errors.length === 0, 'Không có lỗi JavaScript' + (errors.length ? ': ' + errors.join(' | ') : ''));
    await context.close();
  }

  await browser.close();
  server.close();
  console.log(failures ? `\n${failures} kiểm tra KHÔNG ĐẠT` : '\nTất cả kiểm tra đều ĐẠT');
  process.exit(failures ? 1 : 0);
}

main().catch((e) => { console.error(e); process.exit(1); });
