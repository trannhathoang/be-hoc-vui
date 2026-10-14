/* Âm thanh: hiệu ứng tổng hợp bằng Web Audio + đọc tiếng Việt bằng speechSynthesis.
 * Viết theo ES2017 để chạy được trên Safari iOS 12. */
var Sound = (function () {
  var ctx = null;
  var master = null;
  var primed = false;

  function ensureContext() {
    if (ctx) return ctx;
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.9;
    master.connect(ctx.destination);
    return ctx;
  }

  // Phải gọi trong một sự kiện chạm (iOS chỉ cho phát âm thanh sau thao tác của người dùng).
  function unlock() {
    // iOS 17+: phát cả khi bật chế độ im lặng (gạt chuông).
    try {
      if (navigator.audioSession) navigator.audioSession.type = 'playback';
    } catch (e) { /* bỏ qua */ }
    var c = ensureContext();
    if (!c) return;
    // iOS có thể tạm dừng âm thanh khi app chạy nền hoặc có cuộc gọi — bật lại mỗi lần chạm.
    if (c.state !== 'running' && c.resume) c.resume();
    if (primed) return;
    primed = true;
    // Phát một đoạn im lặng trong sự kiện chạm: cách mở khoá Web Audio trên iOS cũ.
    var buf = c.createBuffer(1, 1, 22050);
    var src = c.createBufferSource();
    src.buffer = buf;
    src.connect(c.destination);
    if (src.start) src.start(0); else src.noteOn(0);
  }

  // Tiếng chuông "ting" có các bội âm không điều hòa cho giống chuông thật.
  function bell(t, freq, vol) {
    var partials = [[1, 1], [2.76, 0.35], [5.4, 0.15], [8.93, 0.06]];
    for (var i = 0; i < partials.length; i++) {
      var osc = ctx.createOscillator();
      var g = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq * partials[i][0], t);
      var peak = vol * partials[i][1];
      var decay = 0.9 / (1 + i);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(peak, t + 0.005);
      g.gain.exponentialRampToValueAtTime(0.0001, t + decay);
      osc.connect(g);
      g.connect(master);
      osc.start(t);
      osc.stop(t + decay + 0.05);
    }
  }

  function ting() {
    if (!ensureContext()) return;
    var t = ctx.currentTime + 0.02;
    bell(t, 1568, 0.45);        // ting
    bell(t + 0.2, 2093, 0.45);  // ting
  }

  // Tiếng "èèè" dài: tổng hợp nguyên âm /ɛ/ (formant) với cao độ đi xuống như dấu huyền.
  function eh() {
    if (!ensureContext()) return;
    var t = ctx.currentTime + 0.02;
    var dur = 1.3;

    var src = ctx.createOscillator();
    src.type = 'sawtooth';
    src.frequency.setValueAtTime(230, t);
    src.frequency.linearRampToValueAtTime(205, t + 0.25);
    src.frequency.exponentialRampToValueAtTime(150, t + dur);

    // Rung nhẹ cho giống giọng người
    var vib = ctx.createOscillator();
    var vibGain = ctx.createGain();
    vib.frequency.value = 5.5;
    vibGain.gain.value = 4;
    vib.connect(vibGain);
    vibGain.connect(src.frequency);

    var env = ctx.createGain();
    env.gain.setValueAtTime(0.0001, t);
    env.gain.exponentialRampToValueAtTime(1, t + 0.06);
    env.gain.setValueAtTime(1, t + dur - 0.25);
    env.gain.exponentialRampToValueAtTime(0.0001, t + dur);

    var out = ctx.createGain();
    out.gain.value = 0.55;

    // Các formant của nguyên âm "e" mở
    var formants = [[600, 8, 1], [1850, 12, 0.6], [2550, 14, 0.25]];
    for (var i = 0; i < formants.length; i++) {
      var bp = ctx.createBiquadFilter();
      bp.type = 'bandpass';
      bp.frequency.value = formants[i][0];
      bp.Q.value = formants[i][1];
      var fg = ctx.createGain();
      fg.gain.value = formants[i][2] * 3;
      env.connect(bp);
      bp.connect(fg);
      fg.connect(out);
    }
    src.connect(env);
    out.connect(master);

    src.start(t);
    vib.start(t);
    src.stop(t + dur + 0.05);
    vib.stop(t + dur + 0.05);
  }

  // Tiếng "bụp" nhỏ khi chọn một đồ vật.
  function pop() {
    if (!ensureContext()) return;
    var t = ctx.currentTime + 0.01;
    var osc = ctx.createOscillator();
    var g = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(500, t);
    osc.frequency.exponentialRampToValueAtTime(1100, t + 0.08);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.35, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.15);
    osc.connect(g);
    g.connect(master);
    osc.start(t);
    osc.stop(t + 0.2);
  }

  // Tiếng nổ lách tách của pháo hoa.
  function crackle() {
    if (!ensureContext()) return;
    var t = ctx.currentTime + 0.01;
    var len = Math.floor(ctx.sampleRate * 0.5);
    var buf = ctx.createBuffer(1, len, ctx.sampleRate);
    var data = buf.getChannelData(0);
    for (var i = 0; i < len; i++) {
      data[i] = Math.random() < 0.02 ? (Math.random() * 2 - 1) * (1 - i / len) : 0;
    }
    var src = ctx.createBufferSource();
    src.buffer = buf;
    var g = ctx.createGain();
    g.gain.value = 0.5;
    src.connect(g);
    g.connect(master);
    src.start(t);
  }

  return {
    unlock: unlock, ting: ting, eh: eh, pop: pop, crackle: crackle,
    context: ensureContext,
    output: function () { ensureContext(); return master; }
  };
})();


