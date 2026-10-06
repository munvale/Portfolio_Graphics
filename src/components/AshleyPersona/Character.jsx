import { motion, useTransform } from 'motion/react'
import { ease, motionScale, timing } from './tokens'

/**
 * Ashley. Three nested transforms keep concerns separate:
 *   1. entrance  — fade + 30px rise
 *   2. offset    — cursor parallax + lean toward the hovered insight (motion values)
 *   3. idle      — breathing + ~1° sway, only after the entrance settles
 * The PNG is only ever translated/rotated, never scaled on one axis.
 */
export function Character({ image, show, settled, reduced, offsetX, offsetY, tilt, style }) {
  const idle = settled && !reduced
  const shadowX = useTransform(offsetX, (v) => v * -0.5)

  return (
    <motion.div
      style={{ position: 'absolute', ...style }}
      initial={{ opacity: 0, y: reduced ? 0 : 30 }}
      animate={show ? { opacity: 1, y: 0 } : { opacity: 0, y: reduced ? 0 : 30 }}
      transition={{ ...timing.figure, duration: reduced ? 0.3 : timing.figure.duration, ease }}
    >
      {/* Ground shadow */}
      <motion.div
        aria-hidden
        style={{
          position: 'absolute',
          left: '30%',
          width: '44%',
          top: '95.5%',
          height: '4.5%',
          borderRadius: '50%',
          background: 'rgba(40, 28, 16, 0.22)',
          filter: 'blur(10px)',
          x: shadowX,
        }}
        animate={idle ? { scaleX: [1, 0.94, 1], opacity: [1, 0.78, 1] } : { scaleX: 1, opacity: 1 }}
        transition={idle ? { duration: 4.2, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.4 }}
      />

      <motion.div style={{ x: offsetX, y: offsetY, rotate: tilt, transformOrigin: '50% 100%' }}>
        <motion.div
          style={{ transformOrigin: '50% 100%' }}
          animate={
            idle
              ? {
                  y: [0, -motionScale.breathe, 0],
                  rotate: [0, motionScale.sway, 0, -motionScale.sway, 0],
                }
              : { y: 0, rotate: 0 }
          }
          transition={
            idle
              ? {
                  y: { duration: 4.2, repeat: Infinity, ease: 'easeInOut' },
                  rotate: { duration: 9, repeat: Infinity, ease: 'easeInOut' },
                }
              : { duration: 0.4 }
          }
        >
          <img
            src={image.src}
            alt={image.alt}
            draggable={false}
            style={{ display: 'block', width: '100%', height: 'auto', userSelect: 'none' }}
          />
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
