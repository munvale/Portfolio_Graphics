/** Visual + motion tokens. Two typefaces only: Bricolage Grotesque and Inter. */

export const colors = {
  ink: '#000000',
  body: '#666666',
  line: '#1A1A1A',
  accent: '#E4002B', // Pizza Hut red — use sparingly
}

const display = "'Bricolage Grotesque', ui-sans-serif, system-ui, sans-serif"
const text = "'Inter', ui-sans-serif, system-ui, sans-serif"

export const type = {
  // Titles / headings (spec)
  title: {
    fontFamily: display,
    fontWeight: 600,
    fontSize: 24,
    lineHeight: '30px',
    letterSpacing: '-0.01em',
    color: colors.ink,
  },
  // Same face + weight, scaled up for Ashley's name.
  display: {
    fontFamily: display,
    fontWeight: 600,
    fontSize: 40,
    lineHeight: '44px',
    letterSpacing: '-0.01em',
    color: colors.ink,
  },
  // Body / small text (spec)
  body: {
    fontFamily: text,
    fontWeight: 400,
    fontSize: 14,
    lineHeight: '21px',
    letterSpacing: '0em',
    color: colors.body,
  },
}

/** Annotation descriptions sit back behind their labels. */
export const descriptionOpacity = 0.78

/** Entrance choreography, in seconds. Whole sequence lands at ~1.8s. */
export const timing = {
  figure: { delay: 0, duration: 0.7 },
  name: { delay: 0.4, duration: 0.5 },
  connectors: { delay: 0.7, stagger: 0.09, duration: 0.55 },
  facts: { delay: 0.85, stagger: 0.09, duration: 0.45 },
  settle: 1.8, // idle motion fades in from here
}

export const ease = [0.22, 1, 0.36, 1]

/**
 * Idle + interaction amplitudes (px, degrees, scale) and periods (seconds).
 * Periods are deliberately unrelated so the loops never sync into one "bob".
 */
export const motionScale = {
  float: 7, // px up/down
  floatPeriod: 3.6,
  sway: 1, // ± degrees
  swayPeriod: 7.2,
  breathe: 0.015, // 1 → 1.015
  breathePeriod: 4.4,
  parallax: { x: 14, y: 8 }, // Ashley, px at the section edge
  annotationParallax: { x: -4, y: -3 }, // annotations drift the other way
  drift: 2.5, // annotation idle drift, px
  lean: 12, // Ashley leans toward the hovered insight, px
  leanTilt: 1, // degrees
  insightShift: 5, // hovered insight moves outward, px
}

/** Below this component width the stacked mobile layout is used. */
export const mobileBreakpoint = 600
