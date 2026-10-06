import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useInView, useMotionValue, useReducedMotion } from 'motion/react'
import { ashleyPersona } from './personaData'
import { layouts } from './layouts'
import { PersonaStage } from './PersonaStage'
import { PersonaMobile } from './PersonaMobile'
import { breakpoints, colors, timing } from './tokens'

const MAX_WIDTH = 1200

/**
 * Ashley Rodriguez — a living operational persona.
 *
 * Props
 *   persona   – copy + image + anchors (defaults to personaData.js)
 *   imageSrc  – quick override for the character PNG
 *   style     – merged onto the outer <section>
 *
 * Layout is chosen from the component's own width (not the viewport), so it
 * behaves the same inside a page column or a Framer frame.
 */
export default function AshleyPersona({ persona = ashleyPersona, imageSrc, style, className }) {
  const data = imageSrc ? { ...persona, image: { ...persona.image, src: imageSrc } } : persona

  const ref = useRef(null)
  const width = useElementWidth(ref)
  const mode = width < breakpoints.mobile ? 'mobile' : width < breakpoints.tablet ? 'tablet' : 'desktop'
  const gutter = mode === 'mobile' ? 16 : 32
  const stageWidth = Math.min(width - gutter * 2, MAX_WIDTH)

  const reduced = useReducedMotion() ?? false
  // ~30% visible on wide layouts; the mobile column is long, so it triggers earlier.
  const inView = useInView(ref, { once: true, amount: mode === 'mobile' ? 0.12 : 0.3 })

  const [settled, setSettled] = useState(false)
  useEffect(() => {
    if (!inView) return
    const id = setTimeout(() => setSettled(true), reduced ? 0 : timing.settle * 1000)
    return () => clearTimeout(id)
  }, [inView, reduced])

  // Cursor position across the section, −1…1 on each axis.
  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)
  const onPointerMove = (e) => {
    if (reduced || e.pointerType !== 'mouse' || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    pointerX.set(((e.clientX - r.left) / r.width) * 2 - 1)
    pointerY.set(((e.clientY - r.top) / r.height) * 2 - 1)
  }
  const onPointerLeave = () => {
    pointerX.set(0)
    pointerY.set(0)
  }

  return (
    <section
      ref={ref}
      className={className}
      aria-label={`Persona: ${data.name}, ${data.role}`}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      style={{
        background: colors.paper,
        padding: mode === 'mobile' ? `56px ${gutter}px 48px` : `72px ${gutter}px 64px`,
        overflow: 'hidden',
        ...style,
      }}
    >
      <div style={{ maxWidth: MAX_WIDTH, margin: '0 auto' }}>
        {mode === 'mobile' ? (
          <PersonaMobile persona={data} show={inView} settled={settled} reduced={reduced} />
        ) : (
          <PersonaStage
            persona={data}
            layout={layouts[mode]}
            stageWidth={stageWidth}
            show={inView}
            settled={settled}
            reduced={reduced}
            pointer={{ x: pointerX, y: pointerY }}
          />
        )}
      </div>
    </section>
  )
}

const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect

function useElementWidth(ref) {
  const [width, setWidth] = useState(() => (typeof window === 'undefined' ? MAX_WIDTH : window.innerWidth))
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