/* Dự phòng: đọc câu bằng giọng tiếng Việt của thiết bị.
 * Trên iPhone/iPad, giọng tiếng Việt mặc định là "Linh" (giọng Hà Nội). */
var Tts = (function () {
  var synth = window.speechSynthesis;
  var viVoice = null;
  var current = null; // giữ tham chiếu để utterance không bị thu hồi giữa chừng

  function pickVoice() {
    if (!synth) return;
    var voices = synth.getVoices() || [];
    var vi = voices.filter(function (v) {
      return v.lang && v.lang.replace('_', '-').toLowerCase().indexOf('vi') === 0;
    });
    if (!vi.length) return;
    // Ưu tiên giọng chất lượng cao (Enhanced/Premium), sau đó tới Linh.
    var score = function (v) {
      var n = (v.name || '') + ' ' + (v.voiceURI || '');
      var s = 0;
      if (/premium/i.test(n)) s += 4;
      if (/enhanced/i.test(n)) s += 3;
      if (/linh/i.test(n)) s += 2;
      if (/hoaimy|hoài my|an\b/i.test(n)) s += 1;
      return s;
    };
    vi.sort(function (a, b) { return score(b) - score(a); });
    viVoice = vi[0];
  }

  if (synth) {
    pickVoice();
    if ('onvoiceschanged' in synth) synth.onvoiceschanged = pickVoice;
  }

  function available() { return !!synth; }

  function hasVietnamese() {
    if (!synth) return false;
    pickVoice();
    return !!viVoice;
  }

  // Gọi trong sự kiện chạm đầu tiên để "mở khóa" giọng đọc trên iOS.
  function unlock() {
    if (!synth) return;
    var u = new SpeechSynthesisUtterance(' ');
    u.volume = 0;
    u.lang = 'vi-VN';
    synth.speak(u);
  }

  function speak(text, onEnd) {
    if (!synth) { if (onEnd) setTimeout(onEnd, 300); return; }
    // Safari đôi khi bỏ qua câu mới nếu speak() ngay sau cancel(), nên chờ một chút.
    // Câu đầu tiên (chưa có gì đang đọc) vẫn được đọc ngay trong sự kiện chạm.
    if (synth.speaking || synth.pending) {
      synth.cancel();
      setTimeout(function () { say(text, onEnd); }, 120);
    } else {
      say(text, onEnd);
    }
  }

  function say(text, onEnd) {
    var u = new SpeechSynthesisUtterance(text);
    u.lang = 'vi-VN';
    if (viVoice) u.voice = viVoice;
    u.rate = 0.9;   // chậm hơn một chút cho bé dễ nghe
    u.pitch = 1.1;
    u.volume = 1;
    var done = false;
    var finish = function () {
      if (done) return;
      done = true;
      if (onEnd) onEnd();
    };
    u.onend = finish;
    u.onerror = finish;
    current = u;
    synth.speak(u);
  }

  function stop() {
    if (synth) synth.cancel();
  }

  return { speak: speak, stop: stop, unlock: unlock, available: available, hasVietnamese: hasVietnamese };
})();


