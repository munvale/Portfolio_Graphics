/**
 * The wide composition, in px at 1:1. The whole stage scales down uniformly
 * (type included) when the container is narrower than W, so nothing can
 * collide; below `mobileBreakpoint` the stacked layout takes over.
 *
 * Insight blocks:
 *   side: 'left'  → block sits left of Ashley; `x` is its RIGHT edge.
 *   side: 'right' → block sits right of Ashley; `x` is its LEFT edge.
 *   `y` is the top of the label, `tilt` a slight hand-placed rotation,
 *   `bow` how much the connector curves.
 *   `anchor` (optional) overrides the insight's anchor on the character.
 */
export const stage = {
  W: 900,
  H: 724,
  blockWidth: 262,
  figure: { cx: 450, top: 14, height: 624 },
  name: { cx: 450, y: 646 },
  insights: {
    change: { side: 'left', x: 300, y: 14, tilt: -2, bow: 0.14 },
    performance: { side: 'left', x: 306, y: 300, tilt: 1.2, bow: -0.12 },
    moving: { side: 'left', x: 334, y: 474, tilt: -1.2, bow: 0.14 },
    visibility: { side: 'right', x: 612, y: 88, tilt: 1.6, bow: -0.14 },
    multistore: { side: 'right', x: 600, y: 398, tilt: -1.4, bow: 0.12 },
  },
}

/** Figure box (left/top/width/height) in stage px, from its height + image aspect. */
export function figureBox(layout, image) {
  const { cx, top, height } = layout.figure
  const width = height * image.aspect
  return { left: cx - width * image.figureCenterX, top, width, height }
}

/** Where an insight's connector leaves its text block, in stage px. */
export function blockPoint(slot) {
  const gap = 14
  return { x: slot.side === 'left' ? slot.x + gap : slot.x - gap, y: slot.y + 15 }
}
