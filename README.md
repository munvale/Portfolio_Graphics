# Portfolio Graphics

## `AshleyPersona`

Transparent, animated persona graphic for the Pizza Hut Store Administration case study. It has no background, padding or surrounding copy: drop it into an existing section and the host supplies those.

```bash
npm install
npm run dev
```

```jsx
import AshleyPersona from './components/AshleyPersona'

<AshleyPersona />                                 // defaults from personaData.js
<AshleyPersona imageSrc="/other-character.png" /> // swap the character
```

### Sizing

Fills its container's width. At 900px or wider it renders 1:1 (900 × 724, centred). Narrower, the whole graphic scales down uniformly, type included. Below 600px it switches to a stacked layout.

### Where to edit

| File | What |
| --- | --- |
| `personaData.js` | Copy, the image, each annotation's anchor on the character (0–1 of the PNG) and its doodle (`mark`). |
| `layouts.js` | Annotation positions, tilt and connector curve. |
| `tokens.js` | Colours, the two type styles, entrance timing, idle/hover amplitudes and periods. |
| `PersonaMobile.jsx` | Stacked narrow layout. |

### Motion

- **Entrance** (~1.8s) when ~30% is visible: Ashley rises 30px → name → connectors draw → annotations stagger in → doodles.
- **Idle**, built from independent loops with unrelated periods: 7px float (3.6s), ±1° sway (7.2s), 1 → 1.015 scale (4.4s), a shadow that tightens as she rises, and cursor parallax (14 × 8px; annotations counter-shift).
- **Pinned doodles** ride with her: pulsing red arcs at the phone, motion lines trailing her sneakers. Connector loops occasionally redraw; connector curves slowly breathe; annotations drift 2–3px on their own clocks.
- **Hover / focus** an annotation: it shifts 5px outward and scales up slightly, its connector turns red, the others dim, and Ashley leans toward it.
- **`prefers-reduced-motion`**: short fades only; no rise, idle loops, parallax, drift or lean.

### Framer

All styling is inline and layout follows the component's measured width, so the folder can be pasted into a Framer Code Component: export `AshleyPersona` as default, replace the PNG import with a `ControlType.Image` prop passed to `imageSrc`, and load Inter + Bricolage Grotesque through Framer's font settings instead of `index.html`.