/* Đọc câu: ưu tiên giọng thu sẵn (audio/voice, tạo bằng tools/make-voice.py),
 * phát qua Web Audio để không bị iOS chặn; câu nào chưa có tệp thì dùng Tts. */
var Voice = (function () {
  var DIR = 'audio/voice/';
  var manifest = null; // câu -> tên tệp
  var buffers = {};    // tên tệp -> AudioBuffer
  var waiting = {};    // tên tệp -> các hàm chờ tải xong
  var source = null;   // đoạn đang phát
  var token = 0;       // tăng mỗi lần speak/stop để bỏ qua kết quả tải đã cũ

  function loadManifest() {
    if (!window.fetch) return;
    fetch(DIR + 'manifest.json')
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function (m) { manifest = m; preloadAll(); })
      .catch(function () { /* không có giọng thu sẵn: dùng Tts */ });
  }

  // iOS 12 chỉ có decodeAudioData kiểu callback; trình duyệt mới trả thêm Promise.
  function decode(data, cb) {
    var called = false;
    var once = function (buf) { if (!called) { called = true; cb(buf); } };
    var p = Sound.context().decodeAudioData(data, once, function () { once(null); });
    if (p && p.catch) p.catch(function () { once(null); });
  }

  function load(file, cb) {
    if (buffers[file]) { cb(buffers[file]); return; }
    if (waiting[file]) { waiting[file].push(cb); return; }
    waiting[file] = [cb];
    var finish = function (buf) {
      if (buf) buffers[file] = buf;
      var list = waiting[file];
      delete waiting[file];
      list.forEach(function (f) { f(buf); });
    };
    if (!Sound.context()) { finish(null); return; }
    fetch(DIR + file)
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.arrayBuffer(); })
      .then(function (data) { decode(data, finish); })
      .catch(function () { finish(null); });
  }

  // Tải lần lượt từng tệp để máy cũ (iPad Air) không bị giật.
  function preloadAll() {
    var files = Object.keys(manifest).map(function (k) { return manifest[k]; });
    var i = 0;
    var next = function () { if (i < files.length) load(files[i++], next); };
    next();
  }

  function play(buf, onEnd) {
    var c = Sound.context();
    var src = c.createBufferSource();
    src.buffer = buf;
    src.connect(Sound.output());
    src.onended = function () {
      if (source === src) source = null;
      if (onEnd) onEnd();
    };
    source = src;
    src.start(0);
  }

  function stop() {
    token++;
    if (source) {
      source.onended = null;
      try { source.stop(0); } catch (e) { /* đã dừng */ }
      source = null;
    }
    Tts.stop();
  }

  function speak(text, onEnd) {
    stop();
    var my = token;
    var file = manifest && manifest[text];
    if (!file || !Sound.context()) { Tts.speak(text, onEnd); return; }
    load(file, function (buf) {
      if (my !== token) return; // đã có câu khác hoặc đã dừng
      if (buf) play(buf, onEnd);
      else Tts.speak(text, onEnd);
    });
  }

  function hasVoice() {
    return !!manifest || Tts.hasVietnamese();
  }

  loadManifest();

  return { speak: speak, stop: stop, hasVoice: hasVoice, available: Tts.available };
})();
