// breakout.js - every word on the page is a destructible brick.
// Vanilla JS, no modules.

(async () => {
  const coarsePointer = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
  if (coarsePointer || window.innerWidth < 768) return;

  if (document.fonts && document.fonts.ready) {
    await document.fonts.ready;
  }

  // Wrap every word in <span class="w"> at runtime so the source HTML stays
  // clean. Skips text inside script/style/noscript and already-wrapped spans.
  (function wrapWords() {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        const parent = node.parentElement;
        if (!parent) return NodeFilter.FILTER_REJECT;
        const tag = parent.tagName;
        if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'NOSCRIPT') return NodeFilter.FILTER_REJECT;
        if (parent.classList && parent.classList.contains('w')) return NodeFilter.FILTER_REJECT;
        if (!/\S/.test(node.nodeValue)) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    const nodes = [];
    let n;
    while ((n = walker.nextNode())) nodes.push(n);
    for (const node of nodes) {
      const text = node.nodeValue;
      const frag = document.createDocumentFragment();
      let last = 0;
      const re = /\S+/g;
      let m;
      while ((m = re.exec(text)) !== null) {
        if (m.index > last) frag.appendChild(document.createTextNode(text.slice(last, m.index)));
        const span = document.createElement('span');
        span.className = 'w';
        span.textContent = m[0];
        frag.appendChild(span);
        last = m.index + m[0].length;
      }
      if (last < text.length) frag.appendChild(document.createTextNode(text.slice(last)));
      node.parentNode.replaceChild(frag, node);
    }
  })();

  const canvas = document.getElementById('game');
  const ctx = canvas.getContext('2d');
  const resetButton = document.getElementById('game-reset');
  const reduceMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
  const now = () => performance.now();

  let dpr = window.devicePixelRatio || 1;
  let W = 0;
  let H = 0;
  let bricks = [];
  let totalWords = 0;
  let liveWords = 0;
  let pointerX = window.innerWidth / 2;
  let pointerActive = false;
  let hasLaunched = false;
  let lastInteraction = 0;
  let resizeTimer = null;
  let scrollPending = false;
  let resetTimer = null;
  let launchTimer = null;
  let launchToken = 0;

  const keys = { left: false, right: false };
  const ink = {
    base: '#111',
    idle: 0.2,
    awake: 0.2,
    active: 0.82
  };

  const paddle = {
    x: 0,
    y: 0,
    targetX: 0,
    vx: 0,
    w: 100,
    h: 7,
    maxSpeed: 1000,
    accel: 7200,
    friction: 18
  };

  const ball = {
    x: 0,
    y: 0,
    dx: 0,
    dy: 0,
    r: 6,
    minSpeed: 300,
    maxSpeed: 460,
    stuck: true
  };

  const game = {
    lives: 3,
    hits: 0
  };

  function wakeGame() {
    lastInteraction = now();
  }

  function syncActiveState() {
    document.body.classList.toggle('game-active', hasLaunched || game.hits > 0);
  }

  function currentSpeed() {
    return Math.hypot(ball.dx, ball.dy);
  }

  function setBallVelocity(dx, dy, speed) {
    const mag = Math.hypot(dx, dy) || 1;
    ball.dx = (dx / mag) * speed;
    ball.dy = (dy / mag) * speed;
    keepBallPlayable();
  }

  function keepBallPlayable() {
    let speed = clamp(currentSpeed() || ball.minSpeed, ball.minSpeed, ball.maxSpeed);
    let nx = ball.dx / speed;
    let ny = ball.dy / speed;
    const minVertical = 0.34;

    if (!Number.isFinite(nx) || !Number.isFinite(ny)) {
      nx = 0.25;
      ny = -1;
    }

    if (Math.abs(ny) < minVertical) {
      ny = (ny < 0 ? -minVertical : minVertical);
      nx = (nx || (Math.random() < 0.5 ? -1 : 1)) * Math.sqrt(1 - ny * ny);
    }

    const mag = Math.hypot(nx, ny) || 1;
    ball.dx = (nx / mag) * speed;
    ball.dy = (ny / mag) * speed;
  }

  function sizeCanvas() {
    dpr = window.devicePixelRatio || 1;
    W = window.innerWidth;
    H = window.innerHeight;

    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    paddle.w = clamp(W * 0.13, 74, 132);
    paddle.h = clamp(H * 0.009, 6, 9);
    paddle.y = H - clamp(H * 0.04, 24, 34);
    paddle.maxSpeed = clamp(W * 1.0, 400, 750);
    paddle.accel = paddle.maxSpeed * 4.5;
    paddle.friction = 18;
    paddle.targetX = clamp(paddle.targetX || idlePaddleX(), 0, W - paddle.w);
    paddle.x = clamp(paddle.x || paddle.targetX, 0, W - paddle.w);

    ball.r = clamp(Math.min(W, H) * 0.008, 5, 8);
    ball.minSpeed = clamp(Math.min(W, H) * 0.48, 250, 390);
    ball.maxSpeed = ball.minSpeed * 1.55;

    if (ball.stuck) {
      attachBall(false);
    }
  }

  function idlePaddleX() {
    return clamp(W - paddle.w - 24, 0, W - paddle.w);
  }

  function buildBricks() {
    bricks = [];
    const spans = Array.from(document.querySelectorAll('span.w'));
    totalWords = spans.length;
    liveWords = 0;

    for (const span of spans) {
      if (span.classList.contains('dead')) continue;
      liveWords++;
      for (const rect of span.getClientRects()) {
        if (rect.width < 1 || rect.height < 1) continue;
        bricks.push({
          x: rect.left - 1,
          y: rect.top - 1,
          w: rect.width + 2,
          h: rect.height + 2,
          span,
          dead: false
        });
      }
    }
  }

  function killSpan(span) {
    if (span.classList.contains('dead')) return;
    span.classList.add('dead');
    for (const brick of bricks) {
      if (brick.span === span) brick.dead = true;
    }
    game.hits++;
    liveWords = Math.max(0, liveWords - 1);
    refreshDeadContainers(span);
    syncActiveState();
  }

  function refreshDeadContainers(span) {
    const link = span.closest('a');
    if (link) {
      const words = Array.from(link.querySelectorAll('span.w'));
      const damaged = words.some((word) => word.classList.contains('dead'));
      const empty = words.length > 0 && words.every((word) => word.classList.contains('dead'));
      link.classList.toggle('link-damaged', damaged);
      link.classList.toggle('dead-link', empty);
    }

    const item = span.closest('li');
    if (item) {
      const words = Array.from(item.querySelectorAll('span.w'));
      const empty = words.length > 0 && words.every((word) => word.classList.contains('dead'));
      item.classList.toggle('dead-marker', empty);
    }
  }

  function scheduleLaunch(delay) {
    clearTimeout(launchTimer);
    if (reduceMotion) return;
    const token = ++launchToken;
    launchTimer = setTimeout(() => {
      if (token === launchToken) launchBall();
    }, delay);
  }

  function attachBall(autoLaunch) {
    ball.stuck = true;
    ball.dx = 0;
    ball.dy = 0;
    ball.x = paddle.x + paddle.w / 2;
    ball.y = paddle.y - ball.r - 1;
    if (autoLaunch && hasLaunched) scheduleLaunch(900);
  }

  function launchBall() {
    if (!ball.stuck) return;
    hasLaunched = true;
    wakeGame();
    syncActiveState();
    clearTimeout(launchTimer);
    launchTimer = null;
    ball.stuck = false;
    const paddleInfluence = clamp(paddle.vx / paddle.maxSpeed, -0.28, 0.28);
    const angle = (Math.random() - 0.5) * 0.42 + paddleInfluence;
    setBallVelocity(Math.sin(angle), -Math.cos(angle), ball.minSpeed);
  }

  function loseBall() {
    game.lives--;
    if (game.lives <= 0) {
      hasLaunched = false;
      resetAll('reset');
      return;
    }
    attachBall(true);
  }

  function resetAll(reason) {
    clearTimeout(resetTimer);
    clearTimeout(launchTimer);
    resetTimer = null;
    launchTimer = null;
    launchToken++;
    hasLaunched = false;
    document.querySelectorAll('span.w.dead').forEach((span) => span.classList.remove('dead'));
    document.querySelectorAll('a.link-damaged, a.dead-link').forEach((link) => {
      link.classList.remove('link-damaged', 'dead-link');
    });
    document.querySelectorAll('li.dead-marker').forEach((item) => item.classList.remove('dead-marker'));
    game.lives = 3;
    game.hits = 0;
    buildBricks();
    attachBall(false);
    syncActiveState();
  }

  function updatePaddle(dt) {
    const oldX = paddle.x;
    const axis = (keys.right ? 1 : 0) - (keys.left ? 1 : 0);

    if (axis !== 0) {
      pointerActive = false;
      const reversing = paddle.vx !== 0 && Math.sign(paddle.vx) !== axis;
      const accel = paddle.accel * (reversing ? 1.6 : 1);
      paddle.vx = clamp(paddle.vx + axis * accel * dt, -paddle.maxSpeed, paddle.maxSpeed);
      paddle.x += paddle.vx * dt;
      paddle.targetX = paddle.x;
    } else if (pointerActive) {
      paddle.targetX = pointerX - paddle.w / 2;
      paddle.targetX = clamp(paddle.targetX, 0, W - paddle.w);
      const follow = 1 - Math.exp(-dt * 24);
      paddle.x += (paddle.targetX - paddle.x) * follow;
    } else {
      const decay = Math.exp(-dt * paddle.friction);
      paddle.vx *= decay;
      if (Math.abs(paddle.vx) < 4) paddle.vx = 0;
      paddle.x += paddle.vx * dt;
      paddle.targetX = paddle.x;
    }

    paddle.x = clamp(paddle.x, 0, W - paddle.w);
    if (paddle.x === 0 || paddle.x === W - paddle.w) {
      paddle.vx = 0;
    }
    paddle.targetX = clamp(paddle.targetX, 0, W - paddle.w);
    paddle.vx = dt > 0 ? (paddle.x - oldX) / dt : 0;

    if (ball.stuck) {
      ball.x = paddle.x + paddle.w / 2;
      ball.y = paddle.y - ball.r - 1;
    }
  }

  function circleRectOverlaps(rect) {
    const cx = clamp(ball.x, rect.x, rect.x + rect.w);
    const cy = clamp(ball.y, rect.y, rect.y + rect.h);
    const dx = ball.x - cx;
    const dy = ball.y - cy;
    return dx * dx + dy * dy <= ball.r * ball.r;
  }

  function hitPaddle() {
    if (ball.dy <= 0) return false;
    const rect = { x: paddle.x, y: paddle.y, w: paddle.w, h: paddle.h };
    if (!circleRectOverlaps(rect)) return false;

    const offset = clamp((ball.x - (paddle.x + paddle.w / 2)) / (paddle.w / 2), -1, 1);
    const angle = offset * (Math.PI * 0.36);
    const speed = clamp(currentSpeed() * 1.012 + Math.abs(paddle.vx) * 0.018, ball.minSpeed, ball.maxSpeed);

    ball.y = paddle.y - ball.r - 0.5;
    setBallVelocity(Math.sin(angle) * speed + paddle.vx * 0.22, -Math.cos(angle) * speed, speed);
    return true;
  }

  function resolveBrickHit(brick, oldX, oldY) {
    killSpan(brick.span);

    const fromLeft = oldX + ball.r <= brick.x;
    const fromRight = oldX - ball.r >= brick.x + brick.w;
    const fromTop = oldY + ball.r <= brick.y;
    const fromBottom = oldY - ball.r >= brick.y + brick.h;

    if (fromLeft) {
      ball.x = brick.x - ball.r - 0.5;
      ball.dx = -Math.abs(ball.dx);
    } else if (fromRight) {
      ball.x = brick.x + brick.w + ball.r + 0.5;
      ball.dx = Math.abs(ball.dx);
    } else if (fromTop) {
      ball.y = brick.y - ball.r - 0.5;
      ball.dy = -Math.abs(ball.dy);
    } else if (fromBottom) {
      ball.y = brick.y + brick.h + ball.r + 0.5;
      ball.dy = Math.abs(ball.dy);
    } else {
      const pushLeft = ball.x + ball.r - brick.x;
      const pushRight = brick.x + brick.w - (ball.x - ball.r);
      const pushTop = ball.y + ball.r - brick.y;
      const pushBottom = brick.y + brick.h - (ball.y - ball.r);
      const xPush = Math.min(pushLeft, pushRight);
      const yPush = Math.min(pushTop, pushBottom);

      if (xPush < yPush) {
        ball.dx = -ball.dx;
        ball.x += pushLeft < pushRight ? -xPush - 0.5 : xPush + 0.5;
      } else {
        ball.dy = -ball.dy;
        ball.y += pushTop < pushBottom ? -yPush - 0.5 : yPush + 0.5;
      }
    }

    const speed = clamp(currentSpeed() * 1.006, ball.minSpeed, ball.maxSpeed);
    setBallVelocity(ball.dx, ball.dy, speed);
  }

  function hitBrick(oldX, oldY) {
    for (const brick of bricks) {
      if (brick.dead) continue;
      if (!circleRectOverlaps(brick)) continue;
      resolveBrickHit(brick, oldX, oldY);
      return true;
    }
    return false;
  }

  function advanceBall(dt) {
    if (ball.stuck) return;

    const dist = Math.hypot(ball.dx * dt, ball.dy * dt);
    const subSteps = Math.max(1, Math.ceil(dist / Math.max(3, ball.r * 0.75)));
    const sdt = dt / subSteps;

    for (let i = 0; i < subSteps; i++) {
      const oldX = ball.x;
      const oldY = ball.y;

      ball.x += ball.dx * sdt;
      ball.y += ball.dy * sdt;

      if (ball.x - ball.r < 0) {
        ball.x = ball.r;
        ball.dx = Math.abs(ball.dx);
      } else if (ball.x + ball.r > W) {
        ball.x = W - ball.r;
        ball.dx = -Math.abs(ball.dx);
      }

      if (ball.y - ball.r < 0) {
        ball.y = ball.r;
        ball.dy = Math.abs(ball.dy);
      }

      if (hitPaddle()) continue;
      if (hitBrick(oldX, oldY)) continue;

      if (ball.y - ball.r > H + 40) {
        loseBall();
        break;
      }
    }

    if (!resetTimer && liveWords === 0 && totalWords > 0) {
      resetTimer = setTimeout(() => resetAll('win'), 1500);
    }
  }

  function step(dt) {
    updatePaddle(dt);
    advanceBall(dt);
  }

  function roundedRect(x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  function render() {
    ctx.clearRect(0, 0, W, H);

    const recentlyAwake = now() - lastInteraction < 1600;
    const alpha = hasLaunched || !ball.stuck ? ink.active : (recentlyAwake ? ink.awake : ink.idle);

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = ink.base;
    const resting = !hasLaunched && ball.stuck;
    const drawH = resting ? Math.max(3, paddle.h * 0.6) : paddle.h;
    const drawR = resting ? ball.r * 0.72 : ball.r;
    roundedRect(paddle.x, paddle.y + (paddle.h - drawH) / 2, paddle.w, drawH, drawH / 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(ball.x, ball.y, drawR, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function onPointerMove(x) {
    pointerX = x;
    pointerActive = true;
    wakeGame();
  }

  function keyAction(event) {
    const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
    if (key === 'ArrowLeft' || key === 'a') return 'left';
    if (key === 'ArrowRight' || key === 'd') return 'right';
    if (key === ' ' || key === 'Enter') return 'launch';
    if (key === 'r') return 'reset';
    return '';
  }

  document.addEventListener('mousemove', (event) => onPointerMove(event.clientX), { passive: true });
  document.addEventListener('click', (event) => {
    if (event.target.closest('a')) return;
    launchBall();
  });

  if (resetButton) {
    resetButton.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      resetAll('reset');
    });
  }

  document.addEventListener('keydown', (event) => {
    const action = keyAction(event);
    if (!action) return;

    wakeGame();
    event.preventDefault();

    if (action === 'left') {
      keys.left = true;
    } else if (action === 'right') {
      keys.right = true;
    } else if (action === 'launch') {
      launchBall();
    } else if (action === 'reset') {
      resetAll('reset');
    }
  });

  document.addEventListener('keyup', (event) => {
    const action = keyAction(event);
    if (!action) return;

    event.preventDefault();

    if (action === 'left') {
      keys.left = false;
    } else if (action === 'right') {
      keys.right = false;
    }
  });

  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      sizeCanvas();
      requestAnimationFrame(buildBricks);
    }, 100);
  });

  window.addEventListener('scroll', () => {
    if (scrollPending) return;
    scrollPending = true;
    requestAnimationFrame(() => {
      buildBricks();
      scrollPending = false;
    });
  }, { passive: true });

  let last = now();
  function loop(t) {
    const dt = Math.min(0.033, (t - last) / 1000);
    last = t;
    step(dt);
    render();
    requestAnimationFrame(loop);
  }

  sizeCanvas();
  buildBricks();
  attachBall(false);
  requestAnimationFrame(loop);
})();
