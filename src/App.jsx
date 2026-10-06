import AshleyPersona from './components/AshleyPersona'
import { colors, type } from './components/AshleyPersona/tokens'

/** Demo page: a lead-in block so the in-view entrance can be seen on scroll. */
export default function App() {
  return (
    <main style={{ background: colors.paper, minHeight: '100vh', margin: 0 }}>
      <style>{`html, body { margin: 0; background: ${colors.paper}; } *, *::before, *::after { box-sizing: border-box; }`}</style>
      <header style={{ maxWidth: 1200, margin: '0 auto', padding: '96px 16px 48px', minHeight: '70vh' }}>
        <p style={{ ...type.body, margin: 0 }}>Case study · Store Administration Platform</p>
        <h1 style={{ ...type.title, margin: '8px 0 0' }}>Who we designed for</h1>
        <p style={{ ...type.body, margin: '8px 0 0', maxWidth: 520 }}>
          Above-store leaders run several restaurants at once. Scroll to meet Ashley.
        </p>
      </header>
      <AshleyPersona />
      <div style={{ height: '40vh' }} />
    </main>
  )
}
