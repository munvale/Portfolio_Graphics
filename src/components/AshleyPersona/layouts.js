/**
 * Stage compositions for the wide breakpoints, in design units.
 * The stage keeps its aspect ratio (W × H) and scales with its container, so
 * every coordinate below maps 1:1 onto the connector SVG's viewBox.
 *
 * Insight blocks:
 *   side: 'left'  → block sits left of Ashley; `x` is its RIGHT edge.
 *   side: 'right' → block sits right of Ashley; `x` is its LEFT edge.
 *   `y` is the top of the label.
 *   `anchor` (optional) overrides the insight's anchor on the character.
 *
 * Mobile does not use a stage — see PersonaMobile.jsx.
 */
export const layouts = {
  desktop: {
    W: 1200,
    H: 820,
    blockWidth: 250,
    figure: { cx: 600, top: 60, height: 540 },
    quote: { x: 48, y: 48, width: 380 },
    name: { cx: 600, y: 612 },
    status: { y: 770 },
    insights: {
      coaching: { side: 'right', x: 820, y: 70, bow: -0.05 },
      visibility: { side: 'right', x: 850, y: 232, bow: 0.06 },
      locations: { side: 'right', x: 800, y: 400, bow: -0.07 },
      moving: { side: 'right', x: 880, y: 566, bow: 0.1, anchor: { x: 0.585, y: 0.945 } },
      performance: { side: 'left', x: 400, y: 404, bow: 0.08 },
    },
  },

  tablet: {
    W: 768,
    H: 1040,
    blockWidth: 190,
    figure: { cx: 400, top: 250, height: 520 },
    quote: { x: 40, y: 32, width: 560 },
    name: { cx: 384, y: 790 },
    status: { y: 980 },
    insights: {
      coaching: { side: 'right', x: 560, y: 252, bow: -0.06 },
      visibility: { side: 'right', x: 568, y: 420, bow: 0.06 },
      locations: { side: 'right', x: 552, y: 590, bow: -0.07 },
      performance: { side: 'left', x: 210, y: 400, bow: 0.08 },
      moving: { side: 'left', x: 222, y: 640, bow: -0.06 },
    },
  },
}

/** Figure box (left/top/width/height) in stage units, from its height + image aspect. */
export function figureBox(layout, image) {
  const { cx, top, height } = layout.figure
  const width = height * image.aspect
  return { left: cx - width * image.figureCenterX, top, width, height }
}

/** Where an insight's connector meets the character, in stage units. */
export function anchorPoint(box, anchor) {
  return { x: box.left + anchor.x * box.width, y: box.top + anchor.y * box.height }
}

/** Where an insight's connector leaves its text block, in stage units. */
export function blockPoint(slot) {
  const gap = 14
  return { x: slot.side === 'left' ? slot.x + gap : slot.x - gap, y: slot.y + 15 }
}
