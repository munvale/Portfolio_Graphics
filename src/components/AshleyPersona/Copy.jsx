import { motion } from 'motion/react'
import { colors, ease, timing, type } from './tokens'
import { Circled, Rule, Underlined, withMark } from './HandDrawn'

/** Fade + rise entrance props; a plain short fade under reduced motion. */
export function fadeUp(show, reduced, delay, duration, distance = 12) {
  const hidden = { opacity: 0, y: reduced ? 0 : distance }
  return {
    initial: hidden,
    animate: show ? { opacity: 1, y: 0 } : hidden,
    transition: reduced ? { duration: 0.3 } : { delay, duration, ease },
  }
}

export function HeroQuote({ hero, show, reduced, align = 'left', style }) {
  const t = timing.quote
  return (
    <motion.figure style={{ margin: 0, textAlign: align, ...style }} {...fadeUp(show, reduced, t.delay, t.duration)}>
      <figcaption style={{ ...type.body, display: 'flex', alignItems: 'center', gap: 10, justifyContent: align === 'center' ? 'center' : 'flex-start' }}>
        <span aria-hidden style={{ width: 18, height: 1.5, background: colors.accent, display: 'inline-block' }} />
        {hero.kicker}
      </figcaption>
      <blockquote style={{ ...type.display, margin: '12px 0 0', textWrap: 'balance' }}>
        {withMark(hero.text, hero.emphasis, (word) => (
          <Underlined show={show} reduced={reduced} delay={t.delay + t.duration}>
            {word}
          </Underlined>
        ))}
      </blockquote>
      {hero.note && <p style={{ ...type.body, margin: '18px 0 0' }}>{hero.note}</p>}
    </motion.figure>
  )
}

export function NameBlock({ persona, show, reduced, style }) {
  const t = timing.name
  return (
    <motion.div style={{ textAlign: 'center', ...style }} {...fadeUp(show, reduced, t.delay, t.duration, 10)}>
      <h2 style={{ ...type.display, margin: 0 }}>{persona.name}</h2>
      <p style={{ ...type.body, margin: '6px 0 0' }}>{persona.role}</p>
    </motion.div>
  )
}

/** Label + description for one insight. */
export function InsightCopy({ insight, show, reduced, circleDelay, align = 'left' }) {
  return (
    <div style={{ textAlign: align }}>
      <div style={{ ...type.title }}>
        {withMark(insight.label, insight.circle, (chars) => (
          <Circled show={show} reduced={reduced} delay={circleDelay}>
            {chars}
          </Circled>
        ))}
      </div>
      <p style={{ ...type.body, margin: '6px 0 0' }}>{insight.description}</p>
    </div>
  )
}

/** Bottom status line. The dot "switches on" at the end of the entrance. */
export function StatusLine({ persona, show, settled, reduced, stacked = false, style }) {
  const t = timing.status
  return (
    <div style={style}>
      <Rule show={show} reduced={reduced} delay={t.delay - 0.35} seed={11} />
      <motion.div
        style={{
          display: 'flex',
          flexDirection: stacked ? 'column' : 'row',
          justifyContent: 'space-between',
          alignItems: stacked ? 'flex-start' : 'center',
          gap: stacked ? 6 : 24,
          paddingTop: 14,
        }}
        {...fadeUp(show, reduced, t.delay, t.duration, 6)}
      >
        <span style={{ ...type.body }}>{persona.eyebrow}</span>
        <span role="status" style={{ ...type.body, display: 'inline-flex', alignItems: 'center', gap: 10 }}>
          <StatusDot on={show} pulse={settled && !reduced} reduced={reduced} />
          {persona.status.text}
        </span>
      </motion.div>
    </div>
  )
}

function StatusDot({ on, pulse, reduced }) {
  const t = timing.status
  return (
    <span aria-hidden style={{ position: 'relative', width: 8, height: 8, display: 'inline-block', flex: 'none' }}>
      <motion.span
        style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: `1px solid ${colors.body}` }}
        initial={{ backgroundColor: 'rgba(228,0,43,0)', borderColor: colors.body }}
        animate={on ? { backgroundColor: colors.accent, borderColor: colors.accent } : {}}
        transition={reduced ? { duration: 0 } : { delay: t.delay + 0.25, duration: 0.25 }}
      />
      {pulse && (
        <motion.span
          style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: `1px solid ${colors.accent}` }}
          initial={{ scale: 1, opacity: 0.6 }}
          animate={{ scale: 2.6, opacity: 0 }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeOut', repeatDelay: 0.6 }}
        />
      )}
    </span>
  )
}
