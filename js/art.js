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

  // ---------- Thêm cho trò Tìm vật: các cặp tính từ mới ----------

  // Trộn hai màu: t = 0 là a, t = 1 là b.
  function mix(a, b, t) {
    var x = parseInt(a.slice(1), 16), y = parseInt(b.slice(1), 16);
    var ch = function (sh) {
      var u = (x >> sh) & 255, v = (y >> sh) & 255;
      return Math.round(u + (v - u) * t);
    };
    return '#' + ((1 << 24) + (ch(16) << 16) + (ch(8) << 8) + ch(0)).toString(16).slice(1);
  }

  // Ngôi sao lấp lánh 4 cánh.
  function sparkle(x, y, r, color) {
    return '<path d="M' + x + ' ' + (y - r) + ' Q' + x + ' ' + y + ' ' + (x + r) + ' ' + y +
      ' Q' + x + ' ' + y + ' ' + x + ' ' + (y + r) + ' Q' + x + ' ' + y + ' ' + (x - r) + ' ' + y +
      ' Q' + x + ' ' + y + ' ' + x + ' ' + (y - r) + ' Z" fill="' + (color || '#ffd23f') + '"/>';
  }

  // Mới – cũ: áo mới màu tươi, lấp lánh; áo cũ bạc màu, có miếng vá, lỗ thủng, gấu sờn.
  function shirt(color, old) {
    color = color || COLORS.blue;
    var body = old ? mix(color, '#a39e92', 0.6) : color;
    var s = '<path d="M62 42 L86 30 Q100 46 114 30 L138 42 L176 72 L156 98 L140 88 L140 176 L60 176 L60 88 L44 98 L24 72 Z" fill="' + body + '"/>' +
      '<path d="M86 30 Q100 54 114 30" fill="none" stroke="' + shade(body, -0.25) + '" stroke-width="5" stroke-linecap="round"/>';
    if (old) {
      s += '<g transform="rotate(-8 86 118)"><rect x="72" y="104" width="28" height="26" rx="3" fill="#c9a66b"/>' +
        '<rect x="75" y="107" width="22" height="20" rx="2" fill="none" stroke="#7a5a2a" stroke-width="2" stroke-dasharray="4 3"/></g>' +
        '<path d="M116 136 l7 -6 l4 7 l7 -4 l-2 9 l6 5 l-9 2 l-4 7 l-4 -8 l-8 -2 z" fill="#4a423a"/>' +
        '<path d="M58 177 L58 170 L66 176 L72 168 L80 176 L88 169 L96 176 L104 168 L112 176 L120 169 L128 176 L134 168 L142 175 L142 177 Z" fill="#fff"/>' +
        '<path d="M44 80 l6 4 M150 78 l-6 5" stroke="' + shade(body, -0.3) + '" stroke-width="3" stroke-linecap="round"/>';
    } else {
      s += '<path d="M70 60 L70 150" stroke="#fff" stroke-width="8" stroke-linecap="round" opacity="0.35"/>' +
        sparkle(30, 34, 12) + sparkle(172, 120, 10) + sparkle(160, 30, 8) + sparkle(110, 120, 9, '#ffffff');
    }
    return s;
  }

  // Béo – gầy: mèo cùng đầu, thân to hoặc thon.
  function cat(fat) {
    var c = '#ffad5c', d = '#e8873a', bw = fat ? 64 : 26;
    var tx = 100 + bw - 8;
    return '' +
      '<path d="M' + tx + ' 166 Q' + (tx + 34) + ' 160 ' + (tx + 22) + ' 118" fill="none" stroke="' + d + '" stroke-width="' + (fat ? 12 : 8) + '" stroke-linecap="round"/>' +
      '<ellipse cx="100" cy="138" rx="' + bw + '" ry="44" fill="' + c + '"/>' +
      '<ellipse cx="100" cy="148" rx="' + (bw * 0.6) + '" ry="28" fill="#ffe0bd"/>' +
      '<ellipse cx="' + (100 - bw * 0.5) + '" cy="181" rx="13" ry="7" fill="' + d + '"/>' +
      '<ellipse cx="' + (100 + bw * 0.5) + '" cy="181" rx="13" ry="7" fill="' + d + '"/>' +
      '<polygon points="72,58 76,26 98,46" fill="' + c + '"/><polygon points="128,58 124,26 102,46" fill="' + c + '"/>' +
      '<polygon points="78,50 79,36 90,46" fill="#ffc0cb"/><polygon points="122,50 121,36 110,46" fill="#ffc0cb"/>' +
      '<circle cx="100" cy="72" r="31" fill="' + c + '"/>' +
      '<path d="M92 44 l2 10 M100 42 v11 M108 44 l-2 10" stroke="' + d + '" stroke-width="3" stroke-linecap="round"/>' +
      '<circle cx="89" cy="70" r="4.5" fill="' + OUT + '"/><circle cx="111" cy="70" r="4.5" fill="' + OUT + '"/>' +
      '<polygon points="96,80 104,80 100,85" fill="#ff7b9c"/>' +
      '<path d="M100 85 Q96 90 92 88 M100 85 Q104 90 108 88" fill="none" stroke="' + OUT + '" stroke-width="2.5" stroke-linecap="round"/>' +
      '<path d="M84 82 L64 78 M84 86 L64 88 M116 82 L136 78 M116 86 L136 88" stroke="' + OUT + '" stroke-width="2" stroke-linecap="round"/>';
  }

  // Sạch – bẩn: lợn hồng sạch bóng hoặc lấm bùn, có ruồi bay.
  function pig(dirty) {
    var c = '#ffb3c6', d = '#f08aa6', mud = '#8b5a2b';
    var s = (dirty ? '<ellipse cx="108" cy="184" rx="78" ry="9" fill="' + mud + '" opacity="0.75"/>' : '') +
      '<rect x="78" y="146" width="13" height="34" rx="5" fill="' + d + '"/><rect x="98" y="148" width="13" height="32" rx="5" fill="' + d + '"/>' +
      '<rect x="130" y="148" width="13" height="32" rx="5" fill="' + d + '"/><rect x="150" y="146" width="13" height="34" rx="5" fill="' + d + '"/>' +
      '<path d="M168 106 q14 -10 10 4 q-4 12 10 4" fill="none" stroke="' + d + '" stroke-width="4" stroke-linecap="round"/>' +
      '<ellipse cx="116" cy="120" rx="58" ry="40" fill="' + c + '"/>' +
      '<polygon points="42,76 46,54 64,72" fill="' + d + '"/><polygon points="68,70 84,54 84,78" fill="' + d + '"/>' +
      '<circle cx="62" cy="100" r="32" fill="' + c + '"/>' +
      '<ellipse cx="40" cy="110" rx="15" ry="11" fill="' + d + '"/>' +
      '<circle cx="35" cy="110" r="3" fill="#c25a7a"/><circle cx="45" cy="110" r="3" fill="#c25a7a"/>' +
      '<circle cx="64" cy="93" r="4.5" fill="' + OUT + '"/>';
    if (dirty) {
      s += '<path d="M104 92 q14 -6 22 4 q8 10 -2 16 q-6 12 -16 4 q-12 -2 -8 -12 q-2 -8 4 -12 z" fill="' + mud + '"/>' +
        '<ellipse cx="152" cy="130" rx="11" ry="9" fill="' + mud + '"/>' +
        '<ellipse cx="96" cy="140" rx="9" ry="6" fill="' + mud + '"/>' +
        '<path d="M70 112 q8 -2 10 6 q0 8 -8 6 q-8 -4 -2 -12 z" fill="' + mud + '"/>' +
        '<path d="M128 156 q4 8 0 14 M84 158 q-3 8 1 14" stroke="' + mud + '" stroke-width="5" stroke-linecap="round"/>' +
        '<g fill="#333"><circle cx="150" cy="58" r="3.5"/><circle cx="172" cy="80" r="3.5"/><circle cx="128" cy="44" r="3"/></g>' +
        '<g fill="#d5dbe3" opacity="0.9"><ellipse cx="147" cy="53" rx="4" ry="2.5"/><ellipse cx="154" cy="53" rx="4" ry="2.5"/>' +
        '<ellipse cx="169" cy="75" rx="4" ry="2.5"/><ellipse cx="176" cy="75" rx="4" ry="2.5"/></g>' +
        '<path d="M140 64 q4 -6 8 0 q4 6 8 0" fill="none" stroke="#666" stroke-width="1.5" stroke-dasharray="2 3"/>';
    } else {
      s += sparkle(150, 66, 11) + sparkle(178, 98, 8) + sparkle(30, 58, 9) +
        '<circle cx="128" cy="48" r="7" fill="none" stroke="#9fd8f5" stroke-width="2.5"/>' +
        '<circle cx="110" cy="36" r="4" fill="none" stroke="#9fd8f5" stroke-width="2.5"/>';
    }
    return s;
  }

  // Nóng – lạnh: cùng một cốc; nóng bốc hơi, vạch đỏ; lạnh có đá, vạch xanh.
  function cup(hot) {
    var s = '<path d="M140 100 q34 0 34 30 q0 30 -34 30" fill="none" stroke="#b8c0cc" stroke-width="10"/>' +
      '<rect x="56" y="78" width="84" height="102" rx="12" fill="#fff" stroke="#b8c0cc" stroke-width="4"/>' +
      '<rect x="58" y="124" width="80" height="14" fill="' + (hot ? '#ff6b6b' : '#3fa9f5') + '"/>' +
      '<ellipse cx="98" cy="86" rx="36" ry="7" fill="' + (hot ? '#b5651d' : '#8fd6ff') + '"/>';
    if (hot) {
      s += '<g fill="none" stroke="#aab3c0" stroke-width="5" stroke-linecap="round">' +
        '<path d="M80 70 q-10 -12 0 -24 q10 -12 0 -24"/><path d="M98 66 q-10 -12 0 -24 q10 -12 0 -24"/>' +
        '<path d="M116 70 q-10 -12 0 -24 q10 -12 0 -24"/></g>';
    } else {
      s += '<rect x="68" y="62" width="22" height="22" rx="5" fill="#e6f8ff" stroke="#8fd6ff" stroke-width="3" transform="rotate(-12 79 73)"/>' +
        '<rect x="98" y="58" width="22" height="22" rx="5" fill="#e6f8ff" stroke="#8fd6ff" stroke-width="3" transform="rotate(10 109 69)"/>' +
        '<path d="M70 150 q-4 6 0 9 q4 -3 0 -9 z M118 104 q-4 6 0 9 q4 -3 0 -9 z M124 156 q-4 6 0 9 q4 -3 0 -9 z" fill="#8fd6ff"/>' +
        '<g stroke="#8fd6ff" stroke-width="3" stroke-linecap="round"><path d="M166 26 v28 M152 40 h28 M156 30 l20 20 M176 30 l-20 20"/></g>';
    }
    return s;
  }

  // Dày – mỏng: quyển sách nằm, nhìn chéo; phần ruột sách cao hoặc thấp.
  function book(color, thick) {
    color = color || COLORS.red;
    var h = thick ? 72 : 8, top = 182 - 24 - h;
    var s = '<polygon points="36,' + top + ' 58,' + (top + 24) + ' 58,' + (top + 24 + h) + ' 36,' + (top + h) + '" fill="' + shade(color, -0.25) + '"/>' +
      '<rect x="58" y="' + (top + 24) + '" width="116" height="' + h + '" fill="#fffaf0" stroke="' + shade(color, -0.25) + '" stroke-width="3"/>';
    for (var y = top + 30; y < top + 22 + h; y += 6) {
      s += '<line x1="62" y1="' + y + '" x2="170" y2="' + y + '" stroke="#e3d8c3" stroke-width="2"/>';
    }
    s += '<polygon points="36,' + top + ' 152,' + top + ' 174,' + (top + 24) + ' 58,' + (top + 24) + '" fill="' + color + '"/>' +
      '<polygon points="70,' + (top + 8) + ' 132,' + (top + 8) + ' 138,' + (top + 15) + ' 76,' + (top + 15) + '" fill="#fff" opacity="0.6"/>';
    return s;
  }

  // Ban ngày – ban đêm: cùng một cảnh nhà và đồi.
  function scene(day) {
    var sky = day ? '#8fd3ff' : '#1d2b5a';
    var s = '<rect x="6" y="6" width="188" height="188" rx="18" fill="' + sky + '"/>' +
      '<path d="M6 150 Q60 126 110 146 T194 138 L194 176 Q194 194 176 194 L24 194 Q6 194 6 176 Z" fill="' + (day ? '#7ed36b' : '#2f6b45') + '"/>' +
      '<rect x="112" y="112" width="48" height="40" fill="' + (day ? '#ffcf99' : '#9c7550') + '"/>' +
      '<polygon points="104,114 136,88 168,114" fill="' + (day ? '#ff6b6b' : '#8f3b42') + '"/>' +
      '<rect x="120" y="122" width="14" height="13" fill="' + (day ? '#bfe8ff' : '#ffe066') + '"/>' +
      '<rect x="142" y="130" width="11" height="22" fill="#7a4f33"/>';
    if (day) {
      s += '<g stroke="#ffd23f" stroke-width="5" stroke-linecap="round">';
      for (var i = 0; i < 8; i++) {
        var a = i * Math.PI / 4;
        s += '<line x1="' + (52 + 28 * Math.cos(a)).toFixed(1) + '" y1="' + (52 + 28 * Math.sin(a)).toFixed(1) +
          '" x2="' + (52 + 38 * Math.cos(a)).toFixed(1) + '" y2="' + (52 + 38 * Math.sin(a)).toFixed(1) + '"/>';
      }
      s += '</g><circle cx="52" cy="52" r="21" fill="#ffd23f"/>' +
        '<g fill="#fff"><circle cx="128" cy="50" r="13"/><circle cx="144" cy="44" r="16"/><circle cx="160" cy="52" r="12"/><rect x="128" y="50" width="32" height="13"/></g>';
    } else {
      s += '<circle cx="52" cy="52" r="22" fill="#fff3b0"/><circle cx="64" cy="44" r="20" fill="' + sky + '"/>' +
        sparkle(130, 36, 8, '#fff3b0') + sparkle(166, 62, 6, '#fff3b0') + sparkle(98, 66, 5, '#fff3b0') +
        sparkle(176, 26, 5, '#fff3b0') + sparkle(28, 104, 5, '#fff3b0');
    }
    return s;
  }

  // Cứng: hòn đá, viên gạch.
  function rock() {
    return '<ellipse cx="102" cy="168" rx="72" ry="9" fill="#000" opacity="0.08"/>' +
      '<polygon points="34,166 46,114 84,84 132,88 164,116 172,166" fill="#9aa0a8"/>' +
      '<polygon points="34,166 172,166 164,140 120,150 70,142 40,150" fill="#7d838c"/>' +
      '<polyline points="96,92 104,118 94,136" fill="none" stroke="#666b73" stroke-width="3"/>' +
      '<polyline points="140,108 132,124" fill="none" stroke="#666b73" stroke-width="3"/>' +
      '<polygon points="62,108 84,94 92,104 70,118" fill="#c3c8cf"/>';
  }
  function brick() {
    return '<ellipse cx="108" cy="168" rx="74" ry="8" fill="#000" opacity="0.08"/>' +
      '<polygon points="34,112 58,88 182,88 158,112" fill="#e07a5f"/>' +
      '<polygon points="158,112 182,88 182,140 158,164" fill="#a8432e"/>' +
      '<rect x="34" y="112" width="124" height="52" fill="#c8553d"/>' +
      '<g fill="#a8432e"><circle cx="56" cy="128" r="3"/><circle cx="92" cy="146" r="3"/><circle cx="130" cy="126" r="3"/><circle cx="140" cy="152" r="2.5"/></g>';
  }

  // Mềm: cái gối, gấu bông.
  function pillow() {
    return '<path d="M40 76 Q28 66 42 58 Q100 46 158 58 Q172 66 160 76 Q174 118 160 160 Q172 170 158 178 Q100 190 42 178 Q28 170 40 160 Q26 118 40 76 Z" fill="#c9b6ff"/>' +
      '<path d="M52 82 Q100 70 148 82 Q158 118 148 156 Q100 166 52 156 Q42 118 52 82 Z" fill="#d9caff"/>' +
      '<g fill="none" stroke="#a48be8" stroke-width="3" stroke-linecap="round">' +
      '<path d="M100 118 L74 96 M100 118 L126 96 M100 118 L74 142 M100 118 L126 142"/></g>' +
      '<circle cx="100" cy="118" r="7" fill="#a48be8"/>';
  }
  function teddy() {
    var b = '#b07a4a', l = '#e0b48a';
    return '<circle cx="64" cy="48" r="17" fill="' + b + '"/><circle cx="136" cy="48" r="17" fill="' + b + '"/>' +
      '<circle cx="64" cy="48" r="8" fill="' + l + '"/><circle cx="136" cy="48" r="8" fill="' + l + '"/>' +
      '<ellipse cx="56" cy="138" rx="15" ry="22" fill="' + b + '" transform="rotate(25 56 138)"/>' +
      '<ellipse cx="144" cy="138" rx="15" ry="22" fill="' + b + '" transform="rotate(-25 144 138)"/>' +
      '<circle cx="74" cy="178" r="17" fill="' + b + '"/><circle cx="126" cy="178" r="17" fill="' + b + '"/>' +
      '<ellipse cx="100" cy="146" rx="40" ry="38" fill="' + b + '"/><ellipse cx="100" cy="152" rx="24" ry="24" fill="' + l + '"/>' +
      '<circle cx="100" cy="76" r="38" fill="' + b + '"/>' +
      '<ellipse cx="100" cy="90" rx="17" ry="13" fill="' + l + '"/>' +
      '<ellipse cx="100" cy="84" rx="7" ry="5" fill="' + OUT + '"/>' +
      '<path d="M100 89 v6 M92 98 Q100 104 108 98" fill="none" stroke="' + OUT + '" stroke-width="2.5" stroke-linecap="round"/>' +
      '<circle cx="86" cy="70" r="4.5" fill="' + OUT + '"/><circle cx="114" cy="70" r="4.5" fill="' + OUT + '"/>';
  }

  // Nặng: quả tạ, con voi.
  function dumbbell() {
    return '<ellipse cx="100" cy="160" rx="80" ry="8" fill="#000" opacity="0.08"/>' +
      '<rect x="40" y="96" width="120" height="14" rx="3" fill="#9aa0a8"/>' +
      '<rect x="24" y="62" width="24" height="84" rx="6" fill="#3a3a4a"/><rect x="48" y="72" width="14" height="62" rx="4" fill="#5a5f6b"/>' +
      '<rect x="152" y="62" width="24" height="84" rx="6" fill="#3a3a4a"/><rect x="138" y="72" width="14" height="62" rx="4" fill="#5a5f6b"/>' +
      '<rect x="30" y="68" width="6" height="40" rx="3" fill="#fff" opacity="0.25"/><rect x="158" y="68" width="6" height="40" rx="3" fill="#fff" opacity="0.25"/>';
  }
  function elephant() {
    var c = '#9aa7b8', d = '#7f8ca0';
    return '<rect x="74" y="140" width="20" height="40" rx="6" fill="' + d + '"/><rect x="138" y="140" width="20" height="40" rx="6" fill="' + d + '"/>' +
      '<path d="M166 112 q14 8 10 26" fill="none" stroke="' + d + '" stroke-width="4" stroke-linecap="round"/>' +
      '<ellipse cx="114" cy="120" rx="58" ry="42" fill="' + c + '"/>' +
      '<rect x="96" y="144" width="20" height="38" rx="6" fill="' + c + '"/><rect x="150" y="144" width="18" height="36" rx="6" fill="' + c + '"/>' +
      '<path d="M40 102 Q22 140 38 166 Q46 174 52 164 Q42 140 56 112 Z" fill="' + c + '"/>' +
      '<circle cx="62" cy="94" r="34" fill="' + c + '"/>' +
      '<ellipse cx="84" cy="96" rx="22" ry="30" fill="' + d + '"/>' +
      '<path d="M44 116 q-6 10 4 16" fill="none" stroke="#fffaf0" stroke-width="6" stroke-linecap="round"/>' +
      '<circle cx="54" cy="86" r="4.5" fill="' + OUT + '"/>';
  }

  // Nhẹ: lông vũ (bóng bay dùng hàm balloon có sẵn).
  function feather() {
    return '<path d="M154 34 C180 72 150 126 64 168 C78 110 108 58 154 34 Z" fill="#bfe3ff"/>' +
      '<path d="M154 34 C130 70 96 120 64 168" fill="none" stroke="#7aa7c7" stroke-width="3" stroke-linecap="round"/>' +
      '<g stroke="#9cc8e8" stroke-width="2" stroke-linecap="round">' +
      '<path d="M138 60 l14 4 M124 80 l20 6 M110 100 l22 6 M96 120 l20 6 M84 138 l14 6"/></g>' +
      '<g fill="none" stroke="#c9d3df" stroke-width="3" stroke-linecap="round">' +
      '<path d="M30 80 q10 -8 20 0 q10 8 20 0"/><path d="M40 112 q8 -6 16 0 q8 6 16 0"/></g>';
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

  // Ghép nhiều hình vào một khung w x h (mặc định cao 200; dùng cho ảnh trên trang chủ).
  function compose(w, parts, h) {
    var s = '<svg viewBox="0 0 ' + w + ' ' + (h || 200) + '" xmlns="http://www.w3.org/2000/svg">';
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
    shirt: shirt, cat: cat, pig: pig, cup: cup, book: book, scene: scene,
    rock: rock, brick: brick, pillow: pillow, teddy: teddy,
    dumbbell: dumbbell, elephant: elephant, feather: feather,
    scaled: scaled, svg: svg, compose: compose
  };
})();
