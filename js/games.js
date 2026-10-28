/* Nội dung và luật của 3 mini-game. Mỗi game có hàm make(prev) tạo một lượt chơi mới. */
var Games = (function () {
  var C = Art.COLORS;
  var ALL_COLORS = [C.red, C.orange, C.yellow, C.green, C.blue, C.purple, C.pink];

  // Các cặp màu dễ nhầm với trẻ nhỏ — không dùng để làm "khác nhau".
  var CONFUSABLE = [[C.red, C.pink], [C.red, C.orange], [C.orange, C.yellow]];

  function rand(n) { return Math.floor(Math.random() * n); }
  function pick(arr) { return arr[rand(arr.length)]; }
  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = rand(i + 1);
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function confusable(c1, c2) {
    for (var i = 0; i < CONFUSABLE.length; i++) {
      var p = CONFUSABLE[i];
      if ((p[0] === c1 && p[1] === c2) || (p[0] === c2 && p[1] === c1)) return true;
    }
    return false;
  }
  function otherColor(colors, c) {
    var choices = colors.filter(function (x) { return x !== c && !confusable(x, c); });
    return pick(choices);
  }

  // ---------- Mini-game 1: Từ trái nghĩa ----------
  // draw(isFirst, color): isFirst = true là tính từ thứ nhất (to / dài / cao).
  var OPPOSITES = [
    { name: 'cái bát', words: ['to', 'nhỏ'], colors: ALL_COLORS,
      draw: function (a, c) { return Art.scaled(Art.bowl(c), a ? 1 : 0.5, 184); } },
    { name: 'quả bóng', words: ['to', 'nhỏ'], colors: [C.orange],
      draw: function (a, c) { return Art.scaled(Art.ball(c), a ? 1 : 0.48, 184); } },
    { name: 'quả táo', words: ['to', 'nhỏ'], colors: [C.red, C.green],
      draw: function (a, c) { return Art.scaled(Art.apple(c), a ? 1 : 0.5, 182); } },
    { name: 'con cá', words: ['to', 'nhỏ'], colors: [C.orange, C.blue, C.purple],
      draw: function (a, c) { return Art.scaled(Art.fish(c), a ? 1 : 0.5, 108); } },
    { name: 'cái bút chì', words: ['dài', 'ngắn'], colors: [C.red, C.blue, C.green, C.purple],
      draw: function (a, c) { return Art.pencil(c, a ? 186 : 96); } },
    { name: 'cái thước kẻ', words: ['dài', 'ngắn'], colors: [null],
      draw: function (a) { return Art.ruler(a ? 184 : 82); } },
    { name: 'con sâu', words: ['dài', 'ngắn'], colors: [null],
      draw: function (a) { return Art.caterpillar(a ? 6 : 2); } },
    { name: 'cái cây', words: ['cao', 'thấp'], colors: [null],
      draw: function (a) { return Art.tree(a ? 96 : 14); } },
    { name: 'ngôi nhà', words: ['cao', 'thấp'], colors: [null],
      draw: function (a) { return Art.building(a ? 6 : 2); } },
    { name: 'cây nến', words: ['cao', 'thấp'], colors: [C.pink, C.blue, C.purple],
      draw: function (a, c) { return Art.candle(a ? 130 : 40, c); } },
    { name: 'cái áo', words: ['mới', 'cũ'], colors: [C.blue, C.red, C.green, C.purple],
      draw: function (a, c) { return Art.shirt(c, !a); } },
    { name: 'chiếc giày', words: ['mới', 'cũ'], colors: [C.red, C.blue, C.green, C.purple],
      draw: function (a, c) { return Art.shoe(c, !a); } },
    { name: 'chiếc ô tô', words: ['mới', 'cũ'], colors: [C.red, C.blue, C.yellow, C.green],
      draw: function (a, c) { return Art.carAge(c, !a); } },
    { name: 'con mèo', words: ['béo', 'gầy'], colors: [null],
      draw: function (a) { return Art.cat(a); } },
    { name: 'con chó', words: ['béo', 'gầy'], colors: [null],
      draw: function (a) { return Art.dog(a); } },
    { name: 'con chim', words: ['béo', 'gầy'], colors: [null],
      draw: function (a) { return Art.bird(a); } },
    { name: 'con lợn', words: ['sạch', 'bẩn'], colors: [null],
      draw: function (a) { return Art.pig(!a); } },
    { name: 'cái đĩa', words: ['sạch', 'bẩn'], colors: [null],
      draw: function (a) { return Art.plate(!a); } },
    { name: 'bàn tay', words: ['sạch', 'bẩn'], colors: [null],
      draw: function (a) { return Art.hand(!a); } },
    { name: 'cốc nước', words: ['nóng', 'lạnh'], colors: [null],
      draw: function (a) { return Art.cup(a); } },
    { name: 'cái nồi', words: ['nóng', 'lạnh'], colors: [null],
      draw: function (a) { return Art.pot(a); } },
    { name: 'cái ấm', words: ['nóng', 'lạnh'], colors: [null],
      draw: function (a) { return Art.kettle(a); } },
    { name: 'quyển sách', words: ['dày', 'mỏng'], colors: [C.red, C.blue, C.green, C.purple],
      draw: function (a, c) { return Art.book(c, a); } },
    { name: 'miếng bánh mì', words: ['dày', 'mỏng'], colors: [null],
      draw: function (a) { return Art.bread(a); } },
    { name: 'cái đệm', words: ['dày', 'mỏng'], colors: [null],
      draw: function (a) { return Art.mattress(a); } },
    // link: chèn sau "nào" cho tự nhiên — "Bức tranh nào là ban đêm?"
    { name: 'bức tranh', words: ['ban ngày', 'ban đêm'], link: 'là ', colors: [null],
      draw: function (a) { return Art.scene(a, 'house'); } },
    { name: 'bức tranh', words: ['ban ngày', 'ban đêm'], link: 'là ', colors: [null],
      draw: function (a) { return Art.scene(a, 'beach'); } },
    { name: 'bức tranh', words: ['ban ngày', 'ban đêm'], link: 'là ', colors: [null],
      draw: function (a) { return Art.scene(a, 'garden'); } },
    // Cứng – mềm, nặng – nhẹ: mỗi cặp tranh là hai vật khác nhau.
    { name: 'vật', words: ['cứng', 'mềm'], colors: [null],
      draw: function (a) { return a ? Art.rock() : Art.pillow(); } },
    { name: 'vật', words: ['cứng', 'mềm'], colors: [null],
      draw: function (a) { return a ? Art.brick() : Art.teddy(); } },
    { name: 'vật', words: ['cứng', 'mềm'], colors: [null],
      draw: function (a) { return a ? Art.hammer() : Art.yarn(); } },
    { name: 'vật', words: ['nặng', 'nhẹ'], colors: [null],
      draw: function (a) { return a ? Art.dumbbell() : Art.feather(); } },
    { name: 'vật', words: ['nặng', 'nhẹ'], colors: [null],
      draw: function (a) { return a ? Art.elephant() : Art.balloon(C.red); } },
    { name: 'vật', words: ['nặng', 'nhẹ'], colors: [null],
      draw: function (a) { return a ? Art.truck() : Art.leaf(); } }
  ];

  function categoryOf(item) { return item.words.join('-'); }

  // ---------- Bộ câu hỏi của trò 1 ----------
  // Mỗi câu hỏi = một cặp tranh + một tính từ (ví dụ cốc nước + "nóng"), nên mỗi cặp tranh
  // được hỏi đủ cả hai tính từ. Cả bộ được xếp thứ tự trước rồi hỏi lần lượt, hết bộ mới
  // xếp bộ mới. Khi xếp: không câu nào lặp lại trong RECENT câu gần nhất (kể cả lúc nối
  // sang bộ mới), hai câu của cùng một cặp tranh cách xa nhau, không hai câu liền cùng
  // cặp tính từ. Thứ tự được lưu trong máy để thoát ra vào lại vẫn hỏi tiếp, không lặp.
  var RECENT = 20;
  var DECK_KEY = 'be-hoc-vui:tim-vat';
  var DECK_VERSION = OPPOSITES.map(function (it) { return it.name + categoryOf(it); }).join('|');
  var deck = { order: [], history: [] };

  function itemOf(id) { return +id.split(':')[0]; }
  function wordOf(id) { return +id.split(':')[1]; }
  function catOf(id) { return categoryOf(OPPOSITES[itemOf(id)]); }
  // Câu hỏi bé nghe thấy: "vật" + "nhẹ" là cùng một câu dù tranh khác nhau.
  function textOf(id) { var it = OPPOSITES[itemOf(id)]; return it.name + '|' + it.words[wordOf(id)]; }

  function loadDeck() {
    try {
      var saved = JSON.parse(localStorage.getItem(DECK_KEY));
      if (saved && saved.version === DECK_VERSION) deck = { order: saved.order, history: saved.history };
    } catch (e) { /* không có bộ nhớ: bắt đầu bộ mới */ }
  }
  function saveDeck() {
    try {
      localStorage.setItem(DECK_KEY, JSON.stringify({ version: DECK_VERSION, order: deck.order, history: deck.history }));
    } catch (e) { /* bỏ qua */ }
  }

  // Đếm số lần một thứ tự phá luật (tính cả đoạn cuối của bộ trước).
  function violations(history, order) {
    var seq = history.slice(-RECENT).concat(order), start = seq.length - order.length, bad = 0;
    for (var i = start; i < seq.length; i++) {
      for (var j = Math.max(0, i - RECENT + 1); j < i; j++) {
        if (textOf(seq[j]) === textOf(seq[i])) bad++;
        if (i - j < 4 && itemOf(seq[j]) === itemOf(seq[i])) bad++;
      }
      if (i > 0 && catOf(seq[i - 1]) === catOf(seq[i])) bad++;
    }
    return bad;
  }

  // Xếp vài lần, lấy thứ tự đầu tiên không phá luật (hoặc ít lỗi nhất).
  function buildOrder(history) {
    var best = null, bestBad = Infinity;
    for (var tries = 0; tries < 60 && bestBad > 0; tries++) {
      var order = tryOrder(history);
      var bad = violations(history, order);
      if (bad < bestBad) { best = order; bestBad = bad; }
    }
    return best;
  }

  function tryOrder(history) {
    var remaining = [];
    OPPOSITES.forEach(function (it, i) { remaining.push(i + ':0', i + ':1'); });
    remaining = shuffle(remaining);
    var seq = history.slice(-RECENT);
    var order = [];
    while (remaining.length) {
      var recent = seq.slice(-RECENT);
      var recentText = recent.map(textOf);
      var lastCat = seq.length ? catOf(seq[seq.length - 1]) : null;
      var nearItems = seq.slice(-8).map(itemOf);
      var fresh = function (id) { return recentText.indexOf(textOf(id)) < 0; };
      // Lọc theo ràng buộc, nới dần nếu không còn câu nào thoả.
      var rules = [
        function (id) { return fresh(id) && catOf(id) !== lastCat && nearItems.indexOf(itemOf(id)) < 0; },
        function (id) { return fresh(id) && catOf(id) !== lastCat; },
        function (id) { return fresh(id); },
        function (id) { return recent.indexOf(id) < 0; },
        function () { return true; }
      ];
      var cands = [];
      for (var k = 0; k < rules.length && !cands.length; k++) cands = remaining.filter(rules[k]);
      // Ưu tiên cặp tính từ còn nhiều câu (để các cặp trải đều suốt bộ), và rất ưu tiên
      // câu còn nhiều bản cùng chữ (như "vật nhẹ" có 3 cặp tranh) vì chúng phải cách nhau xa.
      var leftCat = {}, leftText = {};
      remaining.forEach(function (id) {
        leftCat[catOf(id)] = (leftCat[catOf(id)] || 0) + 1;
        leftText[textOf(id)] = (leftText[textOf(id)] || 0) + 1;
      });
      var weight = function (id) { var t = leftText[textOf(id)]; return leftCat[catOf(id)] * t * t * t; };
      var total = 0;
      cands.forEach(function (id) { total += weight(id); });
      var r = Math.random() * total, chosen = cands[0];
      for (var j = 0; j < cands.length; j++) {
        r -= weight(cands[j]);
        if (r <= 0) { chosen = cands[j]; break; }
      }
      order.push(chosen);
      seq.push(chosen);
      remaining.splice(remaining.indexOf(chosen), 1);
    }
    return order;
  }

  function nextQuestion() {
    if (!deck.order.length) deck.order = buildOrder(deck.history);
    var id = deck.order.shift();
    deck.history.push(id);
    if (deck.history.length > 40) deck.history = deck.history.slice(-40);
    saveDeck();
    return id;
  }

  // Tranh đúng không nằm cùng một bên quá 2 lần liền.
  var sides = [];
  function correctSide() {
    var n = sides.length;
    var side = (n >= 2 && sides[n - 1] === sides[n - 2]) ? 1 - sides[n - 1] : rand(2);
    sides.push(side);
    if (sides.length > 10) sides.shift();
    return side;
  }

  if (typeof localStorage !== 'undefined') loadDeck();

  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

  // Chọn một mẫu câu, tránh lặp lại mẫu vừa dùng của cùng danh sách.
  var lastUsed = {};
  function vary(key, list) {
    var i;
    do { i = rand(list.length); } while (list.length > 1 && i === lastUsed[key]);
    lastUsed[key] = i;
    return list[i];
  }

  // ================= Mẫu câu =================
  // Nhiều cách nói cho cùng một ý để bé làm quen với cách diễn đạt khác nhau.
  // Giọng miền Bắc: dùng "nhé", "nhỉ", "nào", "đấy".

  // --- Trò 1: n = tên đồ vật ("cái bát"), w = tính từ ("to"), l = chữ nối sau "nào" ("là " hoặc "") ---
  var Q_OPPOSITE = [
    function (n, w) { return 'Bé hãy chọn ' + n + ' ' + w + '.'; },
    function (n, w) { return 'Đâu là ' + n + ' ' + w + '?'; },
    function (n, w, l) { return cap(n) + ' nào ' + l + w + '?'; },
    function (n, w) { return 'Bé chạm vào ' + n + ' ' + w + ' nhé!'; },
    function (n, w) { return cap(n) + ' ' + w + ' ở đâu nhỉ?'; },
    function (n, w, l) { return 'Bé tìm xem ' + n + ' nào ' + l + w + ' nhé!'; }
  ];
  var PRAISE_OPPOSITE = [
    function (n, w) { return 'Đúng rồi! Đây là ' + n + ' ' + w + '.'; },
    function (n, w) { return 'Giỏi quá! Bé chọn đúng ' + n + ' ' + w + ' rồi.'; }
  ];
  // w = từ cần tìm, w2 = từ của đồ vật bé lỡ chọn
  var RETRY_OPPOSITE = [
    function (n, w, w2) { return 'Đây là ' + n + ' ' + w2 + '. Bé tìm ' + n + ' ' + w + ' nhé!'; }
  ];

  // --- Trò 2: s = chủ ngữ ("hai quả bóng này" / "hai bức tranh này") ---
  var Q_SAMEDIFF = [
    function (s) { return cap(s) + ' giống nhau hay khác nhau?'; },
    function (s) { return 'Bé nhìn xem, ' + s + ' giống hay khác?'; },
    function (s) { return 'Theo bé, ' + s + ' giống nhau hay khác nhau?'; },
    function (s) { return 'Bé ơi, ' + s + ' giống hay khác nhau nhỉ?'; },
    function (s) { return cap(s) + ' là giống nhau, hay khác nhau?'; }
  ];
  // kind: 'same' | 'color' (cùng loại, khác màu) | 'type' (khác loại)
  var PRAISE_SAMEDIFF = {
    same: [
      function (s) { return 'Đúng rồi! ' + cap(s) + ' giống hệt nhau.'; },
      function (s) { return 'Chính xác! ' + cap(s) + ' giống nhau đấy.'; }
    ],
    color: [
      function (s) { return 'Đúng rồi! ' + cap(s) + ' khác màu nhau.'; },
      function (s) { return 'Chính xác! ' + cap(s) + ' khác nhau đấy.'; }
    ],
    type: [
      function (s) { return 'Đúng rồi! ' + cap(s) + ' khác nhau.'; },
      function (s) { return 'Chính xác! ' + cap(s) + ' không giống nhau.'; }
    ]
  };
  var RETRY_SAMEDIFF = ['Bé nhìn kỹ màu sắc và hình dáng nhé!'];

  // --- Trò 3: w = "giống nhau" / "khác nhau" ---
  var Q_FINDPAIR = [
    function (w) { return 'Tìm hai tranh ' + w + '.'; },
    function (w) { return 'Bé hãy tìm hai tranh ' + w + '.'; },
    function (w) { return 'Hai tranh nào ' + w + '?'; },
    function (w) { return 'Đâu là hai tranh ' + w + '?'; },
    function (w) { return 'Bé chạm vào hai tranh ' + w + ' nhé!'; },
    function (w) { return 'Bé thử tìm xem hai tranh nào ' + w + ' nhé!'; }
  ];
  var PRAISE_FINDPAIR = [
    function (w) { return 'Đúng rồi! Hai tranh này ' + w + '.'; },
    function (w) { return 'Giỏi quá! Bé tìm đúng hai tranh ' + w + ' rồi.'; }
  ];
  // Bé chọn nhầm hai tranh có quan hệ ngược lại với câu hỏi.
  var RETRY_FINDPAIR = {
    same: 'Hai tranh này khác nhau rồi. Bé tìm hai tranh giống nhau nhé!',
    diff: 'Hai tranh này giống nhau mà. Bé tìm hai tranh khác nhau nhé!'
  };

  // --- Dùng chung ---
  var PRAISE = [
    'Đúng rồi! Bé giỏi quá!', 'Hoan hô bé!', 'Tuyệt vời!', 'Bé giỏi lắm!', 'Chính xác!',
    'Giỏi quá đi mất!', 'Bé làm đúng rồi!', 'Xuất sắc!', 'Bé thông minh quá!',
    'Bé tinh mắt quá!', 'Hay lắm! Bé chọn đúng rồi!', 'Bé thật là giỏi!', 'Làm tốt lắm!'
  ];
  var RETRY = [
    'Bé thử lại nhé!', 'Chưa đúng rồi, bé thử lại nào!', 'Sai mất rồi, bé chọn lại nhé!',
    'Ồ, chưa đúng. Bé nhìn kỹ lại xem!', 'Bé nhìn thật kỹ rồi chọn lại nhé!',
    'Chưa phải rồi, cố lên bé ơi!', 'Không sao đâu, bé thử lần nữa nào!'
  ];

  // ================= Mini-game 1: Từ trái nghĩa =================
  var opposite = {
    key: 'opposite',
    make: function () {
      var id = nextQuestion();
      var item = OPPOSITES[itemOf(id)];
      var askFirst = wordOf(id) === 0;
      var word = item.words[askFirst ? 0 : 1];
      var color = pick(item.colors);
      var right = { svg: item.draw(askFirst, color), correct: true };
      var wrongOpt = { svg: item.draw(!askFirst, color), correct: false };
      var options = correctSide() === 0 ? [right, wrongOpt] : [wrongOpt, right];
      var speech = vary('q1', Q_OPPOSITE)(item.name, word, item.link || '');
      return {
        id: id,
        item: item,
        word: word,
        otherWord: item.words[askFirst ? 1 : 0],
        kind: 'pick1',
        text: speech,
        speech: speech,
        options: options
      };
    },
    praise: function (r) { return vary('p1', PRAISE_OPPOSITE)(r.item.name, r.word); },
    retry: function (r) { return vary('r1', RETRY_OPPOSITE)(r.item.name, r.word, r.otherWord); }
  };

  // ================= Đồ vật dùng cho Giống – Khác =================
  var THINGS = [
    { key: 'ball', name: 'quả bóng', draw: Art.ball, colors: ALL_COLORS },
    { key: 'apple', name: 'quả táo', draw: Art.apple, colors: [C.red, C.green, C.yellow] },
    { key: 'fish', name: 'con cá', draw: Art.fish, colors: [C.orange, C.blue, C.purple, C.green, C.red] },
    { key: 'pencil', name: 'cái bút chì', draw: Art.pencilTilted, colors: ALL_COLORS },
    { key: 'car', name: 'chiếc ô tô', draw: Art.car, colors: ALL_COLORS },
    { key: 'star', name: 'ngôi sao', draw: Art.star, colors: ALL_COLORS },
    { key: 'flower', name: 'bông hoa', draw: Art.flower, colors: [C.red, C.yellow, C.purple, C.blue, C.orange] },
    { key: 'balloon', name: 'quả bóng bay', draw: Art.balloon, colors: ALL_COLORS },
    { key: 'bowl', name: 'cái bát', draw: Art.bowl, colors: ALL_COLORS }
  ];
  var PICTURES = 'hai bức tranh này'; // chủ ngữ khi hai đồ vật khác loại

  function thing(t, color) {
    return { type: t, color: color, svg: t.draw(color) };
  }
  function sameThing(a, b) { return a.type === b.type && a.color === b.color; }

  // Tạo một đồ vật khác với `base`: khác màu (cùng loại) hoặc khác loại hẳn.
  function differentFrom(base, preferColor) {
    if (Math.random() < preferColor) {
      return thing(base.type, otherColor(base.type.colors, base.color));
    }
    var t;
    do { t = pick(THINGS); } while (t === base.type);
    return thing(t, pick(t.colors));
  }

  // Hai tranh khác `base` và khác nhau. Thường cùng loại khác màu (khó hơn),
  // đôi khi khác loại; màu không được dễ nhầm với nhau.
  function twoOthers(base) {
    var t = base.type;
    if (Math.random() < 0.7) {
      var ok = function (c, used) {
        return used.every(function (u) { return c !== u && !confusable(c, u); });
      };
      var c1 = t.colors.filter(function (c) { return ok(c, [base.color]); });
      if (c1.length) {
        var b = pick(c1);
        var c2 = t.colors.filter(function (c) { return ok(c, [base.color, b]); });
        if (c2.length) return [thing(t, b), thing(t, pick(c2))];
      }
    }
    var others = shuffle(THINGS.filter(function (x) { return x !== t; }));
    return [thing(others[0], pick(others[0].colors)), thing(others[1], pick(others[1].colors))];
  }

  // Các kiểu bố trí 4 tranh của trò 3 (A, B, C là các tranh khác nhau):
  //   AABC — 1 cặp giống + 2 tranh khác     AABB — 2 cặp giống nhau
  //   AAAB — 3 tranh giống + 1 tranh lẻ
  // Tìm giống: cặp giống nào cũng đúng. Tìm khác: cặp khác nhau nào cũng đúng.
  var LAYOUTS_SAME = ['AABC', 'AABC', 'AABB', 'AABB', 'AAAB'];
  var LAYOUTS_DIFF = ['AAAB', 'AAAB', 'AABC', 'AABB'];

  function buildLayout(layout, a) {
    var copy = function (x) { return thing(x.type, x.color); };
    if (layout === 'AAAB') return [a, copy(a), copy(a), differentFrom(a, 0.7)];
    var others = twoOthers(a);
    if (layout === 'AABB') return [a, copy(a), others[0], copy(others[0])];
    return [a, copy(a), others[0], others[1]];
  }

  function signature(items) {
    return items.map(function (x) { return x.type.key + x.color; }).join('|');
  }

  // ================= Mini-game 2: Giống hay Khác =================
  var samediff = {
    key: 'samediff',
    make: function (prev) {
      var r, tries = 0;
      do {
        var t = pick(THINGS);
        var a = thing(t, pick(t.colors));
        var isSame = Math.random() < 0.5;
        var b = isSame ? thing(t, a.color) : differentFrom(a, 0.65);
        var pair = shuffle([a, b]);
        var sameType = a.type === b.type;
        r = {
          kind: 'samediff',
          subject: sameType ? 'hai ' + t.name + ' này' : PICTURES,
          diffKind: isSame ? 'same' : (sameType ? 'color' : 'type'),
          options: pair,
          answer: isSame ? 'same' : 'diff',
          sig: signature(pair)
        };
      } while (prev && prev.sig === r.sig && ++tries < 10);
      r.speech = r.text = vary('q2', Q_SAMEDIFF)(r.subject);
      return r;
    },
    praise: function (r) { return vary('p2', PRAISE_SAMEDIFF[r.diffKind])(r.subject); },
    retry: function () { return vary('r2', RETRY_SAMEDIFF); }
  };

  // ================= Mini-game 3: Tìm 2 tranh giống / khác nhau =================
  var findpair = {
    key: 'findpair',
    make: function (prev) {
      var r, tries = 0;
      do {
        var t;
        do { t = pick(THINGS); } while (prev && prev.baseType === t);
        var a = thing(t, pick(t.colors));
        var mode = Math.random() < 0.55 ? 'same' : 'diff';
        var layout = pick(mode === 'same' ? LAYOUTS_SAME : LAYOUTS_DIFF);
        r = {
          kind: 'pick2',
          mode: mode,
          layout: layout,
          baseType: t,
          cols: 2, // luôn xếp khung 2 x 2
          word: mode === 'same' ? 'giống nhau' : 'khác nhau',
          options: shuffle(buildLayout(layout, a))
        };
        r.sig = mode + signature(r.options);
      } while (prev && prev.sig === r.sig && ++tries < 10);
      r.speech = vary('q3', Q_FINDPAIR)(r.word);
      r.text = r.speech.replace('hai tranh', '2 tranh');
      return r;
    },
    // Đúng khi: tìm giống → hai tranh cùng loại cùng màu; tìm khác → hai tranh không giống nhau.
    check: function (round, a, b) {
      if (round.mode === 'same') return sameThing(a, b);
      return !sameThing(a, b);
    },
    praise: function (r) { return vary('p3', PRAISE_FINDPAIR)(r.word); },
    retry: function (r) { return RETRY_FINDPAIR[r.mode]; }
  };

  // Lời khen / lời động viên: nửa số lần dùng câu nhắc lại kiến thức của lượt chơi,
  // nửa còn lại dùng câu chung.
  function praise(game, round) {
    return Math.random() < 0.5 ? game.praise(round) : vary('praise', PRAISE);
  }
  function retry(game, round) {
    return Math.random() < 0.5 ? game.retry(round) : vary('retry', RETRY);
  }

  // Mọi câu game có thể đọc — dùng để thu sẵn giọng đọc (tools/make-voice.py).
  function phrases() {
    var list = [];
    var add = function (s) { if (list.indexOf(s) < 0) list.push(s); };
    var each = function (fns, args) { fns.forEach(function (f) { add(f.apply(null, args)); }); };

    OPPOSITES.forEach(function (item) {
      [0, 1].forEach(function (i) {
        var w = item.words[i], w2 = item.words[1 - i];
        each(Q_OPPOSITE, [item.name, w, item.link || '']);
        each(PRAISE_OPPOSITE, [item.name, w]);
        each(RETRY_OPPOSITE, [item.name, w, w2]);
      });
    });
    THINGS.forEach(function (t) {
      var s = 'hai ' + t.name + ' này';
      each(Q_SAMEDIFF, [s]);
      each(PRAISE_SAMEDIFF.same, [s]);
      each(PRAISE_SAMEDIFF.color, [s]);
    });
    each(Q_SAMEDIFF, [PICTURES]);
    each(PRAISE_SAMEDIFF.type, [PICTURES]);
    RETRY_SAMEDIFF.forEach(add);
    ['giống nhau', 'khác nhau'].forEach(function (w) {
      each(Q_FINDPAIR, [w]);
      each(PRAISE_FINDPAIR, [w]);
    });
    add(RETRY_FINDPAIR.same);
    add(RETRY_FINDPAIR.diff);
    PRAISE.forEach(add);
    RETRY.forEach(add);
    return list;
  }

  return {
    opposite: opposite,
    samediff: samediff,
    findpair: findpair,
    praise: praise,
    retry: retry,
    phrases: phrases
  };
})();
