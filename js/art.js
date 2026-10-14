/* Hình vẽ đồ vật bằng SVG. Mỗi hình nằm trong khung 200 x 200, mặt đất ở y = 185. */
var Art = (function () {
  var COLORS = {
    red: '#ff4d4d',
    orange: '#ff9f1c',
    yellow: '#ffd23f',
    green: '#3dcc6b',
    blue: '#3fa9f5',
    purple: '#9b5de5',
    pink: '#ff6fb5'
  };

  // Pha màu với trắng (amt > 0) hoặc đen (amt < 0).
  function shade(hex, amt) {
    var n = parseInt(hex.slice(1), 16);
    var r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
    var t = amt < 0 ? 0 : 255;
    var p = Math.abs(amt);
    r = Math.round((t - r) * p + r);
    g = Math.round((t - g) * p + g);
    b = Math.round((t - b) * p + b);
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }

  var OUT = '#3a3a4a'; // màu viền

  // ---------- Đồ vật cho trò To – Nhỏ (dùng chung trong trò Giống – Khác) ----------

  function bowl(color) {
    color = color || COLORS.blue;
    return '' +
      '<path d="M74 166 L78 184 L122 184 L126 166 Z" fill="' + shade(color, -0.25) + '"/>' +
      '<path d="M20 100 Q24 172 100 174 Q176 172 180 100 Z" fill="' + color + '"/>' +
      '<ellipse cx="100" cy="100" rx="80" ry="17" fill="' + shade(color, 0.45) + '"/>' +
      '<ellipse cx="100" cy="103" rx="66" ry="10" fill="' + shade(color, -0.2) + '" opacity="0.45"/>' +
      '<circle cx="62" cy="134" r="7" fill="#fff" opacity="0.85"/>' +
      '<circle cx="100" cy="142" r="7" fill="#fff" opacity="0.85"/>' +
      '<circle cx="138" cy="134" r="7" fill="#fff" opacity="0.85"/>';
  }

  function ball(color) {
    color = color || COLORS.orange;
    var line = 'fill="none" stroke="#3b2a20" stroke-width="4.5" stroke-linecap="round"';
    return '' +
      '<circle cx="100" cy="110" r="74" fill="' + color + '"/>' +
      '<path d="M100 36 V184" ' + line + '/>' +
      '<path d="M26 110 H174" ' + line + '/>' +
      '<path d="M50 55 Q82 110 50 165" ' + line + '/>' +
      '<path d="M150 55 Q118 110 150 165" ' + line + '/>' +
      '<circle cx="100" cy="110" r="74" fill="none" stroke="' + shade(color, -0.3) + '" stroke-width="4"/>' +
      '<ellipse cx="72" cy="72" rx="18" ry="11" fill="#fff" opacity="0.35" transform="rotate(-35 72 72)"/>';
  }

  function apple(color) {
    color = color || COLORS.red;
    return '' +
      '<path d="M100 66 C70 44 22 60 26 112 C30 160 70 192 100 174 C130 192 170 160 174 112 C178 60 130 44 100 66 Z" fill="' + color + '"/>' +
      '<path d="M100 68 Q97 44 108 26" fill="none" stroke="#7a4a22" stroke-width="8" stroke-linecap="round"/>' +
      '<path d="M107 44 Q128 18 156 30 Q134 56 107 44 Z" fill="#3dcc6b"/>' +
      '<ellipse cx="62" cy="100" rx="11" ry="20" fill="#fff" opacity="0.35" transform="rotate(20 62 100)"/>';
  }

  function fish(color) {
    color = color || COLORS.orange;
    var dark = shade(color, -0.2);
    return '' +
      '<path d="M146 108 L190 72 Q178 108 190 144 Z" fill="' + dark + '"/>' +
      '<path d="M66 72 Q96 36 126 74 Z" fill="' + dark + '"/>' +
      '<ellipse cx="92" cy="108" rx="66" ry="44" fill="' + color + '"/>' +
      '<path d="M100 82 Q114 108 100 134" fill="none" stroke="' + shade(color, 0.4) + '" stroke-width="5" stroke-linecap="round"/>' +
      '<path d="M120 82 Q134 108 120 134" fill="none" stroke="' + shade(color, 0.4) + '" stroke-width="5" stroke-linecap="round"/>' +
      '<circle cx="58" cy="96" r="12" fill="#fff"/>' +
      '<circle cx="55" cy="96" r="6.5" fill="' + OUT + '"/>' +
      '<path d="M32 118 Q40 126 50 120" fill="none" stroke="' + OUT + '" stroke-width="4" stroke-linecap="round"/>' +
      '<circle cx="26" cy="64" r="6" fill="none" stroke="#7cc6f0" stroke-width="3"/>' +
      '<circle cx="16" cy="42" r="4" fill="none" stroke="#7cc6f0" stroke-width="3"/>';
  }

  // ---------- Dài – Ngắn ----------

  // Bút chì nằm ngang, dài L (gồm cả ngòi), tâm ở (100, 100).
  function pencil(color, L) {
    color = color || COLORS.blue;
    L = L || 170;
    var h = 36, y = 100, x0 = 100 - L / 2, x1 = 100 + L / 2;
    var top = y - h / 2;
    var bodyEnd = x1 - 38;
    return '' +
      '<rect x="' + x0 + '" y="' + top + '" width="22" height="' + h + '" rx="8" fill="#ff9fb2"/>' +
      '<rect x="' + (x0 + 16) + '" y="' + top + '" width="14" height="' + h + '" fill="#c9ced6"/>' +
      '<rect x="' + (x0 + 30) + '" y="' + top + '" width="' + (bodyEnd - x0 - 30) + '" height="' + h + '" fill="' + color + '"/>' +
      '<rect x="' + (x0 + 30) + '" y="' + (top + 12) + '" width="' + (bodyEnd - x0 - 30) + '" height="12" fill="' + shade(color, 0.25) + '"/>' +
      '<polygon points="' + bodyEnd + ',' + top + ' ' + x1 + ',' + y + ' ' + bodyEnd + ',' + (top + h) + '" fill="#f6d29b"/>' +
      '<polygon points="' + (x1 - 13) + ',' + (y - 6) + ' ' + x1 + ',' + y + ' ' + (x1 - 13) + ',' + (y + 6) + '" fill="' + color + '"/>';
  }

  function ruler(L) {
    L = L || 180;
    var x0 = 100 - L / 2, y = 82, h = 38;
    var s = '<rect x="' + x0 + '" y="' + y + '" width="' + L + '" height="' + h + '" rx="5" fill="#ffd23f" stroke="#e0a800" stroke-width="3"/>';
    var i = 0;
    for (var x = x0 + 8; x <= x0 + L - 6; x += 9, i++) {
      var th = i % 5 === 0 ? 18 : 10;
      s += '<line x1="' + x + '" y1="' + y + '" x2="' + x + '" y2="' + (y + th) + '" stroke="#7a5a00" stroke-width="2.5"/>';
    }
    return s;
  }

  // Sâu róm: n đốt thân + đầu.
  function caterpillar(n) {
    var step = 22, rHead = 25, r = 19;
    // Căn giữa cả con sâu, tính từ đốt đầu tiên tới đầu râu.
    var x0 = (184 - n * step) / 2;
    var s = '';
    for (var i = 0; i < n; i++) {
      var cx = x0 + i * step;
      var cy = 128 + (i % 2 ? -6 : 4);
      s += '<line x1="' + cx + '" y1="' + (cy + r - 4) + '" x2="' + cx + '" y2="' + (cy + r + 8) + '" stroke="#2f8f3a" stroke-width="4" stroke-linecap="round"/>';
      s += '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="' + (i % 2 ? '#7bd36b' : '#5cbf4f') + '"/>';
    }
    var hx = x0 + n * step + 6, hy = 112;
    s += '<path d="M' + (hx - 8) + ' ' + (hy - 20) + ' Q' + (hx - 14) + ' ' + (hy - 44) + ' ' + (hx - 24) + ' ' + (hy - 48) + '" fill="none" stroke="#2f8f3a" stroke-width="4" stroke-linecap="round"/>';
    s += '<path d="M' + (hx + 8) + ' ' + (hy - 20) + ' Q' + (hx + 14) + ' ' + (hy - 44) + ' ' + (hx + 24) + ' ' + (hy - 48) + '" fill="none" stroke="#2f8f3a" stroke-width="4" stroke-linecap="round"/>';
    s += '<circle cx="' + (hx - 24) + '" cy="' + (hy - 48) + '" r="5" fill="#ff6fb5"/>';
    s += '<circle cx="' + (hx + 24) + '" cy="' + (hy - 48) + '" r="5" fill="#ff6fb5"/>';
    s += '<circle cx="' + hx + '" cy="' + hy + '" r="' + rHead + '" fill="#9be07f"/>';
    s += '<circle cx="' + (hx - 9) + '" cy="' + (hy - 5) + '" r="5" fill="' + OUT + '"/>';
    s += '<circle cx="' + (hx + 9) + '" cy="' + (hy - 5) + '" r="5" fill="' + OUT + '"/>';
    s += '<path d="M' + (hx - 9) + ' ' + (hy + 8) + ' Q' + hx + ' ' + (hy + 16) + ' ' + (hx + 9) + ' ' + (hy + 8) + '" fill="none" stroke="' + OUT + '" stroke-width="3.5" stroke-linecap="round"/>';
    return s;
  }

  // ---------- Cao – Thấp ----------

  function ground() {
    return '<ellipse cx="100" cy="188" rx="90" ry="9" fill="#8edb7a"/>';
  }

  function tree(trunkH) {
    var top = 185 - trunkH;
    var cy = top - 30;
    return ground() +
      '<rect x="89" y="' + (top - 6) + '" width="22" height="' + (trunkH + 6) + '" rx="4" fill="#9b6a3c"/>' +
      '<circle cx="70" cy="' + (cy + 10) + '" r="30" fill="#2fae58"/>' +
      '<circle cx="130" cy="' + (cy + 10) + '" r="30" fill="#2fae58"/>' +
      '<circle cx="100" cy="' + (cy - 8) + '" r="38" fill="#3dcc6b"/>' +
      '<circle cx="120" cy="' + (cy - 14) + '" r="6" fill="#ff4d4d"/>' +
      '<circle cx="80" cy="' + (cy + 4) + '" r="6" fill="#ff4d4d"/>';
  }

  function building(floors) {
    var fh = 26, w = 84, x = 100 - w / 2;
    var top = 185 - floors * fh;
    var s = ground();
    s += '<polygon points="' + (x - 8) + ',' + (top + 2) + ' 100,' + (top - 24) + ' ' + (x + w + 8) + ',' + (top + 2) + '" fill="#ff6b6b"/>';
    s += '<rect x="' + x + '" y="' + top + '" width="' + w + '" height="' + (floors * fh) + '" fill="#8b9cf0"/>';
    for (var f = 0; f < floors; f++) {
      var wy = top + f * fh + 6;
      if (f === floors - 1) {
        s += '<rect x="92" y="' + (wy - 2) + '" width="16" height="' + (fh - 4) + '" rx="2" fill="#9b6a3c"/>';
        s += '<rect x="' + (x + 10) + '" y="' + wy + '" width="14" height="13" rx="2" fill="#fff3a8"/>';
        s += '<rect x="' + (x + w - 24) + '" y="' + wy + '" width="14" height="13" rx="2" fill="#fff3a8"/>';
      } else {
        s += '<rect x="' + (x + 10) + '" y="' + wy + '" width="14" height="13" rx="2" fill="#fff3a8"/>';
        s += '<rect x="' + (x + 35) + '" y="' + wy + '" width="14" height="13" rx="2" fill="#fff3a8"/>';
        s += '<rect x="' + (x + w - 24) + '" y="' + wy + '" width="14" height="13" rx="2" fill="#fff3a8"/>';
      }
    }
    return s;
  }

  function candle(h, color) {
    color = color || COLORS.pink;
    var top = 182 - h;
    var s = '<ellipse cx="100" cy="184" rx="42" ry="9" fill="#c9ced6"/>';
    s += '<rect x="80" y="' + top + '" width="40" height="' + h + '" rx="5" fill="' + color + '"/>';
    for (var y = top + 10; y < 176; y += 22) {
      s += '<path d="M80 ' + (y + 10) + ' L120 ' + y + ' L120 ' + (y + 8) + ' L80 ' + (y + 18) + ' Z" fill="#fff" opacity="0.5"/>';
    }
    s += '<line x1="100" y1="' + top + '" x2="100" y2="' + (top - 8) + '" stroke="' + OUT + '" stroke-width="3"/>';
    s += '<path d="M100 ' + (top - 40) + ' Q116 ' + (top - 16) + ' 100 ' + (top - 6) + ' Q84 ' + (top - 16) + ' 100 ' + (top - 40) + ' Z" fill="#ff9f1c"/>';
    s += '<path d="M100 ' + (top - 28) + ' Q108 ' + (top - 14) + ' 100 ' + (top - 9) + ' Q92 ' + (top - 14) + ' 100 ' + (top - 28) + ' Z" fill="#ffe66d"/>';
    return s;
  }

  // ---------- Đồ vật thêm cho trò Giống – Khác ----------

  function car(color) {
    color = color || COLORS.red;
    return '' +
      '<ellipse cx="100" cy="166" rx="86" ry="8" fill="#000" opacity="0.08"/>' +
      '<path d="M18 140 L18 114 Q20 100 40 98 L60 98 L80 66 Q85 58 96 58 L134 58 Q146 58 152 68 L170 98 Q184 100 184 116 L184 140 Z" fill="' + color + '"/>' +
      '<path d="M68 98 L86 72 Q88 68 94 68 L110 68 L110 98 Z" fill="#bfe8ff"/>' +
      '<path d="M120 68 L134 68 Q140 68 143 73 L157 98 L120 98 Z" fill="#bfe8ff"/>' +
      '<rect x="112" y="104" width="14" height="5" rx="2" fill="' + shade(color, -0.3) + '"/>' +
      '<circle cx="176" cy="118" r="6" fill="#ffe66d"/>' +
      '<circle cx="58" cy="142" r="21" fill="' + OUT + '"/><circle cx="58" cy="142" r="9" fill="#c9ced6"/>' +
      '<circle cx="146" cy="142" r="21" fill="' + OUT + '"/><circle cx="146" cy="142" r="9" fill="#c9ced6"/>';
  }

  function star(color) {
    color = color || COLORS.yellow;
    var pts = [];
    for (var i = 0; i < 10; i++) {
      var r = i % 2 ? 36 : 82;
      var a = -Math.PI / 2 + i * Math.PI / 5;
      pts.push((100 + r * Math.cos(a)).toFixed(1) + ',' + (110 + r * Math.sin(a)).toFixed(1));
    }
    return '' +
      '<polygon points="' + pts.join(' ') + '" fill="' + color + '" stroke="' + shade(color, -0.15) + '" stroke-width="10" stroke-linejoin="round"/>' +
      '<circle cx="86" cy="108" r="6" fill="' + OUT + '"/>' +
      '<circle cx="114" cy="108" r="6" fill="' + OUT + '"/>' +
      '<path d="M88 124 Q100 134 112 124" fill="none" stroke="' + OUT + '" stroke-width="4" stroke-linecap="round"/>';
  }

  function flower(color) {
    color = color || COLORS.pink;
    var s = '' +
      '<path d="M100 110 Q96 150 100 190" fill="none" stroke="#3dcc6b" stroke-width="8" stroke-linecap="round"/>' +
      '<path d="M100 160 Q126 136 148 148 Q126 172 100 160 Z" fill="#3dcc6b"/>' +
      '<path d="M99 172 Q74 150 54 160 Q74 182 99 172 Z" fill="#3dcc6b"/>';
    for (var i = 0; i < 6; i++) {
      var a = i * Math.PI / 3;
      s += '<circle cx="' + (100 + 36 * Math.cos(a)).toFixed(1) + '" cy="' + (76 + 36 * Math.sin(a)).toFixed(1) + '" r="27" fill="' + color + '"/>';
    }
    var center = color === COLORS.yellow || color === COLORS.orange ? '#9b6a3c' : '#ffd23f';
    s += '<circle cx="100" cy="76" r="23" fill="' + center + '"/>';
    return s;
  }

  function balloon(color) {
    color = color || COLORS.red;
    return '' +
      '<path d="M100 150 Q88 166 104 178 Q118 188 104 198" fill="none" stroke="#8a8a9a" stroke-width="3"/>' +
      '<ellipse cx="100" cy="82" rx="56" ry="66" fill="' + color + '"/>' +
      '<polygon points="100,146 90,158 110,158" fill="' + shade(color, -0.2) + '"/>' +
      '<ellipse cx="78" cy="56" rx="12" ry="20" fill="#fff" opacity="0.4" transform="rotate(25 78 56)"/>';
  }

  // Bút chì đặt chéo để vừa thẻ hình vuông.
  function pencilTilted(color) {
    return '<g transform="rotate(-35 100 100)">' + pencil(color, 190) + '</g>';
  }

  // ---------- Ghép thành thẻ SVG ----------

  // Phóng to/thu nhỏ quanh điểm (100, anchorY).
  function scaled(inner, s, anchorY) {
    if (s === 1) return inner;
    var ay = anchorY == null ? 100 : anchorY;
    return '<g transform="translate(100 ' + ay + ') scale(' + s + ') translate(-100 -' + ay + ')">' + inner + '</g>';
  }

  function svg(inner) {
    return '<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">' + inner + '</svg>';
  }

  // Ghép nhiều hình vào một khung rộng w x 200 (dùng cho ảnh trên trang chủ).
  function compose(w, parts) {
    var s = '<svg viewBox="0 0 ' + w + ' 200" xmlns="http://www.w3.org/2000/svg">';
    for (var i = 0; i < parts.length; i++) {
      var p = parts[i];
      s += '<g transform="translate(' + p.x + ' ' + p.y + ') scale(' + p.s + ')">' + p.inner + '</g>';
    }
    return s + '</svg>';
  }

  return {
    COLORS: COLORS,
    shade: shade,
    bowl: bowl, ball: ball, apple: apple, fish: fish,
    pencil: pencil, pencilTilted: pencilTilted, ruler: ruler, caterpillar: caterpillar,
    tree: tree, building: building, candle: candle,
    car: car, star: star, flower: flower, balloon: balloon,
    scaled: scaled, svg: svg, compose: compose
  };
})();
