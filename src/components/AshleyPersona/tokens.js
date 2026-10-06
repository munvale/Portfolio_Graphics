/** Visual + motion tokens. Two typefaces only: Bricolage Grotesque and Inter. */

export const colors = {
  paper: '#F7F4EE', // warm off-white
  ink: '#000000',
  body: '#666666',
  line: '#1A1A1A',
  rule: 'rgba(0, 0, 0, 0.12)',
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
  // Same face + weight, scaled up for the name and hero insight.
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

/** Entrance choreography, in seconds. Whole sequence lands at ~1.9s. */
export const timing = {
  figure: { delay: 0, duration: 0.7 },
  name: { delay: 0.4, duration: 0.5 },
  quote: { delay: 0.5, duration: 0.6 },
  connectors: { delay: 0.75, stagger: 0.09, duration: 0.55 },
  facts: { delay: 0.9, stagger: 0.09, duration: 0.45 },
  status: { delay: 1.5, duration: 0.4 },
  settle: 1.9, // idle motion starts here
}

export const ease = [0.22, 1, 0.36, 1]

/** Idle + interaction amplitudes, in px / degrees. */
export const motionScale = {
  breathe: 3, // vertical px
  sway: 0.5, // ± degrees (≈1° total)
  parallax: { x: 8, y: 5 },
  hoverShift: 10,
  hoverTilt: 0.8,
}

export const breakpoints = { mobile: 720, tablet: 1024 }
