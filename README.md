# Portfolio Graphics

## `AshleyPersona`

Editorial "player-select" persona for the Pizza Hut Store Administration case study.

```bash
npm install
npm run dev
```

```jsx
import AshleyPersona from './components/AshleyPersona'

<AshleyPersona />                                 // defaults from personaData.js
<AshleyPersona imageSrc="/other-character.png" /> // swap the character
```

### Where to edit

| File | What |
| --- | --- |
| `personaData.js` | All copy, the image, and where each connector lands on the character (`anchor`, 0–1 of the PNG). |
| `layouts.js` | Desktop + tablet stage coordinates (block positions, quote, name, status). |
| `tokens.js` | Colours, the two type styles, entrance timing, idle/hover amplitudes, breakpoints. |
| `PersonaMobile.jsx` | Mobile composition (single column, not a shrunk stage). |

### Behaviour

- **Entrance** (~1.9s) starts when ~30% of the section is visible: Ashley rises 30px → name → hand-drawn connectors → staggered facts → status dot switches on.
- **Idle**: 3px breathing, ±0.5° sway, shadow breathing, cursor parallax. The PNG is only translated/rotated.
- **Hover / focus** an insight: its connector turns red and thickens, the others dim, and Ashley leans toward it. Connectors are recomputed from her offset so they stay attached.
- **Layout** is chosen from the component's own width (mobile < 720, tablet < 1024).
- **`prefers-reduced-motion`**: short fades only; no rise, drawing, idle loop, parallax or lean.

### Framer

All styling is inline and the layout switches on the component's measured width, so the folder can be pasted into a Framer Code Component: export `AshleyPersona` as default, replace the PNG import with a `ControlType.Image` prop passed to `imageSrc`, and load Inter + Bricolage Grotesque through Framer's font settings instead of `index.html`.
