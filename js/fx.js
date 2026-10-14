/* Pháo hoa bằng canvas — nhẹ để chạy mượt cả trên iPad Air đời đầu. */
var Fireworks = (function () {
  var canvas, ctx, W, H, dpr;
  var particles = [];
  var running = false;
  var PALETTE = ['#ff4d4d', '#ffd23f', '#3dcc6b', '#3fa9f5', '#9b5de5', '#ff6fb5', '#ff9f1c', '#ffffff'];

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function init() {
    canvas = document.getElementById('fx');
    ctx = canvas.getContext('2d');
    resize();
    window.addEventListener('resize', resize);
  }

  function burst(x, y) {
    var n = 46;
    var base = PALETTE[Math.floor(Math.random() * PALETTE.length)];
    var speed = Math.min(W, H) / 95;
    for (var i = 0; i < n; i++) {
      var a = (i / n) * Math.PI * 2 + Math.random() * 0.2;
      var v = speed * (0.5 + Math.random() * 0.6);
      particles.push({
        x: x, y: y,
        vx: Math.cos(a) * v,
        vy: Math.sin(a) * v,
        life: 1,
        decay: 0.012 + Math.random() * 0.012,
        size: 3 + Math.random() * 3,
        color: Math.random() < 0.7 ? base : PALETTE[Math.floor(Math.random() * PALETTE.length)]
      });
    }
  }

  function frame() {
    ctx.clearRect(0, 0, W, H);
    for (var i = particles.length - 1; i >= 0; i--) {
      var p = particles[i];
      p.vx *= 0.97;
      p.vy = p.vy * 0.97 + 0.12;
      p.x += p.vx;
      p.y += p.vy;
      p.life -= p.decay;
      if (p.life <= 0) { particles.splice(i, 1); continue; }
      ctx.globalAlpha = p.life;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * (0.5 + p.life * 0.5), 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    if (particles.length) {
      requestAnimationFrame(frame);
    } else {
      running = false;
      ctx.clearRect(0, 0, W, H);
    }
  }

  // Bắn vài chùm pháo hoa lệch thời gian nhau.
  function celebrate() {
    var shots = 4;
    for (var i = 0; i < shots; i++) {
      (function (k) {
        setTimeout(function () {
          burst(W * (0.15 + Math.random() * 0.7), H * (0.15 + Math.random() * 0.4));
          if (k % 2 === 0) Sound.crackle();
          if (!running) { running = true; requestAnimationFrame(frame); }
        }, k * 220);
      })(i);
    }
  }

  return { init: init, celebrate: celebrate };
})();
