/**
 * Deterministic "hand-drawn" SVG path generators. Same seed → same wobble,
 * so lines don't jump between renders.
 */

function rng(seed) {
  let t = seed >>> 0
  return () => {
    t += 0x6d2b79f5
    let r = Math.imul(t ^ (t >>> 15), 1 | t)
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r)
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296
  }
}

const jitter = (r, amount) => (r() * 2 - 1) * amount
const f = (n) => n.toFixed(1)

export function seedFrom(str) {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) h = Math.imul(h ^ str.charCodeAt(i), 16777619)
  return h >>> 0
}

/** A slightly bowed, uneven stroke from a to b. */
export function wobblyLine(a, b, seed, bow = 0.06) {
  const r = rng(seed)
  const dx = b.x - a.x
  const dy = b.y - a.y
  const len = Math.hypot(dx, dy) || 1
  const nx = -dy / len
  const ny = dx / len
  const bend = len * bow
  const c1 = len * 0.025
  const p1 = {
    x: a.x + dx * 0.3 + nx * (bend + jitter(r, c1)),
    y: a.y + dy * 0.3 + ny * (bend + jitter(r, c1)),
  }
  const p2 = {
    x: a.x + dx * 0.72 + nx * (bend * 0.55 + jitter(r, c1)),
    y: a.y + dy * 0.72 + ny * (bend * 0.55 + jitter(r, c1)),
  }
  return `M ${f(a.x)} ${f(a.y)} C ${f(p1.x)} ${f(p1.y)}, ${f(p2.x)} ${f(p2.y)}, ${f(b.x)} ${f(b.y)}`
}

/** An imperfect loop that overshoots its start, like a pen circling something. */
export function scribbleLoop(cx, cy, rx, ry, seed, turns = 1.12) {
  const r = rng(seed)
  const start = r() * Math.PI * 2
  const phase = r() * Math.PI * 2
  const steps = 44
  const tilt = jitter(r, 0.25)
  let d = ''
  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    const a = start + t * Math.PI * 2 * turns
    const wobble = 1 + 0.07 * Math.sin(a * 2 + phase) + t * 0.08
    const x0 = Math.cos(a) * rx * wobble
    const y0 = Math.sin(a) * ry * wobble
    const x = cx + x0 * Math.cos(tilt) - y0 * Math.sin(tilt)
    const y = cy + x0 * Math.sin(tilt) + y0 * Math.cos(tilt)
    d += `${i === 0 ? 'M' : 'L'} ${f(x)} ${f(y)} `
  }
  return d.trim()
}
