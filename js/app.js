/* Điều khiển màn hình và lượt chơi. */
(function () {
  var $ = function (id) { return document.getElementById(id); };

  var state = {
    game: null,
    round: null,
    roundId: 0,
    stars: 0,
    locked: false,
    celebrating: false, // đang khen sau câu trả lời đúng
    selected: [] // dùng cho mini-game 3
  };

  // Xử lý ở touchend: Safari iOS chỉ cho bật âm thanh/giọng đọc trong touchend hoặc click.
  // Không kiểm tra ngón tay có trượt ra ngoài không — trẻ nhỏ hay chạm lâu hoặc trượt tay.
  function onTap(el, fn) {
    var lastTouch = 0;
    el.addEventListener('touchstart', function (e) {
      e.preventDefault(); // chặn click "ma" và phóng to khi chạm đúp
      el.classList.add('pressed');
    }, { passive: false });
    el.addEventListener('touchend', function (e) {
      e.preventDefault();
      lastTouch = Date.now();
      el.classList.remove('pressed');
      fn(e);
    }, { passive: false });
    el.addEventListener('touchcancel', function () { el.classList.remove('pressed'); });
    el.addEventListener('click', function (e) {
      if (Date.now() - lastTouch < 800) return;
      press(el);
      fn(e);
    });
  }

  function press(el) {
    el.classList.add('pressed');
    setTimeout(function () { el.classList.remove('pressed'); }, 160);
  }

  function unlockAudio() {
    Sound.unlock();
  }

  // ---------- Tùy chỉnh (lưu trong máy) ----------
  var Settings = (function () {
    var KEY = 'be-hoc-vui:settings';
    var DEFAULTS = { wrongSound: 'on', correctSound: 'on' };
    var values = {};
    try { values = JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { values = {}; }
    return {
      get: function (k) { return values[k] || DEFAULTS[k]; },
      on: function (k) { return (values[k] || DEFAULTS[k]) === 'on'; },
      set: function (k, v) {
        values[k] = v;
        try { localStorage.setItem(KEY, JSON.stringify(values)); } catch (e) { /* bỏ qua */ }
      }
    };
  })();

  function renderSettings() {
    var groups = document.querySelectorAll('.segmented');
    for (var i = 0; i < groups.length; i++) {
      var value = Settings.get(groups[i].getAttribute('data-setting'));
      var btns = groups[i].children;
      for (var j = 0; j < btns.length; j++) {
        btns[j].classList.toggle('selected', btns[j].getAttribute('data-value') === value);
      }
    }
  }

  function initSettings() {
    var btns = document.querySelectorAll('.segmented button');
    for (var i = 0; i < btns.length; i++) {
      (function (btn) {
        onTap(btn, function () {
          var key = btn.parentNode.getAttribute('data-setting');
          var value = btn.getAttribute('data-value');
          unlockAudio();
          Settings.set(key, value);
          renderSettings();
          // Bật thì cho nghe thử ngay.
          if (value === 'on') {
            if (key === 'wrongSound') Sound.eh();
            if (key === 'correctSound') Sound.ting();
          }
        });
      })(btns[i]);
    }
    renderSettings();
  }

  // ---------- Cổng phụ huynh trước khi mở đường link ra ngoài ----------
  function parentGate(onPass) {
    var a = 2 + Math.floor(Math.random() * 6), b = 2 + Math.floor(Math.random() * 6), sum = a + b;
    var choices = [sum, sum + 1 + Math.floor(Math.random() * 2), sum - 1 - Math.floor(Math.random() * 2)];
    choices.sort(function () { return Math.random() - 0.5; });
    $('gate-q').textContent = a + ' + ' + b + ' = ?';
    var box = $('gate-choices');
    box.innerHTML = '';
    choices.forEach(function (n) {
      var btn = document.createElement('button');
      btn.textContent = n;
      onTap(btn, function () {
        $('parent-gate').classList.add('hidden');
        if (n === sum) onPass();
      });
      box.appendChild(btn);
    });
    $('parent-gate').classList.remove('hidden');
  }

  var GITHUB_URL = 'https://github.com/trannhathoang';

  function showScreen(id) {
    var screens = document.querySelectorAll('.screen');
    for (var i = 0; i < screens.length; i++) screens[i].classList.remove('active');
    $(id).classList.add('active');
  }

  // ---------- Màn hình chính & danh sách trò chơi ----------
  var HOME_SVG = '<svg viewBox="0 0 48 48"><path d="M8 24 L24 9 L40 24" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<path d="M13 22 V39 H35 V22" fill="none" stroke="#fff" stroke-width="5" stroke-linejoin="round"/><rect x="20" y="28" width="8" height="11" fill="#fff"/></svg>';

  function drawMenuArt() {
    $('art-main').innerHTML = Art.compose(520, [
      { inner: Art.ball(Art.COLORS.orange), x: 4, y: 60, s: 0.62 },
      { inner: Art.star(Art.COLORS.yellow), x: 120, y: 16, s: 0.7 },
      { inner: Art.apple(Art.COLORS.red), x: 250, y: 56, s: 0.64 },
      { inner: Art.car(Art.COLORS.blue), x: 372, y: 64, s: 0.72 }
    ]);
    $('art-opposite').innerHTML = Art.compose(360, [
      { inner: Art.ball(Art.COLORS.orange), x: 10, y: 14, s: 0.85 },
      { inner: Art.ball(Art.COLORS.orange), x: 225, y: 88, s: 0.45 }
    ]);
    $('art-samediff').innerHTML = Art.compose(360, [
      { inner: Art.apple(Art.COLORS.red), x: 8, y: 16, s: 0.84 },
      { inner: Art.apple(Art.COLORS.red), x: 184, y: 16, s: 0.84 }
    ]);
    $('art-findpair').innerHTML = Art.compose(216, [
      { inner: Art.star(Art.COLORS.yellow), x: 8, y: 4, s: 0.5 },
      { inner: Art.star(Art.COLORS.blue), x: 108, y: 4, s: 0.5 },
      { inner: Art.star(Art.COLORS.green), x: 8, y: 104, s: 0.5 },
      { inner: Art.star(Art.COLORS.yellow), x: 108, y: 104, s: 0.5 }
    ], 208);
  }

  function checkVoice() {
    var msg = '';
    if (Voice.hasVoice()) {
      msg = '';
    } else if (!Voice.available()) {
      msg = 'Trình duyệt này không hỗ trợ đọc câu hỏi. Hãy mở bằng Safari.';
    } else {
      msg = 'Chưa tìm thấy giọng đọc tiếng Việt. Trên iPhone/iPad: Cài đặt → Trợ năng → ' +
        'Nội dung được đọc → Giọng nói → Tiếng Việt → tải giọng "Linh".';
    }
    var el = $('voice-warning');
    el.textContent = msg;
    el.classList.toggle('hidden', !msg);
  }

  // ---------- Chơi ----------
  function startGame(key) {
    unlockAudio();
    state.game = Games[key];
    state.round = null;
    state.stars = 0;
    $('star-count').textContent = '0';
    $('answers').classList.toggle('hidden', key !== 'samediff');
    showScreen('play');
    nextRound();
  }

  // Nút Home trong lúc chơi: về danh sách trò chơi (như trước) để bé đổi trò nhanh.
  function goHome() {
    state.game = null;
    state.roundId++;
    Voice.stop();
    $('play').classList.remove('listening');
    Fireworks.stop();
    showScreen('games');
  }

  function goMain() {
    showScreen('main');
    checkVoice();
  }

  function nextRound() {
    if (!state.game) return;
    state.roundId++;
    state.celebrating = false;
    state.selected = [];
    state.round = state.game.make(state.round);
    render();
    listen(state.round.speech);
  }

  // Đọc một câu và khoá chạm cho tới khi đọc xong (tranh mờ đi trong lúc đó),
  // để bé phải nghe hết câu hỏi / lời gợi ý rồi mới chọn — chọn bừa không được gì.
  var listenToken = 0;
  function listen(text) {
    var id = state.roundId, my = ++listenToken;
    state.locked = true;
    $('play').classList.add('listening');
    var done = function () {
      if (my !== listenToken || id !== state.roundId) return;
      state.locked = false;
      $('play').classList.remove('listening');
    };
    Voice.speak(text, done);
    setTimeout(done, 8000); // phòng khi giọng đọc không báo kết thúc
  }

  function speakQuestion() {
    if (state.round && !state.celebrating) listen(state.round.speech);
  }

  function render() {
    var r = state.round;
    $('question').textContent = r.text;
    var stage = $('stage');
    stage.innerHTML = '';
    var grid = document.createElement('div');
    grid.className = 'grid';
    stage.appendChild(grid);

    r.options.forEach(function (opt, i) {
      var card = document.createElement('div');
      card.className = 'card pop-in' + (r.kind === 'samediff' ? '' : ' tappable');
      card.style.webkitAnimationDelay = card.style.animationDelay = (i * 0.08) + 's';
      card.innerHTML = Art.svg(opt.svg);
      if (r.kind !== 'samediff') {
        onTap(card, function () { onCardTap(card, opt); });
      }
      opt.el = card;
      grid.appendChild(card);
    });
    layout();
  }

  // Chọn cách xếp thẻ (hàng ngang / cột dọc / 2+1) sao cho thẻ to nhất có thể.
  function layout() {
    var r = state.round;
    if (!r) return;
    var stage = $('stage');
    var grid = stage.firstChild;
    if (!grid) return;
    var n = r.options.length;
    // Đo vùng chơi khi chưa có thẻ để thẻ không làm giãn vùng đo.
    grid.style.display = 'none';
    var W = stage.clientWidth, H = stage.clientHeight;
    grid.style.display = '';
    var m = Math.round(Math.min(window.innerWidth, window.innerHeight) * 0.015) + 2;
    var best = { size: 0, cols: n };
    // Lượt chơi có thể ép số cột (trò 3 luôn xếp 2 x 2).
    for (var cols = r.cols || 1; cols <= (r.cols || n); cols++) {
      var rows = Math.ceil(n / cols);
      var size = Math.floor(Math.min(W / cols, H / rows) - 2 * m);
      if (size > best.size) best = { size: size, cols: cols };
    }
    var s = Math.max(80, Math.min(best.size, 420));
    grid.style.width = (best.cols * (s + 2 * m) + 1) + 'px';
    var cards = grid.children;
    for (var i = 0; i < cards.length; i++) {
      cards[i].style.width = s + 'px';
      cards[i].style.height = s + 'px';
      cards[i].style.margin = m + 'px';
    }
  }

  function onCardTap(card, opt) {
    if (state.locked) return;
    var r = state.round;
    if (r.kind === 'pick1') {
      if (opt.correct) correct([card]);
      else wrong([card]);
      return;
    }
    // pick2: chọn 2 đồ vật
    var idx = state.selected.indexOf(opt);
    if (idx >= 0) {
      state.selected.splice(idx, 1);
      card.classList.remove('selected');
      Sound.pop();
      return;
    }
    state.selected.push(opt);
    card.classList.add('selected');
    Sound.pop();
    if (state.selected.length === 2) {
      var a = state.selected[0], b = state.selected[1];
      var els = [a.el, b.el];
      if (Games.findpair.check(r, a, b)) {
        correct(els);
      } else {
        state.locked = true;
        setTimeout(function () {
          els.forEach(function (el) { el.classList.remove('selected'); });
          state.selected = [];
          wrong(els);
        }, 250);
      }
    }
  }

  function onAnswerTap(btn) {
    if (state.locked || !state.round || state.round.kind !== 'samediff') return;
    if (btn.getAttribute('data-answer') === state.round.answer) {
      correct(state.round.options.map(function (o) { return o.el; }));
    } else {
      wrong([btn]);
    }
  }

  function correct(els) {
    state.locked = true;
    state.celebrating = true;
    var id = state.roundId;
    els.forEach(function (el) { el.classList.remove('selected'); el.classList.add('correct'); });
    var withSound = Settings.on('correctSound');
    if (withSound) Sound.ting();
    Fireworks.celebrate(withSound);
    state.stars++;
    $('star-count').textContent = state.stars;
    var starsEl = $('stars');
    starsEl.classList.remove('bump');
    void starsEl.offsetWidth; // chạy lại animation
    starsEl.classList.add('bump');

    var advanced = false;
    var advance = function () {
      if (advanced || id !== state.roundId) return;
      advanced = true;
      nextRound();
    };
    setTimeout(function () {
      if (id !== state.roundId) return;
      Voice.speak(Games.praise(state.game, state.round), function () { setTimeout(advance, 600); });
    }, 650);
    setTimeout(advance, 5000); // phòng khi giọng đọc không báo kết thúc
  }

  // Trả lời sai: tiếng "è è" (nếu bật trong Tùy chỉnh), tranh mờ đi, rồi đọc lời gợi ý —
  // chỉ chọn lại được khi đọc xong.
  function wrong(els) {
    state.locked = true;
    var id = state.roundId;
    Voice.stop();
    if (Settings.on('wrongSound')) Sound.eh();
    els.forEach(function (el) { el.classList.add('wrong'); });
    setTimeout(function () {
      els.forEach(function (el) { el.classList.remove('wrong'); });
    }, 700);
    setTimeout(function () {
      if (id === state.roundId) listen(Games.retry(state.game, state.round));
    }, 450);
  }

  // ---------- Khởi động ----------
  function init() {
    Fireworks.init();
    drawMenuArt();

    var cards = document.querySelectorAll('.menu-card');
    for (var i = 0; i < cards.length; i++) {
      (function (btn) {
        onTap(btn, function () { startGame(btn.getAttribute('data-game')); });
      })(cards[i]);
    }
    onTap($('btn-home'), goHome);
    onTap($('btn-speak'), function () { unlockAudio(); speakQuestion(); });

    // Màn hình chính: Vào chơi / Tùy chỉnh / Giới thiệu; nút Home ở các màn phụ về màn hình chính.
    var mainBtns = document.querySelectorAll('.main-btn');
    for (var m = 0; m < mainBtns.length; m++) {
      (function (btn) {
        onTap(btn, function () { unlockAudio(); showScreen(btn.getAttribute('data-to')); });
      })(mainBtns[m]);
    }
    var backBtns = document.querySelectorAll('.btn-main');
    for (var k = 0; k < backBtns.length; k++) {
      backBtns[k].innerHTML = HOME_SVG;
      onTap(backBtns[k], goMain);
    }
    initSettings();
    onTap($('btn-github'), function () {
      parentGate(function () { window.open(GITHUB_URL, '_blank'); });
    });
    onTap($('gate-cancel'), function () { $('parent-gate').classList.add('hidden'); });
    var answers = document.querySelectorAll('.answer-btn');
    for (var j = 0; j < answers.length; j++) {
      (function (btn) {
        onTap(btn, function () { onAnswerTap(btn); });
      })(answers[j]);
    }

    // Mở khóa âm thanh ở lần chạm đầu tiên bất kỳ.
    document.addEventListener('touchend', unlockAudio, { passive: true });
    document.addEventListener('click', unlockAudio);
    // Chặn phóng to bằng 2 ngón tay trên Safari.
    document.addEventListener('gesturestart', function (e) { e.preventDefault(); });

    var relayout = function () { setTimeout(layout, 120); };
    window.addEventListener('resize', relayout);
    window.addEventListener('orientationchange', relayout);

    // Danh sách giọng đọc có thể tải chậm.
    setTimeout(checkVoice, 1200);

    if ('serviceWorker' in navigator && location.protocol === 'https:') {
      navigator.serviceWorker.register('sw.js').catch(function () {});
    }
  }

  init();
  window.KidGame = { state: state }; // cho tools/test-webkit.js kiểm tra tự động
})();
