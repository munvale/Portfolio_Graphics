import { useEffect, useMemo, useState } from 'react'
import { motion, useSpring, useTransform } from 'motion/react'
import { Character, OVERLAY } from './Character'
import { InsightCopy, NameBlock, fadeUp } from './Copy'
import { drawOn } from './HandDrawn'
import { FigureMark } from './Marks'
import { scribbleLoop, seedFrom, wobblyLine } from './scribblePaths'
import { blockPoint, figureBox } from './layouts'
import { liveAnchor } from './useLiveFigure'
import { colors, ease, motionScale as m, timing } from './tokens'

const TAU = Math.PI * 2
const LOOP_PX = 10 // radius of the loop around each anchor
const spring = { stiffness: 220, damping: 20 }

/**
 * Wide composition: Ashley in the middle of a fixed W × H stage, five
 * annotations around her. The parent scales the stage uniformly.
 */
export function PersonaStage({ persona, layout, show, settled, reduced, live }) {
  const { W, H } = layout
  const [activeId, setActiveId] = useState(null)
  const box = useMemo(() => figureBox(layout, persona.image), [layout, persona.image])

  // Lean toward the active annotation.
  const { setLean } = live
  useEffect(() => {
    const slot = activeId && layout.insights[activeId]
    if (!slot || reduced) return setLean({})
    const p = blockPoint(slot)
    const c = { x: box.left + box.width * persona.image.figureCenterX, y: box.top + box.height * 0.4 }
    const dx = p.x - c.x
    const dy = p.y - c.y
    const len = Math.hypot(dx, dy) || 1
    setLean({ x: (dx / len) * m.lean, y: (dy / len) * m.lean * 0.4, r: Math.sign(dx) * m.leanTilt })
  }, [activeId, layout, box, persona.image.figureCenterX, reduced, setLean])

  const placed = persona.insights
    .map((insight, index) => ({ insight, index, slot: layout.insights[insight.id] }))
    .filter((p) => p.slot)
  const unitsPerPx = OVERLAY.w / box.width

  return (
    <div style={{ position: 'relative', width: W, height: H }}>
      <Character
        image={persona.image}
        show={show}
        reduced={reduced}
        live={live}
        style={{ left: box.left, top: box.top, width: box.width, zIndex: 1 }}
      >
        {placed.map(({ insight, index, slot }) => {
          const anchor = slot.anchor ?? insight.anchor
          const active = activeId === insight.id
          const dimmed = activeId !== null && !active
          const start = timing.connectors.delay + index * timing.connectors.stagger
          return (
            <motion.g key={insight.id} animate={{ opacity: dimmed ? 0.2 : 1 }} transition={{ duration: 0.3 }}>
              <AnchorLoop
                id={insight.id}
                cx={anchor.x * OVERLAY.w}
                cy={anchor.y * OVERLAY.h}
                r={LOOP_PX * unitsPerPx}
                strokeWidth={(active ? 2 : 1.25) * unitsPerPx}
                color={active ? colors.accent : colors.line}
                index={index}
                show={show}
                settled={settled}
                reduced={reduced}
                delay={start + timing.connectors.duration * 0.85}
              />
              <FigureMark
                type={insight.mark}
                anchor={anchor}
                show={show}
                settled={settled}
                reduced={reduced}
                active={active}
                delay={start + timing.connectors.duration}
              />
            </motion.g>
          )
        })}
      </Character>

      <div style={{ position: 'absolute', left: layout.name.cx, top: layout.name.y, transform: 'translateX(-50%)', width: 'max-content', zIndex: 2 }}>
        <NameBlock persona={persona} show={show} reduced={reduced} />
      </div>

      {placed.map(({ insight, index, slot }) => (
        <Annotation
          key={insight.id}
          insight={insight}
          index={index}
          slot={slot}
          layout={layout}
          box={box}
          live={live}
          show={show}
          settled={settled}
          reduced={reduced}
          active={activeId === insight.id}
          dimmed={activeId !== null && activeId !== insight.id}
          onActivate={() => setActiveId(insight.id)}
          onClear={() => setActiveId((cur) => (cur === insight.id ? null : cur))}
          onToggle={() => setActiveId((cur) => (cur === insight.id ? null : insight.id))}
        />
      ))}
    </div>
  )
}

