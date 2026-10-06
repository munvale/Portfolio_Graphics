import { useEffect, useMemo, useState } from 'react'
import { motion, useSpring, useTransform } from 'motion/react'
import { Character } from './Character'
import { HeroQuote, InsightCopy, NameBlock, StatusLine, fadeUp } from './Copy'
import { drawOn } from './HandDrawn'
import { scribbleLoop, seedFrom, wobblyLine } from './scribblePaths'
import { anchorPoint, blockPoint, figureBox } from './layouts'
import { colors, ease, motionScale, timing } from './tokens'

const pct = (v, total) => `${(v / total) * 100}%`
const spring = { stiffness: 120, damping: 20, mass: 0.6 }
const LOOP_RADIUS = 10

/**
 * Desktop / tablet composition: Ashley centred on a fixed-aspect stage,
 * insights placed asymmetrically and tied to her with hand-drawn connectors.
 */
export function PersonaStage({ persona, layout, stageWidth, show, settled, reduced, pointer }) {
  const { W, H } = layout
  const [activeId, setActiveId] = useState(null)
  const box = figureBox(layout, persona.image)
  const unitsPerPx = W / Math.max(stageWidth, 1)

  // Lean toward the active insight.
  const lean = useMemo(() => {
    const slot = activeId && layout.insights[activeId]
    if (!slot || reduced) return { x: 0, y: 0, r: 0 }
    const p = blockPoint(slot)
    const c = { x: box.left + box.width * persona.image.figureCenterX, y: box.top + box.height * 0.4 }
    const dx = p.x - c.x
    const dy = p.y - c.y
    const len = Math.hypot(dx, dy) || 1
    return {
      x: (dx / len) * motionScale.hoverShift,
      y: (dy / len) * motionScale.hoverShift * 0.4,
      r: Math.sign(dx) * motionScale.hoverTilt,
    }
  }, [activeId, layout, box.left, box.top, box.width, box.height, persona.image.figureCenterX, reduced])

  const leanX = useSpring(0, spring)
  const leanY = useSpring(0, spring)
  const tilt = useSpring(0, spring)
  useEffect(() => {
    leanX.set(lean.x)
    leanY.set(lean.y)
    tilt.set(lean.r)
  }, [lean, leanX, leanY, tilt])

  const px = useSpring(pointer.x, spring)
  const py = useSpring(pointer.y, spring)
  const offsetX = useTransform(() => px.get() * motionScale.parallax.x + leanX.get())
  const offsetY = useTransform(() => py.get() * motionScale.parallax.y + leanY.get())

  const activate = (id) => setActiveId(id)
  const clear = (id) => setActiveId((cur) => (cur === id ? null : cur))

  return (
    <div style={{ position: 'relative', width: '100%', aspectRatio: `${W} / ${H}` }}>
      <HeroQuote
        hero={persona.heroInsight}
        show={show}
        reduced={reduced}
        style={{ position: 'absolute', left: pct(layout.quote.x, W), top: pct(layout.quote.y, H), width: pct(layout.quote.width, W) }}
      />

      <Character
        image={persona.image}
        show={show}
        settled={settled}
        reduced={reduced}
        offsetX={offsetX}
        offsetY={offsetY}
        tilt={tilt}
        style={{ left: pct(box.left, W), top: pct(box.top, H), width: pct(box.width, W), zIndex: 1 }}
      />

      <div
        style={{ position: 'absolute', left: pct(layout.name.cx, W), top: pct(layout.name.y, H), transform: 'translateX(-50%)', width: 'max-content', zIndex: 2 }}
      >
        <NameBlock persona={persona} show={show} reduced={reduced} />
      </div>

      <svg
        aria-hidden
        viewBox={`0 0 ${W} ${H}`}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible', pointerEvents: 'none', zIndex: 2 }}
      >
        {persona.insights.map((insight, i) => {
          const slot = layout.insights[insight.id]
          if (!slot) return null
          return (
            <Connector
              key={insight.id}
              id={insight.id}
              from={blockPoint(slot)}
              to={anchorPoint(box, slot.anchor ?? insight.anchor)}
              bow={slot.bow}
              index={i}
              offsetX={offsetX}
              offsetY={offsetY}
              unitsPerPx={unitsPerPx}
              show={show}
              reduced={reduced}
              active={activeId === insight.id}
              dimmed={activeId !== null && activeId !== insight.id}
            />
          )
        })}
      </svg>

      {persona.insights.map((insight, i) => {
        const slot = layout.insights[insight.id]
        if (!slot) return null
        const onLeft = slot.side === 'left'
        const active = activeId === insight.id
        const dimmed = activeId !== null && !active
        const delay = timing.facts.delay + i * timing.facts.stagger
        return (
          <motion.div
            key={insight.id}
            style={{
              position: 'absolute',
              top: pct(slot.y, H),
              [onLeft ? 'right' : 'left']: onLeft ? pct(W - slot.x, W) : pct(slot.x, W),
              width: pct(layout.blockWidth, W),
              zIndex: 3,
            }}
            {...fadeUp(show, reduced, delay, timing.facts.duration, 10)}
          >
            <motion.button
              type="button"
              onPointerEnter={(e) => e.pointerType === 'mouse' && activate(insight.id)}
              onPointerLeave={(e) => e.pointerType === 'mouse' && clear(insight.id)}
              onClick={(e) => e.nativeEvent.pointerType !== 'mouse' && setActiveId(active ? null : insight.id)}
              onFocus={() => activate(insight.id)}
              onBlur={() => clear(insight.id)}
              style={{ ...buttonReset, transformOrigin: onLeft ? '100% 0%' : '0% 0%' }}
              animate={{
                opacity: dimmed ? 0.3 : 1,
                scale: active && !reduced ? 1.035 : 1,
                x: active && !reduced ? (onLeft ? -4 : 4) : 0,
              }}
              transition={{ duration: 0.35, ease }}
            >
              <InsightCopy
                insight={insight}
                show={show}
                reduced={reduced}
                circleDelay={delay + timing.facts.duration}
                align={onLeft ? 'right' : 'left'}
              />
            </motion.button>
          </motion.div>
        )
      })}

      <StatusLine
        persona={persona}
        show={show}
        settled={settled}
        reduced={reduced}
        style={{ position: 'absolute', left: 0, right: 0, top: pct(layout.status.y, H) }}
      />
    </div>
  )
}

