import ashleyImage from '../../assets/ashley-rodriguez.png'

/**
 * All persona copy lives here. Edit text freely — layout and animation
 * read from this object and do not hard-code any strings.
 *
 * `anchor` is where an insight's connector lands on the character, in
 * normalized image coordinates (0–1 of the PNG's width/height). If you swap
 * the image, re-point these to the matching props (phone, tablet, keys…).
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

  eyebrow: 'Persona 01 · Above-store',
  name: 'ASHLEY RODRIGUEZ',
  role: 'AREA COACH · MULTI-UNIT OPERATIONS',

  heroInsight: {
    kicker: 'Synthesized insight',
    text: '“I need to know where my attention is needed.”',
    // Word that receives the hand-drawn underline (first match).
    emphasis: 'attention',
    note: 'Synthesized from field research — not a verbatim quote.',
  },

  insights: [
    {
      id: 'locations',
      label: '8 LOCATIONS',
      // Characters in the label that get a hand-drawn circle (first match).
      circle: '8',
      description: 'Oversees multiple restaurants across her market',
      anchor: { x: 0.61, y: 0.51 }, // store keys
    },
    {
      id: 'coaching',
      label: 'COACHES RGMs',
      description: 'Supports restaurant leaders across locations',
      anchor: { x: 0.6, y: 0.06 }, // head
    },
    {
      id: 'performance',
      label: 'PERFORMANCE',
      description: 'Tracks sales, labor, inventory and operational health',
      anchor: { x: 0.36, y: 0.37 }, // tablet
    },
    {
      id: 'moving',
      label: 'ALWAYS MOVING',
      description: 'Makes decisions while moving between stores',
      anchor: { x: 0.4, y: 0.885 }, // sneakers
    },
    {
      id: 'visibility',
      label: 'NEEDS VISIBILITY',
      description: 'Has to know which location needs attention now',
      anchor: { x: 0.74, y: 0.28 }, // phone
    },
  ],

  status: {
    text: 'MULTI-UNIT OPERATOR / 8 STORES / STATUS: ALWAYS ON',
  },
}
