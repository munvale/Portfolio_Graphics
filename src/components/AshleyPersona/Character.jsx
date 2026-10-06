import { motion, useTransform } from 'motion/react'
import { ease, timing } from './tokens'

/** The overlay's coordinate space: the PNG in normalized units × 1000 / × 1500. */
export const OVERLAY = { w: 1000, h: 1500 }

/**
 * Ashley. The entrance (fade + 30px rise) wraps a live layer whose x / y /
 * rotate / scale come from useLiveFigure. The PNG is only translated, rotated
 * and scaled uniformly — never distorted.
 *
 * `children` render into an SVG overlay that moves with her (viewBox OVERLAY),
 * so anchor loops and marks stay pinned to the phone, tablet, sneakers…
 */
export function Character({ image, show, reduced, live, style, children }) {
  const shadowX = useTransform(() => live.x.get() * 0.6)
  const shadowScale = useTransform(() => 1 - live.float01.get() * 0.14)
  const shadowOpacity = useTransform(() => 1 - live.float01.get() * 0.35)

  return (
    <motion.div
      style={{ position: 'absolute', ...style }}
      initial={{ opacity: 0, y: reduced ? 0 : 30 }}
      animate={show ? { opacity: 1, y: 0 } : { opacity: 0, y: reduced ? 0 : 30 }}
      transition={{ ...timing.figure, duration: reduced ? 0.3 : timing.figure.duration, ease }}
    >
      {/* Ground shadow: tightens and fades as she floats up. */}
      <motion.div
        aria-hidden
        style={{
          position: 'absolute',
          left: '30%',
          width: '44%',
          top: '95.5%',
          height: '4.5%',
          borderRadius: '50%',
          background: 'rgba(40, 28, 16, 0.24)',
          filter: 'blur(10px)',
          x: shadowX,
          scaleX: shadowScale,
          opacity: shadowOpacity,
        }}
      />

      <motion.div
        style={{
          position: 'relative',
          x: live.x,
          y: live.y,
          rotate: live.rotate,
          scale: live.scale,
          transformOrigin: '50% 100%',
        }}
      >
        <img
          src={image.src}
          alt={image.alt}
          draggable={false}
          style={{ display: 'block', width: '100%', height: 'auto', userSelect: 'none' }}
        />
        {children && (
          <svg
            aria-hidden
            viewBox={`0 0 ${OVERLAY.w} ${OVERLAY.h}`}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible', pointerEvents: 'none' }}
          >
            {children}
          </svg>
        )}
      </motion.div>
    </motion.div>
  )
}
