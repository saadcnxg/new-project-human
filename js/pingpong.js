(function () {
  var canvas = document.getElementById('ppCanvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var btn = document.getElementById('ppStart');
  var elP = document.getElementById('ppPlayer');
  var elC = document.getElementById('ppCpu');
  var W = canvas.width, H = canvas.height;
  var WIN = 7, PW = 10, PH = 64, R = 7, MAXV = 11;
  var state = 'idle', last = 0, serveAt = 0, msg = '';
  var keys = { up: false, down: false };
  var pl = { x: 14, y: H / 2 - PH / 2, score: 0 };
  var cpu = { x: W - 14 - PW, y: H / 2 - PH / 2, score: 0, offset: 0 };
  var ball = { x: W / 2, y: H / 2, vx: 0, vy: 0, speed: 4.5 };

  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

  function serve(dir) {
    ball.x = W / 2;
    ball.y = H / 2;
    ball.speed = 4.5;
    var a = (Math.random() - 0.5) * 0.8;
    ball.vx = Math.cos(a) * ball.speed * dir;
    ball.vy = Math.sin(a) * ball.speed;
    cpu.offset = (Math.random() - 0.5) * 36;
    serveAt = performance.now() + 700;
  }

  function updateScore() {
    elP.textContent = pl.score;
    elC.textContent = cpu.score;
  }

  function reset() {
    pl.score = 0;
    cpu.score = 0;
    pl.y = cpu.y = H / 2 - PH / 2;
    updateScore();
    serve(Math.random() < 0.5 ? 1 : -1);
  }

  function start() {
    if (state === 'idle' || state === 'over') {
      reset();
      state = 'playing';
      btn.textContent = 'Pause';
    } else if (state === 'playing') {
      state = 'paused';
      btn.textContent = 'Resume';
    } else {
      state = 'playing';
      btn.textContent = 'Pause';
    }
    last = performance.now();
  }

  function hit(p, dir) {
    var rel = clamp((ball.y - (p.y + PH / 2)) / (PH / 2), -1, 1);
    var ang = rel * Math.PI / 4;
    ball.speed = Math.min(ball.speed * 1.06, MAXV);
    ball.vx = Math.cos(ang) * ball.speed * dir;
    ball.vy = Math.sin(ang) * ball.speed;
    cpu.offset = (Math.random() - 0.5) * 36;
  }

  function point(playerScored) {
    if (playerScored) pl.score++; else cpu.score++;
    updateScore();
    if (pl.score >= WIN || cpu.score >= WIN) {
      state = 'over';
      msg = pl.score >= WIN ? 'You win!' : 'CPU wins';
      btn.textContent = 'Play again';
      return;
    }
    serve(playerScored ? 1 : -1);
  }

  function step(dt, now) {
    var ps = 6 * dt;
    if (keys.up) pl.y -= ps;
    if (keys.down) pl.y += ps;
    pl.y = clamp(pl.y, 0, H - PH);

    var target = ball.vx > 0 ? ball.y - PH / 2 + cpu.offset : H / 2 - PH / 2;
    var diff = target - cpu.y;
    var cs = 3.6 * dt;
    cpu.y += clamp(diff, -cs, cs);
    cpu.y = clamp(cpu.y, 0, H - PH);

    if (now < serveAt) return;

    ball.x += ball.vx * dt;
    ball.y += ball.vy * dt;

    if (ball.y - R < 0) { ball.y = R; ball.vy = Math.abs(ball.vy); }
    if (ball.y + R > H) { ball.y = H - R; ball.vy = -Math.abs(ball.vy); }

    if (ball.vx < 0 && ball.x - R <= pl.x + PW && ball.x + R >= pl.x &&
        ball.y >= pl.y - R && ball.y <= pl.y + PH + R) {
      ball.x = pl.x + PW + R;
      hit(pl, 1);
    } else if (ball.vx > 0 && ball.x + R >= cpu.x && ball.x - R <= cpu.x + PW &&
        ball.y >= cpu.y - R && ball.y <= cpu.y + PH + R) {
      ball.x = cpu.x - R;
      hit(cpu, -1);
    }

    if (ball.x < -R) point(false);
    else if (ball.x > W + R) point(true);
  }

  function rr(x, y, w, h, c, glow) {
    ctx.fillStyle = c;
    ctx.shadowColor = glow;
    ctx.shadowBlur = 14;
    ctx.fillRect(x, y, w, h);
    ctx.shadowBlur = 0;
  }

  function draw() {
    ctx.fillStyle = '#0B1120';
    ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = 'rgba(148,163,184,0.25)';
    ctx.setLineDash([8, 10]);
    ctx.beginPath();
    ctx.moveTo(W / 2, 0);
    ctx.lineTo(W / 2, H);
    ctx.stroke();
    ctx.setLineDash([]);

    rr(pl.x, pl.y, PW, PH, '#06B6D4', 'rgba(6,182,212,0.8)');
    rr(cpu.x, cpu.y, PW, PH, '#8B5CF6', 'rgba(139,92,246,0.8)');

    ctx.fillStyle = '#F8FAFC';
    ctx.shadowColor = 'rgba(248,250,252,0.9)';
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, R, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    if (state !== 'playing') {
      ctx.fillStyle = 'rgba(11,17,32,0.7)';
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = '#F8FAFC';
      ctx.textAlign = 'center';
      ctx.font = '700 28px "Space Grotesk", sans-serif';
      var t = state === 'idle' ? 'Ping Pong' : state === 'paused' ? 'Paused' : msg;
      ctx.fillText(t, W / 2, H / 2 - 6);
      ctx.font = '500 14px Inter, sans-serif';
      ctx.fillStyle = '#94A3B8';
      ctx.fillText(state === 'paused' ? 'Click to resume' : 'Click to ' + (state === 'idle' ? 'start' : 'play again'), W / 2, H / 2 + 20);
    }
  }

  function loop(now) {
    var dt = Math.min((now - last) / 16.667, 3);
    last = now;
    if (state === 'playing') step(dt, now);
    draw();
    requestAnimationFrame(loop);
  }

  function setY(clientY) {
    var rect = canvas.getBoundingClientRect();
    var y = (clientY - rect.top) * (H / rect.height);
    pl.y = clamp(y - PH / 2, 0, H - PH);
  }

  canvas.addEventListener('mousemove', function (e) { setY(e.clientY); });
  canvas.addEventListener('touchstart', function (e) {
    e.preventDefault();
    setY(e.touches[0].clientY);
  }, { passive: false });
  canvas.addEventListener('touchmove', function (e) {
    e.preventDefault();
    setY(e.touches[0].clientY);
  }, { passive: false });
  canvas.addEventListener('click', function () {
    if (state !== 'playing') start();
  });
  btn.addEventListener('click', start);

  document.addEventListener('keydown', function (e) {
    if (state !== 'playing') return;
    if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') { keys.up = true; e.preventDefault(); }
    if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') { keys.down = true; e.preventDefault(); }
  });
  document.addEventListener('keyup', function (e) {
    if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') keys.up = false;
    if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') keys.down = false;
  });
  document.addEventListener('visibilitychange', function () {
    if (document.hidden && state === 'playing') {
      state = 'paused';
      btn.textContent = 'Resume';
    }
  });

  serve(1);
  requestAnimationFrame(loop);
})();