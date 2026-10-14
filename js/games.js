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
      draw: function (a, c) { return Art.candle(a ? 130 : 40, c); } }
  ];

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

  // --- Trò 1: n = tên đồ vật ("cái bát"), w = tính từ ("to") ---
  var Q_OPPOSITE = [
    function (n, w) { return 'Bé hãy chọn ' + n + ' ' + w + '.'; },
    function (n, w) { return 'Đâu là ' + n + ' ' + w + '?'; },
    function (n, w) { return cap(n) + ' nào ' + w + '?'; },
    function (n, w) { return 'Bé chạm vào ' + n + ' ' + w + ' nhé!'; },
    function (n, w) { return cap(n) + ' ' + w + ' ở đâu nhỉ?'; },
    function (n, w) { return 'Bé tìm xem ' + n + ' nào ' + w + ' nhé!'; }
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
    make: function (prev) {
      var item;
      do { item = pick(OPPOSITES); } while (prev && prev.item === item);
      var color = pick(item.colors);
      var askFirst = Math.random() < 0.5;
      var word = item.words[askFirst ? 0 : 1];
      var options = shuffle([true, false]).map(function (isFirst) {
        return { svg: item.draw(isFirst, color), correct: isFirst === askFirst };
      });
      var speech = vary('q1', Q_OPPOSITE)(item.name, word);
      return {
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
        var t = pick(THINGS);
        var a = thing(t, pick(t.colors));
        var odd = differentFrom(a, 0.7);
        odd.odd = true;
        var items = shuffle([a, thing(t, a.color), odd]);
        var mode = Math.random() < 0.6 ? 'same' : 'diff';
        r = {
          kind: 'pick2',
          mode: mode,
          word: mode === 'same' ? 'giống nhau' : 'khác nhau',
          options: items,
          sig: mode + signature(items)
        };
      } while (prev && prev.sig === r.sig && ++tries < 10);
      r.speech = vary('q3', Q_FINDPAIR)(r.word);
      r.text = r.speech.replace('hai tranh', '2 tranh');
      return r;
    },
    // Đúng khi: tìm giống → hai tranh cùng loại cùng màu; tìm khác → có tranh lẻ.
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
        each(Q_OPPOSITE, [item.name, w]);
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
