("use strict");

const canvas = document.getElementById("animationCanvas");
const ctx = canvas.getContext("2d");
const buffer = document.createElement("canvas").getContext("2d");

const particleCount = 2000;
const particlePropCount = 9;
const particlePropsLength = particleCount * particlePropCount;
const spawnRadius = rand(150) + 150;
const noiseSteps = 6;

let center;
let tick;
let simplex;
let particleProps;

function setup() {
  tick = 0;
  center = [];
  resize();
  createParticles();
  draw();
}

function createParticles() {
  simplex = new SimplexNoise();
  particleProps = new Float32Array(particleCount * particlePropCount);

  let i;

  for (i = 0; i < particlePropsLength; i += particlePropCount) {
    initParticle(i);
  }
}

function initParticle(i) {
  let iy, ih, rd, rt, cx, sy, x, y, s, rv, vx, vy, t, h, w, l, ttl;

  iy = i + 1;
  ih = (0.5 * i) | 0;
  rd = rand(spawnRadius);
  rt = rand(TAU);
  cx = Math.cos(rt);
  sy = Math.sin(rt);
  x = center[0] + cx * rd;
  y = center[1] + sy * rd;
  rv = randIn(0.1, 1);
  s = randIn(1, 8);
  vx = rv * cx * 0.1;
  vy = rv * sy * 0.1;
  w = randIn(0.1, 2);
  h = randIn(160, 260);
  l = 0;
  ttl = randIn(50, 200);

  particleProps.set([x, y, vx, vy, s, h, w, l, ttl], i);
}

function drawParticle(i) {
  let n, dx, dy, dl, c;
  let [x, y, vx, vy, s, h, w, l, ttl] = particleProps.subarray(
    i,
    i + particlePropCount
  );

  n = simplex.noise3D(x * 0.0025, y * 0.0025, tick * 0.0005) * TAU * noiseSteps;
  vx = lerp(vx, Math.cos(n), 0.05);
  vy = lerp(vy, Math.sin(n), 0.05);
  dx = x + vx * s;
  dy = y + vy * s;
  dl = fadeInOut(l, ttl);
  c = `hsla(${h},50%,60%,${dl})`;

  l++;

  buffer.save();
  buffer.lineWidth = dl * w + 1;
  buffer.strokeStyle = c;
  buffer.beginPath();
  buffer.moveTo(x, y);
  buffer.lineTo(dx, dy);
  buffer.stroke();
  buffer.closePath();
  buffer.restore();

  particleProps.set([dx, dy, vx, vy, s, h, w, l, ttl], i);

  (checkBounds(x, y) || l > ttl) && initParticle(i);
}

function checkBounds(x, y) {
  return x > buffer.canvas.width || x < 0 || y > buffer.canvas.height || y < 0;
}

function resize() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;
  buffer.canvas.width = width;
  buffer.canvas.height = height;

  buffer.drawImage(ctx.canvas, 0, 0);

  ctx.canvas.width = width;
  ctx.canvas.height = height;

  ctx.drawImage(buffer.canvas, 0, 0);

  center[0] = 0.5 * width;
  center[1] = 0.5 * height;
}

function draw() {
  tick++;
  buffer.clearRect(0, 0, buffer.canvas.width, buffer.canvas.height);

  ctx.fillStyle = "rgba(0,0,0,0.1)";
  ctx.fillRect(0, 0, buffer.canvas.width, buffer.canvas.height);

  let i = 0;

  for (; i < particlePropsLength; i += particlePropCount) {
    drawParticle(i);
  }

  ctx.save();
  ctx.filter = "blur(8px)";
  ctx.globalCompositeOperation = "lighten";
  ctx.drawImage(buffer.canvas, 0, 0);
  ctx.restore();

  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  ctx.drawImage(buffer.canvas, 0, 0);
  ctx.restore();

  window.requestAnimationFrame(draw);
}

window.addEventListener("load", setup);
window.addEventListener("resize", resize);

// Utility functions (you may have these elsewhere in your code)
function rand(max) {
  return Math.random() * max;
}

function randIn(min, max) {
  return rand(max - min) + min;
}

function fadeInOut(val, max) {
  return val < max * 0.2
    ? val / (max * 0.2)
    : 1 - (val - max * 0.2) / (max * 0.8);
}

const TAU = Math.PI * 2;

function lerp(a, b, t) {
  return (1 - t) * a + t * b;
}