/** One annotation: its text block plus the connector that ties it to Ashley. */
function Annotation({ insight, index, slot, layout, box, live, show, settled, reduced, active, dimmed, onActivate, onClear, onToggle }) {
  const seed = seedFrom(insight.id)
  const onLeft = slot.side === 'left'
  const anchor = slot.anchor ?? insight.anchor
  const from = blockPoint(slot)

  const hover = useSpring(0, spring)
  useEffect(() => {
    hover.set(active && !reduced ? m.insightShift : 0)
  }, [active, reduced, hover])

  // Idle drift (each annotation on its own clock) + counter-parallax + hover push.
  const px = { x: 4.3 + index * 0.6, y: 5.2 + index * 0.45 }
  const bx = useTransform(() => {
    const t = live.time.get() / 1000
    return (
      live.pointer.x.get() * m.annotationParallax.x +
      Math.sin((TAU * t) / px.x + index * 1.7) * m.drift * live.alive.get() +
      hover.get() * (onLeft ? -1 : 1)
    )
  })
  const by = useTransform(() => {
    const t = live.time.get() / 1000
    return live.pointer.y.get() * m.annotationParallax.y + Math.cos((TAU * t) / px.y + index) * m.drift * 0.8 * live.alive.get()
  })

  // Connector re-computed every frame so it stays attached at both ends and
  // breathes a little (its bend slowly oscillates).
  const d = useTransform(() => {
    const t = live.time.get() / 1000
    const a = liveAnchor(box, anchor, live)
    const f = { x: from.x + bx.get(), y: from.y + by.get() }
    const dx = a.x - f.x
    const dy = a.y - f.y
    const len = Math.hypot(dx, dy) || 1
    const end = { x: a.x - (dx / len) * (LOOP_PX + 3), y: a.y - (dy / len) * (LOOP_PX + 3) }
    const bow = slot.bow + Math.sin((TAU * t) / (5.5 + index * 0.8)) * 0.04 * live.alive.get()
    return wobblyLine(f, end, seed, bow)
  })
  const dotX = useTransform(() => from.x + bx.get())
  const dotY = useTransform(() => from.y + by.get())

  const start = timing.connectors.delay + index * timing.connectors.stagger
  const factDelay = timing.facts.delay + index * timing.facts.stagger
  const stroke = active ? colors.accent : colors.line

  return (
    <>
      <svg
        aria-hidden
        width={layout.W}
        height={layout.H}
        style={{ position: 'absolute', inset: 0, overflow: 'visible', pointerEvents: 'none', zIndex: 2 }}
      >
        <motion.g animate={{ opacity: dimmed ? 0.2 : 1 }} transition={{ duration: 0.3 }}>
          <motion.circle
            cx={dotX}
            cy={dotY}
            r={2.6}
            fill={stroke}
            initial={{ opacity: 0 }}
            animate={{ opacity: show ? 1 : 0 }}
            transition={{ delay: reduced ? 0 : start, duration: 0.2 }}
          />
          <motion.path
            d={d}
            fill="none"
            stroke={stroke}
            strokeWidth={active ? 2 : 1.25}
            strokeLinecap="round"
            style={{ transition: 'stroke 0.25s, stroke-width 0.25s' }}
            {...drawOn(show, reduced, start, timing.connectors.duration)}
          />
        </motion.g>
      </svg>

      <motion.div
        style={{
          position: 'absolute',
          top: slot.y,
          [onLeft ? 'right' : 'left']: onLeft ? layout.W - slot.x : slot.x,
          width: layout.blockWidth,
          zIndex: 3,
          x: bx,
          y: by,
          rotate: slot.tilt ?? 0,
          transformOrigin: onLeft ? '100% 15px' : '0% 15px',
        }}
      >
        <motion.div {...fadeUp(show, reduced, factDelay, timing.facts.duration, 10)}>
          <motion.button
            type="button"
            onPointerEnter={(e) => e.pointerType === 'mouse' && onActivate()}
            onPointerLeave={(e) => e.pointerType === 'mouse' && onClear()}
            onClick={(e) => e.nativeEvent.pointerType !== 'mouse' && onToggle()}
            onFocus={onActivate}
            onBlur={onClear}
            style={{ ...buttonReset, transformOrigin: onLeft ? '100% 0%' : '0% 0%' }}
            animate={{ opacity: dimmed ? 0.35 : 1, scale: active && !reduced ? 1.04 : 1 }}
            transition={{ duration: 0.3, ease }}
          >
            <InsightCopy
              insight={insight}
              show={show}
              settled={settled}
              reduced={reduced}
              markDelay={factDelay + timing.facts.duration}
              align={onLeft ? 'right' : 'left'}
            />
          </motion.button>
        </motion.div>
      </motion.div>
    </>
  )
}

/** Pen loop around an anchor. Draws on with the entrance, then now and then re-draws itself. */
function AnchorLoop({ id, cx, cy, r, strokeWidth, color, index, show, settled, reduced, delay }) {
  const d = useMemo(() => scribbleLoop(cx, cy, r, r * 0.85, seedFrom(id) + 3), [cx, cy, r, id])
  const idle = settled && !reduced
  const motionProps = idle
    ? {
        initial: false,
        animate: { pathLength: [1, 1, 0, 1], opacity: 1 },
        transition: { duration: 8 + index * 1.3, times: [0, 0.86, 0.9, 1], repeat: Infinity, delay: index * 0.9, ease: 'easeInOut' },
      }
    : drawOn(show, reduced, delay, 0.35)
  return (
    <motion.path
      d={d}
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      style={{ transition: 'stroke 0.25s, stroke-width 0.25s' }}
      {...motionProps}
    />
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
