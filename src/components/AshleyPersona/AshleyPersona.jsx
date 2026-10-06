import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useInView, useMotionValue, useReducedMotion } from 'motion/react'
import { ashleyPersona } from './personaData'
import { stage } from './layouts'
import { PersonaStage } from './PersonaStage'
import { PersonaMobile } from './PersonaMobile'
import { useLiveFigure } from './useLiveFigure'
import { mobileBreakpoint, timing } from './tokens'

/**
 * Ashley Rodriguez — an animated, transparent persona graphic to drop into an
 * existing section. No background, padding or surrounding copy: the host
 * page supplies those.
 *
 * Props
 *   persona   – copy + image + anchors (defaults to personaData.js)
 *   imageSrc  – quick override for the character PNG
 *   style     – merged onto the root element
 *
 * Fills its container's width. Up to `stage.W` (900px) wide it renders 1:1;
 * narrower, the whole graphic scales down uniformly; below
 * `mobileBreakpoint` it switches to a stacked layout.
 */
export default function AshleyPersona({ persona = ashleyPersona, imageSrc, style, className }) {
  const data = imageSrc ? { ...persona, image: { ...persona.image, src: imageSrc } } : persona

  const ref = useRef(null)
  const width = useElementWidth(ref)
  const mobile = width < mobileBreakpoint
  const scale = Math.min(1, width / stage.W)

  const reduced = useReducedMotion() ?? false
  // ~30% visible; the stacked mobile layout is tall, so it triggers earlier.
  const inView = useInView(ref, { once: true, amount: mobile ? 0.15 : 0.3 })

  const [settled, setSettled] = useState(false)
  useEffect(() => {
    if (!inView) return
    const id = setTimeout(() => setSettled(true), reduced ? 0 : timing.settle * 1000)
    return () => clearTimeout(id)
  }, [inView, reduced])

  // Cursor position across the graphic, −1…1 on each axis.
  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)
  const live = useLiveFigure({ settled, reduced, pointer: { x: pointerX, y: pointerY } })

  const onPointerMove = (e) => {
    if (reduced || e.pointerType !== 'mouse' || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    pointerX.set(Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width) * 2 - 1)))
    pointerY.set(Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height) * 2 - 1)))
  }
  const onPointerLeave = () => {
    pointerX.set(0)
    pointerY.set(0)
  }

  return (
    <div
      ref={ref}
      className={className}
      role="group"
      aria-label={`${data.name}, ${data.role}`}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      style={{ position: 'relative', width: '100%', ...style }}
    >
      {mobile ? (
        <PersonaMobile persona={data} show={inView} settled={settled} reduced={reduced} live={live} />
      ) : (
        <div style={{ position: 'relative', width: '100%', height: stage.H * scale }}>
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: 0,
              width: stage.W,
              height: stage.H,
              transform: `translateX(-50%) scale(${scale})`,
              transformOrigin: '50% 0',
            }}
          >
            <PersonaStage persona={data} layout={stage} show={inView} settled={settled} reduced={reduced} live={live} />
          </div>
        </div>
      )}
    </div>
  )
}

const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect

function useElementWidth(ref) {
  const [width, setWidth] = useState(stage.W)
  useIsoLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const measure = () => setWidth(el.getBoundingClientRect().width)
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [ref])
  return width
}
