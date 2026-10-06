import ashleyImage from '../../assets/ashley-rodriguez.png'

/**
 * All persona copy lives here. Edit text freely — layout and animation
 * read from this object and do not hard-code any strings.
 *
 * `anchor` is where an insight's connector lands on the character, in
 * normalized image coordinates (0–1 of the PNG's width/height). If you swap
 * the image, re-point these to the matching props (phone, tablet, keys…).
 *
 * `mark` is the small hand-drawn doodle that sits beside the label:
 *   'cycle' | 'rise' | 'tally' | 'speed' (by her sneakers) | 'buzz' (by her phone)
 */
export const ashleyPersona = {
  image: {
    src: ashleyImage,
    alt: 'Ashley Rodriguez, an Area Coach in a black Pizza Hut polo, walking while checking her phone with a tablet under her arm.',
    // Intrinsic width / height of the PNG. Keeps the box from ever distorting it.
    aspect: 1024 / 1536,
    // Horizontal centre of the figure inside the PNG (0–1), used to centre her visually.
    figureCenterX: 0.53,
  },

  name: 'ASHLEY RODRIGUEZ',
  role: 'AREA COACH · MULTI-UNIT OPERATIONS',

  insights: [
    {
      id: 'multistore',
      label: 'MULTI-STORE OPERATIONS',
      description: 'Keeps multiple locations running smoothly',
      anchor: { x: 0.61, y: 0.51 }, // store keys
      mark: 'tally',
    },
    {
      id: 'change',
      label: 'CONSTANT CHANGE',
      description: 'Staffing · inventory · weather · promos',
      anchor: { x: 0.4, y: 0.1 }, // head
      mark: 'cycle',
    },
    {
      id: 'performance',
      label: 'PERFORMANCE',
      description: 'Sales · labor · availability · operations',
      anchor: { x: 0.36, y: 0.37 }, // tablet
      mark: 'rise',
    },
    {
      id: 'moving',
      label: 'ALWAYS MOVING',
      description: 'Makes decisions across locations',
      anchor: { x: 0.4, y: 0.885 }, // sneakers
      mark: 'speed',
    },
    {
      id: 'visibility',
      label: 'NEEDS VISIBILITY',
      description: 'What changed? Where? What needs attention?',
      anchor: { x: 0.74, y: 0.28 }, // phone
      mark: 'buzz',
    },
  ],
}