function Connector({ id, from, to, bow, index, offsetX, offsetY, unitsPerPx, show, reduced, active, dimmed }) {
  const seed = seedFrom(id)
  const { delay, stagger, duration } = timing.connectors
  const start = delay + index * stagger

  // The line follows Ashley as she moves, so it always meets the loop's edge.
  const d = useTransform(() => {
    const tx = to.x + offsetX.get() * unitsPerPx
    const ty = to.y + offsetY.get() * unitsPerPx
    const dx = tx - from.x
    const dy = ty - from.y
    const len = Math.hypot(dx, dy) || 1
    const end = { x: tx - (dx / len) * (LOOP_RADIUS + 3), y: ty - (dy / len) * (LOOP_RADIUS + 3) }
    return wobblyLine(from, end, seed, bow)
  })
  const loopX = useTransform(() => offsetX.get() * unitsPerPx)
  const loopY = useTransform(() => offsetY.get() * unitsPerPx)
  const loop = useMemo(() => scribbleLoop(to.x, to.y, LOOP_RADIUS, LOOP_RADIUS * 0.85, seed + 3), [to.x, to.y, seed])

  const stroke = active ? colors.accent : colors.line
  const strokeStyle = { transition: 'stroke 0.3s, stroke-width 0.3s' }

  return (
    <motion.g animate={{ opacity: dimmed ? 0.15 : 1 }} transition={{ duration: 0.3 }}>
      <motion.circle
        cx={from.x}
        cy={from.y}
        r={2.4}
        fill={stroke}
        style={strokeStyle}
        initial={{ opacity: 0 }}
        animate={{ opacity: show ? 1 : 0 }}
        transition={{ delay: reduced ? 0 : start, duration: 0.2 }}
      />
      <motion.path
        d={d}
        fill="none"
        stroke={stroke}
        strokeWidth={active ? 1.8 : 1.1}
        strokeLinecap="round"
        style={strokeStyle}
        {...drawOn(show, reduced, start, duration)}
      />
      <motion.g style={{ x: loopX, y: loopY }}>
        <motion.path
          d={loop}
          fill="none"
          stroke={stroke}
          strokeWidth={active ? 1.8 : 1.1}
          strokeLinecap="round"
          style={strokeStyle}
          {...drawOn(show, reduced, start + duration * 0.85, 0.35)}
        />
      </motion.g>
    </motion.g>
  )
}

const buttonReset = {
  appearance: 'none',
  background: 'none',
  border: 0,
  padding: 0,
  margin: 0,
  width: '100%',
  font: 'inherit',
  color: 'inherit',
  textAlign: 'inherit',
  cursor: 'default',
  display: 'block',
}
