import { motion } from 'motion/react'
import { colors } from './tokens'
import { drawOn } from './HandDrawn'

const stroke = { fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round' }

/**
 * Small doodles that sit after an annotation's label (inline, 26×22).
 * They draw on with the entrance, then keep a quiet loop of their own.
 */
export function InlineMark({ type, show, settled, reduced, delay, color = colors.line }) {
  const idle = settled && !reduced
  const common = { ...stroke, stroke: color, strokeWidth: 1.5 }
  const box = { width: 26, height: 22, viewBox: '0 0 26 22' }
  const wrap = { display: 'inline-block', verticalAlign: '-2px', marginLeft: 8, overflow: 'visible' }

  if (type === 'cycle') {
    // Circular arrow that keeps slowly turning: things never settle.
    return (
      <motion.svg
        aria-hidden
        {...box}
        style={{ ...wrap, originX: '50%', originY: '50%' }}
        animate={idle ? { rotate: 360 } : { rotate: 0 }}
        transition={idle ? { duration: 9, repeat: Infinity, ease: 'linear' } : { duration: 0.3 }}
      >
        <motion.path d="M 20.5 8 C 18.5 3.5, 12 2, 8 4.5 C 3.5 7.5, 3.5 14, 7.5 17 C 11 19.5, 17 19, 19.8 15" {...common} {...drawOn(show, reduced, delay, 0.5)} />
        <motion.path d="M 21.5 3.5 L 20.7 8.3 L 16.2 7.2" {...common} {...drawOn(show, reduced, delay + 0.45, 0.2)} />
      </motion.svg>
    )
  }

  if (type === 'rise') {
    // Zig-zag trend line that redraws itself every few seconds.
    const redraw = idle
      ? { animate: { pathLength: [1, 1, 0, 1] }, transition: { duration: 6.5, times: [0, 0.78, 0.84, 1], repeat: Infinity, ease: 'easeInOut' } }
      : drawOn(show, reduced, delay, 0.5)
    return (
      <svg aria-hidden {...box} style={wrap}>
        <motion.path d="M 2 18 L 8.5 11.5 L 12.5 14.5 L 21 5" {...common} {...redraw} />
        <motion.path d="M 15.8 4.6 L 21.3 4.6 L 21.3 10" {...common} {...drawOn(show, reduced, delay + 0.45, 0.2)} />
      </svg>
    )
  }

  if (type === 'tally') {
    // Five-bar tally: counting stores.
    const bars = ['M 3 4 L 3.6 18', 'M 7.5 3.5 L 7.8 18.5', 'M 12 4.2 L 12.3 18', 'M 16.5 3.6 L 16.4 18.4', 'M 0.5 15 L 20 6']
    return (
      <svg aria-hidden {...box} style={wrap}>
        {bars.map((d, i) => (
          <motion.path key={i} d={d} {...common} {...drawOn(show, reduced, delay + i * 0.08, 0.18)} />
        ))}
      </svg>
    )
  }

  return null
}

/**
 * Doodles pinned to the character (rendered inside Character's overlay, in
 * its 1000 × 1500 space), so they ride along with every idle movement.
 */
export function FigureMark({ type, anchor, show, settled, reduced, delay, active }) {
  const idle = settled && !reduced
  const cx = anchor.x * 1000
  const cy = anchor.y * 1500

  if (type === 'buzz') {
    // Phone "buzzing": two arcs that pulse outward. This is her alert.
    const arcs = [46, 74].map((r) => {
      const a0 = (-55 * Math.PI) / 180
      const a1 = (40 * Math.PI) / 180
      const p = (a) => `${(cx + 6 + Math.cos(a) * r).toFixed(1)} ${(cy - 10 + Math.sin(a) * r).toFixed(1)}`
      return `M ${p(a0)} A ${r} ${r} 0 0 1 ${p(a1)}`
    })
    return arcs.map((d, i) => (
      <motion.path
        key={i}
        d={d}
        {...stroke}
        stroke={colors.accent}
        strokeWidth={active ? 5 : 3.6}
        {...(idle
          ? {
              initial: false,
              animate: { pathLength: [0, 1, 1], opacity: [0, 1, 0] },
              transition: { duration: 1.5, delay: i * 0.18, repeat: Infinity, repeatDelay: 1.3, ease: 'easeOut' },
            }
          : drawOn(show, reduced, delay + i * 0.12, 0.35))}
      />
    ))
  }

  if (type === 'speed') {
    // Motion lines trailing her back foot.
    const lines = [
      { y: -40, len: 70 },
      { y: -6, len: 100 },
      { y: 28, len: 60 },
    ]
    return lines.map((l, i) => {
      const x1 = cx - 70
      const d = `M ${x1} ${cy + l.y} L ${x1 - l.len} ${cy + l.y + 4}`
      return (
        <motion.path
          key={i}
          d={d}
          {...stroke}
          stroke={colors.line}
          strokeWidth={3.4}
          {...(idle
            ? {
                initial: false,
                animate: { x: [0, -26], opacity: [0, 0.9, 0] },
                transition: { duration: 1.3, delay: i * 0.16, repeat: Infinity, repeatDelay: 0.5, ease: 'easeOut' },
              }
            : drawOn(show, reduced, delay + i * 0.08, 0.3))}
        />
      )
    })
  }

  return null
}
