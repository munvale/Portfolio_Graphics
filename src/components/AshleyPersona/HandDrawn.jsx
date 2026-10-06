/** Draw-on transition for a path, collapsed to a fade under reduced motion. */
export function drawOn(show, reduced, delay, duration) {
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
      pathLength: { delay, duration, ease: [0.22, 1, 0.36, 1] },
      opacity: { delay, duration: 0.01 },
    },
  }
}
