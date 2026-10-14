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
      return {
        item: item,
        kind: 'pick1',
        text: 'Bé hãy chọn ' + item.name + ' ' + word,
        speech: 'Bé hãy chọn ' + item.name + ' ' + word + '.',
        options: options
      };
    }
  };

  // ---------- Đồ vật dùng cho Giống – Khác ----------
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

  // ---------- Mini-game 2: Giống hay Khác ----------
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
        var subject = pair[0].type === pair[1].type ? 'Hai ' + t.name + ' này' : 'Hai đồ vật này';
        r = {
          kind: 'samediff',
          text: 'Giống nhau hay khác nhau?',
          speech: subject + ' giống nhau hay khác nhau?',
          options: pair,
          answer: isSame ? 'same' : 'diff',
          sig: signature(pair)
        };
      } while (prev && prev.sig === r.sig && ++tries < 10);
      return r;
    }
  };

  // ---------- Mini-game 3: Tìm 2 đồ vật giống / khác nhau ----------
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
        var word = mode === 'same' ? 'giống nhau' : 'khác nhau';
        r = {
          kind: 'pick2',
          mode: mode,
          text: 'Tìm 2 đồ vật ' + word,
          speech: 'Bé hãy tìm hai đồ vật ' + word + '.',
          options: items,
          sig: mode + signature(items)
        };
      } while (prev && prev.sig === r.sig && ++tries < 10);
      return r;
    },
    // Đúng khi: tìm giống → hai đồ vật cùng loại cùng màu; tìm khác → có đồ vật lẻ.
    check: function (round, a, b) {
      if (round.mode === 'same') return sameThing(a, b);
      return !sameThing(a, b);
    }
  };

  var PRAISE = ['Đúng rồi! Bé giỏi quá!', 'Hoan hô bé!', 'Tuyệt vời!', 'Bé giỏi lắm!', 'Chính xác! Giỏi quá!'];
  var RETRY = 'Bé thử lại nhé!';

  // Mọi câu game có thể đọc — dùng để thu sẵn giọng đọc (tools/make-voice.py).
  function phrases() {
    var list = [];
    OPPOSITES.forEach(function (item) {
      item.words.forEach(function (w) { list.push('Bé hãy chọn ' + item.name + ' ' + w + '.'); });
    });
    THINGS.forEach(function (t) { list.push('Hai ' + t.name + ' này giống nhau hay khác nhau?'); });
    list.push('Hai đồ vật này giống nhau hay khác nhau?');
    list.push('Bé hãy tìm hai đồ vật giống nhau.');
    list.push('Bé hãy tìm hai đồ vật khác nhau.');
    return list.concat(PRAISE, [RETRY]).filter(function (p, i, all) { return all.indexOf(p) === i; });
  }

  return {
    opposite: opposite,
    samediff: samediff,
    findpair: findpair,
    praise: function () { return pick(PRAISE); },
    retry: RETRY,
    phrases: phrases
  };
})();
