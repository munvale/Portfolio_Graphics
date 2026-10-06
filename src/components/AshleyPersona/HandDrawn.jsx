import { motion } from 'motion/react'
import { colors, ease } from './tokens'
import { scribbleLoop, scribbleRule, scribbleUnderline, seedFrom } from './scribblePaths'

/** Draw-on transition for a path, collapsed to a fade under reduced motion. */
function drawOn(show, reduced, delay, duration) {
  if (reduced) {
    return {
      initial: { pathLength: 1, opacity: 0 },
      animate: { pathLength: 1, opacity: show ? 1 : 0 },
      transition: { duration: 0.3 },
    }
  }
  return {
    initial: { pathLength: 0, opacity: 0 },
    animate: show ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 },
    transition: {
      pathLength: { delay, duration, ease },
      opacity: { delay, duration: 0.01 },
    },
  }
}

/** Splits `text` around the first `match` and wraps it with `wrap(match)`. */
export function withMark(text, match, wrap) {
  const i = match ? text.indexOf(match) : -1
  if (i < 0) return text
  return (
    <>
      {text.slice(0, i)}
      {wrap(match)}
      {text.slice(i + match.length)}
    </>
  )
}

/** Inline word with a red hand-drawn underline. */
export function Underlined({ children, show, reduced, delay = 0, color = colors.accent }) {
  const d = scribbleUnderline(100, 12, seedFrom(String(children)))
  return (
    <span style={{ position: 'relative', display: 'inline-block', whiteSpace: 'nowrap' }}>
      {children}
      <svg
        aria-hidden
        viewBox="0 0 100 12"
        preserveAspectRatio="none"
        style={{ position: 'absolute', left: '-2%', bottom: -8, width: '104%', height: 12, overflow: 'visible' }}
      >
        <motion.path
          d={d}
          fill="none"
          stroke={color}
          strokeWidth={2.4}
          strokeLinecap="round"
          strokeLinejoin="round"
          {...drawOn(show, reduced, delay, 0.5)}
        />
      </svg>
    </span>
  )
}

/**
 * Inline characters circled by hand. The viewBox roughly matches the rendered
 * size at 24px type, so the stroke stays ~1.5px without non-scaling-stroke
 * (which would break the pathLength draw-on).
 */
export function Circled({ children, show, reduced, delay = 0, color = colors.accent }) {
  const d = scribbleLoop(13, 21, 11.5, 17, seedFrom(String(children)) + 7)
  return (
    <span style={{ position: 'relative', display: 'inline-block' }}>
      {children}
      <svg
        aria-hidden
        viewBox="0 0 26 42"
        preserveAspectRatio="none"
        style={{ position: 'absolute', left: '-28%', top: '-20%', width: '156%', height: '140%', overflow: 'visible' }}
      >
        <motion.path
          d={d}
          fill="none"
          stroke={color}
          strokeWidth={1.5}
          strokeLinecap="round"
          {...drawOn(show, reduced, delay, 0.55)}
        />
      </svg>
    </span>
  )
}

/** Full-width uneven rule that draws left → right. */
export function Rule({ show, reduced, delay = 0, seed = 1, color = colors.rule, style }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 1000 8"
      preserveAspectRatio="none"
      style={{ display: 'block', width: '100%', height: 8, overflow: 'visible', ...style }}
    >
      <motion.path
        d={scribbleRule(1000, seed)}
        fill="none"
        stroke={color}
        strokeWidth={1}
        strokeLinecap="round"
        {...drawOn(show, reduced, delay, 0.7)}
      />
    </svg>
  )
}

export { drawOn }
