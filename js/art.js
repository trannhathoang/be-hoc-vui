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

  // Ban ngày – ban đêm: cùng một cảnh (kind = 'house' | 'beach' | 'garden'), trời sáng hoặc tối.
  function scene(day, kind) {
    var sky = day ? '#8fd3ff' : '#1d2b5a';
    var dn = function (d, n) { return day ? d : n; };
    var hill = '<path d="M6 150 Q60 126 110 146 T194 138 L194 176 Q194 194 176 194 L24 194 Q6 194 6 176 Z" fill="' + dn('#7ed36b', '#2f6b45') + '"/>';
    var s = '<rect x="6" y="6" width="188" height="188" rx="18" fill="' + sky + '"/>';
    if (kind === 'beach') {
      s += '<rect x="6" y="110" width="188" height="50" fill="' + dn('#3fa9f5', '#1f3f75') + '"/>' +
        '<path d="M20 124 q10 -6 20 0 q10 6 20 0 M110 136 q10 -6 20 0 q10 6 20 0 M60 146 q10 -6 20 0" fill="none" stroke="' + dn('#bfe8ff', '#5a7bb5') + '" stroke-width="3" stroke-linecap="round"/>' +
        '<path d="M6 156 Q100 140 194 156 L194 176 Q194 194 176 194 L24 194 Q6 194 6 176 Z" fill="' + dn('#ffe2a1', '#8c7a55') + '"/>' +
        '<path d="M140 120 L170 120 L164 130 L146 130 Z" fill="' + dn('#ff6b6b', '#8f3b42') + '"/>' +
        '<polygon points="154,118 154,82 174,116" fill="' + dn('#fff', '#c9cfdb') + '"/>' +
        '<line x1="154" y1="118" x2="154" y2="80" stroke="#7a4f33" stroke-width="3"/>' +
        '<path d="M40 180 q4 -10 14 -8 q2 8 -4 12 z" fill="' + dn('#ff9fb2', '#9c6a75') + '"/>';
    } else if (kind === 'garden') {
      s += hill +
        '<rect x="132" y="98" width="14" height="46" rx="4" fill="#7a4f33"/>' +
        '<circle cx="139" cy="88" r="28" fill="' + dn('#3dcc6b', '#2a6e48') + '"/>' +
        '<circle cx="122" cy="100" r="16" fill="' + dn('#2fae58', '#235c3c') + '"/>' +
        '<g fill="' + dn('#c08a5a', '#6b5038') + '"><rect x="20" y="136" width="8" height="30"/><rect x="44" y="134" width="8" height="30"/><rect x="68" y="136" width="8" height="30"/><rect x="16" y="146" width="66" height="6"/></g>' +
        '<g fill="' + dn('#ff6fb5', '#8c4a6c') + '"><circle cx="96" cy="166" r="6"/><circle cx="114" cy="172" r="6"/><circle cx="168" cy="166" r="6"/></g>' +
        '<g fill="' + dn('#ffd23f', '#8a7a3a') + '"><circle cx="96" cy="166" r="2.5"/><circle cx="114" cy="172" r="2.5"/><circle cx="168" cy="166" r="2.5"/></g>';
    } else {
      s += hill +
        '<rect x="112" y="112" width="48" height="40" fill="' + dn('#ffcf99', '#9c7550') + '"/>' +
        '<polygon points="104,114 136,88 168,114" fill="' + dn('#ff6b6b', '#8f3b42') + '"/>' +
        '<rect x="120" y="122" width="14" height="13" fill="' + dn('#bfe8ff', '#ffe066') + '"/>' +
        '<rect x="142" y="130" width="11" height="22" fill="#7a4f33"/>';
    }
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

  // ---------- Thêm tranh cho các cặp tính từ (mỗi cặp ít nhất 3 đồ vật) ----------

  // Mới – cũ: chiếc giày.
  function shoe(color, old) {
    color = color || COLORS.red;
    var body = old ? mix(color, '#a39e92', 0.6) : color;
    var s = '<path d="M28 150 L28 128 Q30 112 48 110 L86 104 Q96 84 120 82 L138 82 Q150 84 152 100 L152 118 Q176 122 178 140 L178 150 Z" fill="' + body + '"/>' +
      '<path d="M28 150 L28 130 Q30 118 46 116 L62 114 L62 150 Z" fill="#fff" opacity="0.85"/>' +
      '<ellipse cx="138" cy="84" rx="13" ry="4" fill="' + shade(body, -0.35) + '"/>' +
      '<path d="M90 102 l18 10 M97 94 l18 10 M105 87 l16 9" stroke="#fff" stroke-width="4" stroke-linecap="round"/>' +
      '<path d="M22 148 L184 148 Q186 166 168 168 L36 168 Q20 166 22 148 Z" fill="#f1f1f1" stroke="#c9ced6" stroke-width="3"/>';
    if (old) {
      s += '<rect x="120" y="112" width="22" height="18" rx="3" fill="#c9a66b" transform="rotate(8 131 121)"/>' +
        '<rect x="123" y="115" width="16" height="12" rx="2" fill="none" stroke="#7a5a2a" stroke-width="2" stroke-dasharray="3 3" transform="rotate(8 131 121)"/>' +
        '<path d="M70 124 l6 -5 l4 6 l6 -3 l-2 7 l5 4 l-8 1 l-3 6 l-3 -6 l-7 -2 z" fill="#4a423a"/>' +
        '<path d="M22 150 L44 150 L24 164 Z" fill="#4a423a"/>' +
        '<g fill="#cfc9bd"><circle cx="186" cy="170" r="6"/><circle cx="176" cy="178" r="4"/><circle cx="14" cy="172" r="5"/></g>';
    } else {
      s += '<path d="M74 132 Q110 118 148 128" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity="0.4"/>' +
        sparkle(40, 80, 11) + sparkle(172, 96, 9) + sparkle(160, 54, 7);
    }
    return s;
  }

  // Mới – cũ: chiếc ô tô (ô tô cũ bạc màu, gỉ sét, móp, nhả khói).
  function carAge(color, old) {
    color = color || COLORS.red;
    if (!old) {
      return car(color) + '<path d="M40 112 L100 112" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity="0.45"/>' +
        sparkle(30, 66, 11) + sparkle(178, 50, 9) + sparkle(110, 34, 7);
    }
    return car(mix(color, '#a39e92', 0.6)) +
      '<g fill="#a0522d" opacity="0.85"><ellipse cx="48" cy="124" rx="8" ry="5"/><ellipse cx="150" cy="128" rx="6" ry="4"/>' +
      '<ellipse cx="118" cy="114" rx="5" ry="3.5"/></g>' +
      '<path d="M88 118 q10 8 20 0" fill="none" stroke="#5a5048" stroke-width="3" stroke-linecap="round"/>' +
      '<path d="M128 74 l8 10 l-6 6" fill="none" stroke="#fff" stroke-width="2.5"/>' +
      '<g fill="#b9bdc4" opacity="0.9"><circle cx="12" cy="128" r="9"/><circle cx="10" cy="110" r="7"/><circle cx="20" cy="96" r="5"/></g>';
  }

  // Béo – gầy: con chó.
  function dog(fat) {
    var c = '#d9a066', d = '#a86f3a', bw = fat ? 62 : 26;
    return '' +
      '<path d="M' + (100 + bw - 6) + ' 152 q26 -4 22 -36" fill="none" stroke="' + d + '" stroke-width="' + (fat ? 11 : 8) + '" stroke-linecap="round"/>' +
      '<ellipse cx="100" cy="138" rx="' + bw + '" ry="44" fill="' + c + '"/>' +
      '<ellipse cx="100" cy="150" rx="' + (bw * 0.6) + '" ry="26" fill="#f3d9b5"/>' +
      '<ellipse cx="' + (100 - bw * 0.5) + '" cy="181" rx="13" ry="7" fill="' + d + '"/>' +
      '<ellipse cx="' + (100 + bw * 0.5) + '" cy="181" rx="13" ry="7" fill="' + d + '"/>' +
      '<circle cx="100" cy="72" r="30" fill="' + c + '"/>' +
      '<ellipse cx="72" cy="76" rx="11" ry="22" fill="' + d + '" transform="rotate(18 72 76)"/>' +
      '<ellipse cx="128" cy="76" rx="11" ry="22" fill="' + d + '" transform="rotate(-18 128 76)"/>' +
      '<ellipse cx="100" cy="86" rx="15" ry="11" fill="#f3d9b5"/>' +
      '<ellipse cx="100" cy="80" rx="6" ry="4.5" fill="' + OUT + '"/>' +
      '<circle cx="89" cy="66" r="4.5" fill="' + OUT + '"/><circle cx="111" cy="66" r="4.5" fill="' + OUT + '"/>' +
      '<path d="M100 85 q-5 6 -10 3 M100 85 q5 6 10 3" fill="none" stroke="' + OUT + '" stroke-width="2.5" stroke-linecap="round"/>' +
      '<ellipse cx="100" cy="95" rx="4" ry="5" fill="#ff7b9c"/>';
  }

  // Béo – gầy: con chim.
  function bird(fat) {
    var c = '#4fb3f6', d = '#2e86c9';
    var rx = fat ? 58 : 26, ry = fat ? 54 : 50;
    var left = 100 - rx;
    return '' +
      '<path d="M90 ' + (104 + ry) + ' V182 M110 ' + (104 + ry) + ' V182 M84 182 h12 M104 182 h12" stroke="#f0a030" stroke-width="4" stroke-linecap="round"/>' +
      '<polygon points="' + (100 + rx - 8) + ',118 ' + (100 + rx + 24) + ',132 ' + (100 + rx + 20) + ',104" fill="' + d + '"/>' +
      '<ellipse cx="100" cy="108" rx="' + rx + '" ry="' + ry + '" fill="' + c + '"/>' +
      '<ellipse cx="100" cy="122" rx="' + (rx * 0.62) + '" ry="' + (ry * 0.58) + '" fill="#bfe3ff"/>' +
      '<ellipse cx="' + (100 + rx * 0.35) + '" cy="112" rx="' + (rx * 0.42) + '" ry="' + (ry * 0.45) + '" fill="' + d + '"/>' +
      '<circle cx="' + (100 - rx * 0.4) + '" cy="88" r="5" fill="' + OUT + '"/>' +
      '<polygon points="' + (left + 6) + ',94 ' + (left - 16) + ',101 ' + (left + 6) + ',108" fill="#ffb020"/>' +
      '<path d="M96 ' + (60 - (fat ? 4 : 0)) + ' q4 -12 12 -10 M100 ' + (58 - (fat ? 4 : 0)) + ' q8 -8 14 -2" fill="none" stroke="' + d + '" stroke-width="4" stroke-linecap="round"/>';
  }

  // Sạch – bẩn: cái đĩa.
  function plate(dirty) {
    var s = '<ellipse cx="100" cy="108" rx="84" ry="58" fill="#fff" stroke="#c9ced6" stroke-width="4"/>' +
      '<ellipse cx="100" cy="108" rx="58" ry="38" fill="#f4f6fa" stroke="#dde2ea" stroke-width="3"/>';
    if (dirty) {
      s += '<path d="M70 96 q16 -14 34 -4 q14 10 2 22 q-14 12 -32 4 q-14 -8 -4 -22 z" fill="#c0703a" opacity="0.85"/>' +
        '<path d="M118 120 q10 -8 20 0 q4 10 -8 12 q-14 2 -12 -12 z" fill="#e2b04a"/>' +
        '<path d="M40 88 q10 -4 14 6 M150 80 q8 2 6 10" stroke="#c0703a" stroke-width="5" stroke-linecap="round"/>' +
        '<g fill="#8b5a2b"><circle cx="128" cy="96" r="3"/><circle cx="84" cy="132" r="3"/><circle cx="58" cy="118" r="2.5"/><circle cx="142" cy="138" r="2.5"/></g>' +
        '<g fill="#333"><circle cx="150" cy="40" r="3.5"/><circle cx="170" cy="58" r="3"/></g>' +
        '<g fill="#d5dbe3"><ellipse cx="147" cy="35" rx="4" ry="2.5"/><ellipse cx="154" cy="35" rx="4" ry="2.5"/></g>';
    } else {
      s += '<path d="M48 90 Q60 66 92 60" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round"/>' +
        sparkle(150, 70, 12) + sparkle(64, 150, 9) + sparkle(176, 132, 7);
    }
    return s;
  }

  // Sạch – bẩn: bàn tay.
  function hand(dirty) {
    var skin = '#ffd2a6', mud = '#8b5a2b';
    var s = '<rect x="76" y="160" width="48" height="36" rx="8" fill="#3fa9f5"/>' +
      '<rect x="34" y="104" width="20" height="52" rx="10" fill="' + skin + '" transform="rotate(-35 44 130)"/>' +
      '<rect x="62" y="42" width="18" height="70" rx="9" fill="' + skin + '"/>' +
      '<rect x="82" y="30" width="18" height="80" rx="9" fill="' + skin + '"/>' +
      '<rect x="102" y="34" width="18" height="76" rx="9" fill="' + skin + '"/>' +
      '<rect x="122" y="50" width="17" height="62" rx="8.5" fill="' + skin + '"/>' +
      '<rect x="60" y="86" width="82" height="84" rx="26" fill="' + skin + '"/>' +
      '<path d="M78 120 q22 12 44 0" fill="none" stroke="#e9b07f" stroke-width="3" stroke-linecap="round"/>';
    if (dirty) {
      s += '<g fill="' + mud + '"><path d="M74 132 q14 -10 26 0 q8 12 -6 18 q-16 4 -20 -6 z"/>' +
        '<ellipse cx="124" cy="100" rx="10" ry="7"/><ellipse cx="91" cy="40" rx="8" ry="6"/>' +
        '<ellipse cx="71" cy="54" rx="7" ry="6"/><ellipse cx="130" cy="146" rx="7" ry="5"/>' +
        '<circle cx="112" cy="128" r="3"/><circle cx="104" cy="66" r="3"/><circle cx="46" cy="114" r="4"/></g>';
    } else {
      s += sparkle(160, 62, 12) + sparkle(40, 66, 9) + sparkle(166, 128, 7) +
        '<circle cx="150" cy="94" r="7" fill="none" stroke="#9fd8f5" stroke-width="2.5"/>' +
        '<circle cx="164" cy="104" r="4" fill="none" stroke="#9fd8f5" stroke-width="2.5"/>';
    }
    return s;
  }

  // Nóng – lạnh (thời tiết): trời nắng chói chang, bạn nhỏ đổ mồ hôi /
  // gió mùa thổi, tuyết rơi, bạn nhỏ đội mũ quàng khăn co ro.
  function weather(hot) {
    var skin = '#ffd2a6';
    var s = '<rect x="6" y="6" width="188" height="188" rx="18" fill="' + (hot ? '#ffd98a' : '#b9cfe2') + '"/>';
    if (hot) {
      s += '<g stroke="#ff9f1c" stroke-width="5" stroke-linecap="round">';
      for (var i = 0; i < 12; i++) {
        var a = i * Math.PI / 6;
        s += '<line x1="' + (54 + 30 * Math.cos(a)).toFixed(1) + '" y1="' + (54 + 30 * Math.sin(a)).toFixed(1) +
          '" x2="' + (54 + 42 * Math.cos(a)).toFixed(1) + '" y2="' + (54 + 42 * Math.sin(a)).toFixed(1) + '"/>';
      }
      s += '</g><circle cx="54" cy="54" r="24" fill="#ffd23f" stroke="#ffb020" stroke-width="4"/>' +
        '<path d="M6 168 Q100 156 194 168 L194 176 Q194 194 176 194 L24 194 Q6 194 6 176 Z" fill="#f2c46b"/>' +
        '<g fill="none" stroke="#ffb060" stroke-width="3" stroke-linecap="round">' +
        '<path d="M22 150 q6 -8 0 -16 q-6 -8 0 -16"/><path d="M170 150 q6 -8 0 -16 q-6 -8 0 -16"/><path d="M60 160 q5 -6 0 -12"/></g>' +
        // bạn nhỏ mặc áo cộc, đổ mồ hôi
        '<rect x="104" y="150" width="10" height="28" rx="4" fill="' + skin + '"/><rect x="122" y="150" width="10" height="28" rx="4" fill="' + skin + '"/>' +
        '<rect x="100" y="146" width="36" height="14" rx="3" fill="#3fa9f5"/>' +
        '<rect x="82" y="122" width="10" height="26" rx="5" fill="' + skin + '" transform="rotate(20 87 122)"/>' +
        '<rect x="144" y="122" width="10" height="26" rx="5" fill="' + skin + '" transform="rotate(-20 149 122)"/>' +
        '<path d="M98 116 L138 116 L148 130 L138 136 L136 150 L100 150 L98 136 L88 130 Z" fill="#ff6b6b"/>' +
        '<circle cx="118" cy="96" r="20" fill="' + skin + '"/>' +
        '<path d="M98 92 Q100 74 118 74 Q136 74 138 92 Q128 82 118 84 Q108 82 98 92 Z" fill="#4a3426"/>' +
        '<path d="M108 96 q3 -3 6 0 M122 96 q3 -3 6 0" fill="none" stroke="' + OUT + '" stroke-width="2.5" stroke-linecap="round"/>' +
        '<ellipse cx="118" cy="106" rx="4" ry="3" fill="' + OUT + '"/>' +
        '<circle cx="106" cy="103" r="3.5" fill="#ff8a8a"/><circle cx="130" cy="103" r="3.5" fill="#ff8a8a"/>' +
        '<g fill="#5ab8f5"><path d="M92 80 q-5 8 0 11 q5 -3 0 -11 z"/><path d="M146 84 q-5 8 0 11 q5 -3 0 -11 z"/>' +
        '<path d="M142 104 q-4 7 0 9 q4 -2 0 -9 z"/><path d="M94 102 q-4 7 0 9 q4 -2 0 -9 z"/></g>';
    } else {
      s += '<g fill="#8fa3b8"><circle cx="40" cy="36" r="16"/><circle cx="60" cy="30" r="20"/><circle cx="82" cy="38" r="14"/><rect x="40" y="36" width="42" height="16"/>' +
        '<circle cx="150" cy="30" r="14"/><circle cx="168" cy="34" r="12"/><rect x="150" y="30" width="18" height="16"/></g>' +
        '<path d="M6 166 Q100 154 194 166 L194 176 Q194 194 176 194 L24 194 Q6 194 6 176 Z" fill="#f4f8fc"/>' +
        '<g fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round">' +
        '<path d="M14 76 q34 -10 60 0 q12 6 4 14"/><path d="M12 112 q26 -8 48 0 q10 5 2 12"/><path d="M150 78 q20 -6 36 2"/></g>' +
        sparkle(30, 140, 6, '#fff') + sparkle(170, 116, 7, '#fff') + sparkle(160, 154, 5, '#fff') + sparkle(76, 60, 5, '#fff') +
        // bạn nhỏ mặc áo ấm, quàng khăn, ôm người run rẩy
        '<rect x="104" y="152" width="11" height="26" rx="4" fill="#3a4a6a"/><rect x="121" y="152" width="11" height="26" rx="4" fill="#3a4a6a"/>' +
        '<path d="M94 116 L142 116 L148 156 L88 156 Z" fill="#3fa9f5"/>' +
        '<ellipse cx="118" cy="134" rx="28" ry="9" fill="#2e86c9"/>' +
        '<circle cx="92" cy="134" r="7" fill="#ff6b6b"/><circle cx="144" cy="134" r="7" fill="#ff6b6b"/>' +
        '<circle cx="118" cy="96" r="20" fill="' + skin + '"/>' +
        '<path d="M97 92 Q98 70 118 70 Q138 70 139 92 Z" fill="#ff6b6b"/><rect x="96" y="88" width="44" height="7" rx="3" fill="#fff"/>' +
        '<circle cx="118" cy="68" r="6" fill="#fff"/>' +
        '<rect x="98" y="112" width="40" height="9" rx="4" fill="#ffd23f"/><rect x="124" y="116" width="9" height="22" rx="3" fill="#ffd23f"/>' +
        '<circle cx="111" cy="100" r="2.8" fill="' + OUT + '"/><circle cx="125" cy="100" r="2.8" fill="' + OUT + '"/>' +
        '<path d="M110 108 l3 -2 l3 2 l3 -2 l3 2 l3 -2 l3 2" fill="none" stroke="' + OUT + '" stroke-width="2" stroke-linecap="round"/>' +
        '<g fill="none" stroke="#4a6a8a" stroke-width="3" stroke-linecap="round">' +
        '<path d="M80 112 q-6 8 0 16 M72 108 q-8 12 0 24"/><path d="M156 112 q6 8 0 16 M164 108 q8 12 0 24"/></g>';
    }
    return s;
  }

  // Nóng: nồi canh đang sôi trên bếp lửa.
  function stoveFood() {
    return '<rect x="26" y="182" width="148" height="10" rx="4" fill="#4a4f5a"/>' +
      '<path d="M62 184 q-8 -14 4 -24 q2 10 8 6 q6 -12 0 -18 q18 8 12 36 z M106 184 q-10 -16 4 -28 q2 12 10 8 q4 -10 -2 -16 q22 10 12 36 z" fill="#ff9f1c"/>' +
      '<path d="M68 184 q-2 -8 4 -12 q4 6 6 12 z M114 184 q-2 -9 5 -14 q4 7 6 14 z" fill="#ffe066"/>' +
      '<rect x="22" y="96" width="26" height="10" rx="5" fill="#5a5f6b"/><rect x="152" y="96" width="26" height="10" rx="5" fill="#5a5f6b"/>' +
      '<path d="M40 90 L160 90 L156 156 Q154 166 144 166 L56 166 Q46 166 44 156 Z" fill="#9aa5b5"/>' +
      '<ellipse cx="100" cy="90" rx="62" ry="12" fill="#7f8a9b"/>' +
      '<ellipse cx="100" cy="91" rx="54" ry="8" fill="#e8a04a"/>' +
      '<g fill="#ff7b2e"><circle cx="80" cy="90" r="4"/><circle cx="112" cy="92" r="4"/></g>' +
      '<g fill="#3dcc6b"><ellipse cx="96" cy="88" rx="5" ry="2.5"/><ellipse cx="126" cy="89" rx="5" ry="2.5"/></g>' +
      '<g fill="none" stroke="#aab3c0" stroke-width="5" stroke-linecap="round">' +
      '<path d="M76 70 q-10 -12 0 -24 q10 -12 0 -24"/><path d="M100 64 q-10 -12 0 -24 q10 -12 0 -24"/><path d="M124 70 q-10 -12 0 -24 q10 -12 0 -24"/></g>';
  }

  // Lạnh: cá đông lạnh trong ngăn đá, phủ băng.
  function frozenFood() {
    var fishShape = function (x, y) {
      return '<path d="M' + (x + 40) + ' ' + y + ' l18 -12 v24 z" fill="#8aa0b8"/>' +
        '<ellipse cx="' + x + '" cy="' + y + '" rx="44" ry="17" fill="#9fb3c8"/>' +
        '<circle cx="' + (x - 28) + '" cy="' + (y - 4) + '" r="3.5" fill="#4a5a6a"/>';
    };
    return '<rect x="18" y="26" width="164" height="156" rx="14" fill="#dff3ff" stroke="#9fd8f5" stroke-width="4"/>' +
      '<g fill="#fff"><polygon points="32,28 40,28 36,44"/><polygon points="58,28 66,28 62,50"/><polygon points="96,28 104,28 100,42"/>' +
      '<polygon points="134,28 142,28 138,48"/><polygon points="162,28 170,28 166,40"/></g>' +
      '<line x1="22" y1="150" x2="178" y2="150" stroke="#9fd8f5" stroke-width="4"/>' +
      fishShape(92, 96) + fishShape(104, 128) +
      '<rect x="40" y="70" width="130" height="78" rx="10" fill="#e6f8ff" opacity="0.55" stroke="#fff" stroke-width="3"/>' +
      '<path d="M52 82 l16 0 M52 90 l8 0 M150 132 l-12 0" stroke="#fff" stroke-width="3" stroke-linecap="round"/>' +
      '<g stroke="#5ab8f5" stroke-width="3" stroke-linecap="round"><path d="M44 158 v18 M35 167 h18 M38 161 l12 12 M50 161 l-12 12"/>' +
      '<path d="M156 158 v18 M147 167 h18 M150 161 l12 12 M162 161 l-12 12"/></g>';
  }

  // Dày – mỏng: miếng bánh mì nằm (mặt trên + phần vỏ cạnh dày/mỏng).
  function bread(thick) {
    var t = thick ? 46 : 8, top = 100 - (60 + t) / 2;
    return '<rect x="36" y="' + (top + 30) + '" width="128" height="' + (30 + t) + '" rx="18" fill="#c98a4b"/>' +
      (thick ? '<path d="M48 ' + (top + 70) + ' h104 M48 ' + (top + 84) + ' h104" stroke="#b07438" stroke-width="3" stroke-linecap="round"/>' : '') +
      '<rect x="36" y="' + top + '" width="128" height="60" rx="18" fill="#f7dca8" stroke="#c98a4b" stroke-width="7"/>' +
      '<g fill="#e9c487"><ellipse cx="72" cy="' + (top + 22) + '" rx="6" ry="3"/><ellipse cx="104" cy="' + (top + 34) + '" rx="7" ry="3"/>' +
      '<ellipse cx="132" cy="' + (top + 20) + '" rx="5" ry="2.5"/><ellipse cx="86" cy="' + (top + 44) + '" rx="5" ry="2.5"/></g>';
  }

  // Dày – mỏng: cái đệm.
  function mattress(thick) {
    var t = thick ? 54 : 10, top = 104 - (60 + t) / 2;
    var s = '<rect x="26" y="' + (top + 30) + '" width="148" height="' + (30 + t) + '" rx="10" fill="#6c8fd6"/>';
    if (thick) s += '<line x1="34" y1="' + (top + 60 + t / 2) + '" x2="166" y2="' + (top + 60 + t / 2) + '" stroke="#a9c2f5" stroke-width="3" stroke-dasharray="6 5"/>';
    s += '<rect x="26" y="' + top + '" width="148" height="60" rx="14" fill="#a9c2f5"/>';
    for (var x = 50; x <= 150; x += 25) {
      s += '<circle cx="' + x + '" cy="' + (top + 18) + '" r="3" fill="#7f9fe0"/><circle cx="' + x + '" cy="' + (top + 42) + '" r="3" fill="#7f9fe0"/>';
    }
    return s;
  }

  // Cứng: cái búa. Mềm: cuộn len.
  function hammer() {
    return '<ellipse cx="104" cy="178" rx="64" ry="7" fill="#000" opacity="0.08"/>' +
      '<g transform="rotate(-30 100 110)">' +
      '<rect x="91" y="62" width="18" height="118" rx="8" fill="#b07a4a"/>' +
      '<rect x="50" y="40" width="100" height="32" rx="6" fill="#7d838c"/>' +
      '<rect x="56" y="45" width="40" height="6" rx="3" fill="#c3c8cf"/></g>';
  }
  function yarn() {
    return '<path d="M146 144 Q174 162 160 182 Q150 194 180 192" fill="none" stroke="#e0609b" stroke-width="4" stroke-linecap="round"/>' +
      '<circle cx="100" cy="104" r="58" fill="#ff8fc0"/>' +
      '<g fill="none" stroke="#e0609b" stroke-width="4" stroke-linecap="round">' +
      '<path d="M54 80 Q100 58 146 84"/><path d="M44 108 Q100 84 156 114"/><path d="M56 140 Q100 116 144 146"/>' +
      '<path d="M82 50 Q58 104 86 160"/><path d="M120 50 Q142 100 118 160"/></g>';
  }

  // Nặng: xe tải. Nhẹ: chiếc lá.
  function truck() {
    return '<ellipse cx="100" cy="168" rx="88" ry="7" fill="#000" opacity="0.08"/>' +
      '<rect x="14" y="62" width="114" height="84" rx="6" fill="#3fa9f5"/>' +
      '<rect x="14" y="84" width="114" height="10" fill="#2e86c9"/>' +
      '<path d="M128 86 L160 86 Q172 86 178 100 L186 118 L186 146 L128 146 Z" fill="#ff6b6b"/>' +
      '<path d="M136 94 L158 94 Q166 94 170 104 L175 116 L136 116 Z" fill="#bfe8ff"/>' +
      '<circle cx="180" cy="130" r="5" fill="#ffe066"/>' +
      '<circle cx="44" cy="150" r="17" fill="' + OUT + '"/><circle cx="44" cy="150" r="7" fill="#c9ced6"/>' +
      '<circle cx="84" cy="150" r="17" fill="' + OUT + '"/><circle cx="84" cy="150" r="7" fill="#c9ced6"/>' +
      '<circle cx="160" cy="150" r="17" fill="' + OUT + '"/><circle cx="160" cy="150" r="7" fill="#c9ced6"/>';
  }
  function leaf() {
    return '<path d="M60 150 C50 90 110 40 162 46 C162 100 122 150 60 150 Z" fill="#7ed36b"/>' +
      '<path d="M60 150 Q112 100 156 52" fill="none" stroke="#4fa84a" stroke-width="3.5" stroke-linecap="round"/>' +
      '<g stroke="#4fa84a" stroke-width="2.5" stroke-linecap="round" fill="none">' +
      '<path d="M88 122 l-6 -20 M108 102 l-4 -22 M128 82 l-2 -18 M96 112 l18 4 M118 92 l18 4"/></g>' +
      '<path d="M60 150 l-16 16" stroke="#4fa84a" stroke-width="4" stroke-linecap="round"/>' +
      '<g fill="none" stroke="#c9d3df" stroke-width="3" stroke-linecap="round">' +
      '<path d="M20 70 q10 -8 20 0 q10 8 20 0"/><path d="M128 170 q8 -6 16 0 q8 6 16 0"/></g>';
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
    shoe: shoe, carAge: carAge, dog: dog, bird: bird, plate: plate, hand: hand,
    weather: weather, stoveFood: stoveFood, frozenFood: frozenFood, bread: bread, mattress: mattress,
    hammer: hammer, yarn: yarn, truck: truck, leaf: leaf,
    scaled: scaled, svg: svg, compose: compose
  };
})();
