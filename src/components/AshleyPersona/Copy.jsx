import { motion } from 'motion/react'
import { InlineMark } from './Marks'
import { descriptionOpacity, ease, timing, type } from './tokens'

/** Fade + rise entrance props; a plain short fade under reduced motion. */
export function fadeUp(show, reduced, delay, duration, distance = 12) {
  const hidden = { opacity: 0, y: reduced ? 0 : distance }
  return {
    initial: hidden,
    animate: show ? { opacity: 1, y: 0 } : hidden,
    transition: reduced ? { duration: 0.3 } : { delay, duration, ease },
  }
}

export function NameBlock({ persona, show, reduced, style }) {
  const t = timing.name
  return (
    <motion.div style={{ textAlign: 'center', ...style }} {...fadeUp(show, reduced, t.delay, t.duration, 10)}>
      <div style={{ ...type.display }}>{persona.name}</div>
      <div style={{ ...type.body, marginTop: 4 }}>{persona.role}</div>
    </motion.div>
  )
}

/** Label (+ doodle) and a light description for one annotation. */
export function InsightCopy({ insight, show, settled, reduced, markDelay, align = 'left' }) {
  return (
    <span style={{ display: 'block', textAlign: align }}>
      <span style={{ ...type.title, display: 'block', textWrap: 'balance' }}>
        {insight.label}
        <InlineMark type={insight.mark} show={show} settled={settled} reduced={reduced} delay={markDelay} />
      </span>
      <span style={{ ...type.body, display: 'block', marginTop: 4, opacity: descriptionOpacity }}>
        {insight.description}
      </span>
    </span>
  )
}
