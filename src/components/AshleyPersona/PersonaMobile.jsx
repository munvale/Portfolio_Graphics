import { useState } from 'react'
import { motion } from 'motion/react'
import { Character } from './Character'
import { InsightCopy, NameBlock, fadeUp } from './Copy'
import { drawOn } from './HandDrawn'
import { FigureMark } from './Marks'
import { colors, ease, timing } from './tokens'

/**
 * Narrow composition. Rather than shrinking the stage until the type is
 * unreadable, Ashley stays large and the annotations stack beneath her name,
 * each led by a small hand-drawn arrow. Her phone and sneaker doodles stay
 * pinned to her.
 */
export function PersonaMobile({ persona, show, settled, reduced, live }) {
  const [activeId, setActiveId] = useState(null)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ position: 'relative', width: 'min(80%, 320px)', aspectRatio: `${persona.image.aspect}` }}>
        <Character image={persona.image} show={show} reduced={reduced} live={live} style={{ inset: 0 }}>
          {persona.insights
            .filter((i) => i.mark === 'buzz' || i.mark === 'speed')
            .map((insight) => (
              <FigureMark
                key={insight.id}
                type={insight.mark}
                anchor={insight.anchor}
                show={show}
                settled={settled}
                reduced={reduced}
                active={activeId === insight.id}
                delay={timing.connectors.delay}
              />
            ))}
        </Character>
      </div>

      <NameBlock persona={persona} show={show} reduced={reduced} style={{ marginTop: 10 }} />

      <ul style={{ listStyle: 'none', margin: '32px 0 0', padding: 0, width: '100%', display: 'grid', gap: 20 }}>
        {persona.insights.map((insight, i) => {
          const active = activeId === insight.id
          const dimmed = activeId !== null && !active
          const delay = timing.facts.delay + i * timing.facts.stagger
          return (
            <motion.li key={insight.id} {...fadeUp(show, reduced, delay, timing.facts.duration, 8)}>
              <motion.button
                type="button"
                onClick={() => setActiveId(active ? null : insight.id)}
                onFocus={() => setActiveId(insight.id)}
                onBlur={() => setActiveId((cur) => (cur === insight.id ? null : cur))}
                style={rowReset}
                animate={{ opacity: dimmed ? 0.35 : 1, x: active && !reduced ? 5 : 0 }}
                transition={{ duration: 0.3, ease }}
              >
                <svg aria-hidden width="28" height="30" viewBox="0 0 28 30" style={{ flex: 'none', overflow: 'visible' }}>
                  <motion.path
                    d={i % 2 ? 'M 4 2 C 3 12, 8 18, 22 17 M 17 12 L 22.5 17 L 17 21.5' : 'M 5 3 C 4 14, 10 19, 22 18 M 16.5 13.5 L 22.5 18 L 17 22'}
                    fill="none"
                    stroke={active ? colors.accent : colors.line}
                    strokeWidth={1.4}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    {...drawOn(show, reduced, timing.connectors.delay + i * timing.connectors.stagger, 0.4)}
                  />
                </svg>
                <InsightCopy insight={insight} show={show} settled={settled} reduced={reduced} markDelay={delay + timing.facts.duration} />
              </motion.button>
            </motion.li>
          )
        })}
      </ul>
    </div>
  )
}

const rowReset = {
  appearance: 'none',
  background: 'none',
  border: 0,
  margin: 0,
  padding: 0,
  width: '100%',
  font: 'inherit',
  color: 'inherit',
  textAlign: 'left',
  cursor: 'default',
  display: 'flex',
  gap: 10,
  alignItems: 'flex-start',
}
