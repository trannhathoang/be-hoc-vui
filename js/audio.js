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

  // Tiếng báo sai: một tiếng "bộp" trầm, ngắn, nhỏ — cố ý nhạt để bé không thích chọn sai.
  function thud() {
    if (!ensureContext()) return;
    var t = ctx.currentTime + 0.01;
    var osc = ctx.createOscillator();
    var lp = ctx.createBiquadFilter();
    var g = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(180, t);
    osc.frequency.exponentialRampToValueAtTime(110, t + 0.18);
    lp.type = 'lowpass';
    lp.frequency.value = 600;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.25, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);
    osc.connect(lp);
    lp.connect(g);
    g.connect(master);
    osc.start(t);
    osc.stop(t + 0.25);
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
    unlock: unlock, ting: ting, thud: thud, pop: pop, crackle: crackle,
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
  var MAX_DECODED = 24; // giữ ít câu đã giải mã để máy cũ (iPad Air, RAM 1 GB) không hết bộ nhớ
  var manifest = null; // câu -> tên tệp
  var raw = {};        // tên tệp -> ArrayBuffer mp3 (nhỏ, giữ hết)
  var buffers = {};    // tên tệp -> AudioBuffer đã giải mã (giới hạn MAX_DECODED)
  var order = [];      // thứ tự dùng gần đây của buffers
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

  function remember(file, buf) {
    var i = order.indexOf(file);
    if (i >= 0) order.splice(i, 1);
    order.push(file);
    buffers[file] = buf;
    while (order.length > MAX_DECODED) delete buffers[order.shift()];
  }

  function fetchRaw(file, cb) {
    if (raw[file]) { cb(raw[file]); return; }
    fetch(DIR + file)
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.arrayBuffer(); })
      .then(function (data) { raw[file] = data; cb(data); })
      .catch(function () { cb(null); });
  }

  // Lấy AudioBuffer của một câu (tải + giải mã nếu cần).
  function load(file, cb) {
    if (buffers[file]) { remember(file, buffers[file]); cb(buffers[file]); return; }
    if (waiting[file]) { waiting[file].push(cb); return; }
    waiting[file] = [cb];
    var finish = function (buf) {
      if (buf) remember(file, buf);
      var list = waiting[file];
      delete waiting[file];
      list.forEach(function (f) { f(buf); });
    };
    if (!Sound.context()) { finish(null); return; }
    fetchRaw(file, function (data) {
      // decodeAudioData "lấy mất" ArrayBuffer truyền vào, nên giải mã một bản sao.
      if (data) decode(data.slice(0), finish); else finish(null);
    });
  }

  // Tải trước (chưa giải mã) mọi tệp, lần lượt từng tệp để máy cũ không bị giật.
  // Nhờ vậy service worker cũng lưu đủ để chơi offline.
  function preloadAll() {
    var files = Object.keys(manifest).map(function (k) { return manifest[k]; });
    var i = 0;
    var next = function () { if (i < files.length) fetchRaw(files[i++], next); };
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
