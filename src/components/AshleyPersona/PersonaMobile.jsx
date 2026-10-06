import { useState } from 'react'
import { motion, useMotionValue } from 'motion/react'
import { Character } from './Character'
import { HeroQuote, InsightCopy, NameBlock, StatusLine, fadeUp } from './Copy'
import { Rule, drawOn } from './HandDrawn'
import { scribbleLoop } from './scribblePaths'
import { colors, ease, timing, type } from './tokens'

/**
 * Mobile composition. Instead of shrinking the stage, it becomes a single
 * column: Ashley → name → hero insight → an annotated list of insights.
 * Connectors turn into hand-drawn rules; one red loop marks her phone.
 */
export function PersonaMobile({ persona, show, settled, reduced }) {
  const [activeId, setActiveId] = useState(null)
  const still = useMotionValue(0)
  const focus = persona.insights.find((i) => i.id === 'visibility') ?? persona.insights[0]
  const figureWidth = 'min(76%, 300px)'

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ position: 'relative', width: figureWidth, margin: '0 auto', aspectRatio: `${persona.image.aspect}` }}>
        <Character
          image={persona.image}
          show={show}
          settled={settled}
          reduced={reduced}
          offsetX={still}
          offsetY={still}
          tilt={still}
          style={{ inset: 0 }}
        />
        {focus && (
          <svg
            aria-hidden
            viewBox="0 0 100 150"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible', pointerEvents: 'none' }}
          >
            <motion.path
              d={scribbleLoop(focus.anchor.x * 100, focus.anchor.y * 150, 5.5, 7.5, 5)}
              fill="none"
              stroke={colors.accent}
              strokeWidth={0.9}
              strokeLinecap="round"
              {...drawOn(show, reduced, timing.connectors.delay, 0.5)}
            />
          </svg>
        )}
      </div>

      <NameBlock persona={persona} show={show} reduced={reduced} style={{ marginTop: 8 }} />

      <HeroQuote hero={persona.heroInsight} show={show} reduced={reduced} style={{ marginTop: 56 }} />

      <ol style={{ listStyle: 'none', margin: '48px 0 0', padding: 0 }}>
        {persona.insights.map((insight, i) => {
          const active = activeId === insight.id
          const dimmed = activeId !== null && !active
          const ruleDelay = timing.connectors.delay + i * timing.connectors.stagger
          const delay = timing.facts.delay + i * timing.facts.stagger
          return (
            <li key={insight.id}>
              <Rule show={show} reduced={reduced} delay={ruleDelay} seed={i + 3} color={active ? colors.accent : colors.rule} />
              <motion.button
                type="button"
                onClick={() => setActiveId(active ? null : insight.id)}
                onFocus={() => setActiveId(insight.id)}
                onBlur={() => setActiveId((cur) => (cur === insight.id ? null : cur))}
                style={{ ...rowReset }}
                {...fadeUp(show, reduced, delay, timing.facts.duration, 8)}
                animate={show ? { opacity: dimmed ? 0.35 : 1, y: 0, x: active && !reduced ? 4 : 0 } : undefined}
                transition={reduced ? { duration: 0.3 } : { delay: activeId === null && !settled ? delay : 0, duration: 0.35, ease }}
              >
                <span style={{ ...type.body, color: active ? colors.accent : colors.body, paddingTop: 5 }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <InsightCopy insight={insight} show={show} reduced={reduced} circleDelay={delay + timing.facts.duration} />
              </motion.button>
            </li>
          )
        })}
      </ol>

      <StatusLine persona={persona} show={show} settled={settled} reduced={reduced} stacked style={{ marginTop: 32 }} />
    </div>
  )
}

const rowReset = {
  appearance: 'none',
  background: 'none',
  border: 0,
  margin: 0,
  width: '100%',
  font: 'inherit',
  color: 'inherit',
  textAlign: 'left',
  cursor: 'default',
  display: 'grid',
  gridTemplateColumns: '40px 1fr',
  padding: '20px 0 24px',
}
