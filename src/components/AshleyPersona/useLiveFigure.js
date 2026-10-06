import { useCallback, useEffect } from 'react'
import { animate, useMotionValue, useSpring, useTime, useTransform } from 'motion/react'
import { motionScale as m } from './tokens'

const spring = { stiffness: 110, damping: 18, mass: 0.7 }
const TAU = Math.PI * 2
/** 0 → 1 → 0 over `period` seconds. */
const wave = (t, period, phase = 0) => 0.5 - 0.5 * Math.cos((TAU * t) / period + phase)

/**
 * Ashley's live transform, as motion values, so the character, her shadow and
 * every connector read from one source and stay attached to each other.
 *
 *   x, y, rotate, scale   — applied to the character (origin: bottom centre)
 *   float01               — 0 (grounded) … 1 (highest), drives the shadow
 *   alive                 — 0 during the entrance, eases to 1 when idle starts
 *   time                  — ms clock for any other ambient loop
 *   setLean({x, y, r})    — lean toward a hovered insight
 */
export function useLiveFigure({ settled, reduced, pointer }) {
  const time = useTime()
  const alive = useMotionValue(0)

  useEffect(() => {
    if (!settled || reduced) {
      alive.set(0)
      return
    }
    const controls = animate(alive, 1, { duration: 1.2, ease: 'easeInOut' })
    return () => controls.stop()
  }, [settled, reduced, alive])

  const px = useSpring(pointer.x, spring)
  const py = useSpring(pointer.y, spring)
  const leanX = useSpring(0, spring)
  const leanY = useSpring(0, spring)
  const leanR = useSpring(0, spring)

  const setLean = useCallback(
    ({ x = 0, y = 0, r = 0 }) => {
      leanX.set(x)
      leanY.set(y)
      leanR.set(r)
    },
    [leanX, leanY, leanR],
  )

  const float01 = useTransform(() => wave(time.get() / 1000, m.floatPeriod) * alive.get())
  const x = useTransform(() => px.get() * m.parallax.x + leanX.get())
  const y = useTransform(() => py.get() * m.parallax.y + leanY.get() - float01.get() * m.float)
  const rotate = useTransform(
    () => leanR.get() + Math.sin((TAU * time.get()) / 1000 / m.swayPeriod) * m.sway * alive.get(),
  )
  const scale = useTransform(
    () => 1 + wave(time.get() / 1000, m.breathePeriod, 1.3) * m.breathe * alive.get(),
  )

  return { x, y, rotate, scale, float01, alive, time, pointer: { x: px, y: py }, setLean }
}

/**
 * Current on-screen position of a normalized anchor on the character, matching
 * the CSS transform (translate, then rotate + scale about the bottom centre).
 * Call inside a useTransform(() => …) so it re-runs every frame.
 */
export function liveAnchor(box, anchor, live) {
  const ox = box.left + box.width / 2
  const oy = box.top + box.height
  const dx = box.left + anchor.x * box.width - ox
  const dy = box.top + anchor.y * box.height - oy
  const s = live.scale.get()
  const a = (live.rotate.get() * Math.PI) / 180
  return {
    x: ox + live.x.get() + s * (dx * Math.cos(a) - dy * Math.sin(a)),
    y: oy + live.y.get() + s * (dx * Math.sin(a) + dy * Math.cos(a)),
  }
}
